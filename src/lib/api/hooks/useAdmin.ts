/**
 * Admin React Query Hooks
 * Custom hooks for admin-related API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  User, 
  Tool, 
  Category,
  AdminStatistics, 
  KeyValidation,
  PaginatedResponse, 
  PaginationParams,
  QueryConfig,
  MutationConfig 
} from '../types';
import { parseApiError } from '../errors';

// Query hooks - Statistics
export const useAdminStatistics = (options?: QueryConfig) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.STATISTICS,
    queryFn: async () => {
      const response = await adminService.getStatistics();
      return response.data;
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useRevenueStatistics = (period?: 'day' | 'week' | 'month' | 'year', options?: QueryConfig) => {
  return useQuery({
    queryKey: ['admin', 'revenue', period],
    queryFn: async () => {
      const response = await adminService.getRevenueStatistics(period);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useUserActivityStatistics = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['admin', 'user-activity'],
    queryFn: async () => {
      const response = await adminService.getUserActivityStatistics();
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

// Query hooks - Users Management
export const useAdminUsers = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.USERS, params],
    queryFn: async () => {
      const response = await adminService.getUsers(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useAdminUserById = (id: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: async () => {
      const response = await adminService.getUserById(id);
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

// Query hooks - Tools Management
export const useAdminTools = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.TOOLS, params],
    queryFn: async () => {
      const response = await adminService.getTools(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useAdminCategories = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: ['admin', 'categories', params],
    queryFn: async () => {
      const response = await adminService.getCategories(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime ?? 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

// Query hooks - Key Validations
export const useKeyValidations = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.VALIDATIONS, params],
    queryFn: async () => {
      const response = await adminService.getKeyValidations(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 1 * 60 * 1000, // 1 minute
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

// Query hooks - System
export const useSystemLogs = (
  params?: PaginationParams & { level?: string; module?: string },
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: ['admin', 'logs', params],
    queryFn: async () => {
      const response = await adminService.getSystemLogs(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 30 * 1000, // 30 seconds
    cacheTime: options?.cacheTime ?? 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useSystemSettings = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await adminService.getSystemSettings();
      return response.data;
    },
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime ?? 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

// Mutation hooks - User Management
export const useUpdateUser = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: Partial<User> }): Promise<User> => {
      const response = await adminService.updateUser(id, userData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Update user in cache
      queryClient.setQueryData(['admin', 'users', variables.id], data);
      
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.USERS });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useDeleteUser = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await adminService.deleteUser(id);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ['admin', 'users', variables] });
      
      // Invalidate user lists and statistics
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATISTICS });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useBanUser = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }): Promise<void> => {
      const response = await adminService.banUser(id, reason);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.id] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.USERS });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useUnbanUser = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await adminService.unbanUser(id);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.USERS });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

// Mutation hooks - Tools Management
export const useCreateTool = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (toolData: Partial<Tool>): Promise<Tool> => {
      const response = await adminService.createTool(toolData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate tool queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TOOLS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOOLS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATISTICS });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useUpdateTool = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, toolData }: { id: string; toolData: Partial<Tool> }): Promise<Tool> => {
      const response = await adminService.updateTool(id, toolData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Update tool in cache
      queryClient.setQueryData(QUERY_KEYS.TOOLS.BY_ID(variables.id), data);
      
      // Invalidate tool lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TOOLS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOOLS.ALL });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useDeleteTool = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await adminService.deleteTool(id);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Remove tool from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.TOOLS.BY_ID(variables) });
      
      // Invalidate tool lists and statistics
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TOOLS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOOLS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATISTICS });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

// Mutation hooks - Categories Management
export const useCreateCategory = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: Partial<Category>): Promise<Category> => {
      const response = await adminService.createCategory(categoryData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate category queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOOLS.CATEGORIES });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useUpdateCategory = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, categoryData }: { id: string; categoryData: Partial<Category> }): Promise<Category> => {
      const response = await adminService.updateCategory(id, categoryData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate category queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOOLS.CATEGORIES });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useDeleteCategory = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await adminService.deleteCategory(id);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate category queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOOLS.CATEGORIES });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

// Mutation hooks - System
export const useCreateKeyValidation = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (validationData: Partial<KeyValidation>): Promise<KeyValidation> => {
      const response = await adminService.createKeyValidation(validationData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate validation queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.VALIDATIONS });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useUpdateSystemSettings = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Record<string, any>): Promise<void> => {
      const response = await adminService.updateSystemSettings(settings);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate system settings query
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useExportData = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async ({ type, format }: { type: 'users' | 'tools' | 'purchases' | 'payments'; format: 'csv' | 'json' }) => {
      const response = await adminService.exportData(type, format);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Open download URL in new tab
      window.open(data.downloadUrl, '_blank');
      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useImportData = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, file }: { type: 'users' | 'tools'; file: File }) => {
      const response = await adminService.importData(type, file);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries based on import type
      if (variables.type === 'users') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.USERS });
      } else if (variables.type === 'tools') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TOOLS });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOOLS.ALL });
      }
      
      // Invalidate statistics
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATISTICS });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};
