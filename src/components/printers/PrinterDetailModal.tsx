
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import PrinterNotFound from './printer-detail/PrinterNotFound';
import LoadingSpinner from './printer-detail/LoadingSpinner';
import PrinterOverview from './printer-detail/PrinterOverview';
import PrintLogs from './printer-detail/PrintLogs';
import { updatePrinterLevels } from '@/services/printer/management/autoPrinterLevels';
import { PrinterData } from '@/types/printers';
import { useAuth } from '@/context/AuthContext';

// Import the missing components with correct props
import ModalHeader from './printer-detail/ModalHeader';
import TabsNavigation from './printer-detail/TabsNavigation';

interface PrinterDetailModalProps {
  printerId: string;
  onClose: () => void;
  isAdmin?: boolean;
  // isOpen is optional to make it compatible with existing code
  isOpen?: boolean;
}

const PrinterDetailModal: React.FC<PrinterDetailModalProps> = ({
  printerId,
  onClose,
  isAdmin = false,
  isOpen: externalIsOpen
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRestarting, setIsRestarting] = useState(false);
  const [isOpen, setIsOpen] = useState(externalIsOpen !== undefined ? externalIsOpen : true);
  const { user } = useAuth();
  
  const { data: printer, error, isLoading, refetch } = useQuery({
    queryKey: ['printer', printerId],
    queryFn: () => printerService.getPrinter(printerId),
  });
  
  // Update printer levels when modal opens
  useEffect(() => {
    const updateLevels = async () => {
      if (printer) {
        const updatedPrinter = await updatePrinterLevels(printer);
        if (updatedPrinter.inkLevel !== printer.inkLevel || 
            updatedPrinter.paperLevel !== printer.paperLevel) {
          // Update the printer with new levels
          await printerService.updatePrinter(printer.id, {
            inkLevel: updatedPrinter.inkLevel,
            paperLevel: updatedPrinter.paperLevel
          });
        }
      }
    };
    
    if (printer) {
      updateLevels();
    }
  }, [printer]);

  // Handle the closing of the modal
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose();
    }
  };

  const handleRestartPrinter = async () => {
    if (printer) {
      setIsRestarting(true);
      try {
        await printerService.restartPrinter(printer.id);
        setTimeout(() => {
          refetch();
          setIsRestarting(false);
        }, 2000);
      } catch (error) {
        console.error('Failed to restart printer:', error);
        setIsRestarting(false);
      }
    }
  };
  
  const renderTabContent = () => {
    if (error) {
      return <PrinterNotFound />;
    }
    
    if (isLoading || !printer) {
      return <LoadingSpinner message="Loading printer details..." />;
    }
    
    switch (activeTab) {
      case "overview":
        return <PrinterOverview 
                 printer={printer} 
                 isRestarting={isRestarting} 
                 onRestartPrinter={handleRestartPrinter}
                 isAdmin={isAdmin} />;
      case "logs":
        return <PrintLogs logs={printer.logs || []} />;
      default:
        return <PrinterOverview 
                 printer={printer}
                 isRestarting={isRestarting} 
                 onRestartPrinter={handleRestartPrinter} 
                 isAdmin={isAdmin} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <ModalHeader 
          printer={printer} 
          isLoading={isLoading} 
        />
        
        <TabsNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrinterDetailModal;
