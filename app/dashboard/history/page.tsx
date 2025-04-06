"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardHeader from "@/components/dashboard-header"
import { useAuth } from "@/components/auth-provider"
import { getCreditTransactions, getContentGenerations, getUserCredits } from "@/utils/credit-service"
import { toast } from "sonner"
import { format } from "date-fns"

interface CreditTransaction {
  id: string
  amount: number
  type: 'charge' | 'use' | 'refund' | 'bonus'
  description: string
  created_at: string
}

interface ContentGeneration {
  id: string
  topic: string
  title: string
  credits_used: number
  created_at: string
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([])
  const [contentGenerations, setContentGenerations] = useState<ContentGeneration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [credits, setCredits] = useState<number>(0)

  // 인증 체크: 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // 히스토리 데이터 로드
  useEffect(() => {
    const loadHistoryData = async () => {
      if (!user) return
      
      setIsLoading(true)
      try {
        // 크레딧 정보 로드
        const creditsData = await getUserCredits()
        setCredits(creditsData)
        
        // 크레딧 트랜잭션 내역 로드
        const transactions = await getCreditTransactions()
        setCreditTransactions(transactions)
        
        // 콘텐츠 생성 내역 로드
        const generations = await getContentGenerations()
        setContentGenerations(generations)
      } catch (error) {
        console.error("히스토리 데이터 로드 오류:", error)
        toast.error("히스토리 데이터를 가져오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadHistoryData()
  }, [user])

  // 로딩 중이거나 인증되지 않은 상태에서는 로딩 화면 표시
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">로딩 중...</h1>
          <p className="mt-2 text-gray-500">잠시만 기다려 주세요.</p>
        </div>
      </div>
    )
  }

  // 사용자 정보 생성
  const userInfo = {
    name: user.email?.split('@')[0] || "사용자",
    email: user.email || "user@example.com",
    credits: credits
  }

  const getTransactionStatusColor = (type: string) => {
    switch (type) {
      case 'charge':
        return 'bg-green-100 text-green-800'
      case 'use':
        return 'bg-red-100 text-red-800'
      case 'refund':
        return 'bg-blue-100 text-blue-800'
      case 'bonus':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransactionStatusText = (type: string) => {
    switch (type) {
      case 'charge':
        return '충전'
      case 'use':
        return '사용'
      case 'refund':
        return '환불'
      case 'bonus':
        return '보너스'
      default:
        return '기타'
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={userInfo} />

      <div className="container flex-1 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">이용 내역</h1>
          <p className="text-gray-500">크레딧 사용 내역 및 콘텐츠 생성 기록을 확인해보세요.</p>
        </div>

        <Tabs defaultValue="transactions">
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">크레딧 거래 내역</TabsTrigger>
            <TabsTrigger value="content">콘텐츠 생성 기록</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>크레딧 거래 내역</CardTitle>
                <CardDescription>크레딧 충전, 사용, 환불 등의 내역을 확인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <p>데이터를 불러오는 중...</p>
                  </div>
                ) : creditTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-lg font-medium">거래 내역이 없습니다.</p>
                    <p className="text-gray-500 mt-2">콘텐츠를 생성하거나 크레딧을 충전하면 내역이 표시됩니다.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 border-b bg-gray-50 p-4 font-medium">
                      <div>날짜</div>
                      <div>내역</div>
                      <div>금액</div>
                      <div>상태</div>
                    </div>
                    <div className="divide-y">
                      {creditTransactions.map((transaction) => (
                        <div key={transaction.id} className="grid grid-cols-4 gap-4 p-4">
                          <div className="text-sm text-gray-500">
                            {format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm')}
                          </div>
                          <div>{transaction.description}</div>
                          <div className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </div>
                          <div>
                            <Badge className={getTransactionStatusColor(transaction.type)}>
                              {getTransactionStatusText(transaction.type)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>콘텐츠 생성 기록</CardTitle>
                <CardDescription>지금까지 생성한 콘텐츠 목록을 확인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <p>데이터를 불러오는 중...</p>
                  </div>
                ) : contentGenerations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-lg font-medium">생성된 콘텐츠가 없습니다.</p>
                    <p className="text-gray-500 mt-2">콘텐츠를 생성하면 여기에 기록됩니다.</p>
                    <Button 
                      onClick={() => router.push('/dashboard')}
                      className="mt-4"
                    >
                      콘텐츠 생성하기
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 border-b bg-gray-50 p-4 font-medium">
                      <div>날짜</div>
                      <div>제목</div>
                      <div>주제</div>
                      <div>사용 크레딧</div>
                    </div>
                    <div className="divide-y">
                      {contentGenerations.map((generation) => (
                        <div key={generation.id} className="grid grid-cols-4 gap-4 p-4">
                          <div className="text-sm text-gray-500">
                            {format(new Date(generation.created_at), 'yyyy-MM-dd HH:mm')}
                          </div>
                          <div className="truncate" title={generation.title}>
                            {generation.title}
                          </div>
                          <div className="truncate" title={generation.topic}>
                            {generation.topic}
                          </div>
                          <div>{generation.credits_used}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-gray-500 md:text-left">
            © 2025 콘텐츠 마에스트로. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-gray-500">
            <Link href="/terms" className="hover:underline">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:underline">
              개인정보처리방침
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

