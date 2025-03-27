
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BellIcon, 
  UserIcon, 
  SettingsIcon, 
  LockIcon, 
  BellRingIcon, 
  LogOutIcon,
  CreditCardIcon,
  GlobeIcon,
  ShieldIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-2"
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </motion.div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8">
        {/* Mobile Menu Button - Shown only on small screens */}
        <div className="lg:hidden flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-full mb-4 flex items-center justify-between"
          >
            <span>Navigation</span>
            <MenuIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation Menu - Sheet component */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">Settings</h3>
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Side Navigation */}
        <div className="hidden lg:block">
          <Card className="w-[240px]">
            <CardContent className="p-4">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area - Now left empty as requested */}
        <div className="flex-1">
          <Card className="border-none shadow-none">
            <CardContent className="p-0 sm:p-6">
              {/* All content has been removed as requested */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Settings navigation items
const navigation = [
  { id: 'account', label: 'Account', icon: UserIcon },
  { id: 'appearance', label: 'Appearance', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'security', label: 'Security', icon: ShieldIcon },
  { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  { id: 'integrations', label: 'Integrations', icon: GlobeIcon }
];

export default SettingsPage;
