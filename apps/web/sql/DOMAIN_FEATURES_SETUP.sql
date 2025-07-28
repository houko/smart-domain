-- 域名收藏和搜索历史表设置
-- 在Supabase SQL Editor中执行此脚本

-- 创建域名收藏表
CREATE TABLE IF NOT EXISTS domain_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  tags TEXT[], -- 用户添加的标签
  notes TEXT, -- 用户备注
  is_available BOOLEAN, -- 域名是否可用
  last_checked_at TIMESTAMPTZ, -- 最后检查时间
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 创建索引
CREATE INDEX idx_domain_favorites_user_id ON domain_favorites(user_id);
CREATE INDEX idx_domain_favorites_domain ON domain_favorites(domain);
CREATE INDEX idx_domain_favorites_created_at ON domain_favorites(created_at);

-- 避免重复收藏
CREATE UNIQUE INDEX idx_domain_favorites_unique ON domain_favorites(user_id, domain);

-- 创建搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  search_term TEXT NOT NULL, -- 搜索关键词
  domain_results JSONB, -- 搜索结果（存储域名建议的快照）
  result_count INTEGER, -- 结果数量
  search_type TEXT DEFAULT 'keyword', -- 搜索类型：keyword, domain, company等
  filters JSONB, -- 搜索时使用的过滤器
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 创建索引
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_search_term ON search_history(search_term);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);
CREATE INDEX idx_search_history_search_type ON search_history(search_type);

-- 创建RLS策略 - 域名收藏
ALTER TABLE domain_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own domain favorites" ON domain_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own domain favorites" ON domain_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own domain favorites" ON domain_favorites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own domain favorites" ON domain_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 创建RLS策略 - 搜索历史
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search history" ON search_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own search history" ON search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own search history" ON search_history
  FOR DELETE USING (auth.uid() = user_id);

-- 创建函数来更新updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器 - 域名收藏
CREATE TRIGGER update_domain_favorites_updated_at BEFORE UPDATE ON domain_favorites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 添加一些有用的视图和函数

-- 创建视图：用户最近的搜索
CREATE OR REPLACE VIEW recent_searches AS
SELECT 
  user_id,
  search_term,
  search_type,
  result_count,
  created_at,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
FROM search_history;

-- 创建视图：用户收藏统计
CREATE OR REPLACE VIEW user_favorites_stats AS
SELECT 
  user_id,
  COUNT(*) as total_favorites,
  COUNT(CASE WHEN is_available = true THEN 1 END) as available_count,
  COUNT(CASE WHEN is_available = false THEN 1 END) as unavailable_count,
  COUNT(CASE WHEN is_available IS NULL THEN 1 END) as unchecked_count
FROM domain_favorites
GROUP BY user_id;

-- 清理旧搜索历史的函数（保留最近1000条记录）
CREATE OR REPLACE FUNCTION cleanup_old_search_history()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM search_history 
  WHERE id IN (
    SELECT id FROM search_history 
    WHERE user_id IN (
      SELECT DISTINCT user_id FROM search_history
    )
    AND id NOT IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
        FROM search_history
      ) ranked
      WHERE rn <= 1000
    )
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 创建定时清理任务（可选，需要pg_cron扩展）
-- SELECT cron.schedule('cleanup-search-history', '0 2 * * *', 'SELECT cleanup_old_search_history();');