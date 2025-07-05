
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Server } from 'lucide-react';
import { PrinterData } from '@/types/printers';
import { ServerData } from '@/types/servers';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrinterStatusSummaryProps {
  printers: PrinterData[];
  servers?: ServerData[];
}

const PrinterStatusSummary: React.FC<PrinterStatusSummaryProps> = ({ printers = [], servers = [] }) => {
  // Calculate printer status counts with null check
  const printerStatusCounts = {
    online: printers?.filter(p => p.status === 'online').length || 0,
    offline: printers?.filter(p => p.status === 'offline').length || 0,
    error: printers?.filter(p => p.status === 'error').length || 0,
    maintenance: printers?.filter(p => p.status === 'maintenance').length || 0,
    warning: printers?.filter(p => p.status === 'warning').length || 0,
  };

  // Calculate server status counts
  const serverStatusCounts = {
    online: servers?.filter(s => s.status === 'online').length || 0,
    offline: servers?.filter(s => s.status === 'offline').length || 0,
    error: servers?.filter(s => s.status === 'error').length || 0,
    maintenance: servers?.filter(s => s.status === 'maintenance').length || 0,
    warning: servers?.filter(s => s.status === 'warning').length || 0,
  };

  const printerTotal = printers?.length || 0;
  const serverTotal = servers?.length || 0;
  
  // Calculate percentages for progress bars
  const getPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const printerStatusItems = [
    { name: 'Online', count: printerStatusCounts.online, percentage: getPercentage(printerStatusCounts.online, printerTotal), color: 'bg-green-500' },
    { name: 'Offline', count: printerStatusCounts.offline, percentage: getPercentage(printerStatusCounts.offline, printerTotal), color: 'bg-gray-500' },
    { name: 'Error', count: printerStatusCounts.error, percentage: getPercentage(printerStatusCounts.error, printerTotal), color: 'bg-red-500' },
    { name: 'Maintenance', count: printerStatusCounts.maintenance, percentage: getPercentage(printerStatusCounts.maintenance, printerTotal), color: 'bg-blue-500' },
    { name: 'Warning', count: printerStatusCounts.warning, percentage: getPercentage(printerStatusCounts.warning, printerTotal), color: 'bg-amber-500' },
  ].filter(item => item.count > 0);

  const serverStatusItems = [
    { name: 'Online', count: serverStatusCounts.online, percentage: getPercentage(serverStatusCounts.online, serverTotal), color: 'bg-green-500' },
    { name: 'Offline', count: serverStatusCounts.offline, percentage: getPercentage(serverStatusCounts.offline, serverTotal), color: 'bg-gray-500' },
    { name: 'Error', count: serverStatusCounts.error, percentage: getPercentage(serverStatusCounts.error, serverTotal), color: 'bg-red-500' },
    { name: 'Maintenance', count: serverStatusCounts.maintenance, percentage: getPercentage(serverStatusCounts.maintenance, serverTotal), color: 'bg-blue-500' },
    { name: 'Warning', count: serverStatusCounts.warning, percentage: getPercentage(serverStatusCounts.warning, serverTotal), color: 'bg-amber-500' },
  ].filter(item => item.count > 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Printer className="h-4 w-4 mr-2" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {/* Printer Status */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Printer className="h-3 w-3 mr-1" />
                Printers
              </h4>
              {printerStatusItems.length > 0 ? (
                <div className="space-y-3">
                  {printerStatusItems.map((item) => (
                    <div key={`printer-${item.name}`} className="space-y-1">
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
                <div className="py-4 text-center text-muted-foreground text-sm">
                  No printer data available
                </div>
              )}
            </div>

            {/* Server Status */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Server className="h-3 w-3 mr-1" />
                Servers
              </h4>
              {serverStatusItems.length > 0 ? (
                <div className="space-y-3">
                  {serverStatusItems.map((item) => (
                    <div key={`server-${item.name}`} className="space-y-1">
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
                <div className="py-4 text-center text-muted-foreground text-sm">
                  No server data available
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PrinterStatusSummary;
