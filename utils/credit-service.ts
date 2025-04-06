import { supabase } from "./supabase"

// 현재 사용자의 크레딧 정보 가져오기
export const getUserCredits = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("인증된 사용자가 아닙니다.")

    const { data, error } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    if (error) throw error
    return data.credits
  } catch (error) {
    console.error("크레딧 정보 조회 오류:", error)
    throw error
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("인증된 사용자가 아닙니다.")

    // 현재 크레딧 정보 확인
    const { data: creditData, error: creditError } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    if (creditError) throw creditError
    
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

    if (insertError) throw insertError

    // 업데이트된 크레딧 정보 반환
    return await getUserCredits()
  } catch (error) {
    console.error("크레딧 사용 오류:", error)
    throw error
  }
}

// 크레딧 충전 내역 가져오기
export const getCreditTransactions = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("인증된 사용자가 아닙니다.")

    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("크레딧 내역 조회 오류:", error)
    throw error
  }
}

// 콘텐츠 생성 내역 가져오기
export const getContentGenerations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("인증된 사용자가 아닙니다.")

    const { data, error } = await supabase
      .from("content_generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("콘텐츠 생성 내역 조회 오류:", error)
    throw error
  }
} 