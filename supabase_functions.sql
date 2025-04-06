-- 크레딧 사용 및 콘텐츠 저장을 위한 트랜잭션 함수
CREATE OR REPLACE FUNCTION use_credits_and_save_content(
  p_user_id UUID,
  p_topic TEXT,
  p_title TEXT,
  p_content TEXT,
  p_seo_tips JSONB,
  p_credits_used INTEGER DEFAULT 1
) RETURNS VOID AS $$
DECLARE
  v_content_id UUID;
BEGIN
  -- 현재 사용자의 크레딧이 충분한지 확인
  IF NOT EXISTS (
    SELECT 1 FROM user_credits 
    WHERE user_id = p_user_id AND credits >= p_credits_used
  ) THEN
    RAISE EXCEPTION '크레딧이 부족합니다.';
  END IF;

  -- 콘텐츠 생성 내역 저장
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
  ) RETURNING id INTO v_content_id;

  -- 크레딧 차감
  UPDATE user_credits 
  SET 
    credits = credits - p_credits_used,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- 크레딧 사용 내역 기록
  INSERT INTO credit_transactions (
    user_id, 
    amount, 
    type, 
    description,
    content_generation_id
  ) VALUES (
    p_user_id, 
    -p_credits_used, 
    'use', 
    '콘텐츠 생성 - ' || p_topic,
    v_content_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 