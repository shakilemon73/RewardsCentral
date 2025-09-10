import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { surveyPostbackService } from "@/lib/surveyPostback";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function SurveyCallback() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [completionResult, setCompletionResult] = useState<{
    success: boolean;
    provider?: string;
    points?: number;
    status?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      if (!user?.id) {
        setIsProcessing(false);
        setCompletionResult({
          success: false,
          error: "User not authenticated"
        });
        return;
      }

      try {
        // Handle the survey postback
        const completionData = await surveyPostbackService.handleUrlPostback();
        
        if (completionData) {
          // Validate that this is for the current user
          if (completionData.userId !== user.id) {
            setCompletionResult({
              success: false,
              error: "User ID mismatch - security violation"
            });
            return;
          }

          const success = await surveyPostbackService.processSurveyCompletion(completionData);
          
          setCompletionResult({
            success,
            provider: completionData.provider.toUpperCase(),
            points: completionData.points,
            status: completionData.status,
            error: success ? undefined : "Failed to process completion"
          });

          if (success) {
            toast({
              title: "Survey Completed Successfully!",
              description: `Earned ${completionData.points} points from ${completionData.provider.toUpperCase()}`,
              duration: 5000,
            });

            // Redirect to tasks page after 3 seconds  
            setTimeout(() => {
              setLocation('/tasks');
            }, 3000);
          }
        } else {
          setCompletionResult({
            success: false,
            error: "No valid survey completion data found"
          });
        }
      } catch (error) {
        console.error('Survey callback processing error:', error);
        setCompletionResult({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [user?.id, toast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-primary/20">
          <CardContent className="flex flex-col items-center space-y-6 py-12" role="status" aria-live="polite">
            {/* Reassuring Processing Animation */}
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary" />
              <div className="absolute inset-4 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold text-foreground">Almost Done!</h2>
              <p className="text-muted-foreground">We're processing your survey completion and calculating your reward...</p>
              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>This usually takes just a few seconds</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            {completionResult?.success ? (
              <div className="relative">
                <div className="absolute inset-0 bg-success/20 rounded-full blur-xl" />
                <CheckCircle className="relative h-20 w-20 text-success" />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl" />
                <AlertCircle className="relative h-20 w-20 text-orange-500" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold mb-2">
            {completionResult?.success ? "Congratulations!" : "Something Went Wrong"}
          </CardTitle>
          <p className="text-muted-foreground">
            {completionResult?.success 
              ? "Your survey has been completed successfully" 
              : "Don't worry - we're here to help"}
          </p>
        </CardHeader>
        
        <CardContent className="text-center space-y-4" role="status" aria-live="polite">
          {completionResult?.success ? (
            <div className="space-y-4">
              {/* Celebratory Reward Display */}
              <div className="bg-gradient-to-br from-success/10 to-primary/5 border border-success/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">
                  +{completionResult.points}
                </div>
                <div className="text-success font-semibold mb-1">Points Earned!</div>
                <div className="text-sm text-muted-foreground">
                  From {completionResult.provider} Survey
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  ≈ ${((completionResult.points || 0) / 100).toFixed(2)} cash value
                </div>
              </div>
              
              {completionResult.status === 'disqualified' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-700">
                      You received partial points for attempting this survey
                    </p>
                  </div>
                </div>
              )}

              {/* User-friendly redirect message */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-foreground mb-1">
                  Taking you back to earn more!
                </p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to tasks in 3 seconds...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Reassuring Error Message */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <p className="font-semibold text-orange-800 mb-2">Survey Not Processed</p>
                <p className="text-sm text-orange-700 mb-3">
                  {completionResult?.error || "We couldn't process your survey completion right now"}
                </p>
              </div>
              
              {/* Helpful Recovery Options */}
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">What you can do:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Try the survey again from our tasks page</li>
                  <li>• Check if you completed the full survey</li>
                  <li>• Contact support if the issue continues</li>
                </ul>
              </div>
            </div>
          )}

          <div className="pt-6 space-y-3">
            <Button asChild className="w-full h-12" size="lg" data-testid="button-back-to-tasks">
              <Link href="/tasks">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {completionResult?.success ? "Earn More Points" : "Try More Tasks"}
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full" data-testid="button-home">
              <Link href="/">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}