import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, FileText, Gift, User } from "lucide-react";

export default function DesktopSidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/tasks", icon: FileText, label: "Tasks" },
    { href: "/rewards", icon: Gift, label: "Rewards" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border" data-testid="sidebar-desktop">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-secondary"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
