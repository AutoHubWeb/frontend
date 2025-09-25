/**
 * Admin Feature Index
 * Exports all admin-related functionality
 */

// API hooks
export { 
  useAdminStatistics,
  useRevenueStatistics,
  useUserActivityStatistics,
  useAdminUsers,
  useAdminUserById,
  useAdminTools,
  useAdminCategories,
  useKeyValidations,
  useSystemLogs,
  useSystemSettings,
  useUpdateUser,
  useDeleteUser,
  useBanUser,
  useUnbanUser,
  useCreateTool,
  useUpdateTool,
  useDeleteTool,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateKeyValidation,
  useUpdateSystemSettings,
  useExportData,
  useImportData
} from '@/lib/api/hooks/useAdmin';

// Pages
export { default as AdminPanel } from './pages/AdminPanel';
export { default as Statistics } from './pages/Statistics';

// Types
export type { 
  AdminStatistics, 
  KeyValidation 
} from '@/lib/api/types';
