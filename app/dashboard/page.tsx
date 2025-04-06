"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, CreditCard, LogOut, Settings, User } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useAuth } from "@/components/auth-provider"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<null | {
    title: string
    content: string
    seoTips: string[]
  }>(null)

  // 인증 체크: 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

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

  // Mock user data - 실제 앱에서는 인증된 사용자 정보를 사용
  const mockUser = {
    name: user.email?.split('@')[0] || "사용자",
    email: user.email || "user@example.com",
    credits: 8,
  }

  const handleGenerate = () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    // Simulate API call with timeout
    setTimeout(() => {
      setGeneratedContent({
        title: `${topic}에 대한 완벽 가이드: 알아두어야 할 모든 것`,
        content: `# ${topic}에 대한 완벽 가이드: 알아두어야 할 모든 것

## 소개

${topic}은 현대 사회에서 중요한 주제로 자리 잡고 있습니다. 이 글에서는 ${topic}에 대한 모든 것을 알아보겠습니다.

## ${topic}의 중요성

${topic}은 많은 사람들의 일상생활과 비즈니스에 큰 영향을 미치고 있습니다. 특히 디지털 시대에 접어들면서 그 중요성은 더욱 커지고 있습니다.

## ${topic}의 주요 특징

1. 효율성 증대
2. 비용 절감 효과
3. 사용자 경험 향상
4. 시간 절약

## ${topic} 활용 방법

${topic}을 효과적으로 활용하기 위해서는 다음과 같은 방법을 고려해볼 수 있습니다:

- 전문가의 조언 구하기
- 관련 교육 및 자료 참고하기
- 실제 사례 연구하기
- 지속적인 업데이트 확인하기

## 결론

${topic}은 앞으로도 계속해서 발전하고 중요성이 커질 것입니다. 이에 대한 이해와 적용은 개인과 기업 모두에게 큰 경쟁력이 될 것입니다.`,
        seoTips: [
          `주요 키워드 '${topic}'을 제목, 소제목, 첫 단락에 포함하세요.`,
          "2,000단어 이상의 상세한 콘텐츠가 SEO에 유리합니다.",
          "관련 이미지에 대체 텍스트(alt text)를 추가하세요.",
          "내부 링크와 외부 링크를 적절히 활용하세요.",
          "메타 디스크립션에 주요 키워드를 포함하세요.",
        ],
      })
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("클립보드에 복사되었습니다!")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={mockUser} />

      <div className="container flex-1 py-8">
        <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>크레딧 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>남은 크레딧</span>
                  <Badge variant="outline" className="text-lg">
                    {mockUser.credits}
                  </Badge>
                </div>
                {mockUser.credits < 3 && (
                  <p className="mt-2 text-sm text-red-500">크레딧이 부족합니다. 충전이 필요합니다.</p>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/credits" className="w-full">
                  <Button className="w-full">크레딧 충전하기</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>메뉴</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Link href="/dashboard" className="flex items-center gap-2 p-3 hover:bg-gray-100">
                    <User className="h-4 w-4" />
                    <span>대시보드</span>
                  </Link>
                  <Link href="/dashboard/history" className="flex items-center gap-2 p-3 hover:bg-gray-100">
                    <CreditCard className="h-4 w-4" />
                    <span>결제 내역</span>
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 p-3 hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                    <span>설정</span>
                  </Link>
                  <Link href="/logout" className="flex items-center gap-2 p-3 hover:bg-gray-100">
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>콘텐츠 생성</CardTitle>
                <CardDescription>
                  블로그 주제나 제목을 입력하면 AI가 콘텐츠를 자동으로 생성합니다. 각 생성마다 1크레딧이 차감됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="topic" className="text-sm font-medium">
                      주제 또는 제목
                    </label>
                    <Textarea
                      id="topic"
                      placeholder="예: 디지털 마케팅 트렌드, 건강한 식습관의 중요성 등"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">남은 크레딧: {mockUser.credits}개</div>
                <Button onClick={handleGenerate} disabled={isGenerating || !topic.trim() || mockUser.credits <= 0}>
                  {isGenerating ? "생성 중..." : "콘텐츠 생성하기"}
                </Button>
              </CardFooter>
            </Card>

            {generatedContent && (
              <Card>
                <CardHeader>
                  <CardTitle>생성된 콘텐츠</CardTitle>
                  <CardDescription>AI가 생성한 콘텐츠입니다. 복사하여 사용하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="content">
                    <TabsList className="mb-4">
                      <TabsTrigger value="content">콘텐츠</TabsTrigger>
                      <TabsTrigger value="seo">SEO 팁</TabsTrigger>
                    </TabsList>
                    <TabsContent value="content" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">제목</h3>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedContent.title)}>
                            <Copy className="h-4 w-4 mr-2" />
                            복사
                          </Button>
                        </div>
                        <div className="rounded-md bg-gray-50 p-3">{generatedContent.title}</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">본문</h3>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedContent.content)}>
                            <Copy className="h-4 w-4 mr-2" />
                            복사
                          </Button>
                        </div>
                        <div className="rounded-md bg-gray-50 p-3 whitespace-pre-wrap">{generatedContent.content}</div>
                      </div>
                    </TabsContent>
                    <TabsContent value="seo" className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">SEO 최적화 팁</h3>
                        <ul className="space-y-2">
                          {generatedContent.seoTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">
                                {index + 1}
                              </span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleCopy(generatedContent.content)}>
                    <Copy className="h-4 w-4 mr-2" />
                    전체 콘텐츠 복사하기
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
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

