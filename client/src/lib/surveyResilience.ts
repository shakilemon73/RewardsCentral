// Advanced Survey Resilience System - Circuit Breakers, Retries, and Fallbacks
// Based on industry best practices from SurveyMonkey, Typeform, and major survey platforms

export interface CircuitBreakerConfig {
  failureThreshold: number;
  timeout: number;
  resetTimeout: number;
  minimumCalls: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitterMaxMs: number;
}

export interface ProviderMetrics {
  totalCalls: number;
  successCount: number;
  failureCount: number;
  averageResponseTime: number;
  lastFailureTime?: number;
  circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

interface CachedResponse {
  data: any;
  timestamp: number;
  ttl: number;
}

class SurveyResilienceManager {
  private circuitBreakers = new Map<string, CircuitBreakerConfig>();
  private providerMetrics = new Map<string, ProviderMetrics>();
  private responseCache = new Map<string, CachedResponse>();
  private retryQueue = new Map<string, number>();

  // Default configurations based on research
  private readonly defaultCircuitConfig: CircuitBreakerConfig = {
    failureThreshold: 60, // 60% failure rate threshold
    timeout: 30000, // 30 seconds
    resetTimeout: 60000, // 1 minute recovery time
    minimumCalls: 5 // Minimum calls before circuit evaluation
  };

  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second base delay
    maxDelay: 30000, // 30 seconds max delay
    backoffMultiplier: 2,
    jitterMaxMs: 1000 // Add randomness to prevent thundering herd
  };

  constructor() {
    this.initializeProviders();
    this.startHealthCheck();
  }

  private initializeProviders(): void {
    const providers = ['cpx', 'theoremreach', 'bitlabs', 'rapidoreach'];
    
    providers.forEach(provider => {
      this.circuitBreakers.set(provider, { ...this.defaultCircuitConfig });
      this.providerMetrics.set(provider, {
        totalCalls: 0,
        successCount: 0,
        failureCount: 0,
        averageResponseTime: 0,
        circuitState: 'CLOSED'
      });
    });
  }

  // Circuit Breaker Pattern Implementation
  async executeWithCircuitBreaker<T>(
    provider: string,
    operation: () => Promise<T>,
    fallbackOperation?: () => Promise<T>
  ): Promise<T> {
    const metrics = this.providerMetrics.get(provider);
    if (!metrics) throw new Error(`Unknown provider: ${provider}`);

    // Check circuit state
    if (metrics.circuitState === 'OPEN') {
      const config = this.circuitBreakers.get(provider)!;
      const timeSinceLastFailure = Date.now() - (metrics.lastFailureTime || 0);
      
      if (timeSinceLastFailure < config.resetTimeout) {
        console.warn(`Circuit breaker OPEN for ${provider}. Using fallback.`);
        return this.executeWithFallback(provider, fallbackOperation);
      } else {
        // Move to HALF_OPEN state for testing
        metrics.circuitState = 'HALF_OPEN';
        console.info(`Circuit breaker transitioning to HALF_OPEN for ${provider}`);
      }
    }

    const startTime = Date.now();
    
    try {
      const result = await this.executeWithRetry(provider, operation);
      
      // Success - update metrics
      metrics.successCount++;
      metrics.totalCalls++;
      metrics.averageResponseTime = this.calculateAverageResponseTime(
        metrics.averageResponseTime,
        Date.now() - startTime,
        metrics.totalCalls
      );
      
      // Close circuit if it was half-open
      if (metrics.circuitState === 'HALF_OPEN') {
        metrics.circuitState = 'CLOSED';
        console.info(`Circuit breaker CLOSED for ${provider} - recovery successful`);
      }
      
      return result;
      
    } catch (error) {
      // Failure - update metrics and check circuit
      metrics.failureCount++;
      metrics.totalCalls++;
      metrics.lastFailureTime = Date.now();
      
      const config = this.circuitBreakers.get(provider)!;
      const failureRate = metrics.failureCount / metrics.totalCalls;
      
      // Open circuit if threshold exceeded
      if (metrics.totalCalls >= config.minimumCalls && 
          failureRate >= (config.failureThreshold / 100)) {
        metrics.circuitState = 'OPEN';
        console.error(`Circuit breaker OPEN for ${provider}. Failure rate: ${Math.round(failureRate * 100)}%`);
      }
      
      return this.executeWithFallback(provider, fallbackOperation);
    }
  }

