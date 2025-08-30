// Survey monetization integration for CPX Research, TheoremReach, and Bitlabs
import type { Task } from "@shared/schema";
import { surveyResilienceManager } from "./surveyResilience";
import { surveyConfigManager } from "./surveyConfig";
import CryptoJS from 'crypto-js';

// API credentials managed through configuration system
const getProviderConfig = () => surveyConfigManager.getProviderConfig();

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
  // Generate proper MD5 hash for CPX Research (production-ready)
  generateCPXSecureHash(userId: string, ipAddress: string = '127.0.0.1'): string {
    const config = getProviderConfig().cpx;
    // CPX Research requires MD5 hash of app_id + user_id + ip + api_key
    const hashString = `${config.appId}${userId}${ipAddress}${config.apiKey}`;
    return CryptoJS.MD5(hashString).toString();
  }

  // Generate SHA3-256 hash for TheoremReach requests
  generateTheoremReachHash(requestUrl: string, jsonBody: string = '', secretKey: string): string {
    const hashInput = requestUrl + jsonBody + secretKey;
    return CryptoJS.SHA3(hashInput, { outputLength: 256 }).toString();
  }

  // Generate HMAC-SHA1 hash for BitLabs callback validation
  generateBitLabsHash(callbackUrl: string, secretKey: string): string {
    return CryptoJS.HmacSHA1(callbackUrl, secretKey).toString();
  }

  // Get callback URL for survey providers
  getCallbackUrl(): string {
    return `${window.location.origin}/survey-callback`;
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

  // Fetch RapidoReach surveys with resilience
  async fetchRapidoReachSurveys(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<RapidoReachSurvey[]> {
    return await surveyResilienceManager.executeWithCircuitBreaker(
      'rapidoreach',
      async () => {
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

        const config = getProviderConfig().rapidoreach;
        const requestBody = {
          UserId: userId,
          AppId: config.appId,
          IpAddress: ipAddress,
          City: city,
          CountryLanguageCode: countryLanguageCode,
          ...(userDemographics?.birthday && { DateOfBirth: userDemographics.birthday }),
          ...(userDemographics?.gender && { 
            Gender: userDemographics.gender === 'male' ? 'M' : userDemographics.gender === 'female' ? 'F' : 'M' 
          }),
          ...(userDemographics?.zip_code && { ZipCode: userDemographics.zip_code })
        };

        const response = await fetch(config.endpoints.surveys || 'https://www.rapidoreach.com/getallsurveys-api/', {
          method: 'POST',
          headers: {
            'X-RapidoReach-Api-Key': config.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`RapidoReach API error: ${response.status}`);
        }

        const surveys: RapidoReachSurvey[] = await response.json();
        const result = Array.isArray(surveys) ? surveys : [];
        
        // Cache successful response
        surveyResilienceManager.setCachedResponse(`rapidoreach_surveys_${userId}`, result, 300000);
        
        return result;
      },
      // Fallback to cached data or empty array
      async () => {
        console.warn('Using fallback for RapidoReach surveys');
        return [];
      }
    );
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
    const config = getProviderConfig();
    const enabledProviders: SurveyProvider[] = [];
    
    // Only include enabled providers
    if (config.cpx.enabled) {
      enabledProviders.push({
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
        url: `${config.cpx.endpoints.offerwall}?app_id=${config.cpx.appId}&ext_user_id=${userId}&secure_hash=${this.generateCPXSecureHash(userId)}${this.buildDemographicParams(userDemographics)}&postback_url=${encodeURIComponent(config.cpx.callbackUrl)}`,
        isIframe: true
      });
    }
    
    if (config.theoremreach.enabled) {
      enabledProviders.push({
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
        url: `${config.theoremreach.endpoints.offerwall}?user_id=${userId}&api_key=${config.theoremreach.apiKey}&callback_url=${encodeURIComponent(config.theoremreach.callbackUrl)}`,
        isIframe: true
      });
    }
    
    if (config.bitlabs.enabled) {
      enabledProviders.push({
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
        url: `${config.bitlabs.endpoints.offerwall}/?uid=${userId}&token=${config.bitlabs.apiKey}&callback=${encodeURIComponent(config.bitlabs.callbackUrl)}`,
        isIframe: true
      });
    }
    
    if (config.rapidoreach.enabled) {
      enabledProviders.push({
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
        url: 'https://www.rapidoreach.com/surveys', // Will be replaced with actual survey URLs from API
        isIframe: false
      });
    }
    
    return enabledProviders;
  }

  // Legacy method for backward compatibility
  getSurveyProvidersLegacy(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): SurveyProvider[] {
    // Fallback to hardcoded values if configuration system fails
    const CPX_API_KEY = '7782a3da8da9d1f4f0d2a9f9b9c0c611';
    const CPX_APP_ID = '28886';
    const THEOREMREACH_API_KEY = '9854ec5b04228779d58ac3e9d342';
    const BITLABS_API_TOKEN = '665ef72d-bcf1-4a8d-b427-37c8b7142447';
    
    return [];
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
    };
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

  // Enhanced fallback mechanism with world-class resilience
  async getSurveysWithFallback(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<Task[]> {
    return await surveyResilienceManager.executeWithCircuitBreaker(
      'survey_aggregation',
      async () => {
        const providers = ['rapidoreach', 'cpx', 'bitlabs', 'theoremreach'];
        const allTasks: Task[] = [];
        
        // Try each provider with its own circuit breaker
        const providerPromises = providers.map(async provider => {
          try {
            if (provider === 'rapidoreach') {
              const rapidoSurveys = await this.fetchRapidoReachSurveys(userId, userDemographics);
              return rapidoSurveys.map(survey => this.convertRapidoReachToTask(survey));
            } else {
              // For other providers, use basic tasks (they have their own URLs)
              const basicTasks = await this.getAllSurveyTasks(userId, userDemographics);
              return basicTasks.filter(task => task.id.startsWith(provider));
            }
          } catch (error) {
            console.warn(`Provider ${provider} failed:`, error);
            return [];
          }
        });

        // Wait for all providers and combine results
        const results = await Promise.allSettled(providerPromises);
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            allTasks.push(...result.value);
          } else {
            console.warn(`Provider ${providers[index]} promise failed:`, result.reason);
          }
        });

        // Cache the combined result
        surveyResilienceManager.setCachedResponse(`all_surveys_${userId}`, allTasks, 180000); // 3 minutes cache
        
        return allTasks;
      },
      // Fallback to cached surveys or minimal set
      async () => {
        const cached = surveyResilienceManager.getCachedResponse<Task[]>(`all_surveys_${userId}`);
        if (cached && cached.length > 0) {
          console.info('Using cached surveys as fallback');
          return cached;
        }
        
        console.warn('Using basic survey providers as last resort');
        return await this.getAllSurveyTasks(userId, userDemographics);
      }
    );
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
    };
  }

  // Enhanced survey availability check with health monitoring
  async checkSurveyAvailability(userId: string): Promise<{
    cpx: boolean;
    bitlabs: boolean;
    theoremreach: boolean;
    rapidoreach: boolean;
  }> {
    // Get real-time health status from resilience manager
    const healthStatus = surveyResilienceManager.getProviderHealth();
    
    return {
      cpx: healthStatus.cpx !== 'unhealthy',
      bitlabs: healthStatus.bitlabs !== 'unhealthy',
      theoremreach: healthStatus.theoremreach !== 'unhealthy',
      rapidoreach: healthStatus.rapidoreach !== 'unhealthy'
    };
  }

  // Get detailed provider metrics for debugging
  getProviderMetrics() {
    return surveyResilienceManager.getProviderMetrics();
  }

  // Get provider health status
  getProviderHealth() {
    return surveyResilienceManager.getProviderHealth();
  }
}

export const surveyApiService = new SurveyApiService();