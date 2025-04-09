
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Search, User, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { analyticsService } from '@/services/analytics';

const Activity = () => {
  const {
    filteredLogs,
    isLoading,
    searchQuery,
    filterType,
    handleSearchChange,
    handleFilterChange,
    handleRefresh
  } = useActivityLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track user activity and system events
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="icon" className="h-10 w-10">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="login">User Login</SelectItem>
            <SelectItem value="print">Print Jobs</SelectItem>
            <SelectItem value="config">Configuration</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loader
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-64" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <Card key={log.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {log.type === "login" ? (
                        <User className="h-5 w-5 text-primary" />
                      ) : log.type === "print" ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <Clock className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{log.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.user || "System"} • {log.entityType}{" "}
                        {log.entityId && `• ${log.entityId}`}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(log.timestamp), "MMM d, h:mm a")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No activity logs found</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Try changing your search query or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
