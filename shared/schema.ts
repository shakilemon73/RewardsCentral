// Database schema types for shared use between frontend and backend
export interface Task {
  id: string;
  type: string;
  title: string;
  description?: string;
  points: number;
  duration?: string;
  category?: string;
  rating: number;
  is_active: boolean;
  created_at?: string;
}

export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  points: number;
  total_earned: number;
  tasks_completed: number;
  created_at?: string;
  updated_at?: string;
  // Demographics for survey targeting
  birthday?: string; // YYYY-MM-DD format
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  country_code?: string; // ISO 3166-1 alpha-2 (US, CA, GB, etc.)
  zip_code?: string;
  phone_number?: string;
  // Survey provider preferences
  preferred_survey_length?: 'short' | 'medium' | 'long' | 'any';
  interests?: string[]; // For better survey matching
}

export interface UserTaskCompletion {
  id: string;
  user_id: string;
  task_id: string;
  points_earned: number;
  completed_at?: string;
}

export interface Reward {
  id: string;
  title: string;
  description?: string;
  points_cost: number;
  value: string;
  category: string;
  brand: string;
  is_active: boolean;
  created_at?: string;
}

export interface UserRewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  status: string;
  redeemed_at?: string;
}