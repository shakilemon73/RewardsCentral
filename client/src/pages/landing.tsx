import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Gift, Star, Award, CheckCircle, Loader2, Zap, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

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
      {/* Header - Modern Glassmorphism */}
      <header className="sticky top-0 z-50 glass-card border-0 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="animated-gradient text-white px-6 py-3 rounded-2xl font-bold text-2xl hover-3d cursor-pointer">
            RewardsPay
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/partnerships">
              <Button variant="ghost" className="hover:bg-white/10 hover:backdrop-blur-sm text-lg px-6" data-testid="button-partnerships">
                For Businesses
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-white/20 hover:border-white/40 hover:bg-white/10 backdrop-blur-sm text-lg px-6"
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Sign In
            </Button>
            <Button 
              className="gradient-primary button-glow shadow-lg hover:shadow-2xl text-lg px-6"
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Modern 3D Layout */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-gradient opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/50 to-background/90"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-success/20 rounded-full blur-xl float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-accent/20 rounded-full blur-xl float" style={{animationDelay: '4s'}}></div>
        
        <div className="container mx-auto px-6 py-32 text-center relative z-10">
          <div className="fade-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-none">
              <span className="text-shimmer">Real rewards.</span>
              <br />
              <span className="text-foreground">From real tasks.</span>
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">
                For instant earnings.
              </span>
            </h1>
          </div>
          
          <div className="fade-up" style={{animationDelay: '0.2s'}}>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-16 max-w-4xl mx-auto font-light">
              Complete surveys, watch ads, and claim offers to earn points in 
              <span className="font-semibold text-primary"> minutes, not hours</span>.
            </p>
          </div>
          
          <div className="fade-up flex flex-col md:flex-row gap-6 justify-center mb-20" style={{animationDelay: '0.4s'}}>
            <Button 
              size="lg" 
              className="gradient-primary button-glow text-xl px-10 py-6 h-auto rounded-2xl hover-3d shadow-2xl"
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start earning now <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="glass-card border-primary/30 hover:border-primary/60 text-xl px-10 py-6 h-auto rounded-2xl hover-3d"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See how it works
            </Button>
          </div>

          <div className="fade-up" style={{animationDelay: '0.6s'}}>
            <p className="text-lg text-muted-foreground mb-12 font-medium">Trusted by thousands of users worldwide</p>
          </div>
          
          {/* Trust Stats - Modern Cards */}
          <div className="fade-up grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto" style={{animationDelay: '0.8s'}}>
            <div className="glass-card p-8 text-center hover-3d card-hover">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3 text-shimmer">50K+</div>
              <div className="text-base text-muted-foreground">Active Users</div>
            </div>
            <div className="glass-card p-8 text-center hover-3d card-hover" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl md:text-5xl font-bold text-success mb-3">$250K+</div>
              <div className="text-base text-muted-foreground">Rewards Paid Out</div>
            </div>
            <div className="glass-card p-8 text-center hover-3d card-hover" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-3">4.9★</div>
              <div className="text-base text-muted-foreground">User Rating</div>
            </div>
            <div className="glass-card p-8 text-center hover-3d card-hover" style={{animationDelay: '0.3s'}}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3">2min</div>
              <div className="text-base text-muted-foreground">Average Payout Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Modern Layout */}
      <section id="how-it-works" className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 gradient-warm opacity-5"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-success/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 fade-up">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-shimmer">RewardsPay</span> makes it easy to{' '}
              <span className="gradient-primary bg-clip-text text-transparent">earn real money</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
              Three simple steps to start earning money online today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="fade-up glass-card p-10 text-center hover-3d card-hover relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center shadow-2xl">
                  <Zap className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-3xl font-bold text-foreground mb-6">Quick setup</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Users sign up and start earning in under{' '}
                  <span className="font-semibold text-primary">2 minutes</span>.
                </p>
              </div>
            </div>
            
            <div className="fade-up glass-card p-10 text-center hover-3d card-hover relative" style={{animationDelay: '0.2s'}}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 gradient-warm rounded-full flex items-center justify-center shadow-2xl">
                  <Clock className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-3xl font-bold text-foreground mb-6">Instant rewards</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Complete tasks and see points credited to your account{' '}
                  <span className="font-semibold text-success">immediately</span>.
                </p>
              </div>
            </div>
            
            <div className="fade-up glass-card p-10 text-center hover-3d card-hover relative" style={{animationDelay: '0.4s'}}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 gradient-neon rounded-full flex items-center justify-center shadow-2xl">
                  <Gift className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-3xl font-bold text-foreground mb-6">Real payouts</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Redeem points for gift cards and PayPal cash with{' '}
                  <span className="font-semibold text-accent">no minimums</span>.
                </p>
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
              Complete surveys, watch ads, and claim offers from trusted partners in minutes, not hours.
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

      {/* Footer - Modern Glassmorphism */}
      <footer className="glass-card border-0 backdrop-blur-lg py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <div className="animated-gradient text-white px-6 py-3 rounded-2xl font-bold text-2xl inline-block mb-6 hover-3d">
              RewardsPay
            </div>
            <p className="text-muted-foreground text-xl font-light">
              Building a better world with better rewards.
            </p>
          </div>
          <div className="text-center text-lg text-muted-foreground">
            <p>© 2025 RewardsPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}