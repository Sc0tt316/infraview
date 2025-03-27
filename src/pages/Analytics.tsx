
import React, { useState } from "react";
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
  AlertTriangle
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
import { cn } from "@/lib/utils";

// Mock data for charts
const printVolumeData = [
  { name: "Mon", prints: 230 },
  { name: "Tue", prints: 320 },
  { name: "Wed", prints: 450 },
  { name: "Thu", prints: 380 },
  { name: "Fri", prints: 290 },
  { name: "Sat", prints: 120 },
  { name: "Sun", prints: 80 },
];

const printerStatusData = [
  { name: "Online", value: 12, color: "#4ade80" },
  { name: "Offline", value: 3, color: "#94a3b8" },
  { name: "Error", value: 2, color: "#f87171" },
  { name: "Maintenance", value: 1, color: "#facc15" },
];

const consumablesData = [
  { name: "Jan", ink: 45, paper: 60 },
  { name: "Feb", ink: 52, paper: 48 },
  { name: "Mar", ink: 38, paper: 71 },
  { name: "Apr", ink: 62, paper: 53 },
  { name: "May", ink: 55, paper: 67 },
  { name: "Jun", ink: 78, paper: 58 },
];

const printByDepartmentData = [
  { name: "Marketing", prints: 2450 },
  { name: "Finance", prints: 1800 },
  { name: "HR", prints: 950 },
  { name: "IT", prints: 1350 },
  { name: "Sales", prints: 2100 },
  { name: "Executive", prints: 750 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("week");
  
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

  const totalPrinters = printerStatusData.reduce((acc, curr) => acc + curr.value, 0);
  const totalUsers = 245;
  const totalPrintJobs = printVolumeData.reduce((acc, curr) => acc + curr.prints, 0);
  const totalPaperUsed = Math.round(totalPrintJobs * 1.2); // Approximation

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div>
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor your printer fleet performance</p>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-fit">
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" className="gap-2">
          <Calendar size={16} />
          <span>Custom Range</span>
        </Button>
      </div>

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
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">{totalPrinters}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">+2</span> from last period
                  </p>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>12%</span>
                </div>
              </div>
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
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">+15</span> from last period
                  </p>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>8%</span>
                </div>
              </div>
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
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">{totalPrintJobs}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-600 font-medium">-120</span> from last period
                  </p>
                </div>
                <div className="flex items-center text-red-600 text-sm font-medium">
                  <TrendingDown className="mr-1 h-4 w-4" />
                  <span>3%</span>
                </div>
              </div>
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
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">{totalPaperUsed}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">+205</span> sheets
                  </p>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>5%</span>
                </div>
              </div>
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
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-lg">Printer Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={printerStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {printerStatusData.map((entry, index) => (
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
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-lg">Consumables Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumablesData}>
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={printByDepartmentData} layout="vertical">
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
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg">Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  id: 'a1', 
                  title: 'Printer Offline', 
                  description: 'Executive Printer went offline and is not responding', 
                  time: '20 minutes ago',
                  level: 'error'
                },
                { 
                  id: 'a2', 
                  title: 'Low Ink Warning', 
                  description: 'Marketing Printer is low on cyan ink (5% remaining)', 
                  time: '1 hour ago',
                  level: 'warning'
                },
                { 
                  id: 'a3', 
                  title: 'Paper Jam', 
                  description: 'Office Printer 1 has reported a paper jam in tray 2', 
                  time: '2 hours ago',
                  level: 'error'
                },
                { 
                  id: 'a4', 
                  title: 'Maintenance Required', 
                  description: 'Conference Room Printer scheduled maintenance is due', 
                  time: '1 day ago',
                  level: 'info'
                },
              ].map(alert => (
                <div 
                  key={alert.id} 
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border",
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
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
