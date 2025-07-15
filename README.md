# Plant Log - 植物日記

Plant Log は植物の世話を管理するためのウェブアプリケーションです。

## 技術スタック

- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全な JavaScript
- **Tailwind CSS** - ユーティリティファーストの CSS フレームワーク
- **React 18** - ユーザーインターフェース構築

## 機能

- 植物の基本情報管理
- 水やりスケジュール管理
- 植物の健康状態トラッキング
- レスポンシブデザイン
- 日本語対応

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### 3. その他のコマンド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# TypeScript型チェック
npm run typecheck

# ESLint実行
npm run lint
```

## プロジェクト構造

```
├── app/                    # Next.js 13+ App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── plants/            # 植物一覧ページ
│   └── about/             # このアプリについてページ
├── components/            # 再利用可能コンポーネント
│   ├── Header.tsx         # ヘッダーコンポーネント
│   └── PlantCard.tsx      # 植物カードコンポーネント
├── types/                 # TypeScript型定義
│   └── plant.ts           # 植物関連の型
├── utils/                 # ユーティリティ関数
│   ├── dateUtils.ts       # 日付関連のユーティリティ
│   └── plantUtils.ts      # 植物関連のユーティリティ
├── package.json           # パッケージ設定
├── tsconfig.json          # TypeScript設定
├── tailwind.config.js     # Tailwind CSS設定
└── next.config.js         # Next.js設定
```

## ページルート

- `/` - ホームページ
- `/plants` - 植物一覧ページ
- `/about` - このアプリについてページ

## 開発

このプロジェクトは以下の設定で開発されています：

- **ESLint** - コード品質チェック
- **Prettier** - コードフォーマット
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング

## 今後の拡張予定

- データベース統合
- ユーザー認証
- 画像アップロード機能
- プッシュ通知
- PWA対応