
import React from 'react';
import { PrinterCard } from '@/components/ui/printer-card';
import { PrinterData } from '@/types/printers';

interface EnhancedPrinterCardProps {
  printer: PrinterData;
  onClick?: () => void; 
  onOpenDetails: (id: string) => void; // Changed from optional to required
  onOpenEdit: (printer: PrinterData) => void; // Changed from optional to required
  onOpenDelete: (printer: PrinterData) => void; // Changed from optional to required
  onRestart: (id: string) => void; // Changed from optional to required
  isAdmin: boolean; // Changed from optional to required
}

const EnhancedPrinterCard: React.FC<EnhancedPrinterCardProps> = (props) => {
  const { printer, onClick, onOpenDetails } = props;
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (onOpenDetails) {
      onOpenDetails(printer.id);
    }
  };
  
  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <PrinterCard {...props} />
    </div>
  );
};

export default EnhancedPrinterCard;
