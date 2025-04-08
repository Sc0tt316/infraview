
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  department?: string;
  lastActive?: string;
  status?: 'active' | 'inactive' | 'pending';
  phone?: string;
}

export interface NewUserWithPassword {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  phone?: string;
}
