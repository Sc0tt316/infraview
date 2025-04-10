import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { printerService, PrinterData } from '@/services/printer';
import { useToast } from '@/hooks/use-toast';
import PrinterDetailModal from '@/components/printers/PrinterDetailModal';
import PrinterCard from '@/components/printers/PrinterCard';
import PrinterFilters from '@/components/printers/PrinterFilters';
import EmptyPrinterState from '@/components/printers/EmptyPrinterState';
import AddPrinterForm from '@/components/printers/AddPrinterForm';
import EditPrinterForm from '@/components/printers/EditPrinterForm';
import DeletePrinterConfirmation from '@/components/printers/DeletePrinterConfirmation';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Plus, ShieldAlert } from 'lucide-react';
import { printerFormSchema, PrinterFormValues } from '@/types/printer';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Printers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrinters, setFilteredPrinters] = useState<PrinterData[]>([]);
  const [showAddPrinterModal, setShowAddPrinterModal] = useState(false);
  const [showEditPrinterModal, setShowEditPrinterModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterData | null>(null);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const canAddPrinter = user && user.role !== 'user';
  
  const form = useForm<PrinterFormValues>({
    resolver: zodResolver(printerFormSchema),
    defaultValues: {
      name: "",
      model: "",
      location: "",
      status: "offline",
      inkLevel: 100,
      paperLevel: 100,
      ipAddress: "",
      department: "",
    },
  });
  
  const { reset } = form;
  
  const resetForm = () => {
    reset({
      name: "",
      model: "",
      location: "",
      status: "offline",
      inkLevel: 100,
      paperLevel: 100,
      ipAddress: "",
      department: "",
    });
    setFormData({
      name: "",
      model: "",
      location: "",
      status: "offline",
      inkLevel: 100,
      paperLevel: 100,
      ipAddress: "",
      department: "",
    });
  };
  
  const [formData, setFormData] = useState<PrinterFormValues>({
    name: "",
    model: "",
    location: "",
    status: "offline",
    inkLevel: 100,
    paperLevel: 100,
    ipAddress: "",
    department: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: printers = [], isLoading, refetch } = useQuery({
    queryKey: ['printers'],
    queryFn: () => printerService.getAllPrinters(),
  });

  const addPrinterMutation = useMutation({
    mutationFn: (printerData: Omit<PrinterData, "id" | "jobCount" | "lastActive">) => 
      printerService.addPrinter(printerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      setShowAddPrinterModal(false);
      resetForm();
      toast({
        title: "Printer Added",
        description: "The printer has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add printer. Please try again.",
      });
      console.error("Error adding printer:", error);
    }
  });

  const updatePrinterMutation = useMutation({
    mutationFn: ({id, data}: {id: string, data: Partial<PrinterData>}) => 
      printerService.updatePrinter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      handleCloseEditModal();
      toast({
        title: "Printer Updated",
        description: "The printer has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update printer. Please try again.",
      });
      console.error("Error updating printer:", error);
    }
  });

  const deletePrinterMutation = useMutation({
    mutationFn: (id: string) => printerService.deletePrinter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      setShowDeleteConfirmation(false);
      setSelectedPrinter(null);
      toast({
        title: "Printer Deleted",
        description: "The printer has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete printer. Please try again.",
      });
      console.error("Error deleting printer:", error);
    }
  });

  const restartPrinterMutation = useMutation({
    mutationFn: (id: string) => printerService.restartPrinter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      toast({
        title: "Printer Restarted",
        description: "The printer restart command has been sent.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restart printer. Please try again.",
      });
      console.error("Error restarting printer:", error);
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenEditModal = (printer: PrinterData) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to edit printers.",
      });
      return;
    }
    
    setSelectedPrinter(printer);
    setFormData({
      name: printer.name,
      model: printer.model,
      location: printer.location,
      status: printer.status,
      inkLevel: printer.inkLevel,
      paperLevel: printer.paperLevel,
      ipAddress: printer.ipAddress || "",
      department: printer.department || "",
    });
    setShowEditPrinterModal(true);
  };

  const handleOpenDeleteConfirmation = (printer: PrinterData) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to delete printers.",
      });
      return;
    }
    
    setSelectedPrinter(printer);
    setShowDeleteConfirmation(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddPrinter = (e: React.FormEvent) => {
    e.preventDefault();
    const printerToAdd: Omit<PrinterData, "id" | "jobCount" | "lastActive"> = {
      name: formData.name,
      model: formData.model,
      location: formData.location,
      status: formData.status,
      inkLevel: 50,
      paperLevel: 50,
      ipAddress: formData.ipAddress,
      department: formData.department
    };
    addPrinterMutation.mutate(printerToAdd);
  };

  const handleDeletePrinter = () => {
    if (selectedPrinter && isAdmin) {
      deletePrinterMutation.mutate(selectedPrinter.id);
    }
  };

  const handleUpdatePrinter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrinter || !isAdmin) return;

    const updateData = {
      id: selectedPrinter.id,
      data: {
        name: formData.name,
        status: formData.status,
        model: formData.model,
        location: formData.location,
        ipAddress: formData.ipAddress,
        department: formData.department
      }
    };
    updatePrinterMutation.mutate(updateData);
  };

  const handleRestartPrinter = (id: string) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to restart printers.",
      });
      return;
    }
    
    restartPrinterMutation.mutate(id);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleCloseEditModal = () => {
    setTimeout(() => {
      setShowEditPrinterModal(false);
      setSelectedPrinter(null);
    }, 0);
  };

  useEffect(() => {
    if (printers) {
      let filtered = printers;
      
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(printer =>
          printer.name.toLowerCase().includes(lowerSearchTerm) ||
          printer.model.toLowerCase().includes(lowerSearchTerm) ||
          printer.location.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(printer => printer.status === statusFilter);
      }
      
      setFilteredPrinters(filtered);
    }
  }, [printers, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Printers</h1>
          <p className="text-muted-foreground mt-1">Manage your network printers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="icon"
            className="h-10 w-10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          {canAddPrinter && (
            <Button onClick={() => setShowAddPrinterModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Printer
            </Button>
          )}
        </div>
      </div>
      
      <PrinterFilters 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
      />
      
      {!isAdmin && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <ShieldAlert className="h-4 w-4 mr-2" />
          <AlertDescription>
            You're in view mode. Contact an administrator if you need to make changes to printers.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : filteredPrinters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrinters.map((printer) => (
            <PrinterCard
              key={printer.id}
              printer={printer}
              onOpenDetails={(id) => setSelectedPrinterId(id)}
              onOpenEdit={handleOpenEditModal}
              onOpenDelete={handleOpenDeleteConfirmation}
              onRestart={handleRestartPrinter}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <EmptyPrinterState 
          onAddPrinter={() => setShowAddPrinterModal(true)} 
          isAdmin={isAdmin} 
        />
      )}

      <Dialog open={showAddPrinterModal} onOpenChange={setShowAddPrinterModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Printer</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new printer to your network.
            </DialogDescription>
          </DialogHeader>
          <AddPrinterForm 
            form={form}
            onSubmit={handleAddPrinter}
            onCancel={() => setShowAddPrinterModal(false)}
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
          />
        </DialogContent>
      </Dialog>

      {selectedPrinter && (
        <Dialog open={showEditPrinterModal} onOpenChange={handleCloseEditModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Printer</DialogTitle>
              <DialogDescription>
                Update the details of {selectedPrinter.name}
              </DialogDescription>
            </DialogHeader>
            <EditPrinterForm 
              form={form}
              onSubmit={handleUpdatePrinter}
              onCancel={handleCloseEditModal}
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedPrinter && (
        <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
          <DeletePrinterConfirmation
            printer={selectedPrinter}
            onDelete={handleDeletePrinter}
            onCancel={() => setShowDeleteConfirmation(false)}
          />
        </Dialog>
      )}
      
      {selectedPrinterId && (
        <PrinterDetailModal
          printerId={selectedPrinterId}
          onClose={() => setSelectedPrinterId(null)}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default Printers;
