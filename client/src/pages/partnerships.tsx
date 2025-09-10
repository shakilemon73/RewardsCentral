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

export default function Partnerships() {
  const handlePartnershipInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle partnership form submission
    console.log("Partnership inquiry submitted");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="gradient-bg text-white px-4 py-2 rounded-lg font-bold text-xl">
            RewardsPay
          </div>
          <div className="hidden md:flex space-x-4">
            <Link href="/">
              <Button variant="outline" data-testid="button-home">
                Home
              </Button>
            </Link>
            <Button 
              onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-contact"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            Partnership Opportunities
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Partner with
            <br />
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              RewardsPay
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Connect with our engaged community of 50,000+ active users. 
            Drive customer acquisition, brand awareness, and market research through our trusted platform.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 h-auto"
              onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-apply-partnership"
            >
              Apply for Partnership <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 h-auto"
              onClick={() => document.getElementById('platform-metrics')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-view-metrics"
            >
              View Platform Metrics
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Metrics */}
      <section id="platform-metrics" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Reach our engaged community
            </h2>
            <p className="text-xl text-muted-foreground">
              Access high-quality users who actively participate in reward-earning activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center" data-testid="metric-active-users">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Active Monthly Users</div>
            </div>
            
            <div className="text-center" data-testid="metric-engagement">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-success" />
              </div>
              <div className="text-4xl font-bold text-success mb-2">85%</div>
              <div className="text-sm text-muted-foreground">User Engagement Rate</div>
            </div>
            
            <div className="text-center" data-testid="metric-completion">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-accent" />
              </div>
              <div className="text-4xl font-bold text-accent mb-2">92%</div>
              <div className="text-sm text-muted-foreground">Task Completion Rate</div>
            </div>
            
            <div className="text-center" data-testid="metric-satisfaction">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-sm text-muted-foreground">Partner Satisfaction</div>
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card data-testid="card-age-demographics">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">18-24</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">25-34</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">35-44</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">45+</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-geographic-reach">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Geographic Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">North America</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Europe</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Asia-Pacific</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-interests">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2 mb-2">Technology</Badge>
                  <Badge variant="secondary" className="mr-2 mb-2">Shopping</Badge>
                  <Badge variant="secondary" className="mr-2 mb-2">Finance</Badge>
                  <Badge variant="secondary" className="mr-2 mb-2">Health</Badge>
                  <Badge variant="secondary" className="mr-2 mb-2">Travel</Badge>
                  <Badge variant="secondary" className="mr-2 mb-2">Food</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-device-usage">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Device Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Mobile</span>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Desktop</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tablet</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the partnership model that best fits your business objectives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative" data-testid="card-survey-research">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Survey & Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access our user base for market research, product feedback, and consumer insights.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Custom survey design</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Demographic targeting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Real-time results</span>
                  </li>
                </ul>
                <Badge>Starting at $0.50/response</Badge>
              </CardContent>
            </Card>
            
            <Card className="relative" data-testid="card-advertising">
              <CardHeader>
                <Target className="h-12 w-12 text-success mb-4" />
                <CardTitle className="text-2xl">Advertising & Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Promote your products and services to highly engaged users through rewarded advertising.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Video advertisements</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">App install campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Lead generation</span>
                  </li>
                </ul>
                <Badge>Performance-based pricing</Badge>
              </CardContent>
            </Card>
            
            <Card className="relative" data-testid="card-brand-partnerships">
              <CardHeader>
                <Handshake className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-2xl">Brand Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Long-term strategic partnerships for ongoing customer acquisition and retention.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Custom integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">White-label solutions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                </ul>
                <Badge>Custom pricing</Badge>
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

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="gradient-bg text-white px-4 py-2 rounded-lg font-bold text-xl inline-block mb-4">
              RewardsPay
            </div>
            <p className="text-muted-foreground">
              Connecting brands with engaged audiences for mutual success.
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 RewardsPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}