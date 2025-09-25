/**
 * Legacy Query Client
 * This file maintains backward compatibility while the codebase migrates to the new API structure
 * @deprecated Use the new API structure from '@/lib/api' instead
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { apiClient, tokenManager, API_CONFIG } from './api';

// Legacy API Configuration - kept for backward compatibility
// @deprecated Use API_CONFIG from '@/lib/api/config' instead
const API_BASE_URL = API_CONFIG.BASE_URL;

// Token storage helper functions - re-exported from new API structure
// @deprecated Use tokenManager from '@/lib/api/client' instead
export const getTokens = tokenManager.getTokens;
export const setTokens = tokenManager.setTokens;
export const getUser = tokenManager.getUser;
export const setUser = tokenManager.setUser;

// Legacy error handling function
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Legacy API request function - maintained for backward compatibility
// @deprecated Use apiClient from '@/lib/api/client' instead
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const tokens = getTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add JWT token if available
  if (tokens?.accessToken) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  // Construct full URL with API base URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Keep for session-based auth fallback
  });

  await throwIfResNotOk(res);
  return res;
}

// Legacy query function - maintained for backward compatibility
// @deprecated Use the new API hooks from '@/lib/api/hooks' instead
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const tokens = getTokens();
    const headers: Record<string, string> = {};

    // Add JWT token if available
    if (tokens?.accessToken) {
      headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    // Construct full URL with API base URL
    const path = queryKey.join("/") as string;
    const fullUrl = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

    const res = await fetch(fullUrl, {
      headers,
      credentials: "include", // Keep for session-based auth fallback
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Legacy query client - maintained for backward compatibility
// @deprecated Consider using the new query client configuration from '@/lib/api'
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
