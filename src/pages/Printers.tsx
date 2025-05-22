
import React, { useState, useEffect } from 'react';
import { RefreshCw, Network, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrinters } from '@/hooks/usePrinters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedPrinterCard from '@/components/printers/EnhancedPrinterCard';
import PrinterFilters from '@/components/printers/PrinterFilters';
import EmptyPrinterState from '@/components/printers/EmptyPrinterState';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PrinterDetailModal from '@/components/printers/PrinterDetailModal';
import { useAuth } from '@/context/AuthContext';
import { PrinterData } from '@/types/printers';
import { useQueryClient } from '@tanstack/react-query';
import AddPrinterFormContainer from '@/components/printers/AddPrinterFormContainer';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';

const Printers = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showAddPrinter, setShowAddPrinter] = useState(false);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPollingAll, setIsPollingAll] = useState(false);
  const [printerToDelete, setPrinterToDelete] = useState<PrinterData | null>(null);
  const [printerToEdit, setPrinterToEdit] = useState<PrinterData | null>(null);
  
  const { printers, isLoading, error, refetchPrinters } = usePrinters();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Use SNMP to update all printers when refreshing
    try {
      await printerService.pollAllPrinters();
    } catch (error) {
      console.error('Error polling printers:', error);
    } finally {
      await refetchPrinters();
      setTimeout(() => setIsRefreshing(false), 1000); // Keep animation visible for 1 second
    }
  };
  
  const handlePrinterClick = (printer: PrinterData) => {
    setSelectedPrinterId(printer.id);
  };
  
  const closeModal = () => {
    setSelectedPrinterId(null);
  };

  const handleAddPrinter = () => {
    setShowAddPrinter(true);
  };

  const handleDeletePrinter = (printer: PrinterData) => {
    setPrinterToDelete(printer);
  };

  const handleEditPrinter = (printer: PrinterData) => {
    setPrinterToEdit(printer);
  };

  const confirmDeletePrinter = async () => {
    if (printerToDelete) {
      const success = await printerService.deletePrinter(printerToDelete.id, printerToDelete.name);
      if (success) {
        setPrinterToDelete(null);
        refetchPrinters();
      }
    }
  };

  // Apply filters
  const filteredPrinters = printers.filter(printer => {
    // Department filter
    if (departmentFilter !== 'all' && printer.department !== departmentFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && printer.status !== statusFilter) {
      return false;
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        printer.name.toLowerCase().includes(query) ||
        printer.model.toLowerCase().includes(query) ||
        printer.location.toLowerCase().includes(query) ||
        (printer.department && printer.department.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Set up auto-refresh every 5 minutes if there are printers
  useEffect(() => {
    if (printers.length === 0) return;
    
    const interval = setInterval(() => {
      console.log("Auto-refreshing printer data...");
      refetchPrinters();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [printers.length, refetchPrinters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Printers</h1>
          <p className="text-muted-foreground">View and manage your organization's printers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isLoading || isRefreshing}
            title="Update all printers via SNMP"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          
          {isAdmin && (
            <>
              <Button onClick={() => setShowAddPrinter(true)}>
                Add Printer
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle>All Printers</CardTitle>
        </CardHeader>
        <CardContent>
          <PrinterFilters
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : filteredPrinters.length === 0 ? (
        <EmptyPrinterState 
          onAddPrinter={handleAddPrinter}
          isAdmin={isAdmin || false}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrinters.map((printer) => (
            <EnhancedPrinterCard
              key={printer.id}
              printer={printer}
              onOpenDetails={setSelectedPrinterId}
              onOpenEdit={() => handleEditPrinter(printer)}
              onOpenDelete={() => handleDeletePrinter(printer)}
              isAdmin={isAdmin || false}
            />
          ))}
        </div>
      )}

      {/* Add Printer Dialog */}
      <Dialog open={showAddPrinter} onOpenChange={setShowAddPrinter}>
        <DialogContent className="sm:max-w-[600px]">
          {showAddPrinter && (
            <AddPrinterFormContainer onCancel={() => setShowAddPrinter(false)} />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Printer Dialog */}
      <Dialog open={!!printerToEdit} onOpenChange={(open) => !open && setPrinterToEdit(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {printerToEdit && (
            <AddPrinterFormContainer 
              onCancel={() => setPrinterToEdit(null)} 
              existingPrinter={printerToEdit}
              onSuccess={() => {
                setPrinterToEdit(null);
                refetchPrinters();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Printer Dialog */}
      <Dialog open={!!printerToDelete} onOpenChange={(open) => !open && setPrinterToDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          {printerToDelete && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Delete Printer</h2>
              <p>
                Are you sure you want to delete "{printerToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setPrinterToDelete(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeletePrinter}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Printer Detail Modal */}
      {selectedPrinterId && (
        <PrinterDetailModal
          printerId={selectedPrinterId}
          onClose={closeModal}
          isAdmin={isAdmin || false}
        />
      )}
    </div>
  );
};

export default Printers;
