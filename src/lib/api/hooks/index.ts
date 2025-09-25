/**
 * API Hooks Index
 * Central export for all React Query hooks
 */

// Authentication hooks
export * from './useAuth';

// Tools hooks
export * from './useTools';

// Purchases hooks
export * from './usePurchases';

// Payments hooks
export * from './usePayments';

// Discount codes hooks
export * from './useDiscountCodes';

// Admin hooks
export * from './useAdmin';

// Common hook utilities
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../config';

/**
 * Hook to invalidate all user-related queries
 */
export const useInvalidateUserQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.USER_PURCHASES });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL });
  };
};

/**
 * Hook to clear all cached data
 */
export const useClearAllQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.clear();
  };
};

/**
 * Hook to prefetch commonly used data
 */
export const usePrefetchCommonData = () => {
  const queryClient = useQueryClient();

  return () => {
    // Prefetch tool categories
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.TOOLS.CATEGORIES,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });

    // Prefetch featured tools
    queryClient.prefetchQuery({
      queryKey: ['tools', 'featured'],
      staleTime: 10 * 60 * 1000, // 10 minutes
    });

    // Prefetch popular tools
    queryClient.prefetchQuery({
      queryKey: ['tools', 'popular'],
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };
};

/**
 * Hook to get query loading states
 */
export const useGlobalLoadingState = () => {
  const queryClient = useQueryClient();
  
  // This is a simplified version - you might want to implement more sophisticated logic
  const isFetching = queryClient.isFetching() > 0;
  const isMutating = queryClient.isMutating() > 0;
  
  return {
    isLoading: isFetching || isMutating,
    isFetching,
    isMutating,
  };
};
