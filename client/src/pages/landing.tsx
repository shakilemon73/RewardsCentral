import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Star, Award, CheckCircle } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="gradient-bg text-white px-4 py-2 rounded-lg font-bold text-xl">
            RewardsPay
          </div>
          <Button onClick={handleLogin} data-testid="button-login">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Earn Points,
            <br />
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Redeem Rewards
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Complete surveys, watch ads, and claim offers to earn points. 
            Redeem them for gift cards and PayPal cash.
          </p>
          <Button 
            size="lg" 
            onClick={handleLogin}
            className="text-lg px-8 py-4"
            data-testid="button-get-started"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card data-testid="card-feature-surveys">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Complete Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Take surveys, watch ads, and complete offers to earn points.
                  Each task has different point values.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-points">
              <CardHeader>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Collect points for every completed task. Surveys earn 50-200 points,
                  ads earn 10 points each.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-rewards">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Redeem Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Exchange your points for gift cards or PayPal cash.
                  1,000 points = $10 in rewards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Join Thousands of Earners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-testid="stat-users">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div data-testid="stat-rewards">
              <div className="text-4xl font-bold text-success mb-2">$50,000+</div>
              <div className="text-muted-foreground">Rewards Paid</div>
            </div>
            <div data-testid="stat-satisfaction">
              <div className="text-4xl font-bold text-accent mb-2">4.8★</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 gradient-bg text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Sign up now and get started with your first task.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleLogin}
            className="text-lg px-8 py-4"
            data-testid="button-cta-signup"
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="gradient-bg text-white px-4 py-2 rounded-lg font-bold text-lg inline-block mb-4">
            RewardsPay
          </div>
          <p className="text-muted-foreground">
            © 2024 RewardsPay. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
