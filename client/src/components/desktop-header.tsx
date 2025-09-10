import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building, Gift, BarChart3, User } from "lucide-react";

export default function DesktopHeader() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-0 backdrop-blur-lg" data-testid="header-desktop">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <div className="animated-gradient text-white px-6 py-3 rounded-2xl font-bold text-2xl hover-3d cursor-pointer">
              RewardsPay
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="hover:bg-white/10 hover:backdrop-blur-sm text-lg px-6 flex items-center gap-2" data-testid="nav-earn">
                <Gift className="h-5 w-5" />
                Earn Rewards
              </Button>
            </Link>
            <Link href="/partnerships">
              <Button variant="ghost" className="hover:bg-white/10 hover:backdrop-blur-sm text-lg px-6 flex items-center gap-2" data-testid="nav-businesses">
                <Building className="h-5 w-5" />
                For Businesses
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Points Balance */}
          <div className="glass-card px-6 py-3 rounded-xl float" style={{animationDelay: '2s'}}>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-success" />
              <span className="font-bold text-lg text-success" data-testid="text-points-desktop">
                {user?.points || 0} Points
              </span>
            </div>
          </div>
          
          {/* User Menu */}
          <div className="glass-card px-4 py-3 rounded-xl flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <Button variant="ghost" onClick={handleLogout} className="hover:bg-white/10 text-lg" data-testid="button-logout">
              <span>{user?.first_name || user?.email || 'User'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
