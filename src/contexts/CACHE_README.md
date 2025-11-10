# Cache Provider Documentation

## Overview

The `CacheProvider` is a React context provider that manages client-side caching using localStorage. It provides automatic cache expiration and periodic cleanup of expired entries.

## Features

- **Automatic Expiration**: Cache entries expire based on epoch time
- **Automatic Cleanup**: Expired entries are purged every 10 seconds
- **Type-Safe**: Full TypeScript support with generics
- **Simple API**: Easy-to-use `set` and `get` methods

## Usage

### Basic Example

```tsx
import { useCacheStore } from '@/contexts/CacheContext'

function MyComponent() {
  const cache = useCacheStore()
  
  const fetchData = async () => {
    // Check cache first
    const cached = cache.get<MyDataType>('my-cache-key')
    if (cached) {
      return cached
    }
    
    // Fetch fresh data
    const data = await fetchFromAPI()
    
    // Cache for 1 hour (3600000 ms)
    const expiry = Date.now() + 3600000
    cache.set('my-cache-key', expiry, data)
    
    return data
  }
}
```

### API Reference

#### `useCacheStore()`

Returns the cache context with `set` and `get` methods.

**Must be used within a component wrapped by `CacheProvider`.**

#### `set<T>(key: string, expiry: number, data: T): void`

Stores data in the cache with an expiration time.

- `key`: Unique identifier for the cache entry
- `expiry`: Expiration time in epoch milliseconds (e.g., `Date.now() + 60000` for 1 minute)
- `data`: The data to cache (can be any JSON-serializable type)

#### `get<T>(key: string): T | undefined`

Retrieves data from the cache.

- `key`: Unique identifier for the cache entry
- Returns: The cached data if found and not expired, otherwise `undefined`

### Integration Examples

#### Image Caching (from `image.ts`)

```tsx
import { useCacheStore } from '@/contexts/CacheContext'

export function useGetImageSrc() {
  const cache = useCacheStore()
  
  return async (imageData: string, cacheExpiryTime: number = 60000) => {
    const cacheKey = `image_${imageData}`
    
    // Check cache
    const cachedSrc = cache.get<string>(cacheKey)
    if (cachedSrc) {
      return cachedSrc
    }
    
    // Fetch and cache
    const result = await fetchImage(imageData)
    const expiry = Date.now() + cacheExpiryTime
    cache.set(cacheKey, expiry, result)
    
    return result
  }
}
```

#### Document Chunk Caching (from `chunk.ts`)

```tsx
import { useCacheStore } from '@/contexts/CacheContext'

export function useGetDocChunkData() {
  const cache = useCacheStore()
  
  return async (id: string, cacheExpiryTime: number = 86400000) => {
    const cacheKey = `chunk_${id}`
    
    // Check cache
    const cachedData = cache.get<ChunkData>(cacheKey)
    if (cachedData) {
      return cachedData
    }
    
    // Fetch and cache
    const data = await fetchChunk(id)
    const expiry = Date.now() + cacheExpiryTime
    cache.set(cacheKey, expiry, data)
    
    return data
  }
}
```

## Implementation Details

### Cache Structure

Each cache entry is stored in localStorage with the following structure:

```typescript
{
  data: T,           // The cached data
  expiry: number     // Expiration time in epoch milliseconds
}
```

### Storage Key Format

Cache entries are stored with the prefix `app_cache_`:
- Example: `app_cache_chunk_123` for chunk ID 123
- Example: `app_cache_image_xyz` for image data xyz

### Automatic Cleanup

The `CacheProvider` runs a cleanup task every 10 seconds that:
1. Iterates through all localStorage keys with the `app_cache_` prefix
2. Checks if each entry has expired
3. Removes expired entries
4. Logs the number of purged entries (if any)

### Error Handling

- All cache operations are wrapped in try-catch blocks
- Errors are logged to the console but don't throw
- Failed reads return `undefined`
- Failed writes are silently ignored

## Provider Setup

The `CacheProvider` is already integrated in the root layout via the `Providers` component:

```tsx
// src/components/Providers.tsx
<SessionProvider>
  <CacheProvider>
    <ChatProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </ChatProvider>
  </CacheProvider>
</SessionProvider>
```

This ensures the cache is available throughout the entire application.
