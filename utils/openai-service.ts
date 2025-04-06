import OpenAI from 'openai';

// API 키 확인
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error('OPENAI_API_KEY가 설정되지 않았습니다.');
  // 개발 환경에서만 오류 발생
  if (process.env.NODE_ENV === 'development') {
    throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
  }
}

// OpenAI 클라이언트 인스턴스 생성
const openai = new OpenAI({
  apiKey: openaiApiKey,
  timeout: 30000, // 30초 타임아웃
  maxRetries: 2, // 최대 2번 재시도
});

// 블로그 콘텐츠 생성 함수
export const generateBlogContent = async (topic: string) => {
  try {
    // 타임아웃 설정 (25초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    
    const response = await openai.chat.completions.create(
      {
        model: "gpt-4o", // GPT-4o 모델 사용
        messages: [
          {
            role: "system",
            content: `당신은 전문 블로그 작가입니다. 주어진 주제에 관한 짧지만 고품질 블로그 콘텐츠를 작성해야 합니다.
            결과는 다음 형식을 따릅니다:
            1. 매력적인 블로그 제목
            2. 마크다운 형식의 잘 구성된 블로그 콘텐츠 (간결한 소개, 주요 포인트, 결론)
            3. SEO 최적화를 위한 3가지 팁
            
            응답은 JSON 형식으로 제공하세요:
            {
              "title": "매력적인 제목",
              "content": "마크다운 형식의 블로그 콘텐츠",
              "seoTips": ["팁1", "팁2", "팁3"]
            }`
          },
          {
            role: "user",
            content: `다음 주제에 관한 블로그 콘텐츠를 작성해주세요: "${topic}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500, // 토큰 수 제한
        response_format: { type: "json_object" }
      },
      {
        signal: controller.signal // AbortController 시그널을 RequestOptions에 전달
      }
    );

    clearTimeout(timeoutId);

    // JSON 응답 파싱
    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      title: result.title || `${topic}에 관한 완벽 가이드`,
      content: result.content || `${topic}에 관한 콘텐츠를 생성할 수 없습니다.`,
      seoTips: Array.isArray(result.seoTips) ? result.seoTips : [],
    };
  } catch (error: any) {
    // AbortController에 의한 타임아웃 처리
    if (error.name === "AbortError" || error.code === "ECONNABORTED" || error.type === "timeout") {
      console.error("OpenAI API 호출 시간 초과");
      // 타임아웃 시 기본 콘텐츠 반환
      return {
        title: `${topic}에 관한 가이드`,
        content: `# ${topic}에 관한 가이드\n\n${topic}에 대한 콘텐츠입니다. 더 자세한 내용은 다시 시도해주세요.\n\n## 주요 포인트\n- ${topic}의 기본 개념\n- 활용 방법\n- 주의사항`,
        seoTips: [
          `주요 키워드 '${topic}'을 제목과 첫 단락에 포함하세요.`,
          "관련 이미지에 대체 텍스트(alt text)를 추가하세요.",
          "메타 디스크립션에 핵심 내용을 요약하세요."
        ],
      };
    }
    
    console.error("OpenAI API 호출 오류:", error);
    throw new Error("콘텐츠 생성 중 오류가 발생했습니다.");
  }
}; 