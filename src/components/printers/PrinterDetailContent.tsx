
import React from 'react';
import { PrinterData } from '@/types/printers';
import { Card } from '@/components/ui/card';
import TabsNavigation from '@/components/printers/printer-detail/TabsNavigation';
import PrinterOverview from '@/components/printers/printer-detail/PrinterOverview';
import PrintLogs from '@/components/printers/printer-detail/PrintLogs';
import ActivityList from '@/components/printers/printer-detail/ActivityList';

interface PrinterDetailContentProps {
  printer: PrinterData;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PrinterDetailContent: React.FC<PrinterDetailContentProps> = ({ printer, activeTab, onTabChange }) => {
  return (
    <Card>
      <TabsNavigation activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="p-6">
        {activeTab === 'overview' && <PrinterOverview printer={printer} />}
        {activeTab === 'logs' && <PrintLogs printerId={printer.id} />}
        {activeTab === 'activity' && <ActivityList printerId={printer.id} />}
      </div>
    </Card>
  );
};

export default PrinterDetailContent;
