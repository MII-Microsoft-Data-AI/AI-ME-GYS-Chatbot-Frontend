'use client'

import { createContext, useContext, useCallback, ReactNode, useEffect } from 'react'

interface CacheEntry<T = unknown> {
  data: T
  expiry: number // epoch time in milliseconds
}

interface CacheContextType {
  set: <T = unknown>(key: string, expiry: number, data: T) => void
  get: <T = unknown>(key: string) => T | undefined
}

const CacheContext = createContext<CacheContextType | undefined>(undefined)

export function useCacheStore() {
  const context = useContext(CacheContext)
  if (!context) {
    throw new Error('useCacheStore must be used within a CacheProvider')
  }
  return context
}

interface CacheProviderProps {
  children: ReactNode
}

const CACHE_PREFIX = 'app_cache_'

export function CacheProvider({ children }: CacheProviderProps) {
  // Set cache entry with expiry time
  const set = useCallback(<T = unknown>(key: string, expiry: number, data: T): void => {
    try {
      const cacheEntry: CacheEntry<T> = {
        data,
        expiry,
      }
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheEntry))
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }, [])

  // Get cache entry, returning undefined if expired or not found
  const get = useCallback(<T = unknown>(key: string): T | undefined => {
    try {
      const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`)
      if (!cached) return undefined

      const entry = JSON.parse(cached) as CacheEntry<T>
      const now = Date.now()

      // Check if cache has expired
      if (now >= entry.expiry) {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`)
        return undefined
      }

      return entry.data
    } catch (error) {
      console.error('Error reading cache:', error)
      return undefined
    }
  }, [])

  // Purge expired cache entries every 10 seconds
  useEffect(() => {
    const purgeExpiredCache = () => {
      try {
        const now = Date.now()
        const keysToRemove: string[] = []

        // Iterate through all localStorage keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(CACHE_PREFIX)) {
            const cached = localStorage.getItem(key)
            if (cached) {
              try {
                const entry = JSON.parse(cached) as CacheEntry
                if (now >= entry.expiry) {
                  keysToRemove.push(key)
                }
              } catch {
                // If parsing fails, mark for removal
                keysToRemove.push(key)
              }
            }
          }
        }

        // Remove expired entries
        keysToRemove.forEach(key => localStorage.removeItem(key))

        if (keysToRemove.length > 0) {
          console.log(`Purged ${keysToRemove.length} expired cache entries`)
        }
      } catch (error) {
        console.error('Error purging cache:', error)
      }
    }

    // Run immediately on mount
    purgeExpiredCache()

    // Set up interval to run every 10 seconds
    const interval = setInterval(purgeExpiredCache, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <CacheContext.Provider value={{ set, get }}>
      {children}
    </CacheContext.Provider>
  )
}
