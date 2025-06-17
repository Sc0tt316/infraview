
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, Wifi, WifiOff, AlertTriangle, MoreVertical } from 'lucide-react';
import { PrinterData } from '@/types/printers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface EnhancedPrinterCardProps {
  printer: PrinterData;
  onEdit?: (printer: PrinterData) => void;
  onDelete?: (printer: PrinterData) => void;
  onViewDetails?: (printer: PrinterData) => void;
  isAdmin?: boolean;
}

const EnhancedPrinterCard: React.FC<EnhancedPrinterCardProps> = ({
  printer,
  onEdit,
  onDelete,
  onViewDetails,
  isAdmin = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'default';
      case 'offline': return 'destructive';
      case 'warning': return 'outline';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && isAdmin) {
      onEdit(printer);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && isAdmin) {
      onDelete(printer);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(printer);
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <Printer className="h-8 w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate" title={printer.name}>
                {printer.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate" title={printer.model}>
                {printer.model}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(printer.status)}`} />
              {printer.status === 'online' ? 
                <Wifi className="h-3 w-3 text-green-600" /> : 
                <WifiOff className="h-3 w-3 text-red-600" />
              }
            </div>
            
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-md">
                  <DropdownMenuItem onClick={handleEdit}>
                    Edit Printer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    Delete Printer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <Badge variant={getStatusBadgeVariant(printer.status)} className="text-xs">
            {printer.status.charAt(0).toUpperCase() + printer.status.slice(1)}
          </Badge>
        </div>

        {/* Supply Levels */}
        <div className="space-y-3 flex-1">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Ink Levels</span>
            </div>
            
            {/* Toner/Ink Cartridges Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black rounded-sm flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Black</span>
                    <span className="text-xs font-medium">{printer.inkLevel || 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-black h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${printer.inkLevel || 0}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-sm flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Cyan</span>
                    <span className="text-xs font-medium">57%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300" style={{ width: '57%' }} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-magenta-500 rounded-sm flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Magenta</span>
                    <span className="text-xs font-medium">26%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div className="bg-magenta-500 h-1.5 rounded-full transition-all duration-300" style={{ width: '26%' }} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-sm flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Yellow</span>
                    <span className="text-xs font-medium">95%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Paper Level */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Paper</span>
                <span className="text-xs font-medium">{printer.paperLevel || 0}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (printer.paperLevel || 0) > 50 ? 'bg-green-500' : 
                    (printer.paperLevel || 0) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${printer.paperLevel || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-auto">
          <Separator className="mb-3" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="truncate">{printer.location}</span>
            {printer.department && (
              <Badge variant="outline" className="text-xs">
                {printer.department}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPrinterCard;
