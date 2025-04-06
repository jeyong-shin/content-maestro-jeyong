import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">콘텐츠 마에스트로</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">회원가입</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  합리적인 가격으로 시작하세요
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  필요한 만큼만 사용하고, 대량 구매 시 더 많은 할인 혜택을 받으세요.
                </p>
              </div>
            </div>

            <div className="grid gap-6 mt-12 md:grid-cols-4">
              {/* Free Plan */}
              <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">무료 체험</h3>
                  <p className="text-gray-500">처음 시작하는 분들을 위한 무료 크레딧</p>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-bold">무료</p>
                  <p className="text-gray-500">최초 가입 시</p>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>10개 크레딧 제공</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>블로그 콘텐츠 생성</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>SEO 팁 제공</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/signup">
                    <Button className="w-full">무료로 시작하기</Button>
                  </Link>
                </div>
              </div>

              {/* Basic Plan */}
              <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">기본 패키지</h3>
                  <p className="text-gray-500">소규모 콘텐츠 제작에 적합</p>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-bold">5,000원</p>
                  <p className="text-gray-500">10개 크레딧</p>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>10개 크레딧 제공</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>블로그 콘텐츠 생성</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>SEO 팁 제공</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button className="w-full">구매하기</Button>
                  </Link>
                </div>
              </div>

              {/* Standard Plan */}
              <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">스탠다드 패키지</h3>
                  <p className="text-gray-500">중규모 콘텐츠 제작에 적합</p>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <p className="text-4xl font-bold">40,000원</p>
                    <p className="ml-2 text-sm text-green-500">20% 할인</p>
                  </div>
                  <p className="text-gray-500">100개 크레딧</p>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>100개 크레딧 제공</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>블로그 콘텐츠 생성</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>SEO 팁 제공</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>이메일 지원</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button className="w-full">구매하기</Button>
                  </Link>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="flex flex-col p-6 bg-primary/5 shadow-lg rounded-lg border-2 border-primary">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">프리미엄 패키지</h3>
                  <p className="text-gray-500">대량 콘텐츠 제작에 최적화</p>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <p className="text-4xl font-bold">175,000원</p>
                    <p className="ml-2 text-sm text-green-500">30% 할인</p>
                  </div>
                  <p className="text-gray-500">500개 크레딧</p>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>500개 크레딧 제공</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>블로그 콘텐츠 생성</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>SEO 팁 제공</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>우선 지원</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>맞춤형 콘텐츠 조정</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button className="w-full">구매하기</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-8">
              <div className="rounded-lg border bg-white p-8">
                <h3 className="text-2xl font-bold">자주 묻는 질문</h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">크레딧은 어떻게 사용되나요?</h4>
                    <p className="text-gray-500">
                      1개의 크레딧으로 1개의 블로그 콘텐츠를 생성할 수 있습니다. 생성된 콘텐츠는 제목, 본문, SEO 팁을
                      포함합니다.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">크레딧의 유효기간이 있나요?</h4>
                    <p className="text-gray-500">
                      구매한 크레딧은 12개월 동안 유효합니다. 무료로 제공된 크레딧은 30일 동안 유효합니다.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">환불 정책은 어떻게 되나요?</h4>
                    <p className="text-gray-500">
                      구매 후 7일 이내, 사용하지 않은 크레딧에 한해 환불이 가능합니다. 자세한 내용은 이용약관을
                      참조하세요.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">생성된 콘텐츠의 저작권은 누구에게 있나요?</h4>
                    <p className="text-gray-500">
                      생성된 콘텐츠의 저작권은 사용자에게 있습니다. 자유롭게 수정하고 사용할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-primary/5 p-8 text-center">
                <h3 className="text-2xl font-bold">아직 결정하지 못하셨나요?</h3>
                <p className="mt-2 text-gray-500">
                  무료 크레딧으로 서비스를 먼저 체험해보세요. 가입 즉시 10개의 크레딧이 제공됩니다.
                </p>
                <div className="mt-6">
                  <Link href="/signup">
                    <Button size="lg">무료로 시작하기</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container px-4 py-8 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">콘텐츠 마에스트로</h3>
              <p className="text-sm text-gray-500">AI 기반 블로그 콘텐츠 자동 생성 서비스</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">서비스</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="/pricing" className="hover:underline">
                    요금제
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:underline">
                    대시보드
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">회사</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="/about" className="hover:underline">
                    회사 소개
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">고객지원</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="mailto:support@contentmaestro.com" className="hover:underline">
                    support@contentmaestro.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
            <p>© 2025 콘텐츠 마에스트로. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

