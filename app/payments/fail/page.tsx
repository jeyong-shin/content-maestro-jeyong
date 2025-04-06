"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function PaymentFailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const code = searchParams.get("code")
  const message = searchParams.get("message") || "알 수 없는 오류가 발생했습니다."
  
  const handleRetry = () => {
    router.push("/dashboard/credits")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">결제 실패</CardTitle>
          <CardDescription className="text-center">
            토스페이먼츠 결제 처리 중 오류가 발생했습니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-4">
            <AlertTriangle className="mb-2 h-12 w-12 text-amber-500" />
            <p className="text-lg font-medium">결제를 완료할 수 없습니다</p>
          </div>
          
          <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
            <p className="font-medium">오류 정보</p>
            {code && (
              <p className="mt-1 text-sm">
                <span className="font-medium">에러 코드:</span> {code}
              </p>
            )}
            <p className="mt-1 text-sm">
              <span className="font-medium">메시지:</span> {message}
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>결제 과정에서 문제가 발생했습니다. 다시 시도하거나 다른 결제 수단을 사용해 보세요.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleRetry}
            className="w-full"
          >
            결제 다시 시도하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 