
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrinters } from '@/hooks/usePrinters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedPrinterCard from '@/components/printers/EnhancedPrinterCard';
import PrinterFilters from '@/components/printers/PrinterFilters';
import EmptyPrinterState from '@/components/printers/EmptyPrinterState';
import AddPrinterForm from '@/components/printers/AddPrinterForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PrinterDetailModal from '@/components/printers/PrinterDetailModal';
import { useAuth } from '@/context/AuthContext';
import { PrinterData } from '@/types/printers';
import { useQueryClient } from '@tanstack/react-query';

const Printers = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showAddPrinter, setShowAddPrinter] = useState(false);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { printers, isLoading, error, refetchPrinters } = usePrinters();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchPrinters();
    setTimeout(() => setIsRefreshing(false), 1000); // Keep animation visible for 1 second
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
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          {isAdmin && (
            <Button onClick={() => setShowAddPrinter(true)}>
              Add Printer
            </Button>
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
          isAdmin={isAdmin}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrinters.map((printer) => (
            <EnhancedPrinterCard
              key={printer.id}
              printer={printer}
              onOpenDetails={setSelectedPrinterId}
              onOpenEdit={() => {}}
              onOpenDelete={() => {}}
              onRestart={() => {}}
              isAdmin={isAdmin || false}
            />
          ))}
        </div>
      )}

      {/* Add Printer Dialog */}
      <Dialog open={showAddPrinter} onOpenChange={setShowAddPrinter}>
        <DialogContent className="sm:max-w-[600px]">
          {showAddPrinter && (
            <AddPrinterForm />
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
