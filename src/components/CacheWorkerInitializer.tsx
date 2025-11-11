'use client'

import { useEffect } from 'react';

const CACHE_PREFIXES = ['chunk_cache_', 'image_cache_'];
const CHECK_INTERVAL = 60000; // 1 minute in milliseconds

// Default expiry times for different cache types
const CACHE_EXPIRY_TIMES: Record<string, number> = {
  chunk_cache_: 24 * 60 * 60000, // 1 day for chunks
  image_cache_: 60 * 60000,    // 60 minute for images
};

/**
 * Perform cache cleanup by removing expired entries
 */
function cleanupExpiredCache(): number {
  console.log('[Cache Housekeeping] Cleaning up expired cache entries');

  let totalRemoved = 0;
  const now = Date.now();

  try {
    const keysToRemove: string[] = [];

    // Iterate through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Check if this key matches any of our cache prefixes
      const prefix = CACHE_PREFIXES.find(p => key.startsWith(p));
      if (!prefix) continue;

      try {
        const cached = localStorage.getItem(key);
        if (!cached) continue;

        const { timestamp } = JSON.parse(cached);
        const expiryTime = CACHE_EXPIRY_TIMES[prefix] || 86400000;

        // Check if cache has expired
        if (now - timestamp > expiryTime) {
          keysToRemove.push(key);
        }
      } catch (error) {
        // If we can't parse the cache entry, consider it invalid and remove it
        console.error(`[Cache Housekeeping] Invalid cache entry for key ${key}:`, error);
        keysToRemove.push(key);
      }
    }

    // Remove expired entries
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      totalRemoved++;
    });

    if (totalRemoved > 0) {
      console.log(`[Cache Housekeeping] Removed ${totalRemoved} expired cache entries`);
    }
  } catch (error) {
    console.error('[Cache Housekeeping] Error during cleanup:', error);
  }

  console.log('[Cache Housekeeping] Cache cleanup completed');

  return totalRemoved;
}

/**
 * Component to perform periodic cache cleanup
 * Runs cleanup every 1 minute to remove expired cache entries
 * Should be included once in the root layout
 */
export function CacheHousekeeping() {
  useEffect(() => {
    // Run initial cleanup
    console.log('[Cache Housekeeping] Starting cache cleanup service');
    cleanupExpiredCache();

    // Set up interval to run cleanup every minute
    const intervalId = setInterval(() => {
      cleanupExpiredCache();
    }, CHECK_INTERVAL);

    // Cleanup interval when component unmounts
    return () => {
      console.log('[Cache Housekeeping] Stopping cache cleanup service');
      clearInterval(intervalId);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
