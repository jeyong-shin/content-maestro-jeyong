import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/utils/supabase";
import { generateBlogContent } from "@/utils/openai-service";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request: Request) {
  try {
    // 요청 본문에서 주제 가져오기
    const { topic } = await request.json();

    // 주제가 제공되지 않은 경우
    if (!topic || typeof topic !== "string" || topic.trim() === "") {
      return NextResponse.json(
        { error: "주제를 입력해주세요." },
        { status: 400 }
      );
    }

    // await를 사용하여 쿠키 가져오기
    const cookieStore = cookies();
    
    // 서버 측 Supabase 클라이언트 생성 - cookies 비동기 처리
    const supabaseServer = createRouteHandlerClient({
      cookies: () => cookieStore
    });
    
    // 사용자 인증 정보 가져오기 (세션 사용)
    const { data: sessionData, error: sessionError } = await supabaseServer.auth.getSession();
    
    // 세션 오류 또는 세션이 없는 경우
    if (sessionError || !sessionData.session) {
      console.error("세션 오류:", sessionError);
      return NextResponse.json(
        { error: "인증 세션이 유효하지 않습니다. 다시 로그인해주세요." },
        { status: 401 }
      );
    }
    
    const user = sessionData.session.user;
    
    // 사용자 정보가 없는 경우
    if (!user) {
      return NextResponse.json(
        { error: "인증된 사용자가 아닙니다." },
        { status: 401 }
      );
    }

    // 크레딧 확인 - 사용 전에 미리 확인
    try {
      const { data: creditData, error: creditError } = await supabaseServer
        .from("user_credits")
        .select("credits")
        .eq("user_id", user.id)
        .single();

      // 크레딧 정보를 찾을 수 없는 경우
      if (creditError) {
        // 사용자 크레딧 정보가 없으면 생성
        if (creditError.code === 'PGRST116') {
          await supabaseServer
            .from("user_credits")
            .insert({ user_id: user.id, credits: 10 });
        } else {
          return NextResponse.json(
            { error: "크레딧 정보를 확인할 수 없습니다." },
            { status: 500 }
          );
        }
      } else if (creditData && creditData.credits < 1) {
        return NextResponse.json(
          { error: "크레딧이 부족합니다. 충전이 필요합니다." },
          { status: 400 }
        );
      }
    } catch (creditCheckError) {
      console.error("크레딧 확인 오류:", creditCheckError);
      return NextResponse.json(
        { error: "크레딧 확인 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // OpenAI API를 사용하여 콘텐츠 생성
    const generatedContent = await generateBlogContent(topic);

    // 크레딧 사용 및 콘텐츠 저장
    try {
      // 트랜잭션 직접 실행
      const { error: transactionError } = await supabaseServer.rpc("use_credits_and_save_content", {
        p_user_id: user.id,
        p_topic: topic,
        p_title: generatedContent.title,
        p_content: generatedContent.content,
        p_seo_tips: generatedContent.seoTips,
        p_credits_used: 1
      });

      if (transactionError) {
        throw new Error("크레딧 사용 중 오류가 발생했습니다: " + transactionError.message);
      }

      // 업데이트된 크레딧 조회
      const { data: updatedCreditData } = await supabaseServer
        .from("user_credits")
        .select("credits")
        .eq("user_id", user.id)
        .single();

      // 클라이언트에 응답 반환
      return NextResponse.json({
        success: true,
        content: generatedContent,
        remainingCredits: updatedCreditData?.credits || 0
      });
    } catch (creditUseError: any) {
      console.error("크레딧 차감 및 콘텐츠 저장 오류:", creditUseError);
      return NextResponse.json(
        { error: creditUseError.message || "크레딧 사용 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("콘텐츠 생성 API 오류:", error);
    
    // 클라이언트에 오류 응답 반환
    return NextResponse.json(
      { 
        error: error.message || "콘텐츠 생성 중 오류가 발생했습니다." 
      },
      { 
        status: error.status || 500 
      }
    );
  }
} 