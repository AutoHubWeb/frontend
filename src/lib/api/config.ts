export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints based on Postman collection
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me', // Get current user profile
    UPDATE_ME: '/api/v1/auth/me', // Update current user profile
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    REFRESH_TOKENS: '/api/v1/auth/refresh-tokens',
  },
  
  // User management endpoints (admin)
  USERS: {
    BASE: '/api/v1/users',
    BY_ID: (id: string) => `/api/v1/users/${id}`,
    LOCK: (id: string) => `/api/v1/users/${id}/lock`,
    UNLOCK: (id: string) => `/api/v1/users/${id}/unlock`,
    UPDATE_BALANCE: (id: string) => `/api/v1/users/${id}/balance`,
    RESET_PASSWORD: (id: string) => `/api/v1/users/${id}/reset-password`,
  },
  
  // Tools endpoints
  TOOLS: {
    BASE: '/api/v1/tools',
    BY_ID: (id: string) => `/api/v1/tools/${id}`,
    ADMIN: '/api/v1/tools/admin', // Admin view of tools
    ACTIVE: (id: string) => `/api/v1/tools/${id}/active`,
    PAUSE: (id: string) => `/api/v1/tools/${id}/pause`,
    CATEGORIES: '/api/v1/tools/categories',
  },
  
  // File management endpoints
  FILES: {
    UPLOAD_SINGLE: '/api/v1/files/upload/single',
    UPLOAD_MULTIPLE: '/api/v1/files/upload/multiple',
    STATIC: (resource: string, filename: string) => `/api/v1/files/static/${resource}/${filename}`,
    DELETE: (id: string) => `/api/v1/files/${id}`,
    DELETE_MULTIPLE: '/api/v1/files/delete-multiple',
  },
  
  // Legacy endpoints (keeping for compatibility)
  PURCHASES: {
    BASE: '/api/v1/purchases',
    BY_ID: (id: string) => `/api/v1/purchases/${id}`,
    CHANGE_KEY: (id: string) => `/api/v1/purchases/${id}/key`,
  },
  
  PAYMENTS: {
    BASE: '/api/v1/payments',
    DEPOSIT: '/api/v1/deposit',
    HISTORY: '/api/v1/payments/history',
  },
  
  DISCOUNT_CODES: {
    VALIDATE: '/api/v1/discount-codes/validate',
    BASE: '/api/v1/discount-codes',
  },
  
  // Admin endpoints
  ADMIN: {
    STATISTICS: '/api/v1/admin/statistics',
    REVENUE: '/api/v1/admin/revenue',
    USER_ACTIVITY: '/api/v1/admin/user-activity',
    USERS: '/api/v1/admin/users',
    TOOLS: '/api/v1/admin/tools',
    CATEGORIES: '/api/v1/admin/categories',
    VALIDATIONS: '/api/v1/admin/validations',
    LOGS: '/api/v1/admin/logs',
    EXPORT: '/api/v1/admin/export',
    IMPORT: '/api/v1/admin/import',
    SETTINGS: '/api/v1/admin/settings',
  },
  
  // Transactions endpoints
  TRANSACTIONS: {
    TOP_UP: '/api/v1/transactions/top-up',
    ME: '/api/v1/transactions/me',
    SE_PAY: '/api/v1/transactions/webhook/sepay',
  },
  
  // Proxy endpoints
  PROXY: {
    BASE: '/api/v1/proxy',
  },
  
  // VPS endpoints
  VPS: {
    BASE: '/api/v1/vps',
  },
  
  // Orders endpoints
  ORDERS: {
    BASE: '/api/v1/orders',
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
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
    ME: ['auth', 'me'] as const,
    TOKENS: ['auth', 'tokens'] as const,
  },
  USERS: {
    ALL: ['users'] as const,
    BY_ID: (id: string) => ['users', id] as const,
    LIST: (filters?: any) => ['users', 'list', filters] as const,
  },
  TOOLS: {
    ALL: ['tools'] as const,
    BY_ID: (id: string) => ['tools', id] as const,
    ADMIN: ['tools', 'admin'] as const,
    LIST: (filters?: any) => ['tools', 'list', filters] as const,
  },
  FILES: {
    ALL: ['files'] as const,
    BY_ID: (id: string) => ['files', id] as const,
    BY_RESOURCE: (resource: string) => ['files', 'resource', resource] as const,
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
  
  TRANSACTIONS: {
    TOP_UP: ['transactions', 'top-up'] as const,
    ME: ['transactions', 'me'] as const,
    SE_PAY: ['transactions', 'sepay'] as const,
  },
  
  PROXY: {
    ALL: ['proxy'] as const,
    LIST: ['proxy', 'list'] as const,
  },
  
  ORDERS: {
    ALL: ['orders'] as const,
    LIST: ['orders', 'list'] as const,
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
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiBaseUrl: API_CONFIG.BASE_URL,
  enableLogging: process.env.NEXT_PUBLIC_DEBUG === 'true' || process.env.NODE_ENV === 'development',
  enableMocking: process.env.NEXT_PUBLIC_ENABLE_MOCKING === 'true',
} as const;
