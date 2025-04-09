
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Printer, 
  AlertCircle, 
  Users, 
  LineChart, 
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  active?: boolean;
}

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Routes for navigation
  const routes = [
    {
      href: '/',
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      showFor: ['admin', 'manager', 'user']
    },
    {
      href: '/printers',
      label: 'Printers',
      icon: <Printer className="h-5 w-5" />,
      showFor: ['admin', 'manager', 'user']
    },
    {
      href: '/alerts',
      label: 'Alerts',
      icon: <AlertCircle className="h-5 w-5" />,
      showFor: ['admin', 'manager', 'user']
    },
    {
      href: '/users',
      label: 'Users',
      icon: <Users className="h-5 w-5" />,
      showFor: ['admin', 'manager']
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: <LineChart className="h-5 w-5" />,
      showFor: ['admin', 'manager']
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      showFor: ['admin', 'manager', 'user']
    }
  ];
  
  // Filter routes based on user role
  const filteredRoutes = routes.filter(route => 
    user && route.showFor.includes(user.role)
  );

  return (
    <div className="h-full flex flex-col border-r bg-background">
      <div className="flex items-center h-16 px-6 border-b">
        <Logo />
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {filteredRoutes.map(route => (
            <NavLink
              key={route.href}
              href={route.href}
              active={location.pathname === route.href}
              icon={route.icon}
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign out
        </Button>
        <div className="mt-2 text-xs text-muted-foreground px-2">
          Logged in as {user?.name}
          <div className="font-medium">{user?.role}</div>
        </div>
      </div>
    </div>
  );
};

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  icon,
  active
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default Sidebar;
