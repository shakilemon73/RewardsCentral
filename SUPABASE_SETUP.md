# RewardsPay Supabase Setup Guide

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new Supabase project

## Step 1: Get Your Credentials
1. Go to your Supabase project dashboard
2. Click on "Project Settings" (gear icon)
3. Navigate to "API" section
4. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Set Up Replit Secrets
1. In Replit, open the "Secrets" tab (lock icon in left sidebar)
2. Add the following secrets:
   - Key: `VITE_SUPABASE_URL`, Value: Your Project URL
   - Key: `VITE_SUPABASE_ANON_KEY`, Value: Your anon/public key

## Step 3: Run the Database Setup
1. In your Supabase dashboard, go to the "SQL Editor"
2. Create a new query
3. Copy the ENTIRE contents of `supabase_setup.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute the SQL

This will create:
- `users` table for user profiles
- `tasks` table for available tasks
- `user_task_completions` table for tracking completed tasks
- `rewards` table for available rewards
- `user_reward_redemptions` table for tracking redeemed rewards
- `api_configurations` table (optional) for survey provider API keys
- Row Level Security (RLS) policies
- Database functions for secure operations
- Sample data for testing

## Step 4: Verify Setup
1. In Supabase dashboard, go to "Table Editor"
2. You should see tables: users, tasks, user_task_completions, rewards, user_reward_redemptions
3. The `tasks` and `rewards` tables should have sample data

## Step 5: Enable Authentication
1. In Supabase dashboard, go to "Authentication" > "Settings"
2. Enable "Email" provider
3. Configure email templates (optional)
4. Set site URL to your Replit app URL

## Step 6: Test the Application
1. Restart your Replit application
2. Check browser console - you should see "✅ Supabase connected"
3. Try signing up with a test email
4. Check the "users" table in Supabase to see the new user

## Troubleshooting

### "Invalid API key" Error
- Double-check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly in Replit Secrets
- Make sure you copied the full API key (they're very long)
- Verify the Project URL doesn't have trailing slashes

### Authentication Not Working
- Make sure you ran the supabase_setup.sql file completely
- Check that RLS policies are enabled (they're created by the SQL script)
- Verify email authentication is enabled in Supabase settings

### Tables Not Found
- Run the entire supabase_setup.sql file in the SQL Editor
- Check for any SQL errors in the Supabase console

## Optional: Survey Provider Configuration
If you want to use real survey providers (CPX Research, TheoremReach, BitLabs, RapidoReach):
1. Sign up for accounts with survey providers
2. Get API keys from each provider
3. Insert into api_configurations table or use fallback demo keys
