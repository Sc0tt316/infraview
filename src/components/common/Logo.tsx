import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className
}) => {
  // Make sure size is one of the allowed values
  const validSize = size === 'sm' || size === 'md' || size === 'lg' ? size : 'md';
  const sizeClasses = {
    sm: {
      logo: 'h-6 w-6',
      container: 'h-8 w-8',
      text: 'text-base'
    },
    md: {
      logo: 'h-8 w-8',
      container: 'h-10 w-10',
      text: 'text-xl'
    },
    lg: {
      logo: 'h-10 w-10',
      container: 'h-12 w-12',
      text: 'text-2xl'
    }
  };
  return <Link to="/" className="flex items-center gap-3">
      <div className={cn("bg-primary flex items-center justify-center rounded-md border transition-transform duration-500 hover:rotate-[360deg]", sizeClasses[validSize].container, className)}>
        <span className={cn("text-primary-foreground font-bold", sizeClasses[validSize].text)}>M</span>
      </div>
      <span className={cn("font-medium text-primary truncate", sizeClasses[validSize].text)}>   M-InfraView</span>
    </Link>;
};
export default Logo;