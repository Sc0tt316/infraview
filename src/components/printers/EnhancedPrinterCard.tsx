
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PrinterData } from '@/types/printers';

interface EnhancedPrinterCardProps {
  printer: PrinterData;
  onOpenDetails: (id: string) => void;
  onOpenEdit?: () => void;
  onOpenDelete?: () => void;
  isAdmin: boolean;
}

const EnhancedPrinterCard: React.FC<EnhancedPrinterCardProps> = ({
  printer,
  onOpenDetails
}) => {
  // Function to render supplies info inline
  const renderSuppliesInfo = () => {
    if (printer.supplies) {
      // For color printers
      if (printer.supplies.cyan !== undefined || 
          printer.supplies.magenta !== undefined || 
          printer.supplies.yellow !== undefined) {
        return (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Toners:</p>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                Black: {printer.supplies.black}%
              </span>
              {printer.supplies.cyan !== undefined && (
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                  Cyan: {printer.supplies.cyan}%
                </span>
              )}
              {printer.supplies.magenta !== undefined && (
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                  Magenta: {printer.supplies.magenta}%
                </span>
              )}
              {printer.supplies.yellow !== undefined && (
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  Yellow: {printer.supplies.yellow}%
                </span>
              )}
            </div>
          </div>
        );
      } 
      // For monochrome printers
      return (
        <div className="mt-2">
          <p className="text-xs flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-black"></span>
            <span>Toner: {printer.supplies.black}%</span>
          </p>
        </div>
      );
    }
    
    // Fallback to old inkLevel for backward compatibility
    return (
      <div className="mt-2">
        <p className="text-xs">Ink Level: {printer.inkLevel}%</p>
      </div>
    );
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onOpenDetails(printer.id)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium">{printer.name}</h3>
            <p className="text-sm text-muted-foreground">{printer.model}</p>
            <p className="text-xs text-muted-foreground">{printer.location}</p>
            
            {renderSuppliesInfo()}
            
            <p className="text-xs mt-2">Paper: {printer.paperLevel}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPrinterCard;
