'use client'

import { useCacheStore } from '@/contexts/CacheContext'

export interface ChunkData {
  content: string;
  filename: string;
  fileurl: string;
}

const BaseAPIPath = '/api/be/v1/frontend/chunk';

/**
 * Hook to get document chunk data with caching
 * @returns Function to fetch chunk data with caching support
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