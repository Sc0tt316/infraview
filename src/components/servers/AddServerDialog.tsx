
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddServerDialogProps {
  onAddServer: (serverData: any) => void;
}

const AddServerDialog: React.FC<AddServerDialogProps> = ({
  onAddServer
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    hostname: '',
    ipAddress: '',
    location: '',
    department: '',
    serverType: '',
    operatingSystem: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.hostname || !formData.ipAddress) {
      return;
    }

    const newServer = {
      id: `server-${Date.now()}`,
      ...formData,
      status: 'offline' as const,
      cpuUsage: 0, // Set to 0
      memoryUsage: 0, // Set to 0
      diskUsage: 0, // Set to 0
      uptime: '0 days',
      lastActive: new Date().toLocaleString(),
      addedDate: new Date().toISOString(),
      specs: {
        cpu: 'Intel Xeon',
        ram: '16GB DDR4',
        storage: '500GB SSD'
      }
    };

    onAddServer(newServer);
    setIsOpen(false);
    setFormData({
      name: '',
      hostname: '',
      ipAddress: '',
      location: '',
      department: '',
      serverType: '',
      operatingSystem: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-[9px]">
          Add Server
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Server</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Server Name *</Label>
            <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="web-server-01" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hostname">Hostname *</Label>
            <Input id="hostname" value={formData.hostname} onChange={e => handleInputChange('hostname', e.target.value)} placeholder="webserver-01" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ipAddress">IP Address *</Label>
            <Input id="ipAddress" value={formData.ipAddress} onChange={e => handleInputChange('ipAddress', e.target.value)} placeholder="192.168.1.10" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} placeholder="Data Center A" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={value => handleInputChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serverType">Server Type</Label>
            <Select value={formData.serverType} onValueChange={value => handleInputChange('serverType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select server type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web Server">Web Server</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="Application">Application</SelectItem>
                <SelectItem value="File Server">File Server</SelectItem>
                <SelectItem value="Mail Server">Mail Server</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="operatingSystem">Operating System</Label>
            <Select value={formData.operatingSystem} onValueChange={value => handleInputChange('operatingSystem', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select OS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ubuntu 20.04">Ubuntu 20.04</SelectItem>
                <SelectItem value="Ubuntu 22.04">Ubuntu 22.04</SelectItem>
                <SelectItem value="CentOS 8">CentOS 8</SelectItem>
                <SelectItem value="Windows Server 2019">Windows Server 2019</SelectItem>
                <SelectItem value="Windows Server 2022">Windows Server 2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Server
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServerDialog;
