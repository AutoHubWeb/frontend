/**
 * Purchases Feature Index
 * Exports all purchase-related functionality
 */

// API hooks
export { 
  useCreatePurchase, 
  useUserPurchases,
  usePurchaseById,
  useChangeKey,
  useActivePurchases,
  useExpiredPurchases,
  useVerifyKey,
  useRenewPurchase,
  useCancelPurchase,
  useDownloadReceipt
} from '@/lib/api/hooks/usePurchases';

// Types
export type { Purchase, PurchaseRequest, ChangeKeyRequest } from '@/lib/api/types';
