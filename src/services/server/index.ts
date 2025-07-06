
import { supabase } from '@/integrations/supabase/client';
import { ServerData } from '@/types/servers';

export const serverService = {
  async getAllServers(): Promise<ServerData[]> {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(server => ({
        id: server.id,
        name: server.name,
        hostname: server.hostname,
        ipAddress: server.ip_address,
        location: server.location,
        department: server.department,
        status: server.status as ServerData['status'],
        subStatus: server.sub_status,
        cpuUsage: server.cpu_usage,
        memoryUsage: server.memory_usage,
        diskUsage: server.disk_usage,
        uptime: server.uptime || '0 days',
        lastActive: server.last_active || new Date().toISOString(),
        operatingSystem: server.operating_system,
        serverType: server.server_type,
        addedDate: server.added_date,
        specs: server.specs as ServerData['specs']
      }));
    } catch (error) {
      console.error('Error fetching servers:', error);
      return [];
    }
  },

  async addServer(serverData: Omit<ServerData, 'id'>): Promise<ServerData | null> {
    try {
      const { data, error } = await supabase
        .from('servers')
        .insert({
          name: serverData.name,
          hostname: serverData.hostname,
          ip_address: serverData.ipAddress,
          location: serverData.location,
          department: serverData.department,
          status: serverData.status,
          sub_status: serverData.subStatus,
          cpu_usage: serverData.cpuUsage,
          memory_usage: serverData.memoryUsage,
          disk_usage: serverData.diskUsage,
          uptime: serverData.uptime,
          last_active: serverData.lastActive,
          operating_system: serverData.operatingSystem,
          server_type: serverData.serverType,
          specs: serverData.specs
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        hostname: data.hostname,
        ipAddress: data.ip_address,
        location: data.location,
        department: data.department,
        status: data.status as ServerData['status'],
        subStatus: data.sub_status,
        cpuUsage: data.cpu_usage,
        memoryUsage: data.memory_usage,
        diskUsage: data.disk_usage,
        uptime: data.uptime || '0 days',
        lastActive: data.last_active || new Date().toISOString(),
        operatingSystem: data.operating_system,
        serverType: data.server_type,
        addedDate: data.added_date,
        specs: data.specs as ServerData['specs']
      };
    } catch (error) {
      console.error('Error adding server:', error);
      return null;
    }
  },

  async removeServer(serverId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing server:', error);
      return false;
    }
  },

  async updateServer(serverId: string, updates: Partial<ServerData>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.hostname) updateData.hostname = updates.hostname;
      if (updates.ipAddress) updateData.ip_address = updates.ipAddress;
      if (updates.location) updateData.location = updates.location;
      if (updates.department !== undefined) updateData.department = updates.department;
      if (updates.status) updateData.status = updates.status;
      if (updates.subStatus !== undefined) updateData.sub_status = updates.subStatus;
      if (updates.cpuUsage !== undefined) updateData.cpu_usage = updates.cpuUsage;
      if (updates.memoryUsage !== undefined) updateData.memory_usage = updates.memoryUsage;
      if (updates.diskUsage !== undefined) updateData.disk_usage = updates.diskUsage;
      if (updates.uptime) updateData.uptime = updates.uptime;
      if (updates.lastActive) updateData.last_active = updates.lastActive;
      if (updates.operatingSystem) updateData.operating_system = updates.operatingSystem;
      if (updates.serverType) updateData.server_type = updates.serverType;
      if (updates.specs) updateData.specs = updates.specs;

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('servers')
        .update(updateData)
        .eq('id', serverId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating server:', error);
      return false;
    }
  }
};
