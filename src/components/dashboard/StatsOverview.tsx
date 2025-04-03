
import React from 'react';
import { Printer, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { PrinterData } from '@/types/printers';

interface StatsOverviewProps {
  printers: PrinterData[];
  activeAlerts: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ printers, activeAlerts }) => {
  const totalPrinters = printers.length;
  const onlinePrinters = printers.filter(p => p.status === 'online').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Printers"
        value={totalPrinters}
        icon={Printer}
      />
      <StatsCard
        title="Online Printers"
        value={onlinePrinters}
        icon={CheckCircle}
      />
      <StatsCard
        title="Print Jobs Today"
        value={178}
        icon={FileText}
        description="Completed and pending"
      />
      <StatsCard
        title="Active Alerts"
        value={activeAlerts}
        icon={AlertTriangle}
        trend={activeAlerts > 1 ? { value: 12, isPositive: false } : undefined}
      />
    </div>
  );
};

export default StatsOverview;
