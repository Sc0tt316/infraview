
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { analyticsService } from '@/services/analytics';
import { printerService } from '@/services/printerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Search } from 'lucide-react';
import { ActivityLogData } from '@/types/analytics';

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Updated function to handle getActivityLogs parameters
  const getActivityLogsWithParams = async () => {
    return await analyticsService.getActivityLogs({
      limit: 100, 
      sortBy, 
      sortOrder
    });
  };

  const { data: activityLogs, isLoading, refetch } = useQuery({
    queryKey: ['activityLogs', sortBy, sortOrder],
    queryFn: getActivityLogsWithParams 
  });

  const filteredLogs = React.useMemo(() => {
    if (!activityLogs) return [];

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
      filtered = filtered.filter(log => log.type === filterType);
    }

    return filtered;
  }, [activityLogs, searchQuery, filterType]);

  const handleRefresh = () => {
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activity Log</h1>
          <p className="text-muted-foreground">View recent printer system activities</p>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Activity History</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8 w-full sm:w-[200px] md:w-[250px]"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Select value={filterType} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Date & Time</SelectItem>
                  <SelectItem value="entityType">Entity Type</SelectItem>
                  <SelectItem value="type">Status</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, index) => (
                    <TableRow key={log.id || index}>
                      <TableCell className="font-medium">
                        {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell>{log.action || log.message || log.entityType}</TableCell>
                      <TableCell>
                        {log.entityId ? (
                          <Badge variant="outline" className="whitespace-nowrap">
                            {log.entityType} #{log.entityId}
                          </Badge>
                        ) : log.entityType}
                      </TableCell>
                      <TableCell>{log.user || 'System'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.type === 'success' ? 'outline' : 
                            log.type === 'error' ? 'destructive' : 
                            log.type === 'warning' ? 'secondary' : 
                            'default'
                          }
                        >
                          {log.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No activity logs found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
