# 🌾 農家さんプラットフォーム

新鮮な野菜を農家さんから直接購入できるプラットフォーム

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/farmers-platform)

## ✨ 実装済み機能

### 📱 PWA対応（スマホアプリ化）
- ✅ Service Worker実装
- ✅ Manifest.json設定
- ✅ オフライン対応
- ✅ ホーム画面へ追加可能

### 🔐 認証システム
- ✅ アカウント作成・ログイン
- ✅ 農家/お客様ロール分離
- ✅ 農家ごとのデータ分離

### 🛒 ショッピング機能
- ✅ カート機能
- ✅ 注文確定
- ✅ 在庫管理

### ❤️ お気に入り機能
- ✅ お気に入り登録・削除
- ✅ ビジュアルフィードバック

### 🌱 商品管理（農家向け）
- ✅ CRUD操作
- ✅ 在庫管理
- ✅ 農家ごとの商品分離

### 📦 注文管理（農家向け）
- ✅ ステータス更新
- ✅ フィルタリング
- ✅ 農家ごとの注文分離

### 📊 ダッシュボード（農家向け）
- ✅ 売上統計
- ✅ 注文数
- ✅ 商品数
- ✅ 評価

### 📍 位置情報機能
- ✅ 近くの農家を探す
- ✅ 距離計算

## �️ 技術スタック

- **Frontend**: Next.js 14.2.3 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: SQLite (開発) / PostgreSQL (本番推奨)
- **ORM**: Prisma
- **Authentication**: Custom Auth Context
- **PWA**: Service Worker, Web Manifest

## �🚀 クイックスタート

### 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# データベースのセットアップ
npx prisma db push

# シードデータの投入
npm run db:seed

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアクセス

### 本番環境へのデプロイ

詳細な手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

```bash
# Vercelへのデプロイ（最も簡単）
vercel

# または、GitHubにプッシュして自動デプロイ
git add .
git commit -m "Deploy to production"
git push origin main
```

## 🧪 テストアカウント

### お客様アカウント
- **Email**: customer@example.com
- **Password**: password123

### 農家アカウント
- **山田農園**: farmer1@example.com / password123
- **佐藤ファーム**: farmer2@example.com / password123

## 📱 PWAインストール

### iOS
1. Safariでサイトを開く
2. 共有ボタンをタップ
3. 「ホーム画面に追加」を選択

### Android
1. Chromeでサイトを開く
2. メニューを開く
3. 「ホーム画面に追加」を選択

### Desktop
1. アドレスバーのインストールアイコンをクリック
2. 「インストール」を選択

## 📂 プロジェクト構造

```
farmers-platform/
├── app/                    # Next.js App Router
│   ├── api/               # APIルート
│   ├── farmer/            # 農家向けページ
│   ├── vegetables/        # 野菜関連ページ
│   └── page.tsx           # トップページ
├── components/            # Reactコンポーネント
│   ├── ui/               # shadcn/uiコンポーネント
│   └── ...               # カスタムコンポーネント
├── lib/                   # ユーティリティ
│   ├── auth-context.tsx  # 認証コンテキスト
│   ├── prisma.ts         # Prismaクライアント
│   └── utils.ts          # 共通関数
├── prisma/               # Prismaスキーマとシード
│   ├── schema.prisma
│   └── seed.ts
└── public/               # 静的ファイル
    ├── manifest.json     # PWA Manifest
    └── sw.js            # Service Worker
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Unsplash](https://unsplash.com/) (画像提供)
