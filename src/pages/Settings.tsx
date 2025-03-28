
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Bell, Shield, UserCog } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAuth, User as UserType } from "@/context/AuthContext";
import { userService } from "@/services/userService";

type SettingsTab = "account" | "appearance" | "notifications" | "security";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [passwordUpdates, setPasswordUpdates] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

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
        setIsDarkMode(parsedSettings.isDarkMode || false);
        setEmailNotifications(parsedSettings.emailNotifications || true);
        setPushNotifications(parsedSettings.pushNotifications || true);
        setPasswordUpdates(parsedSettings.passwordUpdates || true);
        setTwoFactorAuth(parsedSettings.twoFactorAuth || false);
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
    
    // Load all users if admin
    if (isAdmin) {
      loadUsers();
    }
  }, [user, isAdmin]);

  // Load all users for admin
  const loadUsers = () => {
    const allUsers = localStorage.getItem('all_users');
    if (allUsers) {
      try {
        const parsedUsers = JSON.parse(allUsers);
        const usersWithoutPasswords = parsedUsers.map((user: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        setUsers(usersWithoutPasswords);
      } catch (error) {
        console.error('Failed to parse users:', error);
      }
    }
  };

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      isDarkMode,
      emailNotifications,
      pushNotifications,
      passwordUpdates,
      twoFactorAuth
    };
    
    localStorage.setItem('user_settings', JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  // Handle role change (only for admins)
  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    if (!isAdmin) return;
    
    const { updateUserRole } = useAuth();
    const success = await updateUserRole(userId, newRole);
    
    if (success) {
      loadUsers(); // Reload users after update
    }
  };
  
  return (
    <div className="container mx-auto pt-4 pb-8 max-w-6xl">
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2"
        >
          Settings
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className="text-muted-foreground"
        >
          Manage your account settings and preferences
        </motion.p>
      </div>
      
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
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" alt={user?.name || 'User'} />
                      <AvatarFallback className="text-2xl">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
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
                
                {/* Admin section: Manage all users */}
                {isAdmin && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Manage Users (Admin Only)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50 border-b">
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Role</th>
                            <th className="text-left p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u.id} className="border-b">
                              <td className="p-2">{u.name}</td>
                              <td className="p-2">{u.email}</td>
                              <td className="p-2">{u.role}</td>
                              <td className="p-2">
                                <RadioGroup 
                                  value={u.role} 
                                  onValueChange={(value) => handleRoleChange(u.id, value as "admin" | "user")}
                                  className="flex items-center space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="user" id={`user-${u.id}`} />
                                    <Label htmlFor={`user-${u.id}`}>User</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="admin" id={`admin-${u.id}`} />
                                    <Label htmlFor={`admin-${u.id}`}>Admin</Label>
                                  </div>
                                </RadioGroup>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings}>Save Changes</Button>
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
                    onCheckedChange={setIsDarkMode} 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings}>Save Changes</Button>
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
                <Button onClick={saveSettings}>Save Changes</Button>
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
                <div className="pt-4">
                  <Button variant="outline" className="w-full md:w-auto">Change Password</Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
