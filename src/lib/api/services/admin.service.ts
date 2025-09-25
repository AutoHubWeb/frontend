/**
 * Admin API Service
 * Handles all admin-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  User, 
  Tool, 
  Category,
  AdminStatistics, 
  KeyValidation,
  PaginatedResponse, 
  PaginationParams,
  ApiResponse 
} from '../types';

export class AdminService {
  /**
   * Get admin dashboard statistics
   */
  async getStatistics(): Promise<ApiResponse<AdminStatistics>> {
    return apiClient.get<AdminStatistics>(API_ENDPOINTS.ADMIN.STATISTICS);
  }

  /**
   * Get all users (admin)
   */
  async getUsers(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    return apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.ADMIN.USERS, params);
  }

  /**
   * Get user by ID (admin)
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/api/admin/users/${id}`);
  }

  /**
   * Update user (admin)
   */
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/api/admin/users/${id}`, userData);
  }

  /**
   * Delete user (admin)
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/admin/users/${id}`);
  }

  /**
   * Ban user (admin)
   */
  async banUser(id: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/admin/users/${id}/ban`, { reason });
  }

  /**
   * Unban user (admin)
   */
  async unbanUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/admin/users/${id}/unban`);
  }

  /**
   * Get all tools (admin)
   */
  async getTools(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Tool>>> {
    return apiClient.get<PaginatedResponse<Tool>>(API_ENDPOINTS.ADMIN.TOOLS, params);
  }

  /**
   * Create tool (admin)
   */
  async createTool(toolData: Partial<Tool>): Promise<ApiResponse<Tool>> {
    return apiClient.post<Tool>(API_ENDPOINTS.ADMIN.TOOLS, toolData);
  }

  /**
   * Update tool (admin)
   */
  async updateTool(id: string, toolData: Partial<Tool>): Promise<ApiResponse<Tool>> {
    return apiClient.put<Tool>(`/api/admin/tools/${id}`, toolData);
  }

  /**
   * Delete tool (admin)
   */
  async deleteTool(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/admin/tools/${id}`);
  }

  /**
   * Get all categories (admin)
   */
  async getCategories(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Category>>> {
    return apiClient.get<PaginatedResponse<Category>>(API_ENDPOINTS.ADMIN.CATEGORIES, params);
  }

  /**
   * Create category (admin)
   */
  async createCategory(categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    return apiClient.post<Category>(API_ENDPOINTS.ADMIN.CATEGORIES, categoryData);
  }

  /**
   * Update category (admin)
   */
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    return apiClient.put<Category>(`/api/admin/categories/${id}`, categoryData);
  }

  /**
   * Delete category (admin)
   */
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/admin/categories/${id}`);
  }

  /**
   * Get key validations
   */
  async getKeyValidations(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<KeyValidation>>> {
    return apiClient.get<PaginatedResponse<KeyValidation>>(API_ENDPOINTS.ADMIN.VALIDATIONS, params);
  }

  /**
   * Create key validation log
   */
  async createKeyValidation(validationData: Partial<KeyValidation>): Promise<ApiResponse<KeyValidation>> {
    return apiClient.post<KeyValidation>(API_ENDPOINTS.ADMIN.VALIDATIONS, validationData);
  }

  /**
   * Get system logs
   */
  async getSystemLogs(params?: PaginationParams & { level?: string; module?: string }): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/admin/logs', params);
  }

  /**
   * Get revenue statistics
   */
  async getRevenueStatistics(period?: 'day' | 'week' | 'month' | 'year'): Promise<ApiResponse<{
    totalRevenue: number;
    periodRevenue: number;
    growth: number;
    topTools: { tool: Tool; revenue: number }[];
  }>> {
    const params = period ? { period } : undefined;
    return apiClient.get('/api/admin/revenue', params);
  }

  /**
   * Get user activity statistics
   */
  async getUserActivityStatistics(): Promise<ApiResponse<{
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
    averageSessionTime: number;
  }>> {
    return apiClient.get('/api/admin/user-activity');
  }

  /**
   * Export data (admin)
   */
  async exportData(type: 'users' | 'tools' | 'purchases' | 'payments', format: 'csv' | 'json'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post<{ downloadUrl: string }>('/api/admin/export', { type, format });
  }

  /**
   * Import data (admin)
   */
  async importData(type: 'users' | 'tools', file: File): Promise<ApiResponse<{
    imported: number;
    errors: string[];
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return apiClient.post('/api/admin/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Update system settings (admin)
   */
  async updateSystemSettings(settings: Record<string, any>): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/api/admin/settings', settings);
  }

  /**
   * Get system settings (admin)
   */
  async getSystemSettings(): Promise<ApiResponse<Record<string, any>>> {
    return apiClient.get<Record<string, any>>('/api/admin/settings');
  }
}

// Export singleton instance
export const adminService = new AdminService();
