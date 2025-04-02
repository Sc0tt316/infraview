
import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  AlertCircle 
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Define parameters for the activity query
const activityQueryParams = {
  limit: 100,
  sortBy: 'timestamp',
  sortOrder: 'desc' as const
};

const Activity = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch activity logs
  const { data: activityLogs, isLoading, refetch } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: () => analyticsService.getActivityLogs(activityQueryParams)
  });
  
  // Filter logs based on active tab
  const filteredLogs = activityLogs?.filter(log => {
    if (activeTab === 'all') return true;
    return log.type === activeTab;
  });
  
  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Activity Refreshed",
      description: "The activity logs have been updated."
    });
  };
  
  // Get icon for log type
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get color for log type
  const getLogColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'warning':
        return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'info':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'success':
        return 'text-green-500 bg-green-50 border-green-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activity</h1>
          <p className="text-muted-foreground mt-1">Monitor system events and user actions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Activity Logs</CardTitle>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="warning">Warning</TabsTrigger>
              <TabsTrigger value="error">Error</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : filteredLogs && filteredLogs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 p-2 rounded-full ${getLogColor(log.type)}`}>
                      {getLogIcon(log.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between gap-2 mb-1">
                        <span className="font-medium">{log.entityType || ''} {log.action || log.entityId || ''}</span>
                        <Badge variant="outline" className="font-normal">
                          {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{log.description || ''}</p>
                      
                      {log.user && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          By: {log.user}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No activity logs found</h3>
              <p className="text-muted-foreground max-w-md">
                {activeTab === 'all'
                  ? "There are currently no activity logs in the system."
                  : `There are no ${activeTab} logs available at this time.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
