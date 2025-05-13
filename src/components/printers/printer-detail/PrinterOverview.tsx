
import React from 'react';
import { PrinterData } from '@/types/printers';
import PrinterInfo from './overview/PrinterInfo';
import SupplyLevels from './overview/SupplyLevels';
import StatusLevels from './overview/StatusLevels';
import PrinterStatistics from './overview/PrinterStatistics';
import RestartButton from './overview/RestartButton';

interface PrinterOverviewProps {
  printer: PrinterData;
  isRestarting: boolean;
  onRestartPrinter: () => void;
  isAdmin: boolean;
}

const PrinterOverview: React.FC<PrinterOverviewProps> = ({
  printer,
  isRestarting,
  onRestartPrinter,
  isAdmin
}) => {
  return (
    <div className="space-y-6 dark:bg-transparent">
      {/* Printer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <PrinterInfo printer={printer} />

          <div>
            <h3 className="text-lg font-medium mb-2">Supplies</h3>
            <SupplyLevels supplies={printer.supplies} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Status & Levels</h3>
            <StatusLevels 
              inkLevel={printer.inkLevel}
              paperLevel={printer.paperLevel}
            />
          </div>

          <PrinterStatistics 
            stats={printer.stats} 
            jobCount={printer.jobCount}
            lastActive={printer.lastActive}
          />

          {isAdmin && (
            <RestartButton 
              isRestarting={isRestarting} 
              disabled={printer.status === 'maintenance'} 
              onClick={onRestartPrinter} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrinterOverview;
