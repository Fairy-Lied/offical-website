import Database from 'better-sqlite3'
import { resolve } from 'path'

let db: Database.Database | null = null

export function getDB(): Database.Database {
  if (!db) {
    const dbPath = resolve(process.cwd(), 'server/db/data.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initTables()
  }
  return db
}

function initTables() {
  if (!db) return

  // Hero 首屏配置
  db.exec(`
    CREATE TABLE IF NOT EXISTS hero (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT 'Fairy Lied',
      subtitle TEXT NOT NULL DEFAULT '妖精说了谎',
      description TEXT NOT NULL DEFAULT '· Gothic / Symphonic Metal',
      background_image TEXT,
      video TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Legend 传说介绍
  db.exec(`
    CREATE TABLE IF NOT EXISTS legend (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT 'The Legend',
      subtitle TEXT NOT NULL DEFAULT '传说',
      image TEXT,
      content TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Members 成员
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      image TEXT,
      is_current INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Albums 专辑
  db.exec(`
    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year TEXT NOT NULL,
      cover TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Album Tracks 专辑曲目
  db.exec(`
    CREATE TABLE IF NOT EXISTS album_tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      track_number INTEGER NOT NULL,
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
    )
  `)

  // Tours 巡演
  db.exec(`
    CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      city TEXT NOT NULL,
      venue TEXT NOT NULL,
      status TEXT DEFAULT 'onsale',
      ticket_url TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Gallery 图集
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      alt TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Contacts 联系方式
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Social Links 社交媒体
  db.exec(`
    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    )
  `)

  // Settings 系统设置（用于存储密码等配置）
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 初始化默认数据
  initDefaultData()
}

function initDefaultData() {
  if (!db) return

  // 检查是否需要初始化
  const heroCount = db.prepare('SELECT COUNT(*) as count FROM hero').get() as { count: number }
  if (heroCount.count === 0) {
    db.prepare(`
      INSERT INTO hero (title, subtitle, description, background_image, video)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'Fairy Lied',
      '妖精说了谎',
      '· Gothic / Symphonic Metal',
      '/images/hero_bg.png',
      '/images/vj_1-2.mp4'
    )
  }

  const legendCount = db.prepare('SELECT COUNT(*) as count FROM legend').get() as { count: number }
  if (legendCount.count === 0) {
    db.prepare(`
      INSERT INTO legend (title, subtitle, image, content)
      VALUES (?, ?, ?, ?)
    `).run(
      'The Legend',
      '传说',
      '/images/legend.png',
      `Fairy Lied「妖精说了谎」，2024年组建于上海，一群风格迥异的人类(?)打着哥特金属的旗号暗地里融合自己喜欢的曲风私货。

Fairy Lied「妖精说了谎」，一支建构残酷故事世界的金属(?)乐队。
我们讲的不是美梦，而是梦里的裂缝；我们唱的不一定是真的，但也许能动摇你相信的东西。

我们的声音保持着"美女与野兽"式的对位张力：清亮女声如祷告般吟唱幻象，极端嗓音则在一瞬间击碎信仰。
从哥特金属的冷峻氛围中汲取情绪的阴影，借助力量金属的狂野和交响金属的史诗，将这些幻梦铸造成咒语。
每一首歌都是一则寓言，但都掺了谎言的毒。

我们不相信真相。"妖精说了谎"不是修辞，是信条。 如果声音能构建梦境，那我们就负责让梦境本身开始说谎。

嘘～，来，听我们说谎`
    )
  }

  const memberCount = db.prepare('SELECT COUNT(*) as count FROM members').get() as { count: number }
  if (memberCount.count === 0) {
    const members = [
      { name: '猫头', role: 'Vocal', image: '/images/member/vocal.jpeg', isCurrent: 1 },
      { name: '千雪', role: 'Keyboard', image: '/images/member/keyboard.jpeg', isCurrent: 1 },
      { name: '十三', role: 'Guitar', image: '/images/member/13.jpeg', isCurrent: 1 },
      { name: '伯言', role: 'Bass', image: '/images/member/bass.jpeg', isCurrent: 1 },
      { name: 'Sherman', role: 'Drum', image: '/images/member/drum.jpeg', isCurrent: 1 },
      { name: '达达', role: 'Bass', image: '', isCurrent: 0 },
      { name: '福老师', role: 'Keyboard', image: '', isCurrent: 0 },
      { name: '九九', role: 'Vocal', image: '', isCurrent: 0 },
      { name: 'Viki', role: 'Vocal', image: '', isCurrent: 0 },
    ]
    const stmt = db.prepare('INSERT INTO members (name, role, image, is_current, sort_order) VALUES (?, ?, ?, ?, ?)')
    members.forEach((m, i) => stmt.run(m.name, m.role, m.image, m.isCurrent, i))
  }

  const albumCount = db.prepare('SELECT COUNT(*) as count FROM albums').get() as { count: number }
  if (albumCount.count === 0) {
    const result = db.prepare('INSERT INTO albums (title, year, cover, sort_order) VALUES (?, ?, ?, ?)')
      .run('Shadows & Vows', '2026', 'https://images.unsplash.com/photo-1671509774803-1640e8853b50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzJ8&ixlib=rb-4.1.0&q=80&w=1080', 0)

    const tracks = [
      'Prologue: The Fallen',
      'Shadows & Vows',
      'Cathedral of Lies',
      'Eternal Night',
      'Whispers in the Dark'
    ]
    const trackStmt = db.prepare('INSERT INTO album_tracks (album_id, title, track_number) VALUES (?, ?, ?)')
    tracks.forEach((t, i) => trackStmt.run(result.lastInsertRowid, t, i + 1))
  }

  const tourCount = db.prepare('SELECT COUNT(*) as count FROM tours').get() as { count: number }
  if (tourCount.count === 0) {
    const tours = [
      { date: '2026.01.02', city: '上海', venue: '奶油俱乐部', status: 'onsale', ticketUrl: '#' },
      { date: '2025.09.06', city: '上海', venue: '奶油俱乐部', status: 'soldout', ticketUrl: '' },
    ]
    const stmt = db.prepare('INSERT INTO tours (date, city, venue, status, ticket_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
    tours.forEach((t, i) => stmt.run(t.date, t.city, t.venue, t.status, t.ticketUrl, i))
  }

  const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery').get() as { count: number }
  if (galleryCount.count === 0) {
    const images = [
      { url: 'https://images.unsplash.com/photo-1610948843744-7438ca96811a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzR8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片1' },
      { url: 'https://images.unsplash.com/photo-1566291178978-559709ebeece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzV8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片2' },
      { url: 'https://images.unsplash.com/photo-1513180950021-b9ff91bb5e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzV8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片3' },
    ]
    const stmt = db.prepare('INSERT INTO gallery (url, alt, sort_order) VALUES (?, ?, ?)')
    images.forEach((img, i) => stmt.run(img.url, img.alt, i))
  }

  const socialCount = db.prepare('SELECT COUNT(*) as count FROM social_links').get() as { count: number }
  if (socialCount.count === 0) {
    const socials = [
      { platform: 'Weibo', url: '#', icon: 'simple-icons:sinaweibo' },
      { platform: 'Bilibili', url: '#', icon: 'simple-icons:bilibili' },
      { platform: 'NetEase', url: '#', icon: 'simple-icons:neteasecloudmusic' },
    ]
    const stmt = db.prepare('INSERT INTO social_links (platform, url, icon, sort_order) VALUES (?, ?, ?, ?)')
    socials.forEach((s, i) => stmt.run(s.platform, s.url, s.icon, i))
  }

  // 初始化管理员密码设置
  const settingCount = db.prepare('SELECT COUNT(*) as count FROM settings WHERE key = ?').get('admin_password') as { count: number }
  if (settingCount.count === 0) {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('admin_password', 'fairylied2024')
  }
}
