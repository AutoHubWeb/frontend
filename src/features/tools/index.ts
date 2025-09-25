/**
 * Tools Feature Index
 * Exports all tools-related functionality
 */

// API hooks
export { 
  useTools, 
  useToolById, 
  useToolCategories,
  useSearchTools,
  useFeaturedTools,
  usePopularTools,
  useRecommendedTools,
  usePrefetchTool
} from '@/lib/api/hooks/useTools';

// Pages
export { default as Tools } from './pages/Tools';
export { default as ToolDetails } from './pages/ToolDetails';
export { default as PurchasedTools } from './pages/PurchasedTools';

// Components
export { ToolCard } from './components/ToolCard';

// Types
export type { Tool, Category, SearchParams } from '@/lib/api/types';
