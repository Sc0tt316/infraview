
import React from 'react';
import { PrinterData } from '@/types/printers';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Printer,
  Info,
  Pencil,
  RotateCw,
  Trash2
} from 'lucide-react';

interface PrinterCardProps {
  printer: PrinterData;
  isGridView: boolean;
  onOpenDetails: (id: string) => void;
  onOpenEdit: (id: string) => void;
  onOpenDelete: (id: string) => void;
  onRestart: (id: string) => void;
  isAdmin?: boolean;
}

const PrinterCard: React.FC<PrinterCardProps> = ({
  printer,
  isGridView,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onRestart,
  isAdmin = false
}) => {
  const statusColors = {
    online: 'bg-green-100 text-green-800 hover:bg-green-100',
    offline: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    error: 'bg-red-100 text-red-800 hover:bg-red-100',
    maintenance: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    warning: 'bg-amber-100 text-amber-800 hover:bg-amber-100'
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    error: 'Error',
    maintenance: 'Maintenance',
    warning: 'Warning'
  };

  if (!isGridView) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-4 bg-blue-100 p-2 rounded-full">
                <Printer className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">{printer.name}</h3>
                <p className="text-sm text-muted-foreground">{printer.model}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Badge className={statusColors[printer.status]}>
                {statusLabels[printer.status]}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onOpenDetails(printer.id)}>
                    <Info className="mr-2 h-4 w-4" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => onOpenEdit(printer.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRestart(printer.id)}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        <span>Restart</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onOpenDelete(printer.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 border-b bg-muted/20">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="mr-4 bg-blue-100 p-2 rounded-full">
                <Printer className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{printer.name}</h3>
                <p className="text-sm text-muted-foreground">{printer.model}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Badge className={`${statusColors[printer.status]} mr-2`}>
                {statusLabels[printer.status]}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onOpenDetails(printer.id)}>
                    <Info className="mr-2 h-4 w-4" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => onOpenEdit(printer.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRestart(printer.id)}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        <span>Restart</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onOpenDelete(printer.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Ink Level</span>
                <span className={printer.inkLevel < 20 ? 'text-red-600 font-medium' : ''}>{printer.inkLevel}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className={`h-2 rounded-full ${printer.inkLevel < 20 ? 'bg-red-500' : 'bg-blue-600'}`} 
                  style={{ width: `${printer.inkLevel}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Paper Level</span>
                <span className={printer.paperLevel < 20 ? 'text-red-600 font-medium' : ''}>{printer.paperLevel}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className={`h-2 rounded-full ${printer.paperLevel < 20 ? 'bg-red-500' : 'bg-blue-600'}`} 
                  style={{ width: `${printer.paperLevel}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{printer.location}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Job Count</p>
              <p className="font-medium">{printer.jobCount || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Active</p>
              <p className="font-medium">{printer.lastActive || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-medium">{printer.department || "N/A"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterCard;
