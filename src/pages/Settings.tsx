
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, LogOut, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';

const Settings = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    phone: user?.phone || ''
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

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account and session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-start">
            <Button 
              variant="destructive" 
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
