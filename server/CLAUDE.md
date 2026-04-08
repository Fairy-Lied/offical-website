[根目录](../CLAUDE.md) > **server**

---

# server 模块

> 服务端代码模块，基于 Nuxt 3 的 Nitro 引擎，提供完整的 API 端点和 SQLite 数据库支持。

## 模块职责

- 提供 RESTful API 端点
- 管理 SQLite 数据库
- 处理用户认证
- 文件上传功能
- 数据初始化和迁移

## 文件结构

```
server/
├── api/                     # API 端点目录
│   ├── band-data.get.ts     # 乐队数据聚合API（首页使用）
│   ├── auth/                # 认证相关接口
│   │   ├── login.post.ts    # 用户登录
│   │   ├── logout.post.ts   # 用户登出
│   │   └── check.get.ts     # 检查登录状态
│   ├── hero.get.ts          # 获取首屏数据
│   ├── hero.post.ts         # 更新首屏数据
│   ├── legend.get.ts        # 获取传说数据
│   ├── legend.post.ts       # 更新传说数据
│   ├── members.get.ts       # 获取成员列表
│   ├── members.post.ts      # 更新成员数据
│   ├── members/[id].delete.ts # 删除成员
│   ├── albums.get.ts        # 获取专辑列表
│   ├── albums.post.ts       # 更新专辑数据
│   ├── albums/[id].delete.ts  # 删除专辑
│   ├── tours.get.ts         # 获取巡演列表
│   ├── tours.post.ts        # 更新巡演数据
│   ├── tours/[id].delete.ts   # 删除巡演
│   ├── gallery.get.ts       # 获取图集列表
│   ├── gallery.post.ts      # 更新图集数据
│   ├── gallery/[id].delete.ts # 删除图集
│   ├── contacts.get.ts      # 获取联系方式
│   ├── contacts.post.ts     # 更新联系方式
│   └── upload.post.ts       # 文件上传
├── utils/
│   └── db.ts                # 数据库工具函数
└── db/
    └── data.db              # SQLite 数据库文件
```

---

## 数据库架构

### 初始化流程

数据库在首次访问时自动初始化：

1. 创建数据库文件 `server/db/data.db`
2. 设置 WAL 模式（提高并发性能）
3. 创建所有表结构
4. 插入默认初始数据

### 数据库表结构

