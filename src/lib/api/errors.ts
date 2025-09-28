/**
 * API Error Handling Utilities
 * Simplified error handling and logging for API operations
 */

import { ApiError, HttpStatusCode } from './types';
import { HTTP_STATUS, ERROR_MESSAGES, ENV_CONFIG } from './config';

// Custom error classes
export class ApiException extends Error implements ApiError {
  public status: HttpStatusCode;
  public code?: string;
  public details?: any;
  public timestamp: string;

  constructor(
    message: string,
    status: HttpStatusCode,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

export class NetworkException extends ApiException {
  constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR) {
    super(message, 0 as HttpStatusCode);
    this.name = 'NetworkException';
  }
}

export class TimeoutException extends ApiException {
  constructor(message: string = ERROR_MESSAGES.TIMEOUT_ERROR) {
    super(message, 0 as HttpStatusCode);
    this.name = 'TimeoutException';
  }
}

export class ValidationException extends ApiException {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.name = 'ValidationException';
    this.details = details;
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends ApiException {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = 'NotFoundException';
  }
}

export class ServerException extends ApiException {
  constructor(message: string = ERROR_MESSAGES.SERVER_ERROR, status: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message, status);
    this.name = 'ServerException';
  }
}

// Error parsing utilities
export const parseApiError = (error: any): ApiException => {
  // Handle network errors
  if (!navigator.onLine) {
    return new NetworkException();
  }

  // Handle timeout errors
  if (error.name === 'AbortError' || error.code === 'TIMEOUT') {
    return new TimeoutException();
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new NetworkException();
  }

  // Handle HTTP response errors
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || getDefaultErrorMessage(status);
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return new UnauthorizedException(message);
      case HTTP_STATUS.FORBIDDEN:
        return new ForbiddenException(message);
      case HTTP_STATUS.NOT_FOUND:
        return new NotFoundException(message);
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return new ValidationException(message, data?.errors);
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return new ServerException(message, status);
      default:
        return new ApiException(message, status, data?.code, data?.details);
    }
  }

  // Handle other errors
  if (error instanceof ApiException) {
    return error;
  }

  // Default unknown error
  return new ApiException(
    error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};

// Get default error message based on status code
export const getDefaultErrorMessage = (status: HttpStatusCode): string => {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

// Check if error is specific type
export const isUnauthorizedError = (error: any): boolean => {
  return error instanceof UnauthorizedException || 
         error?.status === HTTP_STATUS.UNAUTHORIZED ||
         error?.response?.status === HTTP_STATUS.UNAUTHORIZED;
};

export const isNetworkError = (error: any): boolean => {
  return error instanceof NetworkException ||
         error?.code === 'NETWORK_ERROR' ||
         !navigator.onLine;
};

export const isValidationError = (error: any): boolean => {
  return error instanceof ValidationException ||
         error?.status === HTTP_STATUS.UNPROCESSABLE_ENTITY ||
         error?.response?.status === HTTP_STATUS.UNPROCESSABLE_ENTITY;
};

export const isServerError = (error: any): boolean => {
  return error instanceof ServerException ||
         (error?.status >= 500 && error?.status < 600) ||
         (error?.response?.status >= 500 && error?.response?.status < 600);
};

// Logging utilities
export const logError = (error: ApiException, context?: string): void => {
  if (!ENV_CONFIG.enableLogging) return;

  const logData = {
    timestamp: new Date().toISOString(),
    context: context || 'API',
    error: error.toJSON(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  if (ENV_CONFIG.isDevelopment) {
    console.group(`🚨 API Error: ${error.name}`);
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('Details:', error.details);
    console.error('Full Error:', logData);
    console.groupEnd();
  } else {
    // In production, you might want to send errors to a logging service
    console.error('API Error:', logData);
  }
};

// Error reporting utilities
export const reportError = async (error: ApiException, context?: string): Promise<void> => {
  try {
    logError(error, context);
    
    // In production, you could send errors to a monitoring service
    // Example: Sentry, LogRocket, etc.
    if (ENV_CONFIG.isProduction && error.status >= 500) {
      // await sendErrorToMonitoringService(error);
    }
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
};

// Error boundary utilities
export const handleGlobalError = (error: any, errorInfo?: any): void => {
  const apiError = parseApiError(error);
  
  logError(apiError, 'Global Error Boundary');
  
  // You can dispatch to global error state here
  // Example: store.dispatch(setGlobalError(apiError));
};

// Toast notification helpers
export const getErrorToastConfig = (error: ApiException) => {
  return {
    title: getErrorTitle(error),
    description: error.message,
    variant: 'destructive' as const,
    duration: 5000,
  };
};

const getErrorTitle = (error: ApiException): string => {
  if (error instanceof UnauthorizedException) return 'Lỗi xác thực';
  if (error instanceof ForbiddenException) return 'Không có quyền';
  if (error instanceof NotFoundException) return 'Không tìm thấy';
  if (error instanceof ValidationException) return 'Dữ liệu không hợp lệ';
  if (error instanceof NetworkException) return 'Lỗi kết nối';
  if (error instanceof TimeoutException) return 'Hết thời gian chờ';
  if (error instanceof ServerException) return 'Lỗi máy chủ';
  return 'Đã xảy ra lỗi';
};
