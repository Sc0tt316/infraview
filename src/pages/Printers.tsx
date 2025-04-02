import React, { useState } from "react";
import { motion } from "framer-motion";
import { Printer, Plus, Search, Filter, MoreHorizontal, AlertTriangle, RefreshCw, Trash2, Edit, Check, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { printerService, PrinterData } from "@/services/printerService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PrinterDetailModal from "@/components/printers/PrinterDetailModal";
import { useAuth } from "@/context/AuthContext";

const Printers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    location: "",
    ipAddress: "",
    department: ""
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const { data: printers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['printers'],
    queryFn: printerService.getAllPrinters
  });
  
  const addPrinterMutation = useMutation({
    mutationFn: (data: Omit<PrinterData, 'id' | 'jobCount' | 'lastActive'>) => 
      printerService.addPrinter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      setShowAddDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Printer has been added successfully.",
      });
    }
  });
  
  const updatePrinterMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PrinterData> }) => 
      printerService.updatePrinter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      setShowEditDialog(false);
      setSelectedPrinter(null);
      resetForm();
      toast({
        title: "Success",
        description: "Printer has been updated successfully.",
      });
    }
  });
  
  const deletePrinterMutation = useMutation({
    mutationFn: (id: string) => printerService.deletePrinter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      toast({
        title: "Success",
        description: "Printer has been deleted successfully.",
      });
    }
  });
  
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PrinterData['status'] }) => 
      printerService.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      toast({
        title: "Status Updated",
        description: "Printer status has been updated successfully.",
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      model: "",
      location: "",
      ipAddress: "",
      department: ""
    });
    setIsSubmitting(false);
  };
  
  const handleAddPrinter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { name, model, location, ipAddress, department } = formData;
    
    if (!name || !model || !location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    const newPrinter = {
      name,
      model, 
      location,
      ipAddress,
      department,
      status: "offline" as const,
      inkLevel: 100,
      paperLevel: 100
    };
    
    addPrinterMutation.mutate(newPrinter);
  };
  
  const handleEditPrinter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPrinter) return;
    setIsSubmitting(true);
    
    const { name, model, location, ipAddress, department } = formData;
    
    if (!name || !model || !location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    updatePrinterMutation.mutate({
      id: selectedPrinter.id,
      data: { name, model, location, ipAddress, department }
    });
  };
  
  const openEditDialog = (printer: PrinterData) => {
    setSelectedPrinter(printer);
    setFormData({
      name: printer.name,
      model: printer.model,
      location: printer.location,
      ipAddress: printer.ipAddress || "",
      department: printer.department || ""
    });
    setShowEditDialog(true);
  };
  
  const handleDeletePrinter = (id: string) => {
    if (window.confirm("Are you sure you want to delete this printer?")) {
      deletePrinterMutation.mutate(id);
    }
  };
  
  const handleStatusChange = (id: string, status: PrinterData['status']) => {
    changeStatusMutation.mutate({ id, status });
  };
  
  const openPrinterDetail = (id: string) => {
    setSelectedPrinterId(id);
    setShowDetailModal(true);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Printer data has been refreshed.",
    });
  };
  
  const getFilteredPrinters = () => {
    let filtered = printers;
    
    if (searchQuery) {
      filtered = filtered.filter(printer => 
        printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        printer.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        printer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (printer.department && printer.department.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedTab !== "all") {
      filtered = filtered.filter(printer => printer.status === selectedTab);
    }
    
    return filtered;
  };
  
  const getStatusColor = (status: PrinterData["status"]) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "offline": return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
      case "error": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "maintenance": return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      default: return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };
  
  const getStatusText = (status: PrinterData["status"]) => {
    switch (status) {
      case "online": return "Online";
      case "offline": return "Offline";
      case "error": return "Error";
      case "maintenance": return "Maintenance";
      default: return "Unknown";
    }
  };
  
  const getLevelColor = (level: number) => {
    if (level <= 10) return "text-red-600 dark:text-red-400";
    if (level <= 30) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };
  
  const staggerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
  };
  
  const filteredPrinters = getFilteredPrinters();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Printers</h1>
          <p className="text-muted-foreground mt-1">Manage your network printers</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            className="h-10 w-10"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          
          {isAdmin && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  <span>Add Printer</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle>Add New Printer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPrinter}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">Printer Name*</label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter printer name" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="model" className="text-sm font-medium">Model*</label>
                      <Input 
                        id="model" 
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="Enter printer model" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="location" className="text-sm font-medium">Location*</label>
                      <Input 
                        id="location" 
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter printer location" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="department" className="text-sm font-medium">Department</label>
                      <Input 
                        id="department" 
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="Enter department" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="ipAddress" className="text-sm font-medium">IP Address</label>
                      <Input 
                        id="ipAddress" 
                        name="ipAddress"
                        value={formData.ipAddress}
                        onChange={handleInputChange}
                        placeholder="Enter IP address" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add Printer'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-lg dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle>Edit Printer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditPrinter}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-name" className="text-sm font-medium">Printer Name*</label>
                    <Input 
                      id="edit-name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter printer name" 
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-model" className="text-sm font-medium">Model*</label>
                    <Input 
                      id="edit-model" 
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="Enter printer model" 
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-location" className="text-sm font-medium">Location*</label>
                    <Input 
                      id="edit-location" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter printer location" 
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-department" className="text-sm font-medium">Department</label>
                    <Input 
                      id="edit-department" 
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Enter department" 
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-ipAddress" className="text-sm font-medium">IP Address</label>
                    <Input 
                      id="edit-ipAddress" 
                      name="ipAddress"
                      value={formData.ipAddress}
                      onChange={handleInputChange}
                      placeholder="Enter IP address" 
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search printers..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:bg-gray-800">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          
          <Tabs defaultValue="all" className="w-fit" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="dark:bg-gray-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
              <TabsTrigger value="error">Error</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : isError ? (
        <Alert variant="destructive" className="my-4 dark:bg-red-900/20 dark:border-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load printers. Please try again.
            <Button variant="outline" size="sm" className="ml-2 dark:bg-gray-800 dark:border-gray-700" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : filteredPrinters.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredPrinters.map((printer) => (
            <motion.div
              key={printer.id}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 border border-border/40 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
              onClick={() => openPrinterDetail(printer.id)}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                      <Printer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground dark:text-gray-200">{printer.name}</h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">{printer.model}</p>
                    </div>
                  </div>
                  
                  <Badge className={cn("border", getStatusColor(printer.status))}>
                    {getStatusText(printer.status)}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="dark:text-gray-300">Ink Level</span>
                      <span className={getLevelColor(printer.inkLevel)}>{printer.inkLevel}%</span>
                    </div>
                    <Progress value={printer.inkLevel} className="h-2 dark:bg-gray-700" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="dark:text-gray-300">Paper Level</span>
                      <span className={getLevelColor(printer.paperLevel)}>{printer.paperLevel}%</span>
                    </div>
                    <Progress value={printer.paperLevel} className="h-2 dark:bg-gray-700" />
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border/40 dark:border-gray-700 flex justify-between text-sm text-muted-foreground dark:text-gray-400">
                  <span>Location: {printer.location}</span>
                  <span>Jobs: {printer.jobCount}</span>
                </div>
                {printer.department && (
                  <div className="text-sm text-muted-foreground mt-1 dark:text-gray-400">
                    Department: {printer.department}
                  </div>
                )}
              </div>
              
              <div className="bg-muted/30 dark:bg-gray-900/50 px-5 py-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground dark:text-gray-500">Last active: {printer.lastActive}</span>
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => openEditDialog(printer)} className="dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                      )}
                      
                      {isAdmin && printer.status !== "online" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(printer.id, "online")} className="dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                          <Check className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                          <span>Set online</span>
                        </DropdownMenuItem>
                      )}
                      
                      {isAdmin && printer.status !== "offline" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(printer.id, "offline")} className="dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                          <AlertTriangle className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span>Set offline</span>
                        </DropdownMenuItem>
                      )}
                      
                      {isAdmin && printer.status !== "maintenance" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(printer.id, "maintenance")} className="dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                          <Wrench className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <span>Set maintenance</span>
                        </DropdownMenuItem>
                      )}
                      
                      {isAdmin && (
                        <DropdownMenuItem 
                          className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700 dark:focus:bg-gray-700" 
                          onClick={() => handleDeletePrinter(printer.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium dark:text-gray-200">No printers found</h3>
          <p className="text-muted-foreground mt-1 max-w-md dark:text-gray-400">
            No printers match your search criteria. Try changing your search or filters.
          </p>
          <Button 
            variant="outline"
            className="mt-4 dark:bg-gray-800 dark:border-gray-700"
            onClick={() => {
              setSearchQuery("");
              setSelectedTab("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      
      <PrinterDetailModal 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        printerId={selectedPrinterId}
      />
    </div>
  );
};

export default Printers;
