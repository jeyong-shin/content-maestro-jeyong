-- 크레딧을 사용하고 콘텐츠를 저장하는 트랜잭션 함수
-- Supabase SQL 에디터에서 실행해야 하는 함수입니다.
CREATE OR REPLACE FUNCTION use_credits_and_save_content(
  p_user_id UUID,
  p_topic TEXT,
  p_title TEXT,
  p_content TEXT,
  p_seo_tips JSON,
  p_credits_used INTEGER DEFAULT 1
) RETURNS VOID AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- 트랜잭션 시작
  BEGIN
    -- 사용자의 현재 크레딧 확인
    SELECT credits INTO current_credits
    FROM user_credits
    WHERE user_id = p_user_id
    FOR UPDATE; -- 레코드 잠금

    IF current_credits IS NULL THEN
      -- 크레딧 정보가 없으면 생성
      INSERT INTO user_credits (user_id, credits)
      VALUES (p_user_id, 10 - p_credits_used);
    ELSIF current_credits < p_credits_used THEN
      -- 크레딧이 부족한 경우 오류 발생
      RAISE EXCEPTION '크레딧이 부족합니다.';
    ELSE
      -- 크레딧 차감
      UPDATE user_credits
      SET 
        credits = credits - p_credits_used,
        updated_at = NOW()
      WHERE user_id = p_user_id;
    END IF;

    -- 생성된 콘텐츠 저장
    INSERT INTO content_generations (
      user_id,
      topic,
      title,
      content,
      seo_tips,
      credits_used
    ) VALUES (
      p_user_id,
      p_topic,
      p_title,
      p_content,
      p_seo_tips,
      p_credits_used
    );

    -- 크레딧 사용 내역 기록
    INSERT INTO credit_transactions (
      user_id,
      amount,
      type,
      description
    ) VALUES (
      p_user_id,
      -p_credits_used,
      'use',
      '콘텐츠 생성 - ' || p_topic
    );

  EXCEPTION
    WHEN OTHERS THEN
      -- 오류 발생 시 트랜잭션 롤백
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql; 