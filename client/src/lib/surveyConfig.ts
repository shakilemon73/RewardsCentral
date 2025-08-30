// Survey Provider Configuration and API Key Management
// Production-ready configuration for CPX Research, TheoremReach, BitLabs, and RapidoReach

export interface SurveyProviderConfig {
  name: string;
  apiKey: string;
  appId?: string;
  secretKey?: string;
  enabled: boolean;
  sandboxMode: boolean;
  callbackUrl: string;
  endpoints: {
    surveys?: string;
    postback?: string;
    offerwall?: string;
  };
}

export interface SurveyEnvironment {
  cpx: SurveyProviderConfig;
  theoremreach: SurveyProviderConfig;
  bitlabs: SurveyProviderConfig;
  rapidoreach: SurveyProviderConfig;
}

class SurveyConfigManager {
  private environment: 'development' | 'production';
  
  constructor() {
    this.environment = import.meta.env.PROD ? 'production' : 'development';
  }

  // Get survey provider configuration
  getProviderConfig(): SurveyEnvironment {
    const baseCallbackUrl = this.environment === 'production' 
      ? 'https://your-domain.replit.app/survey-callback'
      : `${window.location.origin}/survey-callback`;

    return {
      cpx: {
        name: 'CPX Research',
        apiKey: import.meta.env.VITE_CPX_RESEARCH_API_KEY || '7782a3da8da9d1f4f0d2a9f9b9c0c611',
        appId: import.meta.env.VITE_CPX_RESEARCH_APP_ID || '28886',
        secretKey: import.meta.env.VITE_CPX_RESEARCH_SECRET_KEY || 'demo_secret',
        enabled: !!import.meta.env.VITE_CPX_RESEARCH_API_KEY || this.environment === 'development',
        sandboxMode: this.environment === 'development',
        callbackUrl: `${baseCallbackUrl}?provider=cpx`,
        endpoints: {
          offerwall: 'https://offers.cpx-research.com/index.php',
          postback: 'https://api.cpx-research.com/postback'
        }
      },
      theoremreach: {
        name: 'TheoremReach',
        apiKey: import.meta.env.VITE_THEOREMREACH_API_KEY || '9854ec5b04228779d58ac3e9d342',
        secretKey: import.meta.env.VITE_THEOREMREACH_SECRET_KEY || 'demo_secret',
        enabled: !!import.meta.env.VITE_THEOREMREACH_API_KEY || this.environment === 'development',
        sandboxMode: this.environment === 'development',
        callbackUrl: `${baseCallbackUrl}?provider=theoremreach`,
        endpoints: {
          surveys: this.environment === 'development' 
            ? 'https://surveys-sandbox.theoremreach.com/api/external/v1'
            : 'https://surveys.theoremreach.com/api/external/v1',
          offerwall: 'https://theoremreach.com/reward_center'
        }
      },
      bitlabs: {
        name: 'BitLabs',
        apiKey: import.meta.env.VITE_BITLABS_API_TOKEN || '665ef72d-bcf1-4a8d-b427-37c8b7142447',
        secretKey: import.meta.env.VITE_BITLABS_SECRET_KEY || 'demo_secret',
        enabled: !!import.meta.env.VITE_BITLABS_API_TOKEN || this.environment === 'development',
        sandboxMode: this.environment === 'development',
        callbackUrl: `${baseCallbackUrl}?provider=bitlabs`,
        endpoints: {
          offerwall: 'https://web.bitlabs.ai',
          surveys: 'https://api.bitlabs.ai'
        }
      },
      rapidoreach: {
        name: 'RapidoReach',
        apiKey: import.meta.env.VITE_RAPIDOREACH_API_KEY || 'ac9e857aa9e61eba980c0407e05688e3',
        appId: import.meta.env.VITE_RAPIDOREACH_APP_ID || 'PIufj1sh6SL',
        secretKey: import.meta.env.VITE_RAPIDOREACH_SECRET_KEY || 'demo_secret',
        enabled: !!import.meta.env.VITE_RAPIDOREACH_API_KEY || this.environment === 'development',
        sandboxMode: this.environment === 'development',
        callbackUrl: `${baseCallbackUrl}?provider=rapidoreach`,
        endpoints: {
          surveys: 'https://www.rapidoreach.com/getallsurveys-api',
          postback: 'https://www.rapidoreach.com/postback'
        }
      }
    };
  }

  // Check if all required API keys are configured
  validateConfiguration(): {
    isValid: boolean;
    missingKeys: string[];
    enabledProviders: string[];
  } {
    const config = this.getProviderConfig();
    const missingKeys: string[] = [];
    const enabledProviders: string[] = [];

    Object.entries(config).forEach(([provider, settings]) => {
      if (!settings.apiKey) {
        missingKeys.push(`${provider.toUpperCase()}_API_KEY`);
      } else {
        enabledProviders.push(settings.name);
      }

      // Check for provider-specific required keys
      if (provider === 'cpx' && !settings.appId) {
        missingKeys.push('CPX_RESEARCH_APP_ID');
      }
      if (provider === 'rapidoreach' && !settings.appId) {
        missingKeys.push('RAPIDOREACH_APP_ID');
      }
    });

    return {
      isValid: missingKeys.length === 0,
      missingKeys,
      enabledProviders
    };
  }

  // Get configuration for a specific provider
  getProviderSettings(provider: 'cpx' | 'theoremreach' | 'bitlabs' | 'rapidoreach'): SurveyProviderConfig | null {
    const config = this.getProviderConfig();
    return config[provider] || null;
  }

  // Check if provider is properly configured and enabled
  isProviderEnabled(provider: 'cpx' | 'theoremreach' | 'bitlabs' | 'rapidoreach'): boolean {
    const settings = this.getProviderSettings(provider);
    return settings ? settings.enabled : false;
  }

  // Get all enabled providers
  getEnabledProviders(): string[] {
    const config = this.getProviderConfig();
    return Object.entries(config)
      .filter(([_, settings]) => settings.enabled)
      .map(([provider, _]) => provider);
  }

  // Generate configuration report for debugging
  getConfigurationReport(): {
    environment: string;
    totalProviders: number;
    enabledProviders: string[];
    disabledProviders: string[];
    missingConfiguration: string[];
    recommendations: string[];
  } {
    const validation = this.validateConfiguration();
    const config = this.getProviderConfig();
    const allProviders = Object.keys(config);
    const disabledProviders = allProviders.filter(provider => 
      !this.isProviderEnabled(provider as any)
    );

    const recommendations: string[] = [];
    
    if (validation.missingKeys.length > 0) {
      recommendations.push('Add missing API keys to environment variables');
    }
    
    if (disabledProviders.length > 0) {
      recommendations.push('Enable additional providers to increase survey availability');
    }
    
    if (this.environment === 'production' && validation.enabledProviders.length < 2) {
      recommendations.push('Configure at least 2 providers for production redundancy');
    }

    return {
      environment: this.environment,
      totalProviders: allProviders.length,
      enabledProviders: validation.enabledProviders,
      disabledProviders,
      missingConfiguration: validation.missingKeys,
      recommendations
    };
  }
}

export const surveyConfigManager = new SurveyConfigManager();

// Helper function to check if survey system is properly configured
export function isSurveySystemReady(): boolean {
  const validation = surveyConfigManager.validateConfiguration();
  return validation.enabledProviders.length > 0;
}

// Get survey provider status for debugging
export function getSurveyProviderStatus() {
  return surveyConfigManager.getConfigurationReport();
}