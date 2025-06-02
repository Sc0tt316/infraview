import React from 'react';
import { format } from 'date-fns';
import { PrinterData } from '@/types/printers';
import { Badge } from '@/components/ui/badge';

interface PrinterInfoProps {
  printer: PrinterData;
}

const PrinterInfo: React.FC<PrinterInfoProps> = ({ printer }) => {
  const getStatusBadge = () => {
    if (!printer.status) return null;
    
    let badgeClasses = "capitalize text-white font-medium text-xs";
    switch (printer.status) {
      case 'online': badgeClasses += " bg-green-500"; break;
      case 'offline': badgeClasses += " bg-gray-500"; break;
      case 'error': badgeClasses += " bg-red-500"; break;
      case 'warning': badgeClasses += " bg-amber-500"; break;
      case 'maintenance': badgeClasses += " bg-blue-500"; break;
      default: badgeClasses += " bg-gray-500"; break;
    }
    
    return <Badge className={badgeClasses}>{printer.status}</Badge>;
  };

  const getSubStatusDisplay = () => {
    // If printer is offline or has connection issues, show "No Connection"
    if (printer.status === 'offline' || printer.status === 'error') {
      return (
        <div className="text-xs text-red-400 mt-1">
          No Connection
        </div>
      );
    }
    
    // Otherwise show the regular sub status if available
    if (printer.subStatus) {
      return (
        <div className="text-xs text-muted-foreground mt-1">
          {printer.subStatus}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full">
      <h3 className="text-base font-medium mb-3">Printer Information</h3>
      
      {/* Compact grid layout for printer info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-sm">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">NAME</div>
          <div className="font-medium truncate">{printer.name}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">MODEL</div>
          <div className="truncate">{printer.model}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">LOCATION</div>
          <div className="truncate">{printer.location}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">STATUS</div>
          <div>
            {getStatusBadge()}
            {getSubStatusDisplay()}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">IP ADDRESS</div>
          <div className="truncate text-xs">{printer.ipAddress || 'N/A'}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">DEPARTMENT</div>
          <div className="truncate">{printer.department || 'N/A'}</div>
        </div>
      </div>
      
      {/* Additional info in second row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm mt-4 pt-3 border-t">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">SERIAL NUMBER</div>
          <div className="truncate text-xs">{printer.serialNumber || 'N/A'}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">DATE ADDED</div>
          <div className="text-xs">
            {printer.addedDate ? format(new Date(printer.addedDate), 'MMM dd, yyyy') : 'N/A'}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">DRUM STATUS</div>
          <div className="text-xs">
            {printer.supplies && typeof printer.supplies === 'object' ? (
              (() => {
                const drumLevel = (printer.supplies as any).drum || 85;
                const drumColor = drumLevel < 10 ? "text-red-500" : drumLevel < 25 ? "text-amber-500" : "text-green-600";
                return (
                  <span className={drumColor}>
                    {drumLevel}% - {drumLevel > 75 ? 'Good' : drumLevel > 25 ? 'Fair' : 'Replace Soon'}
                  </span>
                );
              })()
            ) : (
              <span className="text-muted-foreground">Not Available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterInfo;
