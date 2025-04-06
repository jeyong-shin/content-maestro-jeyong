import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 Anon Key가 설정되지 않았습니다.')
}

// Supabase 클라이언트 옵션
const supabaseOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    // 쿠키 관련 설정
    cookieOptions: {
      name: 'supabase-auth',
      lifetime: 60 * 60 * 8, // 8시간
      domain: '',
      path: '/',
      sameSite: 'lax' as const
    }
  }
}

// 서버 측에서 사용할 기본 Supabase 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions) 