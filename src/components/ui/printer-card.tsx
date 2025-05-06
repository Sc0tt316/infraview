
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrinterData } from '@/types/printers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RefreshCw, Settings, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
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
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onOpenEdit(printer);
              }}>
                <Settings className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onRestart(printer.id);
              }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Restart
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDelete(printer);
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
  );
};
