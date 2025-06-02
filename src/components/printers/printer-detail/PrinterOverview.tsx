
import React from 'react';
import PrinterInfo from './overview/PrinterInfo';
import StatusLevels from './overview/StatusLevels';
import SupplyLevels from './overview/SupplyLevels';
import PrinterStatistics from './overview/PrinterStatistics';
import { PrinterData } from '@/types/printers';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PrinterOverviewProps {
  printer: PrinterData;
  isAdmin: boolean;
  isRestarting?: boolean;
  onRestartPrinter?: () => void;
}

const PrinterOverview: React.FC<PrinterOverviewProps> = ({ printer }) => {
  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Printer Information Card */}
      <Card className="w-full">
        <CardContent className="p-4 sm:p-6">
          <PrinterInfo printer={printer} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply and Status Levels */}
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 space-y-6">
            <StatusLevels
              inkLevel={printer.inkLevel}
              paperLevel={printer.paperLevel}
              supplies={printer.supplies}
              status={printer.status}
              subStatus={printer.subStatus} 
            />
            <Separator />
            <SupplyLevels supplies={printer.supplies} />
          </CardContent>
        </Card>
        
        {/* Statistics */}
        <div className="w-full">
          <PrinterStatistics 
            stats={printer.stats}
            jobCount={printer.jobCount}
            lastActive={printer.lastActive} 
          />
        </div>
      </div>
    </div>
  );
};

export default PrinterOverview;
