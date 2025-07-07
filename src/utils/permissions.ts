
import { User } from '@/types/user';

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  switch(permission) {
    case 'manage_users':
      return user.role === 'admin';
    case 'manage_printers':
      return user.role === 'admin' || user.role === 'manager';
    case 'manage_servers':
      return user.role === 'admin' || user.role === 'manager';
    case 'add_printers':
      return user.role === 'admin' || user.role === 'manager';
    case 'add_servers':
      return user.role === 'admin' || user.role === 'manager';
    case 'delete_printers':
      return user.role === 'admin' || user.role === 'manager';
    case 'delete_servers':
      return user.role === 'admin' || user.role === 'manager';
    case 'edit_printers':
      return user.role === 'admin' || user.role === 'manager';
    case 'edit_servers':
      return user.role === 'admin' || user.role === 'manager';
    case 'view_dashboard':
      return true; // All users can view dashboard
    case 'resolve_alerts':
      return user.role === 'admin' || user.role === 'manager';
    case 'view_analytics':
      return user.role === 'admin' || user.role === 'manager';
    case 'manage_settings':
      return user.role === 'admin' || user.role === 'manager';
    default:
      return false;
  }
};
