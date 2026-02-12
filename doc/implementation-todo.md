# PolyMind 唯一施工清單（Implementation To-Do）

> **Source of Truth**：`doc/system-planning.md`
> 本文件是後續所有開發的唯一施工清單。任何工作都必須對應到此清單中的某個 Step。
> 每次開發前必須提供：Scope / Non-Goals / Acceptance Criteria

---

## Phase 0：護欄層（Layer 0 + Layer 1）

### 0.1 Design Tokens + Layout Skeleton
- [x] Design Tokens（CSS variables + 語義 class）
- [x] Layout Skeleton：PageLayout / PageHeader / Section / EmptyState

### 0.2 UI Primitives
- [x] Button（variant / size / loading / disabled / icon）
- [x] Input（label / hint / error / disabled）
- [x] Card / CardHeader / CardContent / CardFooter
- [ ] Badge（後期）

### 0.3 ESLint Gate
- [x] 禁止 page 內直接使用原生 `<button>` / `<input>`

---

## Phase 1：靜態課程體驗（假資料）

### 1.1 TypeScript 型別定義
- [x] `src/types/` 建立：Course / Instructor / Chapter 型別
- [x] 假資料檔案：`src/data/mock-courses.ts`

### 1.2 Domain Components（Layer 2，必須使用 Layer 0 + 1）
- [x] CourseCard：封面 / 標題 / 講師 / 價格 / CTA
- [x] CourseList：列表容器 + 空狀態
- [x] InstructorCard：頭像 / 名稱 / 簡介
- [x] ChapterList：章節列表 + 序號 + 標題

### 1.3 頁面路由（App Router）
- [x] `/courses` — 課程列表頁
- [x] `/courses/[slug]` — 課程詳情頁（含講師 + 章節）
- [x] `/my-courses` — 我的課程頁（假資料）
- [x] `/courses/[slug]/learn` — 學習頁（章節內容占位）

### 1.4 首頁改造
- [x] `src/app/page.tsx` 改為產品首頁（課程精選 + CTA）

### 1.5 導航
- [x] 全站 Navbar（Logo / 課程 / 我的課程 / 登入按鈕占位）

### Phase 1 驗收
- [x] 可瀏覽課程列表 → 進入詳情 → 看到章節 → 進入學習頁
- [x] 所有頁面使用 PageLayout 句型
- [x] 所有互動元件來自 UI Primitives
- [x] 無任何業務外延（社群 / 聊天 / 評價 / 收藏）

---

## Phase 2：資料接入（Supabase）

### 2.1 DB Schema（最小可用）
- [x] `instructors`：id / name / avatar_url / bio / created_at
- [x] `courses`：id / slug / title / description / cover_url / price / instructor_id / status / created_at
- [x] `course_chapters`：id / course_id / title / content / sort_order / created_at
- [x] `orders`：id / user_id / course_id / stripe_session_id / status / amount / created_at
- [x] `enrollments`：id / user_id / course_id / enrolled_at
- [x] `users`：使用 Supabase Auth 內建；如需 profile 欄位再補充

### 2.2 DB 關聯與約束
- [x] courses.instructor_id → instructors.id
- [x] course_chapters.course_id → courses.id
- [x] orders.user_id → auth.users.id
- [x] orders.course_id → courses.id
- [x] enrollments：user_id + course_id 唯一性約束
- [x] enrollments.user_id → auth.users.id
- [x] enrollments.course_id → courses.id

### 2.3 RLS（Row Level Security）
- [x] courses / instructors：公開可讀（已發布課程）
- [x] course_chapters：僅已 enroll 的使用者可讀
- [x] orders：僅本人可讀
- [x] enrollments：僅本人可讀
- [x] 寫入：由 server 端 / webhook 執行（service_role）

