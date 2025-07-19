# Supabase ローカル開発環境セットアップガイド

## 概要

Supabase はローカル開発環境を提供しており、完全な Supabase スタック（PostgreSQL、Auth、Storage、Edge Functions、Realtime）をローカルマシンで実行できます。

## 前提条件

### 必要なツール

- **Docker** - Supabase サービスをコンテナで実行
- **Git** - バージョン管理（推奨）
- **Node.js** - Next.js アプリケーション開発用

### 現在の環境確認

```bash
# Docker確認
docker --version
# Docker version 28.3.0, build 38b7060a21 ✅ インストール済み

# Node.js確認
node --version
npm --version
```

## Supabase CLI インストール

### macOS（推奨）

```bash
# Homebrewでインストール
brew install supabase/tap/supabase

# インストール確認
supabase --version
```

### その他の方法

```bash
# NPMでインストール
npm install -g supabase

# またはYarnで
yarn global add supabase
```

## プロジェクト初期化

### 1. プロジェクトディレクトリで初期化

```bash
cd /Users/k-sugawara/work/Study/plantlog

# Supabaseプロジェクト初期化
supabase init
```

これにより以下のディレクトリ構造が作成されます：

```
plantlog/
├── supabase/
│   ├── config.toml          # Supabase設定
│   ├── seed.sql             # 初期データ
│   └── migrations/          # データベースマイグレーション
└── ...
```

### 2. ローカル Supabase サーバー起動

```bash
# 初回起動（Dockerイメージのダウンロードあり）
supabase start

# 出力例：
# Started supabase local development setup.
#          API URL: http://localhost:54321
#       GraphQL URL: http://localhost:54321/graphql/v1
#           DB URL: postgresql://postgres:postgres@localhost:54322/postgres
#       Studio URL: http://localhost:54323
#      Inbucket URL: http://localhost:54324
#         JWT secret: your-jwt-secret
#            anon key: your-anon-key
# service_role key: your-service-role-key
```

## データベーススキーマ設定

### 1. 植物観察アプリ用スキーマ適用

```bash
# 既存のスキーマファイルを使用
cp docs/database-schema.sql supabase/migrations/20240101000000_initial_schema.sql

# マイグレーション実行
supabase db reset
```

### 2. Row Level Security (RLS) 設定

```sql
-- supabase/migrations/20240101000001_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE observation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE watering_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- User profiles policy
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Plants policies
CREATE POLICY "Users can view own plants" ON plants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plants" ON plants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plants" ON plants
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plants" ON plants
    FOR DELETE USING (auth.uid() = user_id);

-- Observation records policies
CREATE POLICY "Users can view own observations" ON observation_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own observations" ON observation_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Watering records policies
CREATE POLICY "Users can view own watering records" ON watering_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watering records" ON watering_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Photos policies
CREATE POLICY "Users can view own photos" ON photos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos" ON photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. 初期データ投入

```sql
-- supabase/seed.sql

-- サンプル植物タイプ
INSERT INTO plant_types (name, description, default_watering_frequency) VALUES
('モンステラ', '大きな葉が特徴的な観葉植物', 7),
('サンセベリア', '丈夫で育てやすい多肉植物', 14),
('ポトス', 'つる性で成長が早い観葉植物', 5),
('フィカス', 'ゴムの木として親しまれる観葉植物', 7),
('フィロデンドロン', 'モンステラに似た葉を持つ観葉植物', 7);

-- テストユーザー（開発用）
-- Note: 実際のuser_idはSupabase Authで自動生成される
```

## 認証設定

### 1. 認証プロバイダー設定

```toml
# supabase/config.toml

[auth]
enabled = true
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails. If not provided, defaults to the Studio URL.
site_url = "http://localhost:3000"
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://localhost:3000"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604800 (1 week).
jwt_expiry = 3600
# Allow/disallow new user signups to your project.
enable_signup = true

