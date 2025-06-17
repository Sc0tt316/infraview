
import React, { useState, useEffect } from 'react';
import { usePrinters } from '@/hooks/usePrinters';
import { useAuth } from '@/context/AuthContext';
import { PrinterData } from '@/types/printers';
import { printerService } from '@/services/printer';
import { alertService } from '@/services/analytics/alertService';
import PrintersHeader from '@/components/printers/PrintersHeader';
import PrintersContent from '@/components/printers/PrintersContent';
import PrinterDialogs from '@/components/printers/PrinterDialogs';

const Printers = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showAddPrinter, setShowAddPrinter] = useState(false);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [printerToDelete, setPrinterToDelete] = useState<PrinterData | null>(null);
  const [printerToEdit, setPrinterToEdit] = useState<PrinterData | null>(null);
  
  const { printers, isLoading, error, refetchPrinters } = usePrinters();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Use SNMP to update all printers when refreshing
    try {
      await printerService.pollAllPrinters();
      // After updating printer data, check for alerts
      await alertService.monitorPrinters(printers);
    } catch (error) {
      console.error('Error polling printers:', error);
    } finally {
      await refetchPrinters();
      setTimeout(() => setIsRefreshing(false), 1000); // Keep animation visible for 1 second
    }
  };
  
  const handlePrinterClick = (printer: PrinterData) => {
    console.log('Printer clicked:', printer);
    setSelectedPrinterId(printer.id);
  };

  const handleAddPrinter = () => {
    setShowAddPrinter(true);
  };

  const handleDeletePrinter = (printer: PrinterData) => {
    console.log('Delete printer requested:', printer);
    setPrinterToDelete(printer);
  };

  const handleEditPrinter = (printer: PrinterData) => {
    console.log('Edit printer requested:', printer);
    setPrinterToEdit(printer);
  };

  const confirmDeletePrinter = async () => {
    if (printerToDelete) {
      console.log('Confirming delete for printer:', printerToDelete);
      const success = await printerService.deletePrinter(printerToDelete.id, printerToDelete.name);
      if (success) {
        setPrinterToDelete(null);
        // Force immediate refresh to show updated list
        await refetchPrinters();
      }
    }
  };

  const handlePrinterEditSuccess = async () => {
    setPrinterToEdit(null);
    // Force immediate refresh to show updated list
    await refetchPrinters();
  };

  const handlePrinterAddSuccess = async () => {
    setShowAddPrinter(false);
    // Force immediate refresh to show updated list
    await refetchPrinters();
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
      // Check for alerts on auto-refresh
      alertService.monitorPrinters(printers);
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [printers.length, refetchPrinters, printers]);

  // Monitor printers for alerts when printer data changes
  useEffect(() => {
    if (printers.length > 0) {
      alertService.monitorPrinters(printers);
    }
  }, [printers]);

  return (
    <div className="space-y-6">
      <PrintersHeader
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        isAdmin={isAdmin || false}
        onRefresh={handleRefresh}
        onAddPrinter={handleAddPrinter}
      />

      <PrintersContent
        isLoading={isLoading}
        filteredPrinters={filteredPrinters}
        searchQuery={searchQuery}
        selectedDepartment={departmentFilter}
        selectedStatus={statusFilter}
        isAdmin={isAdmin || false}
        onAddPrinter={handleAddPrinter}
        onPrinterClick={handlePrinterClick}
        onPrinterSelect={handlePrinterClick}
        onEditPrinter={handleEditPrinter}
        onDeletePrinter={handleDeletePrinter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setSearchQuery={setSearchQuery}
      />

      <PrinterDialogs
        showAddPrinter={showAddPrinter}
        setShowAddPrinter={setShowAddPrinter}
        printerToEdit={printerToEdit}
        setPrinterToEdit={setPrinterToEdit}
        printerToDelete={printerToDelete}
        setPrinterToDelete={setPrinterToDelete}
        selectedPrinterId={selectedPrinterId}
        setSelectedPrinterId={setSelectedPrinterId}
        isAdmin={isAdmin || false}
        onConfirmDelete={confirmDeletePrinter}
        onPrinterEditSuccess={handlePrinterEditSuccess}
        onPrinterAddSuccess={handlePrinterAddSuccess}
      />
    </div>
  );
};

export default Printers;
