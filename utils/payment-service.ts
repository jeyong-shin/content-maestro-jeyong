import { supabase } from "./supabase";

// 결제 상품 정보 타입
export interface PaymentProduct {
  id: string;
  name: string;
  credits: number;
  price: number;
}

// 토스페이먼츠 결제 준비 요청 함수
export const preparePayment = async (product: PaymentProduct) => {
  try {
    // 사용자 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("인증된 사용자가 아닙니다.");
    }

    // 결제 준비 정보를 저장하기 위한 API 호출
    const response = await fetch("/api/payments/prepare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        productId: product.id,
        productName: product.name,
        amount: product.price,
        credits: product.credits,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "결제 준비 중 오류가 발생했습니다.");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error("결제 준비 오류:", error);
    throw error;
  }
};

// 크레딧 충전 처리 함수 (결제 완료 후 호출)
export const processPaymentSuccess = async (
  orderId: string,
  paymentKey: string,
  amount: number
) => {
  try {
    console.log("결제 완료 처리 시작:", { orderId, paymentKey, amount });
    
    // 결제 완료 처리를 위한 API 호출
    const response = await fetch("/api/payments/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        paymentKey,
        amount,
      }),
    });

    // 응답 텍스트 확인
    const responseText = await response.text();
    console.log("결제 완료 API 응답 상태:", response.status, response.statusText);
    
    if (!responseText) {
      console.error("결제 완료 API 응답이 비어있습니다");
      throw new Error("결제 완료 처리 중 오류가 발생했습니다. (빈 응답)");
    }
    
    // JSON 파싱 시도
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("결제 완료 API 응답 파싱 오류:", e, "응답 텍스트:", responseText);
      throw new Error("결제 완료 처리 중 응답 해석 오류가 발생했습니다.");
    }
    
    // 오류 응답 처리
    if (!response.ok) {
      console.error("결제 완료 API 오류 응답:", responseData);
      throw new Error(responseData.message || "결제 완료 처리 중 오류가 발생했습니다.");
    }

    console.log("결제 완료 처리 성공:", responseData);
    return responseData;
  } catch (error: any) {
    console.error("결제 완료 처리 오류:", error);
    throw error;
  }
};

// 토스페이먼츠 결제 취소 함수
export const cancelPayment = async (paymentKey: string, cancelReason: string) => {
  try {
    const response = await fetch("/api/payments/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        cancelReason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "결제 취소 중 오류가 발생했습니다.");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error("결제 취소 오류:", error);
    throw error;
  }
}; 