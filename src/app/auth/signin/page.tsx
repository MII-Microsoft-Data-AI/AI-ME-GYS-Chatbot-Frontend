'use client'

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Logo from "@/components/Logo"
import { getSiteConfig } from "@/lib/site-config"
import { getSafeCallbackUrl } from "@/lib/callback-utils"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = getSafeCallbackUrl(searchParams.get('next'))
  const siteConfig = getSiteConfig()
  const [CurrenTime, setCurrenTime] = useState<null | Date>(null)

  // Check for accessToken in query parameters on component mount
  useEffect(() => {
    const loginTimeout = setTimeout(() => {
      const tokenFromQuery = searchParams.get('accessToken')
      console.log("Access Token from Query:", tokenFromQuery)
      if (tokenFromQuery) {
        setAccessToken(tokenFromQuery)
          // Auto sign in with token from query parameter
          ; (async () => {
            setIsLoading(true)
            setError("")

            try {
              const result = await signIn('token', {
                accessToken: tokenFromQuery,
                redirect: false,
              })

              if (result?.error) {
                setError("Invalid access token")
                router.replace(siteConfig.gysPortalUrl)
              } else {
                router.replace("/chat")
              }
            } catch (err) {
              router.replace(siteConfig.gysPortalUrl)
              console.error('Sign in error:', err)
              setError("An error occurred. Please try again.")
            } finally {
              setIsLoading(false)
            }
          })()
      } else {
        router.replace(siteConfig.gysPortalUrl)
      }
    }, 1000)

    return () => clearTimeout(loginTimeout)
  }, [searchParams])

  const handleTokenSignIn = async () => {
    if (!accessToken) {
      setError("Please enter an access token")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await signIn('token', {
        accessToken: accessToken,
        callbackUrl: next 
      })

      if (result?.error) {
        setError("Invalid access token")
      } else {
        router.push(next)
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleTokenSignIn()
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto">
            <Logo className="justify-center" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: 'var(--primary)' }}>
            Welcome to {siteConfig.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we verifying your access
            {/* <br />
            <span className="text-xs text-gray-500 mt-1 block">
              Demo token: &quot;abcdefghijk&quot;
            </span> */}
          </p>
        </div>

        {/* <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="accessToken" className="sr-only">
              Access Token
            </label>
            <input
              id="accessToken"
              name="accessToken"
              type="text"
              required
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:border-transparent focus:z-10 sm:text-sm"
              style={{ 
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderColor: 'var(--primary)'
              }}
              placeholder="Enter your access token"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in with Token'}
            </button>
          </div>
        </form> */}
      </div>
    </div>
  )
}
