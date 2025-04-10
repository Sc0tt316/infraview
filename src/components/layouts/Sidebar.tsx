
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Printer, 
  Users, 
  BarChart2, 
  BellRing,
  Settings,
  LogOut,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/user';
import { useTheme } from '@/context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, user }) => {
  const { logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Printers', href: '/printers', icon: Printer },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Alerts', href: '/alerts', icon: BellRing },
  ];

  // Safe implementation of getting user initials
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.trim().split(' ');
    if (nameParts.length === 0 || !nameParts[0]) return 'U';
    
    if (nameParts.length === 1 || !nameParts[1]) {
      return nameParts[0].charAt(0) || 'U';
    }
    
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 bg-card border-r border-border",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"
      )}
    >
      {/* Logo and Brand */}
      <div className="flex h-16 items-center px-4 border-b border-border">
        <div className={cn(
          "flex items-center transition-all duration-300", 
          isOpen ? "justify-start" : "justify-center w-full"
        )}>
          <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-md border border-primary/20">
            <span className="text-primary font-bold text-xl">M</span>
          </div>
          {isOpen && (
            <span className="ml-3 text-xl font-semibold text-primary">M-Printer Manager</span>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto scrollbar-none">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => cn(
              isOpen ? "sidebar-link" : "flex flex-col items-center justify-center px-2 py-3 rounded-lg text-xs",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              "transition-all duration-200 font-medium"
            )}
          >
            <item.icon className={cn("flex-shrink-0", isOpen ? "h-5 w-5 mr-3" : "h-5 w-5 mb-1")} />
            <span className={cn("whitespace-nowrap", !isOpen && "mt-1")}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>
      
      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center",
          isOpen ? "justify-between" : "flex-col"
        )}>
          <div className={cn("flex", isOpen ? "items-center" : "flex-col items-center")}>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              {getUserInitials()}
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || 'Anonymous User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || 'no-email@example.com'}
                </p>
              </div>
            )}
          </div>
          
          <div className={cn("flex", isOpen ? "space-x-2" : "flex-col mt-4 space-y-2")}>
            <NavLink to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-accent hover:text-foreground h-8 w-8"
              >
                <Settings size={18} />
              </Button>
            </NavLink>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-red-500 hover:bg-red-500/10 hover:text-red-600 h-8 w-8"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
