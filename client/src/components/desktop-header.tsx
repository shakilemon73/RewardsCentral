import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function DesktopHeader() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between" data-testid="header-desktop">
      <div className="flex items-center space-x-4">
        <div className="gradient-bg text-white px-3 py-2 rounded-lg font-bold text-lg">
          RewardsPay
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* Points Balance Desktop */}
        <div className="flex items-center space-x-2 bg-success text-success-foreground px-4 py-2 rounded-full points-animation">
          <span className="font-semibold" data-testid="text-points-desktop">
            {user?.points || 0} Points
          </span>
        </div>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          <span>{user?.first_name || user?.email || 'User'}</span>
        </Button>
      </div>
    </header>
  );
}
