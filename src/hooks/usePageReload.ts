import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if the page was reloaded
 * Returns true if the page was reloaded, false if it was navigated to
 */
export function usePageReload() {
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    // Check if this is the first load in this session
    const isFirstLoad = !sessionStorage.getItem('page-loaded');
    
    if (isFirstLoad) {
      // Mark that the page has been loaded
      sessionStorage.setItem('page-loaded', 'true');
      
      // Check using performance.navigation (deprecated but widely supported)
      // @ts-ignore - performance.navigation is deprecated but still widely supported
      if (typeof window !== 'undefined' && window.performance && window.performance.navigation) {
        // @ts-ignore
        const navigationType = window.performance.navigation.type;
        // 0 = TYPE_NAVIGATE (normal navigation or reload)
        // 1 = TYPE_RELOAD (reload)
        // 2 = TYPE_BACK_FORWARD (back/forward navigation)
        if (navigationType === 1) { // Reload
          setIsReload(true);
          return;
        }
      }
      
      // Fallback: Check if the page was reloaded by looking at the navigation entries
      if (typeof window !== 'undefined' && window.performance && window.performance.getEntriesByType) {
        const entries = window.performance.getEntriesByType('navigation');
        if (entries.length > 0) {
          // @ts-ignore
          const entry = entries[0];
          // @ts-ignore
          if (entry.type === 'reload') {
            setIsReload(true);
            return;
          }
        }
      }
      
      // If we get here, it's likely a navigation, not a reload
      setIsReload(false);
    } else {
      // Not first load, so it's a navigation
      setIsReload(false);
    }
  }, []);

  return isReload;
}
