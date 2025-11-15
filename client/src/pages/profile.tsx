import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabaseHelpers } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Camera, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

// Profile form schema with zod validation
const profileFormSchema = z.object({
  // Basic Info
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  profile_image_url: z.string().optional(),
  phone_number: z.string().optional(),
  
  // Demographics
  birthday: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say", ""]).optional(),
  country_code: z.string().optional(),
  zip_code: z.string().optional(),
  
  // Education & Employment
  education_level: z.enum(["high_school", "some_college", "bachelor", "master", "doctorate", ""]).optional(),
  employment_status: z.enum(["employed_full_time", "employed_part_time", "self_employed", "unemployed", "student", "retired", ""]).optional(),
  occupation_category: z.enum(["professional", "management", "service", "sales", "education", "healthcare", "retired", "student", "other", ""]).optional(),
  household_income: z.enum(["under_25k", "25k_50k", "50k_75k", "75k_100k", "100k_150k", "over_150k", "prefer_not_to_say", ""]).optional(),
  
  // Family & Lifestyle
  marital_status: z.enum(["single", "married", "divorced", "widowed", "domestic_partnership", ""]).optional(),
  children_count: z.enum(["0", "1", "2", "3", "4_or_more", ""]).optional(),
  
  // Interests & Behavior
  shopping_habits: z.enum(["online_primarily", "in_store_primarily", "mixed", "budget_conscious", "brand_loyal", ""]).optional(),
  technology_usage: z.enum(["early_adopter", "mainstream", "late_adopter", "minimal_user", ""]).optional(),
  travel_frequency: z.enum(["never", "rarely", "few_times_year", "monthly", "weekly", ""]).optional(),
  
  // Survey Preferences
  preferred_survey_length: z.enum(["short", "medium", "long", "any", ""]).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Calculate profile completion score
function calculateProfileCompletion(user: any): number {
  if (!user) return 0;
  
  const fields = [
    'first_name', 'last_name', 'email', 'birthday', 'gender', 'country_code', 
    'zip_code', 'phone_number', 'education_level', 'employment_status', 
    'occupation_category', 'household_income', 'marital_status', 'children_count',
    'shopping_habits', 'technology_usage', 'travel_frequency', 'preferred_survey_length',
    'profile_image_url'
  ];
  
  const filledFields = fields.filter(field => {
    const value = user[field];
    return value !== null && value !== undefined && value !== '';
  });
  
  return Math.round((filledFields.length / fields.length) * 100);
}

export default function Profile() {
  const { user, signOut, refreshUser } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileCompletion = calculateProfileCompletion(user);

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      profile_image_url: user?.profile_image_url || "",
      phone_number: user?.phone_number || "",
      birthday: user?.birthday || "",
      gender: user?.gender || "",
      country_code: user?.country_code || "",
      zip_code: user?.zip_code || "",
      education_level: user?.education_level || "",
      employment_status: user?.employment_status || "",
      occupation_category: user?.occupation_category || "",
      household_income: user?.household_income || "",
      marital_status: user?.marital_status || "",
      children_count: user?.children_count || "",
      shopping_habits: user?.shopping_habits || "",
      technology_usage: user?.technology_usage || "",
      travel_frequency: user?.travel_frequency || "",
      preferred_survey_length: user?.preferred_survey_length || "any",
    },
  });

  const handleLogout = () => {
    signOut();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or GIF image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setProfileImagePreview(base64);
      form.setValue('profile_image_url', base64);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id) return;

    setIsSubmitting(true);

    try {
      // Prepare update data - remove empty strings and convert to null
      const updateData: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value === "") {
          updateData[key] = null;
        } else if (value !== undefined) {
          updateData[key] = value;
        }
      });

      await supabaseHelpers.updateUserProfile(user.id, updateData);
      
      // Refresh user data
      await refreshUser();

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      profile_image_url: user?.profile_image_url || "",
      phone_number: user?.phone_number || "",
      birthday: user?.birthday || "",
      gender: user?.gender || "",
      country_code: user?.country_code || "",
      zip_code: user?.zip_code || "",
      education_level: user?.education_level || "",
      employment_status: user?.employment_status || "",
      occupation_category: user?.occupation_category || "",
      household_income: user?.household_income || "",
      marital_status: user?.marital_status || "",
      children_count: user?.children_count || "",
      shopping_habits: user?.shopping_habits || "",
      technology_usage: user?.technology_usage || "",
      travel_frequency: user?.travel_frequency || "",
      preferred_survey_length: user?.preferred_survey_length || "any",
    });
    setProfileImagePreview(null);
    
    toast({
      title: "Changes discarded",
      description: "Form has been reset to original values",
    });
  };

  if (isMobile) {
    return (
      <div className="p-4" data-testid="page-profile">
        <header className="bg-background border-b border-border px-4 py-4 -mx-4 mb-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-bold text-foreground">Your Profile</h1>
              <p className="text-sm text-muted-foreground">Complete profile for better surveys</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
              Sign Out
            </Button>
          </div>
        </header>

        {/* Profile Completion Score */}
        <Card className="mb-4 border-primary/20" data-testid="card-profile-completion">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Avatar className="w-16 h-16 cursor-pointer" onClick={() => fileInputRef.current?.click()} data-testid="avatar-profile">
                  <AvatarImage src={profileImagePreview || user?.profile_image_url || ''} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                  <Camera className="w-3 h-3 text-primary-foreground" />
                </div>
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
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Profile completeness</span>
                <span data-testid="text-profile-score">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" data-testid="progress-profile" />
              <p className="text-xs text-muted-foreground mt-1">Complete profile to unlock higher-paying surveys</p>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleImageUpload}
              className="hidden"
              data-testid="input-image-upload"
            />

            {/* Basic Info Section */}
            <Card data-testid="card-basic-info">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} data-testid="input-first-name" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} data-testid="input-last-name" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" disabled={isSubmitting} />
                      </FormControl>
                      <FormDescription>We'll never share your email</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} data-testid="input-phone" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Demographics Section */}
            <Card data-testid="card-demographics">
              <CardHeader>
                <CardTitle className="text-lg">Demographics</CardTitle>
                <p className="text-sm text-muted-foreground">Help us find better-paying surveys for you</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-birthday" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP/Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} data-testid="input-zip-code" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Education & Employment Section */}
            <Card data-testid="card-education-employment">
              <CardHeader>
                <CardTitle className="text-lg">Education & Employment</CardTitle>
                <p className="text-sm text-muted-foreground">Unlock premium surveys</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="education_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-education">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high_school">High School</SelectItem>
                          <SelectItem value="some_college">Some College</SelectItem>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-employment">
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="employed_full_time">Employed Full-Time</SelectItem>
                          <SelectItem value="employed_part_time">Employed Part-Time</SelectItem>
                          <SelectItem value="self_employed">Self-Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-occupation">
                            <SelectValue placeholder="Select occupation" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="household_income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Household Income</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-income">
                            <SelectValue placeholder="Select income range" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Family & Lifestyle Section */}
            <Card data-testid="card-family-lifestyle">
              <CardHeader>
                <CardTitle className="text-lg">Family & Lifestyle</CardTitle>
                <p className="text-sm text-muted-foreground">Match family-focused surveys</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="marital_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-marital">
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="domestic_partnership">Domestic Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="children_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Children</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-children">
                            <SelectValue placeholder="Select number of children" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No children</SelectItem>
                          <SelectItem value="1">1 child</SelectItem>
                          <SelectItem value="2">2 children</SelectItem>
                          <SelectItem value="3">3 children</SelectItem>
                          <SelectItem value="4_or_more">4 or more children</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Interests & Behavior Section */}
            <Card data-testid="card-interests-behavior">
              <CardHeader>
                <CardTitle className="text-lg">Interests & Behavior</CardTitle>
                <p className="text-sm text-muted-foreground">Unlock specialized high-paying surveys</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="shopping_habits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shopping Habits</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-shopping">
                            <SelectValue placeholder="Select shopping style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="online_primarily">Primarily Online</SelectItem>
                          <SelectItem value="in_store_primarily">Primarily In-Store</SelectItem>
                          <SelectItem value="mixed">Mixed Online/In-Store</SelectItem>
                          <SelectItem value="budget_conscious">Budget Conscious</SelectItem>
                          <SelectItem value="brand_loyal">Brand Loyal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technology_usage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technology Usage</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-technology">
                            <SelectValue placeholder="Select tech usage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="early_adopter">Early Adopter</SelectItem>
                          <SelectItem value="mainstream">Mainstream User</SelectItem>
                          <SelectItem value="late_adopter">Late Adopter</SelectItem>
                          <SelectItem value="minimal_user">Minimal User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="travel_frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-travel">
                            <SelectValue placeholder="Select travel frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="rarely">Rarely (1-2 times/year)</SelectItem>
                          <SelectItem value="few_times_year">Few times/year</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Survey Preferences Section */}
            <Card data-testid="card-survey-preferences">
              <CardHeader>
                <CardTitle className="text-lg">Survey Preferences</CardTitle>
                <p className="text-sm text-muted-foreground">Customize your survey experience</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="preferred_survey_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Survey Length</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger data-testid="select-survey-length">
                            <SelectValue placeholder="Any length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short">Short (5-10 min)</SelectItem>
                          <SelectItem value="medium">Medium (10-20 min)</SelectItem>
                          <SelectItem value="long">Long (20+ min)</SelectItem>
                          <SelectItem value="any">Any length</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                data-testid="button-save-profile"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleCancel}
                disabled={isSubmitting}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // Desktop view
  return (
    <div data-testid="page-profile" className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          Logout
        </Button>
      </div>

      {/* Profile Completion Alert */}
      {profileCompletion < 100 && (
        <Alert className="mb-6" data-testid="alert-completion">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your profile is {profileCompletion}% complete. Complete all fields to unlock more survey opportunities!
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card data-testid="card-profile-summary">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar 
                    className="w-24 h-24 cursor-pointer" 
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="avatar-profile"
                  >
                    <AvatarImage src={profileImagePreview || user?.profile_image_url || ''} />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {user?.first_name || user?.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : 'Complete Your Profile'
                  }
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                
                <Separator className="my-4 w-full" />
                
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="font-semibold" data-testid="text-profile-score">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2 mb-2" data-testid="progress-profile" />
                  <p className="text-xs text-muted-foreground">
                    {profileCompletion === 100 ? 
                      "Your profile is complete!" : 
                      "Complete your profile to maximize earnings"
                    }
                  </p>
                </div>
                
                <Separator className="my-4 w-full" />
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center" data-testid="card-total-earned">
                    <p className="text-2xl font-bold text-foreground">
                      ${((user?.total_earned || 0) / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Earned</p>
                  </div>
                  <div className="text-center" data-testid="card-tasks-completed">
                    <p className="text-2xl font-bold text-foreground">{user?.tasks_completed || 0}</p>
                    <p className="text-xs text-muted-foreground">Tasks Done</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleImageUpload}
                className="hidden"
                data-testid="input-image-upload"
              />

              {/* Basic Info Section */}
              <Card data-testid="card-basic-info">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} data-testid="input-first-name" disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} data-testid="input-last-name" disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" disabled={isSubmitting} />
                        </FormControl>
                        <FormDescription>We'll never share your email with anyone</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} data-testid="input-phone" disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Demographics Section */}
              <Card data-testid="card-demographics">
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                  <p className="text-sm text-muted-foreground">Help us find better-paying surveys for you</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthday"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birthday</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-birthday" disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-gender">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-country">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                              <SelectItem value="DE">Germany</SelectItem>
                              <SelectItem value="FR">France</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zip_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} data-testid="input-zip-code" disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Education & Employment Section */}
              <Card data-testid="card-education-employment">
                <CardHeader>
                  <CardTitle>Education & Employment</CardTitle>
                  <p className="text-sm text-muted-foreground">Higher education and employment details unlock premium surveys</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="education_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-education">
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high_school">High School</SelectItem>
                              <SelectItem value="some_college">Some College</SelectItem>
                              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                              <SelectItem value="master">Master's Degree</SelectItem>
                              <SelectItem value="doctorate">Doctorate</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employment_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-employment">
                                <SelectValue placeholder="Select employment status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="employed_full_time">Employed Full-Time</SelectItem>
                              <SelectItem value="employed_part_time">Employed Part-Time</SelectItem>
                              <SelectItem value="self_employed">Self-Employed</SelectItem>
                              <SelectItem value="unemployed">Unemployed</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="occupation_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-occupation">
                                <SelectValue placeholder="Select occupation" />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="household_income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Household Income</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-income">
                                <SelectValue placeholder="Select income range" />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Family & Lifestyle Section */}
              <Card data-testid="card-family-lifestyle">
                <CardHeader>
                  <CardTitle>Family & Lifestyle</CardTitle>
                  <p className="text-sm text-muted-foreground">Family details help match family-focused and lifestyle surveys</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marital_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-marital">
                                <SelectValue placeholder="Select marital status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                              <SelectItem value="domestic_partnership">Domestic Partnership</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Children</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-children">
                                <SelectValue placeholder="Select number of children" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">No children</SelectItem>
                              <SelectItem value="1">1 child</SelectItem>
                              <SelectItem value="2">2 children</SelectItem>
                              <SelectItem value="3">3 children</SelectItem>
                              <SelectItem value="4_or_more">4 or more children</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Interests & Behavior Section */}
              <Card data-testid="card-interests-behavior">
                <CardHeader>
                  <CardTitle>Interests & Behavior</CardTitle>
                  <p className="text-sm text-muted-foreground">Your habits and interests unlock specialized high-paying surveys</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shopping_habits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shopping Habits</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-shopping">
                                <SelectValue placeholder="Select shopping style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="online_primarily">Primarily Online</SelectItem>
                              <SelectItem value="in_store_primarily">Primarily In-Store</SelectItem>
                              <SelectItem value="mixed">Mixed Online/In-Store</SelectItem>
                              <SelectItem value="budget_conscious">Budget Conscious</SelectItem>
                              <SelectItem value="brand_loyal">Brand Loyal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="technology_usage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technology Usage</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger data-testid="select-technology">
                                <SelectValue placeholder="Select tech usage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="early_adopter">Early Adopter</SelectItem>
                              <SelectItem value="mainstream">Mainstream User</SelectItem>
                              <SelectItem value="late_adopter">Late Adopter</SelectItem>
                              <SelectItem value="minimal_user">Minimal User</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="travel_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travel Frequency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger data-testid="select-travel">
                              <SelectValue placeholder="Select travel frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="rarely">Rarely (1-2 times/year)</SelectItem>
                            <SelectItem value="few_times_year">Few times/year</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Survey Preferences Section */}
              <Card data-testid="card-survey-preferences">
                <CardHeader>
                  <CardTitle>Survey Preferences</CardTitle>
                  <p className="text-sm text-muted-foreground">Customize your survey experience</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="preferred_survey_length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Survey Length</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger data-testid="select-survey-length">
                              <SelectValue placeholder="Any length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="short">Short (5-10 min)</SelectItem>
                            <SelectItem value="medium">Medium (10-20 min)</SelectItem>
                            <SelectItem value="long">Long (20+ min)</SelectItem>
                            <SelectItem value="any">Any length</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Form Actions */}
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isSubmitting}
                  data-testid="button-save-profile"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
