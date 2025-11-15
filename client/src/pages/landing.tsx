import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, Star, Award, CheckCircle, Loader2, Zap, Clock, Users, ArrowRight, 
  Shield, TrendingUp, CreditCard, Smartphone, Eye, EyeOff, Play, Moon, Sun,
  DollarSign, Target, Calendar, Trophy, Rocket, Check, X
} from "lucide-react";
import { Link } from "wouter";

// Sign In Schema
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

// Sign Up Schema with password strength validation
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

// Forgot Password Schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Password strength calculator
function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[a-z]/.test(password)) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;
  
  score = Math.min(100, score);
  
  if (score < 50) return { score, label: "Weak", color: "text-destructive" };
  if (score < 75) return { score, label: "Fair", color: "text-warning" };
  if (score < 90) return { score, label: "Good", color: "text-data-secondary" };
  return { score, label: "Strong", color: "text-data-positive" };
}

export default function Landing() {
  const [surveysPerDay, setSurveysPerDay] = useState([3]);
  const [tasksPerWeek, setTasksPerWeek] = useState([10]);
  const [animatedEarnings, setAnimatedEarnings] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  const { signIn, signUp, resetPassword, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // Sign In Form
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign Up Form
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Forgot Password Form
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Watch password for strength indicator
  const watchedPassword = signUpForm.watch("password");
  const passwordStrength = watchedPassword ? calculatePasswordStrength(watchedPassword) : null;

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

  // Handle Sign In
  const onSignIn = async (data: SignInFormData) => {
    setIsSigningIn(true);
    
    try {
      await signIn(data.email, data.password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      setLocation("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign in failed";
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Sign Up
  const onSignUp = async (data: SignUpFormData) => {
    setIsSigningUp(true);
    
    try {
      await signUp(data.email, data.password);
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account. If you don't see the email, you can sign in immediately.",
      });
      
      // Switch to sign in tab
      setTimeout(() => {
        signUpForm.reset();
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign up failed";
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  // Handle Forgot Password
  const onForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsResettingPassword(true);
    
    try {
      await resetPassword(data.email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
      setForgotPasswordOpen(false);
      forgotPasswordForm.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password reset failed";
      toast({
        title: "Password Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Header */}
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
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="hover:scale-110 transition-transform duration-fast"
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 fade-up">
              <Badge className="mb-6 text-lg px-6 py-3 bg-trust-verified/10 text-trust-verified border-trust-verified/20" data-testid="badge-verified">
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

            {/* Earnings Calculator */}
            <Card className="glass-card max-w-4xl mx-auto mb-16 shadow-2xl" data-testid="card-earnings-calculator">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold mb-4">
                  <span className="gradient-primary bg-clip-text text-transparent">Your Earning Potential</span>
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Customize your activity level and see your potential monthly earnings
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
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
                    data-testid="slider-surveys"
                  />
                </div>

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
                    data-testid="slider-tasks"
                  />
                </div>

                <div className="text-center p-8 gradient-primary rounded-2xl">
                  <p className="text-white/80 text-lg mb-2">Your potential monthly earnings:</p>
                  <div className="text-6xl font-bold text-white mb-2" data-testid="text-earnings-amount">
                    ${animatedEarnings}
                  </div>
                  <p className="text-white/80">
                    Based on {surveysPerDay[0]} daily surveys and {tasksPerWeek[0]} weekly tasks
                    {surveysPerDay[0] >= 5 && <span className="block text-yellow-200 font-semibold">+ 15% streak bonus!</span>}
                  </p>
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

      {/* Authentication Forms */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <Card className="glass-card shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
                <CardDescription>Sign in or create an account to start earning</CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2" data-testid="tabs-auth">
                    <TabsTrigger value="signin" data-testid="tab-signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
                  </TabsList>

                  {/* Sign In Tab */}
                  <TabsContent value="signin" className="space-y-4">
                    <Form {...signInForm}>
                      <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="you@example.com" 
                                  type="email"
                                  data-testid="input-signin-email"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="••••••••" 
                                    type={showPassword ? "text" : "password"}
                                    data-testid="input-signin-password"
                                    {...field} 
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                    data-testid="button-toggle-signin-password"
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                            <DialogTrigger asChild>
                              <Button
                                type="button"
                                variant="link"
                                className="px-0"
                                data-testid="button-forgot-password"
                              >
                                Forgot Password?
                              </Button>
                            </DialogTrigger>
                            <DialogContent data-testid="dialog-forgot-password">
                              <DialogHeader>
                                <DialogTitle>Reset Password</DialogTitle>
                                <DialogDescription>
                                  Enter your email address and we'll send you a link to reset your password.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Form {...forgotPasswordForm}>
                                <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4">
                                  <FormField
                                    control={forgotPasswordForm.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="you@example.com" 
                                            type="email"
                                            data-testid="input-reset-email"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <DialogFooter>
                                    <Button
                                      type="submit"
                                      disabled={isResettingPassword}
                                      data-testid="button-send-reset-email"
                                    >
                                      {isResettingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Send Reset Link
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSigningIn}
                          data-testid="button-signin-submit"
                        >
                          {isSigningIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Sign In
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  {/* Sign Up Tab */}
                  <TabsContent value="signup" className="space-y-4">
                    <Form {...signUpForm}>
                      <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="you@example.com" 
                                  type="email"
                                  data-testid="input-signup-email"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="••••••••" 
                                    type={showPassword ? "text" : "password"}
                                    data-testid="input-signup-password"
                                    {...field} 
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                    data-testid="button-toggle-signup-password"
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                              
                              {/* Password Strength Indicator */}
                              {passwordStrength && (
                                <div className="space-y-2 mt-2" data-testid="password-strength-indicator">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Password Strength:</span>
                                    <span className={`font-semibold ${passwordStrength.color}`}>
                                      {passwordStrength.label}
                                    </span>
                                  </div>
                                  <Progress value={passwordStrength.score} className="h-2" />
                                  
                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      {watchedPassword.length >= 8 ? (
                                        <Check className="h-3 w-3 text-data-positive" />
                                      ) : (
                                        <X className="h-3 w-3 text-muted-foreground" />
                                      )}
                                      <span>At least 8 characters</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {/[A-Z]/.test(watchedPassword) ? (
                                        <Check className="h-3 w-3 text-data-positive" />
                                      ) : (
                                        <X className="h-3 w-3 text-muted-foreground" />
                                      )}
                                      <span>One uppercase letter</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {/[a-z]/.test(watchedPassword) ? (
                                        <Check className="h-3 w-3 text-data-positive" />
                                      ) : (
                                        <X className="h-3 w-3 text-muted-foreground" />
                                      )}
                                      <span>One lowercase letter</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {/[0-9]/.test(watchedPassword) ? (
                                        <Check className="h-3 w-3 text-data-positive" />
                                      ) : (
                                        <X className="h-3 w-3 text-muted-foreground" />
                                      )}
                                      <span>One number</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="••••••••" 
                                    type={showConfirmPassword ? "text" : "password"}
                                    data-testid="input-signup-confirm-password"
                                    {...field} 
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    data-testid="button-toggle-confirm-password"
                                  >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSigningUp}
                          data-testid="button-signup-submit"
                        >
                          {isSigningUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Create Account
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
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