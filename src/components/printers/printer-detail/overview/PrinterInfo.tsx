
import React from 'react';
import { format } from 'date-fns';
import { PrinterData } from '@/types/printers';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    
    return (
      <div className="text-sm text-muted-foreground">No supply data available</div>
    );
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

            <div className="text-muted-foreground">Serial Number:</div>
            <div className="break-words">{printer.serialNumber || 'N/A'}</div>

            <div className="text-muted-foreground">IP Address:</div>
            <div className="break-words">{printer.ipAddress || 'N/A'}</div>

            <div className="text-muted-foreground">Department:</div>
            <div className="break-words">{printer.department || 'N/A'}</div>

            <div className="text-muted-foreground">Date Added:</div>
            <div className="break-words">{printer.addedDate ? format(new Date(printer.addedDate), 'MMM dd, yyyy') : 'N/A'}</div>

            <div className="text-muted-foreground">Status:</div>
            <div className="break-words capitalize">{printer.status}</div>

            {printer.subStatus && (
              <>
                <div className="text-muted-foreground">Sub Status:</div>
                <div className="break-words">{printer.subStatus}</div>
              </>
            )}
          </div>
          
          {/* Toner Levels Section */}
          <div className="mt-6">
            {renderTonerLevels()}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrinterInfo;
