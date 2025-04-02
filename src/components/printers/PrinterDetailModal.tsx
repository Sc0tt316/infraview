
import React, { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Printer, Info, ClipboardList, History, CheckCircle, 
  AlertCircle, Trash2, AlertTriangle, RefreshCw, Settings,
  Bookmark, Loader2
} from "lucide-react";
import { PrinterData, printerService } from "@/services/printerService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface PrinterDetailModalProps {
  printer: PrinterData;
  onClose: () => void;
}

const PrinterDetailModal = ({ printer, onClose }: PrinterDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  // Get status color
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
      default:
        return "bg-gray-100 text-gray-500";
    }
  };
  
  // Get ink level color
  const getInkLevelColor = (level: number) => {
    if (level <= 10) return "bg-red-500";
    if (level <= 25) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Handle printer restart
  const handleRestart = async () => {
    setIsSubmitting(true);
    try {
      await printerService.restartPrinter(printer.id);
      toast.success(`Printer ${printer.name} restarted successfully`);
      queryClient.invalidateQueries({ queryKey: ['printers'] });
    } catch (error) {
      toast.error("Failed to restart printer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-background rounded-lg shadow-xl overflow-hidden w-full max-w-3xl max-h-[90vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${getStatusColor(printer.status)}`}>
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{printer.name}</h2>
                <p className="text-sm text-muted-foreground">{printer.location}</p>
              </div>
            </div>
            <Badge className={getStatusColor(printer.status)}>
              {printer.status.charAt(0).toUpperCase() + printer.status.slice(1)}
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 sm:px-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="printLogs" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Print Logs</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Activity</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 170px)' }}>
              <TabsContent value="overview" className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Printer Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Model</span>
                        <span className="text-sm font-medium">{printer.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Serial</span>
                        <span className="text-sm font-medium">{printer.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">IP Address</span>
                        <span className="text-sm font-medium">{printer.ipAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Department</span>
                        <span className="text-sm font-medium">{printer.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Added</span>
                        <span className="text-sm font-medium">{format(new Date(printer.addedDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Supplies Status</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Black Toner</span>
                          <span className="text-sm font-medium">{printer.supplies.black}%</span>
                        </div>
                        <Progress value={printer.supplies.black} className="h-2" indicatorClassName={getInkLevelColor(printer.supplies.black)} />
                      </div>
                      
                      {printer.supplies.cyan !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm">Cyan Toner</span>
                            <span className="text-sm font-medium">{printer.supplies.cyan}%</span>
                          </div>
                          <Progress value={printer.supplies.cyan} className="h-2" indicatorClassName={getInkLevelColor(printer.supplies.cyan)} />
                        </div>
                      )}
                      
                      {printer.supplies.magenta !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm">Magenta Toner</span>
                            <span className="text-sm font-medium">{printer.supplies.magenta}%</span>
                          </div>
                          <Progress value={printer.supplies.magenta} className="h-2" indicatorClassName={getInkLevelColor(printer.supplies.magenta)} />
                        </div>
                      )}
                      
                      {printer.supplies.yellow !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm">Yellow Toner</span>
                            <span className="text-sm font-medium">{printer.supplies.yellow}%</span>
                          </div>
                          <Progress value={printer.supplies.yellow} className="h-2" indicatorClassName={getInkLevelColor(printer.supplies.yellow)} />
                        </div>
                      )}
                      
                      {printer.supplies.waste !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm">Waste Container</span>
                            <span className="text-sm font-medium">{printer.supplies.waste}%</span>
                          </div>
                          <Progress value={printer.supplies.waste} className="h-2" indicatorClassName={getInkLevelColor(100 - printer.supplies.waste)} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Pages</span>
                        <Badge variant="outline">{printer.stats.totalPages.toLocaleString()}</Badge>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pages (30d)</span>
                        <Badge variant="outline">{printer.stats.monthlyPages.toLocaleString()}</Badge>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Jams (30d)</span>
                        <Badge variant={printer.stats.jams > 0 ? "destructive" : "outline"}>{printer.stats.jams}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleRestart}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span>Restart Printer</span>
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                  <Button variant="outline" className="gap-2 text-blue-600">
                    <Bookmark className="h-4 w-4" />
                    <span>Add to Favorites</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="printLogs" className="p-4 sm:p-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Print Jobs</h3>
                  
                  {printer.printLogs.length > 0 ? (
                    <div className="space-y-3">
                      {printer.printLogs.map((log, index) => (
                        <div 
                          key={index}
                          className="bg-muted/30 rounded-lg p-3 flex items-start justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {log.status === "completed" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-medium">{log.fileName}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Printed by {log.user} · {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge>{log.pages} pages</Badge>
                            <span className="text-xs text-muted-foreground">
                              {log.size}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No print logs available</h3>
                      <p className="text-muted-foreground mt-1">
                        There are no recent print jobs for this printer.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="p-4 sm:p-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Activity</h3>
                  
                  {printer.activity.length > 0 ? (
                    <div className="space-y-3">
                      {printer.activity.map((activity, index) => (
                        <div 
                          key={index}
                          className="bg-muted/30 rounded-lg p-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-full ${
                              activity.type === "error" 
                                ? "bg-red-100 text-red-500" 
                                : activity.type === "warning" 
                                ? "bg-yellow-100 text-yellow-500"
                                : activity.type === "info"
                                ? "bg-blue-100 text-blue-500"
                                : "bg-green-100 text-green-500"
                            }`}>
                              {activity.type === "error" ? (
                                <AlertTriangle className="h-3.5 w-3.5" />
                              ) : activity.type === "warning" ? (
                                <AlertCircle className="h-3.5 w-3.5" />
                              ) : activity.type === "info" ? (
                                <Info className="h-3.5 w-3.5" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="font-medium">{activity.message}</div>
                              <div className="text-sm text-muted-foreground">
                                {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No activity logs available</h3>
                      <p className="text-muted-foreground mt-1">
                        There are no recent activity logs for this printer.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>

            <div className="p-4 sm:p-6 border-t">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>Close</Button>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrinterDetailModal;
