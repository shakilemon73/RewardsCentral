import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, User } from '@/lib/supabase';
import type { Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch or create user in database
  const fetchOrCreateUser = async (authUser: any): Promise<User | null> => {
    try {
      // Try to get existing user
      let { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // If user doesn't exist, create them
      if (fetchError && fetchError.code === 'PGRST116') {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            first_name: authUser.user_metadata?.first_name || null,
            last_name: authUser.user_metadata?.last_name || null,
            profile_image_url: authUser.user_metadata?.avatar_url || null,
            points: 0,
            total_earned: 0,
            tasks_completed: 0
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          return null;
        }

        userData = newUser;
      } else if (fetchError) {
        console.error('Error fetching user:', fetchError);
        return null;
      }

      return userData;
    } catch (err) {
      console.error('Error in fetchOrCreateUser:', err);
      return null;
    }
  };

  // Handle session changes
  const handleSessionChange = async (currentSession: Session | null) => {
    setSession(currentSession);

    if (currentSession?.user) {
      const userData = await fetchOrCreateUser(currentSession.user);
      setUser(userData);
    } else {
      setUser(null);
    }

    setIsLoading(false);
  };

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        handleSessionChange(session);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event);

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await handleSessionChange(session);
        } else if (event === 'PASSWORD_RECOVERY') {
          // User clicked password reset link
          setSession(session);
          setIsLoading(false);
        } else {
          await handleSessionChange(session);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      // Note: Session will be set automatically by onAuthStateChange listener
      // if email confirmation is disabled. Otherwise, user needs to confirm email.
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || 'Sign up failed';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Session will be set automatically by onAuthStateChange listener
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || 'Sign in failed';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Sign out
  const signOut = async () => {
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      // State will be cleared automatically by onAuthStateChange listener
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || 'Sign out failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Request password reset email
  const resetPassword = async (email: string) => {
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-reset`,
      });

      if (resetError) {
        throw resetError;
      }
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || 'Password reset request failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update password (used after password reset or for password change)
  const updatePassword = async (newPassword: string) => {
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || 'Password update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
