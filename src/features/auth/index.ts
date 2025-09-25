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
  useChangePassword 
} from '@/lib/api/hooks/useAuth';

// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';

// Pages
export { default as Login } from './pages/Login';
export { default as Register } from './pages/Register';

// Types
export type { AuthContextType, LoginRequest, RegisterRequest } from '@/shared/authTypes';
