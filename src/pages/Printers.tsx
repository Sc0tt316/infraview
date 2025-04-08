import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm, UseFormReturn } from 'react-hook-form';
import { printerService } from '@/services/printer';
import { PrinterData } from '@/types/printers';
import { Grid, ListFilter, PlusCircle, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrinterCard from '@/components/printers/PrinterCard';
import PrinterDetailModal from '@/components/printers/PrinterDetailModal';
import PrinterFilters from '@/components/printers/PrinterFilters';
import EmptyPrinterState from '@/components/printers/EmptyPrinterState';
import AddPrinterForm from '@/components/printers/AddPrinterForm';
import EditPrinterForm from '@/components/printers/EditPrinterForm';
import DeletePrinterConfirmation from '@/components/printers/DeletePrinterConfirmation';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddPrinterFormProps {
  form: UseFormReturn<{
    name?: string;
    model?: string;
    location?: string;
    status?: "online" | "offline" | "error" | "maintenance" | "warning";
    inkLevel?: number;
    paperLevel?: number;
    ipAddress?: string;
    department?: string;
  }>;
  loading: boolean;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  formData: any;
}

// Partial implementation - focus on the type error fixes
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
  const [formData, setFormData] = useState<PrinterData>({
    id: '',
    name: '',
    model: '',
    location: '',
    status: 'online',
    inkLevel: 100,
    paperLevel: 100,
    ipAddress: '',
    department: '',
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  const form = useForm({
    defaultValues: {
      name: '',
      model: '',
      location: '',
      status: 'online',
      inkLevel: 100,
      paperLevel: 100,
      ipAddress: '',
      department: '',
    },
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

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    form.reset();
  };

  const handleOpenEditModal = (printerId: string) => {
    const printerToEdit = printers.find(printer => printer.id === printerId);
    if (printerToEdit) {
      setFormData(printerToEdit);
      setSelectedPrinterId(printerId);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPrinterId(null);
    setFormData({
      id: '',
      name: '',
      model: '',
      location: '',
      status: 'online',
      inkLevel: 100,
      paperLevel: 100,
      ipAddress: '',
      department: '',
    });
    form.reset();
  };

  const handleOpenDeleteModal = (printerId: string) => {
    setDeletePrinterId(printerId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePrinterId(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAddSubmit = async (values: PrinterData) => {
    setAddLoading(true);
    try {
      await printerService.addPrinter(values);
      toast({
        title: "Printer Added",
        description: `Printer ${values.name} has been added successfully.`,
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

  const handleEditSubmit = async (values: PrinterData) => {
    setEditLoading(true);
    try {
      if (selectedPrinterId) {
        await printerService.updatePrinter(selectedPrinterId, values);
        toast({
          title: "Printer Updated",
          description: `Printer ${values.name} has been updated successfully.`,
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

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Printers</h1>
          <p className="text-muted-foreground mt-1">Manage your organization's printers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          {isAdminOrManager && (
            <Button onClick={handleOpenAddModal}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Printer
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsGridView(!isGridView)}
          >
            {isGridView ? <ListFilter className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

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
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : filteredPrinters.length > 0 ? (
        <div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {filteredPrinters.map(printer => (
            <PrinterCard
              key={printer.id}
              printer={printer}
              isGridView={isGridView}
              onEdit={() => handleOpenEditModal(printer.id)}
              onDelete={() => handleOpenDeleteModal(printer.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyPrinterState onAdd={handleOpenAddModal} />
      )}

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
            form={form}
            loading={addLoading}
            onSubmit={handleAddSubmit}
            onCancel={() => setShowAddModal(false)}
            formData={formData}
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
            form={form}
            loading={editLoading}
            onSubmit={handleEditSubmit}
            onCancel={handleCloseEditModal}
            formData={formData}
            printerId={selectedPrinterId || ''}
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
