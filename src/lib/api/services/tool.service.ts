/**
 * Tools API Service
 * Handles all tool-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  Tool,
  ApiResponse,
  PaginatedResponse,
  SearchParams
} from '../types';

// Tool-specific request types based on Postman collection
export interface CreateToolRequest {
  code: string;
  name: string;
  description: string;
  demo?: string;
  linkDownload?: string;
  images?: string[]; // Array of file IDs
  plans: Array<{
    name: string;
    price: number;
    duration: number; // -1 for permanent
  }>;
}

export interface UpdateToolRequest {
  code?: string;
  name?: string;
  description?: string;
  demo?: string;
  linkDownload?: string;
  images?: string[];
  plans?: Array<{
    name: string;
    price: number;
    duration: number;
  }>;
}

export class ToolService {
  /**
   * Get list of tools (public view)
   */
  async getTools(params?: SearchParams): Promise<ApiResponse<PaginatedResponse<Tool>>> {
    const searchParams = new URLSearchParams();
    
    if (params?.query) {
      searchParams.append('search', params.query);
    }
    
    if (params?.category) {
      searchParams.append('category', params.category);
    }
    
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const url = searchParams.toString() ? `${API_ENDPOINTS.TOOLS.BASE}?${searchParams}` : API_ENDPOINTS.TOOLS.BASE;
    return apiClient.get<PaginatedResponse<Tool>>(url);
  }

  /**
   * Get tool by ID
   */
  async getToolById(toolId: string): Promise<ApiResponse<Tool>> {
    return apiClient.get<Tool>(API_ENDPOINTS.TOOLS.BY_ID(toolId));
  }

  /**
   * Get list of tools (admin view)
   */
  async getToolsAdmin(params?: SearchParams): Promise<ApiResponse<PaginatedResponse<Tool>>> {
    const searchParams = new URLSearchParams();
    
    if (params?.query) {
      searchParams.append('search', params.query);
    }
    
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const url = searchParams.toString() ? `${API_ENDPOINTS.TOOLS.ADMIN}?${searchParams}` : API_ENDPOINTS.TOOLS.ADMIN;
    return apiClient.get<PaginatedResponse<Tool>>(url);
  }

  /**
   * Create new tool (admin only)
   */
  async createTool(toolData: CreateToolRequest): Promise<ApiResponse<Tool>> {
    return apiClient.post<Tool>(API_ENDPOINTS.TOOLS.BASE, toolData);
  }

  /**
   * Update tool (admin only)
   */
  async updateTool(toolId: string, toolData: UpdateToolRequest): Promise<ApiResponse<Tool>> {
    return apiClient.put<Tool>(API_ENDPOINTS.TOOLS.BY_ID(toolId), toolData);
  }

  /**
   * Activate tool (admin only)
   */
  async activateTool(toolId: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>(API_ENDPOINTS.TOOLS.ACTIVE(toolId));
  }

  /**
   * Pause/deactivate tool (admin only)
   */
  async pauseTool(toolId: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>(API_ENDPOINTS.TOOLS.PAUSE(toolId));
  }

  /**
   * Delete tool (admin only)
   */
  async deleteTool(toolId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.TOOLS.BY_ID(toolId));
  }
}

// Export singleton instance
export const toolService = new ToolService();
