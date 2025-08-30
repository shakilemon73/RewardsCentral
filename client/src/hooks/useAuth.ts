import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Single function to handle session and user data
    const handleSession = async (currentSession: Session | null) => {
      if (!mounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        try {
          // Get or create user
          let { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (error && error.code === 'PGRST116') {
            // Create user if doesn't exist
            const { data: newUser } = await supabase
              .from('users')
              .insert({
                id: currentSession.user.id,
                email: currentSession.user.email,
                first_name: currentSession.user.user_metadata?.first_name,
                last_name: currentSession.user.user_metadata?.last_name,
                profile_image_url: currentSession.user.user_metadata?.avatar_url,
                points: 0,
                total_earned: 0,
                tasks_completed: 0
              })
              .select()
              .single();
            userData = newUser;
          }

          if (mounted) {
            setUser(userData);
          }
        } catch (error) {
          console.warn('User fetch failed:', error);
          if (mounted) {
            setUser(null);
          }
        }
      } else {
        if (mounted) {
          setUser(null);
        }
      }

      if (mounted) {
        setIsLoading(false);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      } else {
        handleSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || 'Authentication failed');
    }

    return data;
  };

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || 'Sign up failed');
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    signIn,
    signUp,
    signOut,
    isSigningIn: false,
    isSigningUp: false,
    isSigningOut: false,
  };
}