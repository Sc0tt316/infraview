
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { PrinterData } from '@/types/printers';
import { Badge } from '@/components/ui/badge';

interface StatusLevelsProps {
  inkLevel: number;
  paperLevel: number;
  status?: 'online' | 'offline' | 'error' | 'maintenance' | 'warning';
  subStatus?: string;
  supplies?: PrinterData['supplies'];
}

const StatusLevels: React.FC<StatusLevelsProps> = ({ inkLevel, paperLevel, supplies, status, subStatus }) => {
  const getStatusBadge = () => {
    if (!status) return null;
    
    let color = "bg-gray-500";
    switch (status) {
      case 'online': color = "bg-green-500"; break;
      case 'offline': color = "bg-gray-500"; break;
      case 'error': color = "bg-red-500"; break;
      case 'warning': color = "bg-amber-500"; break;
      case 'maintenance': color = "bg-blue-500"; break;
    }
    
    return <Badge className={color}>{status}</Badge>;
  };
  
  return (
    <div className="space-y-4">
      {/* Status & Sub-status */}
      {(status || subStatus) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span>Printer Status</span>
            {getStatusBadge()}
          </div>
          {subStatus && (
            <div className="text-sm text-muted-foreground">
              Current state: {subStatus}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusLevels;
