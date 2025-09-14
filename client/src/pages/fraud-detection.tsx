import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, CheckCircle, AlertTriangle, Users, Eye, Clock, Server, 
  Zap, Lock, Target, BarChart3, Activity, Globe, Cpu, Database,
  TrendingUp, Award, Smartphone, Fingerprint, Binary
} from "lucide-react";
import { Link } from "wouter";

export default function FraudDetection() {
  const [detectionRate, setDetectionRate] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [threatsBlocked, setThreatsBlocked] = useState(0);

  // Animate metrics on component mount
  useEffect(() => {
    const animateMetrics = () => {
      // Animate detection rate to 99.7%
      const targetDetection = 99.7;
      const detectionInterval = setInterval(() => {
        setDetectionRate(prev => {
          const increment = targetDetection / 50;
          const newValue = prev + increment;
          if (newValue >= targetDetection) {
            clearInterval(detectionInterval);
            return targetDetection;
          }
          return newValue;
        });
      }, 20);

      // Animate processing time to 150ms
      const targetTime = 150;
      const timeInterval = setInterval(() => {
        setProcessingTime(prev => {
          const increment = targetTime / 30;
          const newValue = prev + increment;
          if (newValue >= targetTime) {
            clearInterval(timeInterval);
            return targetTime;
          }
          return newValue;
        });
      }, 30);

      // Animate threats blocked to 2.3M
      const targetThreats = 2300000;
      const threatsInterval = setInterval(() => {
        setThreatsBlocked(prev => {
          const increment = targetThreats / 60;
          const newValue = prev + increment;
          if (newValue >= targetThreats) {
            clearInterval(threatsInterval);
            return targetThreats;
          }
          return newValue;
        });
      }, 25);
    };

    animateMetrics();
  }, []);

  const formatThreats = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.round(num).toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Security-Focused Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-3 cursor-pointer group" data-testid="logo-rewardspay">
              <div className="gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-normal">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-shimmer font-bold text-2xl">RewardsPay Security</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Security Overview
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Technical Specs
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Compliance
            </Button>
            <Link href="/partnerships">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
                For Partners
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex border-primary/20 hover:border-primary text-primary hover:bg-primary/5">
              Technical Docs
            </Button>
            <Button className="button-glow bg-primary hover:bg-primary/90 text-primary-foreground">
              Contact Security Team
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Security Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 gradient-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 gradient-warm opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 gradient-neon opacity-3 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 text-lg px-6 py-3 bg-trust-secure/10 text-trust-secure border-trust-secure/20" data-testid="security-badge">
              <Shield className="h-4 w-4 mr-2" />
              Military-Grade Security
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="block text-foreground">Advanced Fraud</span>
              <span className="block text-shimmer">Prevention System</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Industry-leading AI-powered security that protects <span className="font-bold text-primary">2.3 million users</span> 
              and partners with <span className="font-semibold text-trust-secure">99.7% detection accuracy</span>
            </p>

            {/* Live Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="detection-rate-metric">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-trust-secure mb-2">
                    {detectionRate.toFixed(1)}%
                  </div>
                  <div className="text-muted-foreground">Detection Accuracy</div>
                  <div className="mt-2">
                    <Progress value={detectionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="processing-time-metric">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-data-primary mb-2">
                    {Math.round(processingTime)}ms
                  </div>
                  <div className="text-muted-foreground">Processing Time</div>
                  <div className="mt-2">
                    <Progress value={(processingTime / 200) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="threats-blocked-metric">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-data-positive mb-2">
                    {formatThreats(threatsBlocked)}+
                  </div>
                  <div className="text-muted-foreground">Threats Blocked</div>
                  <div className="mt-2">
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Layer Security Architecture */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Multi-Layer Defense System</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive security stack provides multiple layers of protection against fraud, 
              ensuring platform integrity and user trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Layer 1: Authentication */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="auth-layer">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-trust-secure/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Fingerprint className="h-8 w-8 text-trust-secure" />
                </div>
                <CardTitle className="text-xl">Authentication Layer</CardTitle>
                <Badge className="w-fit mx-auto bg-trust-secure/10 text-trust-secure border-trust-secure/20">
                  Real-time Validation
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Advanced user verification with multi-factor authentication and biometric validation.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Device fingerprinting</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Behavioral biometrics</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Session validation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Layer 2: AI Detection */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="ai-detection-layer">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-data-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cpu className="h-8 w-8 text-data-primary" />
                </div>
                <CardTitle className="text-xl">AI Detection Engine</CardTitle>
                <Badge className="w-fit mx-auto bg-data-primary/10 text-data-primary border-data-primary/20">
                  Machine Learning
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  ML-powered pattern recognition analyzes user behavior in real-time.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Anomaly detection</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Pattern analysis</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Risk scoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Layer 3: Network Security */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="network-security-layer">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Network Protection</CardTitle>
                <Badge className="w-fit mx-auto bg-accent/10 text-accent border-accent/20">
                  Infrastructure Shield
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  DDoS protection, IP filtering, and traffic analysis secure our infrastructure.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>DDoS mitigation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Geo-IP filtering</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Rate limiting</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Real-Time Threat Dashboard */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Live Security Dashboard</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitor security metrics and threat levels in real-time across our global infrastructure.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="glass-card shadow-2xl" data-testid="security-dashboard">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-3 h-3 bg-trust-verified rounded-full animate-pulse"></div>
                  <CardTitle className="text-2xl">System Status: SECURE</CardTitle>
                  <div className="w-3 h-3 bg-trust-verified rounded-full animate-pulse"></div>
                </div>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Threat Level Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-trust-verified/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-8 w-8 text-trust-verified" />
                    </div>
                    <div className="text-2xl font-bold text-trust-verified mb-1">LOW</div>
                    <div className="text-sm text-muted-foreground">Threat Level</div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-data-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-8 w-8 text-data-primary" />
                    </div>
                    <div className="text-2xl font-bold text-data-primary mb-1">98.2%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-8 w-8 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-success mb-1">2.3M</div>
                    <div className="text-sm text-muted-foreground">Protected Users</div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe className="h-8 w-8 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-accent mb-1">45+</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                </div>

                {/* Security Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Fraud Detection Rate</span>
                      <span className="text-sm font-bold text-trust-verified">99.7%</span>
                    </div>
                    <Progress value={99.7} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">System Performance</span>
                      <span className="text-sm font-bold text-data-primary">97.8%</span>
                    </div>
                    <Progress value={97.8} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">User Trust Score</span>
                      <span className="text-sm font-bold text-success">96.4%</span>
                    </div>
                    <Progress value={96.4} className="h-3" />
                  </div>
                </div>

                {/* Recent Security Events */}
                <div className="bg-muted/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Security Events</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-trust-verified rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Blocked 847 fraudulent attempts</span> - 2 minutes ago
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-data-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">System security scan completed</span> - 15 minutes ago
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Database backup verified</span> - 1 hour ago
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Industry Certifications</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our security measures meet and exceed international standards and regulations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="glass-card hover:scale-105 transition-transform duration-fast text-center" data-testid="certification-iso">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-trust-certified mx-auto mb-3" />
                <p className="font-semibold text-trust-certified">ISO 27001</p>
                <p className="text-sm text-muted-foreground">Information Security</p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-fast text-center" data-testid="certification-soc">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-trust-secure mx-auto mb-3" />
                <p className="font-semibold text-trust-secure">SOC 2 Type II</p>
                <p className="text-sm text-muted-foreground">Security Controls</p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-fast text-center" data-testid="certification-gdpr">
              <CardContent className="pt-6">
                <Lock className="h-12 w-12 text-data-primary mx-auto mb-3" />
                <p className="font-semibold text-data-primary">GDPR Compliant</p>
                <p className="text-sm text-muted-foreground">Data Protection</p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-fast text-center" data-testid="certification-pci">
              <CardContent className="pt-6">
                <CreditCard className="h-12 w-12 text-success mx-auto mb-3" />
                <p className="font-semibold text-success">PCI DSS</p>
                <p className="text-sm text-muted-foreground">Payment Security</p>
              </CardContent>
            </Card>
          </div>

          {/* Partner Trust Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Trusted by Leading Partners</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Major survey providers and research companies trust our security infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="glass-card p-6 text-center hover:scale-105 transition-transform duration-fast">
                <div className="text-3xl font-bold text-trust-verified mb-2">BitLabs</div>
                <div className="text-sm text-muted-foreground">Certified Partner</div>
                <div className="mt-3">
                  <Badge className="bg-trust-verified/10 text-trust-verified border-trust-verified/20">
                    ✓ Verified Secure
                  </Badge>
                </div>
              </Card>

              <Card className="glass-card p-6 text-center hover:scale-105 transition-transform duration-fast">
                <div className="text-3xl font-bold text-trust-verified mb-2">Pollfish</div>
                <div className="text-sm text-muted-foreground">Premium Integration</div>
                <div className="mt-3">
                  <Badge className="bg-trust-verified/10 text-trust-verified border-trust-verified/20">
                    ✓ Verified Secure
                  </Badge>
                </div>
              </Card>

              <Card className="glass-card p-6 text-center hover:scale-105 transition-transform duration-fast">
                <div className="text-3xl font-bold text-trust-verified mb-2">TapResearch</div>
                <div className="text-sm text-muted-foreground">Trusted Provider</div>
                <div className="mt-3">
                  <Badge className="bg-trust-verified/10 text-trust-verified border-trust-verified/20">
                    ✓ Verified Secure
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Security Questions?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our security team is available 24/7 to address any concerns or questions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 text-lg button-glow bg-primary hover:bg-primary/90" data-testid="contact-security">
                <Shield className="mr-2 h-5 w-5" />
                Contact Security Team
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 text-lg border-primary/20 hover:border-primary text-primary hover:bg-primary/5"
                data-testid="view-docs"
              >
                <Binary className="mr-2 h-5 w-5" />
                View Technical Docs
              </Button>
            </div>

            <div className="mt-12 p-6 bg-muted/20 rounded-xl">
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-trust-verified" />
                  <span>24/7 Security Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-trust-secure" />
                  <span>Incident Response Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-trust-certified" />
                  <span>Security Bug Bounty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/10 py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Security</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Security Overview</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Incident Response</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Bug Bounty</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Compliance</h3>
              <div className="space-y-2 text-sm">
                <Link href="/gdpr-compliance"><div className="text-muted-foreground hover:text-primary cursor-pointer">GDPR Compliance</div></Link>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">SOC 2 Reports</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Audit Logs</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Technical</h3>
              <div className="space-y-2 text-sm">
                <Link href="/postback-implementation"><div className="text-muted-foreground hover:text-primary cursor-pointer">API Security</div></Link>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Integration Guide</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Webhooks</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">Security Team</div>
                <div className="text-muted-foreground">security@rewardspay.com</div>
                <div className="text-muted-foreground">24/7 Monitoring</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RewardsPay Security. All rights reserved. | Your trust is our priority.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}