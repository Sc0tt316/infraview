
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Settings: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const { toast } = useToast();
  
  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const handleSubmitPasswordChange = () => {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match."
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long."
      });
      return;
    }
    
    // In a real app, you would verify the current password first
    updatePassword(newPassword);
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    
    // Reset form and close modal
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setShowPasswordModal(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.name || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue={user?.role || ''} readOnly />
              </div>
              
              <Button 
                className="mt-4"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                <Switch id="2fa" />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Enabling two-factor authentication adds an extra layer of security to your account. 
                When enabled, you will be prompted for a verification code when logging in.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="printer_alerts">Printer Alerts</Label>
                <Switch id="printer_alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system_alerts">System Alerts</Label>
                <Switch id="system_alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance">Maintenance Notifications</Label>
                <Switch id="maintenance" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="low_supplies">Low Supplies Warnings</Label>
                <Switch id="low_supplies" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                You will receive notifications based on your preferences.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize your display preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark_mode">Dark Mode</Label>
                <Switch id="dark_mode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="compact_view">Compact View</Label>
                <Switch id="compact_view" />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Display settings are saved locally on this device.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
            <Button onClick={handleSubmitPasswordChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
