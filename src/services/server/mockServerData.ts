
import { ServerData } from '@/types/servers';

const generateMockServers = (): ServerData[] => {
  const serverNames = [
    'web-server-01', 'db-server-01', 'app-server-01', 'cache-server-01',
    'web-server-02', 'api-server-01', 'file-server-01', 'backup-server-01'
  ];
  
  const locations = ['Data Center A', 'Data Center B', 'Cloud AWS', 'Cloud Azure'];
  const departments = ['IT', 'Development', 'Operations', 'Security'];
  const statuses: ServerData['status'][] = ['online', 'online', 'online', 'warning', 'offline'];
  const serverTypes = ['Web Server', 'Database', 'Application', 'Cache', 'API', 'File Storage', 'Backup'];
  const operatingSystems = ['Ubuntu 20.04', 'CentOS 8', 'Windows Server 2019', 'Red Hat Enterprise Linux'];

  return serverNames.map((name, index) => ({
    id: `server-${index + 1}`,
    name,
    hostname: name.replace('-', ''),
    ipAddress: `192.168.1.${10 + index}`,
    location: locations[index % locations.length],
    department: departments[index % departments.length],
    status: statuses[index % statuses.length],
    subStatus: index === 3 ? 'High CPU usage detected' : undefined,
    cpuUsage: Math.floor(Math.random() * 100),
    memoryUsage: Math.floor(Math.random() * 100),
    diskUsage: Math.floor(Math.random() * 100),
    uptime: `${Math.floor(Math.random() * 365)} days`,
    lastActive: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
    operatingSystem: operatingSystems[index % operatingSystems.length],
    serverType: serverTypes[index % serverTypes.length],
    addedDate: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
    specs: {
      cpu: ['Intel Xeon E5-2670', 'AMD EPYC 7551', 'Intel Core i7-9700K'][index % 3],
      ram: ['16GB DDR4', '32GB DDR4', '64GB DDR4'][index % 3],
      storage: ['500GB SSD', '1TB NVMe', '2TB HDD'][index % 3]
    }
  }));
};

export const mockServers = generateMockServers();

export const getServerById = (id: string): ServerData | undefined => {
  return mockServers.find(server => server.id === id);
};
