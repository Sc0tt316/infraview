
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  department?: string;
  lastActive?: string;
  status?: 'active' | 'inactive' | 'pending';
  phone: string;
}
