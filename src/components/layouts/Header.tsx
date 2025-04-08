
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar: () => void;
  openMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, openMobileSidebar }) => {
  return (
    <div className="flex items-center justify-between p-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Menu size={20} />
      </Button>
      
      <div className="flex items-center ml-auto gap-3">
        {/* Add any header buttons, notifications, etc. here */}
      </div>
    </div>
  );
};

export default Header;
