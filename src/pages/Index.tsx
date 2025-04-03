
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, subDays, formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import {
  Users, 
  Printer, 
  BarChart3, 
  Bell,
  RefreshCw,
  ArrowDown,
  ArrowUp,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { printerService } from '@/services/printerService';
import { userService } from '@/services/userService';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "@/components/ui/chart";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState('today');
  
  // Time of day greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
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
  const { 
    data: alerts, 
    isLoading: isAlertsLoading,
    refetch: refetchAlerts
  } = useQuery({
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
  
  // Get low supply printers
  const getLowSupplyPrinters = () => {
    if (!printersData) return [];
    return printersData.filter(printer => 
      printer.inkLevel < 30 || printer.paperLevel < 30
    ).slice(0, 3);
  };
  
  // Handle refresh all data
  const handleRefresh = () => {
    setIsLoading(true);
    
    Promise.all([
      refetchDashboard(),
      refetchPrinters(),
      refetchUsers(),
      refetchJobs(),
      refetchAlerts()
    ]).then(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard Refreshed",
        description: "All dashboard data has been updated.",
      });
    });
  };
  
  // Generate random change percentages
  const getRandomChange = (negative = false) => {
    const base = Math.floor(Math.random() * 20) + 1;
    return negative ? -base : base;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{getTimeBasedGreeting()}, {user?.name || "Admin"}</h1>
          <p className="text-muted-foreground">Here's what's happening with your printer fleet today</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
          </Button>
          
          <Tabs defaultValue="today" className="hidden md:block" value={timeFilter} onValueChange={setTimeFilter}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Printers"
          value={dashboardData?.summary?.totalPrinters || 0}
          change={+2}
          changeText="from last period"
          changePercent={12}
          icon={<Printer className="h-4 w-4 text-muted-foreground" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        
        <StatsCard 
          title="Active Users"
          value={usersData?.filter(u => u.status === 'active').length || 0}
          change={+15}
          changeText="from last period"
          changePercent={8}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        
        <StatsCard 
          title="Print Jobs (Today)"
          value={1870}
          change={-35}
          changeText="from last period"
          changePercent={-4}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          negative
        />
        
        <StatsCard 
          title="Alerts"
          value={alerts?.filter(alert => alert.status === 'active').length || 0}
          change={+3}
          changeText="from last period"
          changePercent={20}
          icon={<Bell className="h-4 w-4 text-muted-foreground" />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-xl font-medium">Print Jobs</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/analytics">
                  Generate Report <BarChart3 className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {isDashboardLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : (
              <div className="h-[300px] p-4">
                <BarChart
                  data={[
                    { month: "Mon", value: 150 },
                    { month: "Tue", value: 320 },
                    { month: "Wed", value: 450 },
                    { month: "Thu", value: 380 },
                    { month: "Fri", value: 290 },
                  ]}
                  categories={['value']}
                  index="month"
                  valueFormatter={(value) => `${value} jobs`}
                  colors={['#8E5CF6']}
                  showAnimation={true}
                  className="w-full h-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <div className="p-6 border-b">
              <h2 className="text-xl font-medium">Printer Status</h2>
            </div>
            
            {isPrintersLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : printersData ? (
              <div className="p-6">
                <div className="relative pt-1 h-[300px] flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-[16px] border-gray-200 relative">
                    {/* Green segment (online) */}
                    <div 
                      className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-green-500 border-r-green-500" 
                      style={{ 
                        transform: `rotate(${getStatusPercentage(printersData, 'online') * 3.6}deg)`,
                        clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
                      }}
                    />
                    
                    {/* Yellow segment (warning/maintenance) */}
                    <div 
                      className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-amber-400" 
                      style={{ 
                        transform: `rotate(${(getStatusPercentage(printersData, 'online') + getStatusPercentage(printersData, 'warning') + getStatusPercentage(printersData, 'maintenance')) * 3.6}deg)`,
                        clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
                      }}
                    />
                    
                    {/* Red segment (error) */}
                    <div 
                      className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-red-500" 
                      style={{ 
                        transform: `rotate(${(getStatusPercentage(printersData, 'online') + getStatusPercentage(printersData, 'warning') + getStatusPercentage(printersData, 'maintenance') + getStatusPercentage(printersData, 'error')) * 3.6}deg)`,
                        clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
                      }}
                    />
                    
                    {/* Gray segment (offline) */}
                    <div 
                      className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-gray-400" 
                      style={{ 
                        transform: `rotate(${(getStatusPercentage(printersData, 'online') + getStatusPercentage(printersData, 'warning') + getStatusPercentage(printersData, 'maintenance') + getStatusPercentage(printersData, 'error') + getStatusPercentage(printersData, 'offline')) * 3.6}deg)`,
                        clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Offline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Error</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                    <span className="text-sm">Warning</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] p-6">
                <AlertTriangle className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No data available</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There's no printer status data to display at this time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-0">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-xl font-medium">Low Supply Printers</h2>
              <Link to="/printers" className="text-blue-600 hover:underline text-sm flex items-center">
                View All <ArrowUp className="h-3 w-3 rotate-45 ml-1" />
              </Link>
            </div>
            
            {isPrintersLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : getLowSupplyPrinters().length > 0 ? (
              <div className="divide-y">
                {getLowSupplyPrinters().map((printer) => (
                  <div key={printer.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-3 mr-4">
                          <Printer className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{printer.name}</h3>
                          <p className="text-sm text-muted-foreground">{printer.model}</p>
                        </div>
                      </div>
                      <Badge 
                        className={`
                          ${printer.status === 'online' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                            printer.status === 'offline' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : 
                            printer.status === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                            printer.status === 'maintenance' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                            'bg-amber-100 text-amber-800 hover:bg-amber-100'}
                        `}
                      >
                        {printer.status === 'online' ? 'Online' : 
                          printer.status === 'offline' ? 'Offline' : 
                          printer.status === 'error' ? 'Error' : 
                          printer.status === 'maintenance' ? 'Maintenance' : 
                          'Warning'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Ink Level</span>
                          <span className={printer.inkLevel < 20 ? 'text-red-600 font-medium' : ''}>{printer.inkLevel}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${printer.inkLevel < 20 ? 'bg-red-500' : 'bg-blue-600'}`} 
                            style={{ width: `${printer.inkLevel}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Paper Level</span>
                          <span className={printer.paperLevel < 20 ? 'text-red-600 font-medium' : ''}>{printer.paperLevel}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${printer.paperLevel < 20 ? 'bg-red-500' : 'bg-blue-600'}`} 
                            style={{ width: `${printer.paperLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] p-6">
                <CheckCircle className="h-10 w-10 text-green-500 mb-3" />
                <h3 className="text-lg font-medium">All printers are good</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There are no printers with low supply levels.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-xl font-medium">Recent Activity</h2>
              <Link to="/activity" className="text-blue-600 hover:underline text-sm flex items-center">
                View All <ArrowUp className="h-3 w-3 rotate-45 ml-1" />
              </Link>
            </div>
            
            {isJobsLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            ) : jobsData && jobsData.length > 0 ? (
              <div>
                {jobsData.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} className="flex p-6 border-b last:border-b-0">
                    <div className="relative mr-6">
                      <div className={`
                        w-8 h-8 flex items-center justify-center rounded-full
                        ${activity.type === 'success' ? 'bg-green-100' : 
                          activity.type === 'error' ? 'bg-red-100' : 
                          activity.type === 'warning' ? 'bg-orange-100' : 
                          'bg-blue-100'}
                      `}>
                        {activity.type === 'success' ? (
                          <FileText className="h-4 w-4 text-green-600" />
                        ) : activity.type === 'error' ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : activity.type === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        ) : (
                          <Users className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      {index < jobsData.slice(0, 5).length - 1 && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">
                          {activity.user || "System"}
                          {activity.entityType && <span className="text-sm font-normal text-muted-foreground ml-2">{activity.entityType}</span>}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] p-6">
                <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No recent activity</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There is no recent printer activity to display.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-medium">Recent Alerts</h2>
            <Link to="/alerts" className="text-blue-600 hover:underline text-sm flex items-center">
              View All <ArrowUp className="h-3 w-3 rotate-45 ml-1" />
            </Link>
          </div>
          
          {isAlertsLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : alerts && alerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              {alerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id} 
                  className={`
                    rounded-lg p-6 space-y-3
                    ${alert.level === 'critical' ? 'bg-red-50 border border-red-100' : 
                      alert.level === 'warning' ? 'bg-amber-50 border border-amber-100' : 
                      'bg-blue-50 border border-blue-100'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-full
                      ${alert.level === 'critical' ? 'bg-red-100' : 
                        alert.level === 'warning' ? 'bg-amber-100' : 
                        'bg-blue-100'}
                    `}>
                      <AlertTriangle className={`
                        h-5 w-5
                        ${alert.level === 'critical' ? 'text-red-600' : 
                          alert.level === 'warning' ? 'text-amber-600' : 
                          'text-blue-600'}
                      `} />
                    </div>
                    <div>
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm">
                    {alert.description}
                  </p>
                  
                  <Badge variant={
                    alert.status === 'active' ? 'destructive' : 
                    alert.status === 'resolved' ? 'outline' : 
                    'secondary'
                  }>
                    {alert.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] p-6">
              <CheckCircle className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="text-lg font-medium">No alerts</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There are no recent alerts to display.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
const getStatusPercentage = (printers, status) => {
  if (!printers || printers.length === 0) return 0;
  const count = printers.filter(p => p.status === status).length;
  return (count / printers.length) * 100;
};

// Stats Card Component
const StatsCard = ({ title, value, change, changeText, changePercent, icon, iconBg, iconColor, negative = false }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={`${iconBg} p-2 rounded-full ${iconColor}`}>
            {icon}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-3xl font-bold">{value.toLocaleString()}</div>
          <div className="mt-1 flex items-center text-xs">
            <span className={`flex items-center ${negative ? 'text-red-500' : 'text-green-500'}`}>
              {change > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(change)} ({Math.abs(changePercent)}%)
            </span>
            <span className="text-muted-foreground ml-1">{changeText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
