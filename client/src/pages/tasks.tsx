import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { supabaseHelpers } from "@/lib/queryClient";
import { surveyApiService } from "@/lib/surveyApi";
import { surveyPostbackService } from "@/lib/surveyPostback";
import { surveyMatchingService } from "@/lib/surveyMatching";
import { getSurveyProviderStatus, isSurveySystemReady } from "@/lib/surveyConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/task-card";
import { FileText, Video, HandHeart, Star, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { Task } from "@shared/schema";

export default function Tasks() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("surveys");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [configStatus, setConfigStatus] = useState(getSurveyProviderStatus());
  const [surveyCounts, setSurveyCounts] = useState<{
    rapidoreach: { count: number; available: boolean; status: string };
    theoremreach: { count: number; available: boolean; status: string };
    cpx: { count: number; available: boolean; status: string };
    bitlabs: { count: number; available: boolean; status: string };
  } | null>(null);

  // Initialize survey postback listener
  useEffect(() => {
    surveyPostbackService.initializePostbackListener();
    
    // Listen for survey completion events
    const handleSurveyCompletion = (event: any) => {
      const { detail } = event;
      toast({
        title: "Survey Completed!",
        description: `Earned ${detail.points} points from ${detail.provider.toUpperCase()}`,
        duration: 5000,
      });
      
      // Reload tasks to refresh user data
      window.location.reload();
    };
    
    window.addEventListener('survey-completed', handleSurveyCompletion);
    return () => window.removeEventListener('survey-completed', handleSurveyCompletion);
  }, [toast]);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      
      // Update configuration status
      setConfigStatus(getSurveyProviderStatus());
      
      try {
        let surveyTasks: Task[] = [];
        
        // Only load survey tasks if survey system is properly configured
        if (isSurveySystemReady()) {
          const userDemographics = {
            birthday: user.birthday,
            gender: user.gender,
            country_code: user.country_code,
            zip_code: user.zip_code
          };
          
          // Get best matched surveys using enhanced targeting
          const bestMatches = await surveyMatchingService.getBestMatchedSurveys(user, 6);
          surveyTasks = bestMatches.map(match => surveyApiService.convertProviderToTask(match.provider));

          // Get survey counts for dashboard
          const counts = await surveyApiService.getSurveyCountsByProvider(user.id, userDemographics);
          setSurveyCounts(counts);
        }
        
        // Get local tasks (ads, offers) from Supabase
        const localTasks = await supabaseHelpers.getTasks();
        const nonSurveyTasks = localTasks.filter(task => task.type !== 'survey');
        
        // Combine survey providers with local tasks
        const allTasks = [...surveyTasks, ...nonSurveyTasks];
        
        setTasks(allTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        // Fallback to local tasks only
        try {
          const localTasks = await supabaseHelpers.getTasks();
          setTasks(localTasks);
        } catch (fallbackError) {
          console.error('Fallback load failed:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, [user?.id]);

  const handleCompleteTask = async (taskId: string, points: number) => {
    if (!user?.id) return;
    setIsCompleting(true);
    
    try {
      // Check if this is an external survey
      const task = tasks.find(t => t.id === taskId);
      const isExternalSurvey = taskId.startsWith('cpx_') || taskId.startsWith('theoremreach_') || taskId.startsWith('bitlabs_') || taskId.startsWith('rapidoreach_');
      
      if (isExternalSurvey && task) {
        // For external survey providers, use enhanced targeting URL
        let provider = taskId.split('_')[0];
        // Handle compound provider names
        if (taskId.startsWith('theoremreach_')) provider = 'theoremreach';
        if (taskId.startsWith('rapidoreach_')) provider = 'rapidoreach';
        
        const userDemographics = {
          birthday: user.birthday,
          gender: user.gender,
          country_code: user.country_code,
          zip_code: user.zip_code
        };
        
        // Special handling for RapidoReach surveys (they use external_url from task)
        if (provider === 'rapidoreach' && task.external_url) {
          console.log(`Opening RapidoReach survey: ${task.external_url}`);
          window.open(task.external_url, '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes');
          
          toast({
            title: "RapidoReach Survey Opened!",
            description: `Premium survey started. Complete it to earn ${task.points} points automatically.`,
            duration: 6000,
          });
        } else {
          // Get optimized provider URL with demographics for other providers
          const providers = surveyApiService.getSurveyProviders(user.id, userDemographics);
          const matchedProvider = providers.find(p => p.provider === provider);
          
          if (matchedProvider) {
            console.log(`Opening survey for provider: ${provider}, URL: ${matchedProvider.url}`);
            window.open(matchedProvider.url, '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes');
            
            // Get match details for better user feedback
            const matchInfo = await surveyMatchingService.getBestMatchedSurveys(user, 3);
            const currentMatch = matchInfo.find(m => m.provider.provider === provider);
            
            toast({
              title: "Survey Platform Opened!",
              description: `${matchedProvider.name} loaded with ${currentMatch?.estimatedCompletionRate ? Math.round(currentMatch.estimatedCompletionRate * 100) : 70}% estimated completion rate. Complete surveys to earn points automatically.`,
              duration: 6000,
            });
          } else {
            console.error(`No provider found for: ${provider}, available providers:`, providers.map(p => p.provider));
            throw new Error(`Survey provider ${provider} not found`);
          }
        }
      } else {
        // Handle local tasks (ads, offers)
        await supabaseHelpers.completeTask(user.id, taskId, points);
        toast({
          title: "Task Completed!",
          description: "Points have been added to your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const surveys = tasks.filter(task => task.type === "survey");
  const ads = tasks.filter(task => task.type === "ad");
  const offers = tasks.filter(task => task.type === "offer");


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="p-4">
        {/* Mobile Header */}
        <header className="bg-card border-b border-border px-4 py-3 -mx-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Tasks</h1>
            <div className="flex items-center space-x-1 bg-success text-success-foreground px-3 py-1 rounded-full text-sm points-animation">
              <span className="font-semibold" data-testid="text-points-mobile">
                {user?.points || 0}
              </span>
              <span className="text-xs">pts</span>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={activeTab === "surveys" ? "default" : "secondary"}
            className="flex-1 text-sm"
            onClick={() => setActiveTab("surveys")}
            data-testid="tab-surveys"
          >
            Surveys
          </Button>
          <Button
            variant={activeTab === "ads" ? "default" : "secondary"}
            className="flex-1 text-sm"
            onClick={() => setActiveTab("ads")}
            data-testid="tab-ads"
          >
            Ads
          </Button>
          <Button
            variant={activeTab === "offers" ? "default" : "secondary"}
            className="flex-1 text-sm"
            onClick={() => setActiveTab("offers")}
            data-testid="tab-offers"
          >
            Offers
          </Button>
        </div>

        {/* Task Content */}
        <div className="space-y-4">
          {activeTab === "surveys" && (
            <div className="space-y-4">
              {/* Survey Platform Cards for Mobile */}
              <div className="grid grid-cols-1 gap-3">
                {/* RapidoReach Mobile */}
                <Card className="border-l-4 border-l-purple-500" data-testid="mobile-platform-rapidoreach">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">RapidoReach</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {surveyCounts?.rapidoreach.count || 0} surveys
                        </Badge>
                        {surveyCounts?.rapidoreach.available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Premium Research • $0.80-$6.00 • 5-25 min</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={!surveyCounts?.rapidoreach.available}
                      onClick={() => {
                        const rapidoTask = surveys.find(t => t.id.startsWith('rapidoreach_'));
                        if (rapidoTask) handleCompleteTask(rapidoTask.id, rapidoTask.points);
                      }}
                      data-testid="mobile-button-rapidoreach"
                    >
                      {surveyCounts?.rapidoreach.available ? 'Start Surveys' : 'Unavailable'}
                    </Button>
                  </CardContent>
                </Card>

                {/* TheoremReach Mobile */}
                <Card className="border-l-4 border-l-blue-500" data-testid="mobile-platform-theoremreach">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">TheoremReach</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {surveyCounts?.theoremreach.count || 0} surveys
                        </Badge>
                        {surveyCounts?.theoremreach.available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Product Research • $0.75-$3.50 • 8-15 min</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={!surveyCounts?.theoremreach.available}
                      onClick={() => {
                        const theoremTask = surveys.find(t => t.id.startsWith('theoremreach_'));
                        if (theoremTask) handleCompleteTask(theoremTask.id, theoremTask.points);
                      }}
                      data-testid="mobile-button-theoremreach"
                    >
                      {surveyCounts?.theoremreach.available ? 'Start Surveys' : 'Unavailable'}
                    </Button>
                  </CardContent>
                </Card>

                {/* CPX Research Mobile */}
                <Card className="border-l-4 border-l-orange-500" data-testid="mobile-platform-cpx">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">CPX Research</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {surveyCounts?.cpx.count || 0} surveys
                        </Badge>
                        {surveyCounts?.cpx.available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Market Research • $0.50-$5.00 • 5-20 min</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={!surveyCounts?.cpx.available}
                      onClick={() => {
                        const cpxTask = surveys.find(t => t.id.startsWith('cpx_'));
                        if (cpxTask) handleCompleteTask(cpxTask.id, cpxTask.points);
                      }}
                      data-testid="mobile-button-cpx"
                    >
                      {surveyCounts?.cpx.available ? 'Start Surveys' : 'Unavailable'}
                    </Button>
                  </CardContent>
                </Card>

                {/* BitLabs Mobile */}
                <Card className="border-l-4 border-l-teal-500" data-testid="mobile-platform-bitlabs">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">BitLabs</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {surveyCounts?.bitlabs.count || 0} surveys
                        </Badge>
                        {surveyCounts?.bitlabs.available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Lifestyle • $0.60-$4.00 • 7-18 min</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={!surveyCounts?.bitlabs.available}
                      onClick={() => {
                        const bitlabsTask = surveys.find(t => t.id.startsWith('bitlabs_'));
                        if (bitlabsTask) handleCompleteTask(bitlabsTask.id, bitlabsTask.points);
                      }}
                      data-testid="mobile-button-bitlabs"
                    >
                      {surveyCounts?.bitlabs.available ? 'Start Surveys' : 'Unavailable'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          {activeTab === "ads" && ads.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              isMobile={true}
              isCompleting={isCompleting}
            />
          ))}
          {activeTab === "offers" && offers.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              isMobile={true}
              isCompleting={isCompleting}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-tasks">
      <h1 className="text-3xl font-bold text-foreground mb-6">Available Tasks</h1>
      
      {/* Survey Platforms Dashboard */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Survey Platforms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* RapidoReach */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" data-testid="platform-rapidoreach">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">RapidoReach</CardTitle>
                {surveyCounts?.rapidoreach.available ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Premium Research
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Surveys</span>
                  <span className="font-bold text-lg" data-testid="count-rapidoreach">
                    {surveyCounts?.rapidoreach.count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Earnings</span>
                  <span className="font-semibold text-green-600">$0.80 - $6.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time</span>
                  <span className="text-sm">5-25 min</span>
                </div>
                <Button 
                  className="w-full" 
                  disabled={!surveyCounts?.rapidoreach.available}
                  onClick={() => {
                    const rapidoTask = surveys.find(t => t.id.startsWith('rapidoreach_'));
                    if (rapidoTask) handleCompleteTask(rapidoTask.id, rapidoTask.points);
                  }}
                  data-testid="button-rapidoreach"
                >
                  {surveyCounts?.rapidoreach.available ? 'Start Surveys' : 'Unavailable'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* TheoremReach */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" data-testid="platform-theoremreach">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">TheoremReach</CardTitle>
                {surveyCounts?.theoremreach.available ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Product Research
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Surveys</span>
                  <span className="font-bold text-lg" data-testid="count-theoremreach">
                    {surveyCounts?.theoremreach.count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Earnings</span>
                  <span className="font-semibold text-green-600">$0.75 - $3.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time</span>
                  <span className="text-sm">8-15 min</span>
                </div>
                <Button 
                  className="w-full" 
                  disabled={!surveyCounts?.theoremreach.available}
                  onClick={() => {
                    const theoremTask = surveys.find(t => t.id.startsWith('theoremreach_'));
                    if (theoremTask) handleCompleteTask(theoremTask.id, theoremTask.points);
                  }}
                  data-testid="button-theoremreach"
                >
                  {surveyCounts?.theoremreach.available ? 'Start Surveys' : 'Unavailable'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CPX Research */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" data-testid="platform-cpx">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">CPX Research</CardTitle>
                {surveyCounts?.cpx.available ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Market Research
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Surveys</span>
                  <span className="font-bold text-lg" data-testid="count-cpx">
                    {surveyCounts?.cpx.count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Earnings</span>
                  <span className="font-semibold text-green-600">$0.50 - $5.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time</span>
                  <span className="text-sm">5-20 min</span>
                </div>
                <Button 
                  className="w-full" 
                  disabled={!surveyCounts?.cpx.available}
                  onClick={() => {
                    const cpxTask = surveys.find(t => t.id.startsWith('cpx_'));
                    if (cpxTask) handleCompleteTask(cpxTask.id, cpxTask.points);
                  }}
                  data-testid="button-cpx"
                >
                  {surveyCounts?.cpx.available ? 'Start Surveys' : 'Unavailable'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* BitLabs */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" data-testid="platform-bitlabs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">BitLabs</CardTitle>
                {surveyCounts?.bitlabs.available ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                Lifestyle
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Surveys</span>
                  <span className="font-bold text-lg" data-testid="count-bitlabs">
                    {surveyCounts?.bitlabs.count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Earnings</span>
                  <span className="font-semibold text-green-600">$0.60 - $4.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time</span>
                  <span className="text-sm">7-18 min</span>
                </div>
                <Button 
                  className="w-full" 
                  disabled={!surveyCounts?.bitlabs.available}
                  onClick={() => {
                    const bitlabsTask = surveys.find(t => t.id.startsWith('bitlabs_'));
                    if (bitlabsTask) handleCompleteTask(bitlabsTask.id, bitlabsTask.points);
                  }}
                  data-testid="button-bitlabs"
                >
                  {surveyCounts?.bitlabs.available ? 'Start Surveys' : 'Unavailable'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Ads Section */}
        <Card data-testid="section-ads">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Watch Ads
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                10 pts each
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {ads.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                isCompleting={isCompleting}
              />
            ))}
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">More ads available in 2 hours</p>
            </div>
          </CardContent>
        </Card>

        {/* Offers Section */}
        <Card data-testid="section-offers">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <HandHeart className="h-5 w-5" />
                Special Offers
              </CardTitle>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                100+ pts
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {offers.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                isCompleting={isCompleting}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
