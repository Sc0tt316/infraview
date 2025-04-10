
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Home,
  Printer,
  Users,
  BarChart2,
  BellRing,
  Settings,
  X,
  LogOut,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/user';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, user }) => {
  const { logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Printers', href: '/printers', icon: Printer },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Alerts', href: '/alerts', icon: BellRing },
  ];
  
  const handleLogout = () => {
    logout();
    onClose();
  };

  // Safe implementation of getting user initials
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user?.name?.trim().split(' ') || [];
    if (nameParts.length === 0 || !nameParts[0]) return 'U';
    
    if (nameParts.length === 1 || !nameParts[1]) {
      return nameParts[0].charAt(0) || 'U';
    }
    
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card p-0 border-border h-[100dvh] w-[80vw] max-w-[300px] left-0 translate-x-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-md border border-primary/20">
                <span className="text-primary font-bold text-xl">M</span>
              </div>
              <span className="ml-3 text-lg font-semibold text-primary">M-Printer Manager</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto">
            <nav className="space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg text-sm font-medium
                    ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}
                  `}
                  onClick={onClose}
                >
                  <item.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {getUserInitials()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-foreground">{user?.name || 'Anonymous User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'no-email@example.com'}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <NavLink to="/settings" onClick={onClose} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
              </NavLink>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex-1 bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileSidebar;
