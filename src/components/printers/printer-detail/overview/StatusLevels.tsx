
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
  const hasDetailedSupplies = supplies && (supplies.cyan !== undefined || supplies.magenta !== undefined || supplies.yellow !== undefined);
  
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
      
      {hasDetailedSupplies ? (
        <>
          {/* For color printers with detailed supplies - show toner levels */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Black Toner ({supplies.black}%)</span>
              <span className={supplies.black < 10 ? "text-red-500" : supplies.black < 25 ? "text-amber-500" : ""}>
                {supplies.black < 10 ? "Very Low" : supplies.black < 25 ? "Low" : "OK"}
              </span>
            </div>
            <Progress value={supplies.black} className="h-2 bg-gray-200" indicatorClassName="bg-black" />
          </div>
          
          {supplies.cyan !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cyan Toner ({supplies.cyan}%)</span>
                <span className={supplies.cyan < 10 ? "text-red-500" : supplies.cyan < 25 ? "text-amber-500" : ""}>
                  {supplies.cyan < 10 ? "Very Low" : supplies.cyan < 25 ? "Low" : "OK"}
                </span>
              </div>
              <Progress value={supplies.cyan} className="h-2 bg-gray-200" indicatorClassName="bg-[#0EA5E9]" />
            </div>
          )}
          
          {supplies.magenta !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Magenta Toner ({supplies.magenta}%)</span>
                <span className={supplies.magenta < 10 ? "text-red-500" : supplies.magenta < 25 ? "text-amber-500" : ""}>
                  {supplies.magenta < 10 ? "Very Low" : supplies.magenta < 25 ? "Low" : "OK"}
                </span>
              </div>
              <Progress value={supplies.magenta} className="h-2 bg-gray-200" indicatorClassName="bg-[#D946EF]" />
            </div>
          )}
          
          {supplies.yellow !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Yellow Toner ({supplies.yellow}%)</span>
                <span className={supplies.yellow < 10 ? "text-red-500" : supplies.yellow < 25 ? "text-amber-500" : ""}>
                  {supplies.yellow < 10 ? "Very Low" : supplies.yellow < 25 ? "Low" : "OK"}
                </span>
              </div>
              <Progress value={supplies.yellow} className="h-2 bg-gray-200" indicatorClassName="bg-yellow-400" />
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ink Level ({inkLevel}%)</span>
            <span className={inkLevel < 10 ? "text-red-500" : inkLevel < 25 ? "text-amber-500" : ""}>
              {inkLevel < 10 ? "Very Low" : inkLevel < 25 ? "Low" : "OK"}
            </span>
          </div>
          <Progress value={inkLevel} className="h-2" />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Paper Level ({paperLevel}%)</span>
          <span className={paperLevel < 10 ? "text-red-500" : paperLevel < 25 ? "text-amber-500" : ""}>
            {paperLevel < 10 ? "Very Low" : paperLevel < 25 ? "Low" : "OK"}
          </span>
        </div>
        <Progress value={paperLevel} className="h-2" />
      </div>
    </div>
  );
};

export default StatusLevels;
