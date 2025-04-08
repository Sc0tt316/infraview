
import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { ActivityLogData } from '@/types/analytics';

export const useActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Create a memoized query function to prevent unnecessary rerenders
  const getActivityLogsWithParams = useCallback(async () => {
    return await analyticsService.getActivityLogs({
      limit: 100, // Get more logs for the activity page
      sortBy,
      sortOrder
    });
  }, [sortBy, sortOrder]);

  // Fetch activity logs with improved caching
  const { 
    data: activityLogs = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['activityLogs', sortBy, sortOrder],
    queryFn: getActivityLogsWithParams,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Filter logs with memoization to prevent unnecessary calculations
  const filteredLogs = useMemo(() => {
    if (!activityLogs?.length) return [];

    let filtered = [...activityLogs];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.entityId?.toLowerCase().includes(query) || 
        log.entityType?.toLowerCase().includes(query) || 
        (log.user && log.user.toLowerCase().includes(query)) ||
        log.message?.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(log => {
        if (filterType === 'login') {
          return log.action?.toLowerCase().includes('login') || 
                 log.message?.toLowerCase().includes('login') || 
                 log.type === 'login';
        } else if (filterType === 'print') {
          return log.action?.toLowerCase().includes('print') || 
                 log.message?.toLowerCase().includes('print') || 
                 log.type === 'print';
        } else if (filterType === 'config') {
          return log.action?.toLowerCase().includes('config') || 
                 log.message?.toLowerCase().includes('config');
        } else if (filterType === 'error') {
          return log.type === 'error';
        }
        return true;
      });
    }

    return filtered;
  }, [activityLogs, searchQuery, filterType]);

  // Event handlers with useCallback to prevent unnecessary rerenders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilterType(value);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  const handleSortOrderChange = useCallback((value: 'asc' | 'desc') => {
    setSortOrder(value);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    filteredLogs,
    isLoading,
    searchQuery,
    filterType,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleSortOrderChange,
    handleRefresh
  };
};
