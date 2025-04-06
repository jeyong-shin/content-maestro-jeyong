"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

// 클라이언트 사이드에서만 실행될 코드를 위한 함수
const useClientSideAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      setLoading(true)
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("인증 상태 확인 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // 인증 상태 변경 이벤트 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("로그아웃 오류:", error)
    }
  }

  return { user, loading, signOut }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // 클라이언트 사이드에서만 인증 로직 실행
  const authState = useClientSideAuth()

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
} 