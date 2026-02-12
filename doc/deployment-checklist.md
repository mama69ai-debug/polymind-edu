# Vercel 部署前檢查清單

在部署到 Vercel 前，請確認以下項目：

## ✅ 程式碼準備

- [ ] 所有程式碼已提交到 Git
- [ ] `.env.local` 已在 `.gitignore` 中（不要提交機密資訊）
- [ ] `package.json` 中的依賴套件都已正確安裝
- [ ] 本地執行 `npm run build` 成功（確保沒有建置錯誤）

## ✅ Supabase 準備

- [ ] Supabase 專案已建立
- [ ] 已取得 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 已取得 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 已取得 `SUPABASE_SERVICE_ROLE_KEY`（用於 webhook）
- [ ] 資料庫 Schema 已建立（courses, instructors, chapters, orders, enrollments）
- [ ] RLS 政策已正確設定

## ✅ Stripe 準備

- [ ] Stripe 帳號已建立
- [ ] 已取得測試金鑰：
  - [ ] `STRIPE_SECRET_KEY` (sk_test_...)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- [ ] 了解如何取得 `STRIPE_WEBHOOK_SECRET`（部署後設定）

## ✅ GitHub 準備

- [ ] GitHub 帳號已建立
- [ ] 已在 GitHub 建立 repository
- [ ] 本地程式碼已推送到 GitHub

## ✅ Vercel 準備

- [ ] Vercel 帳號已建立（可用 GitHub 登入）
- [ ] 了解基本的環境變數設定方式

## 📝 部署步驟摘要

1. **推送到 GitHub**
   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **匯入到 Vercel**
   - 前往 vercel.com/dashboard
   - Import Git Repository
   - 選擇 polymind-edu

3. **設定環境變數**（詳見 `doc/vercel-deployment.md`）
   - Supabase 相關變數（3 個）
   - Stripe 相關變數（2 個，webhook secret 暫時留空）

4. **首次部署**
   - 點選 Deploy
   - 等待建置完成
   - 取得 Vercel URL

5. **設定 Stripe Webhook**
   - 在 Stripe Dashboard 建立 webhook
   - URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
   - 事件: `checkout.session.completed`
   - 複製 webhook secret

6. **更新環境變數**
   - 在 Vercel 加入 `STRIPE_WEBHOOK_SECRET`
   - 在 Vercel 加入 `NEXT_PUBLIC_SITE_URL`
   - 重新部署

7. **更新 Supabase Auth**
   - 在 Supabase Dashboard 加入 Redirect URLs
   - `https://your-vercel-url.vercel.app/auth/callback`

8. **測試**
   - 完整測試購買流程
   - 確認 webhook 正常運作

## 🚀 快速啟動

如果你已經完成所有準備，可以直接執行：

```powershell
# 確保所有變更已提交
git status

# 推送到 GitHub
git push origin main

# 然後前往 vercel.com 匯入專案
```

## 📚 詳細文件

完整部署步驟請參考：`doc/vercel-deployment.md`

## ⚠️ 重要提醒

1. **絕對不要**把 `.env.local` 提交到 Git
2. 先用 **測試模式**部署，確認無誤後再切換正式模式
3. 環境變數更新後**一定要重新部署**才會生效
4. Stripe webhook 是讓付款流程完整運作的關鍵，務必正確設定

## 需要幫助？

參考詳細文件：
- `doc/vercel-deployment.md` - 完整部署指南
- `doc/stripe-setup.md` - Stripe 設定說明
- `doc/phase3-testing-guide.md` - 測試指南
