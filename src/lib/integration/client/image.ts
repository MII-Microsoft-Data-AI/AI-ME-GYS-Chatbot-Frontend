'use client'

import { useCacheStore } from '@/contexts/CacheContext'

const BaseAPIPath = '/api/be/v1/frontend/image';

/**
 * Hook to get image source with caching
 * @returns Function to fetch image src with caching support
 */
export function useGetImageSrc() {
  const cache = useCacheStore();
  
  return async (imageData: string, cacheExpiryTime: number = 60000): Promise<string> => {
    const cacheKey = `image_${imageData}`;
    
    // Check cache first
    const cachedSrc = cache.get<string>(cacheKey);
    if (cachedSrc) {
      console.log("RES (from cache)", cachedSrc);
      return cachedSrc;
    }

    const safeURL = encodeURIComponent(imageData);
    const finalUrl = `${BaseAPIPath}?data=${safeURL}`
    console.log(finalUrl)
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    let result = await response.text()
    
    // Decode HTML entities and remove parentheses/quotes
    result = result
      .replace(/&quot;/g, '"')  // Decode &quot;
      .replace(/&amp;/g, '&')   // Decode &amp;
      .replace(/^\(|\)$/g, '')  // Remove parentheses
      .replace(/^"|"$/g, '')    // Remove surrounding quotes
      .trim()
    
    // Cache the result
    const expiry = Date.now() + cacheExpiryTime;
    cache.set(cacheKey, expiry, result);
    
    return result
  };
}