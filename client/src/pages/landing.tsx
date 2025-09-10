import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Gift, Star, Award, CheckCircle, Loader2, Zap, Clock, Users, ArrowRight } from "lucide-react";

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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="gradient-bg text-white px-4 py-2 rounded-lg font-bold text-xl">
            RewardsPay
          </div>
          <div className="hidden md:flex space-x-4">
            <Button variant="outline" onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Sign In
            </Button>
            <Button onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Real rewards.
          <br />
          From real tasks.
          <br />
          <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            For instant earnings.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Complete surveys, watch ads, and claim offers to earn points in minutes, not hours.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="text-lg px-8 py-3 h-auto"
            onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start earning now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-3 h-auto"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See how it works
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-8">Trusted by thousands of users worldwide</p>
        
        {/* Trust Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">$250K+</div>
            <div className="text-sm text-muted-foreground">Rewards Paid Out</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">4.9★</div>
            <div className="text-sm text-muted-foreground">User Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2min</div>
            <div className="text-sm text-muted-foreground">Average Payout Time</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              RewardsPay makes it easy to earn real money
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Quick setup</h3>
              <p className="text-lg text-muted-foreground">
                Users sign up and start earning in under 2 minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Instant rewards</h3>
              <p className="text-lg text-muted-foreground">
                Complete tasks and see points credited to your account immediately.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Real payouts</h3>
              <p className="text-lg text-muted-foreground">
                Redeem points for gift cards and PayPal cash with no minimums.
              </p>
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

      {/* Dual Value Proposition */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* For Users */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Get paid to earn rewards - on your terms.
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Earn cash by taking part in interesting tasks from anywhere, whenever you want.
              </p>
              <Button size="lg" className="text-lg px-8 py-3 h-auto mb-8">
                Start earning
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Fair</h4>
                  <p className="text-sm text-muted-foreground">Get paid fairly with transparent rewards and frequent bonuses.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Flexible</h4>
                  <p className="text-sm text-muted-foreground">Choose the tasks you want. Work whenever, wherever you want.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Fun</h4>
                  <p className="text-sm text-muted-foreground">Explore, contribute to, and learn from all kinds of interesting tasks.</p>
                </div>
              </div>
            </div>

            {/* Authentication Card */}
            <div id="auth-section">
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Get Started Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="signin">
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                          <Label htmlFor="signin-email">Email</Label>
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            data-testid="input-signin-email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signin-password">Password</Label>
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            data-testid="input-signin-password"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSigningIn}
                          data-testid="button-signin"
                        >
                          {isSigningIn ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="signup">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            data-testid="input-signup-email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            data-testid="input-signup-password"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSigningUp}
                          data-testid="button-signup"
                        >
                          {isSigningUp ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Put RewardsPay to the test. Today.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start earning in just 2 minutes - or learn more about how it works.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3 h-auto">
              Start earning now
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 h-auto">
              See how it works
            </Button>
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
              Building a better world with better rewards.
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