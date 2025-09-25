/**
 * Tools React Query Hooks
 * Custom hooks for tools-related API operations
 */

import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, useQueryClient } from '@tanstack/react-query';
import { toolsService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  Tool, 
  Category, 
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
      const response = await toolsService.getTools(params);
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
      const response = await toolsService.getToolById(id);
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

export const useToolCategories = (options?: QueryConfig) => {
  return useQuery({
    queryKey: QUERY_KEYS.TOOLS.CATEGORIES,
    queryFn: async () => {
      const response = await toolsService.getCategories();
      return response.data;
    },
    staleTime: options?.staleTime ?? 15 * 60 * 1000, // 15 minutes (categories don't change often)
    cacheTime: options?.cacheTime ?? 30 * 60 * 1000, // 30 minutes
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
      const response = await toolsService.searchTools(query, filters);
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
      const response = await toolsService.getFeaturedTools();
      return response.data;
    },
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime ?? 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useToolsByCategory = (
  categoryId: string,
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: ['tools', 'category', categoryId, params],
    queryFn: async () => {
      const response = await toolsService.getToolsByCategory(categoryId, params);
      return response.data;
    },
    enabled: options?.enabled ?? !!categoryId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const usePopularTools = (limit?: number, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['tools', 'popular', limit],
    queryFn: async () => {
      const response = await toolsService.getPopularTools(limit);
      return response.data;
    },
    staleTime: options?.staleTime ?? 15 * 60 * 1000, // 15 minutes
    cacheTime: options?.cacheTime ?? 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useRecommendedTools = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['tools', 'recommended'],
    queryFn: async () => {
      const response = await toolsService.getRecommendedTools();
      return response.data;
    },
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime ?? 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useToolStatistics = (toolId: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['tools', toolId, 'statistics'],
    queryFn: async () => {
      const response = await toolsService.getToolStatistics(toolId);
      return response.data;
    },
    enabled: options?.enabled ?? !!toolId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useSimilarTools = (
  toolId: string,
  limit?: number,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: ['tools', toolId, 'similar', limit],
    queryFn: async () => {
      const response = await toolsService.getSimilarTools(toolId, limit);
      return response.data;
    },
    enabled: options?.enabled ?? !!toolId,
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime ?? 20 * 60 * 1000, // 20 minutes
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
      const response = await toolsService.getTools({
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

// Prefetch utilities
export const usePrefetchTool = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.TOOLS.BY_ID(id),
      queryFn: async () => {
        const response = await toolsService.getToolById(id);
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

export const usePrefetchSimilarTools = () => {
  const queryClient = useQueryClient();

  return (toolId: string, limit?: number) => {
    queryClient.prefetchQuery({
      queryKey: ['tools', toolId, 'similar', limit],
      queryFn: async () => {
        const response = await toolsService.getSimilarTools(toolId, limit);
        return response.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };
};
