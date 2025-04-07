
import React from 'react';
import { format } from 'date-fns';
import { PrinterData } from '@/types/printers';

interface PrinterInfoProps {
  printer: PrinterData;
}

const PrinterInfo: React.FC<PrinterInfoProps> = ({ printer }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Printer Information</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-muted-foreground">Model:</div>
        <div>{printer.model}</div>

        <div className="text-muted-foreground">Location:</div>
        <div>{printer.location}</div>

        <div className="text-muted-foreground">Serial Number:</div>
        <div>{printer.serialNumber || 'N/A'}</div>

        <div className="text-muted-foreground">IP Address:</div>
        <div>{printer.ipAddress || 'N/A'}</div>

        <div className="text-muted-foreground">Department:</div>
        <div>{printer.department || 'N/A'}</div>

        <div className="text-muted-foreground">Date Added:</div>
        <div>{printer.addedDate ? format(new Date(printer.addedDate), 'MMM dd, yyyy') : 'N/A'}</div>
      </div>
    </div>
  );
};

export default PrinterInfo;
