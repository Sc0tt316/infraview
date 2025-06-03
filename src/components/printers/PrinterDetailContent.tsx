
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
  onEdit?: () => void;
  onDelete?: () => void;
}

const PrinterDetailContent: React.FC<PrinterDetailContentProps> = ({ 
  printer, 
  activeTab, 
  onTabChange,
  onEdit,
  onDelete
}) => {
  const [isRestarting, setIsRestarting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const handleRestartPrinter = () => {
    setIsRestarting(true);
    setTimeout(() => {
      setIsRestarting(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-full">
      <Card className="w-full">
        {/* Tabs Navigation */}
        <div className="border-b bg-muted/30">
          <div className="p-3">
            <TabsNavigation activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-4">
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
    </div>
  );
};

export default PrinterDetailContent;
