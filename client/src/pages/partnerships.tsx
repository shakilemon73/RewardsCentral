import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Globe, 
  Mail, 
  Phone,
  Star,
  CheckCircle,
  BarChart3,
  Target,
  Handshake,
  ArrowRight
} from "lucide-react";
import ModernFooter from "@/components/modern-footer";

export default function Partnerships() {
  const handlePartnershipInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle partnership form submission
    console.log("Partnership inquiry submitted");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Modern Glassmorphism */}
      <header className="sticky top-0 z-50 glass-card border-0 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="animated-gradient text-white px-6 py-3 rounded-2xl font-bold text-2xl hover-3d cursor-pointer">
            RewardsPay
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-white/10 hover:backdrop-blur-sm text-lg px-6" data-testid="button-home">
                Home
              </Button>
            </Link>
            <Button 
              className="gradient-primary button-glow shadow-lg hover:shadow-2xl text-lg px-6"
              onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-contact"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Modern Business-Focused Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-warm opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/50 to-background/90"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-mocha/20 rounded-full blur-xl float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-xl float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-success/20 rounded-full blur-xl float" style={{animationDelay: '4s'}}></div>
        
        <div className="container mx-auto px-6 py-32 text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="fade-up">
              <Badge className="gradient-warm px-6 py-3 text-white text-lg font-semibold rounded-2xl mb-8 shadow-lg">
                Partnership Opportunities
              </Badge>
            </div>
            
            <div className="fade-up" style={{animationDelay: '0.2s'}}>
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-none">
                <span className="text-foreground">Partner with</span>
                <br />
                <span className="text-shimmer">RewardsPay</span>
              </h1>
            </div>
            
            <div className="fade-up" style={{animationDelay: '0.4s'}}>
              <p className="text-2xl md:text-3xl text-muted-foreground mb-16 max-w-4xl mx-auto font-light">
                Connect with our engaged community of{' '}
                <span className="font-semibold gradient-primary bg-clip-text text-transparent">50,000+</span>{' '}
                active users. Drive customer acquisition, brand awareness, and market research through our trusted platform.
              </p>
            </div>
            
            <div className="fade-up flex flex-col md:flex-row gap-6 justify-center" style={{animationDelay: '0.6s'}}>
              <Button 
                size="lg" 
                className="gradient-primary button-glow text-xl px-10 py-6 h-auto rounded-2xl hover-3d shadow-2xl"
                onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-apply-partnership"
              >
                Apply for Partnership <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-card border-primary/30 hover:border-primary/60 text-xl px-10 py-6 h-auto rounded-2xl hover-3d"
                onClick={() => document.getElementById('platform-metrics')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-view-metrics"
              >
                View Platform Metrics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Metrics - Modern Business Cards */}
      <section id="platform-metrics" className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 gradient-neon opacity-5"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-mocha/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 fade-up">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-shimmer">Reach our engaged</span>
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">community</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
              Access high-quality users who actively participate in reward-earning activities
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto">
            <div className="fade-up glass-card p-8 text-center hover-3d card-hover" data-testid="metric-active-users">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 float">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3 text-shimmer">50K+</div>
              <div className="text-base text-muted-foreground">Active Monthly Users</div>
            </div>
            
            <div className="fade-up glass-card p-8 text-center hover-3d card-hover" style={{animationDelay: '0.1s'}} data-testid="metric-engagement">
              <div className="w-20 h-20 gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-6 float" style={{animationDelay: '2s'}}>
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-success mb-3">85%</div>
              <div className="text-base text-muted-foreground">User Engagement Rate</div>
            </div>
            
            <div className="fade-up glass-card p-8 text-center hover-3d card-hover" style={{animationDelay: '0.2s'}} data-testid="metric-completion">
              <div className="w-20 h-20 gradient-neon rounded-2xl flex items-center justify-center mx-auto mb-6 float" style={{animationDelay: '4s'}}>
                <Target className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-3">92%</div>
              <div className="text-base text-muted-foreground">Task Completion Rate</div>
            </div>
            
            <div className="fade-up glass-card p-8 text-center hover-3d card-hover" style={{animationDelay: '0.3s'}} data-testid="metric-satisfaction">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 float" style={{animationDelay: '1s'}}>
                <Star className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3">4.8★</div>
              <div className="text-base text-muted-foreground">Partner Satisfaction</div>
            </div>
          </div>

          {/* Demographics - Modern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="fade-up glass-card border-0 shadow-xl hover-3d card-hover" data-testid="card-age-demographics">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">18-24</span>
                    <span className="text-base font-bold text-primary">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">25-34</span>
                    <span className="text-base font-bold text-success">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">35-44</span>
                    <span className="text-base font-bold text-accent">22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">45+</span>
                    <span className="text-base font-bold text-mocha">18%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="fade-up glass-card border-0 shadow-xl hover-3d card-hover" style={{animationDelay: '0.1s'}} data-testid="card-geographic-reach">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold gradient-warm bg-clip-text text-transparent">Geographic Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">North America</span>
                    <span className="text-base font-bold text-primary">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">Europe</span>
                    <span className="text-base font-bold text-success">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">Asia-Pacific</span>
                    <span className="text-base font-bold text-accent">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">Other</span>
                    <span className="text-base font-bold text-mocha">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="fade-up glass-card border-0 shadow-xl hover-3d card-hover" style={{animationDelay: '0.2s'}} data-testid="card-interests">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold gradient-neon bg-clip-text text-transparent">Top Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge className="gradient-primary px-4 py-2 text-white text-sm font-medium rounded-xl">Technology</Badge>
                  <Badge className="gradient-warm px-4 py-2 text-white text-sm font-medium rounded-xl">Shopping</Badge>
                  <Badge className="gradient-neon px-4 py-2 text-white text-sm font-medium rounded-xl">Finance</Badge>
                  <Badge variant="secondary" className="glass-card px-4 py-2 text-sm font-medium rounded-xl">Health</Badge>
                  <Badge variant="secondary" className="glass-card px-4 py-2 text-sm font-medium rounded-xl">Travel</Badge>
                  <Badge variant="secondary" className="glass-card px-4 py-2 text-sm font-medium rounded-xl">Food</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="fade-up glass-card border-0 shadow-xl hover-3d card-hover" style={{animationDelay: '0.3s'}} data-testid="card-device-usage">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold gradient-mocha bg-clip-text text-transparent">Device Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">Mobile</span>
                    <span className="text-base font-bold text-primary">70%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">Desktop</span>
                    <span className="text-base font-bold text-success">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">Tablet</span>
                    <span className="text-base font-bold text-accent">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Types - Modern Business Cards */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-mocha/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 fade-up">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-shimmer">Partnership</span>
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">Opportunities</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
              Choose the partnership model that best fits your business objectives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="fade-up glass-card border-0 shadow-xl hover-3d card-hover relative overflow-hidden" data-testid="card-survey-research">
              <div className="absolute -top-10 -right-10 w-32 h-32 gradient-primary rounded-full blur-2xl opacity-20"></div>
              <CardHeader className="relative z-10 pb-6">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 float">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">Survey & Research</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Access our user base for market research, product feedback, and consumer insights.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">Custom survey design</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">Demographic targeting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">Real-time results</span>
                  </li>
                </ul>
                <Badge className="gradient-primary px-4 py-2 text-white text-base font-semibold rounded-xl">Starting at $0.50/response</Badge>
              </CardContent>
            </Card>
            
            <Card className="fade-up glass-card border-0 shadow-xl hover-3d card-hover relative overflow-hidden" style={{animationDelay: '0.2s'}} data-testid="card-advertising">
              <div className="absolute -top-10 -right-10 w-32 h-32 gradient-warm rounded-full blur-2xl opacity-20"></div>
              <CardHeader className="relative z-10 pb-6">
                <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center mb-6 float" style={{animationDelay: '2s'}}>
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold gradient-warm bg-clip-text text-transparent">Advertising & Offers</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Promote your products and services to highly engaged users through rewarded advertising.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">Video advertisements</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">App install campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">Lead generation</span>
                  </li>
                </ul>
                <Badge className="gradient-warm px-4 py-2 text-white text-base font-semibold rounded-xl">Performance-based pricing</Badge>
              </CardContent>
            </Card>
            
            <Card className="fade-up glass-card border-0 shadow-xl hover-3d card-hover relative overflow-hidden" style={{animationDelay: '0.4s'}} data-testid="card-brand-partnerships">
              <div className="absolute -top-10 -right-10 w-32 h-32 gradient-neon rounded-full blur-2xl opacity-20"></div>
              <CardHeader className="relative z-10 pb-6">
                <div className="w-16 h-16 gradient-neon rounded-2xl flex items-center justify-center mb-6 float" style={{animationDelay: '4s'}}>
                  <Handshake className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold gradient-neon bg-clip-text text-transparent">Brand Partnerships</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Long-term strategic partnerships for ongoing customer acquisition and retention.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">Custom integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">White-label solutions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-base">Dedicated support</span>
                  </li>
                </ul>
                <Badge className="gradient-neon px-4 py-2 text-white text-base font-semibold rounded-xl">Custom pricing</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Trusted by Leading Brands
            </h2>
            <p className="text-xl text-muted-foreground">
              Join companies that are already leveraging our platform for growth
            </p>
          </div>
          
          {/* Partner Logos Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-background rounded-lg p-8 flex items-center justify-center border">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="bg-background rounded-lg p-8 flex items-center justify-center border">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="bg-background rounded-lg p-8 flex items-center justify-center border">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="bg-background rounded-lg p-8 flex items-center justify-center border">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          
          {/* Success Stories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <blockquote className="bg-background p-8 rounded-lg border" data-testid="testimonial-tech-company">
              <p className="text-lg text-muted-foreground mb-6">
                "RewardsPay helped us reach 10,000+ qualified leads in just 30 days. The platform's user engagement is exceptional, and the partnership team made integration seamless."
              </p>
              <cite className="font-semibold text-foreground">Sarah Mitchell, Marketing Director at TechCorp</cite>
            </blockquote>
            
            <blockquote className="bg-background p-8 rounded-lg border" data-testid="testimonial-retail-brand">
              <p className="text-lg text-muted-foreground mb-6">
                "We've seen a 300% increase in app downloads and 85% user retention rate through RewardsPay's targeted campaigns. It's our most effective acquisition channel."
              </p>
              <cite className="font-semibold text-foreground">David Chen, Growth Manager at RetailPlus</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Partnership Application Form */}
      <section id="partnership-form" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Apply for Partnership
              </h2>
              <p className="text-xl text-muted-foreground">
                Tell us about your company and partnership goals
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Partnership Application</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePartnershipInquiry} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-name">Company Name *</Label>
                      <Input
                        id="company-name"
                        placeholder="Your company name"
                        required
                        data-testid="input-company-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry *</Label>
                      <Input
                        id="industry"
                        placeholder="e.g., Technology, Retail, Finance"
                        required
                        data-testid="input-industry"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Contact Name *</Label>
                      <Input
                        id="contact-name"
                        placeholder="Your full name"
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="job-title">Job Title *</Label>
                      <Input
                        id="job-title"
                        placeholder="Your job title"
                        required
                        data-testid="input-job-title"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@company.com"
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Company Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.yourcompany.com"
                      data-testid="input-website"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="partnership-type">Partnership Interest *</Label>
                    <select 
                      id="partnership-type" 
                      className="w-full p-2 border rounded-md bg-background"
                      required
                      data-testid="select-partnership-type"
                    >
                      <option value="">Select partnership type</option>
                      <option value="survey-research">Survey & Research</option>
                      <option value="advertising">Advertising & Offers</option>
                      <option value="brand-partnership">Brand Partnership</option>
                      <option value="custom">Custom Solution</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Monthly Budget Range</Label>
                    <select 
                      id="budget" 
                      className="w-full p-2 border rounded-md bg-background"
                      data-testid="select-budget"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-1k">Under $1,000</option>
                      <option value="1k-5k">$1,000 - $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-plus">$25,000+</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Partnership Goals & Requirements *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your partnership goals, target audience, and specific requirements..."
                      rows={4}
                      required
                      data-testid="textarea-description"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    data-testid="button-submit-application"
                  >
                    Submit Partnership Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground">
              Have questions? Our partnership team is here to help
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center" data-testid="card-email-contact">
              <CardHeader>
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For partnership inquiries and business questions
                </p>
                <Button variant="outline">
                  partnerships@rewardspay.com
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="card-phone-contact">
              <CardHeader>
                <Phone className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle>Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Speak directly with our partnerships team
                </p>
                <Button variant="outline">
                  +1 (555) 123-REWARDS
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="card-office-contact">
              <CardHeader>
                <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our headquarters in the heart of tech
                </p>
                <Button variant="outline">
                  San Francisco, CA
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Provider Success Showcase */}
      <section className="relative py-32 overflow-hidden bg-muted/20">
        {/* Background Elements */}
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mocha/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            
            {/* Left - Business Illustration */}
            <div className="fade-up">
              <div className="relative">
                <img 
                  src="/attached_assets/generated_images/Business_partnership_illustration_a4d10d9b.png" 
                  alt="Successful business partnerships and growth analytics" 
                  className="w-full h-auto rounded-3xl shadow-2xl hover-3d"
                  data-testid="img-business-partnerships"
                />
                <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-success">95%</div>
                  <div className="text-sm text-muted-foreground">Partner Satisfaction</div>
                </div>
              </div>
            </div>
            
            {/* Right - Provider Appeal Content */}
            <div className="fade-up" style={{animationDelay: '0.3s'}}>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                <span className="text-shimmer">Partner</span>
                <br />
                <span className="gradient-primary bg-clip-text text-transparent">Success</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join leading providers who've found success with our engaged user base and professional platform.
              </p>
              
              {/* Key Provider Requirements Met */}
              <div className="glass-card p-6 mb-6">
                <h3 className="text-2xl font-bold text-primary mb-4">✅ Ready for CPX Research</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">No approval barriers - instant integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">Quality content standards maintained</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">10-minute setup process</span>
                  </li>
                </ul>
              </div>
              
              {/* BitLabs.ai & Cint Ready */}
              <div className="glass-card p-6 mb-8">
                <h3 className="text-2xl font-bold text-warm mb-4">🏢 Enterprise Ready</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">Workspace verification completed</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">High user engagement metrics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">Advanced fraud prevention</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-primary text-lg px-8 py-4 h-auto hover-3d"
                  data-testid="button-apply-partnership"
                >
                  <Handshake className="mr-3 h-5 w-5" />
                  Apply for Partnership
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="glass-card text-lg px-8 py-4 h-auto hover-3d"
                  data-testid="button-view-analytics"
                >
                  <BarChart3 className="mr-3 h-5 w-5" />
                  View Analytics Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}