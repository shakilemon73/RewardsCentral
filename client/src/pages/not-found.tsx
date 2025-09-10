import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function NotFound() {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-4 text-center">
        <CardContent className="pt-8 pb-6">
          {/* Friendly Error Message - Don Norman: Clear Feedback */}
          <div className="mb-6">
            <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
            <p className="text-muted-foreground mb-4">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-6">
              <code>{location}</code>
            </div>
          </div>

          {/* Clear Recovery Actions - Helpful Navigation */}
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full" size="lg" data-testid="button-go-home">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg" 
              onClick={() => window.history.back()}
              data-testid="button-go-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Suggestions */}
          <div className="mt-8 text-sm text-muted-foreground">
            <p className="mb-2">Looking for something specific?</p>
            <div className="flex flex-col sm:flex-row gap-2 text-xs">
              <Link href="/tasks" className="text-primary hover:underline">Browse Tasks</Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/rewards" className="text-primary hover:underline">View Rewards</Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/profile" className="text-primary hover:underline">Your Profile</Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
