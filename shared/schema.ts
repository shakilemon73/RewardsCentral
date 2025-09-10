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
  provider?: string;
  external_url?: string;
  is_iframe?: boolean;
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
  
  // Basic Demographics (existing)
  birthday?: string; // YYYY-MM-DD format
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  country_code?: string; // ISO 3166-1 alpha-2 (US, CA, GB, etc.)
  zip_code?: string;
  phone_number?: string;
  
  // Enhanced Demographics (Survey Junkie/Swagbucks style)
  education_level?: 'high_school' | 'some_college' | 'bachelor' | 'master' | 'doctorate';
  employment_status?: 'employed_full_time' | 'employed_part_time' | 'self_employed' | 'unemployed' | 'student' | 'retired';
  occupation_category?: 'professional' | 'management' | 'service' | 'sales' | 'education' | 'healthcare' | 'retired' | 'student' | 'other';
  household_income?: 'under_25k' | '25k_50k' | '50k_75k' | '75k_100k' | '100k_150k' | 'over_150k' | 'prefer_not_to_say';
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'domestic_partnership';
  children_count?: '0' | '1' | '2' | '3' | '4_or_more';
  
  // Survey Preferences
  preferred_survey_length?: 'short' | 'medium' | 'long' | 'any';
  interests?: string[]; // General interests for survey matching
  
  // Lifestyle and Behavioral Targeting (Survey Junkie style)
  health_interests?: string[]; // ['fitness', 'nutrition', 'mental_health', 'supplements', 'medical_devices']
  shopping_habits?: 'online_primarily' | 'in_store_primarily' | 'mixed' | 'budget_conscious' | 'brand_loyal';
  technology_usage?: 'early_adopter' | 'mainstream' | 'late_adopter' | 'minimal_user';
  travel_frequency?: 'never' | 'rarely' | 'few_times_year' | 'monthly' | 'weekly';
  
  // Category Interests for Enhanced Survey Matching
  categories_of_interest?: string[]; // ['automotive', 'food_beverage', 'beauty_personal_care', etc.]
  
  // Profile Completion Tracking
  profile_completion_score?: number;
  last_profile_update?: string;
  
  // Progressive Profile Enhancement (Swagbucks style)
  daily_profile_questions_completed?: number;
  last_daily_questions_date?: string;
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