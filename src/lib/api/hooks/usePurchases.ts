/**
 * Purchases React Query Hooks
 * Custom hooks for purchase-related API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { purchasesService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  Purchase, 
  PurchaseRequest, 
  ChangeKeyRequest,
  PaginatedResponse, 
  PaginationParams,
  QueryConfig,
  MutationConfig 
} from '../types';
import { parseApiError } from '../errors';

// Query hooks
export const useUserPurchases = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PURCHASES.USER_PURCHASES, params],
    queryFn: async () => {
      const response = await purchasesService.getUserPurchases(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const usePurchaseById = (id: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: QUERY_KEYS.PURCHASES.BY_ID(id),
    queryFn: async () => {
      const response = await purchasesService.getPurchaseById(id);
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

export const usePurchaseHistory = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: ['purchases', 'history', params],
    queryFn: async () => {
      const response = await purchasesService.getPurchaseHistory(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const usePurchaseStatistics = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['purchases', 'statistics'],
    queryFn: async () => {
      const response = await purchasesService.getPurchaseStatistics();
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useActivePurchases = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['purchases', 'active'],
    queryFn: async () => {
      const response = await purchasesService.getActivePurchases();
      return response.data;
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useExpiredPurchases = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['purchases', 'expired'],
    queryFn: async () => {
      const response = await purchasesService.getExpiredPurchases();
      return response.data;
    },
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime ?? 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

// Mutation hooks
export const useCreatePurchase = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseData: PurchaseRequest): Promise<Purchase> => {
      const response = await purchasesService.createPurchase(purchaseData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch purchase-related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.USER_PURCHASES });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'statistics'] });
      
      // Invalidate user query to update balance
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });

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

export const useChangeKey = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ purchaseId, keyData }: { purchaseId: string; keyData: ChangeKeyRequest }): Promise<Purchase> => {
      const response = await purchasesService.changeKey(purchaseId, keyData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Update the specific purchase in cache
      queryClient.setQueryData(QUERY_KEYS.PURCHASES.BY_ID(variables.purchaseId), data);
      
      // Invalidate purchase lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.USER_PURCHASES });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'active'] });

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

export const useVerifyKey = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async ({ purchaseId, key }: { purchaseId: string; key: string }) => {
      const response = await purchasesService.verifyKey(purchaseId, key);
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

export const useRenewPurchase = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseId: string): Promise<Purchase> => {
      const response = await purchasesService.renewPurchase(purchaseId);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Update the specific purchase in cache
      queryClient.setQueryData(QUERY_KEYS.PURCHASES.BY_ID(variables), data);
      
      // Invalidate purchase lists and statistics
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.USER_PURCHASES });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'statistics'] });
      
      // Invalidate user query to update balance
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });

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

export const useCancelPurchase = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ purchaseId, reason }: { purchaseId: string; reason?: string }): Promise<void> => {
      const response = await purchasesService.cancelPurchase(purchaseId, reason);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate purchase queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.BY_ID(variables.purchaseId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.USER_PURCHASES });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'statistics'] });

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

export const useDownloadReceipt = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async (purchaseId: string) => {
      const response = await purchasesService.downloadReceipt(purchaseId);
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
