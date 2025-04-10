
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'pending';
  lastActive?: string; // Add lastActive field to fix errors in userService
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department?: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  lastLogin?: string;
  lastActive?: string; // Add lastActive field to fix errors in userService
}

export interface LoginCredentials {
  email: string;
  password: string;
}
