/**
 * VPS API Service
 * Handles all VPS-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  VPS,
  PaginatedResponse,
  ApiResponse,
  PaginationParams
} from '../types';

export class VpsService {
  /**
   * Get all VPS plans
   */
  async getVpsPlans(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<VPS>>> {
    try {
      const response: any = await apiClient.get<any>(API_ENDPOINTS.VPS.BASE, params);
      
      // Transform the response to match our expected format
      if (response && response.success === true) {
        return {
          success: true,
          message: response.message || 'Lấy danh sách VPS thành công',
          data: {
            data: response.data?.items || [],
            meta: response.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrevious: false }
          }
        };
      } else if (response && (response.statusCode === 200 || response.status === 200) && response.data) {
        // Handle case where API returns 200 status but different structure
        return {
          success: true,
          message: response.message || 'Lấy danh sách VPS thành công',
          data: {
            data: response.data.items || [],
            meta: response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrevious: false }
          }
        };
      } else {
        // Handle error responses
        return {
          success: false,
          message: response?.message || 'Không thể lấy danh sách VPS',
          data: {
            data: [],
            meta: { total: 0, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrevious: false }
          }
        };
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('Get VPS Plans API Error:', error);
      return {
        success: false,
        message: error.message || 'Không thể kết nối đến máy chủ',
        data: {
          data: [],
          meta: { total: 0, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrevious: false }
        }
      };
    }
  }

  /**
   * Get VPS by ID
   */
  async getVpsById(id: string): Promise<ApiResponse<VPS>> {
    try {
      const response: any = await apiClient.get<any>(`${API_ENDPOINTS.VPS.BASE}/${id}`);
      
      // Transform the response to match our expected format
      if (response && response.success === true) {
        return {
          success: true,
          message: response.message || 'Lấy thông tin VPS thành công',
          data: response.data
        };
      } else if (response && (response.statusCode === 200 || response.status === 200) && response.data) {
        // Handle case where API returns 200 status but different structure
        return {
          success: true,
          message: response.message || 'Lấy thông tin VPS thành công',
          data: response.data
        };
      } else {
        // Handle error responses
        return {
          success: false,
          message: response?.message || 'Không thể lấy thông tin VPS',
          data: undefined
        };
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('Get VPS API Error:', error);
      return {
        success: false,
        message: error.message || 'Không thể kết nối đến máy chủ',
        data: undefined
      };
    }
  }
}

// Export singleton instance
export const vpsService = new VpsService();
