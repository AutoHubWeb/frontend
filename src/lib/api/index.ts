/**
 * API Library Index
 * Main entry point for the API library
 */

// Core API exports
export { apiClient, ApiClient, tokenManager, apiRequest } from './client';
export * from './types';
export * from './errors';
export * from './config';

// Services exports
export * from './services';

// Hooks exports
export * from './hooks';

// Utility functions
export { logError, reportError, parseApiError } from './errors';

// Re-export common types for convenience
export type {
  ApiResponse,
  ApiError,
  User,
  Tool,
  Purchase,
  Payment,
  DiscountCode,
  Category,
  PaginatedResponse,
  PaginationParams,
  SearchParams,
  QueryConfig,
  MutationConfig,
} from './types';
