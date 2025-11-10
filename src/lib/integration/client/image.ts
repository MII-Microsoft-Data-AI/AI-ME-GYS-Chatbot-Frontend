'use client'

import { useCacheStore } from '@/contexts/CacheContext'

const BaseAPIPath = '/api/be/v1/frontend/image';

/**
 * Get image source with caching
 * @param imageData - The image data identifier
 * @param cacheExpiryTime - Cache expiry time in milliseconds (default: 1 minute = 60000ms)
 * @returns The resolved image src
 */
export const getImageSrc = async (imageData: string, cacheExpiryTime: number = 60000): Promise<string> => {
  const cacheKey = `image_${imageData}`;
  
  // Try to get from cache using direct localStorage access for backward compatibility
  // In a proper React component, use useCacheStore() hook
  try {
    const cached = localStorage.getItem(`app_cache_${cacheKey}`);
    if (cached) {
      const entry = JSON.parse(cached) as { data: string; expiry: number };
      const now = Date.now();
      
      if (now < entry.expiry) {
        console.log("RES (from cache)", entry.data);
        return entry.data;
      }
    }
  } catch (error) {
    console.error('Error reading image cache:', error);
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
  
  // Cache the result with expiry time
  try {
    const expiry = Date.now() + cacheExpiryTime;
    const cacheEntry = {
      data: result,
      expiry,
    };
    localStorage.setItem(`app_cache_${cacheKey}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error setting image cache:', error);
  }
  
  return result
}

/**
 * Hook-based version of getImageSrc for use in React components
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