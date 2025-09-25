/**
 * Authentication React Query Hooks
 * Custom hooks for authentication-related API operations
 */

import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { authService } from '../services';
import { QUERY_KEYS } from '../config';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse,
  QueryConfig,
  MutationConfig 
} from '../types';
import { parseApiError, getErrorToastConfig } from '../errors';
import { tokenManager } from '../client';

// Query hooks
export const useCurrentUser = (options?: QueryConfig) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.USER,
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data;
    },
    enabled: options?.enabled ?? !!tokenManager.getTokens(),
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? false,
    ...options,
  });
};

// Mutation hooks
export const useLogin = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await authService.login(credentials);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Store tokens and user data
      tokenManager.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      tokenManager.setUser(data.user);

      // Update React Query cache
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, data.user);
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

export const useRegister = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterRequest): Promise<RegisterResponse> => {
      const response = await authService.register(userData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Store tokens and user data
      tokenManager.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      tokenManager.setUser(data.user);

      // Update React Query cache
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, data.user);
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

export const useLogout = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await authService.logout();
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      }
    },
    onSuccess: (data, variables, context) => {
      // Clear tokens and user data
      tokenManager.clearAll();

      // Clear React Query cache
      queryClient.clear();
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, null);

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

export const useRefreshToken = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (refreshToken: string) => {
      const response = await authService.refreshToken({ refreshToken });
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Update tokens
      tokenManager.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      // Invalidate user query to refetch with new token
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });

      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      // If refresh fails, clear everything and redirect to login
      tokenManager.clearAll();
      queryClient.clear();
      
      const apiError = parseApiError(error);
      options?.onError?.(apiError);
    },
    onSettled: options?.onSettled,
    retry: options?.retry ?? false,
  });
};

export const useUpdateProfile = (options?: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileRequest): Promise<User> => {
      const response = await authService.updateProfile(profileData);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      // Update user in storage and cache
      tokenManager.setUser(data);
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, data);
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

export const useChangePassword = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async (passwordData: ChangePasswordRequest): Promise<void> => {
      const response = await authService.changePassword(passwordData);
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

export const useVerifyToken = (options?: QueryConfig) => {
  return useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: async () => {
      const response = await authService.verifyToken();
      return response.data;
    },
    enabled: options?.enabled ?? false,
    staleTime: options?.staleTime ?? 0,
    cacheTime: options?.cacheTime ?? 0,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? false,
    ...options,
  });
};

export const useRequestPasswordReset = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      const response = await authService.requestPasswordReset(email);
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

export const useResetPassword = (options?: MutationConfig) => {
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }): Promise<void> => {
      const response = await authService.resetPassword(token, newPassword);
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
