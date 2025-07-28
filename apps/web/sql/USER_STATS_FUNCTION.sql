-- 用户统计函数
-- 在Supabase SQL Editor中执行此脚本

-- 创建获取用户统计的函数
-- 这个函数使用SECURITY DEFINER权限，可以访问auth.users表
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- 尝试从auth.users表获取实际注册用户数
  BEGIN
    SELECT COUNT(*)
    INTO user_count
    FROM auth.users
    WHERE deleted_at IS NULL;
    
    RETURN user_count;
  EXCEPTION WHEN OTHERS THEN
    -- 如果无法访问auth.users，回退到profiles表
    SELECT COUNT(*)
    INTO user_count
    FROM profiles;
    
    RETURN user_count;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建获取详细统计信息的函数
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
  user_count INTEGER;
  profile_count INTEGER;
  favorite_count INTEGER;
  search_count INTEGER;
  today_search_count INTEGER;
  today_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 设置今天的开始时间
  today_start := DATE_TRUNC('day', NOW());
  
  -- 获取用户统计
  BEGIN
    -- 尝试获取真实的注册用户数
    SELECT COUNT(*)
    INTO user_count
    FROM auth.users
    WHERE deleted_at IS NULL;
  EXCEPTION WHEN OTHERS THEN
    -- 回退到profiles表
    SELECT COUNT(*)
    INTO user_count
    FROM profiles;
  END;
  
  -- 获取profiles数量（有个人信息的用户）
  SELECT COUNT(*)
  INTO profile_count
  FROM profiles;
  
  -- 获取收藏数量
  SELECT COUNT(*)
  INTO favorite_count
  FROM domain_favorites;
  
  -- 获取搜索历史数量
  SELECT COUNT(*)
  INTO search_count
  FROM search_history;
  
  -- 获取今日搜索数量
  SELECT COUNT(*)
  INTO today_search_count
  FROM search_history
  WHERE created_at >= today_start;
  
  -- 构建JSON结果
  result := json_build_object(
    'total_users', user_count,
    'total_profiles', profile_count,
    'total_favorites', favorite_count,
    'total_searches', search_count,
    'today_searches', today_search_count,
    'generated_at', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建权限，允许public角色调用这些函数
GRANT EXECUTE ON FUNCTION get_user_count() TO public;
GRANT EXECUTE ON FUNCTION get_system_stats() TO public;

-- 创建用于查看统计信息的视图（可选）
CREATE OR REPLACE VIEW system_stats_view AS
SELECT 
  get_user_count() as total_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM domain_favorites) as total_favorites,
  (SELECT COUNT(*) FROM search_history) as total_searches,
  (SELECT COUNT(*) FROM search_history WHERE created_at >= DATE_TRUNC('day', NOW())) as today_searches;