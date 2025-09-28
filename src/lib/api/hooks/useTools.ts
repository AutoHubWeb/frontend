/**
 * Tools React Query Hooks
 * Custom hooks for tools-related API operations
 */

import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, useQueryClient } from '@tanstack/react-query';
import { toolService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  Tool, 
  PaginatedResponse, 
  PaginationParams, 
  SearchParams,
  QueryConfig 
} from '../types';
import { parseApiError } from '../errors';

// Query hooks
export const useTools = (
  params?: PaginationParams & SearchParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TOOLS.ALL, params],
    queryFn: async () => {
      const response = await toolService.getTools(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useToolById = (id: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: QUERY_KEYS.TOOLS.BY_ID(id),
    queryFn: async () => {
      const response = await toolService.getToolById(id);
      return response.data;
    },
    enabled: options?.enabled ?? !!id,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useToolsAdmin = (
  params?: SearchParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TOOLS.ADMIN, params],
    queryFn: async () => {
      const response = await toolService.getToolsAdmin(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useSearchTools = (
  query: string,
  filters?: SearchParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: ['tools', 'search', query, filters],
    queryFn: async () => {
      const response = await toolService.getTools({ ...filters, query });
      return response.data;
    },
    enabled: options?.enabled ?? !!query.trim(),
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes for search results
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useFeaturedTools = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['tools', 'featured'],
    queryFn: async () => {
      // Use regular tools endpoint with featured filter
      const response = await toolService.getTools({ query: 'featured' });
      return response.data;
    },
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime ?? 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const usePopularTools = (limit?: number, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['tools', 'popular', limit],
    queryFn: async () => {
      // Use regular tools endpoint with popular filter
      const response = await toolService.getTools({ 
        query: 'popular',
        limit: limit || 10
      });
      return response.data;
    },
    staleTime: options?.staleTime ?? 15 * 60 * 1000, // 15 minutes
    cacheTime: options?.cacheTime ?? 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

// Infinite query for pagination
export const useInfiniteTools = (
  params?: SearchParams,
  options?: Omit<UseInfiniteQueryOptions<PaginatedResponse<Tool>>, 'queryKey' | 'queryFn'>
) => {
  return useInfiniteQuery({
    queryKey: ['tools', 'infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await toolService.getTools({
        ...params,
        page: pageParam as number,
        limit: params?.limit || 20,
      });
      return response.data!;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.meta.hasPrevious ? firstPage.meta.page - 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

// Additional placeholder hooks for compatibility
export const useToolCategories = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['tools', 'categories'],
    queryFn: async () => {
      // Placeholder - categories can be derived from tools or implemented separately
      return [];
    },
    staleTime: options?.staleTime ?? 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};

export const useRecommendedTools = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['tools', 'recommended'],
    queryFn: async () => {
      // Use regular tools endpoint with recommended filter
      const response = await toolService.getTools({ 
        query: 'recommended',
        limit: 10
      });
      return response.data;
    },
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Prefetch utilities
export const usePrefetchTool = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.TOOLS.BY_ID(id),
      queryFn: async () => {
        const response = await toolService.getToolById(id);
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};
