"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { processPaymentSuccess } from "@/utils/payment-service"
import { CheckCircle, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey")
    const orderId = searchParams.get("orderId")
    const amount = searchParams.get("amount")

    // 필수 파라미터 확인
    if (!paymentKey || !orderId || !amount) {
      setError("필수 결제 정보가 누락되었습니다.")
      setIsLoading(false)
      return
    }

    const completePayment = async () => {
      try {
        setIsLoading(true)
        const result = await processPaymentSuccess(
          orderId,
          paymentKey,
          parseInt(amount)
        )
        setPaymentDetails(result)
        toast.success("크레딧이 성공적으로 충전되었습니다!")
      } catch (error: any) {
        console.error("결제 완료 처리 오류:", error)
        setError(error.message || "결제 완료 처리 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    completePayment()
  }, [searchParams])

  const handleGoToCredits = () => {
    router.push("/dashboard/credits")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">결제 완료</CardTitle>
          <CardDescription className="text-center">
            토스페이먼츠 결제 처리 결과
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
              <p>결제를 완료하는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-800">
              <p className="font-medium">오류가 발생했습니다</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle className="mb-2 h-12 w-12 text-green-500" />
                <p className="text-lg font-medium">결제가 성공적으로 완료되었습니다</p>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">주문 상품</span>
                    <span>{paymentDetails?.orderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">충전된 크레딧</span>
                    <span>{paymentDetails?.credits}개</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGoToCredits}
            className="w-full"
            disabled={isLoading}
          >
            크레딧 페이지로 돌아가기
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 