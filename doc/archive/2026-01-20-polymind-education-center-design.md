> ⚠️ ARCHIVED DOCUMENT – DO NOT USE FOR IMPLEMENTATION
>
> This document represents an early, full-scope system vision.
> It is kept for historical and reference purposes only.
>
> All current implementation MUST follow:
> docs/system-planning.md



# PolyMind 教育中心系统设计文档

**日期**: 2026-01-20
**状态**: 已确认
**参考网站**: https://couse-mvp.vercel.app/
**版本**: v2.0（补充课程、讲师、评价、证书等功能）

---

## 项目概述

PolyMind 教育中心网站，提供宠物相关课程，包含 MBTI 16 型人格分析測驗功能，系统根据学员人格类型推荐合适课程。

### 核心功能
- 课程浏览与搜索
- 课程收藏
- 课程评价/评论
- 课程购买与支付
- 学习进度追踪（章节结构）
- 学习证书
- 讲师管理
- MBTI 人格测验（60-90 题，可选功能）
- 基于人格类型的课程推荐
- 相关课程推荐 + 热门课程推荐
- 开课前提醒（实体和外出实习课程）
- 用户中心（资料、统计、订单、密码）
- 响应式设计（支持亮色/暗色模式）

---

## 设计系统

### 设计 Token 系统

**颜色方案：**
- Primary Blue: `#137fec` (主色调)
- Accent Orange: `#f97316` (强调色)
- Background:
  - Light mode: `#ffffff` (白色)
  - Dark mode: `#0f172a` (深蓝黑)
- Surface:
  - Light mode: `#f8fafc` (浅灰)
  - Dark mode: `#1e293b` (深灰)
- Text:
  - Primary: `#0f172a` / `#f8fafc`
  - Secondary: `#64748b` / `#94a3b8`

**间距系统：**
- 使用 Tailwind 默认的 4px 基数
- 通用间距：`0.5rem` (8px), `1rem` (16px), `1.5rem` (24px), `2rem` (32px), `3rem` (48px)

**圆角系统：**
- Small: `0.375rem` (6px)
- Medium: `0.5rem` (8px) - 卡片默认
- Large: `0.75rem` (12px)
- Full: `9999px` - 圆形元素

**阴影系统：**
- Small: 轻微阴影
- Medium: 卡片默认阴影
- Large: 悬停时阴影

### 响应式断点
- Mobile: < 640px (默认单列)
- Tablet: 640px - 1024px (2-3列)
- Desktop: > 1024px (4列)

### 暗色模式
- 使用 `darkMode: 'class'` 配置
- 默认跟随系统设置
- 用户可手动切换

---

## 组件库架构

### 目录结构

```
src/
├── components/
│   ├── ui/              # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   └── Rating.tsx   # 评分组件
│   ├── layout/          # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Container.tsx
│   └── course/          # 业务组件
│       ├── CourseCard.tsx
│       ├── CourseList.tsx
│       ├── CategoryFilter.tsx
│       ├── ChapterCard.tsx
│       ├── ReviewCard.tsx
│       └── InstructorCard.tsx
├── lib/
│   ├── utils.ts         # 工具函数
│   └── supabase.ts      # Supabase 客户端
└── styles/
    └── globals.css       # 全局样式
```

### 关键组件

**1. Button 组件：**
- Variants: `primary`, `secondary`, `outline`, `ghost`
- Sizes: `sm`, `md`, `lg`
- States: `default`, `hover`, `disabled`, `loading`

**2. Card 组件：**
- 结构：图片区 + 标签区 + 内容区 + 底部操作区
- 交互：hover 时阴影加深，图片轻微放大
- 响应式：移动端单列，平板双列，桌面四列

