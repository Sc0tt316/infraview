
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Printer, 
  Activity, 
  Bell, 
  BarChart3, 
  Settings, 
  Users,
  Server,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/common/Logo';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Printers', href: '/printers', icon: Printer },
  { name: 'Servers', href: '/servers', icon: Server },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const adminNavigation = [
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isMobile) {
    return null; // Mobile sidebar is handled by MobileSidebar component
  }

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-card border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn(
          "transition-opacity duration-300",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          {!isCollapsed && (
            <div className="flex items-center -ml-1">
              <Logo size="sm" />
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isCollapsed && "px-2 justify-center"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        {isAdmin && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className={cn(
                "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                isCollapsed && "px-2 text-center"
              )}>
                {!isCollapsed && 'Admin'}
              </div>
              {adminNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        "w-full justify-start gap-3 h-10",
                        isCollapsed && "px-2 justify-center"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </ScrollArea>

      {/* User section */}
      <div className="border-t p-3">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg",
          isCollapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start gap-3 mt-2 h-10",
            isCollapsed && "px-2 justify-center"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};