#### hero - 首屏配置
```sql
CREATE TABLE hero (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL DEFAULT 'Fairy Lied',
  subtitle TEXT NOT NULL DEFAULT '妖精说了谎',
  description TEXT NOT NULL DEFAULT '· Gothic / Symphonic Metal',
  background_image TEXT,
  video TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### legend - 传说介绍
```sql
CREATE TABLE legend (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL DEFAULT 'The Legend',
  subtitle TEXT NOT NULL DEFAULT '传说',
  image TEXT,
  content TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### members - 乐队成员
```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  is_current INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### albums - 专辑
```sql
CREATE TABLE albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  year TEXT NOT NULL,
  cover TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### album_tracks - 专辑曲目
```sql
CREATE TABLE album_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  track_number INTEGER NOT NULL,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
)
```

#### tours - 巡演
```sql
CREATE TABLE tours (
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
```

#### gallery - 图集
```sql
CREATE TABLE gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### contacts - 联系方式
```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### social_links - 社交媒体
```sql
CREATE TABLE social_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
)
```

#### settings - 系统设置
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## API 端点详解

### 数据聚合 API

#### GET /api/band-data
**职责**: 首页数据聚合，一次获取所有展示数据。

**返回数据**:
```json
{
  "hero": { ... },
  "legend": { ... },
  "members": {
    "current": [ ... ],
    "former": [ ... ]
  },
  "albums": [ ... ],
  "tours": [ ... ],
  "gallery": [ ... ],
  "contacts": {
    ...,
    "socials": [ ... ]
  }
}
```

**性能优化**: 使用单次请求聚合所有数据，减少前端请求次数。

---

### 认证 API

#### POST /api/auth/login
**职责**: 用户登录认证。

**请求体**:
```json
{
  "password": "fairylied2024"
}
```

**返回**:
```json
{
  "success": true,
  "message": "登录成功"
}
```

**实现**: 密码存储在 `settings` 表中，比对成功后设置 session。

#### POST /api/auth/logout
**职责**: 用户登出，清除 session。

#### GET /api/auth/check
**职责**: 检查当前登录状态。

**返回**:
```json
{
  "authenticated": true,
  "user": "admin"
}
```

---

### CRUD API 模式

所有资源遵循统一的 CRUD 模式：

#### GET /api/[resource]
**职责**: 获取资源列表或单个资源。

**示例**: `GET /api/members`
```json
[
  {
    "id": 1,
    "name": "猫头",
    "role": "Vocal",
    "image": "/images/member/vocal.jpeg",
    "is_current": 1,
    "sort_order": 0
  }
]
```

#### POST /api/[resource]
**职责**: 创建或更新资源。

**请求体**:
```json
{
  "id": 1,  // 可选，有则更新，无则创建
  "name": "猫头",
  "role": "Vocal",
  "image": "/images/member/vocal.jpeg",
  "is_current": 1,
  "sort_order": 0
}
```

#### DELETE /api/[resource]/[id]
**职责**: 删除指定资源。

**示例**: `DELETE /api/members/1`

**返回**:
```json
{
  "success": true,
  "message": "删除成功"
}
```

---

### 特殊 API

#### POST /api/upload
**职责**: 文件上传处理。

**请求**: `multipart/form-data`

**支持格式**: 
- 图片：jpg, png, gif, webp
- 视频：mp4, webm

**文件存储**: `public/uploads/` 目录

**返回**:
```json
{
  "url": "/uploads/1775552016625-shareLogo.jpg",
  "filename": "1775552016625-shareLogo.jpg"
}
```

---

## 数据库工具函数

### getDB()
**职责**: 获取数据库实例（单例模式）。

**实现**:
```typescript
export function getDB(): Database.Database {
  if (!db) {
    const dbPath = resolve(process.cwd(), 'server/db/data.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initTables()
  }
  return db
}
```

**特性**:
- 单例模式，避免重复连接
- WAL 模式，提高并发性能
- 自动初始化表结构

### initTables()
**职责**: 创建所有表结构（如果不存在）。

### initDefaultData()
**职责**: 插入默认初始数据。

**默认数据**:
- Hero 配置
- Legend 传说介绍
- 5 位现任成员 + 4 位历任成员
- 1 张专辑（含 5 首曲目）
- 2 条巡演记录
- 3 张图集图片
- 3 个社交媒体链接
- 管理员密码：`fairylied2024`

---

## 中间件

### 认证中间件

需要认证的 API 端点使用 session 验证：

```typescript
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  // ... 处理请求
})
```

---

## 错误处理

### 统一错误格式
```json
{
  "statusCode": 400,
  "statusMessage": "错误描述"
}
```

### 常见错误
- 400: 请求参数错误
- 401: 未授权（需要登录）
- 404: 资源不存在
- 500: 服务器内部错误

---

## 性能优化

### 数据库优化
- 使用 WAL 模式提高并发
- 合理使用索引
- 分页查询（大数据量时）

### API 优化
- 聚合 API 减少请求次数
- 缓存策略（可选）
- 压缩响应（Nitro 自动处理）

---

## 安全考虑

### 当前实现
- 简单密码认证
- Session 管理
- SQL 参数化查询（防止注入）

### 生产环境建议
- 升级为 JWT 或 OAuth
- 添加速率限制
- HTTPS 强制
- 输入验证和清理
- CORS 配置

---

## 开发指南

### 添加新 API

1. 在 `server/api/` 创建文件
2. 使用 `defineEventHandler` 定义处理函数
3. 导出默认函数

**示例**:
```typescript
// server/api/example.get.ts
export default defineEventHandler(async (event) => {
  const db = getDB()
  const data = db.prepare('SELECT * FROM example').all()
  return data
})
```

### 数据库操作

使用 `better-sqlite3` 的同步 API：

```typescript
// 查询
const items = db.prepare('SELECT * FROM table').all()

// 插入
const result = db.prepare('INSERT INTO table (name) VALUES (?)').run('value')

// 更新
db.prepare('UPDATE table SET name = ? WHERE id = ?').run('new', 1)

// 删除
db.prepare('DELETE FROM table WHERE id = ?').run(1)
```

---

## 部署说明

### 构建
```bash
pnpm build
```

### 运行
构建后会生成 `.output/` 目录，包含：
- 服务端代码
- 客户端静态文件
- 数据库文件

### 环境变量
- `NUXT_AUTH_SECRET`: 认证密钥（建议修改）

---

## 常见问题 (FAQ)

### Q: 如何重置数据库？
删除 `server/db/data.db` 文件，重新启动应用会自动重建。

### Q: 如何修改管理员密码？
通过管理后台设置，或直接修改数据库 `settings` 表。

### Q: 数据库文件在哪里？
`server/db/data.db`，生产环境可能在其他位置。

### Q: 如何备份数据？
定期备份 `server/db/data.db` 文件即可。

---

## 相关文件清单

```
server/
├── api/
│   ├── band-data.get.ts     # 52行 - 数据聚合
│   ├── auth/
│   │   ├── login.post.ts    # 登录接口
│   │   ├── logout.post.ts   # 登出接口
│   │   └── check.get.ts     # 状态检查
│   ├── hero.get.ts          # 首屏数据获取
│   ├── hero.post.ts         # 首屏数据更新
│   ├── legend.get.ts        # 传说数据获取
│   ├── legend.post.ts       # 传说数据更新
│   ├── members.get.ts       # 成员列表
│   ├── members.post.ts      # 成员更新
│   ├── members/[id].delete.ts # 成员删除
│   ├── albums.get.ts        # 专辑列表
│   ├── albums.post.ts       # 专辑更新
│   ├── albums/[id].delete.ts  # 专辑删除
│   ├── tours.get.ts         # 巡演列表
│   ├── tours.post.ts        # 巡演更新
│   ├── tours/[id].delete.ts   # 巡演删除
│   ├── gallery.get.ts       # 图集列表
│   ├── gallery.post.ts      # 图集更新
│   ├── gallery/[id].delete.ts # 图集删除
│   ├── contacts.get.ts      # 联系方式
│   ├── contacts.post.ts     # 联系方式更新
│   └── upload.post.ts       # 文件上传
├── utils/
│   └── db.ts                # 255行 - 数据库工具
└── db/
    └── data.db              # SQLite 数据库
```

---

## 变更记录 (Changelog)

### 2026-04-08 - 模块文档重大更新
- 全面更新 server 模块文档
- 添加完整的数据库架构说明
- 添加所有 API 端点文档
- 添加开发指南和部署说明
- 记录当前实现的安全措施

### 2026-03-07 - 模块文档初始化
- 创建 server 模块 CLAUDE.md 文档
- 记录为空状态和未来扩展方向
