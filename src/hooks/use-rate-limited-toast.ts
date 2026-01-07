import { toast as originalToast, useToast as useOriginalToast } from './use-toast';

// Track last toast time per message type to limit frequency
const toastTracker = new Map<string, number>();

const TOAST_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

interface RateLimitedToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | null;
  duration?: number;
  action?: any;
}

export function useRateLimitedToast() {
  const originalUseToast = useOriginalToast();

  const rateLimitedToast = (options: RateLimitedToastOptions) => {
    const { title, description } = options;
    
    // Create a unique key based on the message content
    const messageKey = `${title || ''}-${description || ''}`;
    const now = Date.now();
    const lastToastTime = toastTracker.get(messageKey) || 0;

    // Check if it's been less than 1 hour since the same message was shown
    if (now - lastToastTime < TOAST_INTERVAL) {
      // Skip showing the toast if it was shown recently
      return { id: null, dismiss: () => {}, update: () => {} };
    }

    // Update the tracker with current time
    toastTracker.set(messageKey, now);

    // Show the toast with original functionality
    return originalToast(options);
  };

  return {
    ...originalUseToast,
    toast: rateLimitedToast,
    // Also expose a direct rate-limited toast function
    rateLimitedToast
  };
}

// Export a standalone rate-limited toast function for use without hooks
export const rateLimitedToast = (options: RateLimitedToastOptions) => {
  const { title, description } = options;
  
  // Create a unique key based on the message content
  const messageKey = `${title || ''}-${description || ''}`;
  const now = Date.now();
  const lastToastTime = toastTracker.get(messageKey) || 0;

  // Check if it's been less than 1 hour since the same message was shown
  if (now - lastToastTime < TOAST_INTERVAL) {
    // Skip showing the toast if it was shown recently
    return { id: null, dismiss: () => {}, update: () => {} };
  }

  // Update the tracker with current time
  toastTracker.set(messageKey, now);

  // Show the toast with original functionality
  return originalToast(options);
};

// Function to reset the rate limit for a specific message type
export const resetToastRateLimit = (title?: string, description?: string) => {
  const messageKey = `${title || ''}-${description || ''}`;
  toastTracker.delete(messageKey);
};

// Function to reset all rate limits
export const resetAllToastRateLimits = () => {
  toastTracker.clear();
};