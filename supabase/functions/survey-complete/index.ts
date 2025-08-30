import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SurveyCompleteRequest {
  userId: string;
  provider: 'rapidoreach' | 'theoremreach' | 'cpx' | 'bitlabs';
  surveyId: string;
  pointsEarned: number;
  taskId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, provider, surveyId, pointsEarned, taskId }: SurveyCompleteRequest = await req.json()

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create a task completion record
    const { data: completion, error: completionError } = await supabase
      .from('user_task_completions')
      .insert({
        user_id: userId,
        task_id: taskId || `${provider}_survey_${surveyId}`,
        points_earned: pointsEarned,
        metadata: {
          provider,
          survey_id: surveyId,
          completed_via: 'survey_provider'
        }
      })
      .select()
      .single()

    if (completionError) {
      throw new Error(`Failed to record completion: ${completionError.message}`)
    }

    // Update user points using the secure backend function
    const { error: updateError } = await supabase.rpc('update_user_after_task_completion', {
      user_id: userId,
      points_to_add: pointsEarned
    })

    if (updateError) {
      throw new Error(`Failed to update user points: ${updateError.message}`)
    }

    // Get updated user stats
    const { data: userStats, error: statsError } = await supabase.rpc('get_user_dashboard_stats', {
      user_id: userId
    })

    if (statsError) {
      console.warn('Failed to get user stats:', statsError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        completion,
        userStats: userStats || null,
        message: `Survey completed! You earned ${pointsEarned} points.`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Survey completion error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})