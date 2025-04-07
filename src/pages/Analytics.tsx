
import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { analyticsService } from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';

// Import our new components
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import StatsSummaryCards from '@/components/analytics/StatsSummaryCards';
import PrintVolumeChart from '@/components/analytics/PrintVolumeChart';
import DepartmentVolumeChart from '@/components/analytics/DepartmentVolumeChart';

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
      if (timeRange === 'custom' && dateRange?.from && dateRange?.to) {
        return analyticsService.getPrintVolumeByDateRange({
          from: dateRange.from,
          to: dateRange.to || new Date()
        });
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
      <AnalyticsHeader 
        dateRange={dateRange}
        setDateRange={setDateRange}
        onDateRangeApply={handleDateRangeApply}
        onRefresh={handleRefresh}
        isLoading={isAnalyticsLoading || isVolumeLoading}
      />
      
      <StatsSummaryCards analyticsData={analyticsData} />
      
      <PrintVolumeChart 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        volumeData={volumeData}
        isLoading={isVolumeLoading}
      />
      
      <DepartmentVolumeChart 
        departmentData={analyticsData?.departmentVolume}
        isLoading={isAnalyticsLoading}
      />
    </div>
  );
};

export default Analytics;
