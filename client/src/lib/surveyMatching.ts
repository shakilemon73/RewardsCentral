// Advanced survey matching system like Survey Junkie and Swagbucks
import type { User } from "@shared/schema";
import { surveyApiService, type SurveyProvider } from "./surveyApi";

export interface SurveyMatch {
  provider: SurveyProvider;
  matchScore: number; // 0-100, higher is better match
  reason: string[];
  estimatedCompletionRate: number;
}

export class SurveyMatchingService {
  // Calculate match score based on user demographics and preferences
  calculateMatchScore(user: User, provider: SurveyProvider): SurveyMatch {
    let score = 50; // Base score
    const reasons: string[] = [];
    let completionRate = 0.4; // Base 40% completion rate

    // Age targeting (derived from birthday)
    if (user.birthday) {
      const age = this.calculateAge(user.birthday);
      
      // CPX Research performs better for 25-54 age group
      if (provider.provider === 'cpx' && age >= 25 && age <= 54) {
        score += 20;
        completionRate += 0.15;
        reasons.push('Optimal age group for market research');
      }
      
      // BitLabs better for younger demographics (18-34)
      if (provider.provider === 'bitlabs' && age >= 18 && age <= 34) {
        score += 15;
        completionRate += 0.12;
        reasons.push('Good fit for lifestyle surveys');
      }
      
      // TheoremReach good for all adult ages
      if (provider.provider === 'theoremreach' && age >= 18) {
        score += 10;
        completionRate += 0.08;
        reasons.push('Wide age range acceptance');
      }

      // RapidoReach excels with all age groups but especially 21-65
      if (provider.provider === 'rapidoreach' && age >= 21 && age <= 65) {
        score += 25;
        completionRate += 0.2;
        reasons.push('Premium surveys with excellent age targeting');
      }
    }

    // Gender targeting
    if (user.gender) {
      // CPX Research has good balance for all genders
      if (provider.provider === 'cpx') {
        score += 5;
        reasons.push('Balanced gender targeting');
      }
      
      // BitLabs slightly better for female demographic
      if (provider.provider === 'bitlabs' && user.gender === 'female') {
        score += 8;
        completionRate += 0.05;
        reasons.push('Higher completion rate for women');
      }

      // RapidoReach has excellent gender balance and targeting
      if (provider.provider === 'rapidoreach') {
        score += 12;
        completionRate += 0.08;
        reasons.push('Advanced gender-based survey matching');
      }
    }

    // Country targeting
    if (user.country_code) {
      // US/CA/UK/AU have highest survey availability
      const highValueCountries = ['US', 'CA', 'GB', 'AU'];
      if (highValueCountries.includes(user.country_code)) {
        score += 15;
        completionRate += 0.2;
        reasons.push('High survey availability in your country');
        
        // CPX Research particularly strong in US market
        if (provider.provider === 'cpx' && user.country_code === 'US') {
          score += 10;
          completionRate += 0.1;
          reasons.push('Premium US market surveys');
        }

        // RapidoReach has global coverage with premium targeting
        if (provider.provider === 'rapidoreach') {
          score += 18;
          completionRate += 0.15;
          reasons.push('Global premium survey network');
        }
      }

      // RapidoReach supports many countries with good rates
      if (provider.provider === 'rapidoreach') {
        const rapidoCountries = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'IN'];
        if (rapidoCountries.includes(user.country_code)) {
          score += 12;
          completionRate += 0.1;
          reasons.push('Available in your country with good rates');
        }
      }
    }

    // Survey length preference matching
    if (user.preferred_survey_length) {
      const lengthMatch = this.matchSurveyLength(user.preferred_survey_length, provider.timeRange);
      score += lengthMatch.score;
      completionRate += lengthMatch.completionBonus;
      if (lengthMatch.score > 0) {
        reasons.push(lengthMatch.reason);
      }
    }

    // Interest-based matching
    if (user.interests && user.interests.length > 0) {
      const interestMatch = this.matchInterests(user.interests, provider);
      score += interestMatch;
      if (interestMatch > 0) {
        reasons.push('Matches your interests');
      }
    }

    // Provider-specific bonuses based on performance
    const providerBonus = this.getProviderPerformanceBonus(provider.provider);
    score += providerBonus.score;
    completionRate += providerBonus.completionBonus;
    reasons.push(...providerBonus.reasons);

