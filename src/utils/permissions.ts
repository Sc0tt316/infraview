
import { User } from '@/types/user';

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // For now we just do simple role-based checks
  switch(permission) {
    case 'manage_users':
      return user.role === 'admin';
    case 'manage_printers':
      return user.role === 'admin' || user.role === 'manager';
    case 'view_dashboard':
      return true; // All users can view dashboard
    case 'resolve_alerts':
      return user.role === 'admin';
    default:
      return false;
  }
};
