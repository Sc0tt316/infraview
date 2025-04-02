import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { analyticsService } from '@/services/analyticsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import { BarChart, LineChart } from '@/components/ui/chart';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const { toast } = useToast();
  
  // Fetch analytics data
  const { data: analyticsData, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalyticsData
  });
  
  // Fetch print volume data based on time range
  const { data: volumeData, isLoading: isVolumeLoading, refetch: refetchVolume } = useQuery({
    queryKey: ['printVolume', timeRange, dateRange],
    queryFn: async () => {
      if (timeRange === 'custom' && dateRange?.from) {
        return analyticsService.getPrintVolumeByDateRange(dateRange);
      }
      
      if (timeRange !== 'custom') {
        return analyticsService.getPrintVolumeByTimeRange(timeRange);
      }
      
      return [];
    }
  });
  
  // Handle data refresh
  const handleRefresh = () => {
    refetchAnalytics();
    refetchVolume();
    toast({
      title: "Data refreshed",
      description: "Analytics data has been updated.",
    });
  };
  
  // Handle date range apply
  const handleDateRangeApply = () => {
    setTimeRange('custom');
    refetchVolume();
  };

  // Switch to 'custom' tab when dateRange changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setTimeRange('custom');
    }
  }, [dateRange]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Monitor your printer usage and performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <DateRangePicker 
            dateRange={dateRange} 
            setDateRange={setDateRange}
            onApply={handleDateRangeApply}
          />
          
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10"
            disabled={isAnalyticsLoading || isVolumeLoading}
            onClick={handleRefresh}
          >
            <RefreshCw className={isAnalyticsLoading || isVolumeLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analyticsData && Object.entries(analyticsData.summary).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {key === 'totalPrinters' ? 'Total Printers' : 
                  key === 'activePrinters' ? 'Active Printers' : 
                  key === 'totalVolume' ? 'Total Print Volume' : 
                  key === 'activeJobs' ? 'Active Print Jobs' : 
                  key === 'completedJobs' ? 'Completed Jobs (30d)' : 
                  key === 'failedJobs' ? 'Failed Jobs (30d)' : 
                  key === 'totalUsers' ? 'Total Users' : key}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof value === 'number' && (key.includes('Volume') || key.includes('Jobs')) 
                  ? value.toLocaleString() 
                  : value.toString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Print Volume Trends</CardTitle>
          <Tabs
            defaultValue="month"
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as 'day' | 'week' | 'month' | 'year' | 'custom')}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isVolumeLoading ? (
            <div className="flex items-center justify-center h-80">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : volumeData && volumeData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-80"
            >
              <LineChart
                data={volumeData}
                categories={['volume']}
                index="date"
                colors={['#7166F9']}
                valueFormatter={(value) => `${value.toLocaleString()} pages`}
                showAnimation={true}
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
      
      <Card>
        <CardHeader>
          <CardTitle>Print Volume by Department</CardTitle>
        </CardHeader>
        <CardContent>
          {isAnalyticsLoading ? (
            <div className="flex items-center justify-center h-80">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : analyticsData && analyticsData.departmentVolume && analyticsData.departmentVolume.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-80"
            >
              <BarChart
                data={analyticsData.departmentVolume}
                categories={['volume']}
                index="department"
                colors={['#7166F9']}
                valueFormatter={(value) => `${value.toLocaleString()} pages`}
                showAnimation={true}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No department data available</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                There is no print volume data by department available at this time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
