'use client'

import { signIn } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/Logo"
import { getSiteConfig } from "@/lib/site-config"

interface SignInClientProps {
  callbackUrl: string
  accessToken: string
}

export default function SignInClient({ accessToken }: SignInClientProps) {
  const router = useRouter()
  const siteConfig = getSiteConfig()

  useEffect(() => {
    const loginTimeout = setTimeout(() => {
      const fallbackUrl = process.env.NEXT_PUBLIC_GYS_PORTAL_URL || "https://dev-management.gyssteel.com/"

      if (accessToken) {
          // Auto sign in with token from query parameter
          ; (async () => {

            try {
              const result = await signIn('token', {
                accessToken: accessToken,
                redirect: false
              })
              if (!result) {
                router.replace(fallbackUrl)
                return
              }
              if(!result.error) {
                router.replace('/chat')
              } else {
                router.replace(fallbackUrl)
              }
            } catch {
              router.replace(fallbackUrl)
            } finally {
            }
          })()
      } else {
        router.replace(fallbackUrl)
      }
    }, 1000)

    return () => clearTimeout(loginTimeout)
  }, [accessToken])

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
              Please wait while we checking your access
          </p>
        </div>
      </div>
    </div>
  )
}