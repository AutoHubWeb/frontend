/**
 * API Client
 * Simplified HTTP client using fetch API
 */

import { ApiRequestConfig, ApiResponse, ApiClientConfig, HttpMethod } from './types';
import { 
  API_CONFIG, 
  DEFAULT_HEADERS, 
  ENV_CONFIG,
  STORAGE_KEYS 
} from './config';
import { 
  ApiException, 
  parseApiError, 
  logError
} from './errors';

// Token management utilities - SSR safe
export const tokenManager = {
  getTokens: () => {
    if (typeof window === 'undefined') return null;
    try {
      const tokens = localStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  },

  setTokens: (tokens: { accessToken: string; refreshToken: string } | null) => {
    if (typeof window === 'undefined') return;
    if (tokens) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
    }
  },

  getUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: any) => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  },

  clearAll: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }
};

// Main API Client class
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: API_CONFIG.BASE_URL || 'http://localhost:3001',
      timeout: API_CONFIG.TIMEOUT,
      headers: DEFAULT_HEADERS,
      ...config,
    };
  }

  // Build full URL
  private buildUrl(url: string, params?: Record<string, any>): string {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseURL}${url}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      return queryString ? `${fullUrl}?${queryString}` : fullUrl;
    }
    
    return fullUrl;
  }

  // Add authentication token to headers
  private addAuthToken(headers: Record<string, string>): Record<string, string> {
    const tokens = tokenManager.getTokens();
    if (tokens?.accessToken) {
      return {
        ...headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      };
    }
    return headers;
  }

  // Main request method using fetch
  async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(config.url, config.params);
    
    // Prepare headers
    let headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...config.headers,
    };
    
    // Add auth token if needed
    if (config.withAuth !== false) {
      headers = this.addAuthToken(headers);
    }
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: config.method,
      headers,
      credentials: 'same-origin', // Changed from 'include' to avoid CORS issues with credentials
      mode: 'cors',
    };

    // Add body for non-GET requests
    if (config.data && config.method !== 'GET') {
      fetchOptions.body = JSON.stringify(config.data);
    }

    try {
      // Make the request
      const response = await fetch(fullUrl, fetchOptions);
      
      // Parse response
      const responseData: ApiResponse<T> = await response.json();
      
      if (!response.ok) {
        // Create a proper error object with response data
        const error: any = new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
        error.response = {
          status: response.status,
          data: responseData
        };
        throw error;
      }
      
      return responseData;
    } catch (error: any) {
      const apiError = parseApiError(error);
      logError(apiError, `API Request ${config.method} ${config.url}`);
      throw apiError;
    }
  }

  // Convenience methods
  async get<T = any>(url: string, params?: Record<string, any>, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config,
    });
  }

  async post<T = any>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  async put<T = any>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  async patch<T = any>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  async delete<T = any>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }

  // Update configuration
  updateConfig(config: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Legacy compatibility - wrapper functions that match the existing apiRequest signature
export const apiRequest = async (
  method: HttpMethod,
  url: string,
  data?: any
): Promise<Response> => {
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
    });

    // Create a mock Response object for compatibility
    return {
      ok: response.success,
      status: response.success ? 200 : 400,
      statusText: response.success ? 'OK' : 'Bad Request',
      json: async () => response,
      text: async () => JSON.stringify(response),
    } as Response;
  } catch (error: any) {
    // Transform error to match existing error handling
    const apiError = parseApiError(error);
    const errorResponse = {
      ok: false,
      status: apiError.status || 500,
      statusText: apiError.message,
      json: async () => ({ success: false, message: apiError.message, data: null }),
      text: async () => apiError.message,
    } as Response;
    
    throw Object.assign(new Error(apiError.message), errorResponse);
  }
};
