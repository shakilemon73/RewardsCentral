// Survey Resilience Dashboard - Monitor provider health and system metrics
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, RefreshCcw, TrendingUp, TrendingDown } from "lucide-react";
import { surveyApiService } from "@/lib/surveyApi";

interface ProviderStatus {
  provider: string;
  health: 'healthy' | 'degraded' | 'unhealthy';
  metrics: {
    totalCalls: number;
    successCount: number;
    failureCount: number;
    averageResponseTime: number;
    circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  };
}

export function SurveyResilienceDashboard() {
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const fetchSystemStatus = async () => {
    try {
      setIsLoading(true);
      const health = surveyApiService.getProviderHealth();
      const metrics = surveyApiService.getProviderMetrics();
      
      const statuses: ProviderStatus[] = [];
      
      ['cpx', 'theoremreach', 'bitlabs', 'rapidoreach'].forEach(provider => {
        const providerMetrics = metrics.get(provider);
        if (providerMetrics) {
          statuses.push({
            provider: provider.charAt(0).toUpperCase() + provider.slice(1),
            health: health[provider] || 'unhealthy',
            metrics: providerMetrics
          });
        }
      });
      
      setProviderStatuses(statuses);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'unhealthy': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCircuitStateColor = (state: string) => {
    switch (state) {
      case 'CLOSED': return 'bg-green-100 text-green-800';
      case 'HALF_OPEN': return 'bg-yellow-100 text-yellow-800';
      case 'OPEN': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateSuccessRate = (successCount: number, totalCalls: number) => {
    if (totalCalls === 0) return 0;
    return Math.round((successCount / totalCalls) * 100);
  };

  const overallHealth = providerStatuses.length > 0 ? 
    providerStatuses.filter(p => p.health === 'healthy').length / providerStatuses.length * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Survey System Health</h2>
          <p className="text-gray-600">Real-time monitoring of survey provider resilience</p>
        </div>
        <Button 
          onClick={fetchSystemStatus} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Overview
          </CardTitle>
          <CardDescription>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Overall Health Score</span>
            <span className="text-2xl font-bold">{Math.round(overallHealth)}%</span>
          </div>
          <Progress value={overallHealth} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-green-600 font-semibold">
                {providerStatuses.filter(p => p.health === 'healthy').length}
              </div>
              <div className="text-xs text-gray-600">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-600 font-semibold">
                {providerStatuses.filter(p => p.health === 'degraded').length}
              </div>
              <div className="text-xs text-gray-600">Degraded</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-semibold">
                {providerStatuses.filter(p => p.health === 'unhealthy').length}
              </div>
              <div className="text-xs text-gray-600">Unhealthy</div>
            </div>
            <div className="text-center">
              <div className="text-gray-900 font-semibold">
                {providerStatuses.reduce((sum, p) => sum + p.metrics.totalCalls, 0)}
              </div>
              <div className="text-xs text-gray-600">Total Calls</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Details */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {providerStatuses.map((provider) => (
          <Card key={provider.provider}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                {provider.provider}
                {getHealthIcon(provider.health)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={getCircuitStateColor(provider.metrics.circuitState)}
                >
                  {provider.metrics.circuitState}
                </Badge>
                <span className={`text-sm font-medium ${getHealthColor(provider.health)}`}>
                  {provider.health}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Success Rate */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Success Rate</span>
                  <span className="font-medium">
                    {calculateSuccessRate(provider.metrics.successCount, provider.metrics.totalCalls)}%
                  </span>
                </div>
                <Progress 
                  value={calculateSuccessRate(provider.metrics.successCount, provider.metrics.totalCalls)}
                  className="h-2"
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-green-600 font-semibold">{provider.metrics.successCount}</div>
                  <div className="text-gray-600">Success</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-red-600 font-semibold">{provider.metrics.failureCount}</div>
                  <div className="text-gray-600">Failures</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-blue-600 font-semibold">{provider.metrics.totalCalls}</div>
                  <div className="text-gray-600">Total</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-purple-600 font-semibold">
                    {provider.metrics.averageResponseTime || 0}ms
                  </div>
                  <div className="text-gray-600">Avg Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {providerStatuses.some(p => p.health === 'unhealthy') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Alert</AlertTitle>
          <AlertDescription>
            Some survey providers are experiencing issues. The system is automatically using fallback mechanisms to maintain service availability.
            Affected providers: {providerStatuses.filter(p => p.health === 'unhealthy').map(p => p.provider).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {providerStatuses.some(p => p.health === 'degraded') && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Performance Notice</AlertTitle>
          <AlertDescription>
            Some providers are running in degraded mode but surveys are still available.
            Affected providers: {providerStatuses.filter(p => p.health === 'degraded').map(p => p.provider).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Help Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Understanding the Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Circuit States</h4>
              <ul className="space-y-1">
                <li><strong>CLOSED:</strong> Normal operation</li>
                <li><strong>HALF_OPEN:</strong> Testing recovery</li>
                <li><strong>OPEN:</strong> Blocked due to failures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Health Status</h4>
              <ul className="space-y-1">
                <li><strong>Healthy:</strong> All systems operational</li>
                <li><strong>Degraded:</strong> Limited functionality</li>
                <li><strong>Unhealthy:</strong> Service unavailable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}