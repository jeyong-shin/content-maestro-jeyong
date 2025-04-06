"use client";

import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";

interface PaymentWidgetProps {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
  onSuccess?: () => void;
  onFail?: () => void;
}

export default function PaymentWidget({
  clientKey,
  customerKey,
  amount,
  orderId,
  orderName,
  customerName,
  customerEmail,
  successUrl,
  failUrl,
  onSuccess,
  onFail
}: PaymentWidgetProps) {
  useEffect(() => {
    const initializePayment = async () => {
      try {
        console.log("토스페이먼츠 결제 위젯 초기화 시작");
        console.log("클라이언트 키:", clientKey);
        console.log("결제 정보:", { orderId, amount, orderName });
        
        // 토스페이먼츠 SDK 로드 
        const tossPayments = await loadTossPayments(clientKey);
        
        // 결제 요청 - V1 방식 직접 호출
        tossPayments.requestPayment('카드', {
          amount,
          orderId,
          orderName,
          customerName,
          customerEmail,
          successUrl,
          failUrl
        });

        console.log("토스페이먼츠 결제창 호출 완료");
        
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("토스페이먼츠 결제 초기화 오류:", error);
        if (onFail) {
          onFail();
        }
      }
    };

    initializePayment();
  }, [clientKey, customerKey, amount, orderId, orderName, customerName, customerEmail, successUrl, failUrl]);

  return null;
} 