import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientAuthWrapper from '@/components/client-auth-wrapper'
import { ClientThemeProvider } from '@/components/client-theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '콘텐츠 마에스트로 - AI 블로그 콘텐츠 생성 서비스',
  description: 'AI를 활용한 SEO 최적화 블로그 콘텐츠 자동 생성 서비스',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientThemeProvider>
          <ClientAuthWrapper>{children}</ClientAuthWrapper>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
