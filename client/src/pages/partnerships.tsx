import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, Users, TrendingUp, Globe, Mail, Phone, Star, CheckCircle,
  BarChart3, Target, Handshake, ArrowRight, Zap, Shield, DollarSign,
  Rocket, Award, Eye, Clock, CreditCard
} from "lucide-react";

export default function Partnerships() {
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    phone: "",
    message: "",
    partnershipType: "surveys"
  });
  const { toast } = useToast();

  const handlePartnershipInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Partnership Inquiry Sent!",
      description: "Our business development team will contact you within 24 hours.",
    });
    setFormData({
      company: "",
      email: "",
      phone: "",
      message: "",
      partnershipType: "surveys"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Business-Focused Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-3 cursor-pointer group" data-testid="logo-rewardspay">
              <div className="gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-normal">
                <Handshake className="h-6 w-6 text-white" />
              </div>
              <span className="text-shimmer font-bold text-2xl">RewardsPay Business</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button 
              variant="ghost" 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-muted-foreground hover:text-primary transition-colors duration-fast"
              data-testid="nav-how-it-works"
            >
              How it Works
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => document.getElementById('audience')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-muted-foreground hover:text-primary transition-colors duration-fast"
              data-testid="nav-audience"
            >
              Our Audience
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-muted-foreground hover:text-primary transition-colors duration-fast"
              data-testid="nav-case-studies"
            >
              Case Studies
            </Button>
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
                For Users
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden sm:inline-flex border-primary/20 hover:border-primary text-primary hover:bg-primary/5"
              data-testid="nav-contact"
            >
              Contact Us
            </Button>
            <Button 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="button-glow bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="nav-book-demo"
            >
              Book Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 gradient-warm opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 gradient-primary opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 text-lg px-6 py-3 bg-trust-secure/10 text-trust-secure border-trust-secure/20" data-testid="business-badge">
              <Building2 className="h-4 w-4 mr-2" />
              Enterprise Solutions
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="block text-foreground">Partner with the</span>
              <span className="block text-shimmer">#1 Rewards Platform</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Connect with <span className="font-bold text-primary">2.3 million engaged users</span> through 
              our premium survey and task distribution network.
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center fade-up">
                <div className="text-4xl font-bold text-data-positive mb-2">2.3M+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '100ms' }}>
                <div className="text-4xl font-bold text-data-primary mb-2">95%</div>
                <div className="text-muted-foreground">Completion Rate</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '200ms' }}>
                <div className="text-4xl font-bold text-data-secondary mb-2">48h</div>
                <div className="text-muted-foreground">Avg Campaign Time</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '300ms' }}>
                <div className="text-4xl font-bold text-trust-verified mb-2">99.7%</div>
                <div className="text-muted-foreground">Quality Score</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-14 text-lg button-glow bg-primary hover:bg-primary/90"
                data-testid="hero-get-started"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-14 text-lg border-primary/20 hover:border-primary text-primary hover:bg-primary/5"
                data-testid="hero-learn-more"
              >
                <Eye className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How Partnership Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple integration, powerful results. Launch your campaigns in 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-card hover:scale-105 transition-all duration-slow text-center" data-testid="step-setup">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">1. Setup & Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Quick API integration or use our self-service dashboard. No technical expertise required.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>5-minute setup</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Dedicated support</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Custom integration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-slow text-center" data-testid="step-launch">
              <CardHeader>
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-2xl">2. Launch Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Target specific demographics, set completion criteria, and watch results in real-time.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Advanced targeting</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Real-time analytics</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Quality control</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-slow text-center" data-testid="step-results">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">3. Get Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Receive high-quality responses with detailed analytics and actionable insights.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Detailed reporting</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Data export</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Success guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Audience Demographics Section */}
      <section id="audience" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Premium Audience</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Reach high-quality, engaged users across diverse demographics and interests.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Demographics Chart */}
            <Card className="glass-card p-8" data-testid="demographics-card">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center">User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Age Groups</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">18-24</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-6 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">22%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">25-34</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-12 h-full bg-success rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">35-44</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-8 h-full bg-accent rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">45+</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-4 h-full bg-secondary rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Income Levels</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">$25K-50K</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-8 h-full bg-data-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">$50K-75K</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-10 h-full bg-data-secondary rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">32%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">$75K-100K</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-6 h-full bg-data-tertiary rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">$100K+</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-4 h-full bg-data-positive rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Stats */}
            <div className="space-y-6">
              <Card className="glass-card p-6 hover:scale-105 transition-transform duration-fast" data-testid="audience-engagement">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-data-positive">89%</div>
                    <div className="text-muted-foreground">Active Daily Users</div>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 hover:scale-105 transition-transform duration-fast" data-testid="audience-retention">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-data-positive">95%</div>
                    <div className="text-muted-foreground">Survey Completion Rate</div>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 hover:scale-105 transition-transform duration-fast" data-testid="audience-quality">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-data-positive">99.7%</div>
                    <div className="text-muted-foreground">Quality Score</div>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 hover:scale-105 transition-transform duration-fast" data-testid="audience-geography">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Globe className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-data-positive">45+</div>
                    <div className="text-muted-foreground">Countries & Regions</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how leading companies achieve their research goals with RewardsPay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="case-study-1">
              <CardHeader>
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20 mb-4">
                  Market Research
                </Badge>
                <CardTitle className="text-xl">Fortune 500 Consumer Brand</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Launched product awareness campaign reaching 50K targeted users in 3 days.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">50K</div>
                    <div className="text-xs text-muted-foreground">Responses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">72h</div>
                    <div className="text-xs text-muted-foreground">Completion</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="case-study-2">
              <CardHeader>
                <Badge className="w-fit bg-success/10 text-success border-success/20 mb-4">
                  App Testing
                </Badge>
                <CardTitle className="text-xl">Tech Startup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Gathered user feedback for MVP testing with 95% completion rate.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">95%</div>
                    <div className="text-xs text-muted-foreground">Completion</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">24h</div>
                    <div className="text-xs text-muted-foreground">Launch Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="case-study-3">
              <CardHeader>
                <Badge className="w-fit bg-accent/10 text-accent border-accent/20 mb-4">
                  Opinion Research
                </Badge>
                <CardTitle className="text-xl">Media Company</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Political sentiment analysis across diverse demographic groups.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">25K</div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">48h</div>
                    <div className="text-xs text-muted-foreground">Results</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Contact Form */}
      <section id="contact-form" className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Start Your Partnership</h2>
              <p className="text-xl text-muted-foreground">
                Get in touch with our business development team for a custom solution.
              </p>
            </div>

            <Card className="glass-card shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handlePartnershipInquiry} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        required
                        className="mt-2"
                        data-testid="company-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="mt-2"
                        data-testid="email-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-2"
                        data-testid="phone-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="partnership-type">Partnership Type *</Label>
                      <select
                        id="partnership-type"
                        value={formData.partnershipType}
                        onChange={(e) => handleInputChange("partnershipType", e.target.value)}
                        className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        data-testid="partnership-type-select"
                      >
                        <option value="surveys">Survey Research</option>
                        <option value="app-testing">App Testing</option>
                        <option value="market-research">Market Research</option>
                        <option value="opinion-polling">Opinion Polling</option>
                        <option value="custom">Custom Solution</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                      rows={4}
                      className="mt-2"
                      placeholder="Tell us about your project, target audience, timeline, and specific requirements..."
                      data-testid="message-textarea"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="flex-1 h-14 text-lg button-glow bg-primary hover:bg-primary/90"
                      data-testid="submit-partnership"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Send Partnership Inquiry
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="lg" 
                      className="flex-1 h-14 text-lg border-primary/20 hover:border-primary text-primary hover:bg-primary/5"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Schedule Call
                    </Button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t text-center">
                  <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-trust-verified" />
                      <span>24h Response Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-trust-secure" />
                      <span>Enterprise Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-trust-certified" />
                      <span>Dedicated Support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/10 py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Business</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Enterprise Solutions</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">API Documentation</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Case Studies</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <div className="space-y-2 text-sm">
                <Link href="/user-metrics"><div className="text-muted-foreground hover:text-primary cursor-pointer">Analytics</div></Link>
                <Link href="/fraud-detection"><div className="text-muted-foreground hover:text-primary cursor-pointer">Security</div></Link>
                <Link href="/postback-implementation"><div className="text-muted-foreground hover:text-primary cursor-pointer">Integration</div></Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <div className="space-y-2 text-sm">
                <Link href="/gdpr-compliance"><div className="text-muted-foreground hover:text-primary cursor-pointer">Privacy Policy</div></Link>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Terms of Service</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Data Processing</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">Enterprise Support</div>
                <div className="text-muted-foreground">partnerships@rewardspay.com</div>
                <div className="text-muted-foreground">+1 (555) 123-4567</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RewardsPay Business. All rights reserved. | Partner with the best.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}