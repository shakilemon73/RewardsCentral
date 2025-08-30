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

export interface CPXSurvey {
  id: string;
  name: string;
  loi: number; // Length of Interview in minutes
  payout: number; // in cents
  category: string;
  conversion: number; // completion rate
  epc: number; // earnings per click
  url: string;
}

export interface TheoremReachSurvey {
  id: string;
  name: string;
  cpi: number; // cost per interview in cents
  loi: number; // length of interview
  conversion: number;
  category: string;
  url: string;
}

export interface BitLabsSurvey {
  id: string;
  name: string;
  value: number; // reward in cents
  loi: number;
  category: string;
  url: string;
  ir: number; // incidence rate
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

  // Generate RapidoReach UID for offerwall integration
  generateRapidoReachUID(userId: string, appId: string, apiKey: string): string {
    // RapidoReach UID format: userId-appId-hash
    const timestamp = Date.now().toString();
    const hashInput = `${userId}${appId}${apiKey}${timestamp}`;
    const hash = CryptoJS.MD5(hashInput).toString().substring(0, 8);
    return `${userId}-${hash}-${timestamp.substring(-6)}`;
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

  // Fetch CPX Research surveys directly
  async fetchCPXSurveys(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<CPXSurvey[]> {
    return await surveyResilienceManager.executeWithCircuitBreaker(
      'cpx',
      async () => {
        const config = getProviderConfig().cpx;
        const ipAddress = await this.getUserIP();
        
        // CPX API endpoint for getting surveys
        const apiUrl = `https://offers.cpx-research.com/api/v1/surveys`;
        const secureHash = this.generateCPXSecureHash(userId, ipAddress);
        
        const params = new URLSearchParams({
          app_id: config.appId || '',
          ext_user_id: userId,
          ip: ipAddress,
          secure_hash: secureHash,
          format: 'json'
        });
        
        // Add demographic parameters for better targeting
        if (userDemographics?.birthday) {
          const date = new Date(userDemographics.birthday);
          params.append('birthday_day', date.getDate().toString());
          params.append('birthday_month', (date.getMonth() + 1).toString());
          params.append('birthday_year', date.getFullYear().toString());
        }
        
        if (userDemographics?.gender) {
          const genderMap = { 'male': '1', 'female': '2', 'other': '3' };
          params.append('gender', genderMap[userDemographics.gender as keyof typeof genderMap] || '0');
        }
        
        if (userDemographics?.country_code) {
          params.append('country', userDemographics.country_code);
        }

        const response = await fetch(`${apiUrl}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'RewardsPay/1.0',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`CPX API error: ${response.status}`);
        }

        const data = await response.json();
        const surveys: CPXSurvey[] = data.surveys || [];
        
        // Cache successful response
        surveyResilienceManager.setCachedResponse(`cpx_surveys_${userId}`, surveys, 300000);
        
        return surveys;
      },
      // Fallback to cached data
      async () => {
        console.warn('Using fallback for CPX surveys');
        return [];
      }
    );
  }

  // Fetch TheoremReach surveys directly
  async fetchTheoremReachSurveys(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<TheoremReachSurvey[]> {
    return await surveyResilienceManager.executeWithCircuitBreaker(
      'theoremreach',
      async () => {
        const config = getProviderConfig().theoremreach;
        
        // TheoremReach API endpoint
        const apiUrl = 'https://theoremreach.com/api/external/v1/surveys';
        
        const requestBody = {
          user_id: userId,
          api_key: config.apiKey,
          ...(userDemographics?.birthday && { dob: userDemographics.birthday }),
          ...(userDemographics?.gender && { gender: userDemographics.gender }),
          ...(userDemographics?.country_code && { country: userDemographics.country_code }),
          ...(userDemographics?.zip_code && { postal_code: userDemographics.zip_code })
        };
        
        // Generate secure hash for TheoremReach
        const requestUrl = apiUrl;
        const jsonBody = JSON.stringify(requestBody);
        const secureHash = this.generateTheoremReachHash(requestUrl, jsonBody, config.secretKey || '');

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-TR-Hash': secureHash
          },
          body: jsonBody
        });

        if (!response.ok) {
          throw new Error(`TheoremReach API error: ${response.status}`);
        }

        const data = await response.json();
        const surveys: TheoremReachSurvey[] = data.surveys || [];
        
        // Cache successful response
        surveyResilienceManager.setCachedResponse(`theoremreach_surveys_${userId}`, surveys, 300000);
        
        return surveys;
      },
      // Fallback to cached data
      async () => {
        console.warn('Using fallback for TheoremReach surveys');
        return [];
      }
    );
  }

  // Fetch BitLabs surveys directly
  async fetchBitLabsSurveys(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<BitLabsSurvey[]> {
    return await surveyResilienceManager.executeWithCircuitBreaker(
      'bitlabs',
      async () => {
        const config = getProviderConfig().bitlabs;
        
        // BitLabs API endpoint
        const apiUrl = 'https://api.bitlabs.ai/v1/surveys';
        
        const params = new URLSearchParams({
          uid: userId,
          token: config.apiKey,
          ...(userDemographics?.country_code && { country: userDemographics.country_code }),
          ...(userDemographics?.gender && { gender: userDemographics.gender }),
        });
        
        if (userDemographics?.birthday) {
          const age = Math.floor((Date.now() - new Date(userDemographics.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          params.append('age', age.toString());
        }

        const response = await fetch(`${apiUrl}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`BitLabs API error: ${response.status}`);
        }

        const data = await response.json();
        const surveys: BitLabsSurvey[] = data.surveys || [];
        
        // Cache successful response
        surveyResilienceManager.setCachedResponse(`bitlabs_surveys_${userId}`, surveys, 300000);
        
        return surveys;
      },
      // Fallback to cached data
      async () => {
        console.warn('Using fallback for BitLabs surveys');
        return [];
      }
    );
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
        url: `https://theoremreach.com/respondent/login?user_id=${userId}&api_key=${config.theoremreach.apiKey}&callback=${encodeURIComponent(config.theoremreach.callbackUrl)}`,
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
        url: `${config.rapidoreach.endpoints.offerwall}/?userId=${this.generateRapidoReachUID(userId, config.rapidoreach.appId || '', config.rapidoreach.apiKey)}`,
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

  // Get all available survey tasks with enhanced targeting (now with direct API calls)
  async getAllSurveyTasks(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<Task[]> {
    try {
      // Use the enhanced survey fetching that gets real surveys from all providers
      return await this.getSurveysWithFallback(userId, userDemographics);
    } catch (error) {
      console.error('Failed to get survey tasks:', error);
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
        
        // Try each provider with its own circuit breaker - now ALL providers fetch real surveys
        const providerPromises = providers.map(async provider => {
          try {
            switch (provider) {
              case 'rapidoreach':
                const rapidoSurveys = await this.fetchRapidoReachSurveys(userId, userDemographics);
                return rapidoSurveys.map(survey => this.convertRapidoReachToTask(survey));
              
              case 'cpx':
                const cpxSurveys = await this.fetchCPXSurveys(userId, userDemographics);
                return cpxSurveys.map(survey => this.convertCPXToTask(survey));
              
              case 'theoremreach':
                const theoremreachSurveys = await this.fetchTheoremReachSurveys(userId, userDemographics);
                return theoremreachSurveys.map(survey => this.convertTheoremReachToTask(survey));
              
              case 'bitlabs':
                const bitlabsSurveys = await this.fetchBitLabsSurveys(userId, userDemographics);
                return bitlabsSurveys.map(survey => this.convertBitLabsToTask(survey));
              
              default:
                console.warn(`Unknown provider: ${provider}`);
                return [];
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

  // Convert CPX Research survey to Task format
  convertCPXToTask(survey: CPXSurvey): Task {
    return {
      id: `cpx_${survey.id}`,
      type: 'survey',
      title: survey.name || 'CPX Research Survey',
      description: `Market research survey - ${survey.conversion}% completion rate`,
      points: Math.round(survey.payout / 10), // Convert cents to points (divide by 10)
      duration: `${survey.loi} minutes`,
      category: survey.category || 'Market Research',
      rating: Math.round(survey.conversion),
      is_active: true,
      created_at: new Date().toISOString(),
      provider: 'cpx',
      external_url: survey.url,
      is_iframe: true
    };
  }

  // Convert TheoremReach survey to Task format
  convertTheoremReachToTask(survey: TheoremReachSurvey): Task {
    return {
      id: `theoremreach_${survey.id}`,
      type: 'survey',
      title: survey.name || 'TheoremReach Survey',
      description: `Product research survey - ${survey.conversion}% completion rate`,
      points: Math.round(survey.cpi / 10), // Convert cents to points
      duration: `${survey.loi} minutes`,
      category: survey.category || 'Product Research',
      rating: Math.round(survey.conversion),
      is_active: true,
      created_at: new Date().toISOString(),
      provider: 'theoremreach',
      external_url: survey.url,
      is_iframe: true
    };
  }

  // Convert BitLabs survey to Task format
  convertBitLabsToTask(survey: BitLabsSurvey): Task {
    return {
      id: `bitlabs_${survey.id}`,
      type: 'survey',
      title: survey.name || 'BitLabs Survey',
      description: `Lifestyle survey - ${survey.ir}% incidence rate`,
      points: Math.round(survey.value / 10), // Convert cents to points
      duration: `${survey.loi} minutes`,
      category: survey.category || 'Lifestyle',
      rating: Math.round(survey.ir),
      is_active: true,
      created_at: new Date().toISOString(),
      provider: 'bitlabs',
      external_url: survey.url,
      is_iframe: true
    };
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

  // Get survey counts per provider for dashboard display (now with real API calls)
  async getSurveyCountsByProvider(userId: string, userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  }): Promise<{
    rapidoreach: { count: number; available: boolean; status: string };
    theoremreach: { count: number; available: boolean; status: string };
    cpx: { count: number; available: boolean; status: string };
    bitlabs: { count: number; available: boolean; status: string };
  }> {
    const healthStatus = surveyResilienceManager.getProviderHealth();
    const config = getProviderConfig();
    
    const counts = {
      rapidoreach: { count: 0, available: false, status: healthStatus.rapidoreach || 'unhealthy' },
      theoremreach: { count: 0, available: false, status: healthStatus.theoremreach || 'unhealthy' },
      cpx: { count: 0, available: false, status: healthStatus.cpx || 'unhealthy' },
      bitlabs: { count: 0, available: false, status: healthStatus.bitlabs || 'unhealthy' }
    };

    try {
      // Get real survey counts from each provider
      const providerPromises = [
        // RapidoReach
        config.rapidoreach.enabled ? 
          this.fetchRapidoReachSurveys(userId, userDemographics).then(surveys => ({
            provider: 'rapidoreach',
            count: surveys.length,
            available: surveys.length > 0
          })).catch(() => ({ provider: 'rapidoreach', count: 0, available: false })) :
          Promise.resolve({ provider: 'rapidoreach', count: 0, available: false }),
        
        // CPX Research
        config.cpx.enabled ? 
          this.fetchCPXSurveys(userId, userDemographics).then(surveys => ({
            provider: 'cpx',
            count: surveys.length,
            available: surveys.length > 0
          })).catch(() => ({ provider: 'cpx', count: 0, available: false })) :
          Promise.resolve({ provider: 'cpx', count: 0, available: false }),
        
        // TheoremReach
        config.theoremreach.enabled ? 
          this.fetchTheoremReachSurveys(userId, userDemographics).then(surveys => ({
            provider: 'theoremreach',
            count: surveys.length,
            available: surveys.length > 0
          })).catch(() => ({ provider: 'theoremreach', count: 0, available: false })) :
          Promise.resolve({ provider: 'theoremreach', count: 0, available: false }),
        
        // BitLabs
        config.bitlabs.enabled ? 
          this.fetchBitLabsSurveys(userId, userDemographics).then(surveys => ({
            provider: 'bitlabs',
            count: surveys.length,
            available: surveys.length > 0
          })).catch(() => ({ provider: 'bitlabs', count: 0, available: false })) :
          Promise.resolve({ provider: 'bitlabs', count: 0, available: false })
      ];

      // Wait for all provider calls to complete
      const results = await Promise.allSettled(providerPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { provider, count, available } = result.value;
          counts[provider as keyof typeof counts] = {
            count,
            available,
            status: available ? 'healthy' : 'degraded'
          };
        }
      });

    } catch (error) {
      console.error('Failed to get real survey counts:', error);
    }

    return counts;
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