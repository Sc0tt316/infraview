
import { ServerData } from '@/types/servers';
import { supabase } from '@/integrations/supabase/client';

const serverNames = [
  'PROD-WEB-01', 'PROD-WEB-02', 'PROD-DB-01', 'PROD-DB-02',
  'DEV-WEB-01', 'DEV-DB-01', 'TEST-API-01', 'STAGING-WEB-01',
  'BACKUP-SRV-01', 'MAIL-SRV-01', 'DNS-SRV-01', 'PROXY-SRV-01',
  'MONITOR-SRV-01', 'LOG-SRV-01', 'CACHE-SRV-01', 'FILE-SRV-01'
];

const hostnames = [
  'web-server-prod-01.company.com', 'web-server-prod-02.company.com',
  'database-prod-01.company.com', 'database-prod-02.company.com',
  'dev-web-01.company.com', 'dev-db-01.company.com',
  'test-api-01.company.com', 'staging-web-01.company.com',
  'backup-01.company.com', 'mail-01.company.com',
  'dns-01.company.com', 'proxy-01.company.com',
  'monitor-01.company.com', 'log-01.company.com',
  'cache-01.company.com', 'file-01.company.com'
];

const locations = [
  'Data Center A - Rack 1', 'Data Center A - Rack 2', 'Data Center A - Rack 3',
  'Data Center B - Rack 1', 'Data Center B - Rack 2', 'Data Center C - Rack 1',
  'Office Building - Server Room', 'Cloud - AWS US-East-1', 'Cloud - AWS US-West-2',
  'Cloud - Azure Central US', 'Edge Location - NYC', 'Edge Location - LA'
];

const departments = ['IT', 'Development', 'Operations', 'Security', 'QA'];

const operatingSystems = [
  'Ubuntu 22.04 LTS', 'CentOS 8', 'Red Hat Enterprise Linux 9',
  'Windows Server 2022', 'Windows Server 2019', 'Debian 11',
  'SUSE Linux Enterprise 15', 'Rocky Linux 9'
];

const serverTypes = [
  'Web Server', 'Database Server', 'Application Server', 'File Server',
  'Mail Server', 'DNS Server', 'Proxy Server', 'Backup Server',
  'Monitoring Server', 'Log Server', 'Cache Server'
];

const statuses: ServerData['status'][] = ['online', 'offline', 'warning', 'error', 'maintenance'];

const generateSpecs = () => {
  const cpuCores = [4, 8, 16, 32, 64][Math.floor(Math.random() * 5)];
  const ramGB = [8, 16, 32, 64, 128, 256][Math.floor(Math.random() * 6)];
  const storageGB = [500, 1000, 2000, 4000, 8000][Math.floor(Math.random() * 5)];
  
  return {
    cpu: `${cpuCores} vCPU`,
    ram: `${ramGB} GB RAM`,
    storage: `${storageGB} GB SSD`,
    network: '1 Gbps'
  };
};

const generateUptime = () => {
  const days = Math.floor(Math.random() * 365);
  const hours = Math.floor(Math.random() * 24);
  return `${days} days, ${hours} hours`;
};

const generateIPAddress = () => {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

export const generateMockServerData = (count: number = 12): ServerData[] => {
  const servers: ServerData[] = [];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isOnline = status === 'online';
    
    const server: ServerData = {
      id: `server-${i + 1}-${Date.now()}`,
      name: serverNames[i % serverNames.length],
      hostname: hostnames[i % hostnames.length],
      ipAddress: generateIPAddress(),
      location: locations[Math.floor(Math.random() * locations.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status,
      subStatus: isOnline ? 'Running normally' : status === 'maintenance' ? 'Scheduled maintenance' : 'Connection lost',
      cpuUsage: isOnline ? Math.floor(Math.random() * 100) : 0,
      memoryUsage: isOnline ? Math.floor(Math.random() * 100) : 0,
      diskUsage: isOnline ? Math.floor(Math.random() * 100) : 0,
      uptime: isOnline ? generateUptime() : '0 days',
      lastActive: isOnline 
        ? new Date().toISOString() 
        : new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      operatingSystem: operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
      serverType: serverTypes[Math.floor(Math.random() * serverTypes.length)],
      addedDate: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      specs: generateSpecs()
    };
    
    servers.push(server);
  }
  
  return servers;
};

export const clearAndRegenerateServerData = async () => {
  try {
    // Clear existing servers
    const { error: deleteError } = await supabase
      .from('servers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('Error clearing servers:', deleteError);
      return false;
    }
    
    // Generate new mock data
    const newServers = generateMockServerData(15);
    
    // Insert new servers
    const { error: insertError } = await supabase
      .from('servers')
      .insert(newServers.map(server => ({
        name: server.name,
        hostname: server.hostname,
        ip_address: server.ipAddress,
        location: server.location,
        department: server.department,
        status: server.status,
        sub_status: server.subStatus,
        cpu_usage: server.cpuUsage,
        memory_usage: server.memoryUsage,
        disk_usage: server.diskUsage,
        uptime: server.uptime,
        last_active: server.lastActive,
        operating_system: server.operatingSystem,
        server_type: server.serverType,
        added_date: server.addedDate,
        specs: server.specs
      })));
    
    if (insertError) {
      console.error('Error inserting servers:', insertError);
      return false;
    }
    
    console.log('Successfully regenerated server data');
    return true;
  } catch (error) {
    console.error('Error regenerating server data:', error);
    return false;
  }
};
