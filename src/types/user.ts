
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'pending';
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
}

export interface LoginCredentials {
  email: string;
  password: string;
}
