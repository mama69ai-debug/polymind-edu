# PolyMind 系統規劃文件（LLM‑First MVP）

> 本文件是 **PolyMind 教育平台** 的「唯一權威規劃文件」。
> 所有開發（不論人寫或 LLM 寫）**必須以此文件為準**。
>
> 核心假設：
> * 因此設計重點不是「功能齊全」，而是 **可控、一致、可逐步擴展**

---

## 一、產品定位（Product Definition）

### 1.1 產品是什麼？

PolyMind 是一個 **專業AI推動的教育平台**，提供：

* 結構化課程（線上觀看及購買課程，實體課程）
* 可付費學習體驗
* 以「人格／特質」為輔助的課程推薦

**一句話定位：**

> 幫助學員用最適合自己的方式，學到可落地的專業技能。

---

### 1.2 MVP 不做什麼（非常重要）

以下內容 **不屬於 MVP**，即使技術上很容易：

* 社群功能（follow / like / comment threads）
* 即時聊天
* 高級數據分析
* 完整 MBTI 心理測評（60–90 題）
* 多角色權限系統

**原則：**

> 任何不影響「賣到第一門課」的功能，一律延後。

---

## 二、MVP 核心驗證目標

MVP 只驗證 3 件事：

1. 用戶是否願意 **註冊並瀏覽課程**
2. 用戶是否願意 **為課程付費**
3. 簡化推薦（人格 / 類型）是否 **提升轉化或留存**

---

## 三、系統總體架構（High Level）

### 3.1 技術棧（已鎖定）

* Frontend：Next.js 14 (App Router)
* Language：TypeScript (strict)
* Styling：Tailwind CSS v4 + Design Tokens
* Package Manager：npm
* Backend：Supabase (PostgreSQL + Auth)
* Payment：Stripe

> ⚠️ 技術棧一旦鎖定，LLM 不可自行替換。

---

### 3.2 LLM‑First 開發原則（最關鍵）

系統設計 **必須適合 LLM 長期生成**：

* 所有 UI 來自 Design Tokens（禁止 raw class）
* 所有頁面使用固定 Layout Skeleton
* 功能以「垂直切片（Vertical Slice）」方式交付
* 每一個切片都有明確驗收標準（Definition of Done）

---

## 四、系統分層設計（為 LLM 而設）

### 4.1 Layer 0：護欄層（不可變）

> 這一層 **先於所有功能存在**

* Design Tokens（CSS variables + 語義 class）
* Layout Skeleton Components

  * PageLayout
  * PageHeader
  * Section
  * EmptyState
* ESLint Gate（禁止 raw button/input）

任何功能若試圖繞過此層，必須拒絕合併。

---

### 4.2 Layer 1：UI Primitives（低頻變動）

* Button
* Input
* Card
* Badge（後期）

> 原則：
>
> * Page 不得直接使用原生 HTML 控件
> * 所有互動元件必須來自 primitives

---

### 4.3 Layer 2：Domain Components（可擴展）

* CourseCard
* CourseList
* ChapterList
* InstructorCard

> 此層允許 LLM 生成，但必須使用 Layer 0 + 1。

---

## 五、MVP 功能範圍（Scope Lock）

### 5.1 P0（必須完成）

* 使用者註冊 / 登入（Supabase Auth）
* 課程列表頁
* 課程詳情頁
* Stripe 支付（信用卡）
* 我的課程頁
* 基礎學習頁（章節顯示）

---

### 5.2 P1（驗證價值）

* 學習進度（粗略百分比）
* 簡化人格測驗（12–20 題）
* 規則型推薦（人格 → 課程）

---

### 5.3 明確排除（P2 之後）

* 收藏
* 評價系統
* 證書
* 深色模式精修
* 通知系統

---

## 六、核心使用者流程（User Flows）

### Flow 1：第一次購課

訪問首頁 → 瀏覽課程 → 查看詳情 → 註冊 / 登入 → 付款 → 進入我的課程

---

### Flow 2：學習流程

我的課程 → 選擇課程 → 查看章節 → 打開內容 → 完成一章

---

## 七、資料模型原則（簡化版）

> 資料表設計遵守：**先能用，再完整**

MVP 僅需要：

* users
* courses
* instructors
* enrollments
* orders
* course_chapters

其餘表（評價、證書、MBTI 詳表）延後。

---

## 八、開發節奏（Execution Plan）

### Phase 0：護欄（已完成 / 進行中）

* Design Tokens
* Layout Skeleton

### Phase 1：靜態課程體驗

* 課程列表 / 詳情（假資料）

### Phase 2：資料接入

* Supabase schema
* 課程真資料

### Phase 3：交易閉環

* Stripe Checkout
* Webhook → enrollments

### Phase 4：學習體驗

* 章節頁
* 基礎進度

---

## 九、LLM 使用規範（寫給未來的你）

每一次叫 LLM 寫 code，必須提供：

1. 本 Planning Doc（或其摘要）
2. Scope（允許改哪些檔案）
3. Non‑Goals（明確不做什麼）
4. Acceptance Criteria（可驗收）

如果 LLM 嘗試「順便幫你優化 / 重構 / 升級技術」，一律拒絕。

---

## 十、一句話總結（最重要）

> **PolyMind 不是寫出來的，是被「約束」出來的。**
>
> 寫得慢一點沒關係，
> 只要確保系統永遠不會失控。

---

**This document is the source of truth.**
