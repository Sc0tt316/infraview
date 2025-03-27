import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  User, 
  Printer, 
  Bell, 
  Lock, 
  Globe, 
  Mail, 
  Shield,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useIsMobile();
  
  const [profileForm, setProfileForm] = useState({
    name: "Admin User",
    email: "admin@printerverse.com",
    phone: "+1 (555) 123-4567",
    company: "PrinterVerse Inc.",
    role: "Administrator"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    printerOffline: true,
    lowSupplies: true,
    errorNotifications: true,
    maintenanceReminders: false,
    dailyReports: false,
    weeklyReports: true
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

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

  const renderTabContent = () => {
    return (
      <>
        <TabsContent value="profile" className="mt-0 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details and personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company"
                      name="company"
                      value={profileForm.company}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role"
                      name="role"
                      value={profileForm.role}
                      onChange={handleProfileChange}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Configure your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language" className="font-medium">Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <select 
                    id="language" 
                    className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Timezone</Label>
                    <p className="text-sm text-muted-foreground">Set your local timezone</p>
                  </div>
                  <select 
                    className="flex h-10 w-60 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="utc">UTC (GMT+0)</option>
                    <option value="est">Eastern Time (GMT-5)</option>
                    <option value="pst">Pacific Time (GMT-8)</option>
                    <option value="cet">Central European Time (GMT+1)</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enhance your account security</p>
                  </div>
                  <div className="flex items-center">
                    <Switch id="twofa" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control what notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <div className="flex items-center">
                    <Switch 
                      id="emailAlerts" 
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={() => handleToggleChange("emailAlerts")}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Event Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Printer Offline Alerts</Label>
                    </div>
                    <div className="flex items-center">
                      <Switch 
                        checked={notificationSettings.printerOffline}
                        onCheckedChange={() => handleToggleChange("printerOffline")}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Low Supplies Warning</Label>
                    </div>
                    <div className="flex items-center">
                      <Switch 
                        checked={notificationSettings.lowSupplies}
                        onCheckedChange={() => handleToggleChange("lowSupplies")}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Error Notifications</Label>
                    </div>
                    <div className="flex items-center">
                      <Switch 
                        checked={notificationSettings.errorNotifications}
                        onCheckedChange={() => handleToggleChange("errorNotifications")}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Maintenance Reminders</Label>
                    </div>
                    <div className="flex items-center">
                      <Switch 
                        checked={notificationSettings.maintenanceReminders}
                        onCheckedChange={() => handleToggleChange("maintenanceReminders")}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Report Frequency</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Daily Summary Reports</Label>
                    </div>
                    <div className="flex items-center">
                      <Switch 
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={() => handleToggleChange("dailyReports")}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Weekly Analytics Reports</Label>
                    </div>
                    <div className="flex items-center">
                      <Switch 
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={() => handleToggleChange("weeklyReports")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="printers" className="mt-0">
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>Printer Settings</CardTitle>
                <CardDescription>Configure global printer settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-Discovery</Label>
                    <p className="text-sm text-muted-foreground">Automatically detect new printers on the network</p>
                  </div>
                  <div className="flex items-center">
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Default Print Quality</Label>
                    <p className="text-sm text-muted-foreground">Set default quality for new printers</p>
                  </div>
                  <select 
                    className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="normal" selected>Normal</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Paper Save Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable duplex printing by default</p>
                  </div>
                  <div className="flex items-center">
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Offline Timeout</Label>
                    <p className="text-sm text-muted-foreground">Minutes to wait before marking a printer as offline</p>
                  </div>
                  <select 
                    className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="1">1 min</option>
                    <option value="5" selected>5 mins</option>
                    <option value="10">10 mins</option>
                    <option value="15">15 mins</option>
                    <option value="30">30 mins</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Lock size={16} />
                    <span>Change Password</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <div>
                      <Button variant="outline" className="w-full sm:w-auto">Update Password</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Shield size={16} />
                    <span>Two-Factor Authentication</span>
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Enhance your account security with two-factor authentication</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} />
                    <span>Login History</span>
                  </h3>
                  
                  <div className="border rounded-lg divide-y">
                    {[
                      { device: "Windows PC", browser: "Chrome", ip: "192.168.1.1", time: "Today, 10:45 AM" },
                      { device: "Macbook Pro", browser: "Safari", ip: "192.168.1.5", time: "Yesterday, 8:30 PM" },
                      { device: "iPhone 13", browser: "Safari Mobile", ip: "192.168.1.10", time: "Feb 15, 2023, 3:15 PM" },
                    ].map((session, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{session.device} - {session.browser}</p>
                          <p className="text-xs text-muted-foreground">IP: {session.ip}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{session.time}</p>
                          {index === 0 && (
                            <span className="text-xs text-green-600">Current session</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="system" className="mt-0">
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Data Backup</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic data backups</p>
                  </div>
                  <div className="flex items-center">
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Backup Frequency</Label>
                    <p className="text-sm text-muted-foreground">How often to backup system data</p>
                  </div>
                  <select 
                    className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly" selected>Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Data Retention</Label>
                    <p className="text-sm text-muted-foreground">How long to keep historical data</p>
                  </div>
                  <select 
                    className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="180" selected>6 months</option>
                    <option value="365">1 year</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">API Access</Label>
                    <p className="text-sm text-muted-foreground">Enable API access for third-party integration</p>
                  </div>
                  <div className="flex items-center">
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="pt-2">
                  <Button variant="destructive" className="w-full sm:w-auto">Reset System Defaults</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </>
    )
  }

  const MobileSettings = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mb-4 flex items-center justify-between">
          <span>
            {activeTab === "profile" && "Profile"}
            {activeTab === "notifications" && "Notifications"}
            {activeTab === "printers" && "Printers"}
            {activeTab === "security" && "Security"}
            {activeTab === "system" && "System"}
          </span>
          <SettingsIcon size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-4 py-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-4">
              {[
                { id: "profile", icon: User },
                { id: "notifications", icon: Bell },
                { id: "printers", icon: Printer },
                { id: "security", icon: Lock },
                { id: "system", icon: SettingsIcon }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex flex-col gap-1 py-2"
                  >
                    <Icon size={18} />
                    <span className="text-xs">{tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {renderTabContent()}
            </Tabs>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <motion.div 
      className="space-y-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
        </div>
        
        <Button onClick={handleSave} className="gap-2 hidden sm:flex">
          <Save size={16} />
          <span>Save Changes</span>
        </Button>
      </div>

      {isMobile && <MobileSettings />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {!isMobile && (
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="border-border/40 sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  orientation="vertical" 
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1 p-2">
                    {[
                      { id: "profile", label: "Profile", icon: User },
                      { id: "notifications", label: "Notifications", icon: Bell },
                      { id: "printers", label: "Printers", icon: Printer },
                      { id: "security", label: "Security", icon: Lock },
                      { id: "system", label: "System", icon: SettingsIcon }
                    ].map(tab => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger 
                          key={tab.id} 
                          value={tab.id}
                          className={cn(
                            "w-full justify-start gap-3 px-3 py-2",
                            activeTab === tab.id 
                              ? "bg-primary/10 text-primary" 
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          <Icon size={16} />
                          <span>{tab.label}</span>
                          {tab.id === "notifications" && (
                            <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <div className="lg:col-span-3 space-y-6">
                    <TabsContent value="profile" className="mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                          <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your account details and personal information</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                  id="name"
                                  name="name"
                                  value={profileForm.name}
                                  onChange={handleProfileChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={profileForm.email}
                                  onChange={handleProfileChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input 
                                  id="phone"
                                  name="phone"
                                  value={profileForm.phone}
                                  onChange={handleProfileChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input 
                                  id="company"
                                  name="company"
                                  value={profileForm.company}
                                  onChange={handleProfileChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input 
                                  id="role"
                                  name="role"
                                  value={profileForm.role}
                                  onChange={handleProfileChange}
                                  disabled
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                          <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Configure your account preferences</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="language" className="font-medium">Language</Label>
                                <p className="text-sm text-muted-foreground">Select your preferred language</p>
                              </div>
                              <select 
                                id="language" 
                                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              >
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="es">Spanish</option>
                                <option value="de">German</option>
                              </select>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Timezone</Label>
                                <p className="text-sm text-muted-foreground">Set your local timezone</p>
                              </div>
                              <select 
                                className="flex h-10 w-60 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              >
                                <option value="utc">UTC (GMT+0)</option>
                                <option value="est">Eastern Time (GMT-5)</option>
                                <option value="pst">Pacific Time (GMT-8)</option>
                                <option value="cet">Central European Time (GMT+1)</option>
                              </select>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">Enhance your account security</p>
                              </div>
                              <div className="flex items-center">
                                <Switch id="twofa" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                          <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Control what notifications you receive</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between pb-2">
                              <div>
                                <Label className="font-medium">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                              </div>
                              <div className="flex items-center">
                                <Switch 
                                  id="emailAlerts" 
                                  checked={notificationSettings.emailAlerts}
                                  onCheckedChange={() => handleToggleChange("emailAlerts")}
                                />
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <h3 className="text-sm font-medium">Event Types</h3>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-sm">Printer Offline Alerts</Label>
                                </div>
                                <div className="flex items-center">
                                  <Switch 
                                    checked={notificationSettings.printerOffline}
                                    onCheckedChange={() => handleToggleChange("printerOffline")}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-sm">Low Supplies Warning</Label>
                                </div>
                                <div className="flex items-center">
                                  <Switch 
                                    checked={notificationSettings.lowSupplies}
                                    onCheckedChange={() => handleToggleChange("lowSupplies")}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-sm">Error Notifications</Label>
                                </div>
                                <div className="flex items-center">
                                  <Switch 
                                    checked={notificationSettings.errorNotifications}
                                    onCheckedChange={() => handleToggleChange("errorNotifications")}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-sm">Maintenance Reminders</Label>
                                </div>
                                <div className="flex items-center">
                                  <Switch 
                                    checked={notificationSettings.maintenanceReminders}
                                    onCheckedChange={() => handleToggleChange("maintenanceReminders")}
                                  />
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <h3 className="text-sm font-medium">Report Frequency</h3>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-sm">Daily Summary Reports</Label>
                                </div>
                                <div className="flex items-center">
                                  <Switch 
                                    checked={notificationSettings.dailyReports}
                                    onCheckedChange={() => handleToggleChange("dailyReports")}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-sm">Weekly Analytics Reports</Label>
                                </div>
                                <div className="flex items-center">
                                  <Switch 
                                    checked={notificationSettings.weeklyReports}
                                    onCheckedChange={() => handleToggleChange("weeklyReports")}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="printers" className="mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                          <CardHeader>
                            <CardTitle>Printer Settings</CardTitle>
                            <CardDescription>Configure global printer settings</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Auto-Discovery</Label>
                                <p className="text-sm text-muted-foreground">Automatically detect new printers on the network</p>
                              </div>
                              <div className="flex items-center">
                                <Switch defaultChecked />
                              </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Default Print Quality</Label>
                                <p className="text-sm text-muted-foreground">Set default quality for new printers</p>
                              </div>
                              <select 
                                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              >
                                <option value="draft">Draft</option>
                                <option value="normal" selected>Normal</option>
                                <option value="high">High</option>
                                <option value="ultra">Ultra</option>
                              </select>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Paper Save Mode</Label>
                                <p className="text-sm text-muted-foreground">Enable duplex printing by default</p>
                              </div>
                              <div className="flex items-center">
                                <Switch defaultChecked />
                              </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Offline Timeout</Label>
                                <p className="text-sm text-muted-foreground">Minutes to wait before marking a printer as offline</p>
                              </div>
                              <select 
                                className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              >
                                <option value="1">1 min</option>
                                <option value="5" selected>5 mins</option>
                                <option value="10">10 mins</option>
                                <option value="15">15 mins</option>
                                <option value="30">30 mins</option>
                              </select>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="security" className="mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                          <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your account security</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium flex items-center gap-2">
                                <Lock size={16} />
                                <span>Change Password</span>
                              </h3>
                              
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="currentPassword">Current Password</Label>
                                  <Input id="currentPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="newPassword">New Password</Label>
                                  <Input id="newPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                  <Input id="confirmPassword" type="password" />
                                </div>
                                <div>
                                  <Button variant="outline" className="w-full sm:w-auto">Update Password</Button>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                              <h3 className="text-sm font-medium flex items-center gap-2">
                                <Shield size={16} />
                                <span>Two-Factor Authentication</span>
                              </h3>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Enhance your account security with two-factor authentication</p>
                                </div>
                                <Button variant="outline">Enable 2FA</Button>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                              <h3 className="text-sm font-medium flex items-center gap-2">
                                <Mail size={16} />
                                <span>Login History</span>
                              </h3>
                              
                              <div className="border rounded-lg divide-y">
                                {[
                                  { device: "Windows PC", browser: "Chrome", ip: "192.168.1.1", time: "Today, 10:45 AM" },
                                  { device: "Macbook Pro", browser: "Safari", ip: "192.168.1.5", time: "Yesterday, 8:30 PM" },
                                  { device: "iPhone 13", browser: "Safari Mobile", ip: "192.168.1.10", time: "Feb 15, 2023, 3:15 PM" },
                                ].map((session, index) => (
                                  <div key={index} className="p-3 flex justify-between items-center">
                                    <div>
                                      <p className="text-sm font-medium">{session.device} - {session.browser}</p>
                                      <p className="text-xs text-muted-foreground">IP: {session.ip}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-muted-foreground">{session.time}</p>
                                      {index === 0 && (
                                        <span className="text-xs text-green-600">Current session</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="system" className="mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-200">
                          <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                            <CardDescription>Configure global system settings</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Data Backup</Label>
                                <p className="text-sm text-muted-foreground">Enable automatic data backups</p>
                              </div>
                              <div className="flex items-center">
                                <Switch defaultChecked />
                              </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Backup Frequency</Label>
                                <p className="text-sm text-muted-foreground">How often to backup system data</p>
                              </div>
                              <select 
                                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              >
                                <option value="daily">Daily</option>
                                <option value="weekly" selected>Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Data Retention</Label>
                                <p className="text-sm text-muted-foreground">How long to keep historical data</p>
                              </div>
                              <select 
                                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              >
                                <option value="30">30 days</option>
                                <option value="90">90 days</option>
                                <option value="180" selected>6 months</option>
                                <option value="365">1 year</option>
                                <option value="forever">Forever</option>
                              </select>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">API Access</Label>
                                <p className="text-sm text-muted-foreground">Enable API access for third-party integration</p>
                              </div>
                              <div className="flex items-center">
                                <Switch defaultChecked />
                              </div>
                            </div>

                            <Separator />

                            <div className="pt-2">
                              <Button variant="destructive" className="w-full sm:w-auto">Reset System Defaults</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className={cn("space-y-6", isMobile ? "col-span-1" : "lg:col-span-3")}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {renderTabContent()}
          </Tabs>
        </div>
      </div>

      {isMobile && (
        <div className="fixed bottom-6 right-6 left-6 z-10">
          <Button onClick={handleSave} className="w-full gap-2 shadow-lg">
            <Save size={16} />
            <span>Save Changes</span>
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Settings;
