"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { getUserCredits } from "@/utils/credit-service"

interface User {
  name: string
  email: string
  credits: number
}

interface DashboardHeaderProps {
  user?: User
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { user: authUser, signOut } = useAuth()
  const [credits, setCredits] = useState<number>(user?.credits || 0)
  
  // 사용자 크레딧 정보 로드
  useEffect(() => {
    const loadCredits = async () => {
      if (authUser && authUser.email) {
        // user 속성이 전달되지 않았거나, 실제 로그인된 사용자 정보와 전달된 user 정보가 일치하지 않는 경우
        if (!user || authUser.email !== user.email) {
          console.log("실제 로그인된 사용자 정보를 사용합니다:", authUser.email)
          try {
            const userCredits = await getUserCredits()
            console.log("DashboardHeader: 실제 크레딧 정보", userCredits)
            setCredits(userCredits)
          } catch (error) {
            console.error("크레딧 정보 로드 오류:", error)
          }
        } else {
          setCredits(user.credits)
        }
      }
    }
    
    loadCredits()
  }, [authUser, user])
  
  // 실제 화면에 표시할 사용자 정보
  const displayUser = {
    name: authUser?.email?.split('@')[0] || user?.name || "사용자",
    email: authUser?.email || user?.email || "로그인 필요",
    credits: credits
  }

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">콘텐츠 마에스트로</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              대시보드
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium hover:underline">
              결제 내역
            </Link>
            <Link href="/dashboard/settings" className="text-sm font-medium hover:underline">
              설정
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">크레딧: {displayUser.credits}개</span>
            <Link href="/dashboard/credits">
              <Button variant="outline" size="sm">
                충전하기
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block text-sm">{displayUser.email}</span>
            <Avatar>
              <AvatarFallback>{displayUser.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="hidden md:inline-flex"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

