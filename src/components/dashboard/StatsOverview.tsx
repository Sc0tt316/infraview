
import React from 'react';
import { Server, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { PrinterData } from '@/types/printers';
import { ServerData } from '@/types/servers';

interface StatsOverviewProps {
  printers: PrinterData[];
  servers: ServerData[];
  activeAlerts: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ printers, servers, activeAlerts }) => {
  const totalPrinters = printers.length;
  const onlinePrinters = printers.filter(p => p.status === 'online').length;
  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.status === 'online').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Servers"
        value={totalServers}
        icon={Server}
      />
      <StatsCard
        title="Online Servers"
        value={onlineServers}
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
