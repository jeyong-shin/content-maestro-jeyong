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
import { useAuth } from "@/components/auth-provider"
import { getUserCredits } from "@/utils/credit-service"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function Dashboard() {
  const { user, session, loading, signOut } = useAuth()
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<null | {
    title: string
    content: string
    seoTips: string[]
  }>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [isLoadingCredits, setIsLoadingCredits] = useState(true)
  const supabase = createClientComponentClient()

  // 인증 체크: 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    const checkAuth = async () => {
      // 로딩 중이 아니고 사용자 정보나 세션이 없을 때
      if (!loading && (!user || !session)) {
        console.log("인증 정보 없음, 로그인 페이지로 이동");
        router.push("/login");
      }
    };
    
    checkAuth();
  }, [user, session, loading, router]);

  // 사용자 크레딧 정보 로드
  useEffect(() => {
    const loadUserCredits = async () => {
      if (!user || !session) return
      
      setIsLoadingCredits(true)
      try {
        // 세션 정보 확인 (직접 Supabase에서 체크)
        const { data: authData, error: authError } = await supabase.auth.getSession()
        
        if (authError || !authData.session) {
          console.log("세션 오류, 재인증 시도 중...")
          // 오류 발생 시도 일단 진행 (getUserCredits 내에서도 체크함)
        }
        
        // 지연 추가 (인증 정보가 완전히 로드되도록)
        await new Promise(resolve => setTimeout(resolve, 500));
        const credits = await getUserCredits()
        setUserCredits(credits)
      } catch (error) {
        console.error("크레딧 정보 로드 오류:", error)
        // 개발용 오류 표시
        if (process.env.NODE_ENV === 'development') {
          toast.error("크레딧 정보를 가져오는데 실패했습니다.")
        } else {
          // 운영 환경에서는 기본값 사용
          setUserCredits(10)
        }
      } finally {
        setIsLoadingCredits(false)
      }
    }

    if (user && session) {
      loadUserCredits()
    }
  }, [user, session, supabase])

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

  // 사용자 이름 계산
  const userName = user.email?.split('@')[0] || "사용자"

  const handleGenerate = async () => {
    if (!topic.trim()) return
    if (userCredits < 1) {
      toast.error("크레딧이 부족합니다. 충전이 필요합니다.")
      return
    }

    setIsGenerating(true)

    try {
      // API 호출을 통한 AI 콘텐츠 생성
      const response = await fetch('/api/contents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '콘텐츠 생성 중 오류가 발생했습니다.');
      }

      // UI에 표시할 콘텐츠 설정
      setGeneratedContent({
        title: data.content.title,
        content: data.content.content,
        seoTips: data.content.seoTips,
      })

      // 업데이트된 크레딧 정보 갱신
      setUserCredits(data.remainingCredits)
      toast.success("콘텐츠가 성공적으로 생성되었습니다.")
    } catch (error: any) {
      console.error("콘텐츠 생성 오류:", error)
      toast.error(error.message || "콘텐츠 생성 중 오류가 발생했습니다.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("클립보드에 복사되었습니다!")
  }

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

      <div className="container flex-1 py-8">
        <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>크레딧 정보</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingCredits ? (
                  <div className="flex items-center justify-center py-4">
                    <p>크레딧 정보 로딩 중...</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>남은 크레딧</span>
                    <Badge variant="outline" className="text-lg">
                      {userCredits}
                    </Badge>
                  </div>
                )}
                {userCredits < 3 && !isLoadingCredits && (
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
                <div className="text-sm text-gray-500">남은 크레딧: {userCredits}개</div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !topic.trim() || userCredits <= 0 || isLoadingCredits}
                >
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

