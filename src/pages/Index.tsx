
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import {
  Users, 
  Printer, 
  Clock, 
  Calendar, 
  BarChart3, 
  ArrowUpRight, 
  Check, 
  X, 
  AlertTriangle,
  Bell,
  RefreshCw,
  Wrench,
  FileWarning,
  CheckCircle,
  Info
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { printerService } from '@/services/printerService';
import { userService } from '@/services/userService';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, LineChart } from "@/components/ui/chart";
import { AnalyticsData, ActivityLogData, AlertData, DepartmentVolume } from '@/types/analytics';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Fetch printers
  const { 
    data: printersData, 
    isLoading: isPrintersLoading,
    refetch: refetchPrinters
  } = useQuery({
    queryKey: ['printers'],
    queryFn: () => printerService.getAllPrinters(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch users
  const { 
    data: usersData, 
    isLoading: isUsersLoading,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch recent jobs
  const { 
    data: jobsData, 
    isLoading: isJobsLoading,
    refetch: refetchJobs
  } = useQuery({
    queryKey: ['recentJobs'],
    queryFn: () => analyticsService.getActivityLogs({ limit: 5 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch alerts
  const { data: alerts, isLoading: isAlertsLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => analyticsService.getAlerts({ limit: 5 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch dashboard data
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading,
    refetch: refetchDashboard
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => analyticsService.getAnalyticsData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Create department volume data for charts
  const departmentVolumeData = dashboardData?.summary?.departmentVolume || [];
  
  // Updated handleRefresh function to include all refetches
  const handleRefresh = () => {
    refetchDashboard();
    refetchPrinters();
    refetchUsers();
    refetchJobs();
    
    toast({
      title: "Dashboard Refreshed",
      description: "All dashboard data has been updated.",
    });
  };
  
  // Render the dashboard
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your printer management system</p>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
        </Button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Printers</CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.summary?.totalPrinters || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {printersData && printersData.filter(p => p.status === 'online').length} online
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.summary?.totalUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {usersData && usersData.filter(u => u.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Print Volume (30d)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departmentVolumeData.reduce((sum, item) => sum + item.volume, 0).toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              pages printed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts?.filter(alert => alert.status === 'active').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {alerts?.filter(alert => alert.level === 'critical' && alert.status === 'active').length || 0} critical
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Print Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isDashboardLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : departmentVolumeData && departmentVolumeData.length > 0 ? (
              <div className="h-[300px]">
                <BarChart
                  data={departmentVolumeData}
                  categories={['volume']}
                  index="department"
                  valueFormatter={(value) => `${value.toLocaleString()} pages`}
                  colors={['blue']}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <FileWarning className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No data available</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There's no print volume data to display at this time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Printer Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isPrintersLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : dashboardData?.printerStatus ? (
              <div className="h-[300px]">
                {/* Create status data for pie chart */}
                {(() => {
                  const statusCounts = dashboardData.printerStatus;
                  
                  const pieData = [
                    { name: 'Online', value: statusCounts.online },
                    { name: 'Offline', value: statusCounts.offline },
                    { name: 'Error', value: statusCounts.error },
                    { name: 'Warning', value: statusCounts.warning },
                    { name: 'Maintenance', value: statusCounts.maintenance }
                  ].filter(item => item.value > 0);
                  
                  // Calculate the total for percentages
                  const total = Object.values(statusCounts).reduce((a, b) => Number(a) + Number(b), 0);
                  
                  // Instead of pie chart, use a simple visualization
                  return (
                    <div className="flex flex-col h-[300px] justify-center space-y-4">
                      {pieData.map(item => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <div className={`h-4 w-4 rounded-full ${
                            item.name === 'Online' ? 'bg-green-500' : 
                            item.name === 'Offline' ? 'bg-gray-400' : 
                            item.name === 'Error' ? 'bg-red-500' : 
                            item.name === 'Warning' ? 'bg-orange-400' : 
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="h-2 bg-gray-100 rounded-full mt-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.name === 'Online' ? 'bg-green-500' : 
                                  item.name === 'Offline' ? 'bg-gray-400' : 
                                  item.name === 'Error' ? 'bg-red-500' : 
                                  item.name === 'Warning' ? 'bg-orange-400' : 
                                  'bg-blue-500'
                                }`} 
                                style={{ width: `${(item.value / total) * 100}%` }} 
                              />
                            </div>
                          </div>
                          <div className="text-sm font-medium">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-muted-foreground">Online ({dashboardData.printerStatus.online || 0})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-muted-foreground">Offline ({dashboardData.printerStatus.offline || 0})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-muted-foreground">Error ({dashboardData.printerStatus.error || 0})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-400"></div>
                    <span className="text-sm text-muted-foreground">Warning ({dashboardData.printerStatus.warning || 0})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-muted-foreground">Maintenance ({dashboardData.printerStatus.maintenance || 0})</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <FileWarning className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No data available</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There's no printer status data to display at this time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle>Recent Print Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {isJobsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : jobsData && jobsData.length > 0 ? (
              <div className="space-y-2">
                {jobsData.slice(0, 5).map((job, index) => (
                  <div 
                    key={job.id || index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      {job.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : job.type === 'error' ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{job.entityType}</p>
                        <p className="text-xs text-muted-foreground">{job.user || 'System'} • {format(new Date(job.timestamp), 'MMM d, h:mm a')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="whitespace-nowrap">{job.entityId || '-'}</Badge>
                      <Badge variant={job.type === 'success' ? 'outline' : job.type === 'error' ? 'destructive' : 'secondary'} className="whitespace-nowrap">
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                    <a href="/activity">
                      View all jobs
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileWarning className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No print jobs</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There are no recent print jobs to display.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle>Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            {isAlertsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : alerts && alerts.length > 0 ? (
              <div className="space-y-2">
                {alerts.slice(0, 5).map((alert, index) => (
                  <div 
                    key={alert.id || index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      {alert.level === 'critical' ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : alert.level === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Info className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{alert.title || 'Alert'}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        alert.status === 'active' ? 'destructive' : 
                        alert.status === 'resolved' ? 'outline' : 
                        'secondary'
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                    <a href="/alerts">
                      View all alerts
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-lg font-medium">No alerts</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There are no recent alerts to display.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
