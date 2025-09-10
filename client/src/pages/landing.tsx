import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Gift, Star, Award, CheckCircle, Loader2, Zap, Clock, Users, ArrowRight } from "lucide-react";
import usersEarningImg from "@assets/generated_images/Happy_users_earning_rewards_1706e547.png";
import { Link } from "wouter";
import ModernFooter from "@/components/modern-footer";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, isSigningIn, isSigningUp } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      // User will automatically be redirected when isAuthenticated becomes true
    } catch (error) {
      // Completely suppress error logging to prevent overlay
      const errorMessage = error instanceof Error ? error.message : "Unable to connect. Please check your internet connection.";
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({ email, password });
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      toast({
        title: "Sign Up Failed", 
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header - Single CTA Focus */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="gradient-primary bg-clip-text text-transparent font-bold text-2xl cursor-pointer" data-testid="logo-rewardspay">
              RewardsPay
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/partnerships">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" data-testid="link-partnerships">
                For Researchers
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-how-it-works"
            >
              How it Works
            </Button>
            <Button 
              variant="outline" 
              className="border-primary/20 hover:border-primary text-primary hover:bg-primary/5"
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean & Focused */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Social Proof Above Fold */}
            <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full border-2 border-background"></div>
                <div className="w-8 h-8 bg-success/20 rounded-full border-2 border-background"></div>
                <div className="w-8 h-8 bg-accent/20 rounded-full border-2 border-background"></div>
              </div>
              <span>Trusted by <span className="font-semibold text-foreground">50,000+</span> users</span>
            </div>

            {/* Clear Value Proposition */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
              Earn <span className="gradient-primary bg-clip-text text-transparent">real money</span>
              <br />from simple tasks
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Complete surveys and tasks from trusted providers. Get paid instantly to PayPal or gift cards.
            </p>

            {/* Three Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Instant Payouts</div>
                  <div className="text-sm text-muted-foreground">2-minute withdrawals</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Easy Tasks</div>
                  <div className="text-sm text-muted-foreground">No skills required</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Top Rated</div>
                  <div className="text-sm text-muted-foreground">4.9/5 user rating</div>
                </div>
              </div>
            </div>
            
            {/* Single Primary CTA */}
            <div className="mb-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-get-started"
              >
                Start Earning Free Money <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3">No credit card required • Takes 30 seconds</p>
            </div>

            {/* Payout Proof */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-6 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium text-success">$12,847</span>
                <span className="text-muted-foreground">paid out yesterday</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Real earnings from real users • Updated daily
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple & Clear */}
      <section id="how-it-works" className="py-24 bg-muted/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start earning money in three simple steps
            </p>
          </div>
        
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card/50 border border-border/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Sign Up Free</h3>
              <p className="text-muted-foreground">Create your account in 30 seconds. No credit card required.</p>
            </div>
            <div className="text-center p-6 bg-card/50 border border-border/50 rounded-lg">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Complete Tasks</h3>
              <p className="text-muted-foreground">Take surveys, watch ads, and complete offers at your own pace.</p>
            </div>
            <div className="text-center p-6 bg-card/50 border border-border/50 rounded-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Get Paid</h3>
              <p className="text-muted-foreground">Cash out to PayPal or choose from 100+ gift cards instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Sided Success Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            
            {/* Left - User Appeal */}
            <div className="fade-up">
              <div className="relative">
                <img 
                  src={usersEarningImg} 
                  alt="Happy users earning rewards on RewardsPay" 
                  className="w-full h-auto rounded-3xl shadow-2xl hover-3d"
                  data-testid="img-users-earning"
                  onError={(e) => console.error('Image failed to load:', e.currentTarget.src)}
                />
                <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-success">$5M+</div>
                  <div className="text-sm text-muted-foreground">Paid to Users</div>
                </div>
              </div>
            </div>
            
            {/* Right - Content for Both */}
            <div className="fade-up" style={{animationDelay: '0.3s'}}>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                <span className="text-shimmer">Two-Sided</span>
                <br />
                <span className="gradient-primary bg-clip-text text-transparent">Success</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                RewardsPay connects engaged users with researchers and brands through trusted survey networks, creating value for everyone involved.
              </p>
              
              {/* Benefits for Users */}
              <div className="bg-card border border-border/50 rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-bold text-primary mb-4">👤 For Users</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">Instant PayPal & gift card rewards</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">High-quality surveys & offers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">24/7 customer support</span>
                  </li>
                </ul>
              </div>
              
              {/* Benefits for Researchers */}
              <div className="bg-card border border-border/50 rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-success mb-4">🔬 For Researchers</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">Quality participant recruitment (50K+ active users)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">Powered by CPX Research network</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-lg">Fast, reliable data collection</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-primary text-lg px-8 py-4 h-auto hover-3d"
                  onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-start-earning"
                >
                  <Gift className="mr-3 h-5 w-5" />
                  Start Earning
                </Button>
                <Link href="/partnerships">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-primary/20 hover:border-primary text-lg px-8 py-4 h-auto"
                    data-testid="button-for-researchers"
                  >
                    <Users className="mr-3 h-5 w-5" />
                    For Researchers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Easily earn from our pool of high-paying tasks
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Complete surveys and tasks from our trusted provider networks in minutes, not hours.
            </p>
            <Button size="lg" className="text-lg px-8 py-3 h-auto">
              Start earning now
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">High-quality</h3>
              <p className="text-lg text-muted-foreground">
                Expect the most rewarding, legitimate tasks from trusted brands. Every time.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Fast</h3>
              <p className="text-lg text-muted-foreground">
                Sign up in 2 minutes. Start earning within 5 minutes. Cash out instantly.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Easy</h3>
              <p className="text-lg text-muted-foreground">
                Simple tasks on any device. Complete surveys, watch ads, or claim offers of any size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-16">
            Trusted for years by users looking to earn extra income
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <blockquote className="bg-background p-8 rounded-lg border">
              <p className="text-lg text-muted-foreground mb-6">
                "I'd recommend RewardsPay to anyone looking to quickly earn extra money, especially if they need flexible earning opportunities. I honestly don't think my side income would have been possible without RewardsPay."
              </p>
              <cite className="font-semibold text-foreground">Sarah Johnson, College Student</cite>
            </blockquote>
            
            <blockquote className="bg-background p-8 rounded-lg border">
              <p className="text-lg text-muted-foreground mb-6">
                "We're thrilled with RewardsPay. The platform's rapid task completion and exceptional payout reliability - evident in our 99%+ successful redemption rate - makes it our go-to earning platform."
              </p>
              <cite className="font-semibold text-foreground">Mike Chen, Freelancer</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Two-Sided Platform - Modern Bento Grid */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 fade-up">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              A platform that{' '}
              <span className="text-shimmer">works for everyone</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
              Connecting engaged users with businesses that need their attention
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-8xl mx-auto">
            {/* For Users - Enhanced Card */}
            <div className="fade-up glass-card p-12 hover-3d card-hover relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 gradient-primary rounded-full blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-8 float">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-6">For Users</h3>
                <h4 className="text-2xl font-semibold gradient-primary bg-clip-text text-transparent mb-6">
                  Get paid to earn rewards - on your terms.
                </h4>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  Earn cash by taking part in interesting tasks from anywhere, whenever you want.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="text-center p-4">
                    <h5 className="font-bold text-primary text-lg mb-3">Fair</h5>
                    <p className="text-muted-foreground">Get paid fairly with transparent rewards</p>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="font-bold text-success text-lg mb-3">Flexible</h5>
                    <p className="text-muted-foreground">Choose tasks that interest you</p>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="font-bold text-accent text-lg mb-3">Fast</h5>
                    <p className="text-muted-foreground">Get paid within minutes</p>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="gradient-primary button-glow text-xl px-8 py-4 h-auto rounded-2xl w-full hover-3d shadow-2xl"
                  onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start earning now
                </Button>
              </div>
            </div>

            {/* For Businesses - Enhanced Card */}
            <div className="fade-up glass-card p-12 hover-3d card-hover relative overflow-hidden" style={{animationDelay: '0.2s'}}>
              <div className="absolute -top-20 -right-20 w-40 h-40 gradient-warm rounded-full blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 gradient-warm rounded-2xl flex items-center justify-center mb-8 float" style={{animationDelay: '2s'}}>
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-6">For Businesses</h3>
                <h4 className="text-2xl font-semibold gradient-warm bg-clip-text text-transparent mb-6">
                  Reach 50,000+ engaged users instantly.
                </h4>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  Connect with our active community for surveys, advertising, and customer acquisition campaigns.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="text-center p-4">
                    <h5 className="font-bold text-accent text-lg mb-3">Quality</h5>
                    <p className="text-muted-foreground">High-engagement user base</p>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="font-bold text-success text-lg mb-3">Scale</h5>
                    <p className="text-muted-foreground">Reach thousands instantly</p>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="font-bold text-primary text-lg mb-3">Results</h5>
                    <p className="text-muted-foreground">Measurable ROI and insights</p>
                  </div>
                </div>
                
                <Link href="/partnerships">
                  <Button 
                    size="lg" 
                    className="glass-card border-primary/30 hover:border-primary/60 text-xl px-8 py-4 h-auto rounded-2xl w-full hover-3d"
                    variant="outline"
                  >
                    Partner with us <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Registration Section - Modern Glassmorphism */}
      <section id="auth-section" className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 gradient-neon opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-shimmer">Get Started Today</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Join thousands of users earning money with our platform
            </p>
          </div>
          
          <div className="max-w-lg mx-auto fade-up" style={{animationDelay: '0.2s'}}>
            <Card className="glass-card border-0 shadow-2xl hover-3d">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                  Start Your Journey
                </CardTitle>
                <p className="text-lg text-muted-foreground mt-2">
                  Sign up in seconds and start earning immediately
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 glass-card h-14 text-lg">
                    <TabsTrigger value="signin" className="text-lg py-3">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="text-lg py-3">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="mt-8">
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div>
                        <Label htmlFor="signin-email" className="text-lg font-medium">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="mt-2 h-14 text-lg glass-card border-white/20 focus:border-primary/50"
                          data-testid="input-signin-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signin-password" className="text-lg font-medium">Password</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="mt-2 h-14 text-lg glass-card border-white/20 focus:border-primary/50"
                          data-testid="input-signin-password"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full gradient-primary button-glow text-xl py-4 h-auto rounded-2xl hover-3d shadow-2xl" 
                        disabled={isSigningIn}
                        data-testid="button-signin"
                      >
                        {isSigningIn ? (
                          <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          "Sign In to Start Earning"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="mt-8">
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div>
                        <Label htmlFor="signup-email" className="text-lg font-medium">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="mt-2 h-14 text-lg glass-card border-white/20 focus:border-primary/50"
                          data-testid="input-signup-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signup-password" className="text-lg font-medium">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="mt-2 h-14 text-lg glass-card border-white/20 focus:border-primary/50"
                          data-testid="input-signup-password"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full gradient-primary button-glow text-xl py-4 h-auto rounded-2xl hover-3d shadow-2xl" 
                        disabled={isSigningUp}
                        data-testid="button-signup"
                      >
                        {isSigningUp ? (
                          <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account & Start Earning"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA - Spectacular Modern Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/80"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/6 w-20 h-20 bg-white/10 rounded-full blur-xl float"></div>
        <div className="absolute bottom-1/4 right-1/6 w-16 h-16 bg-white/15 rounded-full blur-xl float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl float" style={{animationDelay: '1.5s'}}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="fade-up">
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-none">
              <span className="text-shimmer">Start earning</span>
              <br />
              <span className="text-white">today</span>
            </h2>
          </div>
          
          <div className="fade-up max-w-4xl mx-auto mb-12" style={{animationDelay: '0.2s'}}>
            <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
              Join thousands of users who are already earning 
              <span className="font-semibold text-white"> real money</span> with RewardsPay.
            </p>
          </div>
          
          <div className="fade-up flex flex-col md:flex-row gap-6 justify-center" style={{animationDelay: '0.4s'}}>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-2xl px-12 py-6 h-auto rounded-2xl hover-3d shadow-2xl font-bold"
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Now <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 hover:border-white/60 text-white hover:bg-white/10 text-2xl px-12 py-6 h-auto rounded-2xl hover-3d backdrop-blur-sm"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          
          <div className="fade-up mt-12" style={{animationDelay: '0.6s'}}>
            <p className="text-white/70 text-lg">
              💳 No credit card required • 🚀 Start earning in under 2 minutes • 💯 100% free to join
            </p>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}