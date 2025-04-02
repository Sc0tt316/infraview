
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle, ArrowUpDown, Printer, UserRound, Bell } from 'lucide-react';

interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  printer?: string;
  user?: string;
  resolved: boolean;
}

const Alerts = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [filterResolved, setFilterResolved] = useState<'all' | 'resolved' | 'unresolved'>('all');

  // Fetch alerts data
  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: analyticsService.getAlerts
  });

  // Filter and sort alerts
  const filteredAlerts = React.useMemo(() => {
    if (!alertsData) return [];

    let filtered = [...alertsData];

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchLower) || 
        alert.message.toLowerCase().includes(searchLower) ||
        (alert.printer && alert.printer.toLowerCase().includes(searchLower)) ||
        (alert.user && alert.user.toLowerCase().includes(searchLower))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filterType);
    }

    // Filter by resolved status
    if (filterResolved !== 'all') {
      filtered = filtered.filter(alert => 
        filterResolved === 'resolved' ? alert.resolved : !alert.resolved
      );
    }

    // Sort alerts
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const severityOrder = { critical: 3, warning: 2, info: 1 };
        const severityA = severityOrder[a.severity];
        const severityB = severityOrder[b.severity];
        return sortOrder === 'asc' ? severityA - severityB : severityB - severityA;
      }
    });

    return filtered;
  }, [alertsData, search, filterType, filterResolved, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alerts</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage system alerts</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                className="pl-8 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterResolved} onValueChange={(value) => setFilterResolved(value as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Bell className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No alerts found</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                {search ? "No alerts match your search criteria." : "There are no alerts to display."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-background/50"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div>
                      <Badge
                        className={
                          alert.severity === 'critical' ? 'bg-red-500 hover:bg-red-600' : 
                          alert.severity === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : 
                          'bg-blue-500 hover:bg-blue-600'
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <h3 className="text-md font-medium mt-2">{alert.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{alert.message}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {alert.printer && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Printer className="h-3 w-3 mr-1" />
                            {alert.printer}
                          </div>
                        )}
                        {alert.user && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <UserRound className="h-3 w-3 mr-1" />
                            {alert.user}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start">
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(alert.timestamp), 'PPp')}
                    </div>
                    <Badge variant={alert.resolved ? "outline" : "secondary"} className="mt-2">
                      {alert.resolved ? "Resolved" : "Unresolved"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
