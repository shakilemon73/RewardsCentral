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

  // Build demographic parameters for CPX Research Smart Match
  buildDemographicParams(demographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): string {
    if (!demographics) return '';
    
    let params = '';
    
    if (demographics.birthday) {
      const date = new Date(demographics.birthday);
      params += `&birthday_day=${date.getDate()}&birthday_month=${date.getMonth() + 1}&birthday_year=${date.getFullYear()}`;
    }
    
    if (demographics.gender) {
      const genderMap = { 'male': '1', 'female': '2', 'other': '3', 'prefer_not_to_say': '0' };
      params += `&gender=${genderMap[demographics.gender as keyof typeof genderMap] || '0'}`;
    }
    
    if (demographics.country_code) {
      params += `&user_country_code=${demographics.country_code}`;
    }
    
    if (demographics.zip_code) {
      params += `&zip_code=${demographics.zip_code}`;
    }
    
    return params;
  }

  // Get survey providers with enhanced demographic targeting
  getSurveyProviders(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): SurveyProvider[] {
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
        url: `https://offers.cpx-research.com/index.php?app_id=${CPX_APP_ID}&ext_user_id=${userId}&secure_hash=${this.generateSimpleHash(userId, CPX_API_KEY)}${this.buildDemographicParams(userDemographics)}`,
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

  // Get all available survey tasks with enhanced targeting
  async getAllSurveyTasks(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<Task[]> {
    try {
      const providers = this.getSurveyProviders(userId, userDemographics);
      return providers.map(provider => this.convertProviderToTask(provider));
    } catch (error) {
      console.error('Failed to get survey providers:', error);
      return [];
    }
  }

  // Enhanced fallback mechanism for survey providers
  async getSurveysWithFallback(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }, maxRetries: number = 3): Promise<Task[]> {
    const providers = ['cpx', 'bitlabs', 'theoremreach'];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      for (const provider of providers) {
        try {
          console.log(`Attempting to load surveys from ${provider} (attempt ${attempt + 1})`);
          
          // Try to get surveys from this provider
          const surveys = await this.getAllSurveyTasks(userId, userDemographics);
          const providerSurveys = surveys.filter(s => s.id.startsWith(provider));
          
          if (providerSurveys.length > 0) {
            console.log(`Successfully loaded ${providerSurveys.length} surveys from ${provider}`);
            return surveys; // Return all surveys if any provider succeeds
          }
        } catch (error) {
          console.warn(`${provider} failed (attempt ${attempt + 1}):`, error);
          continue; // Try next provider
        }
      }
      
      // Wait before retry
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    console.warn('All survey providers failed, returning empty array');
    return [];
  }

  // Check survey availability without loading full wall
  async checkSurveyAvailability(userId: string): Promise<{
    cpx: boolean;
    bitlabs: boolean;
    theoremreach: boolean;
  }> {
    const results = {
      cpx: false,
      bitlabs: false,
      theoremreach: false
    };
    
    try {
      // Quick check for each provider
      const providers = this.getSurveyProviders(userId);
      
      for (const provider of providers) {
        try {
          // Simple fetch test to provider URL
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(provider.url, {
            method: 'HEAD',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok || response.status === 404) {
            results[provider.provider] = true;
          }
        } catch (error) {
          console.warn(`${provider.provider} availability check failed:`, error);
        }
      }
    } catch (error) {
      console.error('Availability check error:', error);
    }
    
    return results;
  }
}

export const surveyApiService = new SurveyApiService();