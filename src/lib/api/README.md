# API Library Documentation

## Overview

The SmartLearnAI API library provides a comprehensive, type-safe, and maintainable way to interact with the backend API. It includes centralized configuration, service layers, custom React Query hooks, and robust error handling.

## Architecture

```
src/lib/api/
├── config.ts              # Centralized configuration
├── types.ts               # TypeScript interfaces
├── errors.ts              # Error handling utilities
├── client.ts              # HTTP client and interceptors
├── services/              # API service layer
│   ├── auth.service.ts
│   ├── tools.service.ts
│   ├── purchases.service.ts
│   ├── payments.service.ts
│   ├── discount-codes.service.ts
│   ├── admin.service.ts
│   └── index.ts
├── hooks/                 # React Query hooks
│   ├── useAuth.ts
│   ├── useTools.ts
│   ├── usePurchases.ts
│   ├── usePayments.ts
│   ├── useDiscountCodes.ts
│   ├── useAdmin.ts
│   └── index.ts
└── index.ts               # Main export
```

## Quick Start

### 1. Install Dependencies

```bash
npm install @tanstack/react-query
```

### 2. Configure Environment Variables

```env
VITE_API_BASE_URL=https://shopnro.hitly.click
VITE_AUTH_SERVICE_URL=https://shopnro.hitly.click/api/auth
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_DEBUG=true
```

### 3. Setup Query Client

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/api';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

### 4. Use API Hooks

```typescript
import { useLogin, useTools, useCreatePurchase } from '@/lib/api';

function LoginForm() {
  const loginMutation = useLogin({
    onSuccess: (data) => {
      console.log('Login successful:', data.user);
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });

  const handleSubmit = (credentials) => {
    loginMutation.mutate(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type=\"submit\" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

function ToolsList() {
  const { data: tools, isLoading, error } = useTools();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {tools?.data.map(tool => (
        <div key={tool.id}>{tool.name}</div>
      ))}
    </div>
  );
}
```

## Core Concepts

### 1. Services

Services provide a clean abstraction over HTTP calls:

```typescript
import { authService, toolsService } from '@/lib/api/services';

// Direct service usage (not recommended in components)
const response = await authService.login({ email, password });
const tools = await toolsService.getTools({ page: 1, limit: 10 });
```

### 2. Hooks

Hooks provide React integration with proper caching and state management:

```typescript
import { useLogin, useTools } from '@/lib/api';

// Query hooks (for GET requests)
const { data, isLoading, error } = useTools({ category: 'ai' });

// Mutation hooks (for POST, PUT, DELETE requests)
const loginMutation = useLogin();
loginMutation.mutate({ email, password });
```

### 3. Error Handling

Comprehensive error handling with custom error types:

```typescript
import { 
  isUnauthorizedError, 
  isNetworkError, 
  getErrorToastConfig 
} from '@/lib/api';

const mutation = useSomeMutation({
  onError: (error) => {
    if (isUnauthorizedError(error)) {
      // Redirect to login
      window.location.href = '/login';
    } else if (isNetworkError(error)) {
      // Show network error message
      toast({ title: 'Network Error', description: 'Please check your connection' });
    } else {
      // Generic error handling
      const config = getErrorToastConfig(error);
      toast(config);
    }
  },
});
```

### 4. Configuration

Centralized configuration management:

```typescript
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api/config';

console.log(API_CONFIG.BASE_URL); // https://shopnro.hitly.click
console.log(API_ENDPOINTS.AUTH.LOGIN); // /api/auth/login
```

## Available Hooks

### Authentication

```typescript
import {
  useLogin,
  useRegister,
  useLogout,
  useCurrentUser,
  useUpdateProfile,
  useChangePassword,
  useRefreshToken,
} from '@/lib/api';

// Usage examples
const { data: user } = useCurrentUser();
const loginMutation = useLogin();
const updateMutation = useUpdateProfile();
```

### Tools

```typescript
import {
  useTools,
  useToolById,
  useToolCategories,
  useSearchTools,
  useFeaturedTools,
  usePopularTools,
} from '@/lib/api';

// Usage examples
const { data: tools } = useTools({ page: 1, limit: 20 });
const { data: tool } = useToolById('tool-id');
const { data: categories } = useToolCategories();
```

### Purchases

```typescript
import {
  useCreatePurchase,
  useUserPurchases,
  usePurchaseById,
  useChangeKey,
  useActivePurchases,
} from '@/lib/api';

// Usage examples
const purchaseMutation = useCreatePurchase();
const { data: purchases } = useUserPurchases();
const changeKeyMutation = useChangeKey();
```

### Payments

```typescript
import {
  useCreateDeposit,
  usePayments,
  usePaymentHistory,
  useUserBalance,
} from '@/lib/api';

// Usage examples
const depositMutation = useCreateDeposit();
const { data: balance } = useUserBalance();
const { data: history } = usePaymentHistory();
```

### Admin

