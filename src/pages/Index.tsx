import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useAlerts } from '@/hooks/useAlerts';
import { useNavigate } from 'react-router-dom';
import { usePrinters } from '@/hooks/usePrinters';
import { ArrowUpRight, Printer, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alerts, isLoading: alertsLoading } = useAlerts();
  const { printers, isLoading: printersLoading } = usePrinters();
  
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [printerData, setPrinterData] = useState([]);
  
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'manager';
  
  useEffect(() => {
    if (alerts) {
      const sortedAlerts = [...alerts].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRecentAlerts(sortedAlerts.slice(0, 5));
    }
  }, [alerts]);
  
  useEffect(() => {
    if (!printersLoading && printers) {
      setPrinterData(printers);
    }
  }, [printers, printersLoading]);
  
  const onlinePrinters = printerData?.filter(p => p.status === 'online')?.length || 0;
  const errorPrinters = printerData?.filter(p => p.status === 'error')?.length || 0;
  const warningPrinters = printerData?.filter(p => p.status === 'warning')?.length || 0;
  const offlinePrinters = printerData?.filter(p => p.status === 'offline')?.length || 0;
  
  const activeAlerts = alerts?.filter(a => !a.isResolved)?.length || 0;
  
  const printJobsToday = 178;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Printers</p>
              <h3 className="text-3xl font-semibold text-slate-100 mt-1">{printerData?.length || 0}</h3>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-900/20">
              <Printer className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Online Printers</p>
              <h3 className="text-3xl font-semibold text-slate-100 mt-1">{onlinePrinters}</h3>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Print Jobs Today</p>
              <h3 className="text-3xl font-semibold text-slate-100 mt-1">{printJobsToday}</h3>
              <p className="text-xs text-slate-500 mt-1">Completed and pending</p>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-indigo-900/20">
              <Clock className="h-6 w-6 text-indigo-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Alerts</p>
              <h3 className="text-3xl font-semibold text-slate-100 mt-1">{activeAlerts}</h3>
              <p className="text-xs text-red-400 mt-1">↑ 12% vs last month</p>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="dark-card row-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-slate-100 flex items-center">
              <Printer className="h-5 w-5 mr-2 text-blue-400" />
              Printer Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {printerData && printerData.length > 0 ? (
              <div className="pt-6">
                <div className="relative w-full h-[200px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-semibold text-slate-100">
                        {Math.round((onlinePrinters / printerData.length) * 100)}%
                      </p>
                      <p className="text-sm text-slate-400">Online</p>
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#1e293b" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#22c55e" 
                      strokeWidth="10"
                      strokeDasharray={`${(onlinePrinters / printerData.length) * 251.2} 251.2`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs text-slate-400">Online</span>
                    </div>
                    <p className="ml-5 text-lg font-medium text-slate-100">{onlinePrinters}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                      <span className="text-xs text-slate-400">Offline</span>
                    </div>
                    <p className="ml-5 text-lg font-medium text-slate-100">{offlinePrinters}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-xs text-slate-400">Error</span>
                    </div>
                    <p className="ml-5 text-lg font-medium text-slate-100">{errorPrinters}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-xs text-slate-400">Warning</span>
                    </div>
                    <p className="ml-5 text-lg font-medium text-slate-100">{warningPrinters}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-8 pb-12">
                <Printer className="h-16 w-16 text-slate-700 mb-4" />
                <p className="text-slate-400 text-sm">No printers added yet</p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/printers')}
                  className="mt-4 bg-transparent border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                >
                  Add Printers
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="dark-card md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-slate-100">Recent Alerts</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/alerts')} className="text-blue-400 hover:text-blue-300">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-2">
            {recentAlerts && recentAlerts.length > 0 ? (
              <div className="overflow-auto max-h-[300px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-xs">
                      <th className="pb-2 font-medium text-left pl-4">Severity</th>
                      <th className="pb-2 font-medium text-left">Alert</th>
                      <th className="pb-2 font-medium text-left">Time</th>
                      <th className="pb-2 font-medium text-right pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAlerts.map((alert) => {
                      const alertDate = new Date(alert.timestamp);
                      const dateStr = alertDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      });
                      const timeStr = alertDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      });
                      return (
                        <tr key={alert.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 pl-4">
                            <Badge className={
                              alert.severity === 'critical' ? 'bg-red-500' :
                              alert.severity === 'high' ? 'bg-orange-500' :
                              alert.severity === 'medium' ? 'bg-amber-500' :
                              'bg-blue-500'
                            }>
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="font-medium text-slate-200">{alert.title}</div>
                            <div className="text-slate-500 text-xs mt-0.5 truncate max-w-[300px]">{alert.description}</div>
                          </td>
                          <td className="py-3 text-sm text-slate-400">
                            {dateStr}, {timeStr}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            <Badge variant="outline" className={
                              alert.isResolved ? 'border-green-800 text-green-400' : 'border-amber-800 text-amber-400'
                            }>
                              {alert.isResolved ? 'Resolved' : 'Active'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-slate-700 mb-3" />
                <p className="text-slate-400">No alerts to display</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="dark-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-slate-100 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-400" />
              Low Supplies Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            {printerData && printerData.filter(p => p.inkLevel < 15 || p.paperLevel < 15).length > 0 ? (
              <div className="space-y-4">
                {printerData
                  .filter(p => p.inkLevel < 15 || p.paperLevel < 15)
                  .map((printer) => (
                    <div key={printer.id} className="p-4 rounded-md bg-slate-800/50 hover:bg-slate-800 transition-colors">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-100">{printer.name}</span>
                        <span className="text-slate-400">{printer.location}</span>
                      </div>
                      
                      {printer.inkLevel < 15 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Ink Level</span>
                            <span className="text-red-400 font-medium">{printer.inkLevel}%</span>
                          </div>
                          <Progress value={printer.inkLevel} className="h-2 bg-slate-700" />
                        </div>
                      )}
                      
                      {printer.paperLevel < 15 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Paper Level</span>
                            <span className="text-red-400 font-medium">{printer.paperLevel}%</span>
                          </div>
                          <Progress value={printer.paperLevel} className="h-2 bg-slate-700" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500/50 mb-3" />
                <p className="text-slate-400">No printers with low supplies</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="dark-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-slate-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button onClick={() => navigate('/printers')} className="bg-blue-600 hover:bg-blue-700 text-white">
                Manage Printers
              </Button>
              {hasAdminAccess && (
                <Button onClick={() => navigate('/users')} className="bg-slate-700 hover:bg-slate-600 text-white">
                  Manage Users
                </Button>
              )}
              <Button onClick={() => navigate('/alerts')} className="bg-amber-600 hover:bg-amber-700 text-white">
                View All Alerts
              </Button>
              <Button onClick={() => navigate('/settings')} variant="outline" className="bg-transparent border-slate-700 text-slate-200 hover:bg-slate-700">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
