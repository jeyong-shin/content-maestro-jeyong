import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12">
      <div className="container max-w-md">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
          <p className="text-sm text-gray-500">콘텐츠 마에스트로 계정으로 로그인하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>계정 로그인</CardTitle>
            <CardDescription>이메일과 비밀번호를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  비밀번호 찾기
                </Link>
              </div>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full">로그인</Button>
            <div className="text-center text-sm">
              계정이 없으신가요?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}