    return {
      provider,
      matchScore: Math.min(100, Math.max(0, score)),
      reason: reasons,
      estimatedCompletionRate: Math.min(0.95, Math.max(0.1, completionRate))
    };
  }

  private calculateAge(birthday: string): number {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private matchSurveyLength(preference: string, providerTimeRange: string): {
    score: number;
    completionBonus: number;
    reason: string;
  } {
    const timeNumber = parseInt(providerTimeRange);
    
    switch (preference) {
      case 'short':
        if (timeNumber <= 10) {
          return { score: 15, completionBonus: 0.1, reason: 'Perfect for short survey preference' };
        }
        return { score: -5, completionBonus: -0.05, reason: '' };
        
      case 'medium':
        if (timeNumber >= 10 && timeNumber <= 20) {
          return { score: 10, completionBonus: 0.08, reason: 'Ideal medium-length survey' };
        }
        return { score: -3, completionBonus: -0.02, reason: '' };
        
      case 'long':
        if (timeNumber >= 20) {
          return { score: 12, completionBonus: 0.09, reason: 'High-value long survey match' };
        }
        return { score: -2, completionBonus: -0.01, reason: '' };
        
      default:
        return { score: 0, completionBonus: 0, reason: '' };
    }
  }

  private matchInterests(userInterests: string[], provider: SurveyProvider): number {
    const providerInterests = {
      'cpx': ['market research', 'consumer products', 'brands', 'shopping'],
      'bitlabs': ['technology', 'lifestyle', 'entertainment', 'social media'],
      'theoremreach': ['product feedback', 'brand awareness', 'business', 'services'],
      'rapidoreach': ['premium research', 'global studies', 'advanced targeting', 'high-value surveys', 'demographics']
    };
    
    const relevantInterests = providerInterests[provider.provider] || [];
    const matches = userInterests.filter(interest => 
      relevantInterests.some((relevant: string) => 
        interest.toLowerCase().includes(relevant) || relevant.includes(interest.toLowerCase())
      )
    );
    
    return matches.length * 3; // 3 points per matching interest
  }

  private getProviderPerformanceBonus(provider: 'cpx' | 'theoremreach' | 'bitlabs' | 'rapidoreach'): {
    score: number;
    completionBonus: number;
    reasons: string[];
  } {
    switch (provider) {
      case 'cpx':
        return {
          score: 10,
          completionBonus: 0.1,
          reasons: ['High-paying market research surveys', 'Fast approval process']
        };
        
      case 'bitlabs':
        return {
          score: 8,
          completionBonus: 0.08,
          reasons: ['Partial rewards for screenouts', 'User-friendly interface']
        };
        
      case 'theoremreach':
        return {
          score: 6,
          completionBonus: 0.06,
          reasons: ['Guaranteed payouts', 'Good for beginners']
        };

      case 'rapidoreach':
        return {
          score: 15,
          completionBonus: 0.18,
          reasons: ['Premium survey network', 'Highest completion rates', 'Real-time matching', 'Advanced demographics']
        };
        
      default:
        return { score: 0, completionBonus: 0, reasons: [] };
    }
  }

  // Get best matched surveys for user (like Survey Junkie's algorithm)
  async getBestMatchedSurveys(user: User, limit: number = 10): Promise<SurveyMatch[]> {
    try {
      const demographics = {
        birthday: user.birthday,
        gender: user.gender,
        country_code: user.country_code,
        zip_code: user.zip_code
      };
      
      const providers = surveyApiService.getSurveyProviders(user.id, demographics);
      
      // Calculate match scores for all providers
      const matches = providers.map(provider => this.calculateMatchScore(user, provider));
      
      // Sort by match score (highest first)
      matches.sort((a, b) => b.matchScore - a.matchScore);
      
      // Return top matches
      return matches.slice(0, limit);
    } catch (error) {
      console.error('Survey matching error:', error);
      return [];
    }
  }

  // Check if user profile is complete enough for good survey matching
  getProfileCompleteness(user: User): {
    score: number;
    missingFields: string[];
    recommendations: string[];
  } {
    const completeness = {
      score: 0,
      missingFields: [] as string[],
      recommendations: [] as string[]
    };
    
    let totalFields = 7;
    let completedFields = 0;
    
    // Essential demographic fields
    if (user.birthday) {
      completedFields++;
    } else {
      completeness.missingFields.push('birthday');
      completeness.recommendations.push('Add your birthday for age-targeted surveys');
    }
    
    if (user.gender) {
      completedFields++;
    } else {
      completeness.missingFields.push('gender');
      completeness.recommendations.push('Gender helps match relevant surveys');
    }
    
    if (user.country_code) {
      completedFields++;
    } else {
      completeness.missingFields.push('country');
      completeness.recommendations.push('Country is required for survey availability');
    }
    
    if (user.zip_code) {
      completedFields++;
    } else {
      completeness.missingFields.push('zip_code');
      completeness.recommendations.push('ZIP code improves local survey matching');
    }
    
    if (user.preferred_survey_length) {
      completedFields++;
    } else {
      completeness.missingFields.push('survey_length');
      completeness.recommendations.push('Set preferred survey length for better matches');
    }
    
    if (user.interests && user.interests.length > 0) {
      completedFields++;
    } else {
      completeness.missingFields.push('interests');
      completeness.recommendations.push('Add interests for topic-specific surveys');
    }
    
    if (user.first_name && user.last_name) {
      completedFields++;
    } else {
      completeness.missingFields.push('name');
      completeness.recommendations.push('Complete name improves survey credibility');
    }
    
    completeness.score = Math.round((completedFields / totalFields) * 100);
    
    return completeness;
  }
}

export const surveyMatchingService = new SurveyMatchingService();