/**
 * Proxy API Service
 * Handles all proxy-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  ApiResponse,
  PaginatedResponse
} from '../types';

// Proxy types based on the API response you provided
export interface ProxyItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  soldQuantity: number;
  viewCount: number;
  status: number;
  inventory: number;
  price: number;
}

export interface ProxyResponse {
  items: ProxyItem[];
  meta: {
    total: number;
    page: number;
  };
}

export class ProxyService {
  /**
   * Get list of proxies
   */
  async getProxies(): Promise<ApiResponse<ProxyResponse>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.PROXY.BASE);
    // Transform the response to match our expected format
    return {
      success: response.success,
      message: response.message,
      data: {
        items: response.data?.items || [],
        meta: response.data?.meta || { total: 0, page: 1 }
      }
    };
  }
}

// Export singleton instance
export const proxyService = new ProxyService();
