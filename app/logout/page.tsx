"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function LogoutPage() {
  const { signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      if (loading) return
      await signOut()
      router.push("/")
    }

    performLogout()
  }, [signOut, router, loading])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">로그아웃 중...</h1>
        <p className="mt-2 text-gray-500">잠시만 기다려 주세요.</p>
      </div>
    </div>
  )
} 