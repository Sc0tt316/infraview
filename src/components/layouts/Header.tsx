
import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  openMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, openMobileSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Generate page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
  }

  // Generate page subtitle based on current path
  const getPageSubtitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Overview of your printing system';
      case '/printers':
        return 'Manage your network printers';
      case '/users':
        return 'Manage your system users';
      case '/analytics':
        return 'Monitor your printer usage and performance';
      case '/alerts':
        return 'View and manage system alerts';
      case '/settings':
        return 'Configure your system settings';
      default:
        return '';
    }
  }

  return (
    <div className="border-b border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between p-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={window.innerWidth >= 768 ? toggleSidebar : openMobileSidebar}
            className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-50 transition-colors"
          >
            <Menu size={20} />
          </Button>
          
          <div className="hidden md:block">
            <h1 className="text-2xl font-semibold text-slate-100">{getPageTitle()}</h1>
            <p className="text-sm text-slate-400">{getPageSubtitle()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-50 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Avatar className="h-8 w-8 bg-primary/20 border border-primary/10">
            <AvatarFallback className="text-blue-400 text-sm font-medium">
              {user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Mobile title - only shown on small screens */}
      <div className="md:hidden px-4 pb-4">
        <h1 className="text-xl font-semibold text-slate-100">{getPageTitle()}</h1>
        <p className="text-xs text-slate-400">{getPageSubtitle()}</p>
      </div>
    </div>
  );
};

export default Header;
