import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Note: Using placeholder values for development. 
// Add your real Supabase credentials via environment variables for full functionality.

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  profile_image_url?: string
  points: number
  total_earned: number
  tasks_completed: number
  created_at?: string
  updated_at?: string
}

export interface Task {
  id: string
  type: string
  title: string
  description?: string
  points: number
  duration?: string
  category?: string
  rating: number
  is_active: boolean
  created_at?: string
}

export interface UserTaskCompletion {
  id: string
  user_id: string
  task_id: string
  points_earned: number
  completed_at?: string
}

export interface Reward {
  id: string
  title: string
  description?: string
  points_cost: number
  value: string
  category: string
  brand: string
  is_active: boolean
  created_at?: string
}

export interface UserRewardRedemption {
  id: string
  user_id: string
  reward_id: string
  points_spent: number
  status: string
  redeemed_at?: string
}