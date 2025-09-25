import { z } from "zod";

// JWT Authentication Types
export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ExternalUser {
  id: string;
  fullname: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  phone?: string;
  balance?: number;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Request/Response schemas for external API
export const loginRequestSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerRequestSchema = z.object({
  fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const updateProfileRequestSchema = z.object({
  fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").optional(),
  phone: z.string().optional(),
});

export const changePasswordRequestSchema = z.object({
  oldPassword: z.string().min(1, "Mật khẩu cũ là bắt buộc"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token là bắt buộc"),
});

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Types for use in components
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;

// Authentication context types
export interface AuthContextType {
  user: ExternalUser | null;
  tokens: JWTTokens | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Token storage keys
export const TOKEN_STORAGE_KEY = 'auth_tokens';
export const USER_STORAGE_KEY = 'auth_user';
