import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AlertTriangle, Check, Filter, RefreshCw, Search, X } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertData } from '@/types/analytics';

const Alerts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');
  const [filterLevel, setFilterLevel] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);

  const getAlertsWithParams = async () => {
    return await analyticsService.getAlerts({
      status: filterStatus, 
      level: filterLevel
    });
  };

  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ['alerts', filterStatus, filterLevel],
    queryFn: getAlertsWithParams
  });

  const resolveAlertMutation = useMutation({
    mutationFn: (alertId: string) => analyticsService.resolveAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast({ title: "Alert resolved", description: "The alert has been marked as resolved." });
      setShowResolveDialog(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
      });
      console.error("Error resolving alert:", error);
    }
  });

  const filteredAlerts = React.useMemo(() => {
    if (!alerts) return [];

    let filtered = [...alerts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(query) || 
        (alert.message && alert.message.toLowerCase().includes(query)) ||
        (alert.printer && alert.printer.name.toLowerCase().includes(query)) ||
        (alert.user && alert.user.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [alerts, searchQuery]);

  const handleRefresh = () => {
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (value: 'all' | 'active' | 'resolved') => {
    setFilterStatus(value);
  };

  const handleLevelFilterChange = (value: 'all' | 'critical' | 'warning' | 'info') => {
    setFilterLevel(value);
  };

  const handleResolveClick = (alert: AlertData) => {
    setSelectedAlert(alert);
    setShowResolveDialog(true);
  };

  const handleResolveConfirm = () => {
    if (selectedAlert) {
      resolveAlertMutation.mutate(selectedAlert.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alerts</h1>
          <p className="text-muted-foreground">Manage system alerts and warnings</p>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Alert History</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search alerts..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterLevel} onValueChange={handleLevelFilterChange}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
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
          ) : filteredAlerts.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Alert</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        {format(new Date(alert.timestamp), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{alert.title}</div>
                        {alert.message && (
                          <div className="text-sm text-muted-foreground">{alert.message}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alert.level === 'critical' ? 'destructive' : 
                            alert.level === 'warning' ? 'secondary' : 
                            'default'
                          }
                        >
                          {alert.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={alert.status === 'active' ? 'outline' : 'secondary'}
                          className={alert.status === 'active' ? 'border-red-500 text-red-500' : ''}
                        >
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {alert.printer && (
                            <div className="text-sm">
                              Printer: <span className="font-medium">{alert.printer.name}</span> (ID: {alert.printer.id})
                            </div>
                          )}
                          {alert.user && (
                            <div className="text-sm">
                              User: <span className="font-medium">{alert.user.name}</span> (ID: {alert.user.id})
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {alert.status === 'active' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleResolveClick(alert)}
                            className="h-8 gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Resolve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No alerts found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this alert as resolved? This will remove it from the active alerts list.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedAlert && (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Alert:</span> {selectedAlert.title}
                </div>
                <div>
                  <span className="font-medium">Level:</span>{' '}
                  <Badge
                    variant={
                      selectedAlert.level === 'critical' ? 'destructive' : 
                      selectedAlert.level === 'warning' ? 'secondary' : 
                      'default'
                    }
                  >
                    {selectedAlert.level}
                  </Badge>
                </div>
                {selectedAlert.message && (
                  <div>
                    <span className="font-medium">Message:</span> {selectedAlert.message}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>Cancel</Button>
            <Button onClick={handleResolveConfirm}>Resolve Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Alerts;
