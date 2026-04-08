-- Fairy Lied 官网 - Supabase 初始数据库迁移
-- 创建时间: 2026-04-08

-- ============================================
-- 1. Hero 首屏配置
-- ============================================
CREATE TABLE hero (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL DEFAULT 'Fairy Lied',
  subtitle TEXT NOT NULL DEFAULT '妖精说了谎',
  description TEXT NOT NULL DEFAULT '· Gothic / Symphonic Metal',
  background_image TEXT,
  video TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Legend 传说介绍
-- ============================================
CREATE TABLE legend (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL DEFAULT 'The Legend',
  subtitle TEXT NOT NULL DEFAULT '传说',
  image TEXT,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. Members 乐队成员
-- ============================================
CREATE TABLE members (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  is_current BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. Albums 专辑
-- ============================================
CREATE TABLE albums (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  year TEXT NOT NULL,
  cover TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. Album Tracks 专辑曲目
-- ============================================
CREATE TABLE album_tracks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  album_id BIGINT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  track_number INTEGER NOT NULL
);

-- ============================================
-- 6. Tours 巡演
-- ============================================
CREATE TABLE tours (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  date TEXT NOT NULL,
  city TEXT NOT NULL,
  venue TEXT NOT NULL,
  status TEXT DEFAULT 'onsale',
  ticket_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. Gallery 图集
-- ============================================
CREATE TABLE gallery (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. Contacts 联系方式
-- ============================================
CREATE TABLE contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. Social Links 社交媒体
-- ============================================
CREATE TABLE social_links (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ============================================
-- 10. Settings 系统设置
-- ============================================
CREATE TABLE settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 创建索引以优化查询性能
-- ============================================
CREATE INDEX idx_album_tracks_album_id ON album_tracks(album_id);
CREATE INDEX idx_members_sort_order ON members(sort_order);
CREATE INDEX idx_albums_sort_order ON albums(sort_order);
CREATE INDEX idx_tours_sort_order ON tours(sort_order);
CREATE INDEX idx_gallery_sort_order ON gallery(sort_order);
CREATE INDEX idx_social_links_sort_order ON social_links(sort_order);

-- ============================================
-- 启用 Row Level Security (RLS)
-- ============================================
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 创建公开读取策略（前端展示用）
-- ============================================
-- Hero - 公开读取
CREATE POLICY "Hero公开读取" ON hero FOR SELECT USING (true);
-- Legend - 公开读取
CREATE POLICY "Legend公开读取" ON legend FOR SELECT USING (true);
-- Members - 公开读取
CREATE POLICY "Members公开读取" ON members FOR SELECT USING (true);
-- Albums - 公开读取
CREATE POLICY "Albums公开读取" ON albums FOR SELECT USING (true);
-- Album Tracks - 公开读取
CREATE POLICY "Album Tracks公开读取" ON album_tracks FOR SELECT USING (true);
-- Tours - 公开读取
CREATE POLICY "Tours公开读取" ON tours FOR SELECT USING (true);
-- Gallery - 公开读取
CREATE POLICY "Gallery公开读取" ON gallery FOR SELECT USING (true);
-- Contacts - 公开读取
CREATE POLICY "Contacts公开读取" ON contacts FOR SELECT USING (true);
-- Social Links - 公开读取
CREATE POLICY "Social Links公开读取" ON social_links FOR SELECT USING (true);

-- ============================================
-- 创建服务端全权限策略（API 使用 service_role key）
-- ============================================
CREATE POLICY "Hero服务端全权限" ON hero FOR ALL USING (true);
CREATE POLICY "Legend服务端全权限" ON legend FOR ALL USING (true);
CREATE POLICY "Members服务端全权限" ON members FOR ALL USING (true);
CREATE POLICY "Albums服务端全权限" ON albums FOR ALL USING (true);
CREATE POLICY "Album Tracks服务端全权限" ON album_tracks FOR ALL USING (true);
CREATE POLICY "Tours服务端全权限" ON tours FOR ALL USING (true);
CREATE POLICY "Gallery服务端全权限" ON gallery FOR ALL USING (true);
CREATE POLICY "Contacts服务端全权限" ON contacts FOR ALL USING (true);
CREATE POLICY "Social Links服务端全权限" ON social_links FOR ALL USING (true);
CREATE POLICY "Settings服务端全权限" ON settings FOR ALL USING (true);

-- ============================================
-- 插入默认初始数据
-- ============================================

-- Hero 默认数据
INSERT INTO hero (title, subtitle, description, background_image, video)
VALUES (
  'Fairy Lied',
  '妖精说了谎',
  '· Gothic / Symphonic Metal',
  '/images/hero_bg.png',
  '/images/vj_1-2.mp4'
);

-- Legend 默认数据
INSERT INTO legend (title, subtitle, image, content)
VALUES (
  'The Legend',
  '传说',
  '/images/legend.png',
  E'Fairy Lied「妖精说了谎」，2024年组建于上海，一群风格迥异的人类(?)打着哥特金属的旗号暗地里融合自己喜欢的曲风私货。

Fairy Lied「妖精说了谎」，一支建构残酷故事世界的金属(?)乐队。
我们讲的不是美梦，而是梦里的裂缝；我们唱的不一定是真的，但也许能动摇你相信的东西。

我们的声音保持着"美女与野兽"式的对位张力：清亮女声如祷告般吟唱幻象，极端嗓音则在一瞬间击碎信仰。
从哥特金属的冷峻氛围中汲取情绪的阴影，借助力量金属的狂野和交响金属的史诗，将这些幻梦铸造成咒语。
每一首歌都是一则寓言，但都掺了谎言的毒。

我们不相信真相。"妖精说了谎"不是修辞，是信条。 如果声音能构建梦境，那我们就负责让梦境本身开始说谎。

嘘～，来，听我们说谎'
);

-- Members 默认数据
INSERT INTO members (name, role, image, is_current, sort_order) VALUES
  ('猫头', 'Vocal', '/images/member/vocal.jpeg', true, 0),
  ('千雪', 'Keyboard', '/images/member/keyboard.jpeg', true, 1),
  ('十三', 'Guitar', '/images/member/13.jpeg', true, 2),
  ('伯言', 'Bass', '/images/member/bass.jpeg', true, 3),
  ('Sherman', 'Drum', '/images/member/drum.jpeg', true, 4),
  ('达达', 'Bass', '', false, 5),
  ('福老师', 'Keyboard', '', false, 6),
  ('九九', 'Vocal', '', false, 7),
  ('Viki', 'Vocal', '', false, 8);

-- Albums 默认数据
INSERT INTO albums (title, year, cover, sort_order)
VALUES ('Shadows & Vows', '2026', 'https://images.unsplash.com/photo-1671509774803-1640e8853b50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzJ8&ixlib=rb-4.1.0&q=80&w=1080', 0);

-- Album Tracks 默认数据
INSERT INTO album_tracks (album_id, title, track_number) VALUES
  (1, 'Prologue: The Fallen', 1),
  (1, 'Shadows & Vows', 2),
  (1, 'Cathedral of Lies', 3),
  (1, 'Eternal Night', 4),
  (1, 'Whispers in the Dark', 5);

-- Tours 默认数据
INSERT INTO tours (date, city, venue, status, ticket_url, sort_order) VALUES
  ('2026.01.02', '上海', '奶油俱乐部', 'onsale', '#', 0),
  ('2025.09.06', '上海', '奶油俱乐部', 'soldout', '', 1);

-- Gallery 默认数据
INSERT INTO gallery (url, alt, sort_order) VALUES
  ('https://images.unsplash.com/photo-1610948843744-7438ca96811a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzR8&ixlib=rb-4.1.0&q=80&w=1080', '演出照片1', 0),
  ('https://images.unsplash.com/photo-1566291178978-559709ebeece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzV8&ixlib=rb-4.1.0&q=80&w=1080', '演出照片2', 1),
  ('https://images.unsplash.com/photo-1513180950021-b9ff91bb5e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzV8&ixlib=rb-4.1.0&q=80&w=1080', '演出照片3', 2);

-- Social Links 默认数据
INSERT INTO social_links (platform, url, icon, sort_order) VALUES
  ('Weibo', '#', 'simple-icons:sinaweibo', 0),
  ('Bilibili', '#', 'simple-icons:bilibili', 1),
  ('NetEase', '#', 'simple-icons:neteasecloudmusic', 2);

-- Settings 默认数据
INSERT INTO settings (key, value) VALUES
  ('admin_password', 'fairylied2024'),
  ('email', 'contact@fairylied.com');

-- ============================================
-- 创建更新时间触发器函数
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_hero_updated_at BEFORE UPDATE ON hero
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legend_updated_at BEFORE UPDATE ON legend
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成！
-- ============================================
