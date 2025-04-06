"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Session, User } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

// 클라이언트 사이드에서만 실행될 코드를 위한 함수
const useClientSideAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getAuth = async () => {
      setLoading(true)
      
      try {
        // 세션 가져오기 - getUser() 대신 getSession() 사용
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("세션 가져오기 오류:", sessionError)
          return
        }
        
        if (sessionData?.session) {
          setSession(sessionData.session)
          setUser(sessionData.session.user)
        } else {
          console.log("세션이 없음")
          setUser(null)
          setSession(null)
        }
      } catch (error) {
        console.error("인증 상태 확인 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    getAuth()

    // 인증 상태 변경 이벤트 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("인증 상태 변경:", _event, session ? "세션 있음" : "세션 없음")
      setSession(session)
      setUser(session?.user || null)
      
      // 로그인 이벤트에서는 대시보드로 리다이렉트
      if (_event === 'SIGNED_IN') {
        router.push('/dashboard')
        router.refresh()
      }
      
      // 로그아웃 이벤트에서는 홈으로 리다이렉트
      if (_event === 'SIGNED_OUT') {
        router.push('/')
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("로그아웃 오류:", error)
    }
  }

  return { user, session, loading, signOut }
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