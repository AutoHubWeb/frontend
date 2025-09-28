/**
 * Payments Feature Index
 * Exports all payment-related functionality
 */

// API hooks
export { 
  useCreateDeposit,
  usePayments,
  usePaymentHistory,
  useUserBalance,
  usePaymentStatistics,
  usePendingPayments,
  useCompletedPayments,
  useFailedPayments,
  useVerifyPayment,
  useCancelPayment,
  useRefundPayment,
  useRetryPayment,
  useDownloadPaymentInvoice,
  useUpdatePaymentMethod
} from '@/lib/api/hooks/usePayments';

// Pages
export { default as Deposit } from './pages/Deposit';
export { default as History } from './pages/History';
export { default as Checkout } from './pages/Checkout';
export { default as Cart } from './pages/Cart';

// Types
export type { Payment, DepositRequest } from '@/lib/api/types';
