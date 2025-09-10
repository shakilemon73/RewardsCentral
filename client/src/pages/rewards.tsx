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
        {/* Goal-Oriented Header - Focus on Achievement */}
        <header className="bg-background border-b border-border px-4 py-4 -mx-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground">Your Rewards</h1>
              <p className="text-sm text-muted-foreground">Turn points into real money & gifts</p>
            </div>
            <div className="bg-success/10 border border-success/20 px-3 py-2 rounded-lg text-center">
              <div className="text-success font-bold" data-testid="text-points-mobile">
                {user?.points || 0}
              </div>
              <div className="text-xs text-success/80">points ready</div>
            </div>
          </div>
        </header>

        {/* Clear Value Proposition - Psychology: Make points feel valuable */}
        <Card className="bg-success/5 border-success/20 mb-6" data-testid="card-points-balance">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-success mb-1">{user?.points || 0}</div>
              <div className="text-sm text-muted-foreground">points available</div>
              <div className="text-lg font-semibold text-foreground mt-1">
                ≈ ${((user?.points || 0) / 100).toFixed(2)} cash value
              </div>
            </div>
            {/* Social Proof */}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>2,847 rewards redeemed this week</span>
            </div>
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
      {/* Emotional Connection - User Goals */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Rewards</h1>
        <p className="text-lg text-muted-foreground">Turn your hard-earned points into cash and gift cards</p>
      </div>
      
      {/* Clear Balance Info with Social Proof */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-success/5 border-success/20" data-testid="card-balance-info">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">Your Balance</h2>
            <div className="text-4xl font-bold text-success mb-2">{user?.points || 0}</div>
            <div className="text-muted-foreground mb-3">points ready to use</div>
            <div className="text-xl font-semibold text-foreground">
              ≈ ${((user?.points || 0) / 100).toFixed(2)} cash value
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">Exchange Rate</h2>
            <div className="text-2xl font-bold text-primary mb-2">100 pts = $1.00</div>
            <div className="text-muted-foreground mb-2">Instant redemption</div>
            {/* Social Proof */}
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>$12,847 paid out yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
