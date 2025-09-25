export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL ,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH_TOKEN: '/api/v1/auth/refresh-token',
    USER: '/api/v1/auth/user',
    PROFILE: '/api/v1/auth/profile',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
  },
  
  // Tools endpoints
  TOOLS: {
    BASE: '/api/tools',
    BY_ID: (id: string) => `/api/tools/${id}`,
    CATEGORIES: '/api/tools/categories',
  },
  
  // Purchases endpoints
  PURCHASES: {
    BASE: '/api/purchases',
    BY_ID: (id: string) => `/api/purchases/${id}`,
    CHANGE_KEY: (id: string) => `/api/purchases/${id}/key`,
  },
  
  // Payment endpoints
  PAYMENTS: {
    BASE: '/api/payments',
    DEPOSIT: '/api/deposit',
    HISTORY: '/api/payments/history',
  },
  
  // Discount codes endpoints
  DISCOUNT_CODES: {
    VALIDATE: '/api/discount-codes/validate',
    BASE: '/api/discount-codes',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/api/user/profile',
    PASSWORD: '/api/user/password',
    SETTINGS: '/api/user/settings',
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: '/api/admin/users',
    TOOLS: '/api/admin/tools',
    CATEGORIES: '/api/admin/categories',
    VALIDATIONS: '/api/admin/validations',
    STATISTICS: '/api/admin/statistics',
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKENS: 'auth_tokens',
  AUTH_USER: 'auth_user',
  THEME: 'ui-theme',
  LANGUAGE: 'app-language',
} as const;

// Query Keys - Standardized keys for React Query
export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'] as const,
    TOKENS: ['auth', 'tokens'] as const,
  },
  TOOLS: {
    ALL: ['tools'] as const,
    BY_ID: (id: string) => ['tools', id] as const,
    CATEGORIES: ['tools', 'categories'] as const,
  },
  PURCHASES: {
    ALL: ['purchases'] as const,
    BY_ID: (id: string) => ['purchases', id] as const,
    USER_PURCHASES: ['purchases', 'user'] as const,
  },
  PAYMENTS: {
    ALL: ['payments'] as const,
    HISTORY: ['payments', 'history'] as const,
  },
  ADMIN: {
    USERS: ['admin', 'users'] as const,
    TOOLS: ['admin', 'tools'] as const,
    STATISTICS: ['admin', 'statistics'] as const,
    VALIDATIONS: ['admin', 'validations'] as const,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  TIMEOUT_ERROR: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
} as const;

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

// Environment-specific configurations
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: API_CONFIG.BASE_URL,
  enableLogging: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
  enableMocking: import.meta.env.VITE_ENABLE_MOCKING === 'true',
} as const;
