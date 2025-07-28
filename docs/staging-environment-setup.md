# ステージング環境構築手順

## 📋 概要

植物観察アプリのステージング環境（Supabase + Vercel）を構築する手順を説明します。

## 🎯 構築目標

- **ステージング環境**: 本番前の最終確認環境
- **自動デプロイ**: developブランチへのプッシュで自動デプロイ
- **環境分離**: 開発・ステージング・本番の完全分離

## 🚀 構築手順

### 1. Supabaseステージング環境作成

#### A. Supabase CLI準備
```bash
# Supabase CLIインストール（必要に応じて）
npm install -g supabase

# ログイン
supabase login
```

#### B. 新規プロジェクト作成
1. **Web UI**: https://supabase.com/dashboard
2. **New Project**をクリック
3. 設定値:
   - **Project name**: `plantlog-staging`
   - **Database Password**: 強固なパスワード設定
   - **Region**: `Northeast Asia (Tokyo)`
4. **Create new project**

#### C. プロジェクト情報取得
プロジェクト作成後、以下の情報をメモ：
- **Project Reference**: `abcdefghijklmnop`（例）
- **Project URL**: `https://abcdefghijklmnop.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

#### D. データベーススキーマ適用
```bash
# プロジェクトをリンク
supabase link --project-ref [ステージング用project-ref]

# 既存マイグレーションを適用
supabase db push

# 成功確認
supabase db diff
```

### 2. 環境変数ファイル更新

#### `.env.staging`を以下で更新:
```env
# Supabaseステージング環境の設定
NEXT_PUBLIC_SUPABASE_URL=https://[ステージング-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ステージング用anon-key]

# ステージング用サービスロールキー（管理機能用）
SUPABASE_SERVICE_ROLE_KEY=[ステージング用service-role-key]

# 本番類似設定
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=staging
```

**🔒 重要**: 実際のキー値は`.env.staging`ファイルに直接記入してください。

### 3. Vercelステージング環境作成

#### A. 新規プロジェクト作成

**方法1: Vercel CLI使用**
```bash
# Vercel CLIでステージング用プロジェクト作成
vercel --name plantlog-staging

# プロジェクト設定
# - Set up and deploy? Y
# - Which scope? 個人アカウント選択
# - Link to existing project? N
# - What's your project's name? plantlog-staging
# - In which directory? ./
# - Override settings? N
```

**方法2: Web UI使用**
1. https://vercel.com/new にアクセス
2. **Import Git Repository** → 同じリポジトリを選択
3. **Project Name**: `plantlog-staging`
4. **Framework Preset**: Next.js
5. **Root Directory**: `./`
6. **Build and Output Settings**: デフォルト
7. **Environment Variables**: 後で設定
8. **Deploy**

#### B. 環境変数設定
1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **plantlog-staging**プロジェクトを選択
3. **Settings** → **Environment Variables**
4. 以下を追加:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[project-ref].supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[anon-key]` | Production |
| `NODE_ENV` | `production` | Production |
| `NEXT_PUBLIC_APP_ENV` | `staging` | Production |

#### C. デプロイブランチ設定
1. **Settings** → **Git**
2. **Production Branch**: `develop` に変更
3. **Deploy Hooks**: 必要に応じて設定

### 4. ブランチ戦略実装

#### developブランチ作成
```bash
# developブランチ作成・切り替え
git checkout -b develop

# 初回プッシュ
git push -u origin develop
```

#### ブランチ運用ルール
- **main**: 本番環境（plantlog.vercel.app）
- **develop**: ステージング環境（plantlog-staging.vercel.app）
- **feature/***: 機能開発ブランチ

### 5. ローカル環境でのテスト

#### ステージング環境での動作確認
```bash
# ステージング環境でローカル開発
npm run dev:staging

# ブラウザで確認
# http://localhost:3000

# ステージング用ビルドテスト
npm run build:staging
```

### 6. 自動デプロイ確認

#### テスト用コミット
```bash
# developブランチで変更をプッシュ
git add .
git commit -m "test: staging environment setup"
git push origin develop
```

#### デプロイ確認
1. **Vercel Dashboard**でデプロイ状況確認
2. **ステージングURL**で動作確認
3. **Supabase Dashboard**でデータベース接続確認

## 🔧 トラブルシューティング

### よくある問題と解決法

#### 1. Supabaseマイグレーション失敗
```bash
# エラー確認
supabase db diff

# リセットして再実行
supabase db reset
```

#### 2. Vercel環境変数が反映されない
- **解決**: Settings → Environment Variables → 各変数の **Edit** → **Save**

#### 3. ビルドエラー
```bash
# ローカルでビルドテスト
npm run build:staging

# エラー詳細確認
npm run type-check
npm run lint
```

#### 4. データベース接続エラー
- **確認点**: 
  - SUPABASE_URLが正しいか
  - ANON_KEYが正しいか
  - RLSポリシーが適用されているか

## 🎉 構築完了後の確認項目

### ✅ チェックリスト

#### Supabase
- [ ] ステージング用プロジェクト作成完了
- [ ] データベーススキーマ適用完了
- [ ] RLSポリシー動作確認
- [ ] 認証機能動作確認

#### Vercel
- [ ] ステージング用プロジェクト作成完了
- [ ] 環境変数設定完了
- [ ] developブランチからの自動デプロイ確認
- [ ] ビルド成功確認

#### 動作確認
- [ ] ステージングURLでアプリアクセス確認
- [ ] 認証機能動作確認
- [ ] データベース読み書き確認
- [ ] 画像アップロード機能確認

### 🌐 環境URL

構築完了後のURL：
- **ステージング**: `https://plantlog-staging.vercel.app`
- **開発**: `http://localhost:3000`

## 📚 次のステップ

1. **機能開発**: feature/*ブランチで新機能開発
2. **PR作成**: developブランチへのプルリクエスト
3. **ステージング確認**: 自動デプロイ後の動作確認
4. **本番リリース**: mainブランチへのマージ

## 🔗 関連ドキュメント

- [デプロイ戦略・方針](./deployment-strategy.md)
- [Supabaseローカル環境セットアップ](./supabase-local-setup.md)
- [データベース設計書](./database-design.md)

---

**📝 更新履歴**
- 2025年7月28日: 初版作成
- 必要に応じてアップデートすること