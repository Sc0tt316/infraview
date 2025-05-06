
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer } from 'lucide-react';
import { PrinterData } from '@/types/printers';
import { BarChart } from '@/components/ui/chart';

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

  // Format data for the bar chart
  const chartData = [
    { status: 'Online', count: statusCounts.online },
    { status: 'Offline', count: statusCounts.offline },
    { status: 'Error', count: statusCounts.error },
    { status: 'Maintenance', count: statusCounts.maintenance },
    { status: 'Warning', count: statusCounts.warning },
  ].filter(item => item.count > 0);

  // Define chart colors based on status
  const chartColors = [
    '#22c55e', // green for online
    '#6b7280', // gray for offline
    '#ef4444', // red for error
    '#3b82f6', // blue for maintenance
    '#f59e0b', // amber for warning
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Printer className="h-4 w-4 mr-2" />
          Printer Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[240px] mt-4">
            <BarChart
              data={chartData}
              categories={['count']}
              index="status"
              colors={chartColors}
              valueFormatter={(value) => `${value} printers`}
              showAnimation={true}
              className="h-full w-full"
            />
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
