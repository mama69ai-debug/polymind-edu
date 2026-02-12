# Stripe 環境變數設定說明

## Phase 3 完成後需要的環境變數

請在 `.env.local` 檔案中加入以下環境變數：

```env
# Stripe 設定
STRIPE_SECRET_KEY=sk_test_xxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx

# Supabase Service Role Key（用於 Webhook 寫入資料）
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 網站 URL（選用，本地開發會自動使用 localhost:3000）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 如何取得 Stripe Keys

1. 前往 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 註冊/登入帳號
3. 切換到「測試模式」（Test Mode）
4. 在左側選單點選「開發者」→「API 金鑰」
5. 複製以下金鑰：
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`（點擊「顯示測試金鑰」）

## 如何設定 Webhook

1. 在 Stripe Dashboard 點選「開發者」→「Webhooks」
2. 點選「新增端點」
3. 輸入端點 URL：
   - **本地測試**：使用 [Stripe CLI](https://stripe.com/docs/stripe-cli) 進行本地轉發
   - **正式環境**：`https://your-domain.com/api/webhooks/stripe`
4. 選擇要監聽的事件：`checkout.session.completed`
5. 建立端點後，複製「簽署密鑰」→ `STRIPE_WEBHOOK_SECRET`

## 本地測試 Webhook 的方法

### 方法 1：使用 Stripe CLI（推薦）

```bash
# 安裝 Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# 登入 Stripe
stripe login

# 轉發 webhook 到本地
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# CLI 會顯示 webhook secret，複製到 .env.local 的 STRIPE_WEBHOOK_SECRET
```

### 方法 2：使用 ngrok 或類似工具

```bash
# 安裝 ngrok
ngrok http 3000

# 將 ngrok 給的 URL 加上 /api/webhooks/stripe 設定到 Stripe Dashboard
```

## Supabase Service Role Key

1. 前往 Supabase Dashboard
2. 選擇專案
3. 點選「Settings」→「API」
4. 複製「service_role key」（**注意：這是機密金鑰，切勿暴露**）
5. 貼到 `SUPABASE_SERVICE_ROLE_KEY`

## 測試流程

1. 確保所有環境變數都已設定
2. 啟動開發伺服器：`npm run dev`
3. 如果要測試 webhook：
   - 開啟另一個終端機執行 `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. 瀏覽課程 → 點選購買 → 使用測試卡號：`4242 4242 4242 4242`
   - 任意未來的日期、任意 3 碼 CVC、任意郵遞區號
5. 完成付款後應該會：
   - 跳轉到成功頁面
   - 在「我的課程」中看到購買的課程
   - 可以進入學習頁

## 注意事項

- **測試模式**：請使用 Stripe 測試金鑰（`sk_test_` 和 `pk_test_` 開頭）
- **安全性**：`STRIPE_SECRET_KEY` 和 `SUPABASE_SERVICE_ROLE_KEY` 絕對不可提交到 Git
- **Webhook 簽名**：production 環境務必驗證 webhook 簽名，防止偽造請求
- **幣別**：目前設定為 TWD（台幣），可在 `src/app/api/checkout/route.ts` 修改