```typescript
import {
  useAdminStatistics,
  useAdminUsers,
  useCreateTool,
  useUpdateTool,
  useDeleteTool,
} from '@/lib/api';

// Usage examples
const { data: stats } = useAdminStatistics();
const createToolMutation = useCreateTool();
const { data: users } = useAdminUsers();
```

## Advanced Usage

### Custom Hook Options

All hooks accept optional configuration:

```typescript
const { data } = useTools(
  { category: 'ai' }, // Query parameters
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: someCondition,
  }
);

const mutation = useCreatePurchase({
  onSuccess: (data) => {
    console.log('Purchase created:', data);
  },
  onError: (error) => {
    console.error('Purchase failed:', error);
  },
  retry: 2,
});
```

### Direct API Client Usage

```typescript
import { apiClient } from '@/lib/api';

// Direct HTTP calls (use sparingly)
const response = await apiClient.get('/api/custom-endpoint');
const result = await apiClient.post('/api/custom-action', { data });
```

### Token Management

```typescript
import { tokenManager } from '@/lib/api';

// Get current tokens
const tokens = tokenManager.getTokens();

// Set new tokens
tokenManager.setTokens({ accessToken, refreshToken });

// Clear all auth data
tokenManager.clearAll();
```

### Error Reporting

```typescript
import { reportError, logError } from '@/lib/api';

try {
  // Some operation
} catch (error) {
  const apiError = parseApiError(error);
  await reportError(apiError, 'Component Context');
}
```

## Best Practices

### 1. Use Hooks in Components

```typescript
// ✅ Good
function Component() {
  const { data } = useTools();
  const mutation = useCreatePurchase();
  
  return (
    <button onClick={() => mutation.mutate(data)}>
      Purchase
    </button>
  );
}

// ❌ Avoid direct service calls in components
function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    toolsService.getTools().then(setData); // Don't do this
  }, []);
}
```

### 2. Handle Loading and Error States

```typescript
function Component() {
  const { data, isLoading, error } = useTools();
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ToolsList tools={data} />;
}
```

### 3. Use Optimistic Updates

```typescript
const updateMutation = useUpdateTool({
  onMutate: async (newTool) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['tools', newTool.id] });
    
    // Snapshot previous value
    const previousTool = queryClient.getQueryData(['tools', newTool.id]);
    
    // Optimistically update
    queryClient.setQueryData(['tools', newTool.id], newTool);
    
    return { previousTool };
  },
  onError: (err, newTool, context) => {
    // Rollback on error
    queryClient.setQueryData(['tools', newTool.id], context.previousTool);
  },
});
```

### 4. Prefetch Data

```typescript
const queryClient = useQueryClient();

const prefetchTool = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['tools', id],
    queryFn: () => toolsService.getToolById(id),
    staleTime: 5 * 60 * 1000,
  });
};
```

## Testing

### Mock Services

```typescript
import { vi } from 'vitest';
import { authService } from '@/lib/api/services';

// Mock service methods
vi.mock('@/lib/api/services', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

// Use in tests
test('login flow', async () => {
  const mockLogin = vi.mocked(authService.login);
  mockLogin.mockResolvedValue({ data: { user: mockUser } });
  
  // Test component that uses useLogin
});
```

### Test Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from '@/lib/api';

test('useLogin hook', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  const { result } = renderHook(() => useLogin(), { wrapper });
  
  result.current.mutate({ email: 'test@example.com', password: 'password' });
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

## Performance Optimization

### 1. Configure Stale Time

```typescript
// Data that doesn't change often
const { data } = useToolCategories({
  staleTime: 15 * 60 * 1000, // 15 minutes
});

// Data that changes frequently
const { data } = useUserBalance({
  staleTime: 30 * 1000, // 30 seconds
});
```

### 2. Use Infinite Queries for Large Lists

```typescript
import { useInfiniteTools } from '@/lib/api';

function ToolsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTools();

  return (
    <div>
      {data?.pages.map(page => 
        page.data.map(tool => <ToolCard key={tool.id} tool={tool} />)
      )}
      {hasNextPage && (
        <button onClick={fetchNextPage} disabled={isFetchingNextPage}>
          Load More
        </button>
      )}
    </div>
  );
}
```

### 3. Invalidate Queries Strategically

```typescript
const createMutation = useCreateTool({
  onSuccess: () => {
    // Only invalidate what's necessary
    queryClient.invalidateQueries({ queryKey: ['tools'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'statistics'] });
  },
});
```

## Migration from Old API

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration instructions.

## Contributing

1. Follow the established patterns for new services and hooks
2. Add proper TypeScript types for all API responses
3. Include error handling for all operations
4. Write tests for new functionality
5. Update documentation for new features

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if tokens are valid and not expired
2. **Network Errors**: Verify API_BASE_URL in environment variables
3. **Type Errors**: Ensure all API responses match TypeScript interfaces
4. **Cache Issues**: Use React Query DevTools to inspect cache state

### Debug Mode

Enable debug logging in development:

```env
VITE_DEBUG=true
VITE_ENABLE_LOGGING=true
```

This will log all API requests, responses, and errors to the console.", "original_text": "", "replace_all": false}]
