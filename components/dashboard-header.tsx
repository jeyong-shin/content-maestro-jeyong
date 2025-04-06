import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface User {
  name: string
  email: string
  credits: number
}

interface DashboardHeaderProps {
  user: User
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
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
            <span className="text-sm font-medium">크레딧: {user.credits}개</span>
            <Link href="/dashboard/credits">
              <Button variant="outline" size="sm">
                충전하기
              </Button>
            </Link>
          </div>
          <Avatar>
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

