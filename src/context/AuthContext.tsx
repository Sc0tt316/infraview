
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, LoginCredentials } from '@/types/user';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updatePassword: (oldPassword: string, newPassword: string) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  updatePassword: () => {},
  updateProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        localStorage.removeItem('current_user');
      }
    }
  }, []);

  // Mock login function with our test users
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // This would normally be an API call
      const mockUsers = [
        {
          id: 'u1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin' as const,
          department: 'IT',
          phone: '555-123-4567',
          status: 'active' as const,
          password: 'password',
          profileImage: ''
        },
        {
          id: 'u2',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user' as const,
          department: 'Marketing',
          phone: '555-987-6543',
          status: 'active' as const,
          password: 'password',
          profileImage: ''
        }
      ];
      
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remove password before setting user
        const { password, ...secureUser } = foundUser;
        
        // Restore profile image if it was saved in local storage
        const storedUser = localStorage.getItem('user_profile_' + foundUser.id);
        let profileImage = '';
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            profileImage = parsedUser.profileImage || '';
          } catch (e) {
            console.error('Failed to parse stored user profile', e);
          }
        }
        
        const userWithProfile = {
          ...secureUser,
          profileImage
        };
        
        setUser(userWithProfile as User);
        setIsAuthenticated(true);
        localStorage.setItem('current_user', JSON.stringify(userWithProfile));
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        return false;
      }
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
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('current_user');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };
  
  const updatePassword = (oldPassword: string, newPassword: string) => {
    // In a real app, this would call an API to verify old password and update
    if (oldPassword !== 'password') {
      toast({
        title: "Error",
        description: "Your current password is incorrect.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Password updated:', newPassword);
    
    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated."
    });
  };
  
  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    // Save to localStorage for persistence
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    
    // Also save to a user-specific storage key for better persistence across logins
    localStorage.setItem('user_profile_' + user.id, JSON.stringify(updatedUser));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      updatePassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
