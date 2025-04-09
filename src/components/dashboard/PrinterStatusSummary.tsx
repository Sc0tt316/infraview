
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, WrenchIcon, CheckCircle, XCircle, Printer } from 'lucide-react';
import { PrinterData } from '@/types/printers';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PrinterStatusSummaryProps {
  printers: PrinterData[];
}

const PrinterStatusSummary: React.FC<PrinterStatusSummaryProps> = ({ printers }) => {
  // Calculate printer status counts
  const statusCounts = {
    online: printers.filter(p => p.status === 'online').length,
    offline: printers.filter(p => p.status === 'offline').length,
    error: printers.filter(p => p.status === 'error').length,
    maintenance: printers.filter(p => p.status === 'maintenance').length,
    warning: printers.filter(p => p.status === 'warning').length,
  };

  const chartData = [
    { name: 'Online', value: statusCounts.online, color: '#22c55e' }, // green
    { name: 'Offline', value: statusCounts.offline, color: '#6b7280' }, // gray
    { name: 'Error', value: statusCounts.error, color: '#ef4444' }, // red
    { name: 'Maintenance', value: statusCounts.maintenance, color: '#3b82f6' }, // blue
    { name: 'Warning', value: statusCounts.warning, color: '#f59e0b' }, // amber
  ].filter(item => item.value > 0);

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
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} printers`, name]}
                  labelFormatter={() => 'Status'}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
