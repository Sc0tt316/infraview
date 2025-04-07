
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import { DateRange } from 'react-day-picker';

interface AnalyticsHeaderProps {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onDateRangeApply: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  dateRange,
  setDateRange,
  onDateRangeApply,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Monitor your printer usage and performance</p>
      </div>
      
      <div className="flex items-center gap-3">
        <DateRangePicker 
          dateRange={dateRange} 
          setDateRange={setDateRange}
          onApply={onDateRangeApply}
        />
        
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10"
          disabled={isLoading}
          onClick={onRefresh}
        >
          <RefreshCw className={isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
