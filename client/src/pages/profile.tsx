import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Edit, Users, ChevronRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { data: redemptions } = useQuery({
    queryKey: ["/api/redemptions"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/activities"],
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleCopyReferral = () => {
    const referralLink = `${window.location.origin}/ref/${user?.id}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    });
  };

  if (isMobile) {
    return (
      <div className="p-4">
        {/* Mobile Header */}
        <header className="bg-card border-b border-border px-4 py-3 -mx-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
              Logout
            </Button>
          </div>
        </header>

        {/* Profile Summary */}
        <Card className="mb-4" data-testid="card-profile-summary">
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">
              {user?.firstName || user?.lastName 
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                : 'User'
              }
            </h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card data-testid="card-total-earned">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                ${((user?.totalEarned || 0) / 100).toFixed(2)}
              </p>
              <p className="text-muted-foreground text-sm">Total Earned</p>
            </CardContent>
          </Card>
          <Card data-testid="card-tasks-completed">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{user?.tasksCompleted || 0}</p>
              <p className="text-muted-foreground text-sm">Tasks Done</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Actions */}
        <div className="space-y-3">
          <Card data-testid="card-edit-profile">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Edit className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">Edit Profile</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-refer-friends">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">Refer Friends</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyReferral}
                  data-testid="button-copy-referral"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-profile">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="card-personal-info">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.firstName || ''}
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.lastName || ''}
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  data-testid="input-email"
                />
              </div>
              <Button data-testid="button-update-profile">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Earning History */}
          <Card data-testid="card-earning-history">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities?.slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-success/10 p-2 rounded-full">
                        <User className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{activity.title}</p>
                        <p className="text-muted-foreground text-sm">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-success font-semibold">+{activity.pointsEarned} pts</span>
                  </div>
                ))}
                {(!activities || activities.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">No activities yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <Card data-testid="card-account-stats">
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Earned</span>
                <span className="text-foreground font-medium">
                  ${((user?.totalEarned || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tasks Completed</span>
                <span className="text-foreground font-medium">{user?.tasksCompleted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Points</span>
                <span className="text-foreground font-medium">{user?.points || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Referral Section */}
          <Card data-testid="card-referral">
            <CardHeader>
              <CardTitle>Refer Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Earn 50 points for each friend who signs up!
              </p>
              <div className="flex space-x-2">
                <Input
                  value={`${window.location.origin}/ref/${user?.id}`}
                  readOnly
                  className="text-sm"
                  data-testid="input-referral-link"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyReferral}
                  data-testid="button-copy-referral"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