  // Retry Mechanism with Exponential Backoff and Jitter
  private async executeWithRetry<T>(
    provider: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const config = this.defaultRetryConfig;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === config.maxRetries) {
          console.error(`All retry attempts failed for ${provider}:`, error);
          throw error;
        }

        // Calculate delay with exponential backoff and jitter
        const exponentialDelay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
        const jitter = Math.random() * config.jitterMaxMs;
        const delay = Math.min(exponentialDelay + jitter, config.maxDelay);
        
        console.warn(`${provider} attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms:`, error);
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  // Multi-level Fallback System
  private async executeWithFallback<T>(
    provider: string,
    fallbackOperation?: () => Promise<T>
  ): Promise<T> {
    // Level 1: Custom fallback operation
    if (fallbackOperation) {
      try {
        console.info(`Using custom fallback for ${provider}`);
        return await fallbackOperation();
      } catch (error) {
        console.warn(`Custom fallback failed for ${provider}:`, error);
      }
    }

    // Level 2: Cached response
    const cachedResult = this.getCachedResponse<T>(provider);
    if (cachedResult) {
      console.info(`Using cached response for ${provider}`);
      return cachedResult;
    }

    // Level 3: Alternative provider
    const alternativeResult = await this.tryAlternativeProvider<T>(provider);
    if (alternativeResult) {
      console.info(`Using alternative provider for ${provider}`);
      return alternativeResult;
    }

    // Level 4: Default/degraded response
    console.warn(`All fallback strategies failed for ${provider}, using degraded service`);
    return this.getDegradedResponse(provider);
  }

  // Provider Health Check System
  private startHealthCheck(): void {
    // Perform initial health check after a short delay
    setTimeout(() => {
      this.performHealthChecks().catch(error => {
        console.warn('Initial health check failed:', error);
      });
    }, 2000);
    
    // Then check every 30 seconds
    setInterval(async () => {
      try {
        await this.performHealthChecks();
      } catch (error) {
        console.warn('Health check interval failed:', error);
      }
    }, 30000);
  }

  private async performHealthChecks(): Promise<void> {
    const providers = ['cpx', 'theoremreach', 'bitlabs', 'rapidoreach'];
    
    const healthCheckPromises = providers.map(async provider => {
      try {
        const startTime = Date.now();
        await this.healthCheckProvider(provider);
        const responseTime = Date.now() - startTime;
        
        const metrics = this.providerMetrics.get(provider)!;
        metrics.averageResponseTime = this.calculateAverageResponseTime(
          metrics.averageResponseTime,
          responseTime,
          Math.max(metrics.totalCalls, 1)
        );
        
        // Gradually improve circuit state on successful health checks
        if (metrics.circuitState === 'OPEN' && metrics.failureCount > 0) {
          metrics.failureCount = Math.max(0, metrics.failureCount - 1);
          console.info(`Health check improved metrics for ${provider}`);
        }
        
      } catch (error) {
        console.warn(`Health check failed for ${provider}:`, error);
        const metrics = this.providerMetrics.get(provider)!;
        metrics.failureCount++;
        metrics.lastFailureTime = Date.now();
      }
    });

    await Promise.allSettled(healthCheckPromises);
  }

