
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer } from 'lucide-react';
import { getStatusBadge } from './StatusUtils';
import { PrinterData } from '@/types/printers';

interface ModalHeaderProps {
  printer: PrinterData | undefined;
  isLoading: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ printer, isLoading }) => {
  return (
    <DialogHeader className="px-6 pt-6 pb-2">
      <DialogTitle className="flex items-center">
        <Printer className="mr-2 h-5 w-5" />
        {isLoading ? 'Loading Printer Details...' : printer?.name || 'Printer Details'}
        <div className="ml-2">
          {!isLoading && printer && getStatusBadge(printer.status)}
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};

export default ModalHeader;
