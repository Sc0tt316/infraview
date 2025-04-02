
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity as ActivityIcon, Clock, Filter, Search, RefreshCw, Printer, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { analyticsService, ActivityLogData } from "@/services/analyticsService";

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();
  
  // Fetch activity data
  const { 
    data: activityData = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['activity'],
    queryFn: analyticsService.getActivityLogs
  });

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Activity logs have been refreshed.",
    });
  };

  // Filter activity data
  const getFilteredActivities = () => {
    let filtered = activityData;
    
    if (searchQuery) {
      filtered = filtered.filter(activity => 
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.entityName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(activity => activity.type === filterType);
    }
    
    return filtered;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "printer": return <Printer className="h-4 w-4" />;
      case "user": return <User className="h-4 w-4" />;
      case "system": return <AlertTriangle className="h-4 w-4" />;
      default: return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "printer": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
      case "user": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "system": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const filteredActivities = getFilteredActivities();

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
    hidden: { opacity: 0, y: 20 },
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
          <h1 className="text-2xl font-semibold">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">View all system activities</p>
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
            placeholder="Search activities..."
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
            Failed to load activity data. Please try again.
            <Button variant="outline" size="sm" className="ml-2" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : filteredActivities.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredActivities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              className="flex items-start gap-4 p-4 rounded-lg border border-border/40 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                getActivityColor(activity.type)
              )}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium text-foreground dark:text-gray-200">
                    {activity.action}
                    {activity.entityName && (
                      <span className="ml-1 font-normal text-muted-foreground dark:text-gray-400">
                        for {activity.entityName}
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center text-xs text-muted-foreground dark:text-gray-400">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">{activity.description}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-muted-foreground dark:text-gray-500">By: {activity.user}</span>
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
          <h3 className="text-lg font-medium dark:text-gray-200">No activities found</h3>
          <p className="text-muted-foreground mt-1 max-w-md dark:text-gray-400">
            No activities match your search criteria. Try changing your search or filters.
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

export default Activity;
