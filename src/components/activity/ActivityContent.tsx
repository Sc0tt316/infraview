
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ActivityFilters from './ActivityFilters';
import ActivityTable from './ActivityTable';
import { ActivityLogData } from '@/types/analytics';

interface ActivityContentProps {
  logs: ActivityLogData[];
  isLoading: boolean;
  searchQuery: string;
  filterType: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  children?: ReactNode;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  logs,
  isLoading,
  searchQuery,
  filterType,
  sortBy,
  sortOrder,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onSortOrderChange,
  children
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Activity History</CardTitle>
          <ActivityFilters
            searchQuery={searchQuery}
            filterType={filterType}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={onSearchChange}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            onSortOrderChange={onSortOrderChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {children || <ActivityTable logs={logs} isLoading={isLoading} />}
      </CardContent>
    </Card>
  );
};

export default ActivityContent;
