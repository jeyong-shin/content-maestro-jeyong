"use client"

import dynamic from 'next/dynamic'

const AuthProvider = dynamic(() => import('@/components/auth-provider'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    </div>
  )
})

export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
} 