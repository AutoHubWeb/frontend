/**
 * Discount Codes React Query Hooks
 * Custom hooks for discount code-related API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { discountCodesService } from '../services';
import { 
  DiscountCode, 
  ValidateDiscountRequest,
  PaginatedResponse, 
  PaginationParams,
  QueryConfig,
  MutationConfig 
} from '../types';
import { parseApiError } from '../errors';

// Query hooks
export const useDiscountCodes = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: ['discount-codes', params],
    queryFn: async () => {
      const response = await discountCodesService.getDiscountCodes(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useDiscountCodeById = (id: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['discount-codes', id],
    queryFn: async () => {
      const response = await discountCodesService.getDiscountCodeById(id);
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

export const useActiveDiscountCodes = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['discount-codes', 'active'],
    queryFn: async () => {
      const response = await discountCodesService.getActiveDiscountCodes();
      return response.data;
    },
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime ?? 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useExpiredDiscountCodes = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['discount-codes', 'expired'],
    queryFn: async () => {
      const response = await discountCodesService.getExpiredDiscountCodes();
      return response.data;
    },
    staleTime: options?.staleTime ?? 15 * 60 * 1000, // 15 minutes
    cacheTime: options?.cacheTime ?? 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useDiscountCodeStatistics = (id: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['discount-codes', id, 'statistics'],
    queryFn: async () => {
      const response = await discountCodesService.getDiscountCodeStatistics(id);
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

export const useUserDiscountCodes = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['discount-codes', 'user'],
    queryFn: async () => {
      const response = await discountCodesService.getUserDiscountCodes();
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

// Mutation hooks
export const useValidateDiscountCode = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async (codeData: ValidateDiscountRequest): Promise<DiscountCode> => {
      const response = await discountCodesService.validateDiscountCode(codeData);
      return response.data!;
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

export const useCreateDiscountCode = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (codeData: Partial<DiscountCode>): Promise<DiscountCode> => {
      const response = await discountCodesService.createDiscountCode(codeData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate discount code queries
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
      queryClient.invalidateQueries({ queryKey: ['discount-codes', 'active'] });

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

export const useUpdateDiscountCode = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, codeData }: { id: string; codeData: Partial<DiscountCode> }): Promise<DiscountCode> => {
      const response = await discountCodesService.updateDiscountCode(id, codeData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Update the specific discount code in cache
      queryClient.setQueryData(['discount-codes', variables.id], data);
      
      // Invalidate discount code lists
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
      queryClient.invalidateQueries({ queryKey: ['discount-codes', 'active'] });

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

export const useDeleteDiscountCode = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await discountCodesService.deleteDiscountCode(id);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Remove the specific discount code from cache
      queryClient.removeQueries({ queryKey: ['discount-codes', variables] });
      
      // Invalidate discount code lists
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
      queryClient.invalidateQueries({ queryKey: ['discount-codes', 'active'] });

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

export const useBulkCreateDiscountCodes = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (codes: Partial<DiscountCode>[]): Promise<DiscountCode[]> => {
      const response = await discountCodesService.bulkCreateDiscountCodes(codes);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate discount code queries
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
      queryClient.invalidateQueries({ queryKey: ['discount-codes', 'active'] });

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

export const useApplyDiscountCode = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async ({ code, toolId }: { code: string; toolId: string }) => {
      const response = await discountCodesService.applyDiscountCode(code, toolId);
      return response.data!;
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
