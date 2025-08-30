import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabaseHelpers } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { User, Edit, Users, ChevronRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { surveyMatchingService } from "@/lib/surveyMatching";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [redemptions, setRedemptions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const { signOut } = useAuth();
  
  const handleLogout = () => {
    signOut();
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
              {user?.first_name || user?.last_name 
                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
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
                ${((user?.total_earned || 0) / 100).toFixed(2)}
              </p>
              <p className="text-muted-foreground text-sm">Total Earned</p>
            </CardContent>
          </Card>
          <Card data-testid="card-tasks-completed">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{user?.tasks_completed || 0}</p>
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
                    defaultValue={user?.first_name || ''}
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.last_name || ''}
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
              
              <Separator className="my-4" />
              
              {/* Demographics for Survey Targeting */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Survey Preferences (Optional)</Label>
                <p className="text-sm text-muted-foreground">Help us find better-paying surveys for you</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      defaultValue={user?.birthday || ''}
                      data-testid="input-birthday"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select defaultValue={user?.gender || ''}>
                      <SelectTrigger data-testid="select-gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="countryCode">Country</Label>
                    <Select defaultValue={user?.country_code || ''}>
                      <SelectTrigger data-testid="select-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      defaultValue={user?.zip_code || ''}
                      placeholder="12345"
                      data-testid="input-zip-code"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="surveyLength">Preferred Survey Length</Label>
                  <Select defaultValue={user?.preferred_survey_length || 'any'}>
                    <SelectTrigger data-testid="select-survey-length">
                      <SelectValue placeholder="Any length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (5-10 min)</SelectItem>
                      <SelectItem value="medium">Medium (10-20 min)</SelectItem>
                      <SelectItem value="long">Long (20+ min)</SelectItem>
                      <SelectItem value="any">Any length</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                data-testid="button-update-profile" 
                className="w-full"
                onClick={async () => {
                  setIsUpdating(true);
                  try {
                    // Get form data
                    const form = document.querySelector('form') || document;
                    const birthday = (form.querySelector('#birthday') as HTMLInputElement)?.value;
                    const gender = (form.querySelector('[data-testid="select-gender"] input') as HTMLInputElement)?.value;
                    const countryCode = (form.querySelector('[data-testid="select-country"] input') as HTMLInputElement)?.value;
                    const zipCode = (form.querySelector('#zipCode') as HTMLInputElement)?.value;
                    const firstName = (form.querySelector('#firstName') as HTMLInputElement)?.value;
                    const lastName = (form.querySelector('#lastName') as HTMLInputElement)?.value;
                    
                    if (!user?.id) return;
                    
                    // Update user profile in Supabase
                    const { error } = await supabase
                      .from('users')
                      .update({
                        first_name: firstName,
                        last_name: lastName,
                        birthday,
                        gender,
                        country_code: countryCode,
                        zip_code: zipCode,
                        updated_at: new Date().toISOString()
                      })
                      .eq('id', user?.id);
                    
                    if (error) throw error;
                    
                    toast({
                      title: "Profile Updated!",
                      description: "Your survey targeting has been improved with better demographic matching.",
                    });
                    
                    // Refresh page to load updated user data
                    window.location.reload();
                  } catch (error) {
                    console.error('Profile update error:', error);
                    toast({
                      title: "Update Failed",
                      description: "Could not update profile. Please try again.",
                      variant: "destructive"
                    });
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
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
          {/* Profile Completeness */}
          <Card data-testid="card-profile-completeness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const completeness = surveyMatchingService.getProfileCompleteness(user || {} as any);
                  return completeness.score >= 80 ? (
                    <><CheckCircle className="h-5 w-5 text-green-500" />Profile Complete</>
                  ) : (
                    <><AlertCircle className="h-5 w-5 text-yellow-500" />Complete Your Profile</>
                  );
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const completeness = surveyMatchingService.getProfileCompleteness(user || {} as any);
                return (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Profile Completeness</span>
                        <span className="font-medium">{completeness.score}%</span>
                      </div>
                      <Progress value={completeness.score} className="h-2" />
                    </div>
                    
                    {completeness.recommendations.length > 0 && (
                      <Alert>
                        <AlertDescription className="text-sm">
                          <strong>Get better surveys:</strong><br/>
                          {completeness.recommendations.slice(0, 2).join(', ')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                );
              })()}
            </CardContent>
          </Card>
          {/* Account Stats */}
          <Card data-testid="card-account-stats">
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Earned</span>
                <span className="text-foreground font-medium">
                  ${((user?.total_earned || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tasks Completed</span>
                <span className="text-foreground font-medium">{user?.tasks_completed || 0}</span>
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
