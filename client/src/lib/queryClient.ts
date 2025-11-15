import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Supabase helpers for common operations
export const supabaseHelpers = {
  // Get all active tasks
  getTasks: async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Tasks fetch error:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Tasks fetch exception:", error);
      return [];
    }
  },

  // Get all active rewards
  getRewards: async () => {
    try {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("is_active", true)
        .order("points_cost", { ascending: true });
      
      if (error) {
        console.error("Rewards fetch error:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Rewards fetch exception:", error);
      return [];
    }
  },

  // Get user task completions
  getUserTaskCompletions: async (userId: string) => {
    const { data, error } = await supabase
      .from("user_task_completions")
      .select(`
        *,
        task:tasks(*)
      `)
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get user reward redemptions
  getUserRewardRedemptions: async (userId: string) => {
    const { data, error } = await supabase
      .from("user_reward_redemptions")
      .select(`
        *,
        reward:rewards(*)
      `)
      .eq("user_id", userId)
      .order("redeemed_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Complete a task
  completeTask: async (userId: string, taskId: string, pointsEarned: number) => {
    // Start a transaction
    const { data: completion, error: completionError } = await supabase
      .from("user_task_completions")
      .insert({
        user_id: userId,
        task_id: taskId,
        points_earned: pointsEarned,
      })
      .select()
      .single();

    if (completionError) throw completionError;

    // Update user points and tasks completed
    const { error: userError } = await supabase.rpc("update_user_after_task_completion", {
      user_id: userId,
      points_to_add: pointsEarned,
    });

    if (userError) throw userError;
    return completion;
  },

  // Redeem a reward using secure backend function
  redeemReward: async (userId: string, rewardId: string, pointsCost: number) => {
    const { data, error } = await supabase.rpc("redeem_reward_secure", {
      user_id: userId,
      reward_id: rewardId,
      points_cost: pointsCost,
    });

    if (error) throw error;
    
    const result = data;
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return {
      id: result.redemption_id,
      user_id: userId,
      reward_id: rewardId,
      points_spent: pointsCost,
      status: "pending",
      redeemed_at: new Date().toISOString()
    };
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<{
    email: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    birthday: string;
    gender: string;
    country_code: string;
    zip_code: string;
    phone_number: string;
    education_level: string;
    employment_status: string;
    occupation_category: string;
    household_income: string;
    marital_status: string;
    children_count: string;
    preferred_survey_length: string;
    interests: string[];
    health_interests: string[];
    shopping_habits: string;
    technology_usage: string;
    travel_frequency: string;
    categories_of_interest: string[];
  }>) => {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get app statistics using backend function
  getAppStats: async () => {
    const { data, error } = await supabase.rpc("get_app_statistics");
    
    if (error) throw error;
    return data;
  },

  // Get user dashboard stats using backend function
  getUserDashboardStats: async (userId: string) => {
    const { data, error } = await supabase.rpc("get_user_dashboard_stats", {
      user_id: userId,
    });

    if (error) throw error;
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  },
};
