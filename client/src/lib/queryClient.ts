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

  // Redeem a reward
  redeemReward: async (userId: string, rewardId: string, pointsCost: number) => {
    // Check if user has enough points first
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("points")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    if (!user || user.points < pointsCost) {
      throw new Error("Insufficient points");
    }

    // Insert redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from("user_reward_redemptions")
      .insert({
        user_id: userId,
        reward_id: rewardId,
        points_spent: pointsCost,
        status: "pending",
      })
      .select()
      .single();

    if (redemptionError) throw redemptionError;

    // Update user points
    const { error: updateError } = await supabase
      .from("users")
      .update({ points: user.points - pointsCost })
      .eq("id", userId);

    if (updateError) throw updateError;
    return redemption;
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<{
    email: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
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

  // Get app statistics for landing page
  getAppStats: async () => {
    // Get user count
    const { count: userCount, error: userError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (userError) throw userError;

    // Get total rewards paid (sum of points_spent converted to dollars)
    const { data: redemptionsData, error: redemptionsError } = await supabase
      .from("user_reward_redemptions")
      .select("points_spent")
      .eq("status", "processed");

    if (redemptionsError) throw redemptionsError;

    const totalRewardsPaid = redemptionsData?.reduce((sum, redemption) => 
      sum + (redemption.points_spent / 100), 0) || 0;

    // Get average task rating
    const { data: tasksData, error: tasksError } = await supabase
      .from("tasks")
      .select("rating")
      .eq("is_active", true);

    if (tasksError) throw tasksError;

    const averageRating = tasksData && tasksData.length > 0 
      ? tasksData.reduce((sum, task) => sum + (task.rating / 10), 0) / tasksData.length
      : 4.8;

    return {
      activeUsers: userCount || 0,
      totalRewardsPaid,
      averageRating: Math.round(averageRating * 10) / 10
    };
  },
};
