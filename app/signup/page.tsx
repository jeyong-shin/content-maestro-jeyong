import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12">
      <div className="container max-w-md">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
          <p className="text-sm text-gray-500">콘텐츠 마에스트로 계정을 만들고 무료 크레딧을 받으세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>계정 만들기</CardTitle>
            <CardDescription>필수 정보를 입력하여 계정을 생성하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="홍길동" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" />
              <p className="text-xs text-gray-500">최소 8자 이상, 숫자와 특수문자를 포함해야 합니다</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  이용약관 및 개인정보처리방침에 동의합니다
                </label>
                <p className="text-xs text-gray-500">
                  <Link href="/terms" className="text-primary hover:underline">
                    이용약관
                  </Link>{" "}
                  및{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    개인정보처리방침
                  </Link>
                  을 읽고 이해했습니다
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full">회원가입</Button>
            <div className="text-center text-sm">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-primary hover:underline">
                로그인
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

