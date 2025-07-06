
import React, { useState } from 'react';
import { ServerData } from '@/types/servers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditServerDialogProps {
  server: ServerData;
  onUpdateServer: (serverData: ServerData) => void;
  onClose: () => void;
}

const EditServerDialog: React.FC<EditServerDialogProps> = ({
  server,
  onUpdateServer,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: server.name,
    hostname: server.hostname,
    ipAddress: server.ipAddress,
    location: server.location,
    department: server.department || '',
    status: server.status,
    operatingSystem: server.operatingSystem,
    serverType: server.serverType
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedServer: ServerData = {
      ...server,
      ...formData
    };
    
    onUpdateServer(updatedServer);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Server</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Server Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="hostname">Hostname</Label>
            <Input
              id="hostname"
              value={formData.hostname}
              onChange={(e) => handleInputChange('hostname', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              value={formData.ipAddress}
              onChange={(e) => handleInputChange('ipAddress', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="QA">QA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as ServerData['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="operatingSystem">Operating System</Label>
            <Input
              id="operatingSystem"
              value={formData.operatingSystem}
              onChange={(e) => handleInputChange('operatingSystem', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="serverType">Server Type</Label>
            <Input
              id="serverType"
              value={formData.serverType}
              onChange={(e) => handleInputChange('serverType', e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Server
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerDialog;
