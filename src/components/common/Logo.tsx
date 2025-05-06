
import React from 'react';

interface LogoProps {
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ iconOnly = false }) => {
  if (iconOnly) {
    return (
      <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-md hover:rotate-[360deg] transition-all duration-1000">
        <span className="text-lg font-bold text-primary">M</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-md hover:rotate-[360deg] transition-all duration-1000">
        <span className="text-lg font-bold text-primary">M</span>
      </div>
      <span className="text-xl font-medium">M-Printer</span>
    </div>
  );
};

export default Logo;
