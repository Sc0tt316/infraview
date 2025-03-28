
import { apiService } from './api';
import { toast } from 'sonner';

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
    const mockUsers: (UserData & { password: string })[] = [
      {
        id: "u1",
        name: "Alex Johnson",
        email: "admin@printerverse.com",
        phone: "+1 (555) 123-4567",
        role: "admin",
        department: "IT",
        status: "active",
        lastActive: "2 minutes ago",
        password: "admin123" // Note: In a real app, this would be hashed
      },
      {
        id: "u2",
        name: "Sarah Miller",
        email: "user@example.com",
        phone: "+1 (555) 234-5678",
        role: "user",
        department: "Marketing",
        status: "active",
        lastActive: "1 hour ago",
        password: "user123"
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
        password: "manager123"
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
        password: "user456"
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
        password: "manager456"
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
      const users = await apiService.get<(UserData & { password?: string })[]>('users');
      
      // Remove password field from users before returning
      return users ? users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }) : [];
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to fetch users. Please try again.");
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
      toast.error("Failed to fetch user details. Please try again.");
      return null;
    }
  },
  
  // Add new user with password (for admin-created accounts)
  addUserWithPassword: async (
    userData: Omit<UserData, 'id' | 'lastActive'> & { password: string }
  ): Promise<UserData> => {
    try {
      const allUsers = await apiService.get<(UserData & { password: string })[]>('users') || [];
      
      // Check if user already exists
      const userExists = allUsers.some(u => u.email === userData.email);
      if (userExists) {
        toast.error("A user with this email already exists.");
        throw new Error("User already exists");
      }
      
      const newUser = {
        ...userData,
        id: `u${Date.now()}`,
        lastActive: "Just added"
      };
      
      const updatedUsers = [...allUsers, newUser];
      await apiService.post('users', updatedUsers);
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      toast.success(`User "${newUser.name}" has been added.`);
      
      return userWithoutPassword;
    } catch (error) {
      console.error('Error adding user with password:', error);
      if (!(error instanceof Error && error.message === "User already exists")) {
        toast.error("Failed to add user. Please try again.");
      }
      throw error;
    }
  },
  
  // Update user (fixed to prevent freezing)
  updateUser: async (id: string, updateData: Partial<UserData>): Promise<UserData | null> => {
    try {
      const allUsers = await apiService.get<(UserData & { password: string })[]>('users') || [];
      const userIndex = allUsers.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        toast.error("User not found.");
        return null;
      }
      
      // Create a new user object with the updates
      const updatedUser = {
        ...allUsers[userIndex],
        ...updateData,
        lastActive: "Just updated"
      };
      
      // Create a new array with the updated user
      const updatedUsers = [...allUsers];
      updatedUsers[userIndex] = updatedUser;
      
      // Update the data
      await apiService.post('users', updatedUsers);
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      toast.success(`User "${updatedUser.name}" has been updated.`);
      
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      toast.error("Failed to update user. Please try again.");
      return null;
    }
  },
  
  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const allUsers = await apiService.get<(UserData & { password: string })[]>('users') || [];
      const userIndex = allUsers.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        toast.error("User not found.");
        return false;
      }
      
      const userName = allUsers[userIndex].name;
      const updatedUsers = allUsers.filter(user => user.id !== id);
      await apiService.post('users', updatedUsers);
      
      toast.success(`User "${userName}" has been deleted.`);
      
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      toast.error("Failed to delete user. Please try again.");
      return false;
    }
  },
  
  // Change user status
  changeStatus: async (id: string, status: UserData['status']): Promise<UserData | null> => {
    return userService.updateUser(id, { status });
  },
};
