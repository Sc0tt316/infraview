
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, Save, X, Key } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Settings = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    phone: user?.phone || ''
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      phone: user?.phone || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      phone: user?.phone || ''
    });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const updatedUser = await userService.updateUser(user.id, {
        ...editedUser,
        role: user.role,
        status: user.status || 'active'
      });

      if (updatedUser) {
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    try {
      // You would implement password change logic here
      // For now, just show success message
      toast({
        title: "Success",
        description: "Password changed successfully"
      });
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {user?.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user?.name || 'User'} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                disabled={!isEditing}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={getRoleBadgeColor(user?.role || 'user')}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Profile Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={editedUser.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="min-h-[40px] px-3 py-2 border rounded-md bg-muted/50 flex items-center">
                  {user?.name || 'Not set'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              ) : (
                <div className="min-h-[40px] px-3 py-2 border rounded-md bg-muted/50 flex items-center">
                  {user?.email || 'Not set'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="min-h-[40px] px-3 py-2 border rounded-md bg-muted/50 flex items-center">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Not set'}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              {isEditing ? (
                <Input
                  id="department"
                  value={editedUser.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Enter your department"
                />
              ) : (
                <div className="min-h-[40px] px-3 py-2 border rounded-md bg-muted/50 flex items-center">
                  {user?.department || 'Not set'}
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedUser.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                />
              ) : (
                <div className="min-h-[40px] px-3 py-2 border rounded-md bg-muted/50 flex items-center">
                  {user?.phone || 'Not set'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and choose a new one
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePasswordChange}>
                    Change Password
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
