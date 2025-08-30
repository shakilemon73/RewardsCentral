import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          console.log('Fetching user data for:', session.user.id);
          // Try to get existing user or create new one
          let { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          console.log('User fetch result:', userData ? 'Found user' : 'No user found', error?.code);
          
          // If user doesn't exist, create them
          if (error && error.code === 'PGRST116') {
            console.log('Creating new user record...');
            const { data: newUser } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email,
                first_name: session.user.user_metadata?.first_name,
                last_name: session.user.user_metadata?.last_name,
                profile_image_url: session.user.user_metadata?.avatar_url,
                points: 0,
                total_earned: 0,
                tasks_completed: 0
              })
              .select()
              .single();
            userData = newUser;
            console.log('New user created:', userData?.id);
          }
          
          setUser(userData);
          console.log('User state set:', userData?.id);
        }
      } catch (error) {
        // Silent fail on connection errors
        console.warn('Auth session fetch failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        // Try to get existing user or create new one
        let { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        
        // If user doesn't exist, create them
        if (error && error.code === 'PGRST116') {
          const { data: newUser } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name,
              last_name: session.user.user_metadata?.last_name,
              profile_image_url: session.user.user_metadata?.avatar_url,
              points: 0,
              total_earned: 0,
              tasks_completed: 0
            })
            .select()
            .single();
          userData = newUser;
        }
        
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
      
      console.log('Sign in successful, session:', data.session?.user?.id);
      setSession(data.session);
      
      // Auto-create user record if it doesn't exist
      if (data.session?.user) {
        try {
          console.log('Checking for existing user...');
          let { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          console.log('User lookup result:', userData ? 'Found' : 'Not found', userError?.code);
          
          // If user doesn't exist, create them
          if (userError && userError.code === 'PGRST116') {
            console.log('Creating new user...');
            const { data: newUser } = await supabase
              .from('users')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email,
                first_name: data.session.user.user_metadata?.first_name,
                last_name: data.session.user.user_metadata?.last_name,
                profile_image_url: data.session.user.user_metadata?.avatar_url,
                points: 0,
                total_earned: 0,
                tasks_completed: 0
              })
              .select()
              .single();
            userData = newUser;
            console.log('New user created:', userData?.id);
          }
          
          setUser(userData);
          console.log('User set in sign in:', userData?.id);
        } catch (userCreateError) {
          console.warn('User creation failed:', userCreateError);
        }
      }
      
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
      
      // Auto-create user record after successful signup
      if (data.session?.user) {
        try {
          await supabase
            .from('users')
            .insert({
              id: data.session.user.id,
              email: data.session.user.email,
              first_name: data.session.user.user_metadata?.first_name,
              last_name: data.session.user.user_metadata?.last_name,
              profile_image_url: data.session.user.user_metadata?.avatar_url,
              points: 0,
              total_earned: 0,
              tasks_completed: 0
            });
        } catch (userCreateError) {
          console.warn('User record creation failed:', userCreateError);
        }
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
