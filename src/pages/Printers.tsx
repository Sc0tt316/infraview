
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { printerService } from '@/services/printer';
import { PrinterData } from '@/types/printers';
import { createInitialFormData, PrinterFormValues } from '@/components/printers/PrinterFormUtils';
import PrinterDetailModal from '@/components/printers/PrinterDetailModal';
import PrintersHeader from '@/components/printers/PrintersHeader';
import PrinterFilters from '@/components/printers/PrinterFilters';
import PrintersContent from '@/components/printers/PrintersContent';
import AddPrinterForm from '@/components/printers/AddPrinterForm';
import EditPrinterForm from '@/components/printers/EditPrinterForm';
import DeletePrinterConfirmation from '@/components/printers/DeletePrinterConfirmation';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';

const Printers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [deletePrinterId, setDeletePrinterId] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState<PrinterFormValues>(createInitialFormData);

  const { user } = useAuth();
  const { toast } = useToast();
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  const form = useForm<PrinterFormValues>({
    defaultValues: createInitialFormData()
  });

  const { data: printers = [], isLoading, refetch } = useQuery({
    queryKey: ['printers'],
    queryFn: () => printerService.getAllPrinters(),
  });

  const filteredPrinters = React.useMemo(() => {
    let filtered = [...printers];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(printer =>
        printer.name.toLowerCase().includes(lowerSearchTerm) ||
        printer.model.toLowerCase().includes(lowerSearchTerm) ||
        printer.location.toLowerCase().includes(lowerSearchTerm) ||
        printer.department?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(printer => printer.status === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(printer => printer.department === departmentFilter);
    }

    return filtered;
  }, [printers, searchTerm, statusFilter, departmentFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'range') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenAddModal = () => {
    setFormData(createInitialFormData());
    setShowAddModal(true);
  };

  const handleOpenEditModal = (printerId: string) => {
    const printerToEdit = printers.find(printer => printer.id === printerId);
    if (printerToEdit) {
      setFormData({
        name: printerToEdit.name,
        model: printerToEdit.model,
        location: printerToEdit.location,
        status: printerToEdit.status,
        inkLevel: printerToEdit.inkLevel,
        paperLevel: printerToEdit.paperLevel,
        ipAddress: printerToEdit.ipAddress,
        department: printerToEdit.department,
      });
      setSelectedPrinterId(printerId);
      setShowEditModal(true);
    }
  };

  const handleOpenDeleteModal = (printerId: string) => {
    setDeletePrinterId(printerId);
    setShowDeleteModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    form.reset();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPrinterId(null);
    form.reset();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePrinterId(null);
  };

  const handleToggleViewMode = () => {
    setIsGridView(!isGridView);
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      // Adding jobCount and lastActive as they're required by the PrinterData type
      const newPrinter: PrinterData = {
        id: '',
        ...formData,
        jobCount: 0,
        lastActive: new Date().toISOString()
      };
      await printerService.addPrinter(newPrinter);
      toast({
        title: "Printer Added",
        description: `Printer ${formData.name} has been added successfully.`,
      });
      handleCloseAddModal();
      refetch();
    } catch (error) {
      console.error("Error adding printer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add printer. Please try again.",
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      if (selectedPrinterId) {
        await printerService.updatePrinter(selectedPrinterId, formData as PrinterData);
        toast({
          title: "Printer Updated",
          description: `Printer ${formData.name} has been updated successfully.`,
        });
        handleCloseEditModal();
        refetch();
      }
    } catch (error) {
      console.error("Error updating printer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update printer. Please try again.",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    try {
      if (deletePrinterId) {
        await printerService.deletePrinter(deletePrinterId);
        toast({
          title: "Printer Deleted",
          description: "Printer has been deleted successfully.",
        });
        handleCloseDeleteModal();
        refetch();
      }
    } catch (error) {
      console.error("Error deleting printer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete printer. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const selectedPrinter = deletePrinterId ? printers.find(p => p.id === deletePrinterId) || null : null;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <PrintersHeader 
        onRefresh={refetch}
        onAddPrinter={handleOpenAddModal}
        toggleViewMode={handleToggleViewMode}
        isGridView={isGridView}
        isAdminOrManager={isAdminOrManager}
      />

      {/* Filter section */}
      <PrinterFilters
        searchTerm={searchTerm}
        onSearchChange={e => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
      />

      {/* Main content */}
      <PrintersContent 
        filteredPrinters={filteredPrinters}
        isLoading={isLoading}
        isGridView={isGridView}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onAdd={handleOpenAddModal}
      />

      {/* Add Printer Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Printer</DialogTitle>
            <DialogDescription>
              Enter the details for the new printer
            </DialogDescription>
          </DialogHeader>
          <AddPrinterForm
            form={form as any}
            loading={addLoading}
            onSubmit={handleAddSubmit}
            onCancel={handleCloseAddModal}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Printer Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Printer</DialogTitle>
            <DialogDescription>
              Update the details for the selected printer
            </DialogDescription>
          </DialogHeader>
          <EditPrinterForm
            form={form as any}
            loading={editLoading}
            onSubmit={handleEditSubmit}
            onCancel={handleCloseEditModal}
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Printer Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Printer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this printer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DeletePrinterConfirmation
            printer={selectedPrinter}
            loading={deleteLoading}
            onConfirm={handleDeleteSubmit}
            onCancel={handleCloseDeleteModal}
          />
        </DialogContent>
      </Dialog>
      
      {/* Printer Detail Modal */}
      {selectedPrinterId && (
        <PrinterDetailModal 
          printerId={selectedPrinterId} 
          onClose={() => setSelectedPrinterId(null)} 
          isAdmin={isAdminOrManager}
        />
      )}
    </div>
  );
};

export default Printers;
