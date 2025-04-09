
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import PrinterNotFound from './printer-detail/PrinterNotFound';
import LoadingSpinner from './printer-detail/LoadingSpinner';
import TabsNavigation from './printer-detail/TabsNavigation';
import PrinterOverview from './printer-detail/PrinterOverview';
import PrintLogs from './printer-detail/PrintLogs';
import MaintenanceHistory from './printer-detail/MaintenanceHistory';
import ModalHeader from './printer-detail/ModalHeader';
import { updatePrinterLevels } from '@/services/printer/management/autoPrinterLevels';

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
  
  const { data: printer, error, isLoading } = useQuery({
    queryKey: ['printer', printerId],
    queryFn: () => printerService.getPrinterById(printerId),
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
  
  const renderTabContent = () => {
    if (error) {
      return <PrinterNotFound onClose={onClose} />;
    }
    
    if (isLoading || !printer) {
      return <LoadingSpinner />;
    }
    
    switch (activeTab) {
      case "overview":
        return <PrinterOverview printer={printer} isAdmin={isAdmin} />;
      case "logs":
        return <PrintLogs printerId={printerId} />;
      case "maintenance":
        return <MaintenanceHistory printerId={printerId} />;
      default:
        return <PrinterOverview printer={printer} isAdmin={isAdmin} />;
    }
  };

  return (
    <Dialog open={!!printerId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <ModalHeader 
          title={printer?.name || 'Printer Details'} 
          subtitle={printer?.model || 'Loading...'}
        />
        
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrinterDetailModal;
