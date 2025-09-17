// Site configuration settings
export interface SiteConfig {
  gysPortalUrl: string
  name: string
  title: string
  description: string
  url: string
  keywords: string[]
  favicon: string
  logo: {
    src: string // Image path or URL
    alt: string
    width?: number
    height?: number
  }
  social: {
    twitter?: string
    github?: string
    linkedin?: string
  }
  navigation: {
    sidebar: NavigationItem[]
    menu: NavigationItem[]
  }
  chat: {
    greeting: {
      morning: string
      afternoon: string
      evening: string
    }
    welcomeMessage: string
    recommendationQuestions: string[]
    messageLimit: number // Number of messages to fetch per request
  }
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon: {
    name: string
    svg: string
  }
  description?: string
  isExternal?: boolean
  showInSidebar?: boolean
  showInMenu?: boolean
  order?: number
}

// Default configuration - Customize these values to change your site branding
export const siteConfig: SiteConfig = {
  gysPortalUrl: "https://www.garudayamatosteel.com",
  name: "GYS Chat",
  title: "GYS Chat",
  description: "Garuda Yamato Steel - An AI powered chat assistant",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000", // Update with your actual domain
  keywords: ["chatgpt", "ai", "artificial intelligence", "chat", "assistant", "nextjs", "react"],
  favicon: "https://www.garudayamatosteel.com/wp-content/uploads/2024/06/cropped-GYS-Favicon-1-32x32.png",
  logo: {
    src: "https://www.garudayamatosteel.com/wp-content/uploads/2024/05/GYS-Logo-Header-1.webp", // Change this to your logo path
    alt: "GYS Logo",
    width: 118,
    height: 24
  },
  social: {
    // twitter: "@chatgptclone",
    // github: "https://github.com/your-username/chatgpt-clone",
    linkedin: "https://www.linkedin.com/company/pt-garuda-yamato-steel/"
  },
  navigation: {
    sidebar: [
      {
        id: 'chat',
        label: 'Chat',
        path: '/chat',
        icon: {
          name: 'chat',
          svg: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.883 8a9.864 9.864 0 01-4.601-1.139L3 21l2.139-3.516C4.381 16.275 4 14.193 4 12c0-4.418 4.477-8 10-8s10 3.582 10 8z'
        },
        description: 'Start a new conversation',
        showInSidebar: true,
        showInMenu: true,
        order: 1
      },
      // {
      //   id: 'resource-management',
      //   label: 'Resource Management',
      //   path: '/resource-management',
      //   icon: {
      //     name: 'folder',
      //     svg: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
      //   },
      //   description: 'Manage your resources and files',
      //   showInSidebar: false,
      //   showInMenu: true,
      //   order: 2
      // },
      // {
      //   id: 'settings',
      //   label: 'Settings',
      //   path: '/settings',
      //   icon: {
      //     name: 'settings',
      //     svg: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z'
      //   },
      //   description: 'Configure your preferences',
      //   showInSidebar: false,
      //   showInMenu: true,
      //   order: 3
      // }
    ],
    menu: [
      {
        id: 'chat',
        label: 'Chat',
        path: '/chat',
        icon: {
          name: 'chat',
          svg: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.883 8a9.864 9.864 0 01-4.601-1.139L3 21l2.139-3.516C4.381 16.275 4 14.193 4 12c0-4.418 4.477-8 10-8s10 3.582 10 8z'
        },
        description: 'Start a new conversation',
        showInSidebar: true,
        showInMenu: true,
        order: 1
      },
      // {
      //   id: 'resource-management',
      //   label: 'Resource Management',
      //   path: '/resource-management',
      //   icon: {
      //     name: 'folder',
      //     svg: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
      //   },
      //   description: 'Manage your resources and files',
      //   showInSidebar: false,
      //   showInMenu: true,
      //   order: 2
      // },
      // {
      //   id: 'settings',
      //   label: 'Settings',
      //   path: '/settings',
      //   icon: {
      //     name: 'settings',
      //     svg: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z'
      //   },
      //   description: 'Configure your preferences',
      //   showInSidebar: false,
      //   showInMenu: true,
      //   order: 3
      // }
    ]
  },
  chat: {
    greeting: {
      morning: "Hi, GYS Team \n Can I Help You Today?",
      afternoon: "Hi, GYS Team \n Can I Help You Today?",
      evening: "Hi, GYS Team \n Can I Help You Today?"
    },
    welcomeMessage: "Ready to assist you anything about the company information you need. Let's get started!",
    messageLimit: 4, // Number of messages to fetch per request, must even number
    recommendationQuestions: [
      "What is Garuda Yamato Steel's main product?",
      "Can you provide information about Garuda Yamato Steel's sustainability initiatives?",
      "How does Garuda Yamato Steel ensure product quality?",
      "What industries does Garuda Yamato Steel serve?"
    ]
  }
}

// Function to get the site configuration
export function getSiteConfig(): SiteConfig {
  return siteConfig
}

// Helper functions for navigation
export function getNavigationItems(type: 'sidebar' | 'menu'): NavigationItem[] {
  const items = siteConfig.navigation[type]
  return items
    .filter(item => type === 'sidebar' ? item.showInSidebar : item.showInMenu)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

export function getNavigationItem(id: string): NavigationItem | undefined {
  const allItems = [...siteConfig.navigation.sidebar, ...siteConfig.navigation.menu]
  return allItems.find(item => item.id === id)
}

export function getPageTitle(pathname: string): string {
  // Handle chat pages specially
  if (pathname === '/chat' || pathname === '/') {
    return 'New Chat'
  }
  
  if (pathname.startsWith('/chat/')) {
    return 'Chat'
  }
  
  // Find matching navigation item
  const allItems = [...siteConfig.navigation.sidebar, ...siteConfig.navigation.menu]
  const matchingItem = allItems.find(item => pathname.startsWith(item.path))
  
  return matchingItem?.label || 'Dashboard'
}