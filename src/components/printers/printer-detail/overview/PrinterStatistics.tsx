
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, FileText, Clock, TrendingUp } from 'lucide-react';
import { PrinterStats } from '@/types/printers';

interface PrinterStatisticsProps {
  stats?: PrinterStats;
  jobCount?: number;
  lastActive?: string;
}

const PrinterStatistics: React.FC<PrinterStatisticsProps> = ({ stats, jobCount, lastActive }) => {
  const getStatValue = (statKey: string, fallback: number = 0) => {
    if (stats && typeof stats === 'object') {
      return (stats as any)[statKey] || fallback;
    }
    return fallback;
  };

  const formatUptime = () => {
    if (!lastActive) return 'Unknown';
    
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInHours = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days} days ago`;
  };

  const statistics = [
    {
      label: 'Total Jobs',
      value: jobCount?.toString() || '0',
      icon: FileText,
      description: 'Print jobs processed'
    },
    {
      label: 'Total Pages',
      value: getStatValue('totalPages', 0).toString(),
      icon: BarChart,
      description: 'Total pages printed'
    },
    {
      label: 'Last Active',
      value: formatUptime(),
      icon: Clock,
      description: 'Last activity time'
    },
    {
      label: 'Monthly Prints',
      value: getStatValue('monthlyPrints', 0).toString(),
      icon: TrendingUp,
      description: 'Prints this month'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterStatistics;
