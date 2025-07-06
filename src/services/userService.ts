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
  
  // Add a new user - Fixed to properly handle profile creation
  addUser: async (userData: Partial<UserData & { password?: string }>): Promise<UserData | null> => {
    try {
      console.log('Adding user with data:', userData);
      
      if (!userData.password || !userData.email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Email and password are required to create a new user."
        });
        return null;
      }

      // First create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name || ''
        }
      });
      
      if (authError) {
        console.error('Auth user creation error:', authError);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to create user account: ${authError.message}`
        });
        return null;
      }
      
      const userId = authData.user.id;
      console.log('Created auth user with ID:', userId);
      
      // Create the profile with the auth user ID using the service role client
      const profileData = {
        id: userId,
        name: userData.name || '',
        email: userData.email,
        role: userData.role || 'user',
        department: userData.department || '',
        phone: userData.phone || '',
        status: 'active',
        profile_image: userData.profileImage
      };
      
      console.log('Creating profile with data:', profileData);
      
      // Use a direct insert with the service role to bypass RLS
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select('*')
        .single();
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try to clean up the auth user if profile creation failed
        try {
          await supabase.auth.admin.deleteUser(userId);
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
        
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to create user profile: ${profileError.message}`
        });
        return null;
      }
      
      console.log('Successfully created profile:', profile);
      
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
  
  // Update user profile - Fixed to properly commit changes
  updateUser: async (id: string, updateData: Partial<UserData & { password?: string }>, isPasswordVerified: boolean = false): Promise<UserData | null> => {
    try {
      console.log('Updating user with ID:', id, 'and data:', updateData);
      
      // Handle special case for new users
      if (id === "new") {
        return userService.addUser(updateData);
      }
      
      // Get current user data to check if sensitive data is changing
      const currentUser = await userService.getUserById(id);
      const isEmailChanged = updateData.email && currentUser && currentUser.email !== updateData.email;
      const isPasswordChanged = updateData.password && updateData.password.length >= 6;
      const isRoleChanged = updateData.role && currentUser && currentUser.role !== updateData.role;
      
      // If email or password is being updated, update it in Supabase Auth as well
      if (isEmailChanged || isPasswordChanged) {
        console.log('Updating authentication credentials...');
        
        // Get the current session to check if we're updating the current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user.id === id) {
          // If updating current user's credentials, use updateUser
          const updatePayload: any = {};
          if (isEmailChanged) updatePayload.email = updateData.email;
          if (isPasswordChanged) updatePayload.password = updateData.password;
          
          const { error: authError } = await supabase.auth.updateUser(updatePayload);
          
          if (authError) {
            console.error('Auth update error:', authError);
            toast({
              variant: "destructive",
              title: "Error",
              description: `Failed to update authentication: ${authError.message}`
            });
            return null;
          }
        } else {
          // For admin updating another user's credentials, use admin API
          if (isEmailChanged || isPasswordChanged) {
            console.log('Admin updating another user credentials - using admin API');
            
            const updatePayload: any = {};
            if (isEmailChanged) updatePayload.email = updateData.email;
            if (isPasswordChanged) updatePayload.password = updateData.password;
            
            const { error: adminAuthError } = await supabase.auth.admin.updateUserById(id, updatePayload);
            
            if (adminAuthError) {
              console.error('Admin auth update error:', adminAuthError);
              toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to update user authentication: ${adminAuthError.message}`
              });
              return null;
            }
          }
        }
      }
      
      // Convert from UserData format to Supabase profiles format, only including fields that have values
      const profileData: any = {};
      if (updateData.name !== undefined) profileData.name = updateData.name;
      if (updateData.email !== undefined) profileData.email = updateData.email;
      if (updateData.role !== undefined) profileData.role = updateData.role;
      if (updateData.department !== undefined) profileData.department = updateData.department;
      if (updateData.phone !== undefined) profileData.phone = updateData.phone;
      if (updateData.status !== undefined) profileData.status = updateData.status;
      if (updateData.profileImage !== undefined) profileData.profile_image = updateData.profileImage;
      
      // Always update last_active
      profileData.last_active = new Date().toISOString();
      
      console.log('Profile data to update:', profileData);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      console.log('Successfully updated profile:', profile);
      
      // Log the activity
      const changes = [];
      if (isEmailChanged) changes.push('email changed');
      if (isPasswordChanged) changes.push('password changed');
      if (isRoleChanged) changes.push('role changed');
      const changesText = changes.length > 0 ? ` (${changes.join(', ')})` : '';
      
      await logUserActivity(
        'User Updated',
        `User "${profile.name}" profile was updated${changesText}`,
        'success'
      );

      toast({
        title: "Success",
        description: `User "${profile.name}" has been updated successfully.`
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

      // Delete from auth first, then from profiles
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      
      if (authError) {
        console.error('Auth deletion error:', authError);
        // Continue with profile deletion even if auth deletion fails
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

  // Verify current user password before allowing edits
  verifyCurrentPassword: async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return !error;
    } catch (error) {
      console.error('Password verification error:', error);
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
