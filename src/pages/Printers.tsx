
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { printerService, PrinterData } from '@/services/printerService';
import { useToast } from '@/hooks/use-toast';
import PrinterDetailModal from '@/components/printers/PrinterDetailModal';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Search,
  RefreshCw,
  Plus,
  Printer,
  MoreVertical,
  ArrowRight,
  AlertCircle,
  Info,
  Pencil,
  Trash2,
  Settings,
  RotateCw
} from 'lucide-react';
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

const Printers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrinters, setFilteredPrinters] = useState<PrinterData[]>([]);
  const [showAddPrinterModal, setShowAddPrinterModal] = useState(false);
  const [showEditPrinterModal, setShowEditPrinterModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterData | null>(null);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
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
  
  const { setValue, reset } = form;
  
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

  const { data: printers, isLoading, refetch } = useQuery({
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

  const handleAddPrinter = (e: React.FormEvent) => {
    e.preventDefault();
    const printerToAdd: Omit<PrinterData, "id" | "jobCount" | "lastActive"> = {
      name: formData.name,
      model: formData.model,
      location: formData.location,
      status: formData.status || "offline",
      inkLevel: Number(formData.inkLevel) || 100,
      paperLevel: Number(formData.paperLevel) || 100,
      ipAddress: formData.ipAddress,
      department: formData.department
    };
    addPrinterMutation.mutate(printerToAdd);
  };

  const handleDeletePrinter = () => {
    if (selectedPrinter) {
      deletePrinterMutation.mutate(selectedPrinter.id);
    }
  };

  const handleUpdatePrinter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrinter) return;

    const updateData = {
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
    };
    updatePrinterMutation.mutate(updateData);
  };

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

  const handleRestartPrinter = (id: string) => {
    restartPrinterMutation.mutate(id);
  };

  useEffect(() => {
    if (printers) {
      let filtered = printers;
      
      // Apply search filter
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(printer =>
          printer.name.toLowerCase().includes(lowerSearchTerm) ||
          printer.model.toLowerCase().includes(lowerSearchTerm) ||
          printer.location.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      // Apply status filter
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
          
          <Button onClick={() => setShowAddPrinterModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Printer
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search printers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'online' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('online')}
            className={statusFilter === 'online' ? 'bg-green-600 hover:bg-green-700' : ''}
            size="sm"
          >
            Online
          </Button>
          <Button 
            variant={statusFilter === 'offline' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('offline')}
            className={statusFilter === 'offline' ? 'bg-gray-600 hover:bg-gray-700' : ''}
            size="sm"
          >
            Offline
          </Button>
          <Button 
            variant={statusFilter === 'error' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('error')}
            className={statusFilter === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
            size="sm"
          >
            Error
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : filteredPrinters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrinters.map((printer) => (
            <Card key={printer.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-4 bg-blue-100 p-2 rounded-full">
                        <Printer className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{printer.name}</h3>
                        <p className="text-sm text-muted-foreground">{printer.model}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Badge 
                        className={`
                          ${printer.status === 'online' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                            printer.status === 'offline' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : 
                            printer.status === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                            printer.status === 'maintenance' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                            'bg-amber-100 text-amber-800 hover:bg-amber-100'}
                          mr-2
                        `}
                      >
                        {printer.status === 'online' ? 'Online' : 
                          printer.status === 'offline' ? 'Offline' : 
                          printer.status === 'error' ? 'Error' : 
                          printer.status === 'maintenance' ? 'Maintenance' : 
                          'Warning'}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedPrinterId(printer.id)}>
                            <Info className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEditModal(printer)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRestartPrinter(printer.id)}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            <span>Restart</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleOpenDeleteConfirmation(printer)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Ink Level</span>
                        <span className={printer.inkLevel < 20 ? 'text-red-600 font-medium' : ''}>{printer.inkLevel}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${printer.inkLevel < 20 ? 'bg-red-500' : 'bg-blue-600'}`} 
                          style={{ width: `${printer.inkLevel}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Paper Level</span>
                        <span className={printer.paperLevel < 20 ? 'text-red-600 font-medium' : ''}>{printer.paperLevel}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${printer.paperLevel < 20 ? 'bg-red-500' : 'bg-blue-600'}`} 
                          style={{ width: `${printer.paperLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{printer.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Job Count</p>
                      <p className="font-medium">{printer.jobCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Active</p>
                      <p className="font-medium">{printer.lastActive}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{printer.department || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Search className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No printers found</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            We couldn't find any printers matching your search criteria. Try adjusting your filters or add a new printer.
          </p>
          <Button className="mt-4" onClick={() => setShowAddPrinterModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Printer
          </Button>
        </div>
      )}

      {/* Dialog for adding a new printer */}
      <Dialog open={showAddPrinterModal} onOpenChange={setShowAddPrinterModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Printer</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new printer to your network.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleAddPrinter} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Printer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Office Printer 1" {...field} onChange={handleInputChange} />
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
                        <Input placeholder="HP LaserJet Pro" {...field} onChange={handleInputChange} />
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
                        <Input placeholder="First Floor" {...field} onChange={handleInputChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Administration" {...field} onChange={handleInputChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ipAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IP Address</FormLabel>
                      <FormControl>
                        <Input placeholder="192.168.1.101" {...field} onChange={handleInputChange} />
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
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="error">Error</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="warning">Warning</option>
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddPrinterModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Printer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing a printer */}
      <Dialog open={showEditPrinterModal} onOpenChange={setShowEditPrinterModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Printer</DialogTitle>
            <DialogDescription>
              Update the details of {selectedPrinter?.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleUpdatePrinter} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Printer Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Office Printer 1" 
                          name="name"
                          value={formData.name} 
                          onChange={handleInputChange} 
                        />
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
                        <Input 
                          placeholder="HP LaserJet Pro" 
                          name="model"
                          value={formData.model} 
                          onChange={handleInputChange} 
                        />
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
                        <Input 
                          placeholder="First Floor" 
                          name="location"
                          value={formData.location} 
                          onChange={handleInputChange} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Administration" 
                          name="department"
                          value={formData.department} 
                          onChange={handleInputChange} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ipAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IP Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="192.168.1.101" 
                          name="ipAddress"
                          value={formData.ipAddress} 
                          onChange={handleInputChange} 
                        />
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
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="error">Error</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="warning">Warning</option>
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-3">
                <FormItem>
                  <FormLabel>Ink Level ({formData.inkLevel}%)</FormLabel>
                  <input 
                    type="range" 
                    name="inkLevel"
                    min="0" 
                    max="100" 
                    value={formData.inkLevel} 
                    onChange={(e) => setFormData({...formData, inkLevel: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </FormItem>
                
                <FormItem>
                  <FormLabel>Paper Level ({formData.paperLevel}%)</FormLabel>
                  <input 
                    type="range" 
                    name="paperLevel"
                    min="0" 
                    max="100" 
                    value={formData.paperLevel} 
                    onChange={(e) => setFormData({...formData, paperLevel: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </FormItem>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditPrinterModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Printer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for confirming printer deletion */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Delete Printer
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The printer will be permanently removed from your system.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 border-y my-4">
            <p className="font-medium mb-2">Are you sure you want to delete:</p>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
              <Printer className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">{selectedPrinter?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedPrinter?.model} • {selectedPrinter?.location}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePrinter}>Delete Printer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Printer Detail Modal */}
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
