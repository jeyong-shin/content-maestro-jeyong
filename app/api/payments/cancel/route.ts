import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { paymentKey, cancelReason } = await request.json();

    // 필수 필드 검증
    if (!paymentKey) {
      return NextResponse.json(
        { message: '결제 키가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 API로 결제 취소 요청
    const tossPaymentsUrl = `https://api.tosspayments.com/v2/payments/${paymentKey}/cancel`;
    const secretKey = process.env.TOSS_SECRET_KEY;
    
    if (!secretKey) {
      console.error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.');
      return NextResponse.json(
        { message: '결제 서비스 구성 오류' },
        { status: 500 }
      );
    }

    const encodedSecret = Buffer.from(`${secretKey}:`).toString('base64');

    const response = await fetch(tossPaymentsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedSecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cancelReason: cancelReason || '사용자 요청'
      })
    });

    const responseData = await response.json();

    // 응답이 성공적이지 않은 경우
    if (!response.ok) {
      console.error('토스페이먼츠 결제 취소 오류:', responseData);
      return NextResponse.json(
        { message: responseData.message || '결제 취소 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    // 관련 준비 정보 조회 및 상태 업데이트
    try {
      // paymentKey로 결제 준비 정보 조회
      const { data, error } = await supabaseAdmin
        .from('payment_preparations')
        .select('*')
        .eq('payment_key', paymentKey)
        .single();

      if (!error && data) {
        // 상태 업데이트
        await supabaseAdmin
          .from('payment_preparations')
          .update({ status: 'cancelled' })
          .eq('payment_key', paymentKey);
      }
    } catch (e) {
      console.error('결제 취소 후 데이터 업데이트 오류:', e);
      // 실패해도 사용자에게는 성공 응답 전송 (토스페이먼츠 취소는 완료됨)
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '결제가 성공적으로 취소되었습니다.'
    });
  } catch (error: any) {
    console.error('결제 취소 처리 오류:', error);
    return NextResponse.json(
      { message: '결제 취소 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 