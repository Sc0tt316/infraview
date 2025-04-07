
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart } from '@/components/ui/chart';
import { PrintVolumeData } from '@/types/analytics';

interface PrintVolumeChartProps {
  timeRange: 'day' | 'week' | 'month' | 'year' | 'custom';
  setTimeRange: (value: 'day' | 'week' | 'month' | 'year' | 'custom') => void;
  volumeData: PrintVolumeData[] | undefined;
  isLoading: boolean;
}

const PrintVolumeChart: React.FC<PrintVolumeChartProps> = ({
  timeRange,
  setTimeRange,
  volumeData,
  isLoading
}) => {
  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader>
        <CardTitle>Print Volume Trends</CardTitle>
        <Tabs
          defaultValue="month"
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as 'day' | 'week' | 'month' | 'year' | 'custom')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
          </div>
        ) : volumeData && volumeData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ height: '320px', width: '100%' }}
          >
            <LineChart
              data={volumeData}
              categories={['volume']}
              index="date"
              colors={['#7166F9']}
              valueFormatter={(value) => `${value.toLocaleString()} pages`}
              showAnimation={true}
              className="h-full w-full"
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No data available</h3>
            <p className="text-muted-foreground mt-1 max-w-md">
              {timeRange === 'custom' 
                ? "No data available for the selected date range. Try selecting a different range." 
                : `No data available for the selected ${timeRange}. Try selecting a different time range.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrintVolumeChart;
