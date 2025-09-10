import { Link } from "wouter";
import { Gift, Mail, MessageCircle, Shield, FileText, Users, Building, BarChart3, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ModernFooter() {
  return (
    <footer className="relative bg-background border-t overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-primary opacity-5"></div>
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-mocha/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <div className="animated-gradient text-white px-6 py-3 rounded-2xl font-bold text-2xl mb-6 inline-block">
              RewardsPay
            </div>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              Earn points through surveys, offers, and ads. Redeem for PayPal cash and gift cards.
            </p>
            
            {/* Newsletter Signup */}
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-semibold mb-3 text-lg">Stay Updated</h4>
              <div className="flex gap-2">
                <Input 
                  placeholder="Your email" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/60"
                  data-testid="input-newsletter-email"
                />
                <Button className="gradient-primary" data-testid="button-newsletter-subscribe">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-bold text-xl mb-6 gradient-primary bg-clip-text text-transparent">For Users</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-dashboard">
                    <Gift className="h-5 w-5" />
                    Earn Rewards
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/rewards">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-rewards">
                    <Award className="h-5 w-5" />
                    Redeem Gifts
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-profile">
                    <Users className="h-5 w-5" />
                    My Account
                  </button>
                </Link>
              </li>
              <li>
                <a href="mailto:support@rewardspay.com" className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-support">
                  <MessageCircle className="h-5 w-5" />
                  Get Support
                </a>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="font-bold text-xl mb-6 gradient-warm bg-clip-text text-transparent">For Providers</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/partnerships">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-partnerships">
                    <Building className="h-5 w-5" />
                    Partner With Us
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/user-metrics">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-user-metrics">
                    <BarChart3 className="h-5 w-5" />
                    User Metrics & Analytics
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/fraud-detection">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-fraud-detection">
                    <Shield className="h-5 w-5" />
                    Fraud Detection System
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/gdpr-compliance">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-gdpr-compliance">
                    <FileText className="h-5 w-5" />
                    GDPR Compliance
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/postback-implementation">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-postback-implementation">
                    <MessageCircle className="h-5 w-5" />
                    Postback Implementation
                  </button>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-xl mb-6 gradient-neon bg-clip-text text-transparent">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg" data-testid="link-about">
                    About Us
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg flex items-center gap-2" data-testid="link-privacy">
                    <Shield className="h-5 w-5" />
                    Privacy Policy
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg" data-testid="link-terms">
                    Terms of Service
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <button className="text-muted-foreground hover:text-primary transition-colors text-lg" data-testid="link-contact">
                    Contact
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-lg">
            © 2025 RewardsPay. All rights reserved.
          </div>
          
          {/* Trust Indicators for Providers */}
          <div className="flex items-center gap-6">
            <div className="glass-card px-4 py-2 rounded-lg">
              <span className="text-success font-bold text-sm">SSL Secured</span>
            </div>
            <div className="glass-card px-4 py-2 rounded-lg">
              <span className="text-primary font-bold text-sm">99.9% Uptime</span>
            </div>
            <div className="glass-card px-4 py-2 rounded-lg">
              <span className="text-accent font-bold text-sm">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}