"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import DashboardHeader from "@/components/dashboard-header"

export default function SettingsPage() {
  // Mock user data
  const user = {
    name: "사용자",
    email: "user@example.com",
    credits: 8,
  }

  const [profileForm, setProfileForm] = useState({
    name: "사용자",
    email: "user@example.com",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    creditAlerts: true,
    promotions: false,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: checked }))
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("프로필이 업데이트되었습니다.")
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("비밀번호가 변경되었습니다.")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold">계정 설정</h1>
            <p className="text-gray-500">계정 정보 및 설정을 관리하세요</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">프로필</TabsTrigger>
              <TabsTrigger value="password">비밀번호</TabsTrigger>
              <TabsTrigger value="notifications">알림 설정</TabsTrigger>
              <TabsTrigger value="billing">결제 정보</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>프로필 정보</CardTitle>
                  <CardDescription>개인 정보를 업데이트하세요</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                      <p className="text-xs text-gray-500">이메일을 변경하면 확인 메일이 발송됩니다</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">저장하기</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>비밀번호 변경</CardTitle>
                  <CardDescription>계정 보안을 위해 주기적으로 비밀번호를 변경하세요</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">현재 비밀번호</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">새 비밀번호</Label>
                      <Input id="new-password" type="password" />
                      <p className="text-xs text-gray-500">최소 8자 이상, 숫자와 특수문자를 포함해야 합니다</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">비밀번호 확인</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">비밀번호 변경</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>알림 설정</CardTitle>
                  <CardDescription>알림 수신 여부를 설정하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-updates">이메일 업데이트</Label>
                      <p className="text-sm text-gray-500">서비스 업데이트 및 새로운 기능 안내</p>
                    </div>
                    <Switch
                      id="email-updates"
                      checked={notificationSettings.emailUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("emailUpdates", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="credit-alerts">크레딧 알림</Label>
                      <p className="text-sm text-gray-500">크레딧이 부족할 때 알림 수신</p>
                    </div>
                    <Switch
                      id="credit-alerts"
                      checked={notificationSettings.creditAlerts}
                      onCheckedChange={(checked) => handleNotificationChange("creditAlerts", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotions">프로모션</Label>
                      <p className="text-sm text-gray-500">할인 및 특별 프로모션 안내</p>
                    </div>
                    <Switch
                      id="promotions"
                      checked={notificationSettings.promotions}
                      onCheckedChange={(checked) => handleNotificationChange("promotions", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>저장하기</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>결제 정보</CardTitle>
                  <CardDescription>결제 방법 및 청구서 정보를 관리하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">결제 방법</h3>
                    <p className="mt-1 text-sm text-gray-500">결제 시 토스페이먼츠를 통해 안전하게 처리됩니다.</p>
                    <div className="mt-4">
                      <Link href="/dashboard/credits">
                        <Button variant="outline" size="sm">
                          크레딧 충전하기
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">청구서 정보</h3>
                    <p className="mt-1 text-sm text-gray-500">결제 내역 및 영수증은 이메일로 자동 발송됩니다.</p>
                    <div className="mt-4">
                      <Link href="/dashboard/history">
                        <Button variant="outline" size="sm">
                          결제 내역 보기
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">계정 삭제</CardTitle>
              <CardDescription>계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                계정 삭제는 되돌릴 수 없으며, 모든 데이터와 크레딧이 영구적으로 삭제됩니다. 남은 크레딧에 대한 환불은
                불가능합니다.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">계정 삭제</Button>
            </CardFooter>
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

