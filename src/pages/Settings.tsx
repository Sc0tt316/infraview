
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LogOut, Lock, Camera, Upload, Edit } from 'lucide-react';
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
  const {
    user,
    updatePassword,
    logout,
    updateProfile
  } = useAuth();
  const extendedUser = user as ExtendedUser | null;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(extendedUser?.profileImage || '');
  const [profileName, setProfileName] = useState(extendedUser?.name || '');
  const [profileDepartment, setProfileDepartment] = useState(extendedUser?.department || '');
  const [newEmail, setNewEmail] = useState(extendedUser?.email || '');
  const [emailPassword, setEmailPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        duration: 2000
      });
      return;
    }
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        duration: 2000
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        duration: 2000
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        name: profileName,
        department: profileDepartment
      });
      
      setIsProfileModalOpen(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        duration: 2000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password to change email",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    if (newEmail === extendedUser?.email) {
      toast({
        title: "Error",
        description: "New email is the same as current email",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    try {
      await updateProfile({
        email: newEmail
      });
      
      setIsEmailModalOpen(false);
      setEmailPassword('');
      toast({
        title: "Success",
        description: "Email update initiated. Please check your email for verification.",
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImage(reader.result);

        // Update profile in context and localStorage for persistence
        updateProfile({
          profileImage: reader.result
        });
        toast({
          title: "Success",
          description: "Profile image updated successfully",
          duration: 2000
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
                    <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 rounded-full shadow-md" onClick={triggerFileInput}>
                      <Camera size={14} />
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center" onClick={triggerFileInput}>
                    <Upload className="mr-1 h-3 w-3" />
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs text-muted-foreground">Full Name</Label>
                      <div className="flex items-center justify-between">
                        <p id="name" className="text-sm font-medium">{extendedUser?.name || 'Not set'}</p>
                        <Button variant="ghost" size="sm" onClick={() => setIsProfileModalOpen(true)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs text-muted-foreground">Email Address</Label>
                      <div className="flex items-center justify-between">
                        <p id="email" className="text-sm font-medium">{extendedUser?.email || 'Not set'}</p>
                        <Button variant="ghost" size="sm" onClick={() => setIsEmailModalOpen(true)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="role" className="text-xs text-muted-foreground">Role</Label>
                      <p id="role" className="text-sm font-medium capitalize">{extendedUser?.role || 'Not set'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-xs text-muted-foreground">Department</Label>
                      <div className="flex items-center justify-between">
                        <p id="department" className="text-sm font-medium">{extendedUser?.department || 'Not assigned'}</p>
                        <Button variant="ghost" size="sm" onClick={() => setIsProfileModalOpen(true)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
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

      {/* Profile Edit Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your name and department information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input 
                  id="profile-name" 
                  type="text" 
                  value={profileName} 
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-department">Department</Label>
                <Input 
                  id="profile-department" 
                  type="text" 
                  value={profileDepartment} 
                  onChange={e => setProfileDepartment(e.target.value)}
                  placeholder="Enter your department"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsProfileModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Email Change Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription>
              Enter your new email address and current password for security verification.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailChange}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email Address</Label>
                <Input 
                  id="new-email" 
                  type="email" 
                  value={newEmail} 
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-password">Current Password</Label>
                <Input 
                  id="email-password" 
                  type="password" 
                  value={emailPassword} 
                  onChange={e => setEmailPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEmailModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Email</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                <Input id="old-password" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
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
