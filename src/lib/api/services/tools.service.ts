/**
 * Tools API Service
 * Handles all tools-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  Tool, 
  Category, 
  PaginatedResponse, 
  PaginationParams, 
  SearchParams,
  ApiResponse 
} from '../types';

export class ToolsService {
  /**
   * Get all tools with optional pagination and filters
   */
  async getTools(params?: PaginationParams & SearchParams): Promise<ApiResponse<PaginatedResponse<Tool>>> {
    return apiClient.get<PaginatedResponse<Tool>>(API_ENDPOINTS.TOOLS.BASE, params);
  }

  /**
   * Get tool by ID
   */
  async getToolById(id: string): Promise<ApiResponse<Tool>> {
    return apiClient.get<Tool>(API_ENDPOINTS.TOOLS.BY_ID(id));
  }

  /**
   * Get all tool categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>(API_ENDPOINTS.TOOLS.CATEGORIES);
  }

  /**
   * Search tools by query
   */
  async searchTools(query: string, filters?: SearchParams): Promise<ApiResponse<Tool[]>> {
    const params = { query, ...filters };
    return apiClient.get<Tool[]>('/api/tools/search', params);
  }

  /**
   * Get featured tools
   */
  async getFeaturedTools(): Promise<ApiResponse<Tool[]>> {
    return apiClient.get<Tool[]>('/api/tools/featured');
  }

  /**
   * Get tools by category
   */
  async getToolsByCategory(categoryId: string, params?: PaginationParams): Promise<ApiResponse<Tool[]>> {
    return apiClient.get<Tool[]>(`/api/tools/category/${categoryId}`, params);
  }

  /**
   * Get popular tools
   */
  async getPopularTools(limit?: number): Promise<ApiResponse<Tool[]>> {
    const params = limit ? { limit } : undefined;
    return apiClient.get<Tool[]>('/api/tools/popular', params);
  }

  /**
   * Get recommended tools for user
   */
  async getRecommendedTools(): Promise<ApiResponse<Tool[]>> {
    return apiClient.get<Tool[]>('/api/tools/recommended');
  }

  /**
   * Get tool statistics
   */
  async getToolStatistics(toolId: string): Promise<ApiResponse<{
    purchases: number;
    rating: number;
    reviews: number;
  }>> {
    return apiClient.get(`/api/tools/${toolId}/statistics`);
  }

  /**
   * Get similar tools
   */
  async getSimilarTools(toolId: string, limit?: number): Promise<ApiResponse<Tool[]>> {
    const params = limit ? { limit } : undefined;
    return apiClient.get<Tool[]>(`/api/tools/${toolId}/similar`, params);
  }
}

// Export singleton instance
export const toolsService = new ToolsService();
