import { supabase } from "./supabase"

// 현재 사용자의 크레딧 정보 가져오기
export const getUserCredits = async () => {
  try {
    // 사용자 인증 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // 인증 오류 또는 사용자 정보가 없는 경우
    if (authError || !user) {
      console.error("인증 정보 오류:", authError)
      return 0
    }

    // 사용자 크레딧 정보 조회
    const { data, error } = await supabase
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
          const { data: insertData, error: insertError } = await supabase
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
  creditsToUse: number = 1
) => {
  try {
    // 사용자 인증 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // 인증 오류 또는 사용자 정보가 없는 경우
    if (authError || !user) {
      throw new Error("인증된 사용자가 아닙니다.")
    }

    // 현재 크레딧 정보 확인
    const { data: creditData, error: creditError } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    if (creditError || !creditData) {
      throw new Error("크레딧 정보를 가져오는데 실패했습니다.")
    }
    
    // 크레딧이 부족한 경우
    if (creditData.credits < creditsToUse) {
      throw new Error("크레딧이 부족합니다.")
    }

    // 트랜잭션 시작
    const { error: insertError } = await supabase.rpc("use_credits_and_save_content", {
      p_user_id: user.id,
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
    return await getUserCredits()
  } catch (error: any) {
    console.error("크레딧 사용 오류:", error)
    throw error
  }
}

// 크레딧 충전 내역 가져오기
export const getCreditTransactions = async () => {
  try {
    // 사용자 인증 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // 인증 오류 또는 사용자 정보가 없는 경우
    if (authError || !user) {
      console.error("인증 정보 오류:", authError)
      return []
    }

    const { data, error } = await supabase
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
    // 사용자 인증 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // 인증 오류 또는 사용자 정보가 없는 경우
    if (authError || !user) {
      console.error("인증 정보 오류:", authError)
      return []
    }

    const { data, error } = await supabase
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