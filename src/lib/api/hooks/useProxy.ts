/**
 * Proxy React Query Hooks
 * Custom hooks for proxy-related API operations
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { proxyService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  QueryConfig
} from '../types';

// Query hooks
export const useProxies = (
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROXY.LIST,
    queryFn: async () => {
      const response = await proxyService.getProxies();
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};
