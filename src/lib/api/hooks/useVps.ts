/**
 * VPS React Query Hooks
 * Custom hooks for VPS-related API operations
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../config';
import { 
  VPS,
  PaginatedResponse,
  QueryConfig,
  MutationConfig 
} from '../types';
import { parseApiError } from '../errors';
import { vpsService } from '../services/vps.service';

// Query hooks
export const useVpsPlans = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['vps'],
    queryFn: async () => {
      const response = await vpsService.getVpsPlans();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data!;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useVpsById = (id: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['vps', id],
    queryFn: async () => {
      const response = await vpsService.getVpsById(id);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    enabled: options?.enabled ?? !!id,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    ...options,
  });
};
