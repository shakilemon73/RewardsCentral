import { createClient } from '@supabase/supabase-js'

// Hardcode the values since environment variables aren't loading properly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tzhbpfesfyhhlfpukwkb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6aGJwZmVzZnloaGxmcHVrd2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzEzNTAsImV4cCI6MjA3MjE0NzM1MH0.SmpcxbIGRFEJef4a4uJudjsI-B3qjJPSFl7sXYTnQnE'

// Debug log to verify values are loaded
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key length:', supabaseAnonKey.length)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
})

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