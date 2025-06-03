
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PrinterData } from '@/types/printers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RefreshCw, Settings, Trash2, Power, Printer } from "lucide-react";
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

interface EnhancedPrinterCardProps {
  printer: PrinterData;
  onOpenDetails: (id: string) => void;
  onOpenEdit?: () => void;
  onOpenDelete?: () => void;
  isAdmin: boolean;
}

const EnhancedPrinterCard: React.FC<EnhancedPrinterCardProps> = ({
  printer,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  isAdmin
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-gray-500';
      case 'error':
        return 'text-red-500';
      case 'maintenance':
        return 'text-blue-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

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
      if (onOpenDelete) {
        onOpenDelete();
      }
    } catch (error) {
      console.error('Failed to delete printer:', error);
      toast({
        title: "Error",
        description: "Failed to delete the printer. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Function to render supplies info inline
  const renderSuppliesInfo = () => {
    if (printer.supplies) {
      // For color printers
      if (printer.supplies.cyan !== undefined || 
          printer.supplies.magenta !== undefined || 
          printer.supplies.yellow !== undefined) {
        return (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Toners:</p>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                Black: {printer.supplies.black}%
              </span>
              {printer.supplies.cyan !== undefined && (
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                  Cyan: {printer.supplies.cyan}%
                </span>
              )}
              {printer.supplies.magenta !== undefined && (
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                  Magenta: {printer.supplies.magenta}%
                </span>
              )}
              {printer.supplies.yellow !== undefined && (
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  Yellow: {printer.supplies.yellow}%
                </span>
              )}
            </div>
          </div>
        );
      } 
      // For monochrome printers
      return (
        <div className="mt-2">
          <p className="text-xs flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-black"></span>
            <span>Toner: {printer.supplies.black}%</span>
          </p>
        </div>
      );
    }
    
    // Fallback to old inkLevel for backward compatibility
    return (
      <div className="mt-2">
        <p className="text-xs">Ink Level: {printer.inkLevel}%</p>
      </div>
    );
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onOpenDetails(printer.id)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3 flex-1">
              {/* Printer Icon with Status Color */}
              <Printer className={`h-6 w-6 mt-0.5 ${getStatusColor(printer.status)}`} />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{printer.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{printer.model}</p>
                <p className="text-xs text-muted-foreground truncate">{printer.location}</p>
                
                {renderSuppliesInfo()}
                
                <p className="text-xs mt-2">Paper: {printer.paperLevel}%</p>
              </div>
            </div>

            {/* 3-dots menu for admin actions */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
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
                    if (onOpenEdit) onOpenEdit();
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
          </div>
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
        </AlertDialogFooter>
      </AlertDialog>
    </>
  );
};

export default EnhancedPrinterCard;
