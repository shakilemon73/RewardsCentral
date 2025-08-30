import { Card, CardContent } from "@/components/ui/card";
import { Gift, CheckCircle, DollarSign } from "lucide-react";

interface StatsCardsProps {
  totalPoints: number;
  tasksCompleted: number;
  rewardsEarned: number;
}

export default function StatsCards({ totalPoints, tasksCompleted, rewardsEarned }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Points",
      value: totalPoints.toLocaleString(),
      icon: Gift,
      color: "primary",
      testId: "card-total-points",
    },
    {
      title: "Tasks Completed",
      value: tasksCompleted.toString(),
      icon: CheckCircle,
      color: "success",
      testId: "card-tasks-completed",
    },
    {
      title: "Rewards Earned",
      value: `$${rewardsEarned.toFixed(2)}`,
      icon: DollarSign,
      color: "accent",
      testId: "card-rewards-earned",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} data-testid={stat.testId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}/10 p-3 rounded-full`}>
                  <Icon className={`text-${stat.color} text-xl h-6 w-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