[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email addresses.
double_confirm_changes = true
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false

# Use an external SMTP server
[auth.email.smtp]
host = "localhost"
port = 54324
user = ""
pass = ""
admin_email = ""
sender_name = ""

# Uncomment to customize email template
# [auth.email.template.invite]
# subject = "You have been invited"
# content_path = "./supabase/templates/invite.html"

[auth.external.google]
enabled = true
client_id = "your-google-client-id"
secret = "your-google-client-secret"
# Overrides the default auth redirectUrl.
redirect_uri = "http://localhost:54321/auth/v1/callback"

[auth.external.github]
enabled = true
client_id = "your-github-client-id"
secret = "your-github-client-secret"
# Overrides the default auth redirectUrl.
redirect_uri = "http://localhost:54321/auth/v1/callback"
```

### 2. OAuth 設定（本番環境用）

#### Google OAuth 設定

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクト作成
2. OAuth 2.0 クライアント ID 作成
3. 承認済みリダイレクト URI に追加：
   - ローカル: `http://localhost:54321/auth/v1/callback`
   - 本番: `https://your-project.supabase.co/auth/v1/callback`

#### GitHub OAuth 設定

1. GitHub の設定 > Developer settings > OAuth Apps
2. 新しい OAuth App を作成
3. Authorization callback URL を設定：
   - ローカル: `http://localhost:54321/auth/v1/callback`
   - 本番: `https://your-project.supabase.co/auth/v1/callback`

## Next.js 環境設定

### 1. 環境変数設定

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id

# 本番環境用（.env.production）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
```

### 2. Supabase クライアント設定

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

## よく使うコマンド

### 基本操作

```bash
# ローカルSupabase起動
supabase start

# ローカルSupabase停止
supabase stop

# 状態確認
supabase status

# データベースリセット（全マイグレーション再実行）
supabase db reset
```

### 開発作業

```bash
# TypeScript型定義生成
supabase gen types typescript --local > lib/database.types.ts

# マイグレーション作成
supabase migration new add_new_feature

# データベースダンプ作成
supabase db dump --local -f backup.sql

# シードデータ実行
supabase seed --local
```

### 本番環境連携

```bash
# 本番プロジェクトへのログイン
supabase login

# 本番プロジェクトと連携
supabase link --project-ref your-project-id

# ローカル変更を本番に適用
supabase db push

# 本番データを取得
supabase db pull
```

## ローカル環境の URL

### 開発中にアクセスする URL

- **API**: http://localhost:54321
- **Supabase Studio**: http://localhost:54323 (データベース管理 UI)
- **Inbucket**: http://localhost:54324 (メール確認用)
- **PostgreSQL**: postgresql://postgres:postgres@localhost:54322/postgres

### Next.js アプリケーション

- **開発サーバー**: http://localhost:3000

## トラブルシューティング

### よくある問題と解決方法

#### Docker 関連

```bash
# Docker デーモンが起動していない場合
# macOS: Docker Desktopを起動

# ポートが使用中の場合
supabase stop
docker system prune -f
supabase start
```

#### マイグレーション関連

```bash
# マイグレーションエラーの場合
supabase db reset --debug

# スキーマの不整合
supabase migration repair 20240101000000
```

#### 認証関連

```bash
# JWT設定確認
supabase status

# 認証テスト
curl -X POST 'http://localhost:54321/auth/v1/signup' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## 開発ワークフロー

### 日常的な開発フロー

1. **開発開始**

   ```bash
   supabase start
   npm run dev
   ```

2. **データベース変更**

   ```bash
   supabase migration new feature_name
   # SQL作成後
   supabase db reset
   ```

3. **型定義更新**

   ```bash
   supabase gen types typescript --local > lib/database.types.ts
   ```

4. **開発終了**
   ```bash
   supabase stop
   ```

### 本番デプロイ前

1. **ローカルテスト**

   ```bash
   npm run build
   npm run start
   ```

2. **本番環境への適用**
   ```bash
   supabase db push
   supabase functions deploy
   ```

この設定により、完全なローカル開発環境で Supabase を使用した植物観察アプリの開発が可能になります。
