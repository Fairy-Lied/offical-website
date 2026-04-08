# Supabase 配置指南

> Fairy Lied 官网已从 SQLite 迁移到 Supabase，本指南帮助你完成 Supabase 配置。

---

## 🚀 快速开始

### 1. 创建 Supabase 项目

1. 访问 [Supabase 控制台](https://app.supabase.com)
2. 点击 **"New Project"**
3. 填写项目信息：
   - **Name**: `fairy-lied`
   - **Database Password**: 设置一个强密码
   - **Region**: 选择离你最近的区域（推荐：东南亚 - 新加坡）

### 2. 获取 API 密钥

进入项目后，点击左侧 **"Settings"** → **"API"**，获取以下信息：

- **Project URL**: `https://xxxxx.supabase.co`
- **service_role secret**: 点击 "Reveal" 显示密钥

### 3. 执行数据库迁移

1. 在 Supabase 控制台，点击左侧 **"SQL Editor"**
2. 点击 **"New Query"**
3. 复制并执行 `supabase/migrations/001_initial_schema.sql` 文件的全部内容
4. 点击 **"Run"** 执行

### 4. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# Supabase 配置
NUXT_SUPABASE_URL=https://xxxxx.supabase.co
NUXT_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Auth 密钥（随机生成一个）
NUXT_AUTH_SECRET=your-random-secret-here
```

### 5. 启动开发服务器

```bash
pnpm dev
```

---

## 📁 文件结构

```
supabase/
└── migrations/
    └── 001_initial_schema.sql    # 数据库初始迁移脚本

server/
└── utils/
    ├── supabase.ts               # Supabase 客户端配置（新增）
    └── db.sqlite.backup.ts       # 旧 SQLite 工具（已备份）
```

---

## 🔐 安全说明

### Service Role Key

- **只能在服务端使用**（server/api 目录下）
- **绝对不能暴露到前端代码**
- 具有绕过 RLS 的权限，可执行所有数据库操作

### Row Level Security (RLS)

数据库已配置 RLS 策略：
- **公开读取**：前端可以直接读取公开数据（通过 anon key）
- **服务端全权**：使用 service_role key 进行所有 CRUD 操作

---

## 🔄 数据迁移

如果需要从旧 SQLite 数据库迁移数据，可以使用以下方法：

### 方法 1：手动导出导入

1. 使用 SQLite 客户端打开旧的 `server/db/data.db.backup`
2. 导出数据为 SQL 或 CSV
3. 在 Supabase SQL Editor 中导入

### 方法 2：使用迁移脚本

```bash
# 安装依赖
pnpm add tsx

# 运行迁移脚本（需要自行编写）
npx tsx scripts/migrate-sqlite-to-supabase.ts
```

---

## 🛠️ 开发指南

### 查询数据

```typescript
import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  // 查询
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('is_current', true)
    .order('sort_order')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
```

### 插入数据

```typescript
const { data, error } = await supabase
  .from('members')
  .insert({
    name: '新成员',
    role: 'Vocal',
    is_current: true,
    sort_order: 0
  })
  .select()  // 返回插入的数据
```

### 更新数据

```typescript
const { data, error } = await supabase
  .from('members')
  .update({ name: '更新后的名称' })
  .eq('id', 1)
  .select()
```

### 删除数据

```typescript
const { error } = await supabase
  .from('members')
  .delete()
  .eq('id', 1)
```

---

## 📊 数据库表结构

| 表名 | 用途 | 主要字段 |
|------|------|----------|
| `hero` | 首屏配置 | title, subtitle, description, background_image, video |
| `legend` | 传说介绍 | title, subtitle, image, content |
| `members` | 乐队成员 | name, role, image, is_current, sort_order |
| `albums` | 专辑 | title, year, cover, sort_order |
| `album_tracks` | 专辑曲目 | album_id, title, track_number |
| `tours` | 巡演 | date, city, venue, status, ticket_url |
| `gallery` | 图集 | url, alt, sort_order |
| `contacts` | 联系方式 | email |
| `social_links` | 社交媒体 | platform, url, icon |
| `settings` | 系统设置 | key, value |

---

## 🐛 常见问题

### Q: 如何重置管理员密码？

在 Supabase SQL Editor 执行：

```sql
UPDATE settings
SET value = 'your-new-password'
WHERE key = 'admin_password';
```

### Q: 如何添加测试数据？

在 Supabase Table Editor 中直接添加，或使用 SQL：

```sql
INSERT INTO members (name, role, image, is_current, sort_order)
VALUES ('测试成员', 'Vocal', '/images/test.jpg', true, 10);
```

### Q: 本地开发时如何查看数据？

1. 在 Supabase 控制台点击 **"Table Editor"**
2. 选择要查看的表
3. 可以直接查看、编辑、删除数据

---

## 📚 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

---

## 变更记录

### 2026-04-08 - Supabase 迁移完成
- 创建 Supabase 迁移脚本
- 添加 Supabase 客户端配置
- 更新所有 API 端点
- 移除 SQLite 依赖
- 创建使用指南文档
