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

2. **データベース設計**
   - ER図設計・正規化完了
   - PostgreSQL用スキーマ作成（`docs/database-schema.sql`）
   - データベース設計書作成（`docs/database-design.md`）

3. **認証設計**
   - Supabase Auth活用設計
   - 認証設計書作成（`docs/authentication-design.md`）
   - 認証方式：メール+パスワード、Google、GitHub

4. **プロトタイプ完成**
   - レスポンシブデザイン対応
   - 認証ページ（ログイン・サインアップ）
   - 機能ページ（植物登録、観察記録、水やり管理等）
   - ログイン済み状態のUI完成

### 🔄 次のステップ
- API設計
- フロントエンド実装
- バックエンド実装
- テスト実装

## 技術スタック

### フロントエンド
- **React** - UIフレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **React Router** - ルーティング
- **React Hook Form** - フォーム管理
- **React Query** - データ取得・状態管理

### バックエンド・データベース
- **Supabase** - BaaS (Backend as a Service)
- **Supabase Auth** - 認証サービス
- **PostgreSQL** - データベース
- **Row Level Security** - データアクセス制御

### 開発・デプロイ
- **Vite** - ビルドツール
- **Jest** - テスト
- **GitHub Actions** - CI/CD
- **Vercel** - デプロイ（予定）

## ファイル構成

```
plantlog/
├── docs/                          # ドキュメント
│   ├── features.md               # 完全機能要件書
│   ├── mvp-features.md           # MVP機能要件書
│   ├── database-design.md        # データベース設計書
│   ├── database-schema.sql       # データベーススキーマ
│   ├── authentication-design.md  # 認証設計書
│   └── prototype/                # プロトタイプHTML
│       ├── index.html            # ホームページ
│       ├── login.html            # ログインページ
│       ├── signup.html           # サインアップページ
│       ├── plant-register.html   # 植物登録ページ
│       ├── plant-list.html       # 植物一覧ページ
│       ├── diary-entry.html      # 観察記録ページ
│       └── watering.html         # 水やり管理ページ
├── src/                          # ソースコード（今後作成）
├── CLAUDE.md                     # 本ファイル
└── README.md                     # プロジェクト説明
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
# Supabase設定
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth設定
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id
```

## 開発フロー

### 1. 環境構築
```bash
npm create vite@latest plantlog -- --template react-ts
cd plantlog
npm install
```

### 2. 依存関係インストール
```bash
npm install @supabase/supabase-js
npm install @tanstack/react-query
npm install react-router-dom
npm install react-hook-form
npm install tailwindcss
```

### 3. Supabase セットアップ
- Supabaseプロジェクト作成
- データベーススキーマ適用
- 認証設定
- RLS設定

### 4. フロントエンド実装
- コンポーネント設計
- ルーティング設定
- 認証機能実装
- 主要機能実装

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