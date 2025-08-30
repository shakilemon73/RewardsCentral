import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Tasks from "@/pages/tasks";
import Rewards from "@/pages/rewards";
import Profile from "@/pages/profile";
import MobileNav from "@/components/mobile-nav";
import DesktopHeader from "@/components/desktop-header";
import DesktopSidebar from "@/components/desktop-sidebar";

function Router() {
  const { isAuthenticated, isLoading, user, session } = useAuth();
  const isMobile = useIsMobile();

  // Debug logging
  console.log('Router state:', { isAuthenticated, isLoading, hasUser: !!user, hasSession: !!session });

  // Always show landing page first to avoid auth errors
  if (isLoading) {
    console.log('Router: Still loading auth state');
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  if (!isAuthenticated) {
    console.log('Router: Not authenticated, showing landing');
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  console.log('Router: Authenticated, showing dashboard');

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
              <Route path="/tasks" component={Tasks} />
              <Route path="/rewards" component={Rewards} />
              <Route path="/profile" component={Profile} />
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
            <Route path="/tasks" component={Tasks} />
            <Route path="/rewards" component={Rewards} />
            <Route path="/profile" component={Profile} />
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
