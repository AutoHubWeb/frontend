/**
 * User Management API Service
 * Handles all user management-related API calls (admin functions)
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  User,
  ApiResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateBalanceRequest,
  ResetPasswordRequest,
  PaginatedResponse,
  UserFilters
} from '../types';

export class UserService {
  /**
   * Create new user (admin only)
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>(API_ENDPOINTS.USERS.BASE, userData);
  }

  /**
   * Get list of users with optional filters (admin only)
   */
  async getUsers(filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<User>>> {
    const params = new URLSearchParams();
    
    if (filters?.filter) {
      params.append('filter', JSON.stringify(filters.filter));
    }
    
    if (filters?.keyword) {
      params.append('keyword', filters.keyword);
    }
    
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }

    const url = params.toString() ? `${API_ENDPOINTS.USERS.BASE}?${params}` : API_ENDPOINTS.USERS.BASE;
    return apiClient.get<PaginatedResponse<User>>(url);
  }

  /**
   * Update user by ID (admin only)
   */
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>(API_ENDPOINTS.USERS.BY_ID(userId), userData);
  }

  /**
   * Lock user account (admin only)
   */
  async lockUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>(API_ENDPOINTS.USERS.LOCK(userId));
  }

  /**
   * Unlock user account (admin only)
   */
  async unlockUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>(API_ENDPOINTS.USERS.UNLOCK(userId));
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.USERS.BY_ID(userId));
  }

  /**
   * Update user balance (admin only)
   */
  async updateUserBalance(userId: string, balanceData: UpdateBalanceRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.USERS.UPDATE_BALANCE(userId), balanceData);
  }

  /**
   * Reset user password (admin only)
   */
  async resetUserPassword(userId: string, passwordData: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.USERS.RESET_PASSWORD(userId), passwordData);
  }
}

// Export singleton instance
export const userService = new UserService();
