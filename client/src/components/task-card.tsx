import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, FileText, Video, HandHeart, TrendingUp } from "lucide-react";
import type { Task } from "@shared/schema";

interface ExternalSurvey {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  duration: string;
  category: string;
  rating: number;
  provider?: string;
  entryUrl?: string;
  isActive: boolean;
}

type TaskOrSurvey = Task | ExternalSurvey;

interface TaskCardProps {
  task: TaskOrSurvey;
  onComplete: (taskId: string, points: number) => void;
  isMobile?: boolean;
  isCompleting?: boolean;
}

export default function TaskCard({ task, onComplete, isMobile = false, isCompleting = false }: TaskCardProps) {
  const isExternalSurvey = 'provider' in task && task.provider;
  
  const handleComplete = () => {
    if (isExternalSurvey && task.entryUrl) {
      // Open external survey in new tab
      window.open(task.entryUrl, '_blank');
      // Award points after a short delay (in real app, this would be handled by webhooks)
      setTimeout(() => {
        onComplete(task.id, task.points);
      }, 1000);
    } else {
      onComplete(task.id, task.points);
    }
  };
  const getTaskIcon = () => {
    switch (task.type) {
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

  const getTaskColor = () => {
    switch (task.type) {
      case "survey":
        return "bg-primary/10 text-primary";
      case "ad":
        return "bg-red-500/10 text-red-500";
      case "offer":
        return "bg-success/10 text-success";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getButtonColor = () => {
    switch (task.type) {
      case "survey":
        return "bg-primary hover:bg-primary/90";
      case "ad":
        return "bg-red-500 hover:bg-red-500/90";
      case "offer":
        return "bg-success hover:bg-success/90";
      default:
        return "bg-primary hover:bg-primary/90";
    }
  };

  const Icon = getTaskIcon();
  const rating = task.rating ? task.rating / 10 : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-gray-300" />);
      }
    }
    return stars;
  };

  if (isMobile) {
    return (
      <Card className="task-card hover:shadow-md transition-all" data-testid={`task-card-${task.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded ${getTaskColor()}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm">{task.title}</h3>
                  {isExternalSurvey && (
                    <p className="text-xs text-muted-foreground">{task.provider}</p>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-xs mb-2">
                {task.duration && `${task.duration} • `}{task.category}
              </p>
              {task.rating > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex">{renderStars()}</div>
                  <span className="text-muted-foreground text-xs ml-1">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <Button
              className={`${getButtonColor()} text-white text-xs px-3 py-1 h-auto`}
              onClick={handleComplete}
              disabled={isCompleting}
              data-testid={`button-complete-${task.id}`}
            >
              {isCompleting ? "..." : isExternalSurvey ? "Start" : `${task.points} pts`}
            </Button>
          </div>
          {task.description && (
            <p className="text-muted-foreground text-xs">{task.description}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="task-card hover:shadow-md transition-all" data-testid={`task-card-${task.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground">{task.title}</h3>
              {isExternalSurvey && (
                <Badge variant="secondary" className="text-xs">{task.provider}</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {task.duration && `${task.duration} • `}{task.category}
            </p>
            {task.rating > 0 && (
              <div className="flex items-center mt-2">
                <div className="flex">{renderStars()}</div>
                <span className="text-muted-foreground text-xs ml-2">{rating.toFixed(1)}</span>
              </div>
            )}
            {task.description && (
              <p className="text-muted-foreground text-sm mt-2">{task.description}</p>
            )}
          </div>
          <Button
            className={`${getButtonColor()} text-white ml-4`}
            onClick={handleComplete}
            disabled={isCompleting}
            data-testid={`button-complete-${task.id}`}
          >
            {isCompleting ? "Completing..." : isExternalSurvey ? `Start Survey (${task.points} pts)` : `${task.points} pts`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
