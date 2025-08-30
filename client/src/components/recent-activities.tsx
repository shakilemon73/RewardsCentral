import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, HandHeart } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  title: string;
  taskType: string;
  pointsEarned: number;
  createdAt: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  isMobile?: boolean;
}

export default function RecentActivities({ activities, isMobile = false }: RecentActivitiesProps) {
  const getActivityIcon = (taskType: string) => {
    switch (taskType) {
      case "survey":
        return FileText;
      case "ad":
        return Video;
      case "offer":
        return HandHeart;
      default:
        return FileText;
    }
  };

  const getActivityColor = (taskType: string) => {
    switch (taskType) {
      case "survey":
        return "bg-success/10 text-success";
      case "ad":
        return "bg-primary/10 text-primary";
      case "offer":
        return "bg-accent/10 text-accent";
      default:
        return "bg-success/10 text-success";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (isMobile) {
    return (
      <div className="space-y-3" data-testid="recent-activities-mobile">
        {activities.slice(0, 3).map((activity) => {
          const Icon = getActivityIcon(activity.taskType);
          return (
            <div
              key={activity.id}
              className="flex items-center justify-between"
              data-testid={`activity-${activity.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity.taskType)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">{activity.title}</p>
                  <p className="text-muted-foreground text-xs">{formatTimeAgo(activity.createdAt)}</p>
                </div>
              </div>
              <span className="text-success text-sm font-semibold">+{activity.pointsEarned}</span>
            </div>
          );
        })}
        {activities.length === 0 && (
          <p className="text-muted-foreground text-center py-8 text-sm">No activities yet</p>
        )}
      </div>
    );
  }

  return (
    <Card data-testid="recent-activities">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.taskType);
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                data-testid={`activity-${activity.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.taskType)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Completed {activity.taskType}: "{activity.title}"
                    </p>
                    <p className="text-muted-foreground text-sm">{formatTimeAgo(activity.createdAt)}</p>
                  </div>
                </div>
                <span className="text-success font-semibold">+{activity.pointsEarned} pts</span>
              </div>
            );
          })}
          {activities.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No activities yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
