
import React from 'react';
import PrinterInfo from './overview/PrinterInfo';
import StatusLevels from './overview/StatusLevels';
import SupplyLevels from './overview/SupplyLevels';
import PrinterStatistics from './overview/PrinterStatistics';
import { PrinterData } from '@/types/printers';
import { Card, CardContent } from '@/components/ui/card';

interface PrinterOverviewProps {
  printer: PrinterData;
  isAdmin: boolean;
  isRestarting?: boolean;
  onRestartPrinter?: () => void;
}

const PrinterOverview: React.FC<PrinterOverviewProps> = ({ printer }) => {
  return (
    <div className="space-y-6 w-full">
      {/* Printer Information Card - Full width horizontal layout */}
      <Card className="w-full">
        <CardContent className="p-4">
          <PrinterInfo printer={printer} />
        </CardContent>
      </Card>
      
      {/* Supply Levels and Statistics in horizontal layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Supply and Status Levels */}
        <Card className="w-full min-h-[300px]">
          <CardContent className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">Supply Levels</h3>
            <div className="flex-1 space-y-6">
              <StatusLevels
                inkLevel={printer.inkLevel}
                paperLevel={printer.paperLevel}
                supplies={printer.supplies}
                status={printer.status}
                subStatus={printer.subStatus} 
              />
              <SupplyLevels supplies={printer.supplies} />
            </div>
          </CardContent>
        </Card>
        
        {/* Statistics */}
        <div className="w-full min-h-[300px]">
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
