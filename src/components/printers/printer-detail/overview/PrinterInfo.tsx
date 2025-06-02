
import React from 'react';
import { format } from 'date-fns';
import { PrinterData } from '@/types/printers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface PrinterInfoProps {
  printer: PrinterData;
}

const PrinterInfo: React.FC<PrinterInfoProps> = ({ printer }) => {
  const getStatusBadge = () => {
    if (!printer.status) return null;
    
    let color = "bg-gray-500";
    switch (printer.status) {
      case 'online': color = "bg-green-500"; break;
      case 'offline': color = "bg-gray-500"; break;
      case 'error': color = "bg-red-500"; break;
      case 'warning': color = "bg-amber-500"; break;
      case 'maintenance': color = "bg-blue-500"; break;
    }
    
    return <Badge className={`${color} capitalize text-white`}>{printer.status}</Badge>;
  };

  const getDrumStatus = () => {
    // Extract drum status from supplies data if available
    if (printer.supplies && typeof printer.supplies === 'object') {
      const drumLevel = (printer.supplies as any).drum || 85; // Default if not available
      let drumColor = "text-green-600";
      if (drumLevel < 10) drumColor = "text-red-500";
      else if (drumLevel < 25) drumColor = "text-amber-500";
      
      return (
        <div className={`${drumColor} font-medium`}>
          {drumLevel}% - {drumLevel > 75 ? 'Good' : drumLevel > 25 ? 'Fair' : 'Replace Soon'}
        </div>
      );
    }
    
    return <div className="text-muted-foreground">Not Available</div>;
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-medium mb-4">Printer Information</h3>
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="text-muted-foreground">Model:</div>
            <div className="break-words">{printer.model}</div>

            <div className="text-muted-foreground">Location:</div>
            <div className="break-words">{printer.location}</div>

            <div className="text-muted-foreground">Status:</div>
            <div className="break-words">{getStatusBadge()}</div>

            {printer.subStatus && (
              <>
                <div className="text-muted-foreground">Sub Status:</div>
                <div className="break-words">{printer.subStatus}</div>
              </>
            )}

            <div className="text-muted-foreground">Serial Number:</div>
            <div className="break-words">{printer.serialNumber || 'N/A'}</div>

            <div className="text-muted-foreground">IP Address:</div>
            <div className="break-words">{printer.ipAddress || 'N/A'}</div>

            <div className="text-muted-foreground">Department:</div>
            <div className="break-words">{printer.department || 'N/A'}</div>

            <div className="text-muted-foreground">Date Added:</div>
            <div className="break-words">{printer.addedDate ? format(new Date(printer.addedDate), 'MMM dd, yyyy') : 'N/A'}</div>

            <div className="text-muted-foreground">Drum Status:</div>
            {getDrumStatus()}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrinterInfo;
