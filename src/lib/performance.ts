// Prestanda-optimering och skalning för BizPal

// Paginering
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const createPaginationParams = (page: number = 1, limit: number = 20): PaginationParams => {
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)), // Max 100 items per page
    offset: (page - 1) * limit
  };
};

export const createPaginatedResponse = <T>(
  data: T[], 
  total: number, 
  page: number, 
  limit: number
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

// Caching
export class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const globalCache = new CacheManager();

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading hook
export const useLazyLoad = <T>(
  fetchFunction: () => Promise<T[]>,
  dependencies: any[] = [],
  cacheKey?: string
) => {
  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(true);

  const loadData = React.useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (cacheKey) {
        const cached = globalCache.get(cacheKey);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }
      }

      const result = await fetchFunction();
      
      if (cacheKey) {
        globalCache.set(cacheKey, result);
      }

      setData(result);
      setHasMore(result.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, loading, cacheKey]);

  React.useEffect(() => {
    loadData();
  }, dependencies);

  return { data, loading, error, hasMore, refetch: loadData };
};

// Virtual scrolling utilities
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan: number;
}

export const calculateVirtualScrollRange = (
  scrollTop: number,
  config: VirtualScrollConfig
) => {
  const { itemHeight, containerHeight, overscan } = config;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
    Number.MAX_SAFE_INTEGER
  );
  
  return { startIndex, endIndex };
};

// Search optimization
export const createSearchIndex = <T>(
  items: T[],
  searchFields: (keyof T)[]
) => {
  const index = new Map<string, T[]>();
  
  items.forEach(item => {
    searchFields.forEach(field => {
      const value = String(item[field]).toLowerCase();
      const words = value.split(/\s+/);
      
      words.forEach(word => {
        if (word.length >= 2) { // Only index words with 2+ characters
          if (!index.has(word)) {
            index.set(word, []);
          }
          index.get(word)!.push(item);
        }
      });
    });
  });
  
  return index;
};

export const searchWithIndex = <T>(
  query: string,
  searchIndex: Map<string, T[]>
): T[] => {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  const results = new Map<T, number>();
  
  searchTerms.forEach(term => {
    if (term.length >= 2) {
      const matches = searchIndex.get(term) || [];
      matches.forEach(item => {
        results.set(item, (results.get(item) || 0) + 1);
      });
    }
  });
  
  // Sort by relevance (number of matching terms)
  return Array.from(results.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([item]) => item);
};

// Image optimization
export const optimizeImageUrl = (
  url: string,
  width: number,
  height?: number,
  quality: number = 80
): string => {
  // If using a CDN like Cloudinary, you can add optimization parameters
  if (url.includes('cloudinary.com')) {
    const params = `w_${width}${height ? `,h_${height}` : ''},q_${quality},f_auto`;
    return url.replace('/upload/', `/upload/${params}/`);
  }
  
  return url;
};

// Bundle size optimization
export const lazyImport = <T>(
  importFunc: () => Promise<{ default: T }>
): T => {
  let component: T | null = null;
  let promise: Promise<T> | null = null;
  
  return new Proxy({} as T, {
    get(_, prop) {
      if (!component) {
        if (!promise) {
          promise = importFunc().then(module => {
            component = module.default;
            return component;
          });
        }
        throw promise;
      }
      return (component as any)[prop];
    }
  });
};

// Memory management
export const createMemoryManager = () => {
  const observers = new Set<() => void>();
  
  const addObserver = (callback: () => void) => {
    observers.add(callback);
  };
  
  const removeObserver = (callback: () => void) => {
    observers.delete(callback);
  };
  
  const cleanup = () => {
    observers.forEach(callback => callback());
    observers.clear();
    globalCache.cleanup();
  };
  
  // Auto cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup);
  }
  
  return { addObserver, removeObserver, cleanup };
};

// Performance monitoring
export const createPerformanceMonitor = () => {
  const metrics: Record<string, number[]> = {};
  
  const startTimer = (name: string) => {
    return performance.now();
  };
  
  const endTimer = (name: string, startTime: number) => {
    const duration = performance.now() - startTime;
    if (!metrics[name]) {
      metrics[name] = [];
    }
    metrics[name].push(duration);
    
    // Keep only last 100 measurements
    if (metrics[name].length > 100) {
      metrics[name] = metrics[name].slice(-100);
    }
    
    return duration;
  };
  
  const getAverageTime = (name: string): number => {
    const times = metrics[name];
    if (!times || times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  };
  
  const getMetrics = () => {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    Object.entries(metrics).forEach(([name, times]) => {
      result[name] = {
        avg: getAverageTime(name),
        min: Math.min(...times),
        max: Math.max(...times),
        count: times.length
      };
    });
    
    return result;
  };
  
  return { startTimer, endTimer, getAverageTime, getMetrics };
};

// Export React for lazy loading hook
import React from 'react'; 