
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LogOut, Lock, Camera, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Extend the User type with the properties we need
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  profileImage?: string;
}

const Settings = () => {
  const { user, updatePassword, logout, updateProfile } = useAuth();
  const extendedUser = user as ExtendedUser | null;
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(extendedUser?.profileImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oldPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
      });
      return;
    }
    
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }
    
    // Verify old password before updating
    updatePassword(oldPassword, newPassword);
    
    // Reset form and close modal
    setIsPasswordModalOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImage(reader.result);
        
        // Update profile in context and localStorage for persistence
        updateProfile({ profileImage: reader.result });
        
        toast({
          title: "Success",
          description: "Profile image updated successfully"
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                View and manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-muted-foreground/10">
                      <AvatarImage src={profileImage} alt={extendedUser?.name || "User"} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {extendedUser?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full shadow-md"
                      onClick={triggerFileInput}
                    >
                      <Camera size={14} />
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                    onClick={triggerFileInput}
                  >
                    <Upload className="mr-1 h-3 w-3" />
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs text-muted-foreground">Full Name</Label>
                      <p id="name" className="text-sm font-medium">{extendedUser?.name || 'Not set'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs text-muted-foreground">Email Address</Label>
                      <p id="email" className="text-sm font-medium">{extendedUser?.email || 'Not set'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="role" className="text-xs text-muted-foreground">Role</Label>
                      <p id="role" className="text-sm font-medium capitalize">{extendedUser?.role || 'Not set'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-xs text-muted-foreground">Department</Label>
                      <p id="department" className="text-sm font-medium">{extendedUser?.department || 'Not assigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2 mt-4 border-t">
                    <Button variant="destructive" onClick={logout} size="sm">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Change your password
                  </p>
                </div>
                <Button onClick={() => setIsPasswordModalOpen(true)}>
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">Current Password</Label>
                <Input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
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
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsPasswordModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
