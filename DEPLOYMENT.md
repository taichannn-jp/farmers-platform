# 🚀 デプロイ手順

## Vercelへのデプロイ

### 1. Gitリポジトリの準備

```bash
# Gitリポジトリを初期化（まだの場合）
git init

# 全ファイルをステージング
git add .

# コミット
git commit -m "Initial commit: Farmers Platform"

# GitHubリポジトリを作成して接続
# https://github.com/new でリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/farmers-platform.git
git branch -M main
git push -u origin main
```

### 2. Vercelアカウントの準備

1. https://vercel.com にアクセス
2. GitHubアカウントでサインアップ/ログイン

### 3. プロジェクトのインポート

1. Vercelダッシュボードで「Add New」→「Project」をクリック
2. GitHubリポジトリから`farmers-platform`を選択
3. 「Import」をクリック

### 4. 環境変数の設定

Vercelの設定画面で以下の環境変数を追加：

#### 必須の環境変数

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=ランダムな長い文字列（openssl rand -base64 32で生成）
```

#### オプション（Stripe使用時）

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
```

### 5. データベースの準備

#### オプション1: Vercel Postgres（推奨）

1. Vercelダッシュボード → Storage → Create Database
2. Postgres を選択
3. DATABASE_URLが自動的に環境変数に追加される

#### オプション2: Supabase

1. https://supabase.com でプロジェクト作成
2. Settings → Database → Connection string をコピー
3. VercelのDATABASE_URLに設定

#### オプション3: Railway

1. https://railway.app でプロジェクト作成
2. Add PostgreSQL を選択
3. DATABASE_URLをコピーしてVercelに設定

### 6. Prismaマイグレーション

データベース設定後、Vercelで以下のコマンドを実行：

```bash
# Build Commandを以下に変更（Vercel設定画面）
prisma generate && prisma db push && next build
```

または、ローカルから本番DBに接続：

```bash
# .env に本番DATABASE_URLを一時的に設定
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npm run db:seed
```

### 7. デプロイ

1. 「Deploy」ボタンをクリック
2. ビルドが完了するのを待つ（約2-3分）
3. デプロイ完了後、URLにアクセス

---

## 🔧 デプロイ後の確認事項

- [ ] トップページが表示される
- [ ] ログイン機能が動作する
- [ ] 野菜一覧が表示される
- [ ] 農家登録が可能
- [ ] 商品登録が可能
- [ ] PWA機能（ホーム画面に追加）が動作する

---

## 📝 トラブルシューティング

### ビルドエラー: "Cannot find module '@prisma/client'"

**解決策**: `package.json`の`postinstall`スクリプトを確認
```json
"postinstall": "prisma generate"
```

### データベース接続エラー

**解決策**: 
1. DATABASE_URLが正しく設定されているか確認
2. データベースが稼働しているか確認
3. IPアドレス制限がある場合、Vercelのアドレスを許可

### 画像が表示されない

**解決策**: `next.config.js`で画像ドメインを許可
```javascript
images: {
  domains: ['images.unsplash.com'],
}
```

### 環境変数が反映されない

**解決策**:
1. Vercel設定画面で環境変数を再確認
2. 再デプロイを実行（Deployments → ... → Redeploy）

---

## 🎉 カスタムドメインの設定（オプション）

1. Vercelダッシュボード → Settings → Domains
2. 「Add Domain」をクリック
3. ドメインを入力（例: farmers.example.com）
4. DNS設定手順に従う
5. SSL証明書が自動的に発行される

---

## 📊 デプロイ後の運用

### ログの確認
Vercel Dashboard → Deployments → View Function Logs

### パフォーマンス監視
Vercel Analytics を有効化（Settings → Analytics）

### データベースバックアップ
定期的にデータベースのバックアップを取得

### 更新のデプロイ
```bash
git add .
git commit -m "Update: 機能追加"
git push origin main
# → 自動的にVercelがビルド＆デプロイ
```
