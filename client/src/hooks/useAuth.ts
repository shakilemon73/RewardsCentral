import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/supabase";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          return null;
        }
        return session;
      } catch (error) {
        console.error("Session fetch error:", error);
        return null;
      }
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (error) {
          if (error.code === "PGRST116") {
            // User doesn't exist, create new user
            const newUser = {
              id: session.user.id,
              email: session.user.email,
              points: 0,
              total_earned: 0,
              tasks_completed: 0,
            };
            
            const { data: createdUser, error: createError } = await supabase
              .from("users")
              .insert(newUser)
              .select()
              .single();
              
            if (createError) {
              console.error("User creation error:", createError);
              return null;
            }
            return createdUser as User;
          }
          console.error("User query error:", error);
          return null;
        }
        
        return data as User | null;
      } catch (error) {
        console.error("User fetch error:", error);
        return null;
      }
    },
    enabled: !!session?.user?.id,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Sign in error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      console.error("Sign in mutation error:", error);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      console.error("Sign up mutation error:", error);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        console.error("Sign out error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Sign out mutation error:", error);
    },
  });

  return {
    user,
    session,
    isLoading: sessionLoading || userLoading,
    isAuthenticated: !!session?.user && !!user,
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
  };
}
