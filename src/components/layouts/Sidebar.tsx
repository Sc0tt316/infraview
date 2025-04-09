
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Printer,
  Bell,
  Users,
  ActivityIcon,
  LogOut,
  Settings,
} from 'lucide-react';

import Logo from '@/components/common/Logo';
import { UserData } from '@/types/user';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  user: UserData;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  user,
}) => {
  const location = useLocation();
  
  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Printers', icon: Printer, path: '/printers' },
    { name: 'Alerts', icon: Bell, path: '/alerts' },
    { name: 'Activity', icon: ActivityIcon, path: '/activity' },
  ];
  
  // Add Users menu item only for admin users
  if (user.role === 'admin') {
    navigationItems.push({ name: 'Users', icon: Users, path: '/users' });
  }
  
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-30 h-full bg-card border-r border-r-border transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex h-full flex-col justify-between py-4">
        {/* Logo and toggle */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-8">
            {isOpen ? <Logo /> : <Logo iconOnly />}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="rounded-full"
            >
              {isOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    !isOpen && 'justify-center'
                  )
                }
              >
                <item.icon className={cn('h-5 w-5', !isOpen ? 'mx-auto' : 'mr-3')} />
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            ))}
          </div>
        </div>
        
        {/* User and logout */}
        <div className="mt-auto px-3 space-y-3">
          {/* Settings link */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                !isOpen && 'justify-center'
              )
            }
          >
            <Settings className={cn('h-5 w-5', !isOpen ? 'mx-auto' : 'mr-3')} />
            {isOpen && <span>Settings</span>}
          </NavLink>
          
          {/* Logout button */}
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
              !isOpen && 'justify-center'
            )}
            onClick={() => {
              // Add logout logic
            }}
          >
            <LogOut className={cn('h-5 w-5', !isOpen ? 'mx-auto' : 'mr-3')} />
            {isOpen && <span>Logout</span>}
          </Button>
          
          {/* User profile */}
          {isOpen && (
            <div className="mt-3 flex items-center px-3 py-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="truncate">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
          )}
          
          {!isOpen && (
            <div className="flex justify-center py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
