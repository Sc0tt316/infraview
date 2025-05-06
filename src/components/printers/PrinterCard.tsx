
// Since we can't modify the PrinterCard component directly (as it's read-only),
// let's create a new component wrapper for it that will handle the click event correctly.

import React from 'react';
import { PrinterCard as BasePrinterCard } from '@/components/printers/PrinterCard';
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
      <BasePrinterCard {...props} />
    </div>
  );
};

export default EnhancedPrinterCard;
