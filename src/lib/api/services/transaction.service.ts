/**
 * Transaction API Service
 * Handles all transaction-related API calls
 */

import { API_ENDPOINTS, API_CONFIG } from '../config';
import { 
  PaginationParams,
  ApiResponse
} from '../types';
import { tokenManager } from '../client';

// Define the API response structure
export interface TopUpApiResponse {
  fullname: string;
  totalRecharge: number;
}

export interface TransactionItem {
  id: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  action: string;
  note: string;
  user: {
    id: {
      type: string;
      data: number[];
    };
  };
}

export interface UserTransactionsResponse {
  items: TransactionItem[];
  meta: {
    total: number;
    page: number;
  };
}

// Define the Sepay webhook request body
export interface SepayWebhookRequest {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string | null;
  content: string;
  transferType: string;
  transferAmount: number;
  accumulated: number;
  subAccount: string | null;
  referenceCode: string;
  description: string;
}

export class TransactionService {
  /**
   * Get top up users
   */
  async getTopUpUsers(params?: PaginationParams): Promise<ApiResponse<TopUpApiResponse[]>> {
    try {
      // Make the API call using fetch directly to handle the specific response format
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRANSACTIONS.TOP_UP}`;
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth token if available
      const tokens = tokenManager.getTokens();
      if (tokens?.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Parse the response
      const rawData = await response.json();
      
      // Transform the response to match the expected format
      return {
        success: true,
        message: rawData.message || 'Success',
        data: rawData.data || []
      };
    } catch (error: any) {
      // Handle error case
      return {
        success: false,
        message: error.message || 'Failed to fetch top up users',
        data: []
      };
    }
  }
  
  /**
   * Get user transactions
   */
  async getUserTransactions(params?: PaginationParams): Promise<ApiResponse<UserTransactionsResponse>> {
    try {
      // Make the API call using fetch directly to handle the specific response format
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRANSACTIONS.ME}`;
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth token if available
      const tokens = tokenManager.getTokens();
      if (tokens?.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Parse the response
      const rawData = await response.json();
      
      // Transform the response to match the expected format
      return {
        success: true,
        message: rawData.message || 'Success',
        data: rawData.data || { items: [], meta: { total: 0, page: 1 } }
      };
    } catch (error: any) {
      // Handle error case
      return {
        success: false,
        message: error.message || 'Failed to fetch user transactions',
        data: { items: [], meta: { total: 0, page: 1 } }
      };
    }
  }
  
  /**
   * Call Sepay webhook to process deposit
   */
  async processSepayDeposit(data: SepayWebhookRequest): Promise<ApiResponse<any>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRANSACTIONS.SE_PAY}`;
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Apikey': 'shop-tool-nro', // Add API Key as requested
      };
      
      // Add auth token if available
      const tokens = tokenManager.getTokens();
      if (tokens?.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Parse the response
      const rawData = await response.json();
      
      // Transform the response to match the expected format
      return {
        success: rawData.success || response.ok,
        message: rawData.message || 'Success',
        data: rawData.data || null
      };
    } catch (error: any) {
      // Handle error case
      return {
        success: false,
        message: error.message || 'Failed to process deposit',
        data: null
      };
    }
  }
}

// Export singleton instance
export const transactionService = new TransactionService();
