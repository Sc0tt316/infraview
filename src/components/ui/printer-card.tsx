
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrinterData } from '@/types/printers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RefreshCw, Settings, Trash2, Power } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';

interface PrinterCardProps {
  printer: PrinterData;
  onOpenDetails: (id: string) => void;
  onOpenEdit: (printer: PrinterData) => void;
  onOpenDelete: (printer: PrinterData) => void;
  onRestart: (id: string) => void;
  isAdmin: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'online':
      return <Badge className="bg-green-500">Online</Badge>;
    case 'offline':
      return <Badge variant="outline" className="text-gray-500 border-gray-300">Offline</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    case 'maintenance':
      return <Badge className="bg-orange-500">Maintenance</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-500">Warning</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const PrinterCard: React.FC<PrinterCardProps> = ({ 
  printer, 
  onOpenDetails, 
  onOpenEdit, 
  onOpenDelete, 
  onRestart, 
  isAdmin 
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    
    try {
      if (printer.ipAddress) {
        await printerService.pollPrinter({
          id: printer.id,
          name: printer.name,
          ipAddress: printer.ipAddress
        });
        toast({
          title: "Success",
          description: "Printer status refreshed successfully",
        });
      } else {
        toast({
          title: "Warning",
          description: "No IP address configured for this printer",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh printer status",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    try {
      await printerService.restartPrinter(printer.id);
      toast({
        title: "Printer Restarting",
        description: `${printer.name} is now restarting. This may take a moment.`
      });
      setShowRestartDialog(false);
      setTimeout(() => {
        setIsRestarting(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to restart printer:', error);
      toast({
        title: "Error",
        description: "Failed to restart the printer. Please try again.",
        variant: "destructive"
      });
      setIsRestarting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await printerService.deletePrinter(printer.id, printer.name);
      toast({
        title: "Printer Deleted",
        description: `${printer.name} has been deleted successfully.`
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete printer:', error);
      toast({
        title: "Error",
        description: "Failed to delete the printer. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={() => onOpenDetails(printer.id)}>
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-bold">{printer.name}</CardTitle>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              {printer.model}
              <span className="mx-2">•</span>
              {printer.location}
            </div>
          </div>
          
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setShowRestartDialog(true);
                }} disabled={isRestarting || !printer.ipAddress}>
                  <Power className="mr-2 h-4 w-4" />
                  Restart
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onOpenEdit(printer);
                }}>
                  <Settings className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Status</span>
            {getStatusBadge(printer.status)}
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Ink Level</span>
              </div>
              <Progress value={printer.inkLevel} className="h-2" indicatorClassName={
                printer.inkLevel < 20 ? "bg-red-500" : printer.inkLevel < 40 ? "bg-yellow-500" : "bg-green-500"
              } />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Paper Level</span>
              </div>
              <Progress value={printer.paperLevel} className="h-2" indicatorClassName={
                printer.paperLevel < 20 ? "bg-red-500" : printer.paperLevel < 40 ? "bg-yellow-500" : "bg-green-500"
              } />
            </div>
          </div>
          
          {printer.jobCount !== undefined && (
            <div className="mt-3 text-sm text-muted-foreground">
              {printer.jobCount} print jobs • Last active: {printer.lastActive || 'Never'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Printer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{printer.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restart Confirmation Dialog */}
      <AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart Printer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restart "{printer.name}"? This will temporarily interrupt any ongoing print jobs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestart} disabled={isRestarting}>
              {isRestarting ? 'Restarting...' : 'Restart'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
