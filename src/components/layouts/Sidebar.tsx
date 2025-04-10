
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
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/user';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, user }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Printers', href: '/printers', icon: Printer },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Alerts', href: '/alerts', icon: BellRing },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 bg-slate-900 border-r border-slate-800",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}
    >
      {/* Logo and Brand */}
      <div className="flex h-16 items-center px-4 border-b border-slate-800">
        <div className={cn(
          "flex items-center transition-all duration-300", 
          isOpen ? "justify-start" : "justify-center w-full"
        )}>
          <div className="h-10 w-10 bg-[#300054] flex items-center justify-center rounded-md border border-[#6e59a5]">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          {isOpen && (
            <span className="ml-3 text-xl font-semibold text-blue-400">M-Printer Manager</span>
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
              isOpen ? "flex items-center px-4 py-3 rounded-lg text-sm" : "flex flex-col items-center justify-center px-2 py-3 rounded-lg text-xs",
              isActive 
                ? "bg-slate-800 text-blue-400" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
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
      <div className="p-4 border-t border-slate-800">
        <div className={cn(
          "flex items-center",
          isOpen ? "justify-between" : "flex-col"
        )}>
          <div className={cn("flex", isOpen ? "items-center" : "flex-col items-center")}>
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-100">
                  Admin User
                </p>
                <p className="text-xs text-slate-400">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
            )}
          </div>
          
          <div className={cn("flex", isOpen ? "space-x-2" : "flex-col mt-4 space-y-2")}>
            <NavLink to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:bg-slate-800 hover:text-slate-100 h-8 w-8"
              >
                <Settings size={18} />
              </Button>
            </NavLink>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 w-8"
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
