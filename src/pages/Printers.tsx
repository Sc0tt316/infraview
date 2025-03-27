
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Printer, Plus, Search, Filter, MoreHorizontal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PrinterData {
  id: string;
  name: string;
  model: string;
  location: string;
  status: "online" | "offline" | "error" | "maintenance";
  inkLevel: number;
  paperLevel: number;
  jobCount: number;
  lastActive: string;
}

const MOCK_PRINTERS: PrinterData[] = [
  {
    id: "p1",
    name: "Office Printer 1",
    model: "HP LaserJet Pro",
    location: "First Floor",
    status: "online",
    inkLevel: 75,
    paperLevel: 30,
    jobCount: 145,
    lastActive: "2 minutes ago",
  },
  {
    id: "p2",
    name: "Executive Printer",
    model: "Canon PIXMA",
    location: "Executive Suite",
    status: "offline",
    inkLevel: 20,
    paperLevel: 60,
    jobCount: 89,
    lastActive: "2 days ago",
  },
  {
    id: "p3",
    name: "Marketing Printer",
    model: "Epson WorkForce Pro",
    location: "Marketing Department",
    status: "error",
    inkLevel: 5,
    paperLevel: 75,
    jobCount: 254,
    lastActive: "5 minutes ago",
  },
  {
    id: "p4",
    name: "Conference Room Printer",
    model: "Brother MFC",
    location: "Main Conference Room",
    status: "maintenance",
    inkLevel: 50,
    paperLevel: 100,
    jobCount: 67,
    lastActive: "1 hour ago",
  },
  {
    id: "p5",
    name: "Accounting Printer",
    model: "Xerox VersaLink",
    location: "Accounting Department",
    status: "online",
    inkLevel: 90,
    paperLevel: 85,
    jobCount: 321,
    lastActive: "15 minutes ago",
  },
];

const Printers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const getFilteredPrinters = () => {
    let filtered = MOCK_PRINTERS;
    
    if (searchQuery) {
      filtered = filtered.filter(printer => 
        printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        printer.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        printer.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedTab !== "all") {
      filtered = filtered.filter(printer => printer.status === selectedTab);
    }
    
    return filtered;
  };

  const getStatusColor = (status: PrinterData["status"]) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-700 border-green-200";
      case "offline": return "bg-gray-100 text-gray-700 border-gray-200";
      case "error": return "bg-red-100 text-red-700 border-red-200";
      case "maintenance": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
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
    if (level <= 10) return "text-red-600";
    if (level <= 30) return "text-yellow-600";
    return "text-green-600";
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
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              <span>Add Printer</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Printer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Printer Name</label>
                <Input id="name" placeholder="Enter printer name" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="model" className="text-sm font-medium">Model</label>
                <Input id="model" placeholder="Enter printer model" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input id="location" placeholder="Enter printer location" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="ip" className="text-sm font-medium">IP Address</label>
                <Input id="ip" placeholder="Enter IP address" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={() => setShowAddDialog(false)}>Add Printer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search printers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          
          <Tabs defaultValue="all" className="w-fit" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
              <TabsTrigger value="error">Error</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredPrinters.length > 0 ? (
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
              className="bg-white border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Printer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{printer.name}</h3>
                      <p className="text-sm text-muted-foreground">{printer.model}</p>
                    </div>
                  </div>
                  
                  <Badge className={cn("border", getStatusColor(printer.status))}>
                    {getStatusText(printer.status)}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Ink Level</span>
                      <span className={getLevelColor(printer.inkLevel)}>{printer.inkLevel}%</span>
                    </div>
                    <Progress value={printer.inkLevel} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Paper Level</span>
                      <span className={getLevelColor(printer.paperLevel)}>{printer.paperLevel}%</span>
                    </div>
                    <Progress value={printer.paperLevel} className="h-2" />
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border/40 flex justify-between text-sm text-muted-foreground">
                  <span>Location: {printer.location}</span>
                  <span>Jobs: {printer.jobCount}</span>
                </div>
              </div>
              
              <div className="bg-muted/30 px-5 py-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Last active: {printer.lastActive}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No printers found</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            No printers match your search criteria. Try changing your search or filters.
          </p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedTab("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Printers;
