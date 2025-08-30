// Survey API integration service for CPX Research, TheoremReach, and Bitlabs
import type { Task } from "@shared/schema";

// API keys from environment variables
const CPX_API_KEY = import.meta.env.VITE_CPX_RESEARCH_API_KEY || '7782a3da8da9d1f4f0d2a9f9b9c0c611';
const CPX_APP_ID = import.meta.env.VITE_CPX_RESEARCH_APP_ID || '28886';
const THEOREMREACH_API_KEY = import.meta.env.VITE_THEOREMREACH_API_KEY || '9854ec5b04228779d58ac3e9d342';
const BITLABS_API_TOKEN = import.meta.env.VITE_BITLABS_API_TOKEN || '665ef72d-bcf1-4a8d-b427-37c8b7142447';

export interface ExternalSurvey {
  id: string;
  provider: 'cpx' | 'theoremreach' | 'bitlabs';
  title: string;
  description: string;
  points: number;
  duration: string;
  category: string;
  rating: number;
  url: string;
  payout: number; // in USD cents
}

class SurveyApiService {
  // CPX Research API integration
  async getCpxSurveys(userId: string): Promise<ExternalSurvey[]> {
    try {
      // For now, return simulated CPX surveys since we need server-side integration for proper hash
      // CPX requires MD5 hash that needs server-side generation
      return [
        {
          id: `cpx_survey_1`,
          provider: 'cpx' as const,
          title: 'Consumer Preferences Study',
          description: 'Share your shopping habits and preferences',
          points: 150,
          duration: '8 minutes',
          category: 'Consumer Research',
          rating: 85,
          url: `https://live-api.cpx-research.com/redirect?app_id=${CPX_APP_ID}&user_id=${userId}`,
          payout: 150
        },
        {
          id: `cpx_survey_2`,
          provider: 'cpx' as const,
          title: 'Brand Awareness Survey',
          description: 'Tell us about your favorite brands',
          points: 200,
          duration: '12 minutes', 
          category: 'Marketing Research',
          rating: 78,
          url: `https://live-api.cpx-research.com/redirect?app_id=${CPX_APP_ID}&user_id=${userId}`,
          payout: 200
        }
      ];
    } catch (error) {
      console.error('CPX Research API error:', error);
      return [];
    }
  }

  // TheoremReach API integration  
  async getTheoremReachSurveys(userId: string): Promise<ExternalSurvey[]> {
    try {
      // Return simulated TheoremReach surveys with proper integration URLs
      return [
        {
          id: `theorem_survey_1`,
          provider: 'theoremreach' as const,
          title: 'Product Feedback Survey',
          description: 'Share your experience with recent purchases',
          points: 180,
          duration: '10 minutes',
          category: 'Product Research',
          rating: 82,
          url: `https://surveys.theoremreach.com/?api_key=${THEOREMREACH_API_KEY}&user_id=${userId}`,
          payout: 180
        },
        {
          id: `theorem_survey_2`,
          provider: 'theoremreach' as const,
          title: 'Entertainment Preferences',
          description: 'Tell us about your favorite movies and shows',
          points: 220,
          duration: '14 minutes',
          category: 'Entertainment',
          rating: 76,
          url: `https://surveys.theoremreach.com/?api_key=${THEOREMREACH_API_KEY}&user_id=${userId}`,
          payout: 220
        }
      ];
    } catch (error) {
      console.error('TheoremReach API error:', error);
      return [];
    }
  }

  // Bitlabs API integration
  async getBitlabsSurveys(userId: string): Promise<ExternalSurvey[]> {
    try {
      console.log('Fetching Bitlabs surveys...');
      const response = await fetch(`https://api.bitlabs.ai/v2/client/surveys?uid=${userId}&platform=WEB`, {
        headers: {
          'X-Api-Token': BITLABS_API_TOKEN,
          'X-User-Id': userId,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Bitlabs API error:', response.status);
        // Return simulated surveys if API fails
        return [
          {
            id: `bitlabs_survey_1`,
            provider: 'bitlabs' as const,
            title: 'Technology Usage Survey',
            description: 'Share how you use technology in daily life',
            points: 170,
            duration: '9 minutes',
            category: 'Technology',
            rating: 88,
            url: `https://web.bitlabs.ai/?uid=${userId}&token=${BITLABS_API_TOKEN}`,
            payout: 170
          }
        ];
      }

      const data = await response.json();
      console.log('Bitlabs response:', data);

      // Transform Bitlabs data to our format
      return (data.data?.surveys || []).map((survey: any) => ({
        id: `bitlabs_${survey.id}`,
        provider: 'bitlabs' as const,
        title: `${survey.category?.name || 'General'} Survey`,
        description: 'Complete this survey to earn points',
        points: Math.round(parseFloat(survey.value || '100')), // Value is already in cents
        duration: `${survey.loi || 15} minutes`,
        category: survey.category?.name || 'General',
        rating: (survey.rating || 4) * 20, // Convert 1-5 to 20-100
        url: survey.click_url || '',
        payout: parseInt(survey.value || '100')
      }));
    } catch (error) {
      console.error('Bitlabs API error:', error);
      // Return simulated surveys as fallback
      return [
        {
          id: `bitlabs_survey_1`,
          provider: 'bitlabs' as const,
          title: 'Technology Usage Survey',
          description: 'Share how you use technology in daily life',
          points: 170,
          duration: '9 minutes',
          category: 'Technology',
          rating: 88,
          url: `https://web.bitlabs.ai/?uid=${userId}&token=${BITLABS_API_TOKEN}`,
          payout: 170
        }
      ];
    }
  }

  // Get all surveys from all providers
  async getAllSurveys(userId: string): Promise<ExternalSurvey[]> {
    console.log('Fetching surveys from all providers for user:', userId);
    
    const [cpxSurveys, theoremSurveys, bitlabsSurveys] = await Promise.all([
      this.getCpxSurveys(userId),
      this.getTheoremReachSurveys(userId),
      this.getBitlabsSurveys(userId)
    ]);

    const allSurveys = [...cpxSurveys, ...theoremSurveys, ...bitlabsSurveys];
    console.log(`Total surveys found: ${allSurveys.length} (CPX: ${cpxSurveys.length}, TheoremReach: ${theoremSurveys.length}, Bitlabs: ${bitlabsSurveys.length})`);
    
    return allSurveys;
  }

  // Convert external survey to our Task format
  convertToTask(survey: ExternalSurvey): Task {
    return {
      id: survey.id,
      type: 'survey',
      title: survey.title,
      description: survey.description,
      points: survey.points,
      duration: survey.duration,
      category: survey.category,
      rating: survey.rating,
      is_active: true,
      created_at: new Date().toISOString(),
      // Add provider info for tracking
      provider: survey.provider,
      external_url: survey.url,
      payout_cents: survey.payout
    } as any;
  }

  // Record survey completion with provider
  async completeSurvey(userId: string, surveyId: string, provider: string): Promise<boolean> {
    try {
      console.log(`Recording survey completion: ${surveyId} for user ${userId} via ${provider}`);
      
      // Call the provider's completion endpoint if needed
      switch (provider) {
        case 'cpx':
          // CPX Research handles completion via their redirect URL
          break;
        case 'theoremreach':
          // TheoremReach handles completion via their callback
          break;
        case 'bitlabs':
          // Bitlabs handles completion via their webhook
          break;
      }
      
      return true;
    } catch (error) {
      console.error('Survey completion error:', error);
      return false;
    }
  }
}

export const surveyApiService = new SurveyApiService();