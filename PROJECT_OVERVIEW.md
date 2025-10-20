# 🌱 農家プラットフォーム - プロジェクト概要

## 📌 プロジェクトについて

このプロジェクトは、**農家さんと消費者を直接つなぐWebプラットフォーム**です。
消費者は近くの農家さんから新鮮な野菜を購入でき、農家さんは自分の野菜を直接販売できます。

## 🎯 主要機能

### 消費者向け
- ✅ 位置情報ベースで近くの農家さんを検索
- ✅ 野菜の閲覧・検索
- ✅ お気に入り登録機能
- 🔲 オンライン購入・Stripe決済
- 🔲 注文履歴・配送追跡
- 🔲 レビュー・評価機能
- 🔲 農家さんとのメッセージ機能

### 農家さん向け
- ✅ 農園プロフィール管理
- ✅ 野菜の登録・管理
- 🔲 在庫・価格管理
- 🔲 注文管理ダッシュボード
- 🔲 売上レポート
- 🔲 メッセージ対応

### 管理者向け
- 🔲 農家の認証管理
- 🔲 ユーザー管理
- 🔲 トランザクション管理

## 🏗️ 技術構成

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **UIライブラリ**: React
- **スタイリング**: Tailwind CSS
- **コンポーネント**: shadcn/ui (Radix UI)
- **アイコン**: Lucide React

### バックエンド
- **API**: Next.js API Routes
- **データベース**: SQLite (開発) / PostgreSQL (本番推奨)
- **ORM**: Prisma
- **認証**: NextAuth.js
- **決済**: Stripe

### その他
- **地図**: Mapbox GL JS
- **日付処理**: date-fns
- **バリデーション**: Zod

## 📁 プロジェクト構造

```
farmers-platform/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # ルートレイアウト
│   ├── page.tsx               # トップページ
│   ├── globals.css            # グローバルCSS
│   ├── vegetables/            # 野菜関連ページ
│   │   └── page.tsx          # 野菜一覧
│   ├── farmers/               # 農家関連ページ
│   │   └── page.tsx          # 農家一覧
│   └── api/                   # API Routes (今後実装)
│       ├── vegetables/
│       ├── farmers/
│       ├── orders/
│       └── auth/
│
├── components/                 # Reactコンポーネント
│   └── ui/                    # UIコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
│
├── lib/                        # ユーティリティ
│   ├── prisma.ts              # Prismaクライアント
│   └── utils.ts               # ヘルパー関数
│
├── prisma/                     # Prisma設定
│   ├── schema.prisma          # データベーススキーマ
│   └── seed.ts                # シードデータ
│
├── public/                     # 静的ファイル
│
├── .vscode/                    # VS Code設定
│   ├── settings.json          # エディタ設定
│   └── extensions.json        # 推奨拡張機能
│
├── package.json               # 依存関係
├── tsconfig.json              # TypeScript設定
├── tailwind.config.ts         # Tailwind CSS設定
├── next.config.mjs            # Next.js設定
├── .env                       # 環境変数
├── .gitignore                 # Git無視ファイル
│
└── ドキュメント/
    ├── README.md              # プロジェクト説明
    ├── QUICKSTART.md          # クイックスタート
    ├── SETUP.md               # 詳細セットアップ
    └── PROJECT_OVERVIEW.md    # このファイル
```

## 🗄️ データベース設計

### 主要テーブル

#### User（ユーザー）
- 顧客と農家の共通情報
- 認証情報（email, password）
- ロール（CUSTOMER, FARMER, ADMIN）

#### Farmer（農家）
- 農園名、説明
- 所在地（住所、緯度・経度）
- 連絡先情報
- 認証ステータス

#### Vegetable（野菜）
- 野菜名、カテゴリ、説明
- 価格、単位、在庫
- 収穫時期
- 有機栽培フラグ

#### Order（注文）
- 注文ステータス
- 配送情報
- 決済情報

#### OrderItem（注文明細）
- 注文と野菜の紐付け
- 数量、価格

#### Favorite（お気に入り）
- ユーザーと野菜の紐付け

#### Review（レビュー）
- 評価（1-5）
- コメント

#### Message（メッセージ）
- 送信者、受信者
- メッセージ内容

## 🔄 開発フロー

### 1. 環境構築
```bash
# 依存関係インストール
npm install

# データベースセットアップ
npx prisma generate
npx prisma db push
npm run db:seed
```

### 2. 開発サーバー起動
```bash
npm run dev
```

### 3. データベース確認
```bash
npm run db:studio
```

### 4. ビルド・デプロイ
```bash
npm run build
npm start
```

## 📝 次のステップ（実装予定）

### フェーズ1: 基本機能完成 ✅
- [x] プロジェクト構造作成
- [x] データベーススキーマ設計
- [x] トップページ作成
- [x] 野菜一覧ページ
- [x] 農家一覧ページ

### フェーズ2: 詳細ページと認証
- [ ] 野菜詳細ページ
- [ ] 農家詳細ページ
- [ ] ユーザー登録・ログイン
- [ ] プロフィール編集

### フェーズ3: 購入機能
- [ ] カート機能
- [ ] 注文フロー
- [ ] Stripe決済統合
- [ ] 注文履歴

### フェーズ4: インタラクション機能
- [ ] お気に入り機能
- [ ] レビュー機能
- [ ] メッセージ機能
- [ ] 通知機能

### フェーズ5: 農家向け機能
- [ ] 農家登録フロー
- [ ] 野菜管理ダッシュボード
- [ ] 注文管理
- [ ] 売上分析

### フェーズ6: 高度な機能
- [ ] 地図表示・位置情報検索
- [ ] 収穫予定・予約機能
- [ ] 定期購入
- [ ] モバイルアプリ

## 🧪 テストアカウント

開発・テスト用のアカウント（`npm run db:seed`で作成）:

```
顧客アカウント:
  📧 customer@example.com
  🔑 password123

農家アカウント1（山田農園）:
  📧 farmer1@example.com
  🔑 password123

農家アカウント2（佐藤ファーム）:
  📧 farmer2@example.com
  🔑 password123
```

## 🔧 開発ツール

### 必須
- Node.js v18以上
- npm
- VS Code（推奨）

### 推奨VS Code拡張機能
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Prisma

## 📚 参考リソース

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Stripe ドキュメント](https://stripe.com/docs)

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License

## 📧 お問い合わせ

質問や提案がある場合は、GitHubのIssueを作成してください。

---

**Made with ❤️ for farmers and consumers**
