import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Printer,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { printerService, PrinterData } from '@/services/printerService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import PrinterDetailModal from '@/components/printers/PrinterDetailModal';

const printerSchema = z.object({
  name: z.string().min(2, {
    message: "Printer name must be at least 2 characters.",
  }),
  model: z.string().min(2, {
    message: "Printer model must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Printer location must be at least 2 characters.",
  }),
  status: z.enum(["online", "offline", "error", "maintenance", "warning"]),
  inkLevel: z.number().min(0).max(100),
  paperLevel: z.number().min(0).max(100),
  ipAddress: z.string().optional(),
  department: z.string().optional(),
});

const Printers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [printerToEdit, setPrinterToEdit] = useState<PrinterData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: printersData, isLoading, refetch } = useQuery({
    queryKey: ['printers'],
    queryFn: printerService.getAllPrinters,
  });

  const { data: printerDetails } = useQuery({
    queryKey: ['printerDetails', selectedPrinter],
    queryFn: () => selectedPrinter ? printerService.getPrinterById(selectedPrinter) : undefined,
    enabled: !!selectedPrinter,
  });

  const addPrinterMutation = useMutation(printerService.addPrinter, {
    onSuccess: () => {
      toast({
        title: "Printer Added",
        description: "New printer has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      setIsAdding(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add printer. Please try again.",
        variant: "destructive"
      });
    },
  });

  const updatePrinterMutation = useMutation(
    (data: { id: string; data: Partial<PrinterData> }) => printerService.updatePrinter(data.id, data.data),
    {
      onSuccess: () => {
        toast({
          title: "Printer Updated",
          description: "Printer details have been updated successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ['printers'] });
        setIsEditing(false);
        setPrinterToEdit(null);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update printer. Please try again.",
          variant: "destructive"
        });
      },
    }
  );

  const deletePrinterMutation = useMutation(printerService.deletePrinter, {
    onSuccess: () => {
      toast({
        title: "Printer Deleted",
        description: "Printer has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['printers'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete printer. Please try again.",
        variant: "destructive"
      });
    },
  });

  const handleDeletePrinter = (id: string) => {
    deletePrinterMutation.mutate(id);
  };

  const handleEditPrinter = (printer: PrinterData) => {
    setPrinterToEdit(printer);
    setIsEditing(true);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Printers Refreshed",
      description: "The printer list has been updated.",
    });
  };

  const filteredPrinters = printersData?.filter(printer =>
    printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    printer.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    printer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPrinters = filteredPrinters?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const addForm = useForm<z.infer<typeof printerSchema>>({
    resolver: zodResolver(printerSchema),
    defaultValues: {
      name: "",
      model: "",
      location: "",
      status: "online",
      inkLevel: 100,
      paperLevel: 100,
      ipAddress: "",
      department: "",
    },
  });

  const editForm = useForm<z.infer<typeof printerSchema>>({
    resolver: zodResolver(printerSchema),
    defaultValues: printerToEdit || {
      name: "",
      model: "",
      location: "",
      status: "online",
      inkLevel: 100,
      paperLevel: 100,
      ipAddress: "",
      department: "",
    },
    values: printerToEdit,
    mode: "onChange"
  });

  useEffect(() => {
    if (printerToEdit) {
      editForm.reset(printerToEdit);
    }
  }, [printerToEdit, editForm]);

  const handleAddSubmit = (values: z.infer<typeof printerSchema>) => {
    addPrinterMutation.mutate(values);
  };

  const handleEditSubmit = (values: z.infer<typeof printerSchema>) => {
    if (printerToEdit) {
      updatePrinterMutation.mutate({ id: printerToEdit.id, data: values });
    }
  };

  const getStatusColor = (status: PrinterData["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "offline":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "maintenance":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Printers</h1>
          <p className="text-muted-foreground mt-1">Manage your organization's printers</p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            type="search"
            placeholder="Search printers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Printer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Printer</DialogTitle>
                <DialogDescription>
                  Add a new printer to the system.
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Printer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter printer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Printer Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter printer model" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Printer Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter printer location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormField
                    control={addForm.control}
                    name="inkLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ink Level</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter ink level" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="paperLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper Level</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter paper level" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="ipAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IP Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter IP Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Add</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Printer List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : filteredPrinters && filteredPrinters.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ink Level</TableCell>
                    <TableCell>Paper Level</TableCell>
                    <TableCell className="text-right">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPrinters.map(printer => (
                    <TableRow key={printer.id}>
                      <TableCell>{printer.name}</TableCell>
                      <TableCell>{printer.model}</TableCell>
                      <TableCell>{printer.location}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(printer.status)}>
                          {printer.status.charAt(0).toUpperCase() + printer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{printer.inkLevel}%</TableCell>
                      <TableCell>{printer.paperLevel}%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPrinter(printer.id)}>
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditPrinter(printer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePrinter(printer.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-center mt-4">
                <nav aria-label="Pagination" className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.ceil(filteredPrinters.length / itemsPerPage) }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === Math.ceil(filteredPrinters.length / itemsPerPage)}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No printers found</h3>
              <p className="text-muted-foreground mt-1">
                No printers match your search criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPrinter && printerDetails && (
        <PrinterDetailModal
          printer={printerDetails}
          onClose={() => setSelectedPrinter(null)}
        />
      )}

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Printer</DialogTitle>
            <DialogDescription>
              Edit the details of the selected printer.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Printer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter printer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Printer Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter printer model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Printer Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter printer location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormField
                control={editForm.control}
                name="inkLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ink Level</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter ink level" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="paperLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Level</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter paper level" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter IP Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Printers;
