/**
 * API Client
 * Core HTTP client with authentication, error handling, and interceptors
 */

import { ApiRequestConfig, ApiResponse, ApiClientConfig, HttpMethod } from './types';
import { 
  ApiException, 
  parseApiError, 
  logError, 
  shouldRetry, 
  getRetryDelay 
} from './errors';
import { 
  API_CONFIG, 
  DEFAULT_HEADERS, 
  ENV_CONFIG,
  STORAGE_KEYS 
} from './config';

// Token management utilities
export const tokenManager = {
  getTokens: () => {
    try {
      const tokens = localStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  },

  setTokens: (tokens: { accessToken: string; refreshToken: string } | null) => {
    if (tokens) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
    }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: any) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }
};

// Request interceptors
const requestInterceptors = {
  // Add authentication token
  addAuthToken: (config: ApiRequestConfig): ApiRequestConfig => {
    if (config.withAuth !== false) {
      const tokens = tokenManager.getTokens();
      if (tokens?.accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        };
      }
    }
    return config;
  },

  // Add default headers
  addDefaultHeaders: (config: ApiRequestConfig): ApiRequestConfig => {
    config.headers = {
      ...DEFAULT_HEADERS,
      ...config.headers,
    };
    return config;
  },

  // Log requests in development
  logRequest: (config: ApiRequestConfig): ApiRequestConfig => {
    if (ENV_CONFIG.enableLogging) {
      console.log(`📤 ${config.method} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    return config;
  },
};

// Response interceptors
const responseInterceptors = {
  // Log responses in development
  logResponse: <T>(response: ApiResponse<T>, config: ApiRequestConfig): ApiResponse<T> => {
    if (ENV_CONFIG.enableLogging) {
      console.log(`📥 ${config.method} ${config.url}`, response);
    }
    return response;
  },

  // Handle unauthorized responses
  handleUnauthorized: <T>(response: ApiResponse<T>, config: ApiRequestConfig): ApiResponse<T> => {
    // This will be handled by the error interceptor
    return response;
  },
};

// Main API Client class
export class ApiClient {
  private config: ApiClientConfig;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      retries: API_CONFIG.RETRY_ATTEMPTS,
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

  // Create abort controller for request cancellation
  private createAbortController(url: string): AbortController {
    // Cancel previous request to the same endpoint
    const existingController = this.abortControllers.get(url);
    if (existingController) {
      existingController.abort();
    }

    const controller = new AbortController();
    this.abortControllers.set(url, controller);
    return controller;
  }

  // Apply request interceptors
  private async applyRequestInterceptors(config: ApiRequestConfig): Promise<ApiRequestConfig> {
    let processedConfig = { ...config };
    
    // Apply built-in interceptors
    processedConfig = requestInterceptors.addDefaultHeaders(processedConfig);
    processedConfig = requestInterceptors.addAuthToken(processedConfig);
    processedConfig = requestInterceptors.logRequest(processedConfig);
    
    // Apply custom interceptors
    if (this.config.requestInterceptors) {
      for (const interceptor of this.config.requestInterceptors) {
        if (interceptor.onRequest) {
          const result = interceptor.onRequest(processedConfig);
          processedConfig = result instanceof Promise ? await result : result;
        }
      }
    }
    
    return processedConfig;
  }

  // Apply response interceptors
  private async applyResponseInterceptors<T>(
    response: ApiResponse<T>, 
    config: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    let processedResponse = { ...response };
    
    // Apply built-in interceptors
    processedResponse = responseInterceptors.logResponse(processedResponse, config);
    processedResponse = responseInterceptors.handleUnauthorized(processedResponse, config);
    
    // Apply custom interceptors
    if (this.config.responseInterceptors) {
      for (const interceptor of this.config.responseInterceptors) {
        if (interceptor.onResponse) {
          const result = interceptor.onResponse(processedResponse);
          processedResponse = result instanceof Promise ? await result : result;
        }
      }
    }
    
    return processedResponse;
  }

  // Main request method
  async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const processedConfig = await this.applyRequestInterceptors(config);
    const fullUrl = this.buildUrl(processedConfig.url, processedConfig.params);
    const controller = this.createAbortController(fullUrl);
    
    let lastError: ApiException;
    const maxRetries = processedConfig.retries ?? this.config.retries ?? 0;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Add delay for retries
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, getRetryDelay(attempt - 1)));
        }

        const fetchConfig: RequestInit = {
          method: processedConfig.method,
          headers: processedConfig.headers,
          signal: controller.signal,
          credentials: 'include',
        };

        // Add body for non-GET requests
        if (processedConfig.data && processedConfig.method !== 'GET') {
          fetchConfig.body = JSON.stringify(processedConfig.data);
        }

        // Set timeout
        const timeout = processedConfig.timeout ?? this.config.timeout ?? API_CONFIG.TIMEOUT;
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(fullUrl, fetchConfig);
        clearTimeout(timeoutId);

        // Remove controller after successful request
        this.abortControllers.delete(fullUrl);

        if (!response.ok) {
          throw new ApiException(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status as any,
            undefined,
            { url: fullUrl, method: processedConfig.method }
          );
        }

        const responseData: ApiResponse<T> = await response.json();
        return await this.applyResponseInterceptors(responseData, processedConfig);

      } catch (error) {
        lastError = parseApiError(error);
        
        // Don't retry if it's the last attempt or if error shouldn't be retried
        if (attempt === maxRetries || !shouldRetry(lastError, attempt, maxRetries)) {
          break;
        }
        
        logError(lastError, `API Request Retry ${attempt + 1}`);
      }
    }

    // Log final error and throw
    logError(lastError!, `API Request Failed after ${maxRetries + 1} attempts`);
    throw lastError!;
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

  // Cancel specific request
  cancelRequest(url: string): void {
    const controller = this.abortControllers.get(url);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(url);
    }
  }

  // Cancel all pending requests
  cancelAllRequests(): void {
    this.abortControllers.forEach((controller, url) => {
      controller.abort();
    });
    this.abortControllers.clear();
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
  } catch (error) {
    // Transform error to match existing error handling
    const apiError = parseApiError(error);
    const errorResponse = {
      ok: false,
      status: apiError.status,
      statusText: apiError.message,
      json: async () => ({ success: false, message: apiError.message, data: null }),
      text: async () => apiError.message,
    } as Response;
    
    throw Object.assign(new Error(apiError.message), errorResponse);
  }
};
