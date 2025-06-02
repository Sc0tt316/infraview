
import React from 'react';
import PrinterInfo from './overview/PrinterInfo';
import StatusLevels from './overview/StatusLevels';
import SupplyLevels from './overview/SupplyLevels';
import PrinterStatistics from './overview/PrinterStatistics';
import { PrinterData } from '@/types/printers';

interface PrinterOverviewProps {
  printer: PrinterData;
  isAdmin: boolean;
  isRestarting?: boolean;
  onRestartPrinter?: () => void;
}

const PrinterOverview: React.FC<PrinterOverviewProps> = ({ printer }) => {
  return (
    <div className="space-y-4 w-full">
      {/* Compact Printer Information */}
      <div className="bg-card border rounded-lg p-4">
        <PrinterInfo printer={printer} />
      </div>
      
      {/* Supply Levels and Statistics in compact layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Supply and Status Levels */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="text-base font-medium mb-3">Supply Levels</h3>
          <div className="space-y-4">
            <StatusLevels
              inkLevel={printer.inkLevel}
              paperLevel={printer.paperLevel}
              supplies={printer.supplies}
              status={printer.status}
              subStatus={printer.subStatus} 
            />
            <SupplyLevels supplies={printer.supplies} />
          </div>
        </div>
        
        {/* Statistics */}
        <div className="bg-card border rounded-lg p-4">
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
