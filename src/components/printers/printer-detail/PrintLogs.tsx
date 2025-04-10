
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, X, FileClock, FileText, FileText as FileIcon } from 'lucide-react';
import { PrintLog } from '@/types/printers';

interface PrintLogsProps {
  logs: PrintLog[] | undefined;
}

const PrintLogs: React.FC<PrintLogsProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileIcon className="h-12 w-12 mx-auto text-slate-500 mb-3" />
        <h3 className="text-lg font-medium text-slate-300">No print logs available</h3>
        <p className="text-slate-500 mt-1">
          There are no print logs for this printer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log, index) => (
        <div key={log.id || index} className="flex items-center border-b border-slate-800 pb-3 last:border-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            log.status === 'completed' ? 'bg-green-700/20 text-green-400' : 'bg-red-700/20 text-red-400'
          }`}>
            {log.status === 'completed' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </div>
          
          <div className="ml-4 flex-grow min-w-0">
            <div className="flex justify-between">
              <span className="font-medium text-sm text-slate-200 truncate">{log.fileName || 'Unknown File'}</span>
              <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">
                {log.timestamp ? format(new Date(log.timestamp), 'MMM d, h:mm a') : 'Unknown time'}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center text-xs text-slate-400">
                <span className="flex items-center mr-3">
                  <FileClock className="h-3 w-3 mr-1" />
                  {log.pages} {log.pages === 1 ? 'page' : 'pages'}
                </span>
                <span className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {log.size || 'Unknown size'}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-slate-500">By: </span>
                <span className="text-slate-300">{log.user || 'Unknown user'}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintLogs;
