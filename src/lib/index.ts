/**
 * Library Index
 * Main entry point for all lib utilities
 */

// API library (main export)
export * from './api';

// Utility functions
export * from './utils';

// Constants (specific exports to avoid conflicts)
export {
  APP_CONFIG,
  ROUTES,
  PAGINATION,
  VALIDATION,
  FILE_UPLOAD,
  CURRENCY,
  DATE_FORMATS,
  ANIMATION,
  BREAKPOINTS,
  Z_INDEX,
} from './constants';

// Legacy query client (for backward compatibility)
// @deprecated Use the new API structure from './api' instead
export { queryClient } from './queryClient';
