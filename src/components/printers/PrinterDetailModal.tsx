
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import PrinterNotFound from './printer-detail/PrinterNotFound';
import LoadingSpinner from './printer-detail/LoadingSpinner';
import PrinterOverview from './printer-detail/PrinterOverview';
import PrintLogs from './printer-detail/PrintLogs';
import MaintenanceHistory from './printer-detail/MaintenanceHistory';
import { updatePrinterLevels } from '@/services/printer/management/autoPrinterLevels';
import { PrinterData } from '@/types/printers';

// Import the missing components with correct props
import ModalHeader from './printer-detail/ModalHeader';
import TabsNavigation from './printer-detail/TabsNavigation';

interface PrinterDetailModalProps {
  printerId: string;
  onClose: () => void;
  isAdmin: boolean;
}

const PrinterDetailModal: React.FC<PrinterDetailModalProps> = ({
  printerId,
  onClose,
  isAdmin
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRestarting, setIsRestarting] = useState(false);
  
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
                 onRestartPrinter={handleRestartPrinter} />;
      case "logs":
        // Fix: Pass logs instead of printer to match the PrintLogs component API
        return <PrintLogs logs={printer.logs} />;
      case "maintenance":
        return <MaintenanceHistory printerId={printerId} />;
      default:
        return <PrinterOverview 
                 printer={printer}
                 isRestarting={isRestarting} 
                 onRestartPrinter={handleRestartPrinter} />;
    }
  };

  return (
    <Dialog open={!!printerId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-slate-900 border-slate-800">
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
