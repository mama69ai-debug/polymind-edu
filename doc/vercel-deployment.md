# PolyMind 部署到 Vercel 指南

> 本指南說明如何將 PolyMind 教育平台部署到 Vercel，包括環境變數設定和 Stripe Webhook 配置。

---

## 前置準備

### 1. 確保本地測試通過

在部署前，請先確認：
- ✅ 本地開發環境正常運作
- ✅ Supabase 連線正常
- ✅ Stripe 測試流程通過（至少完成一次測試購買）

### 2. 準備必要資訊

- GitHub 帳號（用於連結程式碼倉庫）
- Vercel 帳號（可用 GitHub 登入）
- Supabase 專案憑證
- Stripe 測試金鑰（或正式金鑰）

---

## 部署步驟

### 步驟 1：推送程式碼到 GitHub

如果還沒有推送到 GitHub：

```powershell
# 初始化 git（如果還沒有）
git init

# 加入所有檔案
git add .

# 建立 commit
git commit -m "feat: complete Phase 3 - Stripe integration"

# 在 GitHub 建立 repository 後，連結並推送
git remote add origin https://github.com/your-username/polymind-edu.git
git branch -M main
git push -u origin main
```

**重要：** 確認 `.env.local` 已經在 `.gitignore` 中，不要把機密資訊推送到 GitHub！

### 步驟 2：匯入專案到 Vercel

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點選 **「Add New...」** → **「Project」**
3. 選擇 **「Import Git Repository」**
4. 選擇你的 `polymind-edu` 倉庫
5. 點選 **「Import」**

### 步驟 3：設定專案

Vercel 會自動偵測到這是 Next.js 專案，保持預設設定：

- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 步驟 4：設定環境變數

在部署前，點選 **「Environment Variables」** 並加入以下變數：

#### Supabase 環境變數

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Stripe 環境變數（測試模式）

```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=（先留空，部署後再設定）
```

#### 網站 URL

```
NEXT_PUBLIC_SITE_URL=（先留空，部署後 Vercel 會給你 URL）
```

**注意：** 
- 可以為不同環境（Production / Preview / Development）設定不同的值
- 建議先用 Stripe **測試金鑰**部署，確認無誤後再換正式金鑰

### 步驟 5：部署

1. 點選 **「Deploy」**
2. 等待建置完成（約 2-5 分鐘）
3. 部署成功後，Vercel 會給你一個 URL，例如：
   ```
   https://polymind-edu-xxxxx.vercel.app
   ```

---

## Stripe Webhook 設定（重要！）

部署完成後，你需要設定 Stripe Webhook 才能正常接收付款通知。

### 步驟 1：取得 Vercel 部署 URL

從 Vercel Dashboard 複製你的專案 URL：
```
https://polymind-edu-xxxxx.vercel.app
```

### 步驟 2：在 Stripe Dashboard 建立 Webhook

1. 登入 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 切換到「測試模式」（或正式模式，取決於你使用的金鑰）
3. 點選「開發者」→「Webhooks」
4. 點選「+ 新增端點」

**端點 URL：**
```
https://polymind-edu-xxxxx.vercel.app/api/webhooks/stripe
```

**監聽事件：**
- 勾選 `checkout.session.completed`

5. 點選「新增端點」

### 步驟 3：複製 Webhook Signing Secret

1. 在剛建立的 webhook 端點詳情頁
2. 找到「Signing secret」區塊
3. 點選「顯示」
4. 複製 `whsec_xxxxxxxxxxxxxxxxxxxxx`

### 步驟 4：更新 Vercel 環境變數

1. 回到 Vercel Dashboard
2. 進入專案設定 → **「Environment Variables」**
3. 編輯或新增：
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```
4. 同時更新：
   ```
   NEXT_PUBLIC_SITE_URL=https://polymind-edu-xxxxx.vercel.app
   ```

### 步驟 5：重新部署

環境變數更新後，需要重新部署才會生效：

1. 在 Vercel Dashboard → 「Deployments」
2. 點選最新的部署 → 右上角「...」→ **「Redeploy」**
3. 勾選「Use existing Build Cache」（可選）
4. 點選 **「Redeploy」**

---

## Supabase 設定檢查

### 1. 更新 Supabase Auth 重定向 URL

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇專案 → **「Authentication」** → **「URL Configuration」**
3. 在 **「Redirect URLs」** 加入：
   ```
   https://polymind-edu-xxxxx.vercel.app/auth/callback
   https://polymind-edu-xxxxx.vercel.app/*
   ```

### 2. 確認 RLS 政策

確保以下表的 RLS 政策正確設定：
- `courses` / `instructors`：公開可讀
- `course_chapters`：僅已 enroll 的使用者可讀
- `enrollments` / `orders`：僅本人可讀

### 3. 網路白名單（選用）

如果你的 Supabase 有設定 IP 白名單，需要允許 Vercel 的 IP 範圍。

---

## 測試部署結果

### 1. 基本功能測試

訪問你的 Vercel URL：
```
https://polymind-edu-xxxxx.vercel.app
```

檢查：
- ✅ 首頁正常顯示
- ✅ 課程列表可以載入
- ✅ 課程詳情頁正常
- ✅ 登入/註冊功能正常

### 2. 完整購買流程測試

1. 註冊/登入帳號
2. 選擇一門課程
3. 點選「購買課程」
4. 使用測試卡號完成付款：`4242 4242 4242 4242`
5. 確認跳轉到成功頁
6. 檢查「我的課程」是否出現該課程
7. 嘗試進入學習頁

### 3. Webhook 測試

在 Stripe Dashboard → Webhooks → 你的端點，檢查：
- ✅ 最近的請求顯示「成功」（綠色勾勾）
- ✅ Response code 是 200
- ✅ 沒有錯誤訊息

如果看到錯誤，點選查看詳情，可能是：
- Webhook secret 設定錯誤
- 環境變數未生效（記得重新部署）
- Supabase service role key 錯誤

---

## 環境變數完整清單

部署到 Vercel 需要的所有環境變數：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (測試模式)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# Site URL
NEXT_PUBLIC_SITE_URL=https://polymind-edu-xxxxx.vercel.app
```

