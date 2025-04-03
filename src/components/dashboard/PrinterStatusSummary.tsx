
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Printer, AlertTriangle, WrenchIcon, CheckCircle, XCircle } from 'lucide-react';
import { PrinterData } from '@/services/printer';

interface PrinterStatusSummaryProps {
  printers: PrinterData[];
  onViewAllPrinters: () => void;
}

const PrinterStatusSummary: React.FC<PrinterStatusSummaryProps> = ({ printers, onViewAllPrinters }) => {
  // Calculate printer status counts
  const statusCounts = {
    online: printers.filter(p => p.status === 'online').length,
    offline: printers.filter(p => p.status === 'offline').length,
    error: printers.filter(p => p.status === 'error').length,
    maintenance: printers.filter(p => p.status === 'maintenance').length,
    warning: printers.filter(p => p.status === 'warning').length,
  };

  // Calculate percentages for the progress bars
  const total = printers.length;
  const online = Math.round((statusCounts.online / total) * 100) || 0;
  const offline = Math.round((statusCounts.offline / total) * 100) || 0;
  const error = Math.round((statusCounts.error / total) * 100) || 0;
  const maintenance = Math.round((statusCounts.maintenance / total) * 100) || 0;
  const warning = Math.round((statusCounts.warning / total) * 100) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Printer className="h-4 w-4 mr-2" />
          Printer Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1.5" />
                <span>Online</span>
              </div>
              <span className="font-medium">{statusCounts.online}</span>
            </div>
            <Progress value={online} className="h-2 bg-gray-100" 
              style={{ '--progress-background': 'rgb(34 197 94)' } as React.CSSProperties} />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <div className="flex items-center">
                <XCircle className="h-3 w-3 text-gray-500 mr-1.5" />
                <span>Offline</span>
              </div>
              <span className="font-medium">{statusCounts.offline}</span>
            </div>
            <Progress value={offline} className="h-2 bg-gray-100" 
              style={{ '--progress-background': 'rgb(107 114 128)' } as React.CSSProperties} />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <div className="flex items-center">
                <AlertTriangle className="h-3 w-3 text-red-500 mr-1.5" />
                <span>Error</span>
              </div>
              <span className="font-medium">{statusCounts.error}</span>
            </div>
            <Progress value={error} className="h-2 bg-gray-100" 
              style={{ '--progress-background': 'rgb(239 68 68)' } as React.CSSProperties} />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <div className="flex items-center">
                <WrenchIcon className="h-3 w-3 text-blue-500 mr-1.5" />
                <span>Maintenance</span>
              </div>
              <span className="font-medium">{statusCounts.maintenance}</span>
            </div>
            <Progress value={maintenance} className="h-2 bg-gray-100" 
              style={{ '--progress-background': 'rgb(59 130 246)' } as React.CSSProperties} />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <div className="flex items-center">
                <AlertTriangle className="h-3 w-3 text-amber-500 mr-1.5" />
                <span>Warning</span>
              </div>
              <span className="font-medium">{statusCounts.warning}</span>
            </div>
            <Progress value={warning} className="h-2 bg-gray-100" 
              style={{ '--progress-background': 'rgb(245 158 11)' } as React.CSSProperties} />
          </div>
        </div>
        
        <button 
          onClick={onViewAllPrinters}
          className="w-full mt-4 text-sm text-primary hover:underline text-center"
        >
          View all printers
        </button>
      </CardContent>
    </Card>
  );
};

export default PrinterStatusSummary;
