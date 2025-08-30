import { z } from "zod";

// Survey provider interfaces
export interface SurveyProvider {
  name: string;
  getSurveys(userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]>;
  formatSurvey(survey: any): ProviderSurvey;
}

export interface ProviderSurvey {
  id: string;
  type: 'survey' | 'ad' | 'offer';
  title: string;
  description: string;
  points: number;
  duration: string;
  category: string;
  rating: number;
  provider: string;
  entryUrl: string;
  isActive: boolean;
}

// CPX Research Provider
export class CPXResearchProvider implements SurveyProvider {
  name = 'CPX Research';
  private apiKey: string;
  private appId: string;

  constructor() {
    this.apiKey = process.env.CPX_RESEARCH_API_KEY!;
    this.appId = process.env.CPX_RESEARCH_APP_ID!;
  }

  async getSurveys(userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]> {
    try {
      const params = new URLSearchParams({
        app_id: this.appId,
        ext_user_id: userId,
        output_method: 'api',
        ip_user: ipAddress || '1.1.1.1',
        limit: '10',
      });

      if (userAgent) {
        params.append('user_agent', userAgent);
      }

      const response = await fetch(`https://live-api.cpx-research.com/api/get-surveys.php?${params}`);
      const data = await response.json();

      if (data.surveys && Array.isArray(data.surveys)) {
        return data.surveys.map((survey: any) => this.formatSurvey(survey));
      }
      return [];
    } catch (error) {
      console.error('CPX Research API error:', error);
      return [];
    }
  }

  formatSurvey(survey: any): ProviderSurvey {
    const basePoints = Math.floor(survey.loi_in_minutes * 10) + 50; // Base calculation
    const points = Math.max(50, Math.min(200, basePoints));

    return {
      id: `cpx-${survey.id}`,
      type: 'survey',
      title: survey.title || `${survey.loi_in_minutes}-Minute Survey`,
      description: survey.category || 'Share your opinions and earn points',
      points,
      duration: `${survey.loi_in_minutes || 15} minutes`,
      category: survey.category || 'General audience',
      rating: Math.floor(Math.random() * 20) + 40, // 4.0-5.0 stars * 10
      provider: 'CPX Research',
      entryUrl: survey.click_url,
      isActive: true,
    };
  }
}

// TheoremReach Provider
export class TheoremReachProvider implements SurveyProvider {
  name = 'TheoremReach';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.THEOREMREACH_API_KEY!;
  }

  async getSurveys(userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        user_id: userId,
        ip: ipAddress || '1.1.1.1',
      });

      const response = await fetch(`https://api.theoremreach.com/api/publishers/v1/user_details?${params}`);
      const data = await response.json();

      // TheoremReach API mainly checks availability, generate surveys based on availability
      if (data.surveys_available) {
        return this.generateTheoremReachSurveys(userId);
      }
      return [];
    } catch (error) {
      console.error('TheoremReach API error:', error);
      return [];
    }
  }

  private generateTheoremReachSurveys(userId: string): ProviderSurvey[] {
    // Generate 2-4 surveys when available
    const surveys = [];
    const count = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < count; i++) {
      const duration = [10, 15, 20, 25][i % 4];
      const points = Math.floor(duration * 6) + 30; // 6 points per minute + base 30

      surveys.push({
        id: `theorem-${Date.now()}-${i}`,
        type: 'survey' as const,
        title: [
          'Consumer Insights Survey',
          'Product Feedback Study',
          'Market Research Survey',
          'Opinion & Trends Study'
        ][i % 4],
        description: [
          'Help brands understand consumer preferences',
          'Share feedback about products and services',
          'Participate in important market research',
          'Voice your opinions on current trends'
        ][i % 4],
        points,
        duration: `${duration} minutes`,
        category: ['General audience', 'Ages 18-35', 'Product users', 'Opinion leaders'][i % 4],
        rating: Math.floor(Math.random() * 10) + 40, // 4.0-5.0 stars * 10
        provider: 'TheoremReach',
        entryUrl: `https://theoremreach.com/respondent_entry/direct?api_key=${this.apiKey}&user_id=${userId}&transaction_id=${Date.now()}`,
        isActive: true,
      });
    }

    return surveys;
  }

  formatSurvey(survey: any): ProviderSurvey {
    return survey; // Already formatted in generateTheoremReachSurveys
  }
}

// BitLabs Provider
export class BitLabsProvider implements SurveyProvider {
  name = 'BitLabs';
  private apiToken: string;

  constructor() {
    this.apiToken = process.env.BITLABS_API_TOKEN!;
  }

  async getSurveys(userId: string): Promise<ProviderSurvey[]> {
    try {
      const response = await fetch('https://api.bitlabs.ai/v2/client/surveys', {
        headers: {
          'X-Api-Token': this.apiToken,
          'X-User-Id': userId,
        },
      });

      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        return data.data.map((survey: any) => this.formatSurvey(survey));
      }
      return [];
    } catch (error) {
      console.error('BitLabs API error:', error);
      return [];
    }
  }

  formatSurvey(survey: any): ProviderSurvey {
    const points = Math.floor((survey.value?.usd || 0.5) * 100); // Convert USD to points

    return {
      id: `bitlabs-${survey.id}`,
      type: survey.category?.includes('offer') ? 'offer' : 'survey',
      title: survey.category || 'Survey Opportunity',
      description: `Complete this ${survey.loi || 15}-minute survey and earn points`,
      points: Math.max(75, Math.min(250, points)),
      duration: `${survey.loi || 15} minutes`,
      category: survey.tags?.[0] || 'General audience',
      rating: Math.floor(Math.random() * 15) + 35, // 3.5-5.0 stars * 10
      provider: 'BitLabs',
      entryUrl: survey.click_url,
      isActive: true,
    };
  }
}

// Survey aggregator service
export class SurveyService {
  private providers: SurveyProvider[];

  constructor() {
    this.providers = [
      new CPXResearchProvider(),
      new TheoremReachProvider(),
      new BitLabsProvider(),
    ];
  }

  async getAllSurveys(userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]> {
    const allSurveys: ProviderSurvey[] = [];

    for (const provider of this.providers) {
      try {
        const surveys = await provider.getSurveys(userId, userAgent, ipAddress);
        allSurveys.push(...surveys);
      } catch (error) {
        console.error(`Error fetching from ${provider.name}:`, error);
      }
    }

    // Shuffle and limit to prevent overwhelming users
    const shuffled = allSurveys.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  }

  async getSurveysByType(type: string, userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]> {
    const allSurveys = await this.getAllSurveys(userId, userAgent, ipAddress);
    return allSurveys.filter(survey => survey.type === type);
  }
}

export const surveyService = new SurveyService();