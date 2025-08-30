// Client-side survey completion handling for Supabase direct API calls
import { supabase } from "@/lib/supabase";
import CryptoJS from 'crypto-js';

export interface SurveyCompletionData {
  userId: string;
  provider: 'cpx' | 'theoremreach' | 'bitlabs' | 'rapidoreach';
  transactionId: string;
  status: 'completed' | 'disqualified' | 'failed';
  points: number;
  surveyId?: string;
  verificationHash?: string;
}

class SurveyPostbackService {
  // Validate CPX Research postback hash
  validateCPXHash(userId: string, transactionId: string, status: string, amount: string, providedHash: string, apiKey: string): boolean {
    // CPX Research hash format: MD5(user_id + transaction_id + status + amount + api_key)
    const hashString = `${userId}${transactionId}${status}${amount}${apiKey}`;
    const expectedHash = CryptoJS.MD5(hashString).toString();
    return expectedHash === providedHash;
  }

  // Validate TheoremReach postback hash
  validateTheoremReachHash(userId: string, transactionId: string, result: string, reward: string, providedHash: string, secretKey: string): boolean {
    // TheoremReach hash format: SHA3-256(user_id + transaction_id + result + reward + secret_key)
    const hashString = `${userId}${transactionId}${result}${reward}${secretKey}`;
    const expectedHash = CryptoJS.SHA3(hashString, { outputLength: 256 }).toString();
    return expectedHash === providedHash;
  }

  // Validate BitLabs postback hash
  validateBitLabsHash(callbackUrl: string, providedHash: string, secretKey: string): boolean {
    // BitLabs uses HMAC-SHA1 for callback validation
    const urlWithoutHash = callbackUrl.split('&hash=')[0];
    const expectedHash = CryptoJS.HmacSHA1(urlWithoutHash, secretKey).toString();
    return expectedHash === providedHash;
  }
  // Handle URL-based postback from survey providers
  async handleUrlPostback(): Promise<SurveyCompletionData | null> {
    const urlParams = new URLSearchParams(window.location.search);
    
    // CPX Research postback parameters with hash validation
    if (urlParams.has('cpx_transaction_id')) {
      const status = urlParams.get('cpx_status') === 'completed' ? 'completed' : 'failed';
      const amount = urlParams.get('cpx_amount') || '0';
      const userId = urlParams.get('cpx_user_id') || '';
      const transactionId = urlParams.get('cpx_transaction_id') || '';
      const providedHash = urlParams.get('cpx_hash') || '';
      
      // Validate hash for security (in production, use actual API key)
      const apiKey = import.meta.env.VITE_CPX_RESEARCH_API_KEY || '7782a3da8da9d1f4f0d2a9f9b9c0c611';
      const isValidHash = this.validateCPXHash(userId, transactionId, status, amount, providedHash, apiKey);
      
      if (!isValidHash && providedHash) {
        console.warn('CPX Research hash validation failed - possible security issue');
        return null;
      }
      
      return {
        userId,
        provider: 'cpx',
        transactionId,
        status,
        points: Math.round(parseFloat(amount) * 100), // Convert dollars to points
        verificationHash: providedHash
      };
    }
    
    // BitLabs postback parameters with HMAC validation
    if (urlParams.has('bitlabs_type') || urlParams.has('uid')) {
      const type = urlParams.get('bitlabs_type') || urlParams.get('type');
      const status = type === 'COMPLETE' ? 'completed' : 
                   type === 'SCREENOUT' ? 'disqualified' : 'failed';
      const reward = parseInt(urlParams.get('bitlabs_reward') || urlParams.get('val') || '0');
      const userId = urlParams.get('bitlabs_user_id') || urlParams.get('uid') || '';
      const transactionId = urlParams.get('bitlabs_survey_id') || urlParams.get('tx') || '';
      const providedHash = urlParams.get('bitlabs_hash') || urlParams.get('hash') || '';
      
      // Validate BitLabs callback hash (in production, use actual secret key)
      const secretKey = import.meta.env.VITE_BITLABS_SECRET_KEY || 'demo_secret_key';
      const callbackUrl = window.location.href;
      const isValidHash = this.validateBitLabsHash(callbackUrl, providedHash, secretKey);
      
      if (!isValidHash && providedHash) {
        console.warn('BitLabs hash validation failed - possible security issue');
        return null;
      }
      
      return {
        userId,
        provider: 'bitlabs',
        transactionId,
        status,
        points: status === 'disqualified' ? Math.round(reward * 0.1) : reward,
        verificationHash: providedHash
      };
    }
    
    // TheoremReach postback parameters with SHA3-256 validation
    if (urlParams.has('tr_result')) {
      const result = urlParams.get('tr_result') || '0';
      const reward = urlParams.get('tr_reward') || '100';
      const userId = urlParams.get('tr_user_id') || '';
      const transactionId = urlParams.get('tr_transaction_id') || '';
      const providedHash = urlParams.get('tr_hash') || '';
      const status = parseInt(result) === 10 ? 'completed' : 'disqualified';
      
      // Validate TheoremReach hash (in production, use actual secret key)
      const secretKey = import.meta.env.VITE_THEOREMREACH_SECRET_KEY || 'demo_secret_key';
      const isValidHash = this.validateTheoremReachHash(userId, transactionId, result, reward, providedHash, secretKey);
      
      if (!isValidHash && providedHash) {
        console.warn('TheoremReach hash validation failed - possible security issue');
        return null;
      }
      
      return {
        userId,
        provider: 'theoremreach',
        transactionId,
        status,
        points: status === 'disqualified' ? 10 : parseInt(reward),
        verificationHash: providedHash
      };
    }
    
    // RapidoReach postback parameters
    if (urlParams.has('rapidoreach_status')) {
      const status = urlParams.get('rapidoreach_status') === 'complete' ? 'completed' : 
                   urlParams.get('rapidoreach_status') === 'screenout' ? 'disqualified' : 'failed';
      const reward = parseInt(urlParams.get('rapidoreach_reward') || '0');
      
      return {
        userId: urlParams.get('rapidoreach_user_id') || '',
        provider: 'rapidoreach',
        transactionId: urlParams.get('rapidoreach_transaction_id') || '',
        status,
        points: status === 'disqualified' ? Math.round(reward * 0.2) : reward,
        surveyId: urlParams.get('rapidoreach_survey_id') || undefined
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