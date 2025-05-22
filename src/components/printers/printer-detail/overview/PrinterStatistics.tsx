
import React from 'react';
import { PrinterData } from '@/types/printers';

interface PrinterStatisticsProps {
  stats?: PrinterData['stats'];
  jobCount?: number;
  lastActive?: string;
}

const PrinterStatistics: React.FC<PrinterStatisticsProps> = ({ stats, jobCount, lastActive }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Statistics</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-muted-foreground">Total Pages:</div>
        <div>{stats?.totalPages?.toLocaleString() || stats?.totalPrints?.toLocaleString() || 'N/A'}</div>

        <div className="text-muted-foreground">Monthly Pages:</div>
        <div>{stats?.monthlyPages?.toLocaleString() || stats?.monthlyPrints?.toLocaleString() || 'N/A'}</div>
        
        <div className="text-muted-foreground">Weekly Pages:</div>
        <div>{stats?.weeklyPrints?.toLocaleString() || 'N/A'}</div>

        <div className="text-muted-foreground">Daily Pages:</div>
        <div>{stats?.dailyPrints?.toLocaleString() || 'N/A'}</div>

        <div className="text-muted-foreground">Paper Jams:</div>
        <div>{stats?.jams || 0} incidents</div>

        <div className="text-muted-foreground">Job Count:</div>
        <div>{jobCount?.toLocaleString() || stats?.totalPrints?.toLocaleString() || 0} jobs</div>

        <div className="text-muted-foreground">Last Active:</div>
        <div>{lastActive || 'Unknown'}</div>
      </div>
    </div>
  );
};

export default PrinterStatistics;
