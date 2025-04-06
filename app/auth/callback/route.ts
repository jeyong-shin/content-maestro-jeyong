import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL에서 "next" 파라미터를 확인하고 기본값 설정
  const redirectTo = requestUrl.searchParams.get('next') || '/dashboard'
  
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
} 