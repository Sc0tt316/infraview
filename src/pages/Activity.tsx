
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { analyticsService } from '@/services/analytics';
import ActivityHeader from '@/components/activity/ActivityHeader';
import ActivityFilters from '@/components/activity/ActivityFilters';
import ActivityContent from '@/components/activity/ActivityContent';
import ActivityTable from '@/components/activity/ActivityTable';
import { Printer, AlertTriangle, Info, Settings } from 'lucide-react';
import { ActivityLogData } from '@/types/analytics';

const Activity = () => {
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [processedLogs, setProcessedLogs] = useState<ActivityLogData[]>([]);

  // Fetch activity logs
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['activityLogs', { sortBy, sortOrder }],
    queryFn: () => analyticsService.getActivityLogs({
      sortBy,
      sortOrder
    }),
  });

  // Process printer activities to match ActivityLogData format
  useEffect(() => {
    const fetchAndProcessActivities = async () => {
      try {
        const printerActivities = await printerService.getAllActivities();
        
        // Map printer activities to ActivityLogData format
        const mappedActivities: ActivityLogData[] = printerActivities.map((activity) => ({
          id: activity.id,
          timestamp: activity.timestamp,
          entityId: activity.printerId,
          entityType: 'printer',
          type: activity.status || 'info',
          message: activity.action,
          user: activity.user || 'system',
          action: activity.action,
          description: activity.details || '',
          userName: activity.user || 'system'
        }));
        
        setProcessedLogs(mappedActivities);
      } catch (error) {
        console.error('Error processing activities:', error);
        setProcessedLogs([]);
      }
    };
    
    fetchAndProcessActivities();
  }, []);

  // Filter and sort logs based on user selections
  const filteredLogs = React.useMemo(() => {
    if (!processedLogs?.length) return [];
    
    let filtered = [...processedLogs];
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.action.toLowerCase().includes(filterType.toLowerCase()));
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const valueA = a[sortBy as keyof ActivityLogData];
      const valueB = b[sortBy as keyof ActivityLogData];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    });
    
    return filtered;
  }, [processedLogs, searchQuery, filterType, sortBy, sortOrder]);

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    if (type.toLowerCase().includes('print')) {
      return <Printer className="h-4 w-4" />;
    } else if (type.toLowerCase().includes('error') || type.toLowerCase().includes('failed')) {
      return <AlertTriangle className="h-4 w-4" />;
    } else if (type.toLowerCase().includes('config') || type.toLowerCase().includes('change')) {
      return <Settings className="h-4 w-4" />;
    } else {
      return <Info className="h-4 w-4" />;
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <ActivityHeader onRefresh={handleRefresh} />
      
      <ActivityFilters 
        searchQuery={searchQuery}
        filterType={filterType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        onFilterChange={(value: string) => setFilterType(value)}
        onSortChange={(value: string) => setSortBy(value)}
        onSortOrderChange={(value: 'asc' | 'desc') => setSortOrder(value)}
      />
      
      <ActivityContent>
        <ActivityTable 
          logs={filteredLogs} 
          isLoading={isLoading} 
        />
      </ActivityContent>
    </div>
  );
};

export default Activity;
