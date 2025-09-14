import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { 
  Gift, Star, Award, CheckCircle, Loader2, Zap, Clock, Users, ArrowRight, 
  Shield, TrendingUp, CreditCard, Smartphone, Eye, Play, Moon, Sun,
  DollarSign, Target, Calendar, Trophy, Rocket
} from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [surveysPerDay, setSurveysPerDay] = useState([3]);
  const [tasksPerWeek, setTasksPerWeek] = useState([10]);
  const [animatedEarnings, setAnimatedEarnings] = useState(0);
  const { signIn, signUp, isSigningIn, isSigningUp } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Calculate potential monthly earnings with enhanced algorithm
  const calculateEarnings = () => {
    const surveysDaily = surveysPerDay[0];
    const tasksWeekly = tasksPerWeek[0];
    const surveyEarnings = surveysDaily * 30 * 1.8; // Enhanced rate
    const taskEarnings = tasksWeekly * 4 * 4.2; // Premium task rates
    const bonusMultiplier = surveysDaily >= 5 ? 1.15 : 1; // Streak bonus
    return Math.round((surveyEarnings + taskEarnings) * bonusMultiplier);
  };

  // Animate earnings counter for visual feedback
  useEffect(() => {
    const targetEarnings = calculateEarnings();
    const duration = 800;
    const steps = 60;
    const increment = targetEarnings / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      current += increment;
      setAnimatedEarnings(Math.min(Math.round(current), targetEarnings));
      
      if (step >= steps) {
        setAnimatedEarnings(targetEarnings);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [surveysPerDay, tasksPerWeek]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Revolutionary Header with Theme Toggle */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-3 cursor-pointer group" data-testid="logo-rewardspay">
              <div className="gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-normal">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="text-shimmer font-bold text-2xl">RewardsPay</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              How it Works
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Reviews
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Partners
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="hover:scale-110 transition-transform duration-fast"
              data-testid="theme-toggle"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex border-primary/20 hover:border-primary text-primary hover:bg-primary/5">
              Sign In
            </Button>
            <Button className="button-glow bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Earning
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - World-Class Design */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 gradient-warm opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full gradient-neon opacity-5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 fade-up">
              {/* Trust Badge */}
              <Badge className="mb-6 text-lg px-6 py-3 bg-trust-verified/10 text-trust-verified border-trust-verified/20 hover:scale-105 transition-transform duration-fast" data-testid="trust-badge">
                <Shield className="h-4 w-4 mr-2" />
                Verified & Secure Platform
              </Badge>

              {/* Revolutionary Headline */}
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="block text-foreground">Earn Money</span>
                <span className="block text-shimmer">Doing What You</span>
                <span className="block gradient-primary bg-clip-text text-transparent">Already Do</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                Join <span className="font-bold text-primary">2.3 million users</span> earning real money through surveys, 
                tasks, and offers. <span className="font-semibold">Average earning: $127/month</span>
              </p>

              {/* Live Stats Strip */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="text-center fade-up" style={{ animationDelay: '100ms' }}>
                  <div className="text-3xl font-bold text-data-positive">$2.3M+</div>
                  <div className="text-sm text-muted-foreground">Paid to Users</div>
                </div>
                <div className="text-center fade-up" style={{ animationDelay: '200ms' }}>
                  <div className="text-3xl font-bold text-data-primary">2.3M</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center fade-up" style={{ animationDelay: '300ms' }}>
                  <div className="text-3xl font-bold text-data-secondary">4.8★</div>
                  <div className="text-sm text-muted-foreground">App Store Rating</div>
                </div>
                <div className="text-center fade-up" style={{ animationDelay: '400ms' }}>
                  <div className="text-3xl font-bold text-trust-secure">99.7%</div>
                  <div className="text-sm text-muted-foreground">Security Score</div>
                </div>
              </div>
            </div>

            {/* Interactive Earnings Calculator - Revolutionary Design */}
            <Card className="glass-card max-w-4xl mx-auto mb-16 hover:scale-105 transition-all duration-slow shadow-2xl" data-testid="earnings-calculator">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold mb-4">
                  <span className="gradient-primary bg-clip-text text-transparent">Your Earning Potential</span>
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Customize your activity level and see your potential monthly earnings
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Surveys Per Day Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-foreground">Daily Surveys</Label>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-3 py-1">
                      {surveysPerDay[0]} surveys
                    </Badge>
                  </div>
                  <Slider
                    value={surveysPerDay}
                    onValueChange={setSurveysPerDay}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                    data-testid="surveys-slider"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 survey</span>
                    <span>10+ surveys</span>
                  </div>
                </div>

                {/* Tasks Per Week Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-foreground">Weekly Tasks</Label>
                    <Badge className="bg-success/10 text-success border-success/20 text-lg px-3 py-1">
                      {tasksPerWeek[0]} tasks
                    </Badge>
                  </div>
                  <Slider
                    value={tasksPerWeek}
                    onValueChange={setTasksPerWeek}
                    max={25}
                    min={5}
                    step={1}
                    className="w-full"
                    data-testid="tasks-slider"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5 tasks</span>
                    <span>25+ tasks</span>
                  </div>
                </div>

                {/* Animated Earnings Display */}
                <div className="text-center p-8 gradient-primary rounded-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-white/80 text-lg mb-2">Your potential monthly earnings:</p>
                    <div className="text-6xl font-bold text-white mb-2" data-testid="animated-earnings">
                      ${animatedEarnings}
                    </div>
                    <p className="text-white/80">
                      Based on {surveysPerDay[0]} daily surveys and {tasksPerWeek[0]} weekly tasks
                      {surveysPerDay[0] >= 5 && <span className="block text-yellow-200 font-semibold">+ 15% streak bonus!</span>}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button size="lg" className="flex-1 h-14 text-lg button-glow bg-primary hover:bg-primary/90" data-testid="start-earning-cta">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Earning Now
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 h-14 text-lg border-primary/20 hover:border-primary text-primary hover:bg-primary/5">
                    <Play className="mr-2 h-5 w-5" />
                    Watch How It Works
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Millions Worldwide</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our security-first approach and transparent payouts have earned the trust of users and partners globally.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="glass-card text-center hover:scale-105 transition-transform duration-fast">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-trust-secure mx-auto mb-3" />
                <p className="font-semibold">Bank-Grade Security</p>
                <p className="text-sm text-muted-foreground">SSL Encrypted</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center hover:scale-105 transition-transform duration-fast">
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-trust-verified mx-auto mb-3" />
                <p className="font-semibold">Instant Payouts</p>
                <p className="text-sm text-muted-foreground">PayPal & Gift Cards</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center hover:scale-105 transition-transform duration-fast">
              <CardContent className="pt-6">
                <Star className="h-8 w-8 text-warning mx-auto mb-3" />
                <p className="font-semibold">4.8/5 Rating</p>
                <p className="text-sm text-muted-foreground">50K+ Reviews</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center hover:scale-105 transition-transform duration-fast">
              <CardContent className="pt-6">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-3" />
                <p className="font-semibold">Award Winning</p>
                <p className="text-sm text-muted-foreground">Best Rewards App</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <Card className="glass-card shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Join RewardsPay Today</CardTitle>
                <p className="text-muted-foreground">Start earning money in under 2 minutes</p>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="signup" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="signin" data-testid="tab-signin">Sign In</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div>
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="mt-1"
                          data-testid="signup-email-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="mt-1"
                          data-testid="signup-password-input"
                        />
                      </div>
                      <Button type="submit" className="w-full button-glow" disabled={isSigningUp} data-testid="signup-button">
                        {isSigningUp ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account & Start Earning'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="mt-1"
                          data-testid="signin-email-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signin-password">Password</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="mt-1"
                          data-testid="signin-password-input"
                        />
                      </div>
                      <Button type="submit" className="w-full button-glow" disabled={isSigningIn} data-testid="signin-button">
                        {isSigningIn ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          'Sign In to Your Account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>Join over 2.3 million users already earning money</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <span className="text-trust-verified">✓ Free to join</span>
                    <span className="text-trust-verified">✓ Instant payouts</span>
                    <span className="text-trust-verified">✓ No fees</span>
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
              <h3 className="font-semibold mb-3">Company</h3>
              <div className="space-y-2 text-sm">
                <Link href="/partnerships"><div className="text-muted-foreground hover:text-primary cursor-pointer">Partnerships</div></Link>
                <Link href="/user-metrics"><div className="text-muted-foreground hover:text-primary cursor-pointer">Metrics</div></Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <div className="space-y-2 text-sm">
                <Link href="/gdpr-compliance"><div className="text-muted-foreground hover:text-primary cursor-pointer">Privacy</div></Link>
                <Link href="/fraud-detection"><div className="text-muted-foreground hover:text-primary cursor-pointer">Security</div></Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Developers</h3>
              <div className="space-y-2 text-sm">
                <Link href="/postback-implementation"><div className="text-muted-foreground hover:text-primary cursor-pointer">API Docs</div></Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">24/7 Chat Support</div>
                <div className="text-muted-foreground">help@rewardspay.com</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RewardsPay. All rights reserved. | Earn money the smart way.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}