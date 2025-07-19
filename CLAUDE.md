# 植物観察アプリ - CLAUDE開発用ドキュメント

## プロジェクト概要

**植物観察アプリ**は、植物愛好家が日々の植物観察記録を効率的に管理できるWebアプリケーションです。植物の登録から観察記録、水やり管理まで一連のワークフローをサポートします。

### 主要機能
- 植物の登録・管理（編集・削除）
- 観察記録の作成・表示・編集
- 水やりスケジュール管理・通知
- 写真添付機能
- レスポンシブデザイン対応

## 現在の開発状況

### ✅ 完了済み
1. **機能要件定義**
   - MVP機能要件書作成（`docs/mvp-features.md`）
   - 完全な機能要件書作成（`docs/features.md`）

2. **データベース設計・実装**
   - ER図設計・正規化完了
   - PostgreSQL用スキーマ作成（`docs/database-schema.sql`）
   - データベース設計書作成（`docs/database-design.md`）
   - **Supabaseローカル環境構築完了**
   - **データベーススキーマ適用完了**
   - **RLS（Row Level Security）設定完了**
   - **セキュリティ警告対応完了**

3. **認証設計**
   - Supabase Auth活用設計
   - 認証設計書作成（`docs/authentication-design.md`）
   - 認証方式：メール+パスワード、Google、GitHub

4. **プロトタイプ完成**
   - レスポンシブデザイン対応
   - 認証ページ（ログイン・サインアップ）
   - 機能ページ（植物登録、観察記録、水やり管理等）
   - ログイン済み状態のUI完成

5. **Next.jsプロジェクトセットアップ**
   - Next.js 15.4.2 + React 19.1.0 + TypeScript
   - Tailwind CSS v4設定
   - App Router構成
   - **Next.jsコンポーネント設計書作成**（`docs/nextjs-component-design.md`）

6. **Supabaseローカル開発環境**
   - **Supabaseローカル環境セットアップ完了**
   - **データベースマイグレーション実行完了**
   - **セキュリティポリシー適用完了**
   - セットアップガイド作成（`docs/supabase-local-setup.md`）

### 🔄 次のステップ
- Supabaseクライアント設定
- 環境変数設定
- 認証機能実装
- 基本的なページ実装

## 技術スタック

### フロントエンド
- **Next.js 15.4.2** - フルスタックReactフレームワーク（App Router）
- **React 19.1.0** - UIフレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS v4** - スタイリング（最新版）
- **React Hook Form** - フォーム管理
- **TanStack Query** - サーバー状態管理
- **Jotai** - アトミックな状態管理

### バックエンド・データベース
- **Supabase** - BaaS (Backend as a Service)
- **Supabase Auth** - 認証サービス
- **PostgreSQL** - データベース
- **Row Level Security** - データアクセス制御
- **Supabase CLI** - ローカル開発環境

### 開発・デプロイ
- **Turbopack** - 高速ビルドツール（Next.js付属）
- **Jest** - テスト
- **GitHub Actions** - CI/CD
- **Vercel** - デプロイ（予定）

## ファイル構成

```
plantlog/
├── docs/                              # ドキュメント
│   ├── features.md                   # 完全機能要件書
│   ├── mvp-features.md               # MVP機能要件書
│   ├── database-design.md            # データベース設計書
│   ├── database-schema.sql           # 初期データベーススキーマ
│   ├── database-schema-v2.sql        # 改良版データベーススキーマ
│   ├── authentication-design.md      # 認証設計書
│   ├── nextjs-component-design.md    # Next.jsコンポーネント設計書
│   ├── supabase-local-setup.md       # Supabaseローカル環境セットアップガイド
│   ├── prototype/                    # プロトタイプHTML
│   │   ├── index.html                # ホームページ
│   │   ├── login.html                # ログインページ
│   │   ├── signup.html               # サインアップページ
│   │   ├── plant-register.html       # 植物登録ページ
│   │   ├── plant-list.html           # 植物一覧ページ
│   │   ├── diary-entry.html          # 観察記録ページ
│   │   └── watering.html             # 水やり管理ページ
│   └── production/                   # 本番用プロトタイプHTML
│       ├── home.html                 # ホームページ（本番版）
│       ├── login.html                # ログインページ（本番版）
│       ├── plant-list.html           # 植物一覧ページ（本番版）
│       └── plant-register.html       # 植物登録ページ（本番版）
├── src/                              # Next.jsソースコード
│   └── app/                          # App Router
│       ├── globals.css               # グローバルスタイル
│       ├── layout.tsx                # ルートレイアウト
│       └── page.tsx                  # ルートページ
├── supabase/                         # Supabaseローカル環境
│   ├── config.toml                   # Supabase設定
│   └── migrations/                   # データベースマイグレーション
│       ├── 20250101000000_initial_schema.sql      # 初期スキーマ
│       ├── 20250101000001_enable_rls.sql          # RLS有効化
│       ├── 20250101000002_fix_function_security.sql # 関数セキュリティ修正
│       └── 20250101000003_fix_plant_types_rls.sql  # plant_types RLS修正
├── package.json                      # プロジェクト設定
├── next.config.ts                    # Next.js設定
├── tsconfig.json                     # TypeScript設定
├── CLAUDE.md                         # 本ファイル
└── README.md                         # プロジェクト説明
```

