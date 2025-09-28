/**
 * Authentication Feature Index
 * Exports all authentication-related functionality
 */

// Context and hooks
export { AuthProvider, useAuth } from './AuthContext';

// API hooks (re-exported from main API)
export { 
  useLogin, 
  useRegister, 
  useLogout, 
  useCurrentUser, 
  useUpdateProfile, 
  useChangePassword,
  useRequestPasswordReset,
  useResetPassword
} from '@/lib/api/hooks/useAuth';

// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';

// Pages
export { default as Login } from './pages/Login';
export { default as Register } from './pages/Register';
export { default as ForgotPassword } from './pages/ForgotPassword';

// Types
export type { AuthContextType, LoginRequest, RegisterRequest, ForgotPasswordRequest } from '@/shared/authTypes';
