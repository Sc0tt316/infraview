
import React, { useState } from 'react';
import { PrinterData } from '@/types/printers';
import { Card } from '@/components/ui/card';
import TabsNavigation from '@/components/printers/printer-detail/TabsNavigation';
import PrinterOverview from '@/components/printers/printer-detail/PrinterOverview';
import PrintLogs from '@/components/printers/printer-detail/PrintLogs';
import { useAuth } from '@/context/AuthContext';

interface PrinterDetailContentProps {
  printer: PrinterData;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PrinterDetailContent: React.FC<PrinterDetailContentProps> = ({ printer, activeTab, onTabChange }) => {
  const [isRestarting, setIsRestarting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const handleRestartPrinter = () => {
    setIsRestarting(true);
    // Simulate printer restart
    setTimeout(() => {
      setIsRestarting(false);
    }, 2000);
  };

  return (
    <Card>
      <TabsNavigation activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="p-6">
        {activeTab === 'overview' && (
          <PrinterOverview 
            printer={printer} 
            isRestarting={isRestarting}
            onRestartPrinter={handleRestartPrinter}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'logs' && (
          <PrintLogs 
            logs={printer.logs || []}
          />
        )}
      </div>
    </Card>
  );
};

export default PrinterDetailContent;
