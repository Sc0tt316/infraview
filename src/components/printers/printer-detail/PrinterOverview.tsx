
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
}

const PrinterOverview: React.FC<PrinterOverviewProps> = ({ printer, isAdmin }) => {
  const hasIpAddress = !!printer.ipAddress;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <PrinterInfo printer={printer} />
            <Separator className="my-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <StatusLevels
                inkLevel={printer.inkLevel}
                paperLevel={printer.paperLevel}
                status={printer.status}
              />
              <SupplyLevels supplies={printer.supplies} />
            </div>
          </CardContent>
        </Card>
        
        <PrinterStatistics 
          printer={printer} 
        />
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <PrinterActions 
              printerId={printer.id}
              hasIpAddress={hasIpAddress}
              isAdmin={isAdmin}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrinterOverview;
