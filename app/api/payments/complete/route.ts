import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { createClient } from '@supabase/supabase-js';
import { addCredits } from '@/utils/credit-service';

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
    const { orderId, paymentKey, amount } = await request.json();

    // 필수 필드 검증
    if (!orderId || !paymentKey || !amount) {
      return NextResponse.json(
        { message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 API로 결제 승인 요청
    const tossPaymentsUrl = 'https://api.tosspayments.com/v2/payments/confirm';
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
        orderId,
        amount,
        paymentKey
      })
    });

    const responseData = await response.json();

    // 응답이 성공적이지 않은 경우
    if (!response.ok) {
      console.error('토스페이먼츠 결제 승인 오류:', responseData);
      return NextResponse.json(
        { message: responseData.message || '결제 승인 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    // 결제 준비 정보 조회 (서비스 역할 사용)
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from('payment_preparations')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (paymentError || !paymentData) {
      console.error('결제 준비 정보 조회 오류:', paymentError);
      return NextResponse.json(
        { message: '결제 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 결제 금액 검증
    if (paymentData.amount !== amount) {
      console.error('결제 금액 불일치:', { expected: paymentData.amount, received: amount });
      return NextResponse.json(
        { message: '결제 금액이 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 결제 정보 업데이트 (서비스 역할 사용)
    const { error: updateError } = await supabaseAdmin
      .from('payment_preparations')
      .update({
        status: 'completed',
        payment_key: paymentKey
      })
      .eq('order_id', orderId);

    if (updateError) {
      console.error('결제 정보 업데이트 오류:', updateError);
    }

    // 사용자 크레딧 추가
    try {
      // 직접 크레딧 업데이트 및 트랜잭션 기록 (서비스 역할 사용)
      // 현재 크레딧 조회
      const { data: creditData, error: creditError } = await supabaseAdmin
        .from("user_credits")
        .select("credits")
        .eq("user_id", paymentData.user_id)
        .single();
      
      if (creditError) {
        throw new Error("크레딧 정보를 조회하는데 실패했습니다: " + creditError.message);
      }

      const newCreditAmount = creditData.credits + paymentData.credits;
      
      // 크레딧 정보 업데이트
      const { error: updateCreditError } = await supabaseAdmin
        .from("user_credits")
        .update({ 
          credits: newCreditAmount,
          updated_at: new Date()
        })
        .eq("user_id", paymentData.user_id);

      if (updateCreditError) {
        throw new Error("크레딧 충전 중 오류가 발생했습니다: " + updateCreditError.message);
      }

      // 크레딧 트랜잭션 기록
      const { error: transactionError } = await supabaseAdmin
        .from("credit_transactions")
        .insert({
          user_id: paymentData.user_id,
          amount: paymentData.credits,
          type: 'charge',
          description: `크레딧 충전 - 주문번호: ${orderId}`,
          payment_key: paymentKey
        });

      if (transactionError) {
        console.error("트랜잭션 기록 오류:", transactionError);
        // 트랜잭션 기록 실패가 전체 프로세스를 중단하지는 않음
      }
    } catch (error: any) {
      console.error("크레딧 충전 처리 오류:", error);
      // 결제는 성공했지만 크레딧 충전에 실패한 경우
      return NextResponse.json(
        { 
          success: false, 
          message: '결제는 성공했으나 크레딧 충전에 실패했습니다. 관리자에게 문의하세요.',
          error: error.message
        },
        { status: 500 }
      );
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '결제가 성공적으로 완료되었습니다.',
      orderName: paymentData.product_name,
      credits: paymentData.credits
    });
  } catch (error: any) {
    console.error('결제 완료 처리 오류:', error);
    return NextResponse.json(
      { message: '결제 완료 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 