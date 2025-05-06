
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  updatePassword: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing user on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, hardcode some user data
      // In a real app, you would make an API call
      if (email === 'admin@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('user_password', 'password');  // Store password for demo purposes
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }

      if (email === 'user@example.com' && password === 'password') {
        const userData: User = {
          id: '2',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('user_password', 'password');  // Store password for demo purposes
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updatePassword = (newPassword: string) => {
    // In a real app, you would make an API call to update the password
    // Here we just store it in localStorage for demo purposes
    localStorage.setItem('user_password', newPassword);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
