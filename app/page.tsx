import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  AI로 블로그 콘텐츠를 자동 생성하세요
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  제목이나 주제만 입력하면 AI가 SEO 최적화된 블로그 콘텐츠를 자동으로 생성해 드립니다.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-1">
                    대시보드로 이동 <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg">
                    무료로 시작하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">고품질 콘텐츠</h3>
                <p className="text-gray-500">
                  GPT-4o 기반의 AI가 생성하는 고품질 블로그 콘텐츠로 독자들의 관심을 사로잡으세요.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">SEO 최적화</h3>
                <p className="text-gray-500">
                  검색 엔진에 최적화된 콘텐츠와 SEO 팁으로 웹사이트 트래픽을 증가시키세요.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">합리적인 가격</h3>
                <p className="text-gray-500">
                  크레딧 기반 요금제로 필요한 만큼만 사용하고 대량 구매 시 할인 혜택을 받으세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  합리적인 가격으로 시작하세요
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  필요한 만큼만 사용하고, 대량 구매 시 더 많은 할인 혜택을 받으세요.
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-8 md:grid-cols-3">
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
                </ul>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button className="w-full">구매하기</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-500">중간 패키지 (100개 크레딧, 40,000원, 20% 할인)도 이용 가능합니다.</p>
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