**3. Badge 组件：**
- Variants: `hot`, `internship`, `new` 等
- 颜色：使用 accent (#f97316) 作为主要标签色

**4. Navigation 组件：**
- 底部导航栏（移动端）
- 顶部导航栏（桌面端）
- 选中状态：primary 蓝色高亮

---

## 页面结构与路由

### 页面列表

1. **首页 (/)**
   - Hero 区域：用户信息 + 欢迎
   - 搜索栏
   - 分类标签（全部课程、医疗急救、兽医护理、美容造型、行为训练）
   - 热门课程卡片网格
   - 学习进度卡片

2. **课程详情页 (/courses/:id)**
   - 课程信息（标题、描述、类别标签、机构、讲师）
   - 课程章节列表
   - 课程评价/评论（购买过的学员可评论和查看）
   - 相关课程推荐（同类别、同讲师）
   - 报名/购买按钮

3. **我的课程页 (/my-courses)**
   - 正在学习列表
   - 已完成课程
   - 学习进度追踪（章节进度）
   - 学习证书查看

4. **探索页 (/explore)**
   - 课程浏览
   - 按类别筛选
   - 课程搜索（标题搜索）

5. **我的收藏页 (/favorites)**
   - 收藏的课程列表
   - 取消收藏功能

6. **讲师列表页 (/instructors)**
   - 所有讲师卡片列表

7. **讲师详情页 (/instructors/:id)**
   - 讲师头像、姓名、简介、资历背景
   - 讲师的所有课程列表

8. **个人中心 (/profile)**
   - 基本资料编辑（头像、姓名、邮箱、电话）
   - 学习统计（学习时长、完成课程数）
   - 订单历史（所有购买订单）
   - 修改密码
   - 主题切换（亮色/暗色模式）

9. **MBTI 测验页 (/mbti-quiz)**
   - 测验说明
   - 问卷题目（60-90 题，每页 5-10 题）
   - 5 个选项的评分条（十分同意、同意、一般、不同意、十分不同意）
   - 进度指示器

10. **MBTI 结果页 (/mbti-result)**
    - 显示用户的 MBTI 类型
    - 类型描述和特征
    - 四个维度得分可视化
    - 推荐课程列表
    - "重新测验"按钮

11. **后台管理页 (/admin)** - 仅管理员
    - 课程管理
    - 讲师管理
    - 课程章节管理
    - MBTI 题目管理
    - MBTI 推荐配置（每个类型对应课程）
    - 课程评价/评论查看（学员评价只在后台看）
    - 用户数据查看

### 路由方案
- 使用 Next.js 14 App Router

### 状态管理
- 本地状态：React hooks (`useState`, `useEffect`)
- 全局状态：Context API（用户认证、主题切换）
- 服务器状态：React Query 或 SWR（课程数据、API 请求）

---

## 数据模型

### 课程相关表

```sql
-- 讲师表 (instructors)
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT, -- 简介
  qualification TEXT, -- 资历背景
  created_at TIMESTAMP DEFAULT NOW()
);

-- 课程表 (courses)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 医疗急救/兽医护理/美容造型/行为训练
  course_type TEXT NOT NULL, -- online/in-person/internship/mixed (线上/实体/外出实习/混合)
  price NUMERIC NOT NULL,
  institution TEXT NOT NULL, -- HKU SPACE, SPCA, PolyMind Academy
  instructor_id UUID REFERENCES instructors(id),
  image_url TEXT,
  start_date TIMESTAMP, -- 开课日期（实体和外出实习课程）
  is_hot BOOLEAN DEFAULT false,
  is_internship BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 课程章节表 (course_chapters)
CREATE TABLE course_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 章节内容表 (chapter_contents)
CREATE TABLE chapter_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES course_chapters(id),
  content_type TEXT NOT NULL, -- video/text/pdf/link
  title TEXT NOT NULL,
  content_url TEXT, -- 视频、PDF等文件的URL
  content_data TEXT, -- 图文内容（JSON格式）
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 用户表 (users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'system', -- light/dark/system
  created_at TIMESTAMP DEFAULT NOW()
);

-- 学习进度表 (enrollments)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- 章节学习进度表 (chapter_progress)
CREATE TABLE chapter_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id),
  chapter_id UUID REFERENCES course_chapters(id),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  UNIQUE(enrollment_id, chapter_id)
);

-- 课程收藏表 (course_favorites)
CREATE TABLE course_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 课程评价表 (course_reviews)
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 订单表 (orders)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'HKD',
  status TEXT NOT NULL, -- pending/paid/failed/cancelled
  payment_method TEXT, -- credit_card/paypal
  payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);

-- 证书表 (certificates)
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
```

### MBTI 相关表

```sql
-- MBTI 测验题目表 (mbti_questions)
CREATE TABLE mbti_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  dimension TEXT NOT NULL, -- E/I, S/N, T/F, J/P
  direction TEXT NOT NULL, -- positive/negative (影响得分计算)
  order_index INTEGER NOT NULL
);

-- MBTI 用户答案表 (mbti_user_answers)
CREATE TABLE mbti_user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  question_id UUID REFERENCES mbti_questions(id),
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- MBTI 测验结果表 (mbti_results)
CREATE TABLE mbti_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  e_score INTEGER DEFAULT 0,
  i_score INTEGER DEFAULT 0,
  s_score INTEGER DEFAULT 0,
  n_score INTEGER DEFAULT 0,
  t_score INTEGER DEFAULT 0,
  f_score INTEGER DEFAULT 0,
  j_score INTEGER DEFAULT 0,
  p_score INTEGER DEFAULT 0,
  mbti_type TEXT NOT NULL, -- 如 INTJ
  completed_at TIMESTAMP DEFAULT NOW()
);

-- MBTI 推荐配置表 (mbti_recommendations)
CREATE TABLE mbti_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mbti_type TEXT UNIQUE NOT NULL, -- 16种类型
  recommended_courses JSONB NOT NULL, -- 课程ID数组
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 课程功能

### 课程类型
- **线上课程**: 随时学习，无固定开课时间
- **实体课程**: 面对面授课，有固定开课日期
- **外出实习**: 现场实践，有特定时间段
- **混合课程**: 线上 + 实体组合

### 课程章节结构
- 每个课程有多个章节/模块
- 章节顺序固定，按顺序学习
- 章节内容类型多样化：视频、图文、PDF文档、链接等
- 学完一个章节自动更新进度
- 学员可以随时回看已完成的章节

### 学习进度追踪
- 整体课程进度（0-100%）
- 章节完成状态
- 学习时长统计
- 开始/完成日期记录

### 课程搜索与筛选
- 按课程标题搜索
- 按类别筛选（医疗急救、兽医护理、美容造型、行为训练）
- 热门课程推荐
- 相关课程推荐（同类别、同讲师）

### 课程收藏
- 学员可以收藏喜欢的课程
- 在"我的收藏"页面查看
- 可以取消收藏

### 课程评价/评论
- 只有购买过的学员可以评论和查看
- 评分：1-5 星
- 文字评论
- 评价显示在课程详情页
- 学员评价只在后台查看（管理员用）

### 开课前提醒
- 实体和外出实习课程有开课时间
- 开课前发送提醒通知给已报名学员
- 提醒方式：系统通知/邮件（待定）

### 学习证书
- 学员完成课程所有章节后自动颁发
- 电子证书格式
- 唯一证书编号
- 可在"我的课程"页面查看和下载

---

## 讲师功能

### 讲师信息
- 头像
- 姓名
- 简介
- 资历背景

### 讲师页面
- 讲师详情页（`/instructors/:id`）
- 显示讲师基本信息
- 列出该讲师的所有课程

---

## 用户中心功能

### 基本资料
- 头像上传/更改
- 姓名编辑
- 邮箱编辑
- 电话编辑

### 学习统计
- 学习时长统计
- 完成课程数
- 进行中课程数

### 订单历史
- 显示所有购买订单
- 订单状态查看
- 订单详情查看

### 修改密码
- 当前密码验证
- 新密码设置
- 密码强度提示

### 主题切换
- 亮色模式
- 暗色模式
- 跟随系统（默认）

---

## MBTI 测验功能

### 测验设计
- **题量**: 60-90 题
- **选项**: 5 个选项（李克特量表）
  - 十分同意 (5分)
  - 同意 (4分)
  - 一般 (3分)
  - 不同意 (2分)
  - 十分不同意 (1分)
- **题目组织**: 每个维度 15-23 题
- **显示方式**: 每页 5-10 题

### 评分与计算逻辑

1. **题目维度**:
   - E (外向) / I (内向)
   - S (感觉) / N (直觉)
   - T (思考) / F (情感)
   - J (判断) / P (感知)

2. **得分计算**:
   - 正向题目：直接累加得分
   - 反向题目：`6 - 得分`（反转）
   - 比较每个维度的两个字母得分，选择得分高的
   - 组合成 4 字母的 MBTI 类型

3. **示例**:
   ```
   E 得分: 45, I 得分: 30 → E
   S 得分: 38, N 得分: 42 → N
   T 得分: 40, F 得分: 35 → T
   J 得分: 48, P 得分: 25 → J
   结果: ENTJ
   ```

### 功能特性
- **可选功能**: 用户主动访问测验页
- **结果展示**: 显示类型、描述、四个维度得分、推荐课程
- **推荐逻辑**: 后台手动配置每个 MBTI 类型对应课程
- **重新测验**: 用户可随时重新测验，更新结果

---

## 支付集成

### 支付方案
- **推荐**: Stripe（支持信用卡）
- **备选**: PayPal, PayerMax（香港本地）

### 支付流程
```
课程详情页 → 点击"立即报名" → 确认订单 → 支付页面 → 支付成功 → 我的课程
```

### 订单状态
- `pending`: 等待支付
- `paid`: 已支付
- `failed`: 支付失败
- `cancelled`: 已取消

### 支付触发时机
- 线上课程：购买后立即访问
- 实体/外出实习课程：购买后等待开课，开课前提醒
- 混合课程：购买后立即开始线上部分，实体部分等待开课

### 测试卡号（Stripe）
- 成功: `4242 4242 4242 4242`
- 失败: `4000 0000 0000 0002`
- 需要验证: `4000 0025 0000 3155`

### 安全性
- 敏感信息加密
- PCI DSS 合规
- 后端验证支付金额

### 支付方案
- **推荐**: Stripe（支持信用卡）
- **备选**: PayPal, PayerMax（香港本地）

### 支付流程
```
课程详情页 → 点击"立即报名" → 确认订单 → 支付页面 → 支付成功 → 课程列表
```

### 订单状态
- `pending`: 等待支付
- `paid`: 已支付
- `failed`: 支付失败
- `cancelled`: 已取消

### 测试卡号（Stripe）
- 成功: `4242 4242 4242 4242`
- 失败: `4000 0000 0000 0002`
- 需要验证: `4000 0025 0000 3155`

### 安全性
- 敏感信息加密
- PCI DSS 合规
- 后端验证支付金额

---

## 错误处理

### 错误分类与处理

**1. API 错误**
- 401/403: 跳转登录页，显示友好提示
- 404: 显示"未找到"页面
- 500: 显示"系统维护中"
- 网络超时: 重试 3 次

**2. 表单验证错误**
- 实时验证：输入时即时反馈
- 提交验证：提交前全面检查
- 错误提示：红色边框 + 错误文字
- MBTI 测验：确保所有题目都回答

**3. 加载状态**
- 页面加载：全屏骨架屏
- 按钮加载：禁用 + 加载动画
- 列表加载：卡片骨架屏
- 图片加载：灰色占位 + 淡入动画

**4. 用户反馈**
- Toast 通知：成功/错误/警告/信息
- 全局错误边界
- 错误日志记录

---

## 技术栈

### 前端
- **框架**: React 19 with Vite
- **语言**: TypeScript
- **样式**: Tailwind CSS (v3+ with plugins)
- **路由**: Next.js 14 App Router
- **部署**: Vercel

### 后端
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth

### 测试
- **单元测试**: Jest + React Testing Library
- **E2E 测试**: Playwright
- **视觉回归**: Percy (可选)

---

## 开发规范

### 代码风格
- 详见 `AGENTS.md` 文件
- TypeScript 严格模式
- ESLint + Prettier
- Tailwind CSS 工具类优先

### 提交信息格式
```
<type>(<scope>): <subject>

<body>
```

类型: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 开发命令

```bash
npm install              # 安装依赖
npm run dev             # 开发服务器
npm run build           # 生产构建
npm run preview         # 预览构建
npm run lint            # ESLint
npm run type-check      # TypeScript 类型检查
npm test                # 运行测试
npm run test:watch      # 测试监视模式
```

---

## 开发阶段规划

### 阶段 1: 基础架构
- [ ] 项目初始化（Next.js + TypeScript + Tailwind）
- [ ] Supabase 配置与连接
- [ ] 设计系统配置（颜色、间距、圆角、阴影）
- [ ] 基础 UI 组件库（Button, Card, Badge, Input, Avatar, Rating）

### 阶段 2: 核心课程功能
- [ ] 用户认证系统
- [ ] 课程相关页面（首页、课程详情、课程列表、探索页）
- [ ] 讲师相关页面（讲师列表、讲师详情）
- [ ] 搜索与筛选功能（标题搜索、类别筛选）
- [ ] 课程章节结构与内容管理
- [ ] 学习进度追踪（整体进度 + 章节进度）
- [ ] 课程收藏功能
- [ ] 课程评价/评论功能
- [ ] 相关课程推荐 + 热门课程推荐
- [ ] 学习证书功能

### 阶段 3: MBTI 功能
- [ ] MBTI 测验页面与流程
- [ ] MBTI 评分计算逻辑
- [ ] MBTI 结果页面与推荐系统
- [ ] 后台 MBTI 配置管理

### 阶段 4: 支付与用户中心
- [ ] Stripe 集成
- [ ] 订单系统
- [ ] 支付流程与错误处理
- [ ] 购买后的课程访问
- [ ] 用户中心（资料编辑、学习统计、订单历史、修改密码）
- [ ] 主题切换功能
- [ ] 开课前提醒功能

### 阶段 5: 后台管理
- [ ] 课程管理（新增、编辑、删除）
- [ ] 讲师管理
- [ ] 课程章节管理
- [ ] 课程评价/评论查看
- [ ] 用户数据查看
- [ ] MBTI 题目管理
- [ ] MBTI 推荐配置

### 阶段 6: 优化与测试
- [ ] 响应式优化
- [ ] 暗色模式完善
- [ ] 性能优化
- [ ] 单元测试
- [ ] E2E 测试
- [ ] 支付流程测试
- [ ] MBTI 计算逻辑测试
- [ ] 上线部署

---

## 参考资料

- 参考网站: https://couse-mvp.vercel.app/
- MBTI 16型人格理论
- Tailwind CSS 文档
- Next.js 文档
- Supabase 文档
- Stripe 文档
