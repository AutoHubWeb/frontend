/**
 * Profile Feature Index
 * Exports all profile-related functionality
 */

// Pages
export { default as Profile } from './pages/Profile';

// API hooks (re-exported from main API)
export { 
  useCurrentUser, 
  useUpdateProfile, 
  useChangePassword 
} from '@/lib/api/hooks/useAuth';

// Types
export type { User } from '@/lib/api/types';
