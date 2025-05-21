
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getStatusBadge, getStatusColor } from "./printer-detail/StatusUtils";
import { PrinterData } from "@/types/printers";
import { Edit, Trash2, MoreVertical } from "lucide-react";

interface EnhancedPrinterCardProps {
  printer: PrinterData;
  onOpenDetails: (id: string) => void;
  onOpenEdit: (printer: PrinterData) => void;
  onOpenDelete: (printer: PrinterData) => void;
  isAdmin: boolean;
}

const EnhancedPrinterCard: React.FC<EnhancedPrinterCardProps> = ({
  printer,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  isAdmin,
}) => {
  const statusClass = getStatusColor(printer.status);
  const hasSupplies = printer.supplies && (
    printer.supplies.cyan !== undefined || 
    printer.supplies.magenta !== undefined || 
    printer.supplies.yellow !== undefined
  );
  
  // Format ink level display based on supplies data
  const formatInkLevel = () => {
    if (hasSupplies) {
      return "Multiple toners";
    }
    return `${printer.inkLevel}% ink`;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-2 ${statusClass}`}></div>
      <CardContent className="p-4 pt-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium">
              {printer.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {printer.model}
            </p>
          </div>
          <div>
            {getStatusBadge(printer.status)}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span>{printer.location}</span>
          </div>
          
          {printer.department && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span>{printer.department}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Supply:</span>
            <span>{formatInkLevel()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paper:</span>
            <span>{printer.paperLevel}%</span>
          </div>
          
          {printer.subStatus && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">State:</span>
              <span>{printer.subStatus}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="default" 
          onClick={() => onOpenDetails(printer.id)}
          className="w-full"
        >
          View Details
        </Button>
        
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpenEdit(printer)} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenDelete(printer)} className="flex items-center text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnhancedPrinterCard;
