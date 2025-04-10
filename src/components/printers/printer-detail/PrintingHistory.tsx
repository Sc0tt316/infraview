
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { FileText, User } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface PrintingHistoryProps {
  printerId: string;
}

const PrintingHistory: React.FC<PrintingHistoryProps> = ({ printerId }) => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['printLogs', printerId],
    queryFn: () => printerService.getPrinterLogs(printerId),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading print history..." />;
  }

  if (!logs || logs.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed border-2">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
        <h3 className="text-lg font-medium mb-1">No printing history</h3>
        <p className="text-muted-foreground text-sm">
          This printer has no print jobs recorded yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Print Jobs</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={log.id || index}>
              <TableCell className="font-mono text-xs">
                {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell>{log.fileName || 'Document'}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  {log.user || 'Unknown'}
                </div>
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  log.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {log.status === 'failed' ? 'Failed' : 'Success'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrintingHistory;
