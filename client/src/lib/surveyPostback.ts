// Client-side survey completion handling for Supabase direct API calls
import { supabase } from "@/lib/supabase";

export interface SurveyCompletionData {
  userId: string;
  provider: 'cpx' | 'theoremreach' | 'bitlabs';
  transactionId: string;
  status: 'completed' | 'disqualified' | 'failed';
  points: number;
  surveyId?: string;
}

class SurveyPostbackService {
  // Handle URL-based postback from survey providers
  async handleUrlPostback(): Promise<SurveyCompletionData | null> {
    const urlParams = new URLSearchParams(window.location.search);
    
    // CPX Research postback parameters
    if (urlParams.has('cpx_transaction_id')) {
      const status = urlParams.get('cpx_status') === 'completed' ? 'completed' : 'failed';
      const amount = parseFloat(urlParams.get('cpx_amount') || '0');
      
      return {
        userId: urlParams.get('cpx_user_id') || '',
        provider: 'cpx',
        transactionId: urlParams.get('cpx_transaction_id') || '',
        status,
        points: Math.round(amount * 100), // Convert dollars to points
      };
    }
    
    // BitLabs postback parameters  
    if (urlParams.has('bitlabs_type')) {
      const type = urlParams.get('bitlabs_type');
      const status = type === 'COMPLETE' ? 'completed' : 
                   type === 'SCREENOUT' ? 'disqualified' : 'failed';
      const reward = parseInt(urlParams.get('bitlabs_reward') || '0');
      
      return {
        userId: urlParams.get('bitlabs_user_id') || '',
        provider: 'bitlabs',
        transactionId: urlParams.get('bitlabs_survey_id') || '',
        status,
        points: status === 'disqualified' ? Math.round(reward * 0.1) : reward,
      };
    }
    
    // TheoremReach postback parameters
    if (urlParams.has('tr_result')) {
      const result = parseInt(urlParams.get('tr_result') || '0');
      const status = result === 10 ? 'completed' : 'disqualified';
      const reward = parseInt(urlParams.get('tr_reward') || '100');
      
      return {
        userId: urlParams.get('tr_user_id') || '',
        provider: 'theoremreach',
        transactionId: urlParams.get('tr_transaction_id') || '',
        status,
        points: status === 'disqualified' ? 10 : reward,
      };
    }
    
    return null;
  }

  // Process survey completion and award points via Supabase
  async processSurveyCompletion(completionData: SurveyCompletionData): Promise<boolean> {
    try {
      // Get current user data
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('points, total_earned, tasks_completed')
        .eq('id', completionData.userId)
        .single();

      if (fetchError || !user) {
        console.error('User fetch error:', fetchError);
        return false;
      }

      // Update user points and stats
      const { error: updateError } = await supabase
        .from('users')
        .update({
          points: (user.points || 0) + completionData.points,
          total_earned: (user.total_earned || 0) + completionData.points,
          tasks_completed: (user.tasks_completed || 0) + (completionData.status === 'completed' ? 1 : 0)
        })
        .eq('id', completionData.userId);

      if (updateError) {
        console.error('User update error:', updateError);
        return false;
      }

      // Log the completion
      await supabase
        .from('user_task_completions')
        .insert({
          id: crypto.randomUUID(),
          user_id: completionData.userId,
          task_id: `${completionData.provider}_survey_${completionData.transactionId}`,
          points_earned: completionData.points,
          completed_at: new Date().toISOString()
        });

      console.log(`Survey ${completionData.status}: +${completionData.points} points for user ${completionData.userId}`);
      return true;
    } catch (error) {
      console.error('Survey completion processing error:', error);
      return false;
    }
  }

  // Initialize postback listener on app load
  async initializePostbackListener(): Promise<void> {
    // Check for postback parameters on page load
    const completionData = await this.handleUrlPostback();
    
    if (completionData) {
      const success = await this.processSurveyCompletion(completionData);
      
      if (success) {
        // Show success message
        const event = new CustomEvent('survey-completed', {
          detail: completionData
        });
        window.dispatchEvent(event);
        
        // Clean URL parameters
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.toString());
      }
    }
  }
}

export const surveyPostbackService = new SurveyPostbackService();