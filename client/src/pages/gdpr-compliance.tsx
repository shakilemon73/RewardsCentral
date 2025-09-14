import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, CheckCircle, Eye, Download, Trash2, Edit, FileText,
  Users, Lock, Globe, Clock, AlertCircle, Mail, Phone, Building2
} from "lucide-react";
import { Link } from "wouter";

export default function GDPRCompliance() {
  const [emailForRequest, setEmailForRequest] = useState("");
  const [requestType, setRequestType] = useState("access");
  const { toast } = useToast();

  const handleDataRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Data Request Submitted",
      description: "We'll process your request within 30 days as required by GDPR.",
    });
    setEmailForRequest("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Privacy-Focused Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-3 cursor-pointer group" data-testid="logo-rewardspay">
              <div className="gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-normal">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <span className="text-shimmer font-bold text-2xl">RewardsPay Privacy</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Your Rights
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Data Processing
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Contact DPO
            </Button>
            <Link href="/fraud-detection">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
                Security
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('data-request')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden sm:inline-flex border-primary/20 hover:border-primary text-primary hover:bg-primary/5"
            >
              Data Request
            </Button>
            <Button 
              onClick={() => document.getElementById('contact-dpo')?.scrollIntoView({ behavior: 'smooth' })}
              className="button-glow bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Contact DPO
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 gradient-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 gradient-warm opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 text-lg px-6 py-3 bg-trust-secure/10 text-trust-secure border-trust-secure/20" data-testid="gdpr-badge">
              <Shield className="h-4 w-4 mr-2" />
              GDPR Compliant
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="block text-foreground">Your Privacy</span>
              <span className="block text-shimmer">Is Our Priority</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              We're committed to protecting your personal data and giving you full control 
              over your information in compliance with <span className="font-bold text-primary">GDPR regulations</span>.
            </p>

            {/* Privacy Commitment Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center fade-up">
                <div className="text-4xl font-bold text-trust-verified mb-2">100%</div>
                <div className="text-muted-foreground">Transparent</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '100ms' }}>
                <div className="text-4xl font-bold text-trust-secure mb-2">30 Days</div>
                <div className="text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '200ms' }}>
                <div className="text-4xl font-bold text-data-primary mb-2">Zero</div>
                <div className="text-muted-foreground">Data Breaches</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '300ms' }}>
                <div className="text-4xl font-bold text-trust-certified mb-2">2.3M</div>
                <div className="text-muted-foreground">Protected Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your GDPR Rights */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Your Data Rights Under GDPR</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              As a user in the EU (or anywhere we operate), you have comprehensive rights 
              over your personal data that we fully respect and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Right to Access */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow text-center" data-testid="right-access">
              <CardHeader>
                <div className="w-16 h-16 bg-data-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-data-primary" />
                </div>
                <CardTitle className="text-lg">Right to Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Request a copy of all personal data we hold about you, including processing purposes.
                </p>
                <Badge className="bg-data-primary/10 text-data-primary border-data-primary/20 text-xs">
                  Free of charge
                </Badge>
              </CardContent>
            </Card>

            {/* Right to Rectification */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow text-center" data-testid="right-rectification">
              <CardHeader>
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit className="h-8 w-8 text-warning" />
                </div>
                <CardTitle className="text-lg">Right to Rectify</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Correct any inaccurate or incomplete personal data we hold about you.
                </p>
                <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                  Immediate action
                </Badge>
              </CardContent>
            </Card>

            {/* Right to Erasure */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow text-center" data-testid="right-erasure">
              <CardHeader>
                <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-8 w-8 text-error" />
                </div>
                <CardTitle className="text-lg">Right to Erasure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Request deletion of your personal data when there's no legitimate reason for us to continue processing it.
                </p>
                <Badge className="bg-error/10 text-error border-error/20 text-xs">
                  "Right to be forgotten"
                </Badge>
              </CardContent>
            </Card>

            {/* Right to Portability */}
            <Card className="glass-card hover:scale-105 transition-all duration-slow text-center" data-testid="right-portability">
              <CardHeader>
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-lg">Data Portability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Receive your data in a structured, machine-readable format to transfer to another service.
                </p>
                <Badge className="bg-success/10 text-success border-success/20 text-xs">
                  JSON/CSV format
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Processing Information */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How We Process Your Data</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete transparency about what data we collect, why we collect it, 
              and how we use it to provide our services.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Data Collection Card */}
            <Card className="glass-card" data-testid="data-collection-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Data We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-data-primary">Account Information</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Email address (required for account)</li>
                      <li>• Password (encrypted)</li>
                      <li>• Profile preferences</li>
                      <li>• Payment information (for rewards)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-data-secondary">Usage Data</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Survey responses (anonymized)</li>
                      <li>• Task completion history</li>
                      <li>• App interaction patterns</li>
                      <li>• Device and browser information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Basis Card */}
            <Card className="glass-card" data-testid="legal-basis-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <FileText className="h-6 w-6 text-success" />
                  Legal Basis for Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Contract</h4>
                    <p className="text-sm text-muted-foreground">
                      Processing necessary to provide our rewards service to you
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <h4 className="font-semibold mb-2">Consent</h4>
                    <p className="text-sm text-muted-foreground">
                      For marketing communications and optional features
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-semibold mb-2">Legitimate Interest</h4>
                    <p className="text-sm text-muted-foreground">
                      For fraud prevention and service improvement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention Card */}
            <Card className="glass-card" data-testid="data-retention-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Clock className="h-6 w-6 text-warning" />
                  Data Retention Periods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-medium">Account data</span>
                    <Badge className="bg-info/10 text-info border-info/20">
                      While account is active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-medium">Survey responses</span>
                    <Badge className="bg-success/10 text-success border-success/20">
                      Anonymized permanently
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-medium">Payment records</span>
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      7 years (legal requirement)
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Marketing data</span>
                    <Badge className="bg-error/10 text-error border-error/20">
                      Until consent withdrawn
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Subject Request Form */}
      <section id="data-request" className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Submit a Data Request</h2>
              <p className="text-xl text-muted-foreground">
                Exercise your GDPR rights by submitting a request. We'll respond within 30 days.
              </p>
            </div>

            <Card className="glass-card shadow-2xl" data-testid="data-request-form">
              <CardContent className="p-8">
                <form onSubmit={handleDataRequest} className="space-y-6">
                  <div>
                    <Label htmlFor="request-email">Your Email Address *</Label>
                    <Input
                      id="request-email"
                      type="email"
                      value={emailForRequest}
                      onChange={(e) => setEmailForRequest(e.target.value)}
                      required
                      className="mt-2"
                      placeholder="Enter the email associated with your account"
                      data-testid="request-email-input"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll verify this matches your account email for security
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="request-type">Type of Request *</Label>
                    <select
                      id="request-type"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      data-testid="request-type-select"
                    >
                      <option value="access">Data Access - Get a copy of my data</option>
                      <option value="rectification">Data Rectification - Correct my data</option>
                      <option value="erasure">Data Erasure - Delete my data</option>
                      <option value="portability">Data Portability - Transfer my data</option>
                      <option value="restriction">Restriction of Processing</option>
                      <option value="objection">Object to Processing</option>
                      <option value="withdraw">Withdraw Consent</option>
                    </select>
                  </div>

                  <div className="bg-info-light border border-info-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-info mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-info mb-1">Important Information:</p>
                        <ul className="text-info space-y-1">
                          <li>• We'll verify your identity before processing any request</li>
                          <li>• Response time: Up to 30 days (may extend to 90 days for complex requests)</li>
                          <li>• Some data may be retained for legal or security purposes</li>
                          <li>• Account deletion requests will permanently remove access to our services</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 text-lg button-glow bg-primary hover:bg-primary/90"
                    data-testid="submit-data-request"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Submit Data Request
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t text-center">
                  <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-trust-secure" />
                      <span>Secure Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-info" />
                      <span>30-Day Response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-trust-verified" />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact DPO Section */}
      <section id="contact-dpo" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Contact Our Data Protection Officer</h2>
              <p className="text-xl text-muted-foreground">
                Have specific privacy questions? Our DPO is here to help with any concerns 
                about your data and privacy rights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-card p-8" data-testid="dpo-contact-card">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    Data Protection Officer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">dpo@rewardspay.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-GDPR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        RewardsPay Data Protection<br/>
                        123 Privacy Street<br/>
                        San Francisco, CA 94102
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card p-8" data-testid="supervisory-authority-card">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Globe className="h-6 w-6 text-accent" />
                    EU Supervisory Authority
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    You also have the right to lodge a complaint with your local data protection authority:
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Ireland (Lead Authority)</p>
                      <p className="text-muted-foreground">Data Protection Commission</p>
                      <p className="text-muted-foreground">info@dataprotection.ie</p>
                    </div>
                    <div>
                      <p className="font-medium">General EU Portal</p>
                      <p className="text-muted-foreground">
                        <a href="https://ec.europa.eu/justice/article-29/structure/data-protection-authorities/index_en.htm" 
                           className="text-primary hover:underline" 
                           target="_blank" 
                           rel="noopener noreferrer">
                          Find your local authority
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/10 py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Privacy</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Privacy Policy</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Cookie Policy</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Data Processing</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Your Rights</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Access Your Data</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Delete Your Data</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Withdraw Consent</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Compliance</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">GDPR Compliance</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">CCPA Compliance</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Data Transfers</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">Data Protection Officer</div>
                <div className="text-muted-foreground">dpo@rewardspay.com</div>
                <div className="text-muted-foreground">Privacy Helpline</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RewardsPay. All rights reserved. | Your data, your rights.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}