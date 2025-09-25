/**
 * Global TypeScript Types
 * Shared types used across the application
 */

// Re-export common types from API
export type {
  User,
  Tool,
  Purchase,
  Payment,
  DiscountCode,
  Category,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  SearchParams,
} from '@/lib/api/types';

// Re-export auth types
export type {
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  JWTTokens,
  ExternalUser,
} from '@/shared/authTypes';

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
}

// Form Types
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface NavConfig {
  mainNav: NavItem[];
  sidebarNav: NavItem[];
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

// Modal Types
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

// Toast Types
export interface ToastConfig {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}
