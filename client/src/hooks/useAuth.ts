import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to fetch or create user data
  const fetchUserData = async (userId: string) => {
    try {
      let { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      // If user doesn't exist, create them
      if (error && error.code === 'PGRST116') {
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: session?.user?.email,
            first_name: session?.user?.user_metadata?.first_name,
            last_name: session?.user?.user_metadata?.last_name,
            profile_image_url: session?.user?.user_metadata?.avatar_url,
            points: 0,
            total_earned: 0,
            tasks_completed: 0
          })
          .select()
          .single();
        userData = newUser;
      }
      
      return userData;
    } catch (error) {
      console.warn('User data fetch failed:', error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        setSession(session);
        
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          if (isMounted) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.warn('Auth initialization failed:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      setSession(session);
      
      if (session?.user) {
        const userData = await fetchUserData(session.user.id);
        if (isMounted) {
          setUser(userData);
        }
      } else {
        if (isMounted) {
          setUser(null);
        }
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message?.includes('fetch') || error.name?.includes('Fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection.');
        }
        throw new Error(error.message || 'Authentication failed');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to sign in. Please check your internet connection and try again.');
    }
  };

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        if (error.message?.includes('fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection.');
        }
        throw new Error(error.message || 'Sign up failed');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to sign up. Please check your internet connection and try again.');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    signIn,
    signUp,
    signOut,
    isSigningIn: isLoading,
    isSigningUp: isLoading,
    isSigningOut: isLoading,
  };
}
