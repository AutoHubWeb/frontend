/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  User,
  ApiResponse 
} from '../types';

export class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Refresh authentication tokens
   */
  async refreshToken(refreshTokenData: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    return apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, refreshTokenData);
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.USER);
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>(API_ENDPOINTS.AUTH.PROFILE, profileData);
  }

  /**
   * Change user password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.put<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
  }

  /**
   * Verify user token
   */
  async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    return apiClient.get<{ valid: boolean }>('/api/auth/verify');
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/auth/forgot-password', { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/auth/reset-password', { token, newPassword });
  }
}

// Export singleton instance
export const authService = new AuthService();
