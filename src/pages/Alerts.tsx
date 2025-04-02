
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, Clock, Filter, Search, RefreshCw, Printer, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

const Alerts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highPriority">("newest");
  const { toast } = useToast();
  
  // Fetch alerts data
  const { 
    data: alertsData = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['alerts'],
    queryFn: analyticsService.getAlerts
  });

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Alerts have been refreshed.",
    });
  };

  // Filter and sort alerts data
  const getFilteredAlerts = () => {
    let filtered = alertsData;
    
    if (searchQuery) {
      filtered = filtered.filter(alert => 
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.entityName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(alert => alert.type === filterType);
    }
    
    // Sort alerts
    switch (sortOrder) {
      case "newest":
        return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      case "oldest":
        return filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      case "highPriority":
        return filtered.sort((a, b) => {
          if (a.priority === "high" && b.priority !== "high") return -1;
          if (a.priority !== "high" && b.priority === "high") return 1;
          if (a.priority === "medium" && b.priority === "low") return -1;
          if (a.priority === "low" && b.priority === "medium") return 1;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      default:
        return filtered;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "printer": return <Printer className="h-4 w-4" />;
      case "user": return <User className="h-4 w-4" />;
      case "system": return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string, priority: string) => {
    const baseClasses = "text-white bg-opacity-90 dark:bg-opacity-70";
    
    if (priority === "high") {
      return `${baseClasses} bg-red-500 dark:bg-red-700`;
    } else if (priority === "medium") {
      return `${baseClasses} bg-yellow-500 dark:bg-yellow-700`;
    }
    
    switch (type) {
      case "printer": return `${baseClasses} bg-blue-500 dark:bg-blue-700`;
      case "user": return `${baseClasses} bg-green-500 dark:bg-green-700`;
      case "system": return `${baseClasses} bg-purple-500 dark:bg-purple-700`;
      default: return `${baseClasses} bg-gray-500 dark:bg-gray-700`;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">High</span>;
      case "medium": return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Medium</span>;
      case "low": return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Low</span>;
      default: return null;
    }
  };

  const filteredAlerts = getFilteredAlerts();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: a0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alerts</h1>
          <p className="text-muted-foreground mt-1">View and manage system alerts</p>
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
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search alerts..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest" | "highPriority")}>
            <SelectTrigger className="w-[180px] dark:border-gray-700 dark:bg-gray-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="highPriority">Priority (High first)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:bg-gray-800">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          
          <Tabs defaultValue="all" className="w-fit" value={filterType} onValueChange={setFilterType}>
            <TabsList className="dark:bg-gray-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="printer">Printers</TabsTrigger>
              <TabsTrigger value="user">Users</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : isError ? (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load alerts data. Please try again.
            <Button variant="outline" size="sm" className="ml-2" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : filteredAlerts.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              variants={itemVariants}
              className="flex items-start gap-4 p-4 rounded-lg border border-border/40 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                getAlertColor(alert.type, alert.priority)
              )}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <h4 className="font-medium text-foreground dark:text-gray-200">
                    {alert.title}
                    {alert.entityName && (
                      <span className="ml-1 font-normal text-muted-foreground dark:text-gray-400">
                        for {alert.entityName}
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center mt-1 sm:mt-0 text-xs text-muted-foreground dark:text-gray-400">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">{alert.message}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground dark:text-gray-500">Source: {alert.source}</span>
                  {getPriorityLabel(alert.priority)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium dark:text-gray-200">No alerts found</h3>
          <p className="text-muted-foreground mt-1 max-w-md dark:text-gray-400">
            No alerts match your search criteria. Try changing your search or filters.
          </p>
          <Button 
            variant="outline"
            className="mt-4 dark:bg-gray-800 dark:border-gray-700"
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Alerts;
