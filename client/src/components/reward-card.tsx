import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Reward } from "@shared/schema";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: (rewardId: string, points_cost: number) => void;
  isMobile?: boolean;
  isRedeeming?: boolean;
}

export default function RewardCard({ 
  reward, 
  userPoints, 
  onRedeem, 
  isMobile = false, 
  isRedeeming = false 
}: RewardCardProps) {
  const canAfford = userPoints >= reward.points_cost;
  const pointsNeeded = reward.points_cost - userPoints;

  const getBrandGradient = () => {
    switch (reward.brand.toLowerCase()) {
      case "amazon":
        return "from-orange-400 to-orange-600";
      case "starbucks":
        return "from-green-600 to-green-800";
      case "paypal":
        return "from-blue-600 to-blue-800";
      case "netflix":
        return "from-red-600 to-red-800";
      case "apple":
        return "from-gray-800 to-black";
      default:
        return "from-gray-600 to-gray-800";
    }
  };

  const getBrandIcon = () => {
    switch (reward.brand.toLowerCase()) {
      case "amazon":
        return "🛒";
      case "starbucks":
        return "☕";
      case "paypal":
        return "💳";
      case "netflix":
        return "📺";
      case "apple":
        return "🍎";
      default:
        return "🎁";
    }
  };

  if (isMobile) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`reward-card-${reward.id}`}>
        <div className={`h-20 bg-gradient-to-br ${getBrandGradient()} flex items-center justify-center`}>
          <span className="text-white text-2xl">{getBrandIcon()}</span>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-foreground text-sm">{reward.title}</h3>
          <p className="text-muted-foreground text-xs">{reward.value}</p>
          <Button
            className={`w-full mt-2 text-xs h-auto py-1 ${
              canAfford
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            onClick={() => canAfford && onRedeem(reward.id, reward.points_cost)}
            disabled={!canAfford || isRedeeming}
            data-testid={`button-redeem-${reward.id}`}
          >
            {isRedeeming
              ? "Processing..."
              : canAfford
              ? `${reward.points_cost.toLocaleString()} pts`
              : `Need ${pointsNeeded} pts`
            }
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`reward-card-${reward.id}`}>
      <div className={`h-32 bg-gradient-to-br ${getBrandGradient()} flex items-center justify-center`}>
        <span className="text-white text-4xl">{getBrandIcon()}</span>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground">{reward.title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{reward.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold text-foreground">{reward.value}</span>
            <p className="text-muted-foreground text-sm">{reward.points_cost.toLocaleString()} points</p>
          </div>
          <Button
            className={
              canAfford
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "bg-gray-400 text-white cursor-not-allowed"
            }
            onClick={() => canAfford && onRedeem(reward.id, reward.points_cost)}
            disabled={!canAfford || isRedeeming}
            data-testid={`button-redeem-${reward.id}`}
          >
            {isRedeeming
              ? "Processing..."
              : canAfford
              ? "Redeem"
              : `Need ${pointsNeeded} pts`
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
