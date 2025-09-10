import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, FileText, Gift, User, Building } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/tasks", icon: FileText, label: "Tasks" },
    { href: "/rewards", icon: Gift, label: "Rewards" },
    { href: "/partnerships", icon: Building, label: "Partners" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border mobile-nav z-50" data-testid="nav-mobile">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center py-2 px-4 h-auto ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
