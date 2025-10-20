# ⚡ クイックスタートガイド

## 📋 必要なもの

- macOS
- ターミナル

## 🚀 3ステップで起動

### 1️⃣ Node.jsをインストール

まだインストールしていない場合:

```bash
# Homebrewをインストール
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.jsをインストール
brew install node
```

### 2️⃣ プロジェクトをセットアップ

```bash
# プロジェクトディレクトリに移動
cd /Users/taichan/Desktop/farmers-platform

# 依存関係をインストール
npm install

# データベースをセットアップ
npx prisma generate
npx prisma db push
npm run db:seed
```

### 3️⃣ 起動

```bash
npm run dev
```

ブラウザで **http://localhost:3000** を開く！

## 🎯 テストアカウント

```
顧客: customer@example.com / password123
農家: farmer1@example.com / password123
```

## 🛠️ よく使うコマンド

```bash
npm run dev          # 開発サーバー起動
npm run db:studio    # データベース管理画面
npm run build        # 本番ビルド
```

## ❓ うまくいかない場合

詳細は **SETUP.md** を参照してください。

---

**🌱 農家プラットフォームへようこそ！**
