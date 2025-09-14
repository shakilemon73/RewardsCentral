import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, TrendingUp, Users, DollarSign, Clock, Globe,
  Activity, Target, Award, Eye, Download, RefreshCw
} from "lucide-react";
import { Link } from "wouter";

export default function UserMetrics() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0,
    avgEarnings: 0,
    surveysCompleted: 0,
    rewardsRedeemed: 0
  });

  // Animate metrics on component mount
  useEffect(() => {
    const animateMetrics = () => {
      const targets = {
        totalUsers: 2300000,
        activeUsers: 89,
        completionRate: 95.7,
        avgEarnings: 127,
        surveysCompleted: 15600000,
        rewardsRedeemed: 4200000
      };

      Object.entries(targets).forEach(([key, target]) => {
        let current = 0;
        const increment = target / 60;
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          setMetrics(prev => ({ ...prev, [key]: current }));
        }, 30);
      });
    };

    animateMetrics();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return Math.round(num).toString();
  };

  const formatCurrency = (num: number) => {
    return '$' + Math.round(num).toString();
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Analytics-Focused Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-3 cursor-pointer group" data-testid="logo-rewardspay">
              <div className="gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-normal">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-shimmer font-bold text-2xl">RewardsPay Analytics</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              User Demographics
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Platform Stats
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Growth Metrics
            </Button>
            <Link href="/partnerships">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
                For Partners
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex border-primary/20 hover:border-primary text-primary hover:bg-primary/5">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="button-glow bg-primary hover:bg-primary/90 text-primary-foreground">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Live Metrics */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 gradient-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 gradient-warm opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 text-lg px-6 py-3 bg-data-primary/10 text-data-primary border-data-primary/20" data-testid="analytics-badge">
              <Activity className="h-4 w-4 mr-2" />
              Live Platform Analytics
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="block text-foreground">Platform</span>
              <span className="block text-shimmer">Performance Metrics</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Real-time insights into user engagement, platform growth, and 
              <span className="font-bold text-primary"> performance analytics</span> across our global user base.
            </p>

            {/* Live Update Indicator */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <div className="w-2 h-2 bg-trust-verified rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Performance Indicators */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Key Performance Indicators</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Core metrics that drive our platform's success and user satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Total Users */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="total-users-metric">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="total-users-count">
                  {formatNumber(metrics.totalUsers)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Registered worldwide</div>
                <div className="flex items-center justify-center gap-2 text-trust-verified">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+15.2% this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="active-users-metric">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">Daily Active Users</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-success mb-2">
                  {formatPercentage(metrics.activeUsers)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Of total user base</div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className="bg-success rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${metrics.activeUsers}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatNumber((metrics.totalUsers * metrics.activeUsers) / 100)} active today
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="completion-rate-metric">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-data-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-data-primary" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">Survey Completion</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-data-primary mb-2">
                  {formatPercentage(metrics.completionRate)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Industry leading rate</div>
                <Progress value={metrics.completionRate} className="h-3 mb-2" />
                <div className="text-xs text-muted-foreground">
                  25% above industry average
                </div>
              </CardContent>
            </Card>

            {/* Average Earnings */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="avg-earnings-metric">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">Avg Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">
                  {formatCurrency(metrics.avgEarnings)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Per active user</div>
                <div className="flex items-center justify-center gap-2 text-trust-verified">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+8.3% vs last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Surveys Completed */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="surveys-completed-metric">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-data-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-data-secondary" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">Total Surveys</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-data-secondary mb-2">
                  {formatNumber(metrics.surveysCompleted)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Completed lifetime</div>
                <div className="text-xs text-muted-foreground">
                  ~{formatNumber(metrics.surveysCompleted / 30)} per day
                </div>
              </CardContent>
            </Card>

            {/* Rewards Redeemed */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="rewards-redeemed-metric">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-trust-verified/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-trust-verified" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">Rewards Redeemed</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-trust-verified mb-2">
                  {formatNumber(metrics.rewardsRedeemed)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Total transactions</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency((metrics.rewardsRedeemed * 0.15))} total value
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Geographic Distribution */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Global User Distribution</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform serves users across 45+ countries with localized experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Top Countries */}
            <Card className="glass-card" data-testid="top-countries-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Globe className="h-6 w-6 text-primary" />
                  Top User Countries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">United States</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="w-24 h-full bg-primary rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right">32.4%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">United Kingdom</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="w-16 h-full bg-success rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right">18.7%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Germany</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="w-12 h-full bg-accent rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right">14.2%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Canada</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="w-8 h-full bg-data-primary rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right">11.8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Australia</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="w-6 h-full bg-data-secondary rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right">8.9%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Other (40+ countries)</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="w-4 h-full bg-muted-foreground rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right">14.0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Patterns */}
            <Card className="glass-card" data-testid="usage-patterns-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Clock className="h-6 w-6 text-accent" />
                  Usage Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4">Peak Activity Hours (UTC)</h4>
                  <div className="grid grid-cols-6 gap-2 text-center text-xs">
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded flex items-end">
                        <div className="w-full h-2 bg-muted-foreground rounded-b"></div>
                      </div>
                      <span>00-04</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded flex items-end">
                        <div className="w-full h-3 bg-data-primary rounded-b"></div>
                      </div>
                      <span>04-08</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded flex items-end">
                        <div className="w-full h-6 bg-primary rounded-b"></div>
                      </div>
                      <span>08-12</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded flex items-end">
                        <div className="w-full h-8 bg-success rounded-b"></div>
                      </div>
                      <span>12-16</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded flex items-end">
                        <div className="w-full h-7 bg-accent rounded-b"></div>
                      </div>
                      <span>16-20</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded flex items-end">
                        <div className="w-full h-4 bg-data-secondary rounded-b"></div>
                      </div>
                      <span>20-00</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Device Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mobile</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-16 h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Desktop</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-4 h-full bg-success rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tablet</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-1 h-full bg-accent rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">4%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Health Dashboard */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Platform Health Status</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real-time monitoring of system performance and service quality metrics.
            </p>
          </div>

          <Card className="glass-card shadow-2xl max-w-6xl mx-auto" data-testid="platform-health-dashboard">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-3 h-3 bg-trust-verified rounded-full animate-pulse"></div>
                <CardTitle className="text-2xl">All Systems Operational</CardTitle>
                <div className="w-3 h-3 bg-trust-verified rounded-full animate-pulse"></div>
              </div>
              <p className="text-muted-foreground">System status updated every 30 seconds</p>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Service Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-trust-verified/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-6 w-6 text-trust-verified" />
                  </div>
                  <div className="text-lg font-bold text-trust-verified mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground">API Uptime</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-data-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-data-primary" />
                  </div>
                  <div className="text-lg font-bold text-data-primary mb-1">142ms</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-success" />
                  </div>
                  <div className="text-lg font-bold text-success mb-1">99.7%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-lg font-bold text-accent mb-1">847K</div>
                  <div className="text-sm text-muted-foreground">Requests/Day</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Database Performance</span>
                    <span className="font-medium text-trust-verified">Excellent</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>CDN Delivery</span>
                    <span className="font-medium text-trust-verified">Optimal</span>
                  </div>
                  <Progress value={99} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Security Systems</span>
                    <span className="font-medium text-trust-verified">Active</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/10 py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Analytics</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">User Metrics</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Platform Stats</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Growth Data</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Reports</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Monthly Reports</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Custom Analytics</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Data Exports</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Insights</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">User Behavior</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Market Trends</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Predictions</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">Analytics Team</div>
                <div className="text-muted-foreground">metrics@rewardspay.com</div>
                <div className="text-muted-foreground">Data Insights</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RewardsPay Analytics. All rights reserved. | Data-driven excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}