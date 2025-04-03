
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { printerService } from '@/services/printer';

// Import our components
import PrinterOverview from './printer-detail/PrinterOverview';
import PrintLogs from './printer-detail/PrintLogs';
import ActivityList from './printer-detail/ActivityList';
import LoadingSpinner from './printer-detail/LoadingSpinner';
import PrinterNotFound from './printer-detail/PrinterNotFound';
import ModalHeader from './printer-detail/ModalHeader';
import TabsNavigation from './printer-detail/TabsNavigation';

// Define props for the component
export interface PrinterDetailModalProps {
  printerId: string;
  onClose: () => void;
}

const PrinterDetailModal = ({ printerId, onClose }: PrinterDetailModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRestarting, setIsRestarting] = useState(false);

  // Use React Query to fetch printer details
  const { data: printer, isLoading, refetch } = useQuery({
    queryKey: ['printer', printerId],
    queryFn: () => printerService.getPrinterById(printerId),
    enabled: Boolean(printerId),
  });

  // Handle modal close
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  // Handle printer restart
  const handleRestartPrinter = async () => {
    if (!printer) return;
    
    setIsRestarting(true);
    
    try {
      await printerService.restartPrinter(printer.id);
      toast({
        title: "Printer Restarted",
        description: "The printer has been restarted successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error restarting printer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restart printer. Please try again.",
      });
    } finally {
      setIsRestarting(false);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        <ModalHeader printer={printer} isLoading={isLoading} />

        {isLoading ? (
          <LoadingSpinner />
        ) : printer ? (
          <>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />

              <div className="px-6 pb-6 pt-4">
                <TabsContent value="overview" className="mt-0">
                  <PrinterOverview 
                    printer={printer} 
                    isRestarting={isRestarting}
                    onRestartPrinter={handleRestartPrinter}
                  />
                </TabsContent>
                
                <TabsContent value="logs" className="mt-0">
                  <PrintLogs logs={printer.printLogs} />
                </TabsContent>
                
                <TabsContent value="activity" className="mt-0">
                  <ActivityList activities={printer.activity} />
                </TabsContent>
              </div>
            </Tabs>
          </>
        ) : (
          <PrinterNotFound />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrinterDetailModal;
