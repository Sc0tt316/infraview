
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, ArrowLeft, Printer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrinterData } from '@/types/printers';
import { printerService } from '@/services/printer';
import { useToast } from '@/hooks/use-toast';
import PrinterOverview from './printer-detail/PrinterOverview';
import PrintingHistory from './printer-detail/PrintingHistory';
import MaintenanceHistory from './printer-detail/MaintenanceHistory';
import SupplyHistory from './printer-detail/SupplyHistory';

interface PrinterDetailModalProps {
  printerId: string;
  onClose: () => void;
  isAdmin?: boolean;
}

const PrinterDetailModal: React.FC<PrinterDetailModalProps> = ({ 
  printerId,
  onClose,
  isAdmin = false
}) => {
  const [isRestarting, setIsRestarting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: printer, isLoading } = useQuery({
    queryKey: ['printer', printerId],
    queryFn: () => printerService.getPrinter(printerId),
  });
  
  const restartMutation = useMutation({
    mutationFn: () => printerService.restartPrinter(printerId),
    onMutate: () => {
      setIsRestarting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printer', printerId] });
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      toast({
        title: "Restart command sent",
        description: "The printer is restarting. This may take a few minutes.",
      });
      
      // Simulate restart completion after a few seconds
      setTimeout(() => setIsRestarting(false), 3000);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error restarting printer",
        description: "There was an error restarting the printer. Please try again.",
      });
      setIsRestarting(false);
    }
  });
  
  // Handle printer restart
  const handleRestartPrinter = () => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to restart printers.",
      });
      return;
    }
    
    if (printer?.status === 'maintenance') {
      toast({
        variant: "destructive",
        title: "Action not allowed",
        description: "Cannot restart a printer that is in maintenance mode.",
      });
      return;
    }
    
    restartMutation.mutate();
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh]">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center border-b p-4 bg-muted/20">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full h-8 w-8 lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center">
                <Printer className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">
                  {isLoading ? "Loading..." : printer?.name}
                </h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center p-8 flex-1">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : printer ? (
            <div className="flex flex-col overflow-hidden">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="flex flex-col overflow-hidden"
              >
                <div className="border-b px-4">
                  <TabsList className="h-12">
                    <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="printing-history" className="text-sm">Printing History</TabsTrigger>
                    <TabsTrigger value="maintenance-history" className="text-sm">Maintenance</TabsTrigger>
                    <TabsTrigger value="supply-history" className="text-sm">Supply History</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  <TabsContent value="overview" className="m-0">
                    <PrinterOverview 
                      printer={printer}
                      isRestarting={isRestarting}
                      onRestartPrinter={handleRestartPrinter}
                    />
                  </TabsContent>
                  
                  <TabsContent value="printing-history" className="m-0">
                    <PrintingHistory printerId={printerId} />
                  </TabsContent>
                  
                  <TabsContent value="maintenance-history" className="m-0">
                    <MaintenanceHistory printerId={printerId} />
                  </TabsContent>
                  
                  <TabsContent value="supply-history" className="m-0">
                    <SupplyHistory printerId={printerId} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          ) : (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">Printer not found</h3>
              <p className="text-muted-foreground mt-2">
                The requested printer could not be found or has been deleted.
              </p>
              <Button onClick={onClose} className="mt-4">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrinterDetailModal;
