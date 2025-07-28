-- API使用次数限制表设置
-- 在Supabase SQL Editor中执行此脚本

-- 创建API请求限制记录表
CREATE TABLE IF NOT EXISTS rate_limiting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 身份标识
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- 已登录用户ID（可为空）
  ip_address INET NOT NULL,                                   -- IP地址
  session_id TEXT,                                            -- 会话ID（可为空）
  
  -- 请求信息
  endpoint TEXT NOT NULL,                                     -- API端点
  user_agent TEXT,                                            -- 用户代理
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 创建索引用于快速查询
CREATE INDEX idx_rate_limiting_ip_address ON rate_limiting(ip_address);
CREATE INDEX idx_rate_limiting_user_id ON rate_limiting(user_id);
CREATE INDEX idx_rate_limiting_session_id ON rate_limiting(session_id);
CREATE INDEX idx_rate_limiting_created_at ON rate_limiting(created_at);
CREATE INDEX idx_rate_limiting_endpoint ON rate_limiting(endpoint);

-- 复合索引用于限制检查
CREATE INDEX idx_rate_limiting_ip_endpoint_created ON rate_limiting(ip_address, endpoint, created_at);
CREATE INDEX idx_rate_limiting_user_endpoint_created ON rate_limiting(user_id, endpoint, created_at);
CREATE INDEX idx_rate_limiting_session_endpoint_created ON rate_limiting(session_id, endpoint, created_at);

-- 创建RLS策略（服务角色可以访问所有数据，用户只能查看自己的记录）
ALTER TABLE rate_limiting ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的限制记录
CREATE POLICY "Users can view own rate limiting records" ON rate_limiting
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'role' = 'service_role'
  );

-- 服务角色可以插入所有记录
CREATE POLICY "Service role can insert rate limiting records" ON rate_limiting
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- 创建清理过期记录的函数
CREATE OR REPLACE FUNCTION cleanup_old_rate_limiting_records()
RETURNS void AS $$
BEGIN
  -- 删除7天前的记录
  DELETE FROM rate_limiting 
  WHERE created_at < NOW() - INTERVAL '7 days';
  
  RAISE NOTICE 'Cleaned up old rate limiting records';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建获取IP限制统计的函数
CREATE OR REPLACE FUNCTION get_ip_request_count(
  p_ip_address INET,
  p_endpoint TEXT,
  p_time_window_minutes INTEGER DEFAULT 1440  -- 默认24小时
)
RETURNS INTEGER AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO request_count
  FROM rate_limiting
  WHERE ip_address = p_ip_address
    AND endpoint = p_endpoint
    AND created_at >= NOW() - (p_time_window_minutes || ' minutes')::INTERVAL;
    
  RETURN COALESCE(request_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建获取会话限制统计的函数
CREATE OR REPLACE FUNCTION get_session_request_count(
  p_session_id TEXT,
  p_endpoint TEXT,
  p_time_window_minutes INTEGER DEFAULT 1440  -- 默认24小时
)
RETURNS INTEGER AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO request_count
  FROM rate_limiting
  WHERE session_id = p_session_id
    AND endpoint = p_endpoint
    AND created_at >= NOW() - (p_time_window_minutes || ' minutes')::INTERVAL;
    
  RETURN COALESCE(request_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建获取用户限制统计的函数
CREATE OR REPLACE FUNCTION get_user_request_count(
  p_user_id UUID,
  p_endpoint TEXT,
  p_time_window_minutes INTEGER DEFAULT 1440  -- 默认24小时
)
RETURNS INTEGER AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO request_count
  FROM rate_limiting
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND created_at >= NOW() - (p_time_window_minutes || ' minutes')::INTERVAL;
    
  RETURN COALESCE(request_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建定时清理任务（需要安装pg_cron扩展）
-- 注意：这需要在Supabase控制台的SQL Editor中手动启用
-- SELECT cron.schedule('cleanup-rate-limiting', '0 2 * * *', 'SELECT cleanup_old_rate_limiting_records();');

-- 创建视图用于监控
CREATE OR REPLACE VIEW rate_limiting_stats AS
SELECT 
  endpoint,
  COUNT(*) as total_requests,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT user_id) as unique_users,
  DATE_TRUNC('hour', created_at) as hour_bucket
FROM rate_limiting
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY endpoint, DATE_TRUNC('hour', created_at)
ORDER BY hour_bucket DESC, total_requests DESC;