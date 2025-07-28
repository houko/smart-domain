-- 创建 profiles 表（如果不存在）
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  avatar_url text,
  subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'professional', 'enterprise')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 添加注释
COMMENT ON TABLE profiles IS '用户配置信息表';
COMMENT ON COLUMN profiles.subscription_plan IS '用户的订阅计划：free（免费版）, professional（专业版）, enterprise（企业版）';

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 创建触发器，当新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 如果触发器不存在，则创建
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END$$;

-- 更新 updated_at 字段的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为现有用户创建 profiles 记录（如果他们还没有）
INSERT INTO profiles (id, email, full_name, avatar_url)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- 确保 api_key_usage 表存在（如果还没创建的话）
CREATE TABLE IF NOT EXISTS api_key_usage (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id uuid NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint text NOT NULL,
    method text NOT NULL,
    status_code integer NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 为 api_key_usage 创建索引
CREATE INDEX IF NOT EXISTS idx_api_key_usage_api_key_id ON api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_created_at ON api_key_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_endpoint ON api_key_usage(endpoint);

-- 添加 RLS 策略
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的 API 使用记录
CREATE POLICY "Users can view own API usage" ON api_key_usage
    FOR SELECT
    USING (
        api_key_id IN (
            SELECT id FROM api_keys WHERE user_id = auth.uid()
        )
    );

-- 系统可以插入使用记录（通过 service role）
CREATE POLICY "Service role can insert API usage" ON api_key_usage
    FOR INSERT
    WITH CHECK (true);

-- 授权
GRANT SELECT ON api_key_usage TO authenticated;
GRANT INSERT ON api_key_usage TO service_role;