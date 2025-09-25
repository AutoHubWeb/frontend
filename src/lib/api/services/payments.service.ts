/**
 * Payments API Service
 * Handles all payment-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  Payment, 
  DepositRequest,
  PaginatedResponse, 
  PaginationParams,
  ApiResponse 
} from '../types';

export class PaymentsService {
  /**
   * Create a deposit
   */
  async createDeposit(depositData: DepositRequest): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>(API_ENDPOINTS.PAYMENTS.DEPOSIT, depositData);
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Payment>>> {
    return apiClient.get<PaginatedResponse<Payment>>(API_ENDPOINTS.PAYMENTS.HISTORY, params);
  }

  /**
   * Get all payments
   */
  async getPayments(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Payment>>> {
    return apiClient.get<PaginatedResponse<Payment>>(API_ENDPOINTS.PAYMENTS.BASE, params);
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    return apiClient.get<Payment>(`/api/payments/${id}`);
  }

  /**
   * Get user balance
   */
  async getUserBalance(): Promise<ApiResponse<{ balance: number }>> {
    return apiClient.get<{ balance: number }>('/api/payments/balance');
  }

  /**
   * Get payment statistics
   */
  async getPaymentStatistics(): Promise<ApiResponse<{
    totalDeposits: number;
    totalSpent: number;
    currentBalance: number;
    pendingTransactions: number;
  }>> {
    return apiClient.get('/api/payments/statistics');
  }

  /**
   * Verify payment
   */
  async verifyPayment(paymentId: string): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.post<{ verified: boolean }>(`/api/payments/${paymentId}/verify`);
  }

  /**
   * Cancel payment
   */
  async cancelPayment(paymentId: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/payments/${paymentId}/cancel`, { reason });
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>(`/api/payments/${paymentId}/refund`, { amount, reason });
  }

  /**
   * Get pending payments
   */
  async getPendingPayments(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/api/payments/pending');
  }

  /**
   * Get completed payments
   */
  async getCompletedPayments(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/api/payments/completed');
  }

  /**
   * Get failed payments
   */
  async getFailedPayments(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/api/payments/failed');
  }

  /**
   * Retry failed payment
   */
  async retryPayment(paymentId: string): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>(`/api/payments/${paymentId}/retry`);
  }

  /**
   * Download payment receipt
   */
  async downloadReceipt(paymentId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get<{ downloadUrl: string }>(`/api/payments/${paymentId}/receipt`);
  }

  /**
   * Update payment method
   */
  async updatePaymentMethod(paymentMethodData: any): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/api/payments/payment-method', paymentMethodData);
  }
}

// Export singleton instance
export const paymentsService = new PaymentsService();
