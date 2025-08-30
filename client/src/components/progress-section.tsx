import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Lock } from "lucide-react";

interface ProgressSectionProps {
  currentPoints: number;
  nextMilestone: number;
}

export default function ProgressSection({ currentPoints, nextMilestone }: ProgressSectionProps) {
  const progressPercentage = Math.min(100, (currentPoints / nextMilestone) * 100);
  const pointsToGo = Math.max(0, nextMilestone - currentPoints);

  const achievements = [
    {
      id: "first-1000",
      name: "First 1000 Points",
      icon: Star,
      unlocked: currentPoints >= 1000,
      variant: "success" as const,
    },
    {
      id: "survey-master",
      name: "Survey Master",
      icon: Trophy,
      unlocked: currentPoints >= 500, // Assuming they've done surveys
      variant: "default" as const,
    },
    {
      id: "5000-club",
      name: "5000 Points Club",
      icon: Lock,
      unlocked: currentPoints >= 5000,
      variant: "secondary" as const,
    },
  ];

  return (
    <Card className="mb-8" data-testid="section-progress">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground">Next Milestone: {nextMilestone.toLocaleString()} Points</span>
            <span className="text-muted-foreground">
              {currentPoints.toLocaleString()} / {nextMilestone.toLocaleString()}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          {pointsToGo > 0 && (
            <p className="text-muted-foreground text-sm mt-2">
              {pointsToGo.toLocaleString()} points to go
            </p>
          )}
        </div>
        
        {/* Achievement Badges */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-foreground mb-3">Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Badge
                  key={achievement.id}
                  variant={achievement.unlocked ? achievement.variant : "outline"}
                  className={`px-3 py-2 ${
                    achievement.unlocked
                      ? achievement.variant === "success"
                        ? "bg-success/10 text-success"
                        : achievement.variant === "default"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                  data-testid={`badge-${achievement.id}`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {achievement.name}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
