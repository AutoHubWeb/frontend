/**
 * Order API Service
 * Handles all order-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  CreateOrderRequest,
  OrderItem,
  ApiResponse,
  OrderTool,
  OrderVPS,
  OrderProxy,
  DownloadToolResponse,
  PaginatedResponse
} from '../types';

export class OrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<OrderItem>> {
    try {
      const response: any = await apiClient.post<any>(API_ENDPOINTS.ORDERS.BASE, orderData);
      
      // Log the response for debugging
      console.log('Order API Response:', response);
      
      // Transform the response to match our expected format
      // Handle both success and error cases properly
      if (response && response.success === true) {
        return {
          success: true,
          message: response.message || 'Đặt hàng thành công',
          data: response.data ? {
            id: response.data.id,
            code: response.data.code,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            totalPrice: response.data.totalPrice,
            status: response.data.status,
            note: response.data.note,
            type: response.data.type,
            tool: response.data.tool as OrderTool,
            vps: response.data.vps as OrderVPS,
            proxy: response.data.proxy as OrderProxy,
            toolOrder: response.data.toolOrder,
            vpsOrder: response.data.vpsOrder,
            proxyOrder: response.data.proxyOrder,
            histories: response.data.histories || []
          } : undefined
        };
      } else if (response && (response.statusCode === 200 || response.status === 200) && response.data) {
        // Handle case where API returns 200 status but different structure
        return {
          success: true,
          message: response.message || 'Đặt hàng thành công',
          data: {
            id: response.data.id,
            code: response.data.code,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            totalPrice: response.data.totalPrice,
            status: response.data.status,
            note: response.data.note,
            type: response.data.type,
            tool: response.data.tool as OrderTool,
            vps: response.data.vps as OrderVPS,
            proxy: response.data.proxy as OrderProxy,
            toolOrder: response.data.toolOrder,
            vpsOrder: response.data.vpsOrder,
            proxyOrder: response.data.proxyOrder,
            histories: response.data.histories || []
          }
        };
      } else {
        // Handle error responses
        return {
          success: false,
          message: response?.message || 'Không thể tạo đơn hàng',
          data: undefined
        };
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('Order API Error:', error);
      return {
        success: false,
        message: error.message || 'Không thể kết nối đến máy chủ',
        data: undefined
      };
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<ApiResponse<OrderItem>> {
    try {
      const response: any = await apiClient.get<any>(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
      
      // Transform the response to match our expected format
      if (response && response.success === true) {
        return {
          success: true,
          message: response.message || 'Lấy thông tin đơn hàng thành công',
          data: response.data ? {
            id: response.data.id,
            code: response.data.code,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            totalPrice: response.data.totalPrice,
            status: response.data.status,
            note: response.data.note,
            type: response.data.type,
            tool: response.data.tool as OrderTool,
            vps: response.data.vps as OrderVPS,
            proxy: response.data.proxy as OrderProxy,
            toolOrder: response.data.toolOrder,
            vpsOrder: response.data.vpsOrder,
            proxyOrder: response.data.proxyOrder,
            histories: response.data.histories || []
          } : undefined
        };
      } else if (response && (response.statusCode === 200 || response.status === 200) && response.data) {
        // Handle case where API returns 200 status but different structure
        return {
          success: true,
          message: response.message || 'Lấy thông tin đơn hàng thành công',
          data: {
            id: response.data.id,
            code: response.data.code,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            totalPrice: response.data.totalPrice,
            status: response.data.status,
            note: response.data.note,
            type: response.data.type,
            tool: response.data.tool as OrderTool,
            vps: response.data.vps as OrderVPS,
            proxy: response.data.proxy as OrderProxy,
            toolOrder: response.data.toolOrder,
            vpsOrder: response.data.vpsOrder,
            proxyOrder: response.data.proxyOrder,
            histories: response.data.histories || []
          }
        };
      } else {
        // Handle error responses
        return {
          success: false,
          message: response?.message || 'Không thể lấy thông tin đơn hàng',
          data: undefined
        };
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('Get Order API Error:', error);
      return {
        success: false,
        message: error.message || 'Không thể kết nối đến máy chủ',
        data: undefined
      };
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(keyword?: string, page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<OrderItem>>> {
    try {
      // Prepare query parameters
      const params: Record<string, string> = {};
      if (keyword) {
        params.keyword = keyword;
      }
      if (page !== undefined) {
        params.page = page.toString();
      }
      if (limit !== undefined) {
        params.limit = limit.toString();
      }
      
      const response: any = await apiClient.get<any>(API_ENDPOINTS.ORDERS.ME, params);
      
      // Transform the response to match our expected format
      if (response && response.success === true) {
        const items = response.data?.items || response.data || [];
        const total = response.data?.meta.total || 0;
        const currentPage = response.data?.meta.page || 1;
        const requestedLimit = limit || 10;
        const currentLimit = response.data?.limit || requestedLimit;
        const totalPages = response.data?.totalPages || Math.ceil(total / currentLimit);

        const meta = {
          total: total,
          page: currentPage,
          limit: currentLimit,
          totalPages: totalPages,
          hasNext: currentPage < totalPages,
          hasPrevious: currentPage > 1
        };
        
        return {
          success: true,
          message: response.message || 'Lấy danh sách đơn hàng thành công',
          data: {
            data: Array.isArray(items) ? items.map((item: any) => ({
              id: item.id,
              code: item.code,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              totalPrice: item.totalPrice,
              status: item.status,
              note: item.note,
              type: item.type,
              tool: item.tool as OrderTool,
              vps: item.vps as OrderVPS,
              proxy: item.proxy as OrderProxy,
              toolOrder: item.toolOrder,
              vpsOrder: item.vpsOrder,
              proxyOrder: item.proxyOrder,
              histories: item.histories || []
            })) : [],
            meta
          }
        };
      } else if (response && (response.statusCode === 200 || response.status === 200) && response.data) {
        const items = response.data?.items || response.data || [];
        const total = response.data?.meta.total || 0;
        const currentPage = response.data?.meta.page || 1;
        const requestedLimit = limit || 10;
        const currentLimit = response.data?.limit || requestedLimit;
        const totalPages = response.data?.totalPages || Math.ceil(total / currentLimit);
        
        const meta = {
          total: total,
          page: currentPage,
          limit: currentLimit,
          totalPages: totalPages,
          hasNext: currentPage < totalPages,
          hasPrevious: currentPage > 1
        };
        
        return {
          success: true,
          message: response.message || 'Lấy danh sách đơn hàng thành công',
          data: {
            data: Array.isArray(items) ? items.map((item: any) => ({
              id: item.id,
              code: item.code,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              totalPrice: item.totalPrice,
              status: item.status,
              note: item.note,
              type: item.type,
              tool: item.tool as OrderTool,
              vps: item.vps as OrderVPS,
              proxy: item.proxy as OrderProxy,
              toolOrder: item.toolOrder,
              vpsOrder: item.vpsOrder,
              proxyOrder: item.proxyOrder,
              histories: item.histories || []
            })) : [],
            meta
          }
        };
      } else {
        // Handle error responses
        return {
          success: false,
          message: response?.message || 'Không thể lấy danh sách đơn hàng',
          data: {
            data: [],
            meta: {
              total: 0,
              page: 1,
              limit: 10,
              totalPages: 1,
              hasNext: false,
              hasPrevious: false
            }
          }
        };
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('Get User Orders API Error:', error);
      return {
        success: false,
        message: error.message || 'Không thể kết nối đến máy chủ',
        data: {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false
          }
        }
      };
    }
  }

  /**
   * Change order key
   */
  async changeKey(orderId: string, keyData: { apiKey: string }): Promise<ApiResponse<OrderItem>> {
    try {
      const response: any = await apiClient.put<any>(`${API_ENDPOINTS.ORDERS.BASE}/${orderId}/update-api-key`, keyData);
      
      // Log the response for debugging
      console.log('Change Key API Response:', response);
      
      // Transform the response to match our expected format
      if (response && (response.success === true || response.status === 200 || response.statusCode === 200)) {
        // Handle both success=true and HTTP 200 status cases
        const message = response.message || 'Cập nhật key thành công';
        const data = response.data || response;
        
        return {
          success: true,
          message: message,
          data: data ? {
            id: data.id,
            code: data.code,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            totalPrice: data.totalPrice,
            status: data.status,
            note: data.note,
            type: data.type,
            tool: data.tool as OrderTool,
            vps: data.vps as OrderVPS,
            proxy: data.proxy as OrderProxy,
            toolOrder: data.toolOrder,
            vpsOrder: data.vpsOrder,
            proxyOrder: data.proxyOrder,
            histories: data.histories || []
          } : undefined
        };
      } else {
        // Handle error responses
        return {
          success: false,
          message: response?.message || 'Không thể cập nhật key',
          data: undefined
        };
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('Change Key API Error:', error);
      
      // Extract error message from API response if available
      let errorMessage = 'Không thể kết nối đến máy chủ';
      
      if (error.response && error.response.data) {
        // Handle structured error response
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        // Handle generic error message
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        data: undefined
      };
    }
  }

  /**
   * Download tool for order
   */
  async downloadTool(orderId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const response: any = await apiClient.get<any>(`${API_ENDPOINTS.ORDERS.BASE}/${orderId}/download`);
      
      // Transform the response to match our expected format
      if (response && (response.success === true || response.status === 200 || response.statusCode === 200)) {
        // Handle both success=true and HTTP 200 status cases
        const message = response.message || 'Lấy link tải thành công';
        const data = response.data || response;
        
        return {
          success: true,
          message: message,
          data: data ? {
            downloadUrl: data.downloadUrl
          } : undefined
        };
      } else {
        // Handle error responses
        return {
          success: false,
          message: response?.message || 'Không thể lấy link tải',
          data: undefined
        };
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('Download Tool API Error:', error);
      return {
        success: false,
        message: error.message || 'Không thể kết nối đến máy chủ',
        data: undefined
      };
    }
  }
}

// Export singleton instance
export const orderService = new OrderService();
