// Survey monetization integration for CPX Research, TheoremReach, and Bitlabs
import type { Task } from "@shared/schema";

// API credentials from environment variables
const CPX_API_KEY = import.meta.env.VITE_CPX_RESEARCH_API_KEY || '7782a3da8da9d1f4f0d2a9f9b9c0c611';
const CPX_APP_ID = import.meta.env.VITE_CPX_RESEARCH_APP_ID || '28886';
const THEOREMREACH_API_KEY = import.meta.env.VITE_THEOREMREACH_API_KEY || '9854ec5b04228779d58ac3e9d342';
const BITLABS_API_TOKEN = import.meta.env.VITE_BITLABS_API_TOKEN || '665ef72d-bcf1-4a8d-b427-37c8b7142447';
const RAPIDOREACH_API_KEY = import.meta.env.VITE_RAPIDOREACH_API_KEY || 'ac9e857aa9e61eba980c0407e05688e3';
const RAPIDOREACH_APP_ID = import.meta.env.VITE_RAPIDOREACH_APP_ID || 'PIufj1sh6SL';

export interface SurveyProvider {
  id: string;
  name: string;
  provider: 'cpx' | 'theoremreach' | 'bitlabs' | 'rapidoreach';
  title: string;
  description: string;
  estimatedEarnings: string;
  timeRange: string;
  category: string;
  rating: number;
  userRating: number;
  averageReward: number;
  url: string;
  isIframe: boolean;
}

export interface RapidoReachSurvey {
  SurveyNumber: string;
  SurveyUrl: string;
  Reward: number;
  LOI: number;
  MatchingPercentage: number;
  vc_name: string;
  ProvidedBy?: string;
  Survey?: {
    BidLengthOfInterview: number;
    SurveyName: string;
  };
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

  // Get user's IP address (fallback to placeholder)
  async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch (error) {
      console.warn('Failed to get user IP:', error);
      return '127.0.0.1';
    }
  }

  // Get user's city from IP (fallback)
  async getUserCity(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.city || 'New York';
    } catch (error) {
      console.warn('Failed to get user city:', error);
      return 'New York';
    }
  }

  // Fetch RapidoReach surveys
  async fetchRapidoReachSurveys(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<RapidoReachSurvey[]> {
    try {
      const ipAddress = await this.getUserIP();
      const city = await this.getUserCity();
      
      // Map country code to language code (default to ENG-US)
      const countryLanguageMap: { [key: string]: string } = {
        'US': 'ENG-US',
        'CA': 'ENG-CA',
        'GB': 'ENG-GB',
        'AU': 'ENG-AU',
        'IN': 'ENG-IN'
      };
      const countryLanguageCode = countryLanguageMap[userDemographics?.country_code || 'US'] || 'ENG-US';

      const requestBody = {
        UserId: userId,
        AppId: RAPIDOREACH_APP_ID,
        IpAddress: ipAddress,
        City: city,
        CountryLanguageCode: countryLanguageCode,
        ...(userDemographics?.birthday && { DateOfBirth: userDemographics.birthday }),
        ...(userDemographics?.gender && { 
          Gender: userDemographics.gender === 'male' ? 'M' : userDemographics.gender === 'female' ? 'F' : 'M' 
        }),
        ...(userDemographics?.zip_code && { ZipCode: userDemographics.zip_code })
      };

      const response = await fetch('https://www.rapidoreach.com/getallsurveys-api/', {
        method: 'POST',
        headers: {
          'X-RapidoReach-Api-Key': RAPIDOREACH_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`RapidoReach API error: ${response.status}`);
      }

      const surveys: RapidoReachSurvey[] = await response.json();
      return Array.isArray(surveys) ? surveys : [];
    } catch (error) {
      console.warn('RapidoReach fetch failed:', error);
      return [];
    }
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
        userRating: 4.4,
        averageReward: 150,
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
        userRating: 4.2,
        averageReward: 120,
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
        userRating: 4.5,
        averageReward: 140,
        url: `https://web.bitlabs.ai/?uid=${userId}&token=${BITLABS_API_TOKEN}`,
        isIframe: true
      },
      {
        id: 'rapidoreach_wall',
        name: 'RapidoReach',
        provider: 'rapidoreach' as const,
        title: 'RapidoReach Surveys',
        description: 'Premium surveys with high completion rates and instant rewards',
        estimatedEarnings: '$0.80 - $6.00',
        timeRange: '5-25 minutes',
        category: 'Premium Research',
        rating: 91,
        userRating: 4.6,
        averageReward: 180,
        url: 'https://www.rapidoreach.com/surveys', // Placeholder - actual surveys fetched via API
        isIframe: false
      }
    ];
  }

  // Convert provider to Task format for display (enhanced with demographics)
  convertProviderToTask(provider: SurveyProvider): Task {
    return {
      id: provider.id,
      type: 'survey',
      title: provider.title,
      description: provider.description,
      points: provider.averageReward,
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
    const providers = ['rapidoreach', 'cpx', 'bitlabs', 'theoremreach'];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      for (const provider of providers) {
        try {
          console.log(`Attempting to load surveys from ${provider} (attempt ${attempt + 1})`);
          
          if (provider === 'rapidoreach') {
            // Special handling for RapidoReach API
            const rapidoSurveys = await this.fetchRapidoReachSurveys(userId, userDemographics);
            if (rapidoSurveys.length > 0) {
              console.log(`Successfully loaded ${rapidoSurveys.length} surveys from RapidoReach`);
              const rapidoTasks = rapidoSurveys.map(survey => this.convertRapidoReachToTask(survey));
              const allSurveys = await this.getAllSurveyTasks(userId, userDemographics);
              return [...rapidoTasks, ...allSurveys];
            }
          } else {
            // Try to get surveys from other providers
            const surveys = await this.getAllSurveyTasks(userId, userDemographics);
            const providerSurveys = surveys.filter(s => s.id.startsWith(provider));
            
            if (providerSurveys.length > 0) {
              console.log(`Successfully loaded ${providerSurveys.length} surveys from ${provider}`);
              return surveys; // Return all surveys if any provider succeeds
            }
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

  // Convert RapidoReach survey to Task format
  convertRapidoReachToTask(survey: RapidoReachSurvey): Task {
    return {
      id: `rapidoreach_${survey.SurveyNumber}`,
      type: 'survey',
      title: survey.Survey?.SurveyName || 'RapidoReach Survey',
      description: `Survey by ${survey.ProvidedBy || 'RapidoReach'} - ${survey.MatchingPercentage}% match`,
      points: Math.round(survey.Reward * 10), // Convert currency to points
      duration: `${survey.LOI} minutes`,
      category: 'Premium Research',
      rating: survey.MatchingPercentage,
      is_active: true,
      created_at: new Date().toISOString(),
      provider: 'rapidoreach',
      external_url: survey.SurveyUrl,
      is_iframe: true
    } as any;
  }

  // Check survey availability without loading full wall
  async checkSurveyAvailability(userId: string): Promise<{
    cpx: boolean;
    bitlabs: boolean;
    theoremreach: boolean;
    rapidoreach: boolean;
  }> {
    const results = {
      cpx: false,
      bitlabs: false,
      theoremreach: false,
      rapidoreach: false
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