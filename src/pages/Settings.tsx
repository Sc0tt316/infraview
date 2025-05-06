
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Bell, Shield, UserCog, Camera, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

type SettingsTab = "account" | "appearance" | "notifications" | "security";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [passwordUpdates, setPasswordUpdates] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, updatePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme === 'dark';

  // Load settings from localStorage on component mount
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    // Load other settings from localStorage
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setEmailNotifications(parsedSettings.emailNotifications || true);
        setPushNotifications(parsedSettings.pushNotifications || true);
        setPasswordUpdates(parsedSettings.passwordUpdates || true);
        setTwoFactorAuth(parsedSettings.twoFactorAuth || false);

        // Load avatar URL if it exists
        if (parsedSettings.avatarUrl) {
          setAvatarUrl(parsedSettings.avatarUrl);
        }
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, [user]);

  // Trigger file input click when avatar is clicked
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For now, we'll create a data URL
      const reader = new FileReader();
      reader.onload = event => {
        const dataUrl = event.target?.result as string;
        setAvatarUrl(dataUrl);

        // Update the settings in localStorage
        const savedSettings = localStorage.getItem('user_settings');
        const settings = savedSettings ? JSON.parse(savedSettings) : {};
        settings.avatarUrl = dataUrl;
        localStorage.setItem('user_settings', JSON.stringify(settings));
        toast.success("Avatar updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  // Save settings to localStorage
  const saveSettings = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const settings = {
        isDarkMode,
        emailNotifications,
        pushNotifications,
        passwordUpdates,
        twoFactorAuth,
        avatarUrl
      };
      localStorage.setItem('user_settings', JSON.stringify(settings));
      toast.success("Settings saved successfully");
      setIsSubmitting(false);
    }, 600);
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    setIsChangingPassword(true);

    // Simulate password verification and update
    setTimeout(() => {
      // In a real app, you would verify the current password with the backend
      if (currentPassword !== "password") { // Mock password verification
        setPasswordError("Current password is incorrect");
        setIsChangingPassword(false);
        return;
      }

      // Update password in localStorage (mock implementation)
      try {
        // Call the auth context update password method
        updatePassword(newPassword);
        
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        toast.success("Password updated successfully");
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("Failed to update password");
      } finally {
        setIsChangingPassword(false);
      }
    }, 800);
  };

  return (
    <div className="container mx-auto pt-4 pb-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/4 space-y-4"
        >
          <Card>
            <CardContent className="p-4">
              <NavigationMenu orientation="vertical" className="flex flex-col w-full max-w-none">
                <NavigationMenuList className="flex flex-col space-y-1 items-start w-full">
                  <NavigationMenuItem className="w-full">
                    <Button 
                      variant={activeTab === "account" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("account")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <Button 
                      variant={activeTab === "appearance" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("appearance")}
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      Appearance
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <Button 
                      variant={activeTab === "notifications" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <Button 
                      variant={activeTab === "security" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("security")}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Main Content Area */}
        <motion.div 
          key={activeTab} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
          className="w-full lg:w-3/4"
        >
          {/* Account Settings */}
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <Avatar 
                        className="h-24 w-24 cursor-pointer border-2 border-transparent group-hover:border-primary transition-all duration-200" 
                        onClick={handleAvatarClick}
                      >
                        <AvatarImage src={avatarUrl} alt={user?.name || 'User'} />
                        <AvatarFallback className="text-2xl">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <span className="text-xs text-muted-foreground">Click to change avatar</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Your name" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="your.email@example.com" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Account Type</Label>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="font-medium">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                        <p className="text-sm text-muted-foreground">Your account permissions and access level</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how PrinterVerse looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode for reduced eye strain</p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={isDarkMode} 
                    onCheckedChange={toggleTheme} 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive in-app notifications</p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications} 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Security Settings */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password-updates" className="font-medium">Password Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about password changes</p>
                  </div>
                  <Switch 
                    id="password-updates" 
                    checked={passwordUpdates} 
                    onCheckedChange={setPasswordUpdates} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor-auth" className="font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Adds an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    id="two-factor-auth" 
                    checked={twoFactorAuth} 
                    onCheckedChange={setTwoFactorAuth} 
                  />
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={currentPassword} 
                        onChange={e => setCurrentPassword(e.target.value)} 
                        placeholder="Enter your current password" 
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        placeholder="Enter your new password" 
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        placeholder="Confirm your new password" 
                        required
                      />
                    </div>
                    
                    {passwordError && (
                      <p className="text-sm text-red-500">{passwordError}</p>
                    )}
                    
                    <Button type="submit" disabled={isChangingPassword} className="mt-2">
                      {isChangingPassword ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          Updating Password...
                        </span>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
