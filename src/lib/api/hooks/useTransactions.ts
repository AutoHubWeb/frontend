/**
 * Transactions React Query Hooks
 * Custom hooks for transactions-related API operations
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { transactionService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  PaginationParams,
  QueryConfig
} from '../types';
import { TopUpApiResponse, UserTransactionsResponse } from '../services/transaction.service';

// Query hooks
export const useTopUpUsers = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTIONS.TOP_UP, params],
    queryFn: async () => {
      const response = await transactionService.getTopUpUsers(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};

export const useUserTransactions = (
  params?: PaginationParams,
  options?: QueryConfig
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTIONS.ME, params],
    queryFn: async () => {
      const response = await transactionService.getUserTransactions(params);
      return response.data;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 1,
    ...options,
  });
};
