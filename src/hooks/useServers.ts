
import { useState, useEffect } from 'react';
import { serverService } from '@/services/server';
import { ServerData } from '@/types/servers';

export const useServers = () => {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServers = async () => {
    setIsLoading(true);
    try {
      const data = await serverService.getAllServers();
      setServers(data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const refetchServers = async () => {
    await fetchServers();
  };

  return {
    servers,
    isLoading,
    error: null,
    refetch: refetchServers,
    refetchServers
  };
};
