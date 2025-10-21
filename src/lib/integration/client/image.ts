'use client'

const BaseAPIPath = '/api/be/v1/frontend/image';

interface CachedImageSrc {
  src: string;
  timestamp: number;
}

const CACHE_PREFIX = 'image_cache_';

/**
 * Get cached image source from localStorage
 * @param imageData - The image data identifier
 * @param expiryTime - Time limit in milliseconds (default: 1 minute = 60000ms)
 * @returns The cached image src if valid, otherwise null
 */
const getCachedImageSrc = (imageData: string, expiryTime: number = 60000): string | null => {
  try {
    const cacheKey = `${CACHE_PREFIX}${imageData}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { src, timestamp } = JSON.parse(cached) as CachedImageSrc;
    const now = Date.now();

    // Check if cache has expired
    if (now - timestamp > expiryTime) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return src;
  } catch (error) {
    console.error('Error reading image cache:', error);
    return null;
  }
};

/**
 * Set image source cache in localStorage
 * @param imageData - The image data identifier
 * @param src - The image src to cache
 */
const setCachedImageSrc = (imageData: string, src: string): void => {
  try {
    const cacheKey = `${CACHE_PREFIX}${imageData}`;
    const cacheData: CachedImageSrc = {
      src,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting image cache:', error);
  }
};

/**
 * Get image source with caching
 * @param imageData - The image data identifier
 * @param cacheExpiryTime - Cache expiry time in milliseconds (default: 1 minute = 60000ms)
 * @returns The resolved image src
 */
export const getImageSrc = async (imageData: string, cacheExpiryTime: number = 60000): Promise<string> => {
  // Check cache first
  const cachedSrc = getCachedImageSrc(imageData, cacheExpiryTime);
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
  setCachedImageSrc(imageData, result);
  
  return result
}