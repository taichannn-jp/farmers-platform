#!/bin/bash

# Node.js簡単インストールスクリプト（管理者権限不要）

echo "🚀 Node.jsインストールスクリプト"
echo "================================"
echo ""

# nvmのインストール
echo "📦 Step 1: nvm（Node Version Manager）をインストール中..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# nvmの環境変数を読み込む
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo ""
echo "✅ nvmのインストールが完了しました"
echo ""

# Node.jsのインストール
echo "📦 Step 2: Node.js（最新LTS版）をインストール中..."
nvm install --lts
nvm use --lts

echo ""
echo "✅ Node.jsのインストールが完了しました"
echo ""

# バージョン確認
echo "📋 インストールされたバージョン:"
node --version
npm --version

echo ""
echo "✅ すべてのインストールが完了しました！"
echo ""
echo "次のコマンドを実行してください："
echo "  source ~/.zshrc"
echo "  cd /Users/taichan/Desktop/farmers-platform"
echo "  npm install"
