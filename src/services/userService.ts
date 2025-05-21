
import { apiService } from './api';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

// User service functions
export const userService = {
  // Get all users
  getAllUsers: async (): Promise<UserData[]> => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      return profiles.map(profile => ({
        id: profile.id,
        name: profile.name || 'Unknown',
        email: profile.email || 'No email',
        role: profile.role as 'admin' | 'manager' | 'user' || 'user',
        department: profile.department,
        phone: profile.phone || '',
        status: profile.status as 'active' | 'inactive' | 'pending' || 'active',
        lastActive: profile.last_active,
        profileImage: profile.profile_image
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Get user by ID
  getUserById: async (id: string): Promise<UserData | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!profile) {
        return null;
      }
      
      return {
        id: profile.id,
        name: profile.name || 'Unknown',
        email: profile.email || 'No email',
        role: profile.role as 'admin' | 'manager' | 'user' || 'user',
        department: profile.department,
        phone: profile.phone || '',
        status: profile.status as 'active' | 'inactive' | 'pending' || 'active',
        lastActive: profile.last_active,
        profileImage: profile.profile_image
      };
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user details. Please try again."
      });
      return null;
    }
  },
  
  // Update user profile
  updateUser: async (id: string, updateData: Partial<UserData>): Promise<UserData | null> => {
    try {
      // Handle special case for new users
      if (id === "new") {
        return userService.addUser(updateData);
      }
      
      // Convert from UserData format to Supabase profiles format
      const profileData = {
        name: updateData.name,
        email: updateData.email,
        role: updateData.role,
        department: updateData.department,
        phone: updateData.phone,
        status: updateData.status,
        last_active: new Date().toISOString(),
        profile_image: updateData.profileImage
      };
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `User "${profile.name}" has been updated.`
      });
      
      return {
        id: profile.id,
        name: profile.name || 'Unknown',
        email: profile.email || 'No email',
        role: profile.role as 'admin' | 'manager' | 'user' || 'user',
        department: profile.department,
        phone: profile.phone || '',
        status: profile.status as 'active' | 'inactive' | 'pending' || 'active',
        lastActive: profile.last_active,
        profileImage: profile.profile_image
      };
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again."
      });
      return null;
    }
  },
  
  // Add a new user
  addUser: async (userData: Partial<UserData>): Promise<UserData | null> => {
    try {
      // Generate a temporary ID for new user - will be replaced by Supabase
      const tempId = crypto.randomUUID();
      
      // Set default status based on user role
      const userStatus = userData.role === 'admin' ? 'active' : 'pending';
      
      // Create the new user profile
      const newUserData = {
        id: tempId, // Temporary ID will be replaced by Supabase
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'user',
        department: userData.department || '',
        phone: userData.phone || '',
        status: userData.status || userStatus,
        profile_image: userData.profileImage
      };
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert([newUserData])
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `User "${profile.name}" has been added successfully.`
      });
      
      return {
        id: profile.id,
        name: profile.name || 'Unknown',
        email: profile.email || 'No email',
        role: profile.role as 'admin' | 'manager' | 'user' || 'user',
        department: profile.department || '',
        phone: profile.phone || '',
        status: profile.status as 'active' | 'inactive' | 'pending',
        lastActive: profile.last_active,
        profileImage: profile.profile_image
      };
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user. Please try again."
      });
      return null;
    }
  },
  
  // Upload profile picture
  uploadProfilePicture: async (userId: string, file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile.${fileExt}`;
      const filePath = `${userId}/profile.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: publicURL } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);
        
      if (!publicURL) {
        throw new Error('Failed to get public URL for uploaded image');
      }
      
      // Update user profile with new image URL
      await userService.updateUser(userId, { 
        profileImage: publicURL.publicUrl 
      });
      
      return publicURL.publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture. Please try again."
      });
      return null;
    }
  }
};
