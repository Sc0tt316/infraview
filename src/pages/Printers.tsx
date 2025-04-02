import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { printerService, PrinterData } from '@/services/printerService';
import { useToast } from '@/hooks/use-toast';
import PrinterDetailModal from '@/components/printers/PrinterDetailModal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const printerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Printer name must be at least 2 characters.",
  }),
  model: z.string().min(2, {
    message: "Printer model must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Printer location must be at least 2 characters.",
  }),
  status: z.enum(["online", "offline", "error", "maintenance", "warning"]).default("offline"),
  inkLevel: z.number().min(0).max(100).default(100),
  paperLevel: z.number().min(0).max(100).default(100),
  ipAddress: z.string().optional(),
  department: z.string().optional(),
});

type PrinterFormValues = z.infer<typeof printerFormSchema>;

const filterPrinters = (printers: PrinterData[], searchTerm: string): PrinterData[] => {
  if (!searchTerm) {
    return printers;
  }
  const lowerSearchTerm = searchTerm.toLowerCase();
  return printers.filter(printer =>
    printer.name.toLowerCase().includes(lowerSearchTerm) ||
    printer.model.toLowerCase().includes(lowerSearchTerm) ||
    printer.location.toLowerCase().includes(lowerSearchTerm)
  );
};

const Printers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrinters, setFilteredPrinters] = useState<PrinterData[]>([]);
  const [showAddPrinterModal, setShowAddPrinterModal] = useState(false);
  const [showEditPrinterModal, setShowEditPrinterModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterData | null>(null);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  
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
  
  const { setValue, reset } = useForm<PrinterFormValues>();
  
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

  const { data: printers, isLoading } = useQuery({
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
      setShowEditPrinterModal(false);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenEditModal = (printer: PrinterData) => {
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

  const handleStatusChange = (value: "online" | "offline" | "error" | "maintenance" | "warning") => {
    setFormData(prevData => ({
      ...prevData,
      status: value,
    }));
  };

  useEffect(() => {
    if (printers) {
      const filtered = filterPrinters(printers, searchTerm);
      setFilteredPrinters(filtered);
    }
  }, [printers, searchTerm]);

  const handleAddPrinter = (e: React.FormEvent) => {
    e.preventDefault();
    addPrinterMutation.mutate({
      name: formData.name,
      model: formData.model,
      location: formData.location,
      status: formData.status || "offline",
      inkLevel: Number(formData.inkLevel) || 100,
      paperLevel: Number(formData.paperLevel) || 100,
      ipAddress: formData.ipAddress,
      department: formData.department
    });
  };

  const handleDeletePrinter = () => {
    if (selectedPrinter) {
      deletePrinterMutation.mutate(selectedPrinter.id);
    }
  };

  const handleUpdatePrinter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrinter) return;

    updatePrinterMutation.mutate({
      id: selectedPrinter.id,
      data: {
        name: formData.name,
        status: formData.status as PrinterData['status'],
        model: formData.model,
        location: formData.location,
        inkLevel: Number(formData.inkLevel),
        paperLevel: Number(formData.paperLevel),
        ipAddress: formData.ipAddress,
        department: formData.department
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Printers</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your printers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search printers..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button onClick={() => setShowAddPrinterModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Printer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Printer List</CardTitle>
          <CardDescription>
            Here is a list of all your printers. You can manage them from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading printers...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrinters.map((printer) => (
                  <TableRow key={printer.id}>
                    <TableCell>{printer.name}</TableCell>
                    <TableCell>{printer.model}</TableCell>
                    <TableCell>{printer.location}</TableCell>
                    <TableCell>{printer.status}</TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPrinterId(printer.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(printer)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteConfirmation(printer)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPrinters.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No printers found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddPrinterModal} onOpenChange={() => setShowAddPrinterModal(false)}>
        <DialogTrigger asChild>
          <Button>Add Printer</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Printer</DialogTitle>
            <DialogDescription>
              Add a new printer to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleAddPrinter} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Printer Name" {...field} onChange={handleInputChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Printer Model" {...field} onChange={handleInputChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Printer Location" {...field} onChange={handleInputChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Printer</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditPrinterModal} onOpenChange={() => setShowEditPrinterModal(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Printer</DialogTitle>
            <DialogDescription>
              Edit the details of the selected printer.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleUpdatePrinter} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Printer Name" {...field} value={formData.name} onChange={handleInputChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Printer Model" {...field} value={formData.model} onChange={handleInputChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Printer Location" {...field} value={formData.location} onChange={handleInputChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={formData.status} onValueChange={handleStatusChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Printer</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirmation} onOpenChange={() => setShowDeleteConfirmation(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Printer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this printer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <p>Are you sure you want to delete <strong>{selectedPrinter?.name}</strong>?</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePrinter}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {selectedPrinterId && (
        <PrinterDetailModal
          printerId={selectedPrinterId}
          onClose={() => setSelectedPrinterId(null)}
        />
      )}
    </div>
  );
};

export default Printers;
