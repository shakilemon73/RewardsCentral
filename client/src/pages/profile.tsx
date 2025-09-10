import { useState, useEffect } from "react";
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

  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;
      try {
        // Load redemptions
        const redemptionsData = await supabaseHelpers.getUserRewardRedemptions(user.id);
        setRedemptions(redemptionsData);
        
        // Load activities
        const activitiesData = await supabaseHelpers.getUserTaskCompletions(user.id);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadUserData();
  }, [user?.id]);
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
        {/* Clear Profile Header - Goal-oriented */}
        <header className="bg-background border-b border-border px-4 py-4 -mx-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground">Your Profile</h1>
              <p className="text-sm text-muted-foreground">Complete profile for better surveys</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
              Sign Out
            </Button>
          </div>
        </header>

        {/* Clear Profile Summary with Progress - Susan Weinschenk: Show Progress */}
        <Card className="mb-4 border-primary/20" data-testid="card-profile-summary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {user?.first_name || user?.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : 'Complete Your Profile'
                  }
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            {/* Progress Indicator */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Profile completeness</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Complete profile to unlock higher-paying surveys</p>
            </div>
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
              {/* Single Column Layout - Luke Wroblewski Principle */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName" className="text-base font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.first_name || ''}
                    className="mt-1 h-12"
                    placeholder="Enter your first name"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-base font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.last_name || ''}
                    className="mt-1 h-12"
                    placeholder="Enter your last name"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  className="mt-1 h-12"
                  placeholder="your@email.com"
                  data-testid="input-email"
                />
                <p className="text-xs text-muted-foreground mt-1">We'll never share your email with anyone</p>
              </div>
              
              <Separator className="my-4" />
              
              {/* Basic Demographics */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Basic Demographics</Label>
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
              </div>

              <Separator className="my-6" />

              {/* Enhanced Demographics (Survey Junkie/Swagbucks style) */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Education & Employment</Label>
                <p className="text-sm text-muted-foreground">Higher education and employment details unlock premium surveys</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Education Level</Label>
                    <Select defaultValue={user?.education_level || ''}>
                      <SelectTrigger data-testid="select-education">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="some_college">Some College</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employment">Employment Status</Label>
                    <Select defaultValue={user?.employment_status || ''}>
                      <SelectTrigger data-testid="select-employment">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed_full_time">Employed Full-Time</SelectItem>
                        <SelectItem value="employed_part_time">Employed Part-Time</SelectItem>
                        <SelectItem value="self_employed">Self-Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="occupation">Occupation Category</Label>
                    <Select defaultValue={user?.occupation_category || ''}>
                      <SelectTrigger data-testid="select-occupation">
                        <SelectValue placeholder="Select occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="income">Household Income</Label>
                    <Select defaultValue={user?.household_income || ''}>
                      <SelectTrigger data-testid="select-income">
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_25k">Under $25,000</SelectItem>
                        <SelectItem value="25k_50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k_75k">$50,000 - $75,000</SelectItem>
                        <SelectItem value="75k_100k">$75,000 - $100,000</SelectItem>
                        <SelectItem value="100k_150k">$100,000 - $150,000</SelectItem>
                        <SelectItem value="over_150k">Over $150,000</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Family & Lifestyle */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Family & Lifestyle</Label>
                <p className="text-sm text-muted-foreground">Family details help match family-focused and lifestyle surveys</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marital">Marital Status</Label>
                    <Select defaultValue={user?.marital_status || ''}>
                      <SelectTrigger data-testid="select-marital">
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="domestic_partnership">Domestic Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="children">Number of Children</Label>
                    <Select defaultValue={user?.children_count || ''}>
                      <SelectTrigger data-testid="select-children">
                        <SelectValue placeholder="Select number of children" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No children</SelectItem>
                        <SelectItem value="1">1 child</SelectItem>
                        <SelectItem value="2">2 children</SelectItem>
                        <SelectItem value="3">3 children</SelectItem>
                        <SelectItem value="4_or_more">4 or more children</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Behavioral & Interest Targeting */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Interests & Behavior</Label>
                <p className="text-sm text-muted-foreground">Your habits and interests unlock specialized high-paying surveys</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shopping">Shopping Habits</Label>
                    <Select defaultValue={user?.shopping_habits || ''}>
                      <SelectTrigger data-testid="select-shopping">
                        <SelectValue placeholder="Select shopping style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online_primarily">Primarily Online</SelectItem>
                        <SelectItem value="in_store_primarily">Primarily In-Store</SelectItem>
                        <SelectItem value="mixed">Mixed Online/In-Store</SelectItem>
                        <SelectItem value="budget_conscious">Budget Conscious</SelectItem>
                        <SelectItem value="brand_loyal">Brand Loyal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="technology">Technology Usage</Label>
                    <Select defaultValue={user?.technology_usage || ''}>
                      <SelectTrigger data-testid="select-technology">
                        <SelectValue placeholder="Select tech usage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="early_adopter">Early Adopter</SelectItem>
                        <SelectItem value="mainstream">Mainstream User</SelectItem>
                        <SelectItem value="late_adopter">Late Adopter</SelectItem>
                        <SelectItem value="minimal_user">Minimal User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="travel">Travel Frequency</Label>
                  <Select defaultValue={user?.travel_frequency || ''}>
                    <SelectTrigger data-testid="select-travel">
                      <SelectValue placeholder="Select travel frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="rarely">Rarely (1-2 times/year)</SelectItem>
                      <SelectItem value="few_times_year">Few times/year</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Survey Preferences */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Survey Preferences</Label>
                <p className="text-sm text-muted-foreground">Customize your survey experience</p>
                
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
                    // Get form data from all profile sections
                    const form = document.querySelector('form') || document;
                    
                    // Basic info
                    const firstName = (form.querySelector('#firstName') as HTMLInputElement)?.value;
                    const lastName = (form.querySelector('#lastName') as HTMLInputElement)?.value;
                    const email = (form.querySelector('#email') as HTMLInputElement)?.value;
                    
                    // Basic demographics
                    const birthday = (form.querySelector('#birthday') as HTMLInputElement)?.value;
                    const gender = (form.querySelector('[data-testid="select-gender"]') as any)?.getAttribute('data-value') || user?.gender;
                    const countryCode = (form.querySelector('[data-testid="select-country"]') as any)?.getAttribute('data-value') || user?.country_code;
                    const zipCode = (form.querySelector('#zipCode') as HTMLInputElement)?.value;
                    
                    // Enhanced demographics (Survey Junkie/Swagbucks style)
                    const educationLevel = (form.querySelector('[data-testid="select-education"]') as any)?.getAttribute('data-value') || user?.education_level;
                    const employmentStatus = (form.querySelector('[data-testid="select-employment"]') as any)?.getAttribute('data-value') || user?.employment_status;
                    const occupationCategory = (form.querySelector('[data-testid="select-occupation"]') as any)?.getAttribute('data-value') || user?.occupation_category;
                    const householdIncome = (form.querySelector('[data-testid="select-income"]') as any)?.getAttribute('data-value') || user?.household_income;
                    
                    // Family & lifestyle
                    const maritalStatus = (form.querySelector('[data-testid="select-marital"]') as any)?.getAttribute('data-value') || user?.marital_status;
                    const childrenCount = (form.querySelector('[data-testid="select-children"]') as any)?.getAttribute('data-value') || user?.children_count;
                    
                    // Behavioral targeting
                    const shoppingHabits = (form.querySelector('[data-testid="select-shopping"]') as any)?.getAttribute('data-value') || user?.shopping_habits;
                    const technologyUsage = (form.querySelector('[data-testid="select-technology"]') as any)?.getAttribute('data-value') || user?.technology_usage;
                    const travelFrequency = (form.querySelector('[data-testid="select-travel"]') as any)?.getAttribute('data-value') || user?.travel_frequency;
                    
                    // Survey preferences
                    const preferredSurveyLength = (form.querySelector('[data-testid="select-survey-length"]') as any)?.getAttribute('data-value') || user?.preferred_survey_length;
                    
                    if (!user?.id) return;
                    
                    // Calculate profile completion score
                    const completedFields = [
                      firstName, lastName, birthday, gender, countryCode, zipCode,
                      educationLevel, employmentStatus, occupationCategory, householdIncome,
                      maritalStatus, childrenCount, shoppingHabits, technologyUsage,
                      travelFrequency, preferredSurveyLength
                    ].filter(field => field && field !== '').length;
                    
                    const totalFields = 16;
                    const profileCompletionScore = Math.round((completedFields / totalFields) * 100);
                    
                    // Update user profile with all enhanced demographic data
                    const { error } = await supabase
                      .from('users')
                      .update({
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        // Basic demographics
                        birthday,
                        gender,
                        country_code: countryCode,
                        zip_code: zipCode,
                        // Enhanced demographics
                        education_level: educationLevel,
                        employment_status: employmentStatus,
                        occupation_category: occupationCategory,
                        household_income: householdIncome,
                        // Family & lifestyle
                        marital_status: maritalStatus,
                        children_count: childrenCount,
                        // Behavioral targeting
                        shopping_habits: shoppingHabits,
                        technology_usage: technologyUsage,
                        travel_frequency: travelFrequency,
                        // Survey preferences
                        preferred_survey_length: preferredSurveyLength,
                        // Profile tracking
                        profile_completion_score: profileCompletionScore,
                        last_profile_update: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                      })
                      .eq('id', user?.id);
                    
                    if (error) throw error;
                    
                    toast({
                      title: "Profile Updated!",
                      description: `Profile is ${profileCompletionScore}% complete. Enhanced survey targeting activated!`,
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
