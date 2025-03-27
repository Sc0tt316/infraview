
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BellIcon, 
  UserIcon, 
  SettingsIcon, 
  ShieldIcon, 
  CreditCardIcon,
  GlobeIcon,
  MenuIcon,
  SaveIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              {activeTab === 'account' && <AccountSettings />}
              {activeTab === 'appearance' && <AppearanceSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'billing' && <BillingSettings />}
              {activeTab === 'integrations' && <IntegrationsSettings />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Settings navigation items
const navigation = [
  { id: 'account', label: 'Account', icon: UserIcon },
  { id: 'appearance', label: 'Appearance', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'security', label: 'Security', icon: ShieldIcon },
  { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  { id: 'integrations', label: 'Integrations', icon: GlobeIcon }
];

// Account Settings Component
const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <CardHeader className="px-6">
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <div className="px-6 space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
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
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="johndoe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="admin">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">Regular User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Appearance Settings Component
const AppearanceSettings = () => {
  return (
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
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Reduced Motion</h3>
              <p className="text-sm text-muted-foreground">Minimize animations throughout the app</p>
            </div>
            <Switch />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
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
            <Select defaultValue="medium">
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
          <Button>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = () => {
  return (
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
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive push notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Marketing Emails</h3>
              <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Activity Digest</h3>
              <p className="text-sm text-muted-foreground">Receive weekly summary of your activity</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = () => {
  return (
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
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Activity Logging</h3>
              <p className="text-sm text-muted-foreground">Log all activity on your account</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Billing Settings Component
const BillingSettings = () => {
  return (
    <div className="space-y-6">
      <CardHeader className="px-6">
        <CardTitle>Billing Settings</CardTitle>
      </CardHeader>
      <div className="px-6 space-y-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Current Plan</h3>
                <p className="text-sm text-muted-foreground">Pro Plan - $29/month</p>
              </div>
              <Button variant="outline" size="sm">Change Plan</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-medium">Payment Method</h3>
            <div className="p-4 border rounded-md flex justify-between items-center">
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                <div>
                  <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <Button variant="outline" size="sm" className="mt-2">Add Payment Method</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-medium">Billing Information</h3>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Main St" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue="San Francisco" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" defaultValue="CA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP</Label>
                <Input id="zip" defaultValue="94103" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Integrations Settings Component
const IntegrationsSettings = () => {
  return (
    <div className="space-y-6">
      <CardHeader className="px-6">
        <CardTitle>Integrations Settings</CardTitle>
      </CardHeader>
      <div className="px-6 space-y-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-slate-200 rounded-md mr-3 flex items-center justify-center">
                  <GlobeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Google Drive</h3>
                  <p className="text-sm text-muted-foreground">Connect to your Google Drive account</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-slate-200 rounded-md mr-3 flex items-center justify-center">
                  <GlobeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Dropbox</h3>
                  <p className="text-sm text-muted-foreground">Connect to your Dropbox account</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-slate-200 rounded-md mr-3 flex items-center justify-center">
                  <GlobeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Slack</h3>
                  <p className="text-sm text-muted-foreground">Connect to your Slack workspace</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-green-600 mr-2">Connected</p>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-slate-200 rounded-md mr-3 flex items-center justify-center">
                  <GlobeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">GitHub</h3>
                  <p className="text-sm text-muted-foreground">Connect to your GitHub account</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
