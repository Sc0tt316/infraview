
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BellIcon, 
  UserIcon, 
  SettingsIcon, 
  ShieldIcon,
  MenuIcon,
  SaveIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Settings interface
interface UserSettings {
  appearance: {
    darkMode: boolean;
    reducedMotion: boolean;
    language: string;
    fontSize: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    activityDigest: boolean;
  };
  security: {
    twoFactor: boolean;
    activityLogging: boolean;
  };
}

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
  appearance: {
    darkMode: false,
    reducedMotion: false,
    language: 'en',
    fontSize: 'medium',
  },
  notifications: {
    email: true,
    push: true,
    marketing: false,
    activityDigest: true,
  },
  security: {
    twoFactor: false,
    activityLogging: true,
  }
};

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for account
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.name?.toLowerCase().replace(/\s+/g, '') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'user');

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('user_settings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      localStorage.setItem('user_settings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
      setIsLoading(false);
    }, 800);
  };

  // Save account settings
  const saveAccountSettings = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      toast.success('Account settings saved successfully');
      setIsLoading(false);
    }, 800);
  };

  // Handle appearance changes
  const handleAppearanceChange = (key: keyof UserSettings['appearance'], value: any) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };

  // Handle notification changes
  const handleNotificationChange = (key: keyof UserSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  // Handle security changes
  const handleSecurityChange = (key: keyof UserSettings['security'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-2"
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </motion.div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8">
        {/* Mobile Menu Button - Shown only on small screens */}
        <div className="lg:hidden flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-full mb-4 flex items-center justify-between"
          >
            <span>{navigation.find(item => item.id === activeTab)?.label || 'Navigation'}</span>
            <MenuIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation Menu - Sheet component */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">Settings</h3>
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Side Navigation */}
        <div className="hidden lg:block">
          <Card className="w-[240px]">
            <CardContent className="p-4">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area - Dynamic based on active tab */}
        <div className="flex-1">
          <Card className="border shadow">
            <CardContent className="p-0 sm:p-6">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <CardHeader className="px-6">
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <div className="px-6 space-y-6">
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
                      <div className="flex-shrink-0">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="" alt={user?.name || 'User'} />
                          <AvatarFallback className="text-xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">Upload a new avatar for your profile</p>
                        <div className="flex space-x-2">
                          <Button size="sm">Upload New</Button>
                          <Button size="sm" variant="outline">Remove</Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select 
                            value={role} 
                            onValueChange={setRole} 
                            disabled={user?.role !== 'admin'}
                          >
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="user">Regular User</SelectItem>
                            </SelectContent>
                          </Select>
                          {user?.role !== 'admin' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Only admins can change roles
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={saveAccountSettings} disabled={isLoading}>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <CardHeader className="px-6">
                    <CardTitle>Appearance Settings</CardTitle>
                  </CardHeader>
                  <div className="px-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Dark Mode</h3>
                          <p className="text-sm text-muted-foreground">Enable dark mode for the interface</p>
                        </div>
                        <Switch 
                          checked={settings.appearance.darkMode}
                          onCheckedChange={(checked) => handleAppearanceChange('darkMode', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Reduced Motion</h3>
                          <p className="text-sm text-muted-foreground">Minimize animations throughout the app</p>
                        </div>
                        <Switch 
                          checked={settings.appearance.reducedMotion}
                          onCheckedChange={(checked) => handleAppearanceChange('reducedMotion', checked)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select 
                          value={settings.appearance.language}
                          onValueChange={(value) => handleAppearanceChange('language', value)}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fontSize">Font Size</Label>
                        <Select 
                          value={settings.appearance.fontSize}
                          onValueChange={(value) => handleAppearanceChange('fontSize', value)}
                        >
                          <SelectTrigger id="fontSize">
                            <SelectValue placeholder="Select font size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={saveSettings} disabled={isLoading}>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <CardHeader className="px-6">
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <div className="px-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">Receive email notifications</p>
                        </div>
                        <Switch 
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Push Notifications</h3>
                          <p className="text-sm text-muted-foreground">Receive push notifications</p>
                        </div>
                        <Switch 
                          checked={settings.notifications.push}
                          onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Marketing Emails</h3>
                          <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                        </div>
                        <Switch 
                          checked={settings.notifications.marketing}
                          onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Activity Digest</h3>
                          <p className="text-sm text-muted-foreground">Receive weekly summary of your activity</p>
                        </div>
                        <Switch 
                          checked={settings.notifications.activityDigest}
                          onCheckedChange={(checked) => handleNotificationChange('activityDigest', checked)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={saveSettings} disabled={isLoading}>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <CardHeader className="px-6">
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <div className="px-6 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch 
                          checked={settings.security.twoFactor}
                          onCheckedChange={(checked) => handleSecurityChange('twoFactor', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Activity Logging</h3>
                          <p className="text-sm text-muted-foreground">Log all activity on your account</p>
                        </div>
                        <Switch 
                          checked={settings.security.activityLogging}
                          onCheckedChange={(checked) => handleSecurityChange('activityLogging', checked)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={saveSettings} disabled={isLoading}>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Settings navigation items (removed billing and integrations)
const navigation = [
  { id: 'account', label: 'Account', icon: UserIcon },
  { id: 'appearance', label: 'Appearance', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'security', label: 'Security', icon: ShieldIcon },
];

export default SettingsPage;
