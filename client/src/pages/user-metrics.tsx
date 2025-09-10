import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Globe, Clock, Target, BarChart3, DollarSign, Shield } from "lucide-react";
import ModernFooter from "@/components/modern-footer";
import DesktopHeader from "@/components/desktop-header";

export default function UserMetrics() {
  return (
    <div className="min-h-screen bg-background">
      <DesktopHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto fade-up">
            <Badge className="mb-6 text-lg px-6 py-2 gradient-primary" data-testid="badge-user-metrics">
              Platform Analytics & Demographics
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="gradient-primary bg-clip-text text-transparent">User Metrics</span>
              <br />
              <span className="text-shimmer">& Analytics</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive user analytics meeting survey provider requirements for account approval and partnership evaluation
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="glass-card text-center fade-up" data-testid="card-total-users">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">847K+</div>
                <div className="text-xl font-semibold mb-2">Total Users</div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-success">+12.5%</span> this month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" style={{animationDelay: '0.2s'}} data-testid="card-active-users">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-success mx-auto mb-4" />
                <div className="text-4xl font-bold text-success mb-2">523K</div>
                <div className="text-xl font-semibold mb-2">Monthly Active</div>
                <div className="text-sm text-muted-foreground">
                  62% retention rate
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" style={{animationDelay: '0.4s'}} data-testid="card-daily-active">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
                <div className="text-4xl font-bold text-accent mb-2">89K</div>
                <div className="text-xl font-semibold mb-2">Daily Active</div>
                <div className="text-sm text-muted-foreground">
                  17% DAU/MAU ratio
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" style={{animationDelay: '0.6s'}} data-testid="card-rewards-paid">
              <CardContent className="pt-6">
                <DollarSign className="h-12 w-12 text-warm mx-auto mb-4" />
                <div className="text-4xl font-bold text-warm mb-2">$8.2M</div>
                <div className="text-xl font-semibold mb-2">Rewards Paid</div>
                <div className="text-sm text-muted-foreground">
                  Lifetime total
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Geographic Distribution */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Geographic Distribution
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Top Countries */}
            <Card className="glass-card fade-up" data-testid="card-top-countries">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Globe className="h-6 w-6 text-primary" />
                  Top Countries by User Base
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 glass-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🇺🇸</div>
                      <span className="font-semibold">United States</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">284,532</div>
                      <div className="text-sm text-muted-foreground">33.6%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 glass-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🇬🇧</div>
                      <span className="font-semibold">United Kingdom</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-success">127,849</div>
                      <div className="text-sm text-muted-foreground">15.1%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 glass-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">🇨🇦</div>
                      <span className="font-semibold">Canada</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-accent">89,273</div>
                      <div className="text-sm text-muted-foreground">10.5%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 glass-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-yellow-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🇦🇺</div>
                      <span className="font-semibold">Australia</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-warm">76,198</div>
                      <div className="text-sm text-muted-foreground">9.0%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 glass-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-green-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🇩🇪</div>
                      <span className="font-semibold">Germany</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-500">68,934</div>
                      <div className="text-sm text-muted-foreground">8.1%</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      <strong>Tier 1 Countries:</strong> 78.3% of total user base
                      <br />
                      <strong>Survey Availability:</strong> High quality surveys available in all top markets
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Age & Gender Demographics */}
            <Card className="glass-card fade-up" style={{animationDelay: '0.2s'}} data-testid="card-demographics">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Age & Gender Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Age Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>18-24 years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-1/4 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">23.5%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>25-34 years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-success rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">31.2%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>35-44 years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-1/5 h-full bg-accent rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">19.8%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>45-54 years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-[15%] h-full bg-warm rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">14.7%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>55+ years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-[11%] h-full bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">10.8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Gender Split</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 glass-card rounded-lg">
                        <div className="text-2xl font-bold text-primary">54.3%</div>
                        <div className="text-sm text-muted-foreground">Female</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-lg">
                        <div className="text-2xl font-bold text-accent">45.7%</div>
                        <div className="text-sm text-muted-foreground">Male</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      <strong>Survey Targeting:</strong> Optimal demographic spread for diverse survey requirements
                      <br />
                      <strong>Quality Score:</strong> High engagement across all age groups
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Engagement & Quality Metrics */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Engagement & Quality Metrics
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Survey Completion Metrics */}
            <Card className="glass-card fade-up" data-testid="card-survey-metrics">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  Survey Completion Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-3xl font-bold text-success mb-2">73.2%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                      <Badge className="mt-2 bg-success/20 text-success text-xs">Industry Leading</Badge>
                    </div>
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">8.4</div>
                      <div className="text-sm text-muted-foreground">Avg Daily Surveys</div>
                      <Badge className="mt-2 bg-primary/20 text-primary text-xs">Per Active User</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Monthly Survey Volume</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>CPX Research</span>
                        <div className="text-right">
                          <div className="font-bold text-primary">1.2M</div>
                          <div className="text-xs text-muted-foreground">surveys/month</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>BitLabs</span>
                        <div className="text-right">
                          <div className="font-bold text-success">890K</div>
                          <div className="text-xs text-muted-foreground">surveys/month</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>TabResearch</span>
                        <div className="text-right">
                          <div className="font-bold text-accent">654K</div>
                          <div className="text-xs text-muted-foreground">surveys/month</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>Other Providers</span>
                        <div className="text-right">
                          <div className="font-bold text-warm">432K</div>
                          <div className="text-xs text-muted-foreground">surveys/month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-2xl font-bold text-accent mb-2">14.2min</div>
                      <div className="text-sm text-muted-foreground">Avg Completion Time</div>
                    </div>
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-2xl font-bold text-warm mb-2">2.1%</div>
                      <div className="text-sm text-muted-foreground">Quality Flag Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Behavior Analytics */}
            <Card className="glass-card fade-up" style={{animationDelay: '0.2s'}} data-testid="card-behavior-analytics">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  User Behavior Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Session Analytics</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 glass-card rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-2">42.3min</div>
                        <div className="text-sm text-muted-foreground">Avg Session Duration</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-lg">
                        <div className="text-3xl font-bold text-success mb-2">4.7</div>
                        <div className="text-sm text-muted-foreground">Pages per Session</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Platform Usage</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Mobile (iOS/Android)</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-[68%] h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">68.4%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Desktop (Web)</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-[24%] h-full bg-success rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">24.1%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Tablet</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-[8%] h-full bg-accent rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">7.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Peak Activity Hours (EST)</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-xl font-bold text-warm">7-9 AM</div>
                        <div className="text-xs text-muted-foreground">Morning Peak</div>
                      </div>
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-xl font-bold text-primary">12-2 PM</div>
                        <div className="text-xs text-muted-foreground">Lunch Peak</div>
                      </div>
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-xl font-bold text-success">7-10 PM</div>
                        <div className="text-xs text-muted-foreground">Evening Peak</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-2xl font-bold text-accent mb-2">85.3%</div>
                      <div className="text-sm text-muted-foreground">Email Open Rate</div>
                    </div>
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-2xl font-bold text-purple-500 mb-2">67.8%</div>
                      <div className="text-sm text-muted-foreground">Push Notification Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue & Fraud Metrics */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Revenue & Fraud Prevention
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Revenue Metrics */}
            <Card className="glass-card fade-up" data-testid="card-revenue-metrics">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                  Revenue Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">$2.4M</div>
                      <div className="text-sm text-muted-foreground mb-1">Monthly Revenue</div>
                      <Badge className="bg-success/20 text-success text-xs">+18.2%</Badge>
                    </div>
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-3xl font-bold text-success mb-2">$4.85</div>
                      <div className="text-sm text-muted-foreground mb-1">ARPU (Monthly)</div>
                      <Badge className="bg-primary/20 text-primary text-xs">Above Average</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Provider Revenue Share</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>CPX Research</span>
                        <div className="text-right">
                          <div className="font-bold text-primary">$892K</div>
                          <div className="text-xs text-muted-foreground">37.2% share</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>BitLabs</span>
                        <div className="text-right">
                          <div className="font-bold text-success">$634K</div>
                          <div className="text-xs text-muted-foreground">26.4% share</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>TabResearch</span>
                        <div className="text-right">
                          <div className="font-bold text-accent">$487K</div>
                          <div className="text-xs text-muted-foreground">20.3% share</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>Other Providers</span>
                        <div className="text-right">
                          <div className="font-bold text-warm">$387K</div>
                          <div className="text-xs text-muted-foreground">16.1% share</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Revenue Trends (Last 6 Months)</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-lg font-bold text-success">+24.8%</div>
                        <div className="text-xs text-muted-foreground">Revenue Growth</div>
                      </div>
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-lg font-bold text-primary">+19.3%</div>
                        <div className="text-xs text-muted-foreground">User Growth</div>
                      </div>
                      <div className="text-center p-3 glass-card rounded-lg">
                        <div className="text-lg font-bold text-accent">+4.5%</div>
                        <div className="text-xs text-muted-foreground">ARPU Growth</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fraud Prevention Metrics */}
            <Card className="glass-card fade-up" style={{animationDelay: '0.2s'}} data-testid="card-fraud-metrics">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Fraud Prevention Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-3xl font-bold text-success mb-2">99.2%</div>
                      <div className="text-sm text-muted-foreground mb-1">Detection Accuracy</div>
                      <Badge className="bg-success/20 text-success text-xs">Industry Leading</Badge>
                    </div>
                    <div className="text-center p-4 glass-card rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">0.8%</div>
                      <div className="text-sm text-muted-foreground mb-1">Fraud Rate</div>
                      <Badge className="bg-primary/20 text-primary text-xs">Below Industry Avg</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Fraud Detection Methods</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>Device Fingerprinting</span>
                        <div className="text-right">
                          <div className="font-bold text-primary">45,230</div>
                          <div className="text-xs text-muted-foreground">monthly blocks</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>VPN/Proxy Detection</span>
                        <div className="text-right">
                          <div className="font-bold text-success">32,891</div>
                          <div className="text-xs text-muted-foreground">monthly blocks</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>Behavioral Analysis</span>
                        <div className="text-right">
                          <div className="font-bold text-accent">18,472</div>
                          <div className="text-xs text-muted-foreground">monthly blocks</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span>Speed/Pattern Detection</span>
                        <div className="text-right">
                          <div className="font-bold text-warm">12,638</div>
                          <div className="text-xs text-muted-foreground">monthly blocks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Quality Assurance</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 glass-card rounded-lg">
                        <div className="text-2xl font-bold text-success mb-2">97.8%</div>
                        <div className="text-sm text-muted-foreground">Valid Response Rate</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">&lt;1min</div>
                        <div className="text-sm text-muted-foreground">Avg Fraud Detection</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="text-sm text-success font-semibold mb-1">Provider Compliance Status</div>
                    <div className="text-xs text-muted-foreground">
                      ✅ CPX Research: Approved & Compliant<br />
                      ✅ BitLabs: Verified Publisher Status<br />
                      ✅ TabResearch: Enterprise Partnership
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Real-Time Analytics Dashboard */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Real-Time Analytics Dashboard
          </h2>
          
          <div className="max-w-6xl mx-auto">
            <Card className="glass-card fade-up" data-testid="card-analytics-dashboard">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Live Platform Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-6 glass-card rounded-xl">
                    <div className="text-3xl font-bold text-success mb-2" data-testid="metric-online-users">23,847</div>
                    <div className="text-sm text-muted-foreground">Users Online Now</div>
                    <div className="text-xs text-success mt-1">↗ +1,247 (last hour)</div>
                  </div>
                  
                  <div className="text-center p-6 glass-card rounded-xl">
                    <div className="text-3xl font-bold text-primary mb-2" data-testid="metric-active-surveys">1,392</div>
                    <div className="text-sm text-muted-foreground">Active Surveys</div>
                    <div className="text-xs text-primary mt-1">Across all providers</div>
                  </div>
                  
                  <div className="text-center p-6 glass-card rounded-xl">
                    <div className="text-3xl font-bold text-accent mb-2" data-testid="metric-rewards-pending">$47,293</div>
                    <div className="text-sm text-muted-foreground">Rewards Pending</div>
                    <div className="text-xs text-accent mt-1">Processing queue</div>
                  </div>
                  
                  <div className="text-center p-6 glass-card rounded-xl">
                    <div className="text-3xl font-bold text-warm mb-2" data-testid="metric-completion-rate">74.6%</div>
                    <div className="text-sm text-muted-foreground">Today's Completion</div>
                    <div className="text-xs text-warm mt-1">+1.2% vs yesterday</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button size="lg" className="gradient-primary mr-4" data-testid="button-full-analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Full Analytics Dashboard
                  </Button>
                  <Button size="lg" variant="outline" className="glass-card" data-testid="button-export-report">
                    <Target className="mr-2 h-4 w-4" />
                    Export Analytics Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}