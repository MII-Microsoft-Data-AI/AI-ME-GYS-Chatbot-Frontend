export interface ChunkData {
  content: string;
  filename: string;
  fileurl: string;
}

interface CachedChunkData {
  data: ChunkData;
  timestamp: number;
}

const BaseAPIPath = '/api/be/v1/frontend/chunk';
const CACHE_PREFIX = 'chunk_cache_';

/**
 * Get cached chunk data from localStorage
 * @param id - The chunk ID
 * @param expiryTime - Time limit in milliseconds (default: 1 day = 86400000ms)
 * @returns The cached chunk data if valid, otherwise null
 */
const getCachedChunkData = (id: string, expiryTime: number = 86400000): ChunkData | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${id}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached) as CachedChunkData;
    const now = Date.now();

    // Check if cache has expired
    if (now - timestamp > expiryTime) {
      localStorage.removeItem(`${CACHE_PREFIX}${id}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Set chunk data cache in localStorage
 * @param id - The chunk ID
 * @param data - The chunk data to cache
 */
const setCachedChunkData = (id: string, data: ChunkData): void => {
  try {
    const cacheData: CachedChunkData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${id}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

/**
 * Get document chunk data with caching
 * @param id - The chunk ID
 * @param cacheExpiryTime - Cache expiry time in milliseconds (default: 1 day = 86400000ms)
 * @returns The chunk data
 */
export const getDocChunkData = async (id: string, cacheExpiryTime: number = 86400000): Promise<ChunkData> => {
  // Check cache first
  const cachedData = getCachedChunkData(id, cacheExpiryTime);
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
  setCachedChunkData(id, data);

  return data;
};