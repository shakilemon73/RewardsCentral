import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { surveyPostbackService } from "@/lib/surveyPostback";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SurveyCallback() {
  const { user } = useAuth();
  const { toast } = useToast();
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
              window.location.href = '/tasks';
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
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Processing Survey Result</h2>
              <p className="text-muted-foreground text-sm">Please wait while we verify your survey completion...</p>
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
          <div className="flex justify-center mb-4">
            {completionResult?.success ? (
              <CheckCircle className="h-16 w-16 text-success" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-xl">
            {completionResult?.success ? "Survey Completed!" : "Survey Processing Failed"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {completionResult?.success ? (
            <div className="space-y-3">
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <p className="text-success font-semibold">
                  +{completionResult.points} Points Earned
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  From {completionResult.provider} Survey
                </p>
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

              <p className="text-sm text-muted-foreground">
                Redirecting to tasks page in 3 seconds...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive font-medium">Processing Error</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {completionResult?.error || "Unable to process survey completion"}
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Please contact support if this issue persists.
              </p>
            </div>
          )}

          <div className="pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/tasks" data-testid="button-back-to-tasks">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tasks
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}