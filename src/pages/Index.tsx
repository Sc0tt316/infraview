import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Printer, 
  Users, 
  FileText, 
  Bell,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap,
  ChevronRight,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { printerService, PrinterData } from "@/services/printerService";
import { analyticsService } from "@/services/analyticsService";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("today");
  const { toast } = useToast();
  
  // Fetch printer data
  const { 
    data: printers = [],
    isLoading: isPrintersLoading,
    isError: isPrintersError,
    refetch: refetchPrinters
  } = useQuery({
    queryKey: ['printers'],
    queryFn: printerService.getAllPrinters
  });
  
  // Fetch analytics data
  const { 
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalyticsData
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
  
  // Handle refresh data
  const handleRefreshData = () => {
    refetchPrinters();
    refetchAnalytics();
    refetchStatistics();
    toast({
      title: "Dashboard Refreshed",
      description: "Latest data has been loaded.",
    });
  };
  
  // Get printers with low supplies
  const getLowSupplyPrinters = () => {
    return printers
      .filter(printer => printer.inkLevel <= 30 || printer.paperLevel <= 30)
      .slice(0, 3);
  };
  
  const lowSupplyPrinters = getLowSupplyPrinters();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
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
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-700 border-green-200";
      case "offline": return "bg-gray-100 text-gray-700 border-gray-200";
      case "error": return "bg-red-100 text-red-700 border-red-200";
      case "maintenance": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": return "Online";
      case "offline": return "Offline";
      case "error": return "Error";
      case "maintenance": return "Maintenance";
      default: return "Unknown";
    }
  };

  const getLevelColor = (level: number) => {
    if (level <= 10) return "text-red-600";
    if (level <= 30) return "text-yellow-600";
    return "text-green-600";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "print":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "login":
        return <Users className="h-4 w-4 text-green-600" />;
      case "maintenance":
        return <RefreshCw className="h-4 w-4 text-amber-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const isLoading = isPrintersLoading || isAnalyticsLoading || isStatisticsLoading;
  const isError = isPrintersError || isAnalyticsError;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Good Morning, Admin
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Here's what's happening with your printer fleet today
          </motion.p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefreshData} 
            className="h-10 w-10"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-fit">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isError ? (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try again.
            <Button variant="outline" size="sm" className="ml-2" onClick={handleRefreshData}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                id: 1, 
                title: "Total Printers", 
                value: statistics?.totalPrinters || 0, 
                change: "+2", 
                percent: "12%", 
                trend: "up", 
                icon: Printer, 
                color: "blue" 
              },
              { 
                id: 2, 
                title: "Active Users", 
                value: statistics?.totalUsers || 0, 
                change: "+15", 
                percent: "8%", 
                trend: "up", 
                icon: Users, 
                color: "green" 
              },
              { 
                id: 3, 
                title: "Print Jobs (Today)", 
                value: analytics?.printVolume?.reduce((sum, item) => sum + (item.volume || 0), 0) || 0, 
                change: "-35", 
                percent: "4%", 
                trend: "down", 
                icon: FileText, 
                color: "purple" 
              },
              { 
                id: 4, 
                title: "Alerts", 
                value: analytics?.alertHistory?.length || 0, 
                change: "+3", 
                percent: "20%", 
                trend: "up", 
                icon: Bell, 
                color: "amber" 
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              const isPositive = stat.trend === "up";
              return (
                <motion.div key={stat.id} variants={itemVariants}>
                  <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          stat.color === "blue" ? "bg-blue-100" :
                          stat.color === "green" ? "bg-green-100" :
                          stat.color === "purple" ? "bg-purple-100" :
                          "bg-amber-100"
                        )}>
                          <Icon className={cn(
                            "h-4 w-4",
                            stat.color === "blue" ? "text-blue-600" :
                            stat.color === "green" ? "text-green-600" :
                            stat.color === "purple" ? "text-purple-600" :
                            "text-amber-600"
                          )} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
                      ) : (
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                              <span className={isPositive ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {stat.change}
                              </span> from last period
                            </p>
                          </div>
                          <div className={cn(
                            "flex items-center text-sm font-medium",
                            isPositive ? "text-green-600" : "text-red-600"
                          )}>
                            {isPositive ? (
                              <TrendingUp className="mr-1 h-4 w-4" />
                            ) : (
                              <TrendingDown className="mr-1 h-4 w-4" />
                            )}
                            <span>{stat.percent}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Charts & Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Print Jobs</CardTitle>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Zap size={14} />
                      <span>Generate Report</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isAnalyticsLoading ? (
                    <div className="h-80 w-full flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics?.printVolume || []}>
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

            <motion.div variants={itemVariants}>
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Printer Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyticsLoading ? (
                    <div className="h-60 w-full flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
                    </div>
                  ) : analytics?.printerStatus && analytics.printerStatus.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="h-60"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.printerStatus}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {analytics.printerStatus.map((entry, index) => (
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
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-60 text-center">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No department data available</h3>
                      <p className="text-muted-foreground mt-1 max-w-md">
                        There is no print volume data by department available at this time.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>{analytics?.printerStatus?.[0]?.value || 0} Online</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-gray-600" />
                      <span>{analytics?.printerStatus?.[1]?.value || 0} Offline</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                      <span>{analytics?.printerStatus?.[2]?.value || 0} Errors</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Low Supply Printers</CardTitle>
                    <Link to="/printers">
                      <Button variant="link" size="sm" className="gap-1">
                        <span>View All</span>
                        <ChevronRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPrintersLoading ? (
                    <>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse h-28 bg-muted rounded-lg w-full"></div>
                      ))}
                    </>
                  ) : lowSupplyPrinters.length > 0 ? (
                    lowSupplyPrinters.map((printer) => (
                      <div 
                        key={printer.id}
                        className="flex items-center gap-4 p-3 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Printer className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-foreground truncate">{printer.name}</h3>
                            <Badge className={cn("border text-xs", getStatusColor(printer.status))}>
                              {getStatusText(printer.status)}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 space-y-2">
                            <div>
                              <div className="flex justify-between items-center mb-1 text-xs">
                                <span>Ink Level</span>
                                <span className={getLevelColor(printer.inkLevel)}>{printer.inkLevel}%</span>
                              </div>
                              <Progress value={printer.inkLevel} className="h-1.5" />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1 text-xs">
                                <span>Paper Level</span>
                                <span className={getLevelColor(printer.paperLevel)}>{printer.paperLevel}%</span>
                              </div>
                              <Progress value={printer.paperLevel} className="h-1.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No printers with low supplies</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Alerts</CardTitle>
                    <Link to="/analytics">
                      <Button variant="link" size="sm" className="gap-1">
                        <span>View All</span>
                        <ChevronRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isAnalyticsLoading ? (
                    <>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse h-24 bg-muted rounded-lg w-full"></div>
                      ))}
                    </>
                  ) : analytics?.alertHistory?.length > 0 ? (
                    analytics.alertHistory.slice(0, 3).map(alert => (
                      <div 
                        key={alert.id} 
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border",
                          alert.level === 'error' ? "bg-red-50 border-red-200" : 
                          alert.level === 'warning' ? "bg-yellow-50 border-yellow-200" : 
                          "bg-blue-50 border-blue-200"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          alert.level === 'error' ? "bg-red-100" : 
                          alert.level === 'warning' ? "bg-yellow-100" : 
                          "bg-blue-100"
                        )}>
                          <AlertTriangle className={cn(
                            "h-4 w-4",
                            alert.level === 'error' ? "text-red-600" : 
                            alert.level === 'warning' ? "text-yellow-600" : 
                            "text-blue-600"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-foreground">{alert.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{alert.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No recent alerts</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200 h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <Button variant="link" size="sm" className="gap-1">
                      <span>View All</span>
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="animate-pulse h-20 bg-muted rounded-lg w-full"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-1 bottom-0 w-0.5 bg-border/60" />
                      
                      {[
                        { 
                          id: "act1", 
                          type: "print", 
                          user: "Sarah Miller", 
                          message: "Printed 'Q4 Marketing Report.pdf' (12 pages)", 
                          time: "10 minutes ago"
                        },
                        { 
                          id: "act2", 
                          type: "error", 
                          user: "System", 
                          message: "Error detected on Marketing Printer: Low ink", 
                          time: "45 minutes ago"
                        },
                        { 
                          id: "act3", 
                          type: "login", 
                          user: "Alex Johnson", 
                          message: "Logged in from new device (iPhone)", 
                          time: "1 hour ago"
                        },
                        { 
                          id: "act4", 
                          type: "maintenance", 
                          user: "System", 
                          message: "Scheduled maintenance completed on Conference Room Printer", 
                          time: "2 hours ago"
                        },
                        { 
                          id: "act5", 
                          type: "print", 
                          user: "Michael Chen", 
                          message: "Printed 'Financial Analysis.xlsx' (5 pages)", 
                          time: "3 hours ago"
                        }
                      ].map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 ml-0.5">
                          <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          
                          <div className="flex-1 bg-accent/30 rounded-lg p-3 border border-border/40">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-foreground flex items-center gap-2">
                                {activity.user}
                                {activity.type === "login" && (
                                  <Badge variant="secondary" className="text-xs font-normal">
                                    Security
                                  </Badge>
                                )}
                              </h4>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{activity.time}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{activity.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;
