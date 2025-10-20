# 🚀 セットアップガイド

このガイドでは、農家プラットフォームを動作させるために必要な環境構築手順を説明します。

## 前提条件

このプロジェクトを実行するには、以下のツールが必要です：

1. **Homebrew** (macOSのパッケージマネージャー)
2. **Node.js** (v18以上推奨)
3. **npm** (Node.jsに含まれています)

## ステップ1: Homebrewのインストール

まだHomebrewをインストールしていない場合は、以下のコマンドを実行してください：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

インストール後、ターミナルを再起動するか、以下のコマンドを実行してください：

```bash
# Homebrewのパスを通す（表示される指示に従ってください）
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## ステップ2: Node.jsのインストール

Homebrewを使ってNode.jsをインストールします：

```bash
brew install node
```

インストールが完了したら、バージョンを確認：

```bash
node --version  # v18以上であることを確認
npm --version   # npmも自動的にインストールされます
```

## ステップ3: プロジェクトのセットアップ

### 3.1 依存関係のインストール

プロジェクトディレクトリで以下を実行：

```bash
cd /Users/taichan/Desktop/farmers-platform
npm install
```

### 3.2 環境変数の確認

`.env`ファイルが作成されているか確認してください。必要に応じて以下の値を更新：

```env
# Database (開発環境ではSQLiteを使用)
DATABASE_URL="file:./dev.db"

# NextAuth (本番環境では必ず変更してください)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Stripe (テストモードのキーを使用)
# https://dashboard.stripe.com/test/apikeys から取得
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Mapbox (無料プランで取得可能)
# https://account.mapbox.com/ から取得
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."
```

**重要**: 
- Stripe決済機能を使うには、Stripeアカウントが必要です（無料で作成可能）
- 地図機能を使うには、Mapboxアカウントが必要です（無料枠あり）
- これらがなくても、他の機能は動作します

### 3.3 データベースのセットアップ

```bash
# Prismaクライアントを生成
npx prisma generate

# データベースを作成（SQLiteファイルが生成されます）
npx prisma db push

# サンプルデータを投入
npm run db:seed
```

成功すると以下のようなメッセージが表示されます：

```
🌱 シードデータを作成中...
✅ シードデータの作成が完了しました！
📧 テストアカウント:
   顧客: customer@example.com / password123
   農家1: farmer1@example.com / password123
   農家2: farmer2@example.com / password123
```

## ステップ4: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで以下のURLを開いてください：
```
http://localhost:3000
```

## トラブルシューティング

### エラー: "command not found: npm"

Node.jsが正しくインストールされていません。ステップ2を再度確認してください。

### エラー: "Cannot find module '@prisma/client'"

Prismaクライアントが生成されていません：

```bash
npx prisma generate
```

### エラー: データベース接続エラー

`.env`ファイルの`DATABASE_URL`が正しく設定されているか確認してください。

### ポート3000が既に使用されている

別のポートで起動：

```bash
PORT=3001 npm run dev
```

## 次のステップ

✅ セットアップが完了したら、以下を試してください：

1. **トップページを確認**: http://localhost:3000
2. **テストアカウントでログイン**: `customer@example.com` / `password123`
3. **野菜一覧ページを閲覧**: http://localhost:3000/vegetables
4. **データベースを確認**: `npm run db:studio` でPrisma Studioを起動

## 開発に便利なコマンド

```bash
# 開発サーバー起動
npm run dev

# データベース管理画面を開く
npm run db:studio

# データベーススキーマを変更した後
npx prisma generate
npx prisma db push

# サンプルデータを再投入
npm run db:seed

# 本番ビルド
npm run build
npm start
```

## よくある質問

**Q: Stripeのキーがなくても使えますか？**  
A: はい。決済機能以外は動作します。決済ボタンを押すとエラーになりますが、他の機能は利用可能です。

**Q: Mapboxのトークンがなくても使えますか？**  
A: はい。地図表示以外は動作します。位置情報ベースの検索機能が制限されますが、通常の検索は可能です。

**Q: 本番環境にデプロイするには？**  
A: Vercel、Netlify、または任意のNode.jsホスティングサービスにデプロイ可能です。データベースは本番用にPostgreSQLを推奨します。

---

質問や問題が発生した場合は、GitHubのIssueを作成してください。
