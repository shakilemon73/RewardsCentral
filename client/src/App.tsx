import { Switch, Route, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import PasswordReset from "@/pages/password-reset";
import Partnerships from "@/pages/partnerships";
import FraudDetection from "@/pages/fraud-detection";
import GDPRCompliance from "@/pages/gdpr-compliance";
import PostbackImplementation from "@/pages/postback-implementation";
import UserMetrics from "@/pages/user-metrics";
import Home from "@/pages/home";
import Tasks from "@/pages/tasks";
import Rewards from "@/pages/rewards";
import Profile from "@/pages/profile";
import SurveyCallback from "@/pages/survey-callback";
import MobileNav from "@/components/mobile-nav";
import DesktopHeader from "@/components/desktop-header";
import DesktopSidebar from "@/components/desktop-sidebar";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Reset scroll position when navigating to new page
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location]);

  // Redirect unauthenticated users trying to access protected routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const publicRoutes = ["/landing", "/password-reset", "/partnerships", "/fraud-detection", "/gdpr-compliance", "/postback-implementation", "/user-metrics"];
      const isPublicRoute = publicRoutes.includes(location);
      
      if (!isPublicRoute) {
        setLocation('/landing');
      }
    }
  }, [isLoading, isAuthenticated, location, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-7xl w-full mx-auto space-y-6">
          <div className="h-12 w-64 bg-muted animate-pulse rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
          </div>
          <div className="h-96 w-full bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/landing", "/password-reset", "/partnerships", "/fraud-detection", "/gdpr-compliance", "/postback-implementation", "/user-metrics"];
  const isPublicRoute = publicRoutes.includes(location);

  // If not authenticated and not on a public route, redirect happens in useEffect above
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  // Public routes accessible even when authenticated
  if (isPublicRoute) {
    return (
      <Switch>
        <Route path="/landing" component={Landing} />
        <Route path="/password-reset" component={PasswordReset} />
        <Route path="/partnerships" component={Partnerships} />
        <Route path="/fraud-detection" component={FraudDetection} />
        <Route path="/gdpr-compliance" component={GDPRCompliance} />
        <Route path="/postback-implementation" component={PostbackImplementation} />
        <Route path="/user-metrics" component={UserMetrics} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Authenticated layout with desktop and mobile views
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen flex-col">
        <DesktopHeader />
        <div className="flex flex-1">
          <DesktopSidebar />
          <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
            <Switch>
              <Route path="/">
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              </Route>
              <Route path="/tasks">
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              </Route>
              <Route path="/rewards">
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              </Route>
              <Route path="/profile">
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Route>
              <Route path="/survey-callback">
                <ProtectedRoute>
                  <SurveyCallback />
                </ProtectedRoute>
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <main className="pb-16">
          <Switch>
            <Route path="/">
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Route>
            <Route path="/tasks">
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            </Route>
            <Route path="/rewards">
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            </Route>
            <Route path="/profile">
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Route>
            <Route path="/survey-callback">
              <ProtectedRoute>
                <SurveyCallback />
              </ProtectedRoute>
            </Route>
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
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
