import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Partnerships from "@/pages/partnerships";
import Home from "@/pages/home";
import Tasks from "@/pages/tasks";
import Rewards from "@/pages/rewards";
import Profile from "@/pages/profile";
import SurveyCallback from "@/pages/survey-callback";
import MobileNav from "@/components/mobile-nav";
import DesktopHeader from "@/components/desktop-header";
import DesktopSidebar from "@/components/desktop-sidebar";

function Router() {
  const { isAuthenticated, isLoading, user, session } = useAuth();
  const isMobile = useIsMobile();
  const [location] = useLocation();

  // Check if we're on a protected route
  const protectedRoutes = ["/tasks", "/rewards", "/profile", "/survey-callback"];
  const isProtectedRoute = protectedRoutes.includes(location) || (location !== "/" && location !== "");

  // Show loading state during authentication check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show public pages
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/partnerships" component={Partnerships} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen flex-col">
        <DesktopHeader />
        <div className="flex flex-1">
          <DesktopSidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/partnerships" component={Partnerships} />
              <Route path="/tasks" component={Tasks} />
              <Route path="/rewards" component={Rewards} />
              <Route path="/profile" component={Profile} />
              <Route path="/survey-callback" component={SurveyCallback} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <main className="pb-16">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/partnerships" component={Partnerships} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/rewards" component={Rewards} />
            <Route path="/profile" component={Profile} />
            <Route path="/survey-callback" component={SurveyCallback} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
