'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useLogin, 
  useRegister, 
  useLogout, 
  useRefreshToken, 
  useUpdateProfile, 
  useChangePassword,
  tokenManager
} from '@/lib/api';
import type { AuthContextType, LoginRequest, RegisterRequest, JWTTokens, ExternalUser } from '@shared/authTypes';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Initialize auth state from localStorage
  const [tokens, setTokensState] = useState<JWTTokens | null>(tokenManager.getTokens());
  const [user, setUserState] = useState<ExternalUser | null>(tokenManager.getUser());

  // Use new API hooks
  const loginMutation = useLogin({
    onSuccess: (data) => {
      const newTokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
      setTokensState(newTokens);
      setUserState(data.user);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      throw error;
    },
  });

  const registerMutation = useRegister({
    onSuccess: (data) => {
      const newTokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
      setTokensState(newTokens);
      setUserState(data.user);
    },
    onError: (error) => {
      console.error('Register failed:', error);
      throw error;
    },
  });

  const logoutMutation = useLogout({
    onSuccess: () => {
      setTokensState(null);
      setUserState(null);
    },
  });

  const refreshTokenMutation = useRefreshToken({
    onSuccess: (data) => {
      const newTokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
      setTokensState(newTokens);
    },
    onError: () => {
      // If refresh fails, clear everything
      handleLogout();
    },
  });

  const updateProfileMutation = useUpdateProfile({
    onSuccess: (data) => {
      tokenManager.setUser(data);
      setUserState(data);
    },
  });

  const changePasswordMutation = useChangePassword();

  // Logout function
  const handleLogout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  // Refresh token function
  const handleRefreshToken = async (): Promise<boolean> => {
    if (!tokens?.refreshToken) return false;
    
    try {
      await refreshTokenMutation.mutateAsync(tokens.refreshToken);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Initialize authentication on app start
  useEffect(() => {
    const initAuth = async () => {
      const storedTokens = tokenManager.getTokens();
      const storedUser = tokenManager.getUser();

      if (storedTokens && storedUser) {
        setTokensState(storedTokens);
        setUserState(storedUser);

        // Try to verify the token by fetching user data
        try {
          // Use the new API client for token verification
          // This will be handled by the useCurrentUser hook in the future
          // For now, we'll just trust the stored tokens
          console.log('Auth initialized with stored tokens');
        } catch (error) {
          console.error('Auth initialization failed:', error);
          await handleLogout();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [handleLogout]);

  const contextValue: AuthContextType = {
    user,
    tokens,
    login: async (credentials: LoginRequest) => {
      await loginMutation.mutateAsync(credentials);
    },
    register: async (data: RegisterRequest) => {
      await registerMutation.mutateAsync(data);
    },
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    updateProfile: async (data: { fullname?: string; phone?: string }) => {
      await updateProfileMutation.mutateAsync(data);
    },
    changePassword: async (data: { oldPassword: string; newPassword: string }) => {
      await changePasswordMutation.mutateAsync(data);
    },
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated: !!user && !!tokens,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
