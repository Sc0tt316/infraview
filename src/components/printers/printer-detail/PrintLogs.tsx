
import React from 'react';
import { PrintLog } from '@/types/printers';
import { format } from 'date-fns';

interface PrintLogsProps {
  logs: PrintLog[];
}

const PrintLogs: React.FC<PrintLogsProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No print logs available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Print History</h3>
      
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">File Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pages</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id || `${log.timestamp}-${log.fileName}`}>
                <td className="px-4 py-3 text-sm">{log.fileName}</td>
                <td className="px-4 py-3 text-sm">{log.user}</td>
                <td className="px-4 py-3 text-sm">{log.pages}</td>
                <td className="px-4 py-3 text-sm">{format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                    ${log.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : log.status === 'failed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintLogs;
