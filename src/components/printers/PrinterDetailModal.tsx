
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { printerService, PrinterData, PrintLog, ActivityItem } from '@/services/printerService';
import { 
  Printer, AlertTriangle, Info, CheckCircle, RefreshCw, 
  Calendar, X, FileClock, Clock, FileText, Settings
} from 'lucide-react';
import { format } from 'date-fns';

// Define props for the component
export interface PrinterDetailModalProps {
  printerId: string;
  onClose: () => void;
}

const PrinterDetailModal = ({ printerId, onClose }: PrinterDetailModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRestarting, setIsRestarting] = useState(false);

  // Use React Query to fetch printer details
  const { data: printer, isLoading, refetch } = useQuery({
    queryKey: ['printer', printerId],
    queryFn: () => printerService.getPrinterById(printerId),
    enabled: Boolean(printerId),
  });

  // Handle modal close
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  // Handle printer restart
  const handleRestartPrinter = async () => {
    if (!printer) return;
    
    setIsRestarting(true);
    
    try {
      await printerService.restartPrinter(printer.id);
      toast({
        title: "Printer Restarted",
        description: "The printer has been restarted successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error restarting printer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restart printer. Please try again.",
      });
    } finally {
      setIsRestarting(false);
    }
  };

  // Get color for printer status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500 hover:bg-green-600';
      case 'offline':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'maintenance':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Get badge for printer status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500">Offline</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-500">Maintenance</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center">
            <Printer className="mr-2 h-5 w-5" />
            {isLoading ? 'Loading Printer Details...' : printer?.name || 'Printer Details'}
            <div className="ml-2">
              {!isLoading && printer && getStatusBadge(printer.status)}
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="animate-spin h-8 w-8 text-primary/70" />
          </div>
        ) : printer ? (
          <>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="px-6">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="logs" className="flex-1">Print Logs</TabsTrigger>
                  <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                </TabsList>
              </div>

              <div className="px-6 pb-6 pt-4">
                <TabsContent value="overview" className="space-y-6 mt-0">
                  {/* Printer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Printer Information</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="text-muted-foreground">Model:</div>
                          <div>{printer.model}</div>

                          <div className="text-muted-foreground">Location:</div>
                          <div>{printer.location}</div>

                          <div className="text-muted-foreground">Serial Number:</div>
                          <div>{printer.serialNumber || 'N/A'}</div>

                          <div className="text-muted-foreground">IP Address:</div>
                          <div>{printer.ipAddress || 'N/A'}</div>

                          <div className="text-muted-foreground">Department:</div>
                          <div>{printer.department || 'N/A'}</div>

                          <div className="text-muted-foreground">Date Added:</div>
                          <div>{printer.addedDate ? format(new Date(printer.addedDate), 'MMM dd, yyyy') : 'N/A'}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Supplies</h3>
                        {printer.supplies ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Black Toner ({printer.supplies.black}%)</span>
                                <span className={printer.supplies.black < 10 ? "text-red-500" : printer.supplies.black < 25 ? "text-amber-500" : ""}>
                                  {printer.supplies.black < 10 ? "Very Low" : printer.supplies.black < 25 ? "Low" : "OK"}
                                </span>
                              </div>
                              <Progress value={printer.supplies.black} className="h-2" />
                            </div>

                            {printer.supplies.cyan !== undefined && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Cyan Toner ({printer.supplies.cyan}%)</span>
                                  <span className={printer.supplies.cyan < 10 ? "text-red-500" : printer.supplies.cyan < 25 ? "text-amber-500" : ""}>
                                    {printer.supplies.cyan < 10 ? "Very Low" : printer.supplies.cyan < 25 ? "Low" : "OK"}
                                  </span>
                                </div>
                                <Progress value={printer.supplies.cyan} className="h-2" />
                              </div>
                            )}

                            {printer.supplies.magenta !== undefined && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Magenta Toner ({printer.supplies.magenta}%)</span>
                                  <span className={printer.supplies.magenta < 10 ? "text-red-500" : printer.supplies.magenta < 25 ? "text-amber-500" : ""}>
                                    {printer.supplies.magenta < 10 ? "Very Low" : printer.supplies.magenta < 25 ? "Low" : "OK"}
                                  </span>
                                </div>
                                <Progress value={printer.supplies.magenta} className="h-2" />
                              </div>
                            )}

                            {printer.supplies.yellow !== undefined && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Yellow Toner ({printer.supplies.yellow}%)</span>
                                  <span className={printer.supplies.yellow < 10 ? "text-red-500" : printer.supplies.yellow < 25 ? "text-amber-500" : ""}>
                                    {printer.supplies.yellow < 10 ? "Very Low" : printer.supplies.yellow < 25 ? "Low" : "OK"}
                                  </span>
                                </div>
                                <Progress value={printer.supplies.yellow} className="h-2" />
                              </div>
                            )}

                            {printer.supplies.waste !== undefined && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Waste Container ({printer.supplies.waste}%)</span>
                                  <span className={printer.supplies.waste > 90 ? "text-red-500" : printer.supplies.waste > 75 ? "text-amber-500" : ""}>
                                    {printer.supplies.waste > 90 ? "Nearly Full" : printer.supplies.waste > 75 ? "Getting Full" : "OK"}
                                  </span>
                                </div>
                                <Progress value={printer.supplies.waste} className="h-2" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No supply data available</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Status & Levels</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Ink Level ({printer.inkLevel}%)</span>
                              <span className={printer.inkLevel < 10 ? "text-red-500" : printer.inkLevel < 25 ? "text-amber-500" : ""}>
                                {printer.inkLevel < 10 ? "Very Low" : printer.inkLevel < 25 ? "Low" : "OK"}
                              </span>
                            </div>
                            <Progress value={printer.inkLevel} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Paper Level ({printer.paperLevel}%)</span>
                              <span className={printer.paperLevel < 10 ? "text-red-500" : printer.paperLevel < 25 ? "text-amber-500" : ""}>
                                {printer.paperLevel < 10 ? "Very Low" : printer.paperLevel < 25 ? "Low" : "OK"}
                              </span>
                            </div>
                            <Progress value={printer.paperLevel} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Statistics</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="text-muted-foreground">Total Pages:</div>
                          <div>{printer.stats?.totalPages?.toLocaleString() || 'N/A'}</div>

                          <div className="text-muted-foreground">Monthly Pages:</div>
                          <div>{printer.stats?.monthlyPages?.toLocaleString() || 'N/A'}</div>

                          <div className="text-muted-foreground">Paper Jams:</div>
                          <div>{printer.stats?.jams || 0} incidents</div>

                          <div className="text-muted-foreground">Job Count:</div>
                          <div>{printer.jobCount?.toLocaleString() || 0} jobs</div>

                          <div className="text-muted-foreground">Last Active:</div>
                          <div>{printer.lastActive || 'Unknown'}</div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={handleRestartPrinter} 
                          disabled={isRestarting || printer.status === 'maintenance'} 
                          className="w-full"
                        >
                          {isRestarting ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Restarting...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Restart Printer
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="logs" className="space-y-4 mt-0">
                  {printer.printLogs && printer.printLogs.length > 0 ? (
                    <div className="space-y-3">
                      {printer.printLogs.map((log, index) => (
                        <div key={log.id || index} className="flex items-center border-b border-gray-100 pb-3 last:border-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            log.status === 'completed' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                          }`}>
                            {log.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <X className="h-5 w-5" />
                            )}
                          </div>
                          
                          <div className="ml-4 flex-grow min-w-0">
                            <div className="flex justify-between">
                              <span className="font-medium text-sm truncate">{log.fileName}</span>
                              <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                                {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span className="flex items-center mr-3">
                                  <FileClock className="h-3 w-3 mr-1" />
                                  {log.pages} {log.pages === 1 ? 'page' : 'pages'}
                                </span>
                                <span className="flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {log.size}
                                </span>
                              </div>
                              <div className="text-xs">
                                <span className="text-muted-foreground">By: </span>
                                <span>{log.user}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium">No print logs available</h3>
                      <p className="text-muted-foreground mt-1">
                        There are no print logs for this printer.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4 mt-0">
                  {printer.activity && printer.activity.length > 0 ? (
                    <div className="space-y-3">
                      {printer.activity.map((item, index) => (
                        <div key={item.id || index} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            {getActivityIcon(item.type)}
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="flex justify-between">
                              <span className="font-medium text-sm">{item.message}</span>
                              <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                                {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium">No activity available</h3>
                      <p className="text-muted-foreground mt-1">
                        There is no activity recorded for this printer.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium">Printer Not Found</h3>
            <p className="text-muted-foreground mt-1">
              The requested printer information could not be found.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrinterDetailModal;
