
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUserRole: (userId: string, newRole: 'admin' | 'user') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@printerverse.com',
    password: 'admin123', // In a real app, passwords would be hashed
    name: 'Admin User',
    role: 'admin' as const
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user' as const
  }
];

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Retrieve all users from localStorage or initialize with demo data
  const getAllUsers = () => {
    const storedUsers = localStorage.getItem('all_users');
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (error) {
        console.error('Failed to parse stored users:', error);
      }
    }
    // Initialize with demo users if none exist
    localStorage.setItem('all_users', JSON.stringify(DEMO_USERS));
    return DEMO_USERS;
  };

  // Check for existing session on load
  useEffect(() => {
    // First ensure all users are set up
    getAllUsers();
    
    // Check for current user session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const allUsers = getAllUsers();
    const foundUser = allUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      return true;
    } else {
      toast.error('Invalid email or password');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
    toast.info('You have been logged out');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const allUsers = getAllUsers();
    
    // Check if user already exists
    const userExists = allUsers.some((u: any) => u.email === email);
    
    if (userExists) {
      toast.error('User with this email already exists');
      return false;
    }
    
    // Create new user with "user" role always (enforcing the requirement)
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password, // In a real app, this would be hashed
      role: 'user' as const
    };
    
    // Update all users in localStorage
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('all_users', JSON.stringify(updatedUsers));
    
    // Log in the new user (without password in session)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    
    toast.success('Registration successful!');
    return true;
  };

  // New function: Update user role (only admins can use this)
  const updateUserRole = async (userId: string, newRole: 'admin' | 'user'): Promise<boolean> => {
    // Check if current user is an admin
    if (!user || user.role !== 'admin') {
      toast.error('Only administrators can change user roles');
      return false;
    }
    
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      toast.error('User not found');
      return false;
    }
    
    // Update the user's role
    allUsers[userIndex].role = newRole;
    localStorage.setItem('all_users', JSON.stringify(allUsers));
    
    // If updating the current user, also update the session
    if (userId === user.id) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
    
    toast.success(`User role updated to ${newRole}`);
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      register,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
