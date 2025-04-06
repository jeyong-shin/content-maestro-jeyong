import { supabase } from "./supabase"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Supabase 클라이언트 인스턴스 생성
const getSupabaseClient = () => {
  try {
    // 브라우저 환경에서는 createClientComponentClient를 사용
    if (typeof window !== 'undefined') {
      return createClientComponentClient();
    }
    // 서버 환경에서는 기본 supabase 인스턴스 사용
    return supabase;
  } catch (error) {
    console.error("Supabase 클라이언트 생성 오류:", error);
    // 오류 발생 시 기본 인스턴스 반환
    return supabase;
  }
};

// 현재 사용자의 크레딧 정보 가져오기
export const getUserCredits = async () => {
  try {
    const supabaseClient = getSupabaseClient();
    
    // 사용자 인증 정보 가져오기
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    // 인증 오류 또는 사용자 정보가 없는 경우
    if (authError || !user) {
      console.error("인증 정보 오류:", authError)
      return 0
    }

    // 사용자 크레딧 정보 조회
    const { data, error } = await supabaseClient
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single()
    
    // 데이터베이스 오류 또는 데이터가 없는 경우
    if (error) {
      console.error("크레딧 정보 조회 오류:", error)
      
      // 사용자 크레딧 정보가 없는 경우, 기본값 생성 시도
      if (error.code === 'PGRST116') {
        try {
          const { data: insertData, error: insertError } = await supabaseClient
            .from("user_credits")
            .insert({ user_id: user.id, credits: 10 })
            .select("credits")
            .single()
          
          if (insertError) {
            console.error("새 크레딧 정보 생성 오류:", insertError)
            return 0
          }
          
          return insertData?.credits || 0
        } catch (insertCatchError) {
          console.error("크레딧 정보 생성 중 예외 발생:", insertCatchError)
          return 0
        }
      }
      
      return 0
    }
    
    if (!data) {
      console.error("크레딧 정보 없음")
      return 0
    }
    
    return data.credits
  } catch (error) {
    console.error("크레딧 정보 조회 오류:", error)
    return 0
  }
}

// 크레딧 사용하기 (콘텐츠 생성 시)
export const useCredits = async (
  topic: string, 
  title: string, 
  content: string, 
  seoTips: any[], 
  creditsToUse: number = 1,
  userId?: string
) => {
  try {
    const supabaseClient = getSupabaseClient();
    
    // 사용자 ID가 제공되지 않은 경우 인증 정보에서 가져오기
    let user_id = userId;
    if (!user_id) {
      // 사용자 인증 정보 가져오기
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
      
      // 인증 오류 또는 사용자 정보가 없는 경우
      if (authError || !user) {
        throw new Error("인증된 사용자가 아닙니다.")
      }
      
      user_id = user.id;
    }

    // 현재 크레딧 정보 확인
    const { data: creditData, error: creditError } = await supabaseClient
      .from("user_credits")
      .select("credits")
      .eq("user_id", user_id)
      .single()

    if (creditError || !creditData) {
      throw new Error("크레딧 정보를 가져오는데 실패했습니다.")
    }
    
    // 크레딧이 부족한 경우
    if (creditData.credits < creditsToUse) {
      throw new Error("크레딧이 부족합니다.")
    }

    // 트랜잭션 시작
    const { error: insertError } = await supabaseClient.rpc("use_credits_and_save_content", {
      p_user_id: user_id,
      p_topic: topic,
      p_title: title,
      p_content: content,
      p_seo_tips: seoTips,
      p_credits_used: creditsToUse
    })

    if (insertError) {
      throw new Error("크레딧 사용 중 오류가 발생했습니다: " + insertError.message)
    }

    // 업데이트된 크레딧 정보 반환
    return creditData.credits - creditsToUse; // 빠른 응답을 위해 현재 값에서 차감된 값을 반환
  } catch (error: any) {
    console.error("크레딧 사용 오류:", error)
    throw error
  }
}

// 크레딧 충전 함수 (결제 성공 시 호출)
export const addCredits = async (userId: string, credits: number, orderId: string, paymentKey: string) => {
  try {
    const supabaseClient = getSupabaseClient();
    
    // 현재 크레딧 조회
    const { data, error: getError } = await supabaseClient
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single();
    
    if (getError) {
      console.error("크레딧 정보 조회 오류:", getError);
      throw new Error("크레딧 정보를 조회하는데 실패했습니다.");
    }
    
    const newCreditAmount = data.credits + credits;
    
    // 크레딧 정보 업데이트
    const { error: updateError } = await supabaseClient
      .from("user_credits")
      .update({ 
        credits: newCreditAmount,
        updated_at: new Date()
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("크레딧 충전 오류:", updateError)
      throw new Error("크레딧 충전 중 오류가 발생했습니다.")
    }

    // 크레딧 트랜잭션 기록
    const { error: transactionError } = await supabaseClient
      .from("credit_transactions")
      .insert({
        user_id: userId,
        amount: credits,
        type: 'charge',
        description: `크레딧 충전 - 주문번호: ${orderId}`,
        payment_key: paymentKey
      })

    if (transactionError) {
      console.error("트랜잭션 기록 오류:", transactionError)
      // 트랜잭션 기록 실패가 전체 프로세스를 중단하지는 않음
    }

    return true
  } catch (error: any) {
    console.error("크레딧 충전 처리 오류:", error)
    throw error
  }
}

// 크레딧 충전 내역 가져오기
export const getCreditTransactions = async () => {
  try {
    const supabaseClient = getSupabaseClient();
    
    // 사용자 인증 정보 가져오기
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    // 인증 오류 또는 사용자 정보가 없는 경우
    if (authError || !user) {
      console.error("인증 정보 오류:", authError)
      return []
    }

    const { data, error } = await supabaseClient
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error || !data) {
      console.error("크레딧 내역 조회 오류:", error)
      return []
    }
    
    return data
  } catch (error) {
    console.error("크레딧 내역 조회 오류:", error)
    return []
  }
}

// 콘텐츠 생성 내역 가져오기
export const getContentGenerations = async () => {
  try {
    const supabaseClient = getSupabaseClient();
    
    // 사용자 인증 정보 가져오기
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    // 인증 오류 또는 사용자 정보가 없는 경우
    if (authError || !user) {
      console.error("인증 정보 오류:", authError)
      return []
    }

    const { data, error } = await supabaseClient
      .from("content_generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error || !data) {
      console.error("콘텐츠 생성 내역 조회 오류:", error)
      return []
    }
    
    return data
  } catch (error) {
    console.error("콘텐츠 생성 내역 조회 오류:", error)
    return []
  }
} 