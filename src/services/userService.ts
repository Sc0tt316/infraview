
import { apiService } from './api';
import { toast } from '@/hooks/use-toast';

// Define user types
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "manager";
  department: string;
  status: "active" | "inactive";
  lastActive: string;
  avatar?: string;
}

// Initialize with mock data if none exists
const initializeUsers = async () => {
  const existingUsers = await apiService.get<UserData[]>('users');
  if (!existingUsers) {
    const mockUsers: UserData[] = [
      {
        id: "u1",
        name: "Alex Johnson",
        email: "alex.johnson@printerverse.com",
        phone: "+1 (555) 123-4567",
        role: "admin",
        department: "IT",
        status: "active",
        lastActive: "2 minutes ago",
      },
      {
        id: "u2",
        name: "Sarah Miller",
        email: "sarah.miller@printerverse.com",
        phone: "+1 (555) 234-5678",
        role: "user",
        department: "Marketing",
        status: "active",
        lastActive: "1 hour ago",
      },
      {
        id: "u3",
        name: "Michael Chen",
        email: "michael.chen@printerverse.com",
        phone: "+1 (555) 345-6789",
        role: "manager",
        department: "Operations",
        status: "inactive",
        lastActive: "3 days ago",
      },
      {
        id: "u4",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@printerverse.com",
        phone: "+1 (555) 456-7890",
        role: "user",
        department: "HR",
        status: "active",
        lastActive: "4 hours ago",
      },
      {
        id: "u5",
        name: "James Wilson",
        email: "james.wilson@printerverse.com",
        phone: "+1 (555) 567-8901",
        role: "manager",
        department: "Finance",
        status: "active",
        lastActive: "Yesterday",
      },
    ];
    await apiService.post('users', mockUsers);
    return mockUsers;
  }
  return existingUsers;
};

// User service functions
export const userService = {
  // Get all users
  getAllUsers: async (): Promise<UserData[]> => {
    try {
      await initializeUsers();
      const users = await apiService.get<UserData[]>('users');
      return users || [];
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
      const users = await userService.getAllUsers();
      return users.find(user => user.id === id) || null;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },
  
  // Add new user
  addUser: async (userData: Omit<UserData, 'id' | 'lastActive'>): Promise<UserData> => {
    try {
      const users = await userService.getAllUsers();
      
      const newUser: UserData = {
        ...userData,
        id: `u${Date.now()}`,
        lastActive: "Just added"
      };
      
      const updatedUsers = [...users, newUser];
      await apiService.post('users', updatedUsers);
      
      toast({
        title: "Success",
        description: `User "${newUser.name}" has been added.`,
      });
      
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  },
  
  // Update user
  updateUser: async (id: string, updateData: Partial<UserData>): Promise<UserData | null> => {
    try {
      const users = await userService.getAllUsers();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found.",
          variant: "destructive"
        });
        return null;
      }
      
      const updatedUser = {
        ...users[userIndex],
        ...updateData,
        lastActive: "Just updated"
      };
      
      users[userIndex] = updatedUser;
      await apiService.post('users', users);
      
      toast({
        title: "Success",
        description: `User "${updatedUser.name}" has been updated.`,
      });
      
      return updatedUser;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },
  
  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const users = await userService.getAllUsers();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found.",
          variant: "destructive"
        });
        return false;
      }
      
      const userName = users[userIndex].name;
      const updatedUsers = users.filter(user => user.id !== id);
      await apiService.post('users', updatedUsers);
      
      toast({
        title: "Success",
        description: `User "${userName}" has been deleted.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },
  
  // Change user status
  changeStatus: async (id: string, status: UserData['status']): Promise<UserData | null> => {
    return userService.updateUser(id, { status });
  },
};
