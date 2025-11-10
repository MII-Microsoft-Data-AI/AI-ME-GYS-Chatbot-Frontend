'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { ChatProvider } from "@/contexts/ChatContext"
import { ModalProvider } from "@/contexts/ModalContext"
import { CacheProvider } from "@/contexts/CacheContext"
import ConfirmationModal from "./ConfirmationModal"

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CacheProvider>
        <ChatProvider>
          <ModalProvider>
            {children}
            <ConfirmationModal />
          </ModalProvider>
        </ChatProvider>
      </CacheProvider>
    </SessionProvider>
  )
}
