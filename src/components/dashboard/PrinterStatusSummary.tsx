
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, WrenchIcon, CheckCircle, XCircle, Printer } from 'lucide-react';
import { PrinterData } from '@/types/printers';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';

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

  // Format data for bar chart
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
          <div className="h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [`${value} printers`, 'Count']}
                  labelFormatter={(label) => `Status: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="value" name="Printers" isAnimationActive={true}>
                  {chartData.map((entry, index) => (
                    <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
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
