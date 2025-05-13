
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, LoginCredentials } from '@/types/user';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updatePassword: (password: string) => void;
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

  // Mock login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // This would normally be an API call
      const mockUsers = [
        {
          id: 'u1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          department: 'IT',
          password: 'admin123',
          profileImage: ''
        },
        {
          id: 'u2',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
          department: 'Marketing',
          password: 'user123',
          profileImage: ''
        }
      ];
      
      const foundUser = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
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
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again later.",
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
  
  const updatePassword = (password: string) => {
    // In a real app, this would call an API to update the password
    console.log('Password updated:', password);
    
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
