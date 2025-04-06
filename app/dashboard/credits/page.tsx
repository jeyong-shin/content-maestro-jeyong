"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUserCredits } from "@/utils/credit-service"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { preparePayment } from "@/utils/payment-service"
import { loadTossPayments } from "@tosspayments/payment-sdk"
import PaymentWidget from "./payment-widget"
import dynamic from "next/dynamic"

// 클라이언트 사이드에서만 로드되도록 동적 임포트
const DynamicPaymentWidget = dynamic(() => import('./payment-widget'), {
  ssr: false
});

interface Plan {
  id: string
  name: string
  credits: number
  price: number
  originalPrice?: number
  discount: number
  description: string
  popular?: boolean
}

export default function CreditsPage() {
  const [selectedPlan, setSelectedPlan] = useState("basic")
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [userCredits, setUserCredits] = useState<number>(0)
  const [isLoadingCredits, setIsLoadingCredits] = useState(true)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<{
    orderId: string;
    amount: number;
    orderName: string;
  } | null>(null);

  // 인증 체크: 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // 사용자 크레딧 정보 로드
  useEffect(() => {
    const loadUserCredits = async () => {
      if (!user) return
      
      setIsLoadingCredits(true)
      try {
        const credits = await getUserCredits()
        setUserCredits(credits)
      } catch (error) {
        console.error("크레딧 정보 로드 오류:", error)
        toast.error("크레딧 정보를 가져오는데 실패했습니다.")
      } finally {
        setIsLoadingCredits(false)
      }
    }

    loadUserCredits()
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

  const plans: Plan[] = [
    {
      id: "basic",
      name: "기본 패키지",
      credits: 10,
      price: 5000,
      discount: 0,
      description: "소규모 콘텐츠 제작에 적합",
    },
    {
      id: "standard",
      name: "스탠다드 패키지",
      credits: 100,
      price: 40000,
      originalPrice: 50000,
      discount: 20,
      description: "중규모 콘텐츠 제작에 적합",
    },
    {
      id: "premium",
      name: "프리미엄 패키지",
      credits: 500,
      price: 175000,
      originalPrice: 250000,
      discount: 30,
      description: "대량 콘텐츠 제작에 최적화",
      popular: true,
    },
  ]

  const handlePurchase = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      
      // 선택된 플랜 정보
      const selectedPlanInfo = plans.find((p) => p.id === selectedPlan) || plans[0];
      
      // 결제 준비 (서버에 결제 정보 저장)
      const paymentPreparation = await preparePayment({
        id: selectedPlanInfo.id,
        name: selectedPlanInfo.name,
        credits: selectedPlanInfo.credits,
        price: selectedPlanInfo.price
      });
      
      console.log("결제 준비 정보:", paymentPreparation);
      
      // 결제 정보 설정 (위젯에서 사용)
      setPaymentInfo({
        orderId: paymentPreparation.orderId,
        amount: selectedPlanInfo.price,
        orderName: `크레딧 충전 - ${selectedPlanInfo.name}`
      });
      
    } catch (error: any) {
      console.error("결제 준비 오류:", error);
      
      // 오류 메시지를 더 자세히 표시
      let errorMessage = "결제 준비 중 오류가 발생했습니다.";
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.code) {
        errorMessage += ` (코드: ${error.code})`;
      }
      
      toast.error(errorMessage);
      setIsProcessingPayment(false);
    }
  };

  // 선택된 플랜 정보
  const selectedPlanInfo = plans.find((p) => p.id === selectedPlan) || plans[0]
  
  // 사용자 이름 계산
  const userName = user.email?.split('@')[0] || "사용자"

  return (
    <div className="flex min-h-screen flex-col">
      {/* 직접 구현한 헤더 */}
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
              <span className="text-sm font-medium">크레딧: {userCredits}개</span>
              <Link href="/dashboard/credits">
                <Button variant="outline" size="sm">
                  충전하기
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-sm">{user.email}</span>
              <Avatar>
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
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

      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold">크레딧 충전</h1>
            <p className="text-gray-500">필요한 크레딧 패키지를 선택하고 충전하세요</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>크레딧 패키지 선택</CardTitle>
                  <CardDescription>
                    필요한 크레딧 패키지를 선택하세요. 대량 구매 시 할인 혜택이 적용됩니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`flex items-center space-x-2 rounded-lg border p-4 ${
                          selectedPlan === plan.id ? "border-primary bg-primary/5" : ""
                        } ${plan.popular ? "relative" : ""}`}
                      >
                        {plan.popular && <Badge className="absolute -top-2 -right-2 bg-primary">인기</Badge>}
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <Label htmlFor={plan.id} className="flex flex-1 cursor-pointer items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-gray-500">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end">
                              {plan.discount > 0 && plan.originalPrice && (
                                <span className="mr-2 text-sm line-through text-gray-500">
                                  {plan.originalPrice.toLocaleString()}원
                                </span>
                              )}
                              <span className="font-bold">{plan.price.toLocaleString()}원</span>
                            </div>
                            <div className="flex items-center justify-end space-x-1 text-sm text-gray-500">
                              <span>{plan.credits}개 크레딧</span>
                              {plan.discount > 0 && (
                                <Badge variant="outline" className="text-green-500">
                                  {plan.discount}% 할인
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>결제 정보</CardTitle>
                  <CardDescription>선택한 패키지의 결제 정보를 확인하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">현재 보유 크레딧</span>
                        <span>{userCredits}개</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>선택한 패키지</span>
                        <span>{selectedPlanInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">추가될 크레딧</span>
                        <span>{selectedPlanInfo.credits}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">결제 금액</span>
                        <span>{selectedPlanInfo.price.toLocaleString()}원</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-medium">
                          <span>충전 후 총 크레딧</span>
                          <span>{userCredits + selectedPlanInfo.credits}개</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handlePurchase} 
                    className="w-full" 
                    disabled={isProcessingPayment || isLoadingCredits}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        결제 처리 중...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        결제하기
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* 토스페이먼츠 결제 위젯 */}
              {paymentInfo && (
                <DynamicPaymentWidget
                  clientKey="test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"
                  customerKey={user.id}
                  amount={paymentInfo.amount}
                  orderId={paymentInfo.orderId}
                  orderName={paymentInfo.orderName}
                  customerEmail={user.email || undefined}
                  successUrl={`${window.location.origin}/payments/success`}
                  failUrl={`${window.location.origin}/payments/fail`}
                  onSuccess={() => {
                    setPaymentInfo(null);
                    setIsProcessingPayment(false);
                  }}
                  onFail={() => {
                    setPaymentInfo(null);
                    setIsProcessingPayment(false);
                    toast.error("결제가 취소되었습니다.");
                  }}
                />
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">크레딧 사용 가이드</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">1개의 크레딧으로 1개의 콘텐츠를 생성할 수 있습니다.</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">생성된 콘텐츠의 저작권은 전적으로 사용자에게 있습니다.</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">크레딧은 구매 후 즉시 계정에 추가되며, 만료 기간이 없습니다.</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">대량 구매 시 할인 혜택이 자동으로 적용됩니다.</p>
              </div>
            </div>
          </div>
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

