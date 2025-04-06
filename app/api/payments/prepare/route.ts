import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// 결제 정보를 저장할 임시 테이블 생성 필요 (Supabase에서)
// CREATE TABLE IF NOT EXISTS payment_preparations (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   order_id TEXT NOT NULL UNIQUE,
//   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   product_id TEXT NOT NULL,
//   product_name TEXT NOT NULL,
//   amount INTEGER NOT NULL,
//   credits INTEGER NOT NULL,
//   email TEXT,
//   status TEXT NOT NULL DEFAULT 'pending',
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// 서비스 역할용 Supabase 클라이언트 생성
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    // 요청 데이터 가져오기
    const {
      userId,
      email,
      productId,
      productName,
      amount,
      credits
    } = await request.json();

    // 필수 필드 검증
    if (!userId || !productId || !amount || !credits) {
      return NextResponse.json(
        { message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // UUID 생성 (알파벳과 숫자만 포함)
    const randomId = crypto.randomUUID().replace(/-/g, '');
    
    // 주문 ID 생성 (토스페이먼츠 요구사항에 맞춤: 12-64자 영문 대소문자, 숫자, _, -, .)
    const timestamp = Date.now();
    const orderId = `order_${timestamp}_${randomId.substring(0, 10)}`;
    
    console.log("생성된 주문 ID:", orderId);

    // 결제 준비 정보 저장 (서비스 역할로 수행)
    const { error } = await supabaseAdmin.from('payment_preparations').insert({
      order_id: orderId,
      user_id: userId,
      product_id: productId,
      product_name: productName,
      amount,
      credits,
      email,
      status: 'pending'
    });

    if (error) {
      console.error('결제 준비 정보 저장 오류:', error);
      return NextResponse.json(
        { message: '결제 준비 정보를 저장하는데 실패했습니다.' },
        { status: 500 }
      );
    }

    // 결제 준비 정보 반환
    return NextResponse.json({
      orderId,
      amount,
      productName,
      clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
      customerEmail: email
    });
  } catch (error: any) {
    console.error('결제 준비 오류:', error);
    return NextResponse.json(
      { message: '결제 준비 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 