-- 관리자 역할 테이블 생성 (없는 경우)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 결제 정보를 저장할 임시 테이블 생성
CREATE TABLE IF NOT EXISTS payment_preparations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- credit_transactions 테이블에 payment_key 컬럼 추가 (없는 경우)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'credit_transactions' AND column_name = 'payment_key'
    ) THEN
        ALTER TABLE credit_transactions ADD COLUMN payment_key TEXT;
    END IF;
END $$;

-- 데이터베이스 접근 정책(RLS) 설정
ALTER TABLE payment_preparations ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 결제 정보만 볼 수 있음
CREATE POLICY "사용자는 자신의 결제 정보만 볼 수 있음" 
  ON payment_preparations FOR SELECT 
  USING (auth.uid() = user_id);

-- INSERT 정책: 서비스 역할(service role)에서는 어떤 사용자의 데이터도 추가 가능
CREATE POLICY "서비스 역할은 모든 결제 정보를 추가할 수 있음" 
  ON payment_preparations FOR INSERT 
  WITH CHECK (true);
  
-- UPDATE 정책: 서비스 역할에서는 어떤 사용자의 데이터도 업데이트 가능
CREATE POLICY "서비스 역할은 모든 결제 정보를 업데이트할 수 있음" 
  ON payment_preparations FOR UPDATE
  USING (true);

-- 관리자 정책 - 관리자 테이블이 비어있거나 오류가 발생할 수 있으므로 일단 주석 처리
-- CREATE POLICY "관리자는 모든 결제 정보에 접근 가능" 
--   ON payment_preparations FOR ALL 
--   USING (auth.uid() IN (
--     SELECT user_id FROM user_roles WHERE role = 'admin'
--   )); 