## データベース設計

### 主要テーブル
1. **plant_types** - 植物種類マスター
2. **plants** - 植物情報
3. **observation_records** - 観察記録
4. **watering_records** - 水やり記録
5. **photos** - 写真管理
6. **edit_history** - 編集履歴
7. **user_profiles** - ユーザープロフィール

### リレーションシップ
- Plants 1:N Observation_Records
- Plants 1:N Watering_Records
- Plants 1:N Photos (植物写真)
- Observation_Records 1:N Photos (観察写真)
- Observation_Records 1:N Edit_History

## 認証設計

### 対応認証方式
- **メール+パスワード認証**（必須）
- **Google認証**（推奨）
- **GitHub認証**（開発者向け）

### セキュリティ機能
- Row Level Security（RLS）
- JWT認証
- 入力検証
- XSS対策

## プロトタイプ仕様

### レスポンシブデザイン
- **モバイル**：スマートフォン最適化（max-w-sm）
- **PC**：デスクトップ最適化（max-w-6xl）
- **ブレークポイント**：Tailwind CSS `lg:` (1024px)

### デザインシステム
- **アクセントカラー**：#22c55e (緑色)
- **フォント**：Inter, Noto Sans JP
- **カラーパレット**：グレースケール中心

### 認証状態
- **認証前**：ログイン・サインアップページのみアクセス可能
- **認証後**：全機能ページにアクセス可能、プロフィール表示

## 開発指針

### コード品質
- TypeScript strict mode
- ESLint + Prettier
- Husky (pre-commit hooks)
- コンポーネント単位のテスト

### パフォーマンス
- 画像最適化
- 遅延読み込み
- React.memo活用
- Bundle size最適化

### セキュリティ
- 入力検証
- XSS対策
- CSRF対策
- 機密情報の環境変数化

## 環境変数

```env
# Supabase設定（ローカル開発用）
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase設定（本番用）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# OAuth設定
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
```

## 開発フロー

### 1. ローカル開発環境起動
```bash
# Supabaseローカル環境起動
supabase start -x vector -x logflare

# Next.js開発サーバー起動
npm run dev
```

### 2. データベース操作
```bash
# マイグレーション作成
supabase migration new feature_name

# データベースリセット
supabase db reset

# 型定義生成
supabase gen types typescript --local > src/lib/database.types.ts
```

### 3. 必要な依存関係
```bash
# Supabase関連
npm install @supabase/supabase-js

# フォーム・状態管理
npm install @tanstack/react-query react-hook-form @hookform/resolvers zod jotai

# UI・ユーティリティ
npm install clsx
```

### 4. アプリケーション実装
- Supabaseクライアント設定
- 認証機能実装
- コンポーネント実装
- ページ実装

## テスト戦略

### 単体テスト
- React Testing Library
- Jest
- コンポーネント単位のテスト

### 統合テスト
- API通信テスト
- 認証フローテスト
- データベース操作テスト

### E2Eテスト
- Cypress
- ユーザージャーニー全体のテスト

## デプロイ戦略

### 本番環境
- **フロントエンド**: Vercel
- **バックエンド**: Supabase
- **ドメイン**: 独自ドメイン（予定）

### CI/CD
- GitHub Actions
- 自動テスト実行
- 自動デプロイ

## 今後の拡張予定

### フェーズ2
- 植物検索・フィルタリング
- 成長グラフ表示
- 水やり統計機能

### フェーズ3
- データエクスポート
- 高度な統計・分析
- PWA対応

## 参考リンク

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## チーム開発時の注意点

1. **データベース変更時**：必ず`docs/database-schema.sql`を更新
2. **機能追加時**：MVP機能要件書の更新を検討
3. **認証関連の変更**：認証設計書の更新が必要
4. **プロトタイプ更新時**：レスポンシブデザインの確認

---

このドキュメントは開発進捗に応じて随時更新してください。