  private async healthCheckProvider(provider: string): Promise<void> {
    // Simulate health check based on circuit breaker metrics instead of external calls
    // This avoids CORS issues and provides meaningful health status
    const metrics = this.providerMetrics.get(provider);
    if (!metrics) return;

    // Consider provider healthy if:
    // 1. Circuit is not open
    // 2. Success rate is above 50% (if we have data)
    // 3. No recent failures (within last 5 minutes)
    
    const now = Date.now();
    const recentFailureThreshold = 5 * 60 * 1000; // 5 minutes
    
    // If we have recent failures within threshold, consider degraded
    if (metrics.lastFailureTime && (now - metrics.lastFailureTime) < recentFailureThreshold) {
      const timeSinceFailure = now - metrics.lastFailureTime;
      if (timeSinceFailure < 30000) { // Less than 30 seconds ago
        // Recent failure, don't change circuit state yet
        return;
      }
    }
    
    // Gradually recover circuit state based on time since last failure
    if (metrics.circuitState === 'OPEN' && metrics.lastFailureTime) {
      const timeSinceFailure = now - metrics.lastFailureTime;
      if (timeSinceFailure > 60000) { // 1 minute recovery period
        metrics.circuitState = 'HALF_OPEN';
        console.info(`Circuit breaker transitioning to HALF_OPEN for ${provider} after recovery period`);
      }
    }
    
    if (metrics.circuitState === 'HALF_OPEN' && metrics.successCount > 0) {
      const successRate = metrics.successCount / metrics.totalCalls;
      if (successRate > 0.5) { // 50% success rate
        metrics.circuitState = 'CLOSED';
        console.info(`Circuit breaker CLOSED for ${provider} - health restored`);
      }
    }
  }

  // Caching System
  setCachedResponse(key: string, data: any, ttlMs: number = 300000): void {
    this.responseCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  getCachedResponse<T>(key: string): T | null {
    const cached = this.responseCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.responseCache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Alternative Provider Logic
  private async tryAlternativeProvider<T>(failedProvider: string): Promise<T | null> {
    const providerPriority = {
      cpx: ['rapidoreach', 'bitlabs', 'theoremreach'],
      theoremreach: ['rapidoreach', 'cpx', 'bitlabs'],
      bitlabs: ['rapidoreach', 'cpx', 'theoremreach'],
      rapidoreach: ['cpx', 'bitlabs', 'theoremreach']
    };

    const alternatives = providerPriority[failedProvider as keyof typeof providerPriority] || [];
    
    for (const alternative of alternatives) {
      const metrics = this.providerMetrics.get(alternative);
      if (metrics?.circuitState === 'CLOSED') {
        // Try to use alternative provider
        console.info(`Attempting alternative provider: ${alternative}`);
        return null; // Implementation would depend on specific provider logic
      }
    }

    return null;
  }

  // Degraded Service Response
  private getDegradedResponse<T>(provider: string): T {
    console.warn(`Providing degraded service for ${provider}`);
    
    // Return minimal service response
    return {
      surveys: [],
      message: 'Surveys temporarily unavailable. Please try again later.',
      degraded: true,
      retryAfter: 60000 // Suggest retry in 1 minute
    } as any;
  }

  // Utility Methods
  private calculateAverageResponseTime(current: number, newTime: number, totalCalls: number): number {
    return Math.round(((current * (totalCalls - 1)) + newTime) / totalCalls);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API Methods
  getProviderMetrics(): Map<string, ProviderMetrics> {
    return new Map(this.providerMetrics);
  }

  getProviderHealth(): Record<string, 'healthy' | 'degraded' | 'unhealthy'> {
    const health: Record<string, 'healthy' | 'degraded' | 'unhealthy'> = {};
    
    this.providerMetrics.forEach((metrics, provider) => {
      if (metrics.circuitState === 'CLOSED') {
        health[provider] = 'healthy';
      } else if (metrics.circuitState === 'HALF_OPEN') {
        health[provider] = 'degraded';
      } else {
        health[provider] = 'unhealthy';
      }
    });
    
    return health;
  }

  // Reset circuit breaker manually (for admin purposes)
  resetCircuitBreaker(provider: string): void {
    const metrics = this.providerMetrics.get(provider);
    if (metrics) {
      metrics.circuitState = 'CLOSED';
      metrics.failureCount = 0;
      metrics.lastFailureTime = undefined;
      console.info(`Circuit breaker manually reset for ${provider}`);
    }
  }

  // Configure circuit breaker settings
  configureCircuitBreaker(provider: string, config: Partial<CircuitBreakerConfig>): void {
    const currentConfig = this.circuitBreakers.get(provider);
    if (currentConfig) {
      this.circuitBreakers.set(provider, { ...currentConfig, ...config });
      console.info(`Circuit breaker configured for ${provider}:`, config);
    }
  }
}

export const surveyResilienceManager = new SurveyResilienceManager();