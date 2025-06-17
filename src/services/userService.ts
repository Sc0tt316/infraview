import { apiService } from './api';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

// Activity logging function for user operations
const logUserActivity = async (action: string, details: string, status: 'success' | 'error' | 'info' = 'success') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('printer_activities')
      .insert({
        action,
        details,
        status,
        timestamp: new Date().toISOString(),
        user_id: user?.email || 'System',
        printer_name: 'User Management'
      });
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};

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
      
      // Get current user data to check if email is changing
      const currentUser = await userService.getUserById(id);
      const isEmailChanged = updateData.email && currentUser && currentUser.email !== updateData.email;
      
      // If email is being updated, update it in Supabase Auth as well
      if (isEmailChanged) {
        console.log('Updating email in authentication system...');
        
        // Get the current session to check if we're updating the current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user.id === id) {
          // If updating current user's email, use updateUser
          const { error: authError } = await supabase.auth.updateUser({
            email: updateData.email
          });
          
          if (authError) {
            console.error('Auth email update error:', authError);
            toast({
              variant: "destructive",
              title: "Error",
              description: `Failed to update email in authentication: ${authError.message}`
            });
            return null;
          }
        } else {
          // For admin updating another user's email, we need to use the admin API
          console.log('Admin updating another user email - this requires service role key');
          toast({
            variant: "destructive",
            title: "Permission Error",
            description: "Email updates for other users require admin privileges. Contact your system administrator."
          });
          return null;
        }
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
      
      // Log the activity
      await logUserActivity(
        'User Updated',
        `User "${profile.name}" profile was updated${isEmailChanged ? ' (email changed)' : ''}`,
        'success'
      );

      toast({
        title: "Success",
        description: `User "${profile.name}" has been updated.${isEmailChanged ? ' Email verification may be required.' : ''}`
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
      
      // Log the activity
      await logUserActivity(
        'User Added',
        `New user "${profile.name}" was added to the system with role: ${profile.role}`,
        'success'
      );

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
  
  // Delete a user
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Log the activity
      await logUserActivity(
        'User Deleted',
        `User "${profile?.name || 'Unknown'}" (${profile?.email || 'No email'}) was removed from the system`,
        'info'
      );

      toast({
        title: "Success",
        description: `User "${profile?.name || 'Unknown'}" has been deleted successfully.`
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again."
      });
      return false;
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
