/**
 * Payments React Query Hooks
 * Custom hooks for payment-related API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  Payment, 
  DepositRequest,
  PaginatedResponse, 
  PaginationParams,
  QueryConfig,
  MutationConfig 
} from '../types';
import { parseApiError } from '../errors';

// Query hooks
export const usePayments = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PAYMENTS.ALL, params],
    queryFn: async () => {
      const response = await paymentsService.getPayments(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const usePaymentHistory = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PAYMENTS.HISTORY, params],
    queryFn: async () => {
      const response = await paymentsService.getPaymentHistory(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const usePaymentById = (id: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: async () => {
      const response = await paymentsService.getPaymentById(id);
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

export const useUserBalance = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['payments', 'balance'],
    queryFn: async () => {
      const response = await paymentsService.getUserBalance();
      return response.data;
    },
    staleTime: options?.staleTime ?? 1 * 60 * 1000, // 1 minute
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const usePaymentStatistics = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['payments', 'statistics'],
    queryFn: async () => {
      const response = await paymentsService.getPaymentStatistics();
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const usePendingPayments = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['payments', 'pending'],
    queryFn: async () => {
      const response = await paymentsService.getPendingPayments();
      return response.data;
    },
    staleTime: options?.staleTime ?? 30 * 1000, // 30 seconds for pending payments
    cacheTime: options?.cacheTime ?? 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useCompletedPayments = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['payments', 'completed'],
    queryFn: async () => {
      const response = await paymentsService.getCompletedPayments();
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useFailedPayments = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['payments', 'failed'],
    queryFn: async () => {
      const response = await paymentsService.getFailedPayments();
      return response.data;
    },
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes
    cacheTime: options?.cacheTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

// Mutation hooks
export const useCreateDeposit = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (depositData: DepositRequest): Promise<Payment> => {
      const response = await paymentsService.createDeposit(depositData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate payment-related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.HISTORY });
      queryClient.invalidateQueries({ queryKey: ['payments', 'statistics'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'pending'] });
      
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

export const useVerifyPayment = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await paymentsService.verifyPayment(paymentId);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate payment queries to reflect verification status
      queryClient.invalidateQueries({ queryKey: ['payments', variables] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL });
      queryClient.invalidateQueries({ queryKey: ['payments', 'pending'] });

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

export const useCancelPayment = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, reason }: { paymentId: string; reason?: string }): Promise<void> => {
      const response = await paymentsService.cancelPayment(paymentId, reason);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate payment queries
      queryClient.invalidateQueries({ queryKey: ['payments', variables.paymentId] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL });
      queryClient.invalidateQueries({ queryKey: ['payments', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'statistics'] });

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

export const useRefundPayment = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      paymentId, 
      amount, 
      reason 
    }: { 
      paymentId: string; 
      amount?: number; 
      reason?: string; 
    }): Promise<Payment> => {
      const response = await paymentsService.refundPayment(paymentId, amount, reason);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate payment queries
      queryClient.invalidateQueries({ queryKey: ['payments', variables.paymentId] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.HISTORY });
      queryClient.invalidateQueries({ queryKey: ['payments', 'statistics'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'balance'] });
      
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

export const useRetryPayment = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string): Promise<Payment> => {
      const response = await paymentsService.retryPayment(paymentId);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Update the specific payment in cache
      queryClient.setQueryData(['payments', variables], data);
      
      // Invalidate payment lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL });
      queryClient.invalidateQueries({ queryKey: ['payments', 'failed'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'pending'] });

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

export const useDownloadPaymentReceipt = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await paymentsService.downloadReceipt(paymentId);
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

export const useUpdatePaymentMethod = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodData: any): Promise<void> => {
      const response = await paymentsService.updatePaymentMethod(paymentMethodData);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate user query to update payment method info
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
