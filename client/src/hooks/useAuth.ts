import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          // Fetch user data from database
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(userData);
        }
      } catch (error) {
        // Silent fail on connection errors
        console.warn('Auth session fetch failed:', error);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Wrap Supabase call to catch all fetch errors
      let authResult;
      try {
        authResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } catch (fetchError: any) {
        // Catch any fetch errors completely
        console.warn("Connection error during sign in:", fetchError);
        throw new Error('Unable to connect to authentication service. Please check your internet connection.');
      }
      
      const { data, error } = authResult;
      if (error) {
        // Handle specific Supabase auth errors
        if (error.message?.includes('fetch') || error.name?.includes('Fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection.');
        }
        throw new Error(error.message || 'Authentication failed');
      }
      setSession(data.session);
      return data;
    } catch (error) {
      // Don't log errors to prevent overlay
      // Re-throw with user-friendly message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to sign in. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        // Handle specific Supabase auth errors
        if (error.message?.includes('fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection.');
        }
        throw new Error(error.message || 'Sign up failed');
      }
      return data;
    } catch (error) {
      console.error("Sign up error:", error);
      // Re-throw with user-friendly message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to sign up. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
