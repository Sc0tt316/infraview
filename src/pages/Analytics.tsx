
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart2, 
  Calendar, 
  Printer, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Clock,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import { printerService } from "@/services/printerService";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import DateRangePicker from "@/components/analytics/DateRangePicker";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();
  
  // Fetch analytics data
  const { 
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics 
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalyticsData
  });
  
  // Fetch print volume data based on selected time range
  const { 
    data: printVolumeData = [],
    isLoading: isPrintVolumeLoading,
    refetch: refetchPrintVolume
  } = useQuery({
    queryKey: ['printVolume', timeRange, dateRange],
    queryFn: () => {
      if (dateRange?.from && dateRange?.to) {
        return analyticsService.getPrintVolumeByDateRange(dateRange.from, dateRange.to);
      }
      return analyticsService.getPrintVolumeByTimeRange(timeRange as any);
    },
  });
  
  // Fetch statistics
  const { 
    data: statistics,
    isLoading: isStatisticsLoading,
    refetch: refetchStatistics
  } = useQuery({
    queryKey: ['statistics'],
    queryFn: analyticsService.getStatistics
  });
  
  // Fetch printers to get departments
  const { 
    data: printers = [],
    isLoading: isPrintersLoading,
    refetch: refetchPrinters
  } = useQuery({
    queryKey: ['printers'],
    queryFn: printerService.getAllPrinters
  });
  
  // Generate department data from printers
  const generateDepartmentData = () => {
    const departmentCounts: Record<string, number> = {};
    
    printers.forEach(printer => {
      if (printer.department) {
        departmentCounts[printer.department] = (departmentCounts[printer.department] || 0) + printer.jobCount;
      }
    });
    
    return Object.entries(departmentCounts).map(([name, prints]) => ({
      name,
      prints
    }));
  };
  
  const departmentData = generateDepartmentData();
  
  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setDateRange(undefined);
  };
  
  // Handle date range apply
  const handleDateRangeApply = () => {
    if (dateRange?.from && dateRange?.to) {
      setTimeRange("custom");
      refetchPrintVolume();
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refetchAnalytics();
    refetchPrintVolume();
    refetchStatistics();
    refetchPrinters();
    toast({
      title: "Refreshed",
      description: "Analytics data has been refreshed.",
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
  };

  const isLoading = isAnalyticsLoading || isPrintVolumeLoading || isStatisticsLoading || isPrintersLoading;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your printer fleet performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            className="h-10 w-10"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          
          <DateRangePicker 
            dateRange={dateRange} 
            setDateRange={setDateRange} 
            onApply={handleDateRangeApply} 
          />
        </div>
      </div>

      <Tabs defaultValue={timeRange} onValueChange={handleTimeRangeChange} className="w-fit">
        <TabsList>
          <TabsTrigger value="day">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="year">This Year</TabsTrigger>
          <TabsTrigger value="custom" disabled={!dateRange?.from || !dateRange?.to}>Custom</TabsTrigger>
        </TabsList>
      </Tabs>

      {isAnalyticsError ? (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data. Please try again.
            <Button variant="outline" size="sm" className="ml-2" onClick={handleRefresh}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={itemVariants}>
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Printers</CardTitle>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Printer className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
                  ) : (
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-3xl font-bold">{statistics?.totalPrinters || 0}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600 font-medium">+2</span> from last period
                        </p>
                      </div>
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span>12%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
                  ) : (
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-3xl font-bold">{statistics?.totalUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600 font-medium">+15</span> from last period
                        </p>
                      </div>
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span>8%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Print Jobs</CardTitle>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
                  ) : (
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-3xl font-bold">{statistics?.totalPrintJobs || 0}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-red-600 font-medium">-120</span> from last period
                        </p>
                      </div>
                      <div className="flex items-center text-red-600 text-sm font-medium">
                        <TrendingDown className="mr-1 h-4 w-4" />
                        <span>3%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Paper Used</CardTitle>
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
                  ) : (
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-3xl font-bold">{statistics?.totalPaperUsed || 0}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600 font-medium">+205</span> sheets
                        </p>
                      </div>
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span>5%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="w-full">
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">Print Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  {isPrintVolumeLoading ? (
                    <div className="h-80 w-full flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={printVolumeData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "white", 
                              borderRadius: "8px", 
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "none"
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="prints" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">Printer Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyticsLoading ? (
                    <div className="h-64 w-full flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData?.printerStatus || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {analyticsData?.printerStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "white", 
                              borderRadius: "8px", 
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "none"
                            }} 
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">Consumables Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyticsLoading ? (
                    <div className="h-64 w-full flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
                    </div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData?.consumables || []}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "white", 
                              borderRadius: "8px", 
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "none"
                            }} 
                          />
                          <Legend />
                          <Line type="monotone" dataKey="ink" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="paper" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-lg">Print Volume by Department</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 w-full flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
                  </div>
                ) : departmentData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "white", 
                            borderRadius: "8px", 
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            border: "none"
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="prints" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center flex-col">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No department data available. Add departments to printers to see print volume by department.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-lg">Alert History</CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyticsLoading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse h-24 bg-muted rounded-lg w-full"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyticsData?.alertHistory.map(alert => (
                      <div 
                        key={alert.id} 
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border",
                          alert.level === 'error' ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" : 
                          alert.level === 'warning' ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800" : 
                          "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          alert.level === 'error' ? "bg-red-100 dark:bg-red-800" : 
                          alert.level === 'warning' ? "bg-yellow-100 dark:bg-yellow-800" : 
                          "bg-blue-100 dark:bg-blue-800"
                        )}>
                          <AlertTriangle className={cn(
                            "h-4 w-4",
                            alert.level === 'error' ? "text-red-600 dark:text-red-400" : 
                            alert.level === 'warning' ? "text-yellow-600 dark:text-yellow-400" : 
                            "text-blue-600 dark:text-blue-400"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-foreground dark:text-gray-200">{alert.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground dark:text-gray-400">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{alert.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">{alert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Analytics;
