'use client'

import { useCacheStore } from '@/contexts/CacheContext'

export interface ChunkData {
  content: string;
  filename: string;
  fileurl: string;
}

const BaseAPIPath = '/api/be/v1/frontend/chunk';

/**
 * Get document chunk data with caching
 * @param id - The chunk ID
 * @param cacheExpiryTime - Cache expiry time in milliseconds (default: 1 day = 86400000ms)
 * @returns The chunk data
 */
export const getDocChunkData = async (id: string, cacheExpiryTime: number = 86400000): Promise<ChunkData> => {
  // This function needs to be called within a React component to access the cache
  // For now, we'll use a global cache access pattern
  const cacheKey = `chunk_${id}`;
  
  // Try to get from cache using direct localStorage access for backward compatibility
  // In a proper React component, use useCacheStore() hook
  try {
    const cached = localStorage.getItem(`app_cache_${cacheKey}`);
    if (cached) {
      const entry = JSON.parse(cached) as { data: ChunkData; expiry: number };
      const now = Date.now();
      
      if (now < entry.expiry) {
        return entry.data;
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }

  // Fetch from API if not in cache
  const res = await fetch(`${BaseAPIPath}/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch chunk data');
  }

  const data = await res.json() as ChunkData;

  // Cache the result with expiry time
  try {
    const expiry = Date.now() + cacheExpiryTime;
    const cacheEntry = {
      data,
      expiry,
    };
    localStorage.setItem(`app_cache_${cacheKey}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error setting cache:', error);
  }

  return data;
};

/**
 * Hook-based version of getDocChunkData for use in React components
 */
export function useGetDocChunkData() {
  const cache = useCacheStore();
  
  return async (id: string, cacheExpiryTime: number = 86400000): Promise<ChunkData> => {
    const cacheKey = `chunk_${id}`;
    
    // Check cache first
    const cachedData = cache.get<ChunkData>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Fetch from API if not in cache
    const res = await fetch(`${BaseAPIPath}/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch chunk data');
    }

    const data = await res.json() as ChunkData;

    // Cache the result
    const expiry = Date.now() + cacheExpiryTime;
    cache.set(cacheKey, expiry, data);

    return data;
  };
}