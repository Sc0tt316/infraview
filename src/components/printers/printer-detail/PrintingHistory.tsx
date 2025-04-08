
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PrinterLog } from '@/types/printers';
import LoadingSpinner from './LoadingSpinner';

interface PrintingHistoryProps {
  printerId: string;
}

const PrintingHistory: React.FC<PrintingHistoryProps> = ({ printerId }) => {
  const { data: logs = [], isLoading, isError } = useQuery({
    queryKey: ['printer-logs', printerId],
    queryFn: () => printerService.getPrinterLogs(printerId),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load printing history.</div>;
  }

  if (logs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No printing history found for this printer.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Printing History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Pages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{log.message}</div>
                  {log.details && (
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {log.details}
                    </div>
                  )}
                </TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <Badge variant={log.type === 'success' ? 'default' : 'destructive'}>
                    {log.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {log.pages || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PrintingHistory;
