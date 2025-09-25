/**
 * Purchases API Service
 * Handles all purchase-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  Purchase, 
  PurchaseRequest, 
  ChangeKeyRequest,
  PaginatedResponse, 
  PaginationParams,
  ApiResponse 
} from '../types';

export class PurchasesService {
  /**
   * Create a new purchase
   */
  async createPurchase(purchaseData: PurchaseRequest): Promise<ApiResponse<Purchase>> {
    return apiClient.post<Purchase>(API_ENDPOINTS.PURCHASES.BASE, purchaseData);
  }

  /**
   * Get all user purchases
   */
  async getUserPurchases(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Purchase>>> {
    return apiClient.get<PaginatedResponse<Purchase>>(API_ENDPOINTS.PURCHASES.BASE, params);
  }

  /**
   * Get purchase by ID
   */
  async getPurchaseById(id: string): Promise<ApiResponse<Purchase>> {
    return apiClient.get<Purchase>(API_ENDPOINTS.PURCHASES.BY_ID(id));
  }

  /**
   * Change purchase key
   */
  async changeKey(purchaseId: string, keyData: ChangeKeyRequest): Promise<ApiResponse<Purchase>> {
    return apiClient.put<Purchase>(API_ENDPOINTS.PURCHASES.CHANGE_KEY(purchaseId), keyData);
  }

  /**
   * Get purchase history
   */
  async getPurchaseHistory(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Purchase>>> {
    return apiClient.get<PaginatedResponse<Purchase>>('/api/purchases/history', params);
  }

  /**
   * Verify purchase key
   */
  async verifyKey(purchaseId: string, key: string): Promise<ApiResponse<{ valid: boolean }>> {
    return apiClient.post<{ valid: boolean }>(`/api/purchases/${purchaseId}/verify`, { key });
  }

  /**
   * Get purchase statistics
   */
  async getPurchaseStatistics(): Promise<ApiResponse<{
    totalPurchases: number;
    totalSpent: number;
    activePurchases: number;
    expiredPurchases: number;
  }>> {
    return apiClient.get('/api/purchases/statistics');
  }

  /**
   * Renew purchase
   */
  async renewPurchase(purchaseId: string): Promise<ApiResponse<Purchase>> {
    return apiClient.post<Purchase>(`/api/purchases/${purchaseId}/renew`);
  }

  /**
   * Cancel purchase
   */
  async cancelPurchase(purchaseId: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/purchases/${purchaseId}/cancel`, { reason });
  }

  /**
   * Download purchase receipt
   */
  async downloadReceipt(purchaseId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get<{ downloadUrl: string }>(`/api/purchases/${purchaseId}/receipt`);
  }

  /**
   * Get active purchases
   */
  async getActivePurchases(): Promise<ApiResponse<Purchase[]>> {
    return apiClient.get<Purchase[]>('/api/purchases/active');
  }

  /**
   * Get expired purchases
   */
  async getExpiredPurchases(): Promise<ApiResponse<Purchase[]>> {
    return apiClient.get<Purchase[]>('/api/purchases/expired');
  }
}

// Export singleton instance
export const purchasesService = new PurchasesService();
