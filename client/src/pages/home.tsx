import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
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

  const { data: activities } = useQuery({
    queryKey: ["/api/activities"],
  });

  if (isMobile) {
    return (
      <div className="p-4">
        {/* Mobile Header */}
        <header className="bg-card border-b border-border px-4 py-3 -mx-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="gradient-bg text-white px-3 py-2 rounded-lg font-bold">
              RewardsPay
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-success text-success-foreground px-3 py-1 rounded-full text-sm points-animation">
                <span className="font-semibold" data-testid="text-points-mobile">
                  {user?.points || 0}
                </span>
                <span className="text-xs">pts</span>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card data-testid="card-total-points">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs">Total Points</p>
                  <p className="text-lg font-bold text-foreground">{user?.points || 0}</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-tasks-completed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs">Tasks Done</p>
                  <p className="text-lg font-bold text-foreground">{user?.tasksCompleted || 0}</p>
                </div>
                <ArrowUp className="h-4 w-4 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Card */}
        <Card className="mb-6" data-testid="card-progress">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Next Milestone</h3>
              <span className="text-muted-foreground text-sm">
                {Math.max(0, 3000 - (user?.points || 0))} pts to go
              </span>
            </div>
            <Progress 
              value={Math.min(100, ((user?.points || 0) / 3000) * 100)} 
              className="mb-2"
            />
            <p className="text-muted-foreground text-sm">3,000 Points Club</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link href="/tasks" data-testid="link-surveys">
            <Button className="bg-primary text-primary-foreground p-4 rounded-lg text-center w-full h-auto flex flex-col">
              <FileText className="h-5 w-5 mb-2" />
              <span className="text-xs font-medium">Surveys</span>
            </Button>
          </Link>
          <Link href="/tasks" data-testid="link-ads">
            <Button className="bg-red-500 text-white p-4 rounded-lg text-center w-full h-auto flex flex-col">
              <Video className="h-5 w-5 mb-2" />
              <span className="text-xs font-medium">Watch Ads</span>
            </Button>
          </Link>
          <Link href="/rewards" data-testid="link-rewards">
            <Button className="bg-success text-success-foreground p-4 rounded-lg text-center w-full h-auto flex flex-col">
              <Gift className="h-5 w-5 mb-2" />
              <span className="text-xs font-medium">Rewards</span>
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
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
      
      <StatsCards 
        totalPoints={user?.totalEarned || 0}
        tasksCompleted={user?.tasksCompleted || 0}
        rewardsEarned={(user?.totalEarned || 0) / 100}
      />
      
      <ProgressSection 
        currentPoints={user?.points || 0}
        nextMilestone={3000}
      />
      
      <RecentActivities activities={activities || []} />
    </div>
  );
}
