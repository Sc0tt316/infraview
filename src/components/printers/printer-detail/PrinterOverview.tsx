
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      <div className="xl:col-span-2 space-y-6">
        <Card className="h-full">
          <CardContent className="p-6 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Printer Info */}
              <div className="h-full min-h-[400px]">
                <PrinterInfo printer={printer} />
              </div>
              
              {/* Supply Levels */}
              <div className="space-y-6">
                <StatusLevels
                  inkLevel={printer.inkLevel}
                  paperLevel={printer.paperLevel}
                  supplies={printer.supplies}
                  status={printer.status}
                  subStatus={printer.subStatus} 
                />
                <Separator />
                <SupplyLevels supplies={printer.supplies} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <PrinterStatistics 
          stats={printer.stats}
          jobCount={printer.jobCount}
          lastActive={printer.lastActive} 
        />
      </div>
    </div>
  );
};

export default PrinterOverview;
