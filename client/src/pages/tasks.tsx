import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/task-card";
import { FileText, Video, HandHeart, Star } from "lucide-react";
import { useState } from "react";

export default function Tasks() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("surveys");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (data: { taskId: string; pointsEarned: number }) => {
      await apiRequest("POST", "/api/tasks/complete", data);
    },
    onSuccess: () => {
      toast({
        title: "Task Completed!",
        description: "Points have been added to your account.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCompleteTask = (taskId: string, points: number) => {
    completeTaskMutation.mutate({ taskId, pointsEarned: points });
  };

  const surveys = tasks?.filter(task => task.type === "survey") || [];
  const ads = tasks?.filter(task => task.type === "ad") || [];
  const offers = tasks?.filter(task => task.type === "offer") || [];

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
          {activeTab === "surveys" && surveys.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              isMobile={true}
              isCompleting={completeTaskMutation.isPending}
            />
          ))}
          {activeTab === "ads" && ads.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              isMobile={true}
              isCompleting={completeTaskMutation.isPending}
            />
          ))}
          {activeTab === "offers" && offers.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              isMobile={true}
              isCompleting={completeTaskMutation.isPending}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-tasks">
      <h1 className="text-3xl font-bold text-foreground mb-6">Available Tasks</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Surveys Section */}
        <Card data-testid="section-surveys">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Surveys
              </CardTitle>
              <Badge variant="secondary" className="bg-success/10 text-success">
                50-200 pts
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {surveys.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                isCompleting={completeTaskMutation.isPending}
              />
            ))}
          </CardContent>
        </Card>

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
                isCompleting={completeTaskMutation.isPending}
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
                isCompleting={completeTaskMutation.isPending}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
