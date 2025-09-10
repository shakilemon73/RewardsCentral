import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabaseHelpers } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatsCards from "@/components/stats-cards";
import ProgressSection from "@/components/progress-section";
import RecentActivities from "@/components/recent-activities";
import { Gift, Video, FileText, ArrowUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [activities, setActivities] = useState<any[]>([]);

  // Load recent activities
  useEffect(() => {
    const loadActivities = async () => {
      if (!user?.id) return;
      try {
        const completions = await supabaseHelpers.getUserTaskCompletions(user.id);
        // Transform to Activity format
        const activityData = completions.slice(0, 5).map((completion: any) => ({
          id: completion.id,
          type: 'task_completion',
          title: completion.task?.title || 'Task Completed',
          taskType: completion.task?.type || 'survey',
          pointsEarned: completion.points_earned,
          createdAt: completion.completed_at
        }));
        setActivities(activityData);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };
    loadActivities();
  }, [user?.id]);

  if (isMobile) {
    return (
      <div className="p-4">
        {/* Clear Mobile Header - Emotional Design: Welcome + Status */}
        <header className="bg-background border-b border-border px-4 py-4 -mx-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Hi, {user?.first_name || 'there'}!</h1>
              <p className="text-sm text-muted-foreground">Ready to earn rewards?</p>
            </div>
            <div className="bg-success/10 border border-success/20 px-3 py-2 rounded-lg">
              <div className="text-success font-bold text-lg" data-testid="text-points-mobile">
                {user?.points || 0}
              </div>
              <div className="text-xs text-success/80">points</div>
            </div>
          </div>
        </header>

        {/* Scannable Stats - Steve Krug: Clear hierarchy */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-l-4 border-l-success" data-testid="card-total-points">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">{user?.points || 0}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary" data-testid="card-tasks-completed">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{user?.tasks_completed || 0}</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clear Progress - Recognition over Recall */}
        <Card className="mb-6 bg-primary/5 border-primary/20" data-testid="card-progress">
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <h3 className="font-semibold text-foreground mb-1">Next Milestone</h3>
              <div className="text-sm text-muted-foreground">
                {Math.max(0, 1000 - (user?.total_earned || 0))} more points to reach 1,000!
              </div>
            </div>
            <Progress 
              value={Math.min(100, ((user?.total_earned || 0) / 1000) * 100)} 
              className="h-3 mb-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span className="font-medium text-foreground">{user?.total_earned || 0}</span>
              <span>1,000</span>
            </div>
          </CardContent>
        </Card>

        {/* Clear Actions - 44px touch targets, clear labels */}
        <div className="space-y-3 mb-6">
          <Link href="/tasks" data-testid="link-surveys">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-lg min-h-[44px] flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Complete Surveys</div>
                  <div className="text-sm opacity-90">Earn $1-5 per survey</div>
                </div>
              </div>
              <ArrowUp className="h-4 w-4 rotate-45" />
            </Button>
          </Link>
          <Link href="/rewards" data-testid="link-rewards">
            <Button className="w-full bg-success hover:bg-success/90 text-white p-4 rounded-lg min-h-[44px] flex items-center justify-between">
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Redeem Rewards</div>
                  <div className="text-sm opacity-90">PayPal & gift cards</div>
                </div>
              </div>
              <ArrowUp className="h-4 w-4 rotate-45" />
            </Button>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card data-testid="card-recent-activity">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>
            <RecentActivities activities={activities || []} isMobile={true} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div data-testid="page-dashboard">
      {/* Emotional Welcome - Personalized Experience */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.first_name || 'there'}!
        </h1>
        <p className="text-lg text-muted-foreground">Ready to continue earning rewards today?</p>
      </div>
      
      <StatsCards 
        totalPoints={user?.total_earned || 0}
        tasksCompleted={user?.tasks_completed || 0}
        rewardsEarned={(user?.total_earned || 0) / 100}
      />
      
      <ProgressSection 
        currentPoints={user?.total_earned || 0}
        nextMilestone={user?.total_earned && user.total_earned >= 5000 ? 10000 : user?.total_earned && user.total_earned >= 1000 ? 5000 : 1000}
      />
      
      {/* Quick Actions - Desktop Version */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/tasks">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Complete Surveys</h3>
                  <p className="text-sm text-muted-foreground">Earn $1-5 per survey</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/rewards">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-success/10 p-3 rounded-lg mr-4">
                  <Gift className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Redeem Rewards</h3>
                  <p className="text-sm text-muted-foreground">PayPal & gift cards available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <RecentActivities activities={activities || []} />
    </div>
  );
}
