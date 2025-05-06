
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer } from 'lucide-react';
import { PrinterData } from '@/types/printers';
import { Progress } from '@/components/ui/progress';

interface PrinterStatusSummaryProps {
  printers: PrinterData[];
}

const PrinterStatusSummary: React.FC<PrinterStatusSummaryProps> = ({ printers = [] }) => {
  // Calculate printer status counts with null check
  const statusCounts = {
    online: printers?.filter(p => p.status === 'online').length || 0,
    offline: printers?.filter(p => p.status === 'offline').length || 0,
    error: printers?.filter(p => p.status === 'error').length || 0,
    maintenance: printers?.filter(p => p.status === 'maintenance').length || 0,
    warning: printers?.filter(p => p.status === 'warning').length || 0,
  };

  const total = printers?.length || 0;
  
  // Calculate percentages for progress bars
  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const statusItems = [
    { name: 'Online', count: statusCounts.online, percentage: getPercentage(statusCounts.online), color: 'bg-green-500' },
    { name: 'Offline', count: statusCounts.offline, percentage: getPercentage(statusCounts.offline), color: 'bg-gray-500' },
    { name: 'Error', count: statusCounts.error, percentage: getPercentage(statusCounts.error), color: 'bg-red-500' },
    { name: 'Maintenance', count: statusCounts.maintenance, percentage: getPercentage(statusCounts.maintenance), color: 'bg-blue-500' },
    { name: 'Warning', count: statusCounts.warning, percentage: getPercentage(statusCounts.warning), color: 'bg-amber-500' },
  ].filter(item => item.count > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Printer className="h-4 w-4 mr-2" />
          Printer Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {statusItems.length > 0 ? (
          <div className="space-y-4">
            {statusItems.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.count}</span>
                </div>
                <Progress 
                  value={item.percentage} 
                  className="h-2" 
                  indicatorClassName={item.color}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No printer data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrinterStatusSummary;
