import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/utils/supabase";
import { generateBlogContent } from "@/utils/openai-service";
import { useCredits } from "@/utils/credit-service";
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

    // 인증된 Supabase 클라이언트 생성
    const cookieStore = cookies();
    const supabaseAuth = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // 사용자 인증 정보 가져오기 (세션 사용)
    const { data: sessionData, error: sessionError } = await supabaseAuth.auth.getSession();
    
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

    // OpenAI API를 사용하여 콘텐츠 생성
    const generatedContent = await generateBlogContent(topic);

    // 크레딧 사용 (useCredits 함수는 크레딧 차감 및 콘텐츠 저장을 처리)
    // 실제 사용자 ID를 명시적으로 전달
    const remainingCredits = await useCredits(
      topic, 
      generatedContent.title,
      generatedContent.content,
      generatedContent.seoTips,
      1, // 사용할 크레딧 수 (기본 1개)
      user.id // 사용자 ID 명시적 전달
    );

    // 클라이언트에 응답 반환
    return NextResponse.json({
      success: true,
      content: generatedContent,
      remainingCredits
    });
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