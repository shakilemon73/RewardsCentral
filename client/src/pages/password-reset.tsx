import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Check, X, Loader2, Shield, Eye, EyeOff } from 'lucide-react';

// Password Reset Schema
const passwordResetSchema = z.object({
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

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

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

export default function PasswordReset() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Password Reset Form
  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password for strength indicator
  const watchedPassword = form.watch("password");
  const passwordStrength = watchedPassword ? calculatePasswordStrength(watchedPassword) : null;

  // Handle Password Reset
  const onSubmit = async (data: PasswordResetFormData) => {
    setIsResetting(true);
    
    try {
      await updatePassword(data.password);
      toast({
        title: "Password Updated!",
        description: "Your password has been successfully reset. Redirecting to home...",
      });
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password reset failed";
      toast({
        title: "Password Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="glass-card shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
            <CardDescription>
              Choose a strong password to secure your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="••••••••" 
                            type={showPassword ? "text" : "password"}
                            data-testid="input-new-password"
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-new-password"
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
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="••••••••" 
                            type={showConfirmPassword ? "text" : "password"}
                            data-testid="input-confirm-new-password"
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            data-testid="button-toggle-confirm-new-password"
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
                  disabled={isResetting}
                  data-testid="button-reset-password-submit"
                >
                  {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
