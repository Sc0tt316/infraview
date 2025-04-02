
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Printer, FileText, Activity, RefreshCw, Clock, CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { printerService, PrinterData } from '@/services/printerService';
import { analyticsService } from '@/services/analyticsService';

interface PrinterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  printerId: string | null;
}

const PrinterDetailModal = ({ isOpen, onClose, printerId }: PrinterDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch printer details
  const { 
    data: printer,
    isLoading: isLoadingPrinter
  } = useQuery({
    queryKey: ['printer', printerId],
    queryFn: () => printerId ? printerService.getPrinterById(printerId) : null,
    enabled: !!printerId && isOpen
  });
  
  // Fetch printer logs
  const {
    data: printerLogs = [],
    isLoading: isLoadingLogs
  } = useQuery({
    queryKey: ['printerLogs', printerId],
    queryFn: () => printerId ? printerService.getPrinterLogs(printerId) : [],
    enabled: !!printerId && isOpen
  });
  
  // Fetch printer activity
  const {
    data: printerActivity = [],
    isLoading: isLoadingActivity
  } = useQuery({
    queryKey: ['printerActivity', printerId],
    queryFn: () => printerId ? analyticsService.getPrinterActivity(printerId) : [],
    enabled: !!printerId && isOpen
  });
  
  const getStatusColor = (status: PrinterData["status"]) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "offline": return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
      case "error": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "maintenance": return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      default: return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };
  
  const getLevelColor = (level: number) => {
    if (level <= 10) return "text-red-600 dark:text-red-400";
    if (level <= 30) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };
  
  const getLevelProgressColor = (level: number) => {
    if (level <= 10) return "bg-red-500";
    if (level <= 30) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  if (!printerId) return null;
  
  const isLoading = isLoadingPrinter || isLoadingLogs || isLoadingActivity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            <span>{printer?.name || 'Printer Details'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4 dark:bg-gray-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="logs">Print Logs</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : (
              <>
                <TabsContent value="overview" className="mt-0">
                  {printer && (
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="dark:bg-gray-700 dark:border-gray-600">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <Badge className={cn("border", getStatusColor(printer.status))}>
                                {printer.status.charAt(0).toUpperCase() + printer.status.slice(1)}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="dark:bg-gray-700 dark:border-gray-600">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Location</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-medium">{printer.location}</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card className="dark:bg-gray-700 dark:border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Consumables</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-1 text-sm">
                                <span>Ink Level</span>
                                <span className={getLevelColor(printer.inkLevel)}>{printer.inkLevel}%</span>
                              </div>
                              <Progress 
                                value={printer.inkLevel} 
                                className="h-2 dark:bg-gray-600" 
                                indicatorClassName={getLevelProgressColor(printer.inkLevel)}
                              />
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1 text-sm">
                                <span>Paper Level</span>
                                <span className={getLevelColor(printer.paperLevel)}>{printer.paperLevel}%</span>
                              </div>
                              <Progress 
                                value={printer.paperLevel} 
                                className="h-2 dark:bg-gray-600" 
                                indicatorClassName={getLevelProgressColor(printer.paperLevel)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="dark:bg-gray-700 dark:border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="grid grid-cols-2">
                              <span className="text-sm text-muted-foreground">Model:</span>
                              <span>{printer.model}</span>
                            </div>
                            {printer.ipAddress && (
                              <div className="grid grid-cols-2">
                                <span className="text-sm text-muted-foreground">IP Address:</span>
                                <span>{printer.ipAddress}</span>
                              </div>
                            )}
                            <div className="grid grid-cols-2">
                              <span className="text-sm text-muted-foreground">Job Count:</span>
                              <span>{printer.jobCount}</span>
                            </div>
                            <div className="grid grid-cols-2">
                              <span className="text-sm text-muted-foreground">Last Active:</span>
                              <span>{printer.lastActive}</span>
                            </div>
                            {printer.department && (
                              <div className="grid grid-cols-2">
                                <span className="text-sm text-muted-foreground">Department:</span>
                                <span>{printer.department}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="logs" className="mt-0">
                  {printerLogs.length > 0 ? (
                    <div className="border rounded-md dark:border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow className="dark:border-gray-700">
                            <TableHead className="w-[180px]">Time</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Pages</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {printerLogs.map((log) => (
                            <TableRow key={log.id} className="dark:border-gray-700">
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>{log.timestamp}</span>
                                </div>
                              </TableCell>
                              <TableCell>{log.documentName}</TableCell>
                              <TableCell>{log.user}</TableCell>
                              <TableCell className="text-right">{log.pages}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardContent className="flex flex-col items-center justify-center py-6">
                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No print logs found for this printer</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="activity" className="mt-0">
                  {printerActivity.length > 0 ? (
                    <div className="space-y-3">
                      {printerActivity.map((activity) => (
                        <div 
                          key={activity.id} 
                          className="flex items-start gap-3 p-3 border rounded-md dark:border-gray-700"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                            {activity.type === 'error' ? (
                              <CircleAlert className="h-4 w-4 text-red-500" />
                            ) : (
                              <Activity className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-sm">{activity.action}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{activity.timestamp}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            {activity.user && (
                              <p className="text-xs text-muted-foreground mt-1">By: {activity.user}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardContent className="flex flex-col items-center justify-center py-6">
                        <Activity className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No activity logs found for this printer</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrinterDetailModal;
