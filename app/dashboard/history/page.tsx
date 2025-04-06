import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardHeader from "@/components/dashboard-header"

export default function HistoryPage() {
  // Mock user data
  const user = {
    name: "사용자",
    email: "user@example.com",
    credits: 8,
  }

  // Mock payment history
  const paymentHistory = [
    {
      id: "INV-001",
      date: "2025-04-01",
      package: "기본 패키지",
      credits: 10,
      amount: 5000,
      status: "완료",
    },
    {
      id: "INV-002",
      date: "2025-03-15",
      package: "스탠다드 패키지",
      credits: 100,
      amount: 40000,
      status: "완료",
    },
    {
      id: "INV-003",
      date: "2025-02-28",
      package: "기본 패키지",
      credits: 10,
      amount: 5000,
      status: "완료",
    },
    {
      id: "INV-004",
      date: "2025-02-10",
      package: "프리미엄 패키지",
      credits: 500,
      amount: 175000,
      status: "완료",
    },
    {
      id: "INV-005",
      date: "2025-01-05",
      package: "기본 패키지",
      credits: 10,
      amount: 5000,
      status: "완료",
    },
  ]

  // Mock credit usage history
  const usageHistory = [
    {
      id: "USE-001",
      date: "2025-04-05",
      topic: "디지털 마케팅 트렌드",
      credits: 1,
    },
    {
      id: "USE-002",
      date: "2025-04-03",
      topic: "건강한 식습관의 중요성",
      credits: 1,
    },
    {
      id: "USE-003",
      date: "2025-04-02",
      topic: "재택근무의 장단점",
      credits: 1,
    },
    {
      id: "USE-004",
      date: "2025-03-30",
      topic: "효과적인 시간 관리 방법",
      credits: 1,
    },
    {
      id: "USE-005",
      date: "2025-03-28",
      topic: "인공지능의 미래",
      credits: 1,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold">결제 및 사용 내역</h1>
            <p className="text-gray-500">크레딧 결제 및 사용 내역을 확인하세요</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>크레딧 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">현재 보유 크레딧</span>
                    <Badge variant="outline" className="text-lg">
                      {user.credits}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">총 구매 크레딧</span>
                    <span>630</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">총 사용 크레딧</span>
                    <span>622</span>
                  </div>
                  <div className="pt-2">
                    <Link href="/dashboard/credits">
                      <Button className="w-full">크레딧 충전하기</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>월별 사용량</CardTitle>
                <CardDescription>최근 6개월 크레딧 사용량 통계</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full rounded-md bg-gray-50 flex items-center justify-center">
                  <p className="text-gray-500">월별 사용량 차트가 표시됩니다</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>결제 내역</CardTitle>
              <CardDescription>크레딧 구매 결제 내역을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>결제 번호</TableHead>
                    <TableHead>날짜</TableHead>
                    <TableHead>패키지</TableHead>
                    <TableHead>크레딧</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">영수증</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.package}</TableCell>
                      <TableCell>{payment.credits}개</TableCell>
                      <TableCell>{payment.amount.toLocaleString()}원</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-600">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>크레딧 사용 내역</CardTitle>
              <CardDescription>콘텐츠 생성에 사용된 크레딧 내역을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>날짜</TableHead>
                    <TableHead>주제</TableHead>
                    <TableHead>사용 크레딧</TableHead>
                    <TableHead className="text-right">콘텐츠 보기</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageHistory.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell className="font-medium">{usage.id}</TableCell>
                      <TableCell>{usage.date}</TableCell>
                      <TableCell>{usage.topic}</TableCell>
                      <TableCell>{usage.credits}개</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">더 보기</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="mt-auto border-t py-6">
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

