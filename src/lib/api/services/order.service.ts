/**
 * Order API Service
 * Handles all order-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { 
  CreateOrderRequest,
  OrderResponse,
  ApiResponse 
} from '../types';

export class OrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<OrderResponse>> {
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
            code: response.data.code,
            totalPrice: response.data.totalPrice,
            status: response.data.status,
            note: response.data.note,
            type: response.data.type,
            histories: response.data.histories || []
          } : undefined
        };
      } else if (response && (response.statusCode === 200 || response.status === 200) && response.data) {
        // Handle case where API returns 200 status but different structure
        return {
          success: true,
          message: response.message || 'Đặt hàng thành công',
          data: {
            code: response.data.code,
            totalPrice: response.data.totalPrice,
            status: response.data.status,
            note: response.data.note,
            type: response.data.type,
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
  async getOrderById(id: string): Promise<ApiResponse<OrderResponse>> {
    try {
      const response: any = await apiClient.get<any>(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
      
      // Transform the response to match our expected format
      if (response && response.success === true) {
        return {
          success: true,
          message: response.message || 'Lấy thông tin đơn hàng thành công',
          data: response.data ? {
            code: response.data.code,
            totalPrice: response.data.totalPrice,
            status: response.data.status,
            note: response.data.note,
            type: response.data.type,
            histories: response.data.histories || []
          } : undefined
        };
      } else if (response && (response.statusCode === 200 || response.status === 200) && response.data) {
        // Handle case where API returns 200 status but different structure
        return {
          success: true,
          message: response.message || 'Lấy thông tin đơn hàng thành công',
          data: {
            code: response.data.code,
            totalPrice: response.data.totalPrice,
            status: response.data.status,
            note: response.data.note,
            type: response.data.type,
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
  async getUserOrders(): Promise<ApiResponse<OrderResponse[]>> {
    try {
      const response: any = await apiClient.get<any>(API_ENDPOINTS.ORDERS.BASE);
      
      // Transform the response to match our expected format
      if (response && response.success === true) {
        return {
          success: true,
          message: response.message || 'Lấy danh sách đơn hàng thành công',
          data: response.data ? (Array.isArray(response.data) ? response.data : [response.data]).map((item: any) => ({
            code: item.code,
            totalPrice: item.totalPrice,
            status: item.status,
            note: item.note,
            type: item.type,
            histories: item.histories || []
          })) : []
        };
      } else if (response && (response.statusCode === 200 || response.status === 200) && response.data) {
        // Handle case where API returns 200 status but different structure
        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
        return {
          success: true,
          message: response.message || 'Lấy danh sách đơn hàng thành công',
          data: dataArray.map((item: any) => ({
            code: item.code,
            totalPrice: item.totalPrice,
            status: item.status,
            note: item.note,
            type: item.type,
            histories: item.histories || []
          }))
        };
      } else {
        // Handle error responses
        return {
          success: false,
          message: response?.message || 'Không thể lấy danh sách đơn hàng',
          data: []
        };
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('Get User Orders API Error:', error);
      return {
        success: false,
        message: error.message || 'Không thể kết nối đến máy chủ',
        data: []
      };
    }
  }
}

// Export singleton instance
export const orderService = new OrderService();
