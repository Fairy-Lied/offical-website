[根目录](../../CLAUDE.md) > **.spec-workflow**

---

# .spec-workflow 模块

> 规范工作流模板模块，用于项目需求、设计、技术规范文档的标准化管理。

## 模块职责

- 提供标准化的文档模板
- 规范项目开发流程
- 支持需求、设计、技术、产品、结构等多维度文档

## 文件结构

```
.spec-workflow/
├── user-templates/
│   └── README.md           # 自定义模板使用说明
└── templates/
    ├── design-template.md      # 设计文档模板
    ├── product-template.md     # 产品规划模板
    ├── requirements-template.md # 需求文档模板
    ├── structure-template.md   # 项目结构模板
    ├── tasks-template.md       # 任务分解模板
    └── tech-template.md        # 技术规范模板
```

## 模板说明

### requirements-template.md - 需求文档模板
用于编写功能需求文档，包含：
- 功能概述和背景
- 与产品愿景的对齐
- 用户故事和验收标准
- 非功能性需求（性能、安全、可靠性）

### design-template.md - 设计文档模板
用于编写技术设计文档，包含：
- 架构设计（Mermaid 图表）
- 组件和接口定义
- 数据模型
- 错误处理策略
- 测试策略

### tasks-template.md - 任务分解模板
提供标准化的任务列表格式，包含：
- 任务编号和描述
- 文件路径
- 依赖和复用关系
- 详细的 Prompt 说明
- 成功标准

### product-template.md - 产品规划模板
用于产品方向规划，包含：
- 产品目的和目标用户
- 关键特性和业务目标
- 成功指标
- 产品原则
- 未来愿景

### tech-template.md - 技术规范模板
用于技术栈和架构决策记录，包含：
- 核心技术选型
- 开发环境配置
- 代码质量工具
- 部署和分发策略
- 技术决策日志

### structure-template.md - 项目结构模板
用于定义项目组织规范，包含：
- 目录组织结构
- 文件命名规范
- 代码组织原则
- 导入模式
- 代码大小指南

---

## 使用方式

### 使用默认模板
直接从 `templates/` 目录复制对应模板到项目根目录或 `docs/` 目录使用。

### 创建自定义模板
1. 在 `user-templates/` 目录创建同名文件
2. 按照 README.md 中的说明编写自定义模板
3. 系统会优先使用 `user-templates/` 中的模板

### 模板变量
部分模板支持变量替换：
- `{{projectName}}` - 项目名称
- `{{featureName}}` - 功能名称
- `{{date}}` - 当前日期
- `{{author}}` - 文档作者

---

## 最佳实践

1. **新建功能开发流程**:
   ```
   1. 使用 product-template.md 明确产品方向
   2. 使用 requirements-template.md 编写需求
   3. 使用 design-template.md 进行技术设计
   4. 使用 tasks-template.md 分解开发任务
   5. 开发完成后更新技术文档
   ```

2. **文档维护**:
   - 保持模板与项目实际一致
   - 定期回顾和更新技术决策日志
   - 在代码审查中验证是否符合结构规范

---

## 与项目的关联

当前项目尚未使用这些模板，但建议后续：
- 使用 requirements-template.md 规划新页面功能
- 使用 design-template.md 记录组件设计决策
- 使用 tech-template.md 记录技术选型理由

---

## 常见问题 (FAQ)

### Q: 这些模板是必需的吗？
不是，这是可选的规范工具。当前项目规模较小，可直接开发。

### Q: 如何自定义模板？
查看 `user-templates/README.md` 了解如何创建覆盖模板。

### Q: 模板更新会影响已有文档吗？
不会，模板仅用于创建新文档。已有文档需要手动更新。

---

## 相关文件清单

```
.spec-workflow/
├── user-templates/
│   └── README.md              # 自定义模板指南
└── templates/
    ├── design-template.md         # 设计文档模板
    ├── product-template.md        # 产品规划模板
    ├── requirements-template.md   # 需求文档模板
    ├── structure-template.md      # 项目结构模板
    ├── tasks-template.md          # 任务分解模板
    └── tech-template.md           # 技术规范模板
```

---

## 变更记录 (Changelog)

### 2026-03-07 - 模块文档初始化
- 创建 .spec-workflow 模块 CLAUDE.md 文档
- 梳理所有模板文件及其用途
