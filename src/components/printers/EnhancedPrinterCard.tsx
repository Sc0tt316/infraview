
import React from 'react';
import { PrinterCard } from '@/components/ui/printer-card';
import { PrinterData } from '@/types/printers';

interface EnhancedPrinterCardProps {
  printer: PrinterData;
  onOpenDetails: (id: string) => void;
  onOpenEdit: (printer: PrinterData) => void;
  onOpenDelete: (printer: PrinterData) => void;
  onRestart: (id: string) => void;
  isAdmin: boolean;
}

const EnhancedPrinterCard: React.FC<EnhancedPrinterCardProps> = (props) => {
  const { printer, onOpenDetails } = props;
  
  const handleCardClick = () => {
    onOpenDetails(printer.id);
  };
  
  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <PrinterCard {...props} />
    </div>
  );
};

export default EnhancedPrinterCard;
