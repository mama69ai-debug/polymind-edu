# Phase 3 測試指南

## 測試前準備

### 1. 環境變數設定

請先閱讀 `doc/stripe-setup.md` 並在 `.env.local` 中設定以下變數：

```env
STRIPE_SECRET_KEY=sk_test_xxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. 啟動 Webhook 監聽（本地測試）

在另一個終端機執行：

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

---

## 完整購買流程測試

### 測試案例 1：正常購買流程

**步驟：**

1. **瀏覽課程**
   - 前往 `http://localhost:3000/courses`
   - 應該看到課程列表

2. **查看課程詳情**
   - 點選任一課程
   - 進入課程詳情頁 (`/courses/[slug]`)
   - 應該看到「購買課程」按鈕

3. **未登入購買測試**
   - 點選「購買課程」
   - 應該跳轉到登入頁 (`/auth/login?redirect=/courses/[slug]`)

4. **註冊/登入**
   - 註冊新帳號或登入現有帳號
   - 登入後應該回到課程詳情頁

5. **點選購買**
   - 再次點選「購買課程」按鈕
   - 應該跳轉到 Stripe Checkout 頁面

6. **完成付款**
   - 使用測試卡號：`4242 4242 4242 4242`
   - 到期日：任意未來日期（例如：12/34）
   - CVC：任意 3 碼（例如：123）
   - 郵遞區號：任意 5 碼（例如：12345）
   - 點選「付款」

7. **驗證成功頁**
   - 應該跳轉到 `/checkout/success?session_id=xxx`
   - 看到「購買成功」訊息

8. **驗證我的課程**
   - 點選「查看我的課程」或直接前往 `/my-courses`
   - 應該看到剛購買的課程出現在列表中

9. **進入學習頁**
   - 從我的課程點選「進入學習」
   - 或回到課程詳情頁，按鈕應該變成「進入學習頁」
   - 應該可以順利進入 `/courses/[slug]/learn`
   - 看到章節列表和內容

---

### 測試案例 2：重複購買防護

**步驟：**

1. 完成測試案例 1
2. 回到課程詳情頁
3. **預期結果**：按鈕應該顯示「進入學習頁」，而非「購買課程」
4. 如果強制呼叫 API（使用開發者工具）
5. **預期結果**：API 應該回傳 `Already enrolled in this course` 錯誤

---

### 測試案例 3：未購買無法進入學習頁

**步驟：**

1. 登出目前帳號
2. 註冊一個新帳號（或使用另一個沒有購買過的帳號）
3. 直接在網址列輸入 `/courses/[slug]/learn`
4. **預期結果**：
   - 未登入：跳轉到登入頁
   - 已登入但未購買：顯示「需要購買課程」提示頁面
   - 提示頁面應該有「查看課程詳情」和「瀏覽其他課程」按鈕

---

### 測試案例 4：取消付款

**步驟：**

1. 登入帳號
2. 選擇一門尚未購買的課程
3. 點選「購買課程」
4. 在 Stripe Checkout 頁面點選「返回」或關閉視窗
5. **預期結果**：
   - 回到課程詳情頁
   - 不應該建立 order 或 enrollment
   - 按鈕仍然顯示「購買課程」

---

### 測試案例 5：Webhook 冪等性

**步驟：**

1. 完成一次正常購買
2. 在 Stripe CLI 或 Dashboard 重新發送相同的 `checkout.session.completed` 事件
3. **預期結果**：
   - Webhook 應該識別出已存在的 order
   - 不應該建立重複的 order 或 enrollment
   - 在伺服器 console 看到 "Order already exists for session: xxx"

---

## 驗證檢查清單

### 資料庫檢查

完成購買後，在 Supabase Dashboard 檢查：

- [ ] `orders` 表有新記錄，status 為 `paid`
- [ ] `enrollments` 表有新記錄
- [ ] `orders.user_id` 和 `enrollments.user_id` 正確
- [ ] `orders.course_id` 和 `enrollments.course_id` 正確
- [ ] `orders.stripe_session_id` 已記錄

### UI/UX 檢查

- [ ] 未登入時點選購買，會跳轉到登入頁
- [ ] 登入後會自動回到原課程頁
- [ ] 購買按鈕在付款前顯示「購買課程」
- [ ] 購買後按鈕變成「進入學習頁」
- [ ] 成功頁顯示正確訊息和交易 ID
- [ ] 我的課程頁正確顯示已購買課程
- [ ] 未購買時無法進入學習頁

### API 檢查

- [ ] `/api/checkout` 驗證登入狀態
- [ ] `/api/checkout` 驗證課程存在
- [ ] `/api/checkout` 檢查重複購買
- [ ] `/api/webhooks/stripe` 驗證簽名
- [ ] `/api/webhooks/stripe` 正確建立 order 和 enrollment
- [ ] `/api/webhooks/stripe` 冪等處理

---

## 常見問題排查

### Webhook 未觸發

**可能原因：**
- Stripe CLI 未執行或斷線
- `STRIPE_WEBHOOK_SECRET` 設定錯誤

**解決方法：**
```bash
# 確認 Stripe CLI 運作中
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 複製顯示的 webhook secret 到 .env.local
```

### 付款後沒有建立 enrollment

**可能原因：**
- Webhook 未成功執行
- `SUPABASE_SERVICE_ROLE_KEY` 未設定或錯誤

**解決方法：**
1. 檢查伺服器 console 是否有錯誤訊息
2. 確認 webhook secret 正確
3. 確認 service role key 正確
4. 檢查 Supabase RLS 政策

### Stripe Checkout 顯示 404

**可能原因：**
- API Route 沒有正確執行
- 環境變數缺失

**解決方法：**
1. 確認 `STRIPE_SECRET_KEY` 已設定
2. 檢查伺服器 console 錯誤訊息
3. 確認 Next.js 已重新啟動（修改 .env.local 後需重啟）

---

## Stripe 測試卡號參考

| 卡號 | 用途 |
|------|------|
| `4242 4242 4242 4242` | 成功付款 |
| `4000 0000 0000 0002` | 卡片被拒絕 |
| `4000 0000 0000 9995` | 資金不足 |
| `4000 0025 0000 3155` | 需要 3D Secure 驗證 |

更多測試卡號：[Stripe Testing](https://stripe.com/docs/testing)

---

## 下一步

Phase 3 完成後，可以繼續進行：

- **Phase 4**：學習體驗（章節選擇、進度追蹤）
- **P1 功能**：人格測驗 + 課程推薦
