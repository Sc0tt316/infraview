
import React from 'react';
import PrinterInfo from './overview/PrinterInfo';
import StatusLevels from './overview/StatusLevels';
import SupplyLevels from './overview/SupplyLevels';
import PrinterStatistics from './overview/PrinterStatistics';
import PrinterActions from './overview/PrinterActions';
import { PrinterData } from '@/types/printers';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PrinterOverviewProps {
  printer: PrinterData;
  isAdmin: boolean;
  isRestarting?: boolean;
  onRestartPrinter?: () => void;
}

const PrinterOverview: React.FC<PrinterOverviewProps> = ({ printer, isAdmin, isRestarting = false, onRestartPrinter }) => {
  const hasIpAddress = !!printer.ipAddress;
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
      <div className="xl:col-span-3 space-y-6">
        <Card className="h-full">
          <CardContent className="p-6 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Printer Info - with scroll area */}
              <div className="h-full min-h-[400px]">
                <PrinterInfo printer={printer} />
              </div>
              
              {/* Status and Supply Levels */}
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
      
      <div className="xl:col-span-1 space-y-6">
        <Card>
          <CardContent className="p-0">
            <PrinterActions 
              printerId={printer.id}
              hasIpAddress={hasIpAddress}
              isAdmin={isAdmin}
              onRestartClick={onRestartPrinter}
              isRestarting={isRestarting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrinterOverview;
