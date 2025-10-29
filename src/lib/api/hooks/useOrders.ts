/**
 * Orders React Query Hooks
 * Custom hooks for order-related API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../config';
import { 
  CreateOrderRequest,
  OrderResponse,
  QueryConfig,
  MutationConfig 
} from '../types';
import { parseApiError } from '../errors';
import { orderService } from '../services/order.service';

// Query hooks
export const useUserOrders = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orderService.getUserOrders();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data || [];
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useOrderById = (id: string, options?: QueryConfig) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await orderService.getOrderById(id);
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

// Mutation hooks
export const useCreateOrder = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
      const response = await orderService.createOrder(orderData);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
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
