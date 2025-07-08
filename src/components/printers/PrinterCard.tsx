
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Printer, Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { Printer as PrinterType } from '@/types/printer';

interface PrinterCardProps {
  printer: PrinterType;
  onClick: () => void;
}

const PrinterCard: React.FC<PrinterCardProps> = ({ printer, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  const getSupplyLevel = (supplyType: string) => {
    if (printer.supplies && typeof printer.supplies === 'object') {
      const supplies = printer.supplies as any;
      return supplies[supplyType] || 0;
    }
    // Fallback to individual fields
    switch (supplyType) {
      case 'ink':
      case 'toner':
        return printer.ink_level || 0;
      case 'paper':
        return printer.paper_level || 0;
      default:
        return 0;
    }
  };

  const inkLevel = getSupplyLevel('ink') || getSupplyLevel('toner');
  const paperLevel = getSupplyLevel('paper');

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Printer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{printer.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{printer.model}</p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(printer.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(printer.status)}
              <span className="capitalize">{printer.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Location:</span>
            <p className="font-medium">{printer.location}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Department:</span>
            <p className="font-medium">{printer.department || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Ink/Toner Level</span>
              <span className="text-sm text-muted-foreground">{inkLevel}%</span>
            </div>
            <Progress 
              value={inkLevel} 
              className="h-2"
              indicatorClassName={
                inkLevel > 50 ? "bg-green-500" : 
                inkLevel > 20 ? "bg-yellow-500" : "bg-red-500"
              }
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Paper Level</span>
              <span className="text-sm text-muted-foreground">{paperLevel}%</span>
            </div>
            <Progress 
              value={paperLevel} 
              className="h-2"
              indicatorClassName={
                paperLevel > 50 ? "bg-green-500" : 
                paperLevel > 20 ? "bg-yellow-500" : "bg-red-500"
              }
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">Jobs: </span>
            <span className="font-medium">{printer.job_count || 0}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">IP: </span>
            <span className="font-medium">{printer.ip_address || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterCard;
