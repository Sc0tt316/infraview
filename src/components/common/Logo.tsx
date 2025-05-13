
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: { logo: 'h-6 w-6', container: 'h-8 w-8', text: 'text-base' },
    md: { logo: 'h-8 w-8', container: 'h-10 w-10', text: 'text-xl' },
    lg: { logo: 'h-10 w-10', container: 'h-12 w-12', text: 'text-2xl' },
  };

  return (
    <Link to="/" className="flex items-center gap-3">
      <div 
        className={cn(
          "bg-[#300054] flex items-center justify-center rounded-md border border-[#ff6b6b] transition-transform duration-500 hover:rotate-[360deg]",
          sizeClasses[size].container,
          className
        )}
      >
        <img 
          src="/lovable-uploads/79c40e69-54c0-4cbd-a41c-369e4c8bb316.png" 
          alt="M-Printer Logo" 
          className={cn(
            "object-contain",
            sizeClasses[size].logo
          )}
        />
      </div>
      <span className={cn("font-medium text-primary truncate", sizeClasses[size].text)}>M-Printer</span>
    </Link>
  );
};

export default Logo;
