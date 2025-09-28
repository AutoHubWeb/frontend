/**
 * Admin Feature Index
 * Exports all admin-related functionality
 */

// API hooks
export { 
  useAdminStatistics,
  useRevenueStatistics,
  useUserActivityStatistics,
  useKeyValidations,
  useAdminUsers,
  useAdminUserById,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useLockUser,
  useUnlockUser,
  useUpdateUserBalance,
  useResetUserPassword
} from '@/lib/api/hooks/useAdmin';

// Pages
export { default as AdminPanel } from './pages/AdminPanel';
export { default as Statistics } from './pages/Statistics';

// Types
export type { 
  AdminStatistics, 
  KeyValidation 
} from '@/lib/api/types';
