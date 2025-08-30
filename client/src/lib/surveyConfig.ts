// Survey Provider Configuration and API Key Management
// Production-ready configuration for CPX Research, TheoremReach, BitLabs, and RapidoReach
import { supabase } from './supabase';

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
  private configCache: SurveyEnvironment | null = null;
  private lastFetch: number = 0;
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  private isLoading = false;
  
  constructor() {
    this.environment = import.meta.env.PROD ? 'production' : 'development';
    // Start loading configuration from database
    this.loadConfigFromDatabase();
  }

  // Load configuration from database (background)
  private async loadConfigFromDatabase(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const { data: configs, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('is_enabled', true);

      if (error) throw error;

      this.configCache = this.buildConfigFromDatabase(configs || []);
      this.lastFetch = Date.now();
      console.log('✅ Survey provider configurations loaded from database');
    } catch (error) {
      console.warn('Failed to load configs from database:', error);
      this.configCache = this.getFallbackConfig();
    } finally {
      this.isLoading = false;
    }
  }

  // Get survey provider configuration (sync)
  getProviderConfig(): SurveyEnvironment {
    // Refresh if cache expired
    if (!this.configCache || (Date.now() - this.lastFetch) > this.cacheDuration) {
      this.loadConfigFromDatabase();
    }

    // Return cached config or fallback
    return this.configCache || this.getFallbackConfig();
  }

  // Build config object from database records
  private buildConfigFromDatabase(configs: any[]): SurveyEnvironment {
    const baseCallbackUrl = this.environment === 'production' 
      ? 'https://your-domain.replit.app/survey-callback'
      : `${window.location.origin}/survey-callback`;

    const configMap: { [key: string]: SurveyProviderConfig } = {};

    // Build configuration for each provider from database
    configs.forEach(config => {
      configMap[config.provider_name] = {
        name: this.getProviderDisplayName(config.provider_name),
        apiKey: config.api_key,
        appId: config.app_id,
        secretKey: config.secret_key,
        enabled: config.is_enabled,
        sandboxMode: config.is_sandbox || this.environment === 'development',
        callbackUrl: `${baseCallbackUrl}?provider=${config.provider_name}`,
        endpoints: config.endpoints || {}
      };
    });

    // Ensure all required providers are present
    const result: SurveyEnvironment = {
      cpx: configMap.cpx || this.getDefaultProviderConfig('cpx', baseCallbackUrl),
      theoremreach: configMap.theoremreach || this.getDefaultProviderConfig('theoremreach', baseCallbackUrl),
      bitlabs: configMap.bitlabs || this.getDefaultProviderConfig('bitlabs', baseCallbackUrl),
      rapidoreach: configMap.rapidoreach || this.getDefaultProviderConfig('rapidoreach', baseCallbackUrl)
    };

    // Cache the result
    this.configCache = result;
    this.lastFetch = Date.now();

    return result;
  }

  // Get provider display name
  private getProviderDisplayName(providerName: string): string {
    const names: { [key: string]: string } = {
      cpx: 'CPX Research',
      theoremreach: 'TheoremReach',
      bitlabs: 'BitLabs',
      rapidoreach: 'RapidoReach'
    };
    return names[providerName] || providerName;
  }

  // Get default configuration for a provider (fallback)
  private getDefaultProviderConfig(provider: string, baseCallbackUrl: string): SurveyProviderConfig {
    const defaults: { [key: string]: Partial<SurveyProviderConfig> } = {
      cpx: {
        apiKey: '7782a3da8da9d1f4f0d2a9f9b9c0c611',
        appId: '28886',
        secretKey: 'demo_secret',
        endpoints: {
          offerwall: 'https://offers.cpx-research.com/index.php',
          postback: 'https://api.cpx-research.com/postback'
        }
      },
      theoremreach: {
        apiKey: '9854ec5b04228779d58ac3e9d342',
        secretKey: 'demo_secret',
        endpoints: {
          surveys: this.environment === 'development' 
            ? 'https://surveys-sandbox.theoremreach.com/api/external/v1'
            : 'https://surveys.theoremreach.com/api/external/v1',
          offerwall: 'https://surveys.theoremreach.com/respondent_result'
        }
      },
      bitlabs: {
        apiKey: '665ef72d-bcf1-4a8d-b427-37c8b7142447',
        secretKey: 'demo_secret',
        endpoints: {
          offerwall: 'https://web.bitlabs.ai',
          surveys: 'https://api.bitlabs.ai'
        }
      },
      rapidoreach: {
        apiKey: 'ac9e857aa9e61eba980c0407e05688e3',
        appId: 'PIufj1sh6SL',
        secretKey: 'demo_secret',
        endpoints: {
          surveys: 'https://www.rapidoreach.com/getallsurveys-api',
          postback: 'https://www.rapidoreach.com/postback',
          offerwall: 'https://www.rapidoreach.com/ofw'
        }
      }
    };
    
    const defaultConfig = defaults[provider];
    if (!defaultConfig) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return {
      name: this.getProviderDisplayName(provider),
      apiKey: defaultConfig.apiKey || '',
      appId: defaultConfig.appId,
      secretKey: defaultConfig.secretKey,
      enabled: false, // Disabled by default for fallback
      sandboxMode: this.environment === 'development',
      callbackUrl: `${baseCallbackUrl}?provider=${provider}`,
      endpoints: defaultConfig.endpoints || {}
    };
  }

  // Fallback configuration when database is unavailable
  private getFallbackConfig(): SurveyEnvironment {
    console.warn('Using fallback configuration - database unavailable');
    const baseCallbackUrl = this.environment === 'production' 
      ? 'https://your-domain.replit.app/survey-callback'
      : `${window.location.origin}/survey-callback`;

    return {
      cpx: this.getDefaultProviderConfig('cpx', baseCallbackUrl),
      theoremreach: this.getDefaultProviderConfig('theoremreach', baseCallbackUrl),
      bitlabs: this.getDefaultProviderConfig('bitlabs', baseCallbackUrl),
      rapidoreach: this.getDefaultProviderConfig('rapidoreach', baseCallbackUrl)
    };
  }

  // Legacy sync method for backward compatibility
  getProviderConfigSync(): SurveyEnvironment {
    if (this.configCache) {
      return this.configCache;
    }
    return this.getFallbackConfig();
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