-- RewardsPay Database Schema for Supabase
-- Copy and paste this entire script into your Supabase SQL Editor and run it

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  points INTEGER DEFAULT 0 NOT NULL,
  total_earned INTEGER DEFAULT 0 NOT NULL,
  tasks_completed INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL, -- 'survey', 'ad', 'offer'
  title VARCHAR NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  duration VARCHAR, -- e.g., "15 minutes"
  category VARCHAR, -- e.g., "General audience", "Ages 18-35"
  rating INTEGER DEFAULT 0, -- 1-5 stars * 10 (so 48 = 4.8 stars)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User task completions
CREATE TABLE IF NOT EXISTS user_task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  value VARCHAR NOT NULL, -- e.g., "$10.00"
  category VARCHAR NOT NULL, -- e.g., "gift_card", "paypal"
  brand VARCHAR NOT NULL, -- e.g., "Amazon", "Starbucks"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User reward redemptions
CREATE TABLE IF NOT EXISTS user_reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  status VARCHAR DEFAULT 'pending', -- 'pending', 'processed', 'delivered'
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_task_completions_user_id ON user_task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_task_completions_task_id ON user_task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_user_reward_redemptions_user_id ON user_reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reward_redemptions_reward_id ON user_reward_redemptions(reward_id);
CREATE INDEX IF NOT EXISTS idx_tasks_is_active ON tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_rewards_is_active ON rewards(is_active);

-- Insert sample tasks for testing
INSERT INTO tasks (type, title, description, points, duration, category, rating, is_active) VALUES
('survey', 'Consumer Preferences Survey', 'Share your opinions about everyday products and services', 150, '10 minutes', 'General audience', 45, true),
('survey', 'Travel Habits Survey', 'Tell us about your travel preferences and experiences', 200, '15 minutes', 'Ages 18-65', 42, true),
('ad', 'Watch Advertisement', 'Watch a short video advertisement', 10, '30 seconds', 'All ages', 38, true),
('offer', 'Sign up for Newsletter', 'Subscribe to our partner newsletter', 100, '2 minutes', 'General audience', 40, true),
('survey', 'Food & Dining Survey', 'Share your food preferences and dining habits', 175, '12 minutes', 'Adults 18+', 46, true);

-- Insert sample rewards for testing
INSERT INTO rewards (title, description, points_cost, value, category, brand, is_active) VALUES
('Amazon Gift Card', '$5 Amazon gift card for online shopping', 500, '$5.00', 'gift_card', 'Amazon', true),
('Amazon Gift Card', '$10 Amazon gift card for online shopping', 1000, '$10.00', 'gift_card', 'Amazon', true),
('Amazon Gift Card', '$25 Amazon gift card for online shopping', 2500, '$25.00', 'gift_card', 'Amazon', true),
('Starbucks Gift Card', '$5 Starbucks gift card for coffee and treats', 500, '$5.00', 'gift_card', 'Starbucks', true),
('PayPal Cash', '$5 PayPal cash transfer', 500, '$5.00', 'paypal', 'PayPal', true),
('PayPal Cash', '$10 PayPal cash transfer', 1000, '$10.00', 'paypal', 'PayPal', true),
('Google Play Gift Card', '$10 Google Play credit', 1000, '$10.00', 'gift_card', 'Google Play', true),
('iTunes Gift Card', '$10 iTunes credit', 1000, '$10.00', 'gift_card', 'iTunes', true);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id::text);

-- Tasks are public for reading, but only service role can modify
CREATE POLICY "Anyone can view active tasks" ON tasks FOR SELECT USING (is_active = true);

-- User task completions: users can only see their own completions and insert new ones
CREATE POLICY "Users can view own completions" ON user_task_completions FOR SELECT USING (auth.uid() = user_id::text);
CREATE POLICY "Users can insert own completions" ON user_task_completions FOR INSERT WITH CHECK (auth.uid() = user_id::text);

-- Rewards are public for reading
CREATE POLICY "Anyone can view active rewards" ON rewards FOR SELECT USING (is_active = true);

-- User reward redemptions: users can only see their own redemptions and insert new ones
CREATE POLICY "Users can view own redemptions" ON user_reward_redemptions FOR SELECT USING (auth.uid() = user_id::text);
CREATE POLICY "Users can insert own redemptions" ON user_reward_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id::text);

-- Create function to update user stats after task completion
CREATE OR REPLACE FUNCTION update_user_after_task_completion(
  user_id UUID,
  points_to_add INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET 
    points = points + points_to_add,
    total_earned = total_earned + points_to_add,
    tasks_completed = tasks_completed + 1,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;