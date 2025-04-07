
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RestartButtonProps {
  isRestarting: boolean;
  disabled: boolean;
  onClick: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ isRestarting, disabled, onClick }) => {
  return (
    <div className="pt-4">
      <Button 
        onClick={onClick} 
        disabled={isRestarting || disabled} 
        className="w-full"
      >
        {isRestarting ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Restarting...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart Printer
          </>
        )}
      </Button>
    </div>
  );
};

export default RestartButton;
