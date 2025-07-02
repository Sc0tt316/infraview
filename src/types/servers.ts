
export interface ServerData {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  location: string;
  department?: string;
  status: 'online' | 'offline' | 'error' | 'warning' | 'maintenance';
  subStatus?: string;
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage  
  diskUsage: number; // percentage
  uptime: string;
  lastActive: string;
  operatingSystem: string;
  serverType: string; // web, database, application, etc.
  addedDate?: string;
  specs?: {
    cpu: string;
    ram: string;
    storage: string;
  };
}