### 2.4 Supabase Client 設定
- [x] 安裝 `@supabase/supabase-js`
- [x] `src/lib/supabase/client.ts`（瀏覽器端）
- [x] `src/lib/supabase/server.ts`（Server Component / Route Handler）
- [x] 環境變數：`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.5 資料讀取（替換假資料）
- [x] 課程列表：Server Component 從 DB 讀取
- [x] 課程詳情：含 instructor + chapters
- [x] 我的課程：根據 enrollments 讀取

### 2.6 Auth（註冊 / 登入）
- [x] 登入頁 `/auth/login`
- [x] 註冊頁 `/auth/register`
- [x] Auth 狀態管理（session / middleware 保護路由）
- [x] Navbar 根據登入狀態切換顯示

### 2.7 URL 安全（Slug）
- [x] `courses` 新增 `slug` 欄位（唯一索引，允許 NULL）：`003_add_course_slug.sql`
- [x] DB trigger 自動從 title 產生 slug：`004_courses_slug_trigger.sql`
- [x] 前端路由改為 `/courses/[slug]`（取代 `/courses/[id]`）
- [x] 所有課程連結改用 `course.slug`
- [x] Course 型別補上 `slug` 屬性

### Phase 2 驗收
- [x] 假資料頁面全部替換為真資料
- [x] 未登入可瀏覽公開課程內容
- [x] 登入/註冊流程可正常完成
- [x] 路由與 UI 句型不變

---

## Phase 3：交易閉環（Stripe）

### 3.1 Stripe 設定
- [x] 安裝 `stripe` + `@stripe/stripe-js`
- [x] 環境變數：`STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET`
- [x] Stripe lib：`src/lib/stripe/client.ts` / `src/lib/stripe/server.ts`

### 3.2 Checkout 流程
- [x] 課程詳情頁「購買」按鈕（已登入才可觸發）
- [x] PurchaseButton 客戶端組件（處理購買流程）
- [x] API Route：建立 Stripe Checkout Session (`/api/checkout`)
- [x] 成功頁 (`/checkout/success`)
- [x] 取消頁（回到課程詳情頁）

### 3.3 Webhook
- [x] API Route：接收 `checkout.session.completed` (`/api/webhooks/stripe`)
- [x] 寫入 orders（標記 paid）
- [x] 建立 enrollments（user 獲得課程權限）
- [x] 冪等處理：同一事件不重複入庫

### 3.4 權限控制
- [x] 學習頁：驗證 enrollment 後才能進入
- [x] 未購買顯示「購買」提示
- [x] 未登入重定向到登入頁

### Phase 3 驗收
- [ ] 完整流程：註冊 → 登入 → 瀏覽 → 付款 → 我的課程出現該課程
- [ ] 付款後可直接進入學習頁
- [ ] 失敗/取消不建立 enrollment

### 環境變數設定
- [x] 詳細設定說明：`doc/stripe-setup.md`

---

## Phase 4：學習體驗（章節 + 進度）

### 4.1 章節體驗
- [ ] 章節列表可選章
- [ ] 章節內容顯示（文字 / 影片連結占位）
- [ ] 「完成本章」操作按鈕

### 4.2 進度追蹤
- [ ] DB：chapter_progress 表（user_id / chapter_id / completed_at）
- [ ] 計算進度：已完成章節 / 總章節數
- [ ] 我的課程頁顯示進度百分比
- [ ] 學習頁章節列表標示已完成

### Phase 4 驗收
- [ ] 用戶可完成一章並看到進度更新
- [ ] 未購買無法進入完整學習內容
- [ ] 進度在我的課程頁正確顯示

---

## P1：人格測驗 + 推薦（驗證價值）

### P1.1 簡化人格測驗（12-20 題）
- [ ] 題庫與結果類型設計
- [ ] 測驗頁流程：開始 → 作答 → 結果
- [ ] DB：user_personality 表（user_id / type / completed_at）

### P1.2 規則型推薦（人格 → 課程）
- [ ] 推薦規則定義（可配置）
- [ ] 課程列表/首頁展示推薦區塊

### P1 驗收
- [ ] 完成測驗後能看到推薦課程
- [ ] 可追蹤推薦是否提高點擊/購買

---

## Non-Goals（任何階段都不做）

- 社群功能（follow / like / comment）
- 即時聊天
- 高級數據分析儀表板
- 完整 MBTI（60-90 題）
- 多角色權限系統
- 收藏 / 評價 / 證書 / 深色模式精修 / 通知系統
