import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { supabaseHelpers } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import RewardCard from "@/components/reward-card";
import type { Reward } from "@shared/schema";

export default function Rewards() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Load rewards on component mount
  useEffect(() => {
    const loadRewards = async () => {
      setIsLoading(true);
      try {
        const rewardsData = await supabaseHelpers.getRewards();
        setRewards(rewardsData);
      } catch (error) {
        console.error('Failed to load rewards:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRewards();
  }, []);

  const handleRedeem = async (rewardId: string, pointsCost: number) => {
    if ((user?.points || 0) < pointsCost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${pointsCost - (user?.points || 0)} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!user?.id) return;
    setIsRedeeming(true);
    try {
      await supabaseHelpers.redeemReward(user.id, rewardId, pointsCost);
      toast({
        title: "Reward Redeemed!",
        description: "Your reward will be processed within 24 hours.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

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
            <h1 className="text-xl font-bold text-foreground">Rewards</h1>
            <div className="flex items-center space-x-1 bg-success text-success-foreground px-3 py-1 rounded-full text-sm points-animation">
              <span className="font-semibold" data-testid="text-points-mobile">
                {user?.points || 0}
              </span>
              <span className="text-xs">pts</span>
            </div>
          </div>
        </header>

        {/* Points Balance Card */}
        <Card className="gradient-bg text-white mb-6" data-testid="card-points-balance">
          <CardContent className="p-4 text-center">
            <p className="text-sm opacity-90">Your Balance</p>
            <p className="text-2xl font-bold">{user?.points || 0} Points</p>
            <p className="text-sm opacity-90">≈ ${((user?.points || 0) / 100).toFixed(2)} in rewards</p>
          </CardContent>
        </Card>

        {/* Rewards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {rewards?.map(reward => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userPoints={user?.points || 0}
              onRedeem={handleRedeem}
              isMobile={true}
              isRedeeming={isRedeeming}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-rewards">
      <h1 className="text-3xl font-bold text-foreground mb-6">Redeem Rewards</h1>
      
      {/* Redemption Info */}
      <Card className="gradient-bg text-white mb-8" data-testid="card-balance-info">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Points Balance</h2>
              <p className="text-2xl font-bold mt-1">{user?.points || 0} Points</p>
              <p className="opacity-90 mt-1">≈ ${((user?.points || 0) / 100).toFixed(2)} in rewards</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Exchange Rate</p>
              <p className="font-semibold">100 pts = $1.00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards?.map(reward => (
          <RewardCard
            key={reward.id}
            reward={reward}
            userPoints={user?.points || 0}
            onRedeem={handleRedeem}
            isRedeeming={isRedeeming}
          />
        ))}
      </div>
    </div>
  );
}
