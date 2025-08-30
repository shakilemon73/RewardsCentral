// Survey monetization integration for CPX Research, TheoremReach, and Bitlabs
import type { Task } from "@shared/schema";

// API credentials from environment variables
const CPX_API_KEY = import.meta.env.VITE_CPX_RESEARCH_API_KEY || '7782a3da8da9d1f4f0d2a9f9b9c0c611';
const CPX_APP_ID = import.meta.env.VITE_CPX_RESEARCH_APP_ID || '28886';
const THEOREMREACH_API_KEY = import.meta.env.VITE_THEOREMREACH_API_KEY || '9854ec5b04228779d58ac3e9d342';
const BITLABS_API_TOKEN = import.meta.env.VITE_BITLABS_API_TOKEN || '665ef72d-bcf1-4a8d-b427-37c8b7142447';

export interface SurveyProvider {
  id: string;
  name: string;
  provider: 'cpx' | 'theoremreach' | 'bitlabs';
  title: string;
  description: string;
  estimatedEarnings: string;
  timeRange: string;
  category: string;
  rating: number;
  url: string;
  isIframe: boolean;
}

class SurveyApiService {
  // Simple hash generation for CPX (basic version)
  generateSimpleHash(userId: string, apiKey: string): string {
    // Simple hash based on user ID - in production you'd need proper MD5
    const combined = userId + apiKey;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Get survey providers with direct iframe integration
  getSurveyProviders(userId: string): SurveyProvider[] {
    return [
      {
        id: 'cpx_offerwall',
        name: 'CPX Research',
        provider: 'cpx' as const,
        title: 'CPX Research Surveys',
        description: 'Complete market research surveys and consumer studies',
        estimatedEarnings: '$0.50 - $5.00',
        timeRange: '5-20 minutes',
        category: 'Market Research',
        rating: 87,
        url: `https://offers.cpx-research.com/index.php?app_id=${CPX_APP_ID}&ext_user_id=${userId}&secure_hash=${this.generateSimpleHash(userId, CPX_API_KEY)}`,
        isIframe: true
      },
      {
        id: 'theoremreach_wall',
        name: 'TheoremReach',
        provider: 'theoremreach' as const,
        title: 'TheoremReach Surveys',
        description: 'Participate in product feedback and brand awareness studies',
        estimatedEarnings: '$0.75 - $3.50',
        timeRange: '8-15 minutes',
        category: 'Product Research',
        rating: 83,
        url: `https://theoremreach.com/reward_center?user_id=${userId}&api_key=${THEOREMREACH_API_KEY}`,
        isIframe: true
      },
      {
        id: 'bitlabs_wall',
        name: 'BitLabs',
        provider: 'bitlabs' as const,
        title: 'BitLabs Surveys',
        description: 'Share opinions on technology, lifestyle, and entertainment',
        estimatedEarnings: '$0.60 - $4.00',
        timeRange: '7-18 minutes',
        category: 'Lifestyle',
        rating: 89,
        url: `https://web.bitlabs.ai/?uid=${userId}&token=${BITLABS_API_TOKEN}`,
        isIframe: true
      }
    ];
  }

  // Convert provider to Task format for display
  convertProviderToTask(provider: SurveyProvider): Task {
    const estimatedPoints = provider.estimatedEarnings.includes('$0.50') ? 50 : 
                           provider.estimatedEarnings.includes('$0.75') ? 75 :
                           provider.estimatedEarnings.includes('$0.60') ? 60 : 100;
    
    return {
      id: provider.id,
      type: 'survey',
      title: provider.title,
      description: provider.description,
      points: estimatedPoints,
      duration: provider.timeRange,
      category: provider.category,
      rating: provider.rating,
      is_active: true,
      created_at: new Date().toISOString(),
      provider: provider.provider,
      external_url: provider.url,
      is_iframe: provider.isIframe
    } as any;
  }

  // Open survey provider in new window
  openSurveyProvider(provider: SurveyProvider): void {
    console.log(`Opening ${provider.name} survey wall for user`);
    window.open(provider.url, '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes');
  }

  // Get all available survey tasks
  async getAllSurveyTasks(userId: string): Promise<Task[]> {
    try {
      const providers = this.getSurveyProviders(userId);
      return providers.map(provider => this.convertProviderToTask(provider));
    } catch (error) {
      console.error('Failed to get survey providers:', error);
      return [];
    }
  }
}

export const surveyApiService = new SurveyApiService();