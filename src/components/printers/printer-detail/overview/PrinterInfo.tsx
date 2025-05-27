
import React from 'react';
import { format } from 'date-fns';
import { PrinterData } from '@/types/printers';
import { Progress } from '@/components/ui/progress';

interface PrinterInfoProps {
  printer: PrinterData;
}

const PrinterInfo: React.FC<PrinterInfoProps> = ({ printer }) => {
  const renderTonerLevels = () => {
    if (printer.supplies) {
      const { black, cyan, magenta, yellow } = printer.supplies;
      
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Toner Levels</h4>
          
          {/* Black Toner */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Black Toner</span>
              <span className={black < 10 ? "text-red-500" : black < 25 ? "text-amber-500" : "text-green-600"}>
                {black}%
              </span>
            </div>
            <Progress value={black} className="h-2" />
          </div>
          
          {/* Color Toners - only show if available */}
          {cyan !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Cyan Toner</span>
                <span className={cyan < 10 ? "text-red-500" : cyan < 25 ? "text-amber-500" : "text-green-600"}>
                  {cyan}%
                </span>
              </div>
              <Progress value={cyan} className="h-2" />
            </div>
          )}
          
          {magenta !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Magenta Toner</span>
                <span className={magenta < 10 ? "text-red-500" : magenta < 25 ? "text-amber-500" : "text-green-600"}>
                  {magenta}%
                </span>
              </div>
              <Progress value={magenta} className="h-2" />
            </div>
          )}
          
          {yellow !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Yellow Toner</span>
                <span className={yellow < 10 ? "text-red-500" : yellow < 25 ? "text-amber-500" : "text-green-600"}>
                  {yellow}%
                </span>
              </div>
              <Progress value={yellow} className="h-2" />
            </div>
          )}
        </div>
      );
    }
    
    // Fallback to ink level if supplies not available
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Ink Level</span>
          <span className={printer.inkLevel < 10 ? "text-red-500" : printer.inkLevel < 25 ? "text-amber-500" : "text-green-600"}>
            {printer.inkLevel}%
          </span>
        </div>
        <Progress value={printer.inkLevel} className="h-2" />
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Printer Information</h3>
      <div className="space-y-4">
        {/* Basic Info */}
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
        
        {/* Toner Levels Section */}
        <div className="mt-6">
          {renderTonerLevels()}
        </div>
        
        {/* Paper Level */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Paper Level</span>
            <span className={printer.paperLevel < 10 ? "text-red-500" : printer.paperLevel < 25 ? "text-amber-500" : "text-green-600"}>
              {printer.paperLevel}%
            </span>
          </div>
          <Progress value={printer.paperLevel} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default PrinterInfo;
