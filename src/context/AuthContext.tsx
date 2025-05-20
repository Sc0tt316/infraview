
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, LoginCredentials } from '@/types/user';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updatePassword: (oldPassword: string, newPassword: string) => void;
  updateProfile: (data: Partial<User>) => void;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  updatePassword: () => {},
  updateProfile: () => {},
  session: null,
});

export const useAuth = () => useContext(AuthContext);

// Helper function to convert Supabase User to our User type
const mapSupabaseUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
  if (!supabaseUser) return null;
  
  // Get profile data from our profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .maybeSingle();
  
  return {
    id: supabaseUser.id,
    name: profile?.name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    role: profile?.role as 'admin' | 'user' | 'manager' || 'user',
    department: profile?.department || '',
    phone: profile?.phone || '',
    status: profile?.status as 'active' | 'inactive' | 'pending' || 'active',
    profileImage: profile?.profile_image || ''
  };
};

// Clean up Supabase auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize auth from Supabase
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            const mappedUser = await mapSupabaseUser(session?.user || null);
            setUser(mappedUser);
            setIsAuthenticated(!!mappedUser);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        const mappedUser = await mapSupabaseUser(session.user);
        setUser(mappedUser);
        setIsAuthenticated(!!mappedUser);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      // After login succeeds, the onAuthStateChange listener will update the state
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const logout = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear local state
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      
      // Force page reload for a clean state in complex applications
      // window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update password.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated."
      });
    } catch (error) {
      console.error('Update password error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      // Update profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          department: data.department,
          phone: data.phone,
          profile_image: data.profileImage
        })
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update profile.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      updatePassword,
      updateProfile,
      session
    }}>
      {children}
    </AuthContext.Provider>
  );
};
