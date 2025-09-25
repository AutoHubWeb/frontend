/**
 * Application Constants
 * Global constants used throughout the application
 */

// App Information
export const APP_CONFIG = {
  NAME: 'SmartLearnAI',
  DESCRIPTION: 'Modern educational platform leveraging AI to enhance learning experiences',
  VERSION: '1.0.0',
  AUTHOR: 'SmartLearnAI Team',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TOOLS: '/tools',
  TOOL_DETAILS: (id: string) => `/tools/${id}`,
  STATISTICS: '/statistics',
  PURCHASED_TOOLS: '/purchased-tools',
  DEPOSIT: '/deposit',
  HISTORY: '/history',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_SECTION: (section: string) => `/admin/${section}`,
  CHECKOUT: '/checkout',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKENS: 'auth_tokens',
  AUTH_USER: 'auth_user',
  THEME: 'ui-theme',
  LANGUAGE: 'app-language',
  WELCOME_MODAL_SEEN: 'welcome_modal_seen',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

// Currency
export const CURRENCY = {
  VND: {
    CODE: 'VND',
    SYMBOL: '₫',
    DECIMAL_PLACES: 0,
  },
  USD: {
    CODE: 'USD',
    SYMBOL: '$',
    DECIMAL_PLACES: 2,
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm',
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-Index Values
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;
