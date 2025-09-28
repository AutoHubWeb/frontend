/**
 * Admin React Query Hooks
 * Custom hooks for admin-related API operations
 * Note: Placeholder implementation - will be integrated with actual admin endpoints
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  User,
  AdminStatistics,
  KeyValidation,
  PaginatedResponse, 
  PaginationParams,
  QueryConfig,
  MutationConfig,
  UserFilters,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateBalanceRequest,
  ResetPasswordRequest
} from '../types';
import { parseApiError } from '../errors';

// User management hooks (using the new userService)
export const useAdminUsers = (
  filters?: UserFilters,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS.LIST(filters)],
    queryFn: async () => {
      const response = await userService.getUsers(filters);
      return response.data;
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useCreateUser = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserRequest): Promise<User> => {
      const response = await userService.createUser(userData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
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

export const useUpdateUser = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: UpdateUserRequest }): Promise<User> => {
      const response = await userService.updateUser(userId, userData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(variables.userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
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

export const useLockUser = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await userService.lockUser(userId);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(variables) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
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

export const useUnlockUser = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await userService.unlockUser(userId);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(variables) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
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
    mutationFn: async (userId: string) => {
      const response = await userService.deleteUser(userId);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(variables) });
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

export const useUpdateUserBalance = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, balanceData }: { userId: string; balanceData: UpdateBalanceRequest }) => {
      const response = await userService.updateUserBalance(userId, balanceData);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(variables.userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
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

export const useResetUserPassword = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, passwordData }: { userId: string; passwordData: ResetPasswordRequest }) => {
      const response = await userService.resetUserPassword(userId, passwordData);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
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

// Placeholder hooks for other admin functionality
export const useAdminStatistics = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['admin', 'statistics'],
    queryFn: async () => {
      // Placeholder implementation
      return {
        totalUsers: 0,
        totalTools: 0,
        totalPurchases: 0,
        totalRevenue: 0,
        recentUsers: [],
        recentPurchases: [],
      } as AdminStatistics;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    ...options,
  });
};

export const useKeyValidations = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['admin', 'validations'],
    queryFn: async () => {
      // Placeholder implementation
      return [] as KeyValidation[];
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000,
    ...options,
  });
};

// Additional placeholder hooks for legacy compatibility
export const useRevenueStatistics = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['admin', 'revenue', 'statistics'],
    queryFn: async () => {
      return { totalRevenue: 0, monthlyRevenue: [], revenueGrowth: 0 };
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    ...options,
  });
};

export const useUserActivityStatistics = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['admin', 'user', 'activity'],
    queryFn: async () => {
      return { activeUsers: 0, newUsers: 0, userGrowth: 0 };
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000,
    ...options,
  });
};

export const useAdminUserById = (userId: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.BY_ID(userId),
    queryFn: async () => {
      // This would typically call userService.getUserById when implemented
      return null;
    },
    enabled: options?.enabled ?? !!userId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    ...options,
  });
};