---

## 自動部署設定

Vercel 預設會自動部署：
- **main/master 分支**的推送 → Production 環境
- **其他分支**的推送 → Preview 環境
- **Pull Request** → Preview 環境

### 建議工作流程

1. **開發新功能**：在 `dev` 或 `feature/*` 分支
2. **推送後**：Vercel 自動建立 Preview 部署
3. **測試 Preview**：確認功能正常
4. **合併到 main**：自動部署到 Production

---

## 從測試模式切換到正式模式

當你準備好接受真實付款時：

### 步驟 1：切換 Stripe 金鑰

在 Vercel 環境變數中，將測試金鑰換成正式金鑰：
```
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
```

### 步驟 2：建立正式環境 Webhook

1. 在 Stripe Dashboard 切換到「正式模式」
2. 重新建立 webhook 端點（URL 相同）
3. 更新 Vercel 的 `STRIPE_WEBHOOK_SECRET`

### 步驟 3：重新部署

重新部署後，系統就會使用正式金鑰處理真實交易。

---

## 常見問題

### Q1: 部署後看到 500 錯誤

**可能原因：**
- 環境變數未設定或設定錯誤
- Supabase 連線失敗

**解決方法：**
1. 檢查 Vercel Dashboard → Functions → Logs
2. 確認所有環境變數都已設定
3. 測試 Supabase 連線是否正常

### Q2: Webhook 一直顯示失敗

**可能原因：**
- `STRIPE_WEBHOOK_SECRET` 錯誤
- 環境變數更新後沒有重新部署

**解決方法：**
1. 確認 webhook secret 正確複製
2. 更新環境變數後一定要重新部署
3. 在 Stripe Dashboard 查看詳細錯誤訊息

### Q3: 付款後沒有建立 enrollment

**可能原因：**
- Webhook 失敗（參考 Q2）
- `SUPABASE_SERVICE_ROLE_KEY` 錯誤或權限不足

**解決方法：**
1. 檢查 Stripe webhook 請求狀態
2. 確認 Supabase service role key 正確
3. 查看 Vercel Functions Logs 錯誤訊息

### Q4: 登入後沒有正確重定向

**可能原因：**
- Supabase Auth 重定向 URL 未設定

**解決方法：**
1. 在 Supabase Dashboard 設定 Redirect URLs
2. 加入你的 Vercel domain

### Q5: 如何查看伺服器錯誤日誌？

在 Vercel Dashboard：
1. 選擇專案
2. 點選「Logs」或「Functions」
3. 可以即時查看伺服器端錯誤

---

## 進階：自訂網域

### 步驟 1：在 Vercel 加入網域

1. Vercel Dashboard → 專案設定 → **「Domains」**
2. 輸入你的網域，例如：`polymind.com`
3. Vercel 會提供 DNS 設定指示

### 步驟 2：設定 DNS

在你的網域註冊商設定 DNS 記錄：
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 步驟 3：更新所有 URL 設定

- Vercel 環境變數：`NEXT_PUBLIC_SITE_URL=https://polymind.com`
- Stripe Webhook URL：`https://polymind.com/api/webhooks/stripe`
- Supabase Redirect URLs：加入新網域

### 步驟 4：重新部署

更新環境變數後重新部署。

---

## 效能優化建議

### 1. 啟用 Vercel Analytics（選用）

```bash
npm install @vercel/analytics
```

在 `src/app/layout.tsx` 加入：
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. 啟用 Edge Runtime（選用）

對於不需要 Node.js runtime 的 API Route，可以使用 Edge Runtime：

```tsx
// src/app/api/some-route/route.ts
export const runtime = 'edge';
```

**注意：** Stripe webhook 處理需要使用 Node.js runtime（預設），不要改成 edge。

### 3. 圖片優化

確保所有圖片都使用 Next.js `<Image>` 元件，Vercel 會自動優化。

---

## 監控和維護

### 建議監控項目

1. **Vercel Analytics**：流量、效能
2. **Stripe Dashboard**：交易狀況、webhook 健康度
3. **Supabase Dashboard**：資料庫連線、查詢效能
4. **Vercel Functions Logs**：錯誤日誌

### 定期檢查

- ✅ Webhook 成功率（應該 > 99%）
- ✅ API Response Time（應該 < 2s）
- ✅ 資料庫查詢效能
- ✅ 錯誤日誌是否有異常

---

## 下一步

部署完成後，你可以：

1. **測試完整流程**：端對端購買流程
2. **設定自訂網域**：提升品牌形象
3. **切換到正式模式**：開始接受真實付款
4. **繼續開發 Phase 4**：學習體驗功能

---

## 需要幫助？

- [Vercel 文件](https://vercel.com/docs)
- [Next.js 部署文件](https://nextjs.org/docs/app/building-your-application/deploying)
- [Stripe Webhook 文件](https://stripe.com/docs/webhooks)
- [Supabase Auth 文件](https://supabase.com/docs/guides/auth)
