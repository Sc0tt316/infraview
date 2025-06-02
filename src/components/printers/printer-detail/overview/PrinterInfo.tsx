
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
    
    let badgeClasses = "capitalize text-white font-medium";
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

  const getDrumStatus = () => {
    if (printer.supplies && typeof printer.supplies === 'object') {
      const drumLevel = (printer.supplies as any).drum || 85;
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

  const infoItems = [
    { label: 'Name', value: printer.name },
    { label: 'Model', value: printer.model },
    { label: 'Location', value: printer.location },
    { label: 'Status', value: getStatusBadge() },
    ...(printer.subStatus ? [{ label: 'Sub Status', value: printer.subStatus }] : []),
    { label: 'Serial Number', value: printer.serialNumber || 'N/A' },
    { label: 'IP Address', value: printer.ipAddress || 'N/A' },
    { label: 'Department', value: printer.department || 'N/A' },
    { label: 'Date Added', value: printer.addedDate ? format(new Date(printer.addedDate), 'MMM dd, yyyy') : 'N/A' },
    { label: 'Drum Status', value: getDrumStatus() }
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Printer Information</h3>
      
      {/* Horizontal scrollable layout with better spacing */}
      <ScrollArea className="w-full">
        <div className="flex gap-8 pb-4 min-w-max">
          {infoItems.map((item, index) => (
            <div key={index} className="flex flex-col space-y-2 min-w-[160px]">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {item.label}
              </div>
              <div className="text-sm font-medium">
                {typeof item.value === 'string' ? (
                  <span className="break-words">{item.value}</span>
                ) : (
                  item.value
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrinterInfo;
