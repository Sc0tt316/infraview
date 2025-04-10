
import React from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  toggleSidebar: () => void;
  openMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, openMobileSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
        return 'Manage system users';
      case '/analytics':
        return 'Monitor printer usage and performance';
      case '/activity':
        return 'View recent system activity';
      case '/alerts':
        return 'View and manage system alerts';
      case '/settings':
        return 'Configure system settings';
      default:
        return '';
    }
  }

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between p-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={window.innerWidth >= 768 ? toggleSidebar : openMobileSidebar}
            className="rounded-full"
          >
            <Menu size={20} />
          </Button>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">{getPageSubtitle()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile title - only shown on small screens */}
      <div className="md:hidden px-4 pb-3">
        <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
        <p className="text-xs text-muted-foreground">{getPageSubtitle()}</p>
      </div>
    </div>
  );
};

export default Header;
