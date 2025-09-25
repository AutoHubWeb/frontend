/**
 * Discount Codes API Service
 * Handles all discount code-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  DiscountCode, 
  ValidateDiscountRequest,
  PaginatedResponse, 
  PaginationParams,
  ApiResponse 
} from '../types';

export class DiscountCodesService {
  /**
   * Validate discount code
   */
  async validateDiscountCode(codeData: ValidateDiscountRequest): Promise<ApiResponse<DiscountCode>> {
    return apiClient.post<DiscountCode>(API_ENDPOINTS.DISCOUNT_CODES.VALIDATE, codeData);
  }

  /**
   * Get all discount codes (admin)
   */
  async getDiscountCodes(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<DiscountCode>>> {
    return apiClient.get<PaginatedResponse<DiscountCode>>(API_ENDPOINTS.DISCOUNT_CODES.BASE, params);
  }

  /**
   * Get discount code by ID
   */
  async getDiscountCodeById(id: string): Promise<ApiResponse<DiscountCode>> {
    return apiClient.get<DiscountCode>(`/api/discount-codes/${id}`);
  }

  /**
   * Create discount code (admin)
   */
  async createDiscountCode(codeData: Partial<DiscountCode>): Promise<ApiResponse<DiscountCode>> {
    return apiClient.post<DiscountCode>(API_ENDPOINTS.DISCOUNT_CODES.BASE, codeData);
  }

  /**
   * Update discount code (admin)
   */
  async updateDiscountCode(id: string, codeData: Partial<DiscountCode>): Promise<ApiResponse<DiscountCode>> {
    return apiClient.put<DiscountCode>(`/api/discount-codes/${id}`, codeData);
  }

  /**
   * Delete discount code (admin)
   */
  async deleteDiscountCode(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/discount-codes/${id}`);
  }

  /**
   * Get active discount codes
   */
  async getActiveDiscountCodes(): Promise<ApiResponse<DiscountCode[]>> {
    return apiClient.get<DiscountCode[]>('/api/discount-codes/active');
  }

  /**
   * Get expired discount codes
   */
  async getExpiredDiscountCodes(): Promise<ApiResponse<DiscountCode[]>> {
    return apiClient.get<DiscountCode[]>('/api/discount-codes/expired');
  }

  /**
   * Get discount code usage statistics
   */
  async getDiscountCodeStatistics(id: string): Promise<ApiResponse<{
    totalUses: number;
    remainingUses: number;
    totalSavings: number;
    popularTools: string[];
  }>> {
    return apiClient.get(`/api/discount-codes/${id}/statistics`);
  }

  /**
   * Bulk create discount codes (admin)
   */
  async bulkCreateDiscountCodes(codes: Partial<DiscountCode>[]): Promise<ApiResponse<DiscountCode[]>> {
    return apiClient.post<DiscountCode[]>('/api/discount-codes/bulk', { codes });
  }

  /**
   * Apply discount code to purchase
   */
  async applyDiscountCode(code: string, toolId: string): Promise<ApiResponse<{
    discountAmount: number;
    finalPrice: number;
    discountCode: DiscountCode;
  }>> {
    return apiClient.post('/api/discount-codes/apply', { code, toolId });
  }

  /**
   * Get user's used discount codes
   */
  async getUserDiscountCodes(): Promise<ApiResponse<{
    code: string;
    usedAt: string;
    toolId: string;
    discountAmount: number;
  }[]>> {
    return apiClient.get('/api/discount-codes/user');
  }
}

// Export singleton instance
export const discountCodesService = new DiscountCodesService();
