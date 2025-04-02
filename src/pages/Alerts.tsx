
import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, AlertCircle, Info, Bell, CheckCircle, Filter } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Alert query params
const alertQueryParams = {
  limit: 100,
  status: 'all' as const,
  level: 'all' as const,
  sortBy: 'timestamp',
  sortOrder: 'desc' as const
};

const Alerts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch alerts
  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => analyticsService.getAlerts(alertQueryParams)
  });
  
  // Filter alerts based on active tab
  const filteredAlerts = alerts?.filter(alert => {
    if (activeTab === 'all') return true;
    return alert.status === activeTab;
  });
  
  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Alerts Refreshed",
      description: "The alerts have been updated."
    });
  };
  
  // Get icon for alert severity
  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Get color for alert severity
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'warning':
        return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'info':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };
  
  // Get badge style for alert status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">Active</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">Resolved</Badge>;
      case 'acknowledged':
        return <Badge variant="secondary">Acknowledged</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alerts</h1>
          <p className="text-muted-foreground mt-1">Monitor system alerts and issues</p>
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Alerts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Status</DropdownMenuLabel>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Resolved</DropdownMenuItem>
              <DropdownMenuItem>Acknowledged</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Severity</DropdownMenuLabel>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Critical</DropdownMenuItem>
              <DropdownMenuItem>Warning</DropdownMenuItem>
              <DropdownMenuItem>Info</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
          <CardTitle>System Alerts</CardTitle>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : filteredAlerts && filteredAlerts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 p-2 rounded-full ${getAlertColor(alert.level || '')}`}>
                      {getAlertIcon(alert.level || '')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between gap-2 mb-1">
                        <span className="font-medium">{alert.title || ''}</span>
                        <div className="flex gap-2 items-center">
                          {getStatusBadge(alert.status || '')}
                          <Badge variant="outline" className="font-normal">
                            {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{alert.description || ''}</p>
                      
                      {alert.printer && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Printer: {alert.printer?.name || alert.printer || ''}
                        </div>
                      )}
                      
                      {alert.user && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          User: {alert.user?.name || alert.user || ''}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-1">No alerts found</h3>
              <p className="text-muted-foreground max-w-md">
                {activeTab === 'all'
                  ? "There are currently no alerts in the system."
                  : `There are no ${activeTab} alerts at this time.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
