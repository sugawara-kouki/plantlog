# 植物観察アプリ - 認証設計書

## 概要

植物観察アプリのMVP認証システムの設計書です。Supabase Authを使用し、セキュアで使いやすい認証機能を実装します。

## 認証方式の選定

### MVP対応認証方法

#### 1. メール＋パスワード認証 【必須】
- **目的**: 基本的な認証方法として全ユーザーに対応
- **実装**: Supabase Auth標準機能
- **メリット**: 確実、すべてのユーザーが利用可能
- **デメリット**: パスワード管理の負担

#### 2. Google認証 【推奨】
- **目的**: UX向上、登録・ログインの簡素化
- **実装**: Supabase Auth + Google OAuth
- **メリット**: 高い普及率、セキュア、簡単なログイン
- **デメリット**: Google依存

#### 3. GitHub認証 【開発者向け】
- **目的**: 開発者コミュニティでの利用促進
- **実装**: Supabase Auth + GitHub OAuth
- **メリット**: 開発者に親しみやすい
- **デメリット**: 一般ユーザーの利用率が低い

### 将来検討する認証方法

#### フェーズ2以降
- **Magic Link認証**: パスワードレス認証
- **Apple認証**: iOS用户向け
- **LINE認証**: 日本市場向け
- **Microsoft認証**: ビジネス利用向け

## 認証フロー設計

### 1. 新規登録フロー

```
1. ユーザーが登録方法を選択
   ├─ メール＋パスワード
   ├─ Google
   └─ GitHub

2. 認証情報の入力・認証
   ├─ メール: メール確認が必要
   ├─ Google: OAuth認証
   └─ GitHub: OAuth認証

3. アカウント作成
   ├─ Supabase Authにユーザー情報保存
   ├─ プロフィール初期化
   └─ ウェルカムメール送信（任意）

4. 初回ログイン
   ├─ プロフィール設定画面へ
   └─ ダッシュボードへリダイレクト
```

### 2. ログインフロー

```
1. ユーザーがログイン方法を選択
   ├─ メール＋パスワード
   ├─ Google
   └─ GitHub

2. 認証
   ├─ メール: パスワード認証
   ├─ Google: OAuth認証
   └─ GitHub: OAuth認証

3. セッション確立
   ├─ JWTトークン発行
   ├─ セッション情報保存
   └─ ダッシュボードへリダイレクト
```

### 3. ログアウトフロー

```
1. ユーザーがログアウト
2. セッション無効化
3. ログイン画面へリダイレクト
```

### 4. パスワードリセットフロー

```
1. 「パスワードを忘れた」リンクをクリック
2. メールアドレス入力
3. リセットメール送信
4. リセットリンクをクリック
5. 新しいパスワード設定
6. ログイン画面へリダイレクト
```

## データベース設計

### ユーザー管理

Supabase Authが自動的に管理するテーブル：
- `auth.users`: 基本的なユーザー情報
- `auth.sessions`: セッション情報
- `auth.identities`: 認証プロバイダー情報

### カスタムプロフィールテーブル

```sql
-- ユーザープロフィールテーブル
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS (Row Level Security) 設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ポリシー: ユーザーは自分のプロフィールのみ読み書き可能
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

### 既存テーブルの修正

```sql
-- 植物テーブルにuser_id追加
ALTER TABLE plants ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 観察記録テーブルにuser_id追加
ALTER TABLE observation_records ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 水やり記録テーブルにuser_id追加
ALTER TABLE watering_records ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
```

## セキュリティ設計

### 1. Row Level Security (RLS)

```sql
-- 植物テーブルのRLS
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plants" ON plants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plants" ON plants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plants" ON plants
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plants" ON plants
    FOR DELETE USING (auth.uid() = user_id);

-- 観察記録テーブルのRLS
ALTER TABLE observation_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own observation records" ON observation_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own observation records" ON observation_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own observation records" ON observation_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own observation records" ON observation_records
    FOR DELETE USING (auth.uid() = user_id);

-- 水やり記録テーブルのRLS
ALTER TABLE watering_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watering records" ON watering_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watering records" ON watering_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watering records" ON watering_records
    FOR DELETE USING (auth.uid() = user_id);
```

### 2. フロントエンド認証ガード

```javascript
// 認証が必要なページの保護
const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

// 認証済みユーザーの制限
const GuestGuard = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (user) return <Navigate to="/dashboard" />;
  
  return children;
};
```

### 3. APIセキュリティ

```javascript
// Supabase クライアント設定
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// 認証トークンの自動付与
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    // セッション情報を保存
    localStorage.setItem('supabase.auth.token', session.access_token);
  } else {
    // セッション情報をクリア
    localStorage.removeItem('supabase.auth.token');
  }
});
```

## UI/UX設計

### 1. 認証ページ構成

```
/auth/
├── login          # ログインページ
├── register       # 新規登録ページ
├── forgot-password # パスワードリセット
├── reset-password # パスワードリセット実行
└── callback       # OAuth認証後のコールバック
```

### 2. ログインページ

```jsx
const LoginPage = () => {
  return (
    <div className="auth-container">
      <h1>ログイン</h1>
      
      {/* メール認証 */}
      <form onSubmit={handleEmailLogin}>
        <input type="email" placeholder="メールアドレス" />
        <input type="password" placeholder="パスワード" />
        <button type="submit">ログイン</button>
      </form>
      
      {/* ソーシャルログイン */}
      <div className="social-login">
        <button onClick={handleGoogleLogin}>
          Googleでログイン
        </button>
        <button onClick={handleGitHubLogin}>
          GitHubでログイン
        </button>
      </div>
      
      {/* リンク */}
      <Link to="/auth/register">新規登録</Link>
      <Link to="/auth/forgot-password">パスワードを忘れた方</Link>
    </div>
  );
};
```

### 3. レスポンシブ対応

```css
/* モバイル優先 */
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

/* PC対応 */
@media (min-width: 1024px) {
  .auth-container {
    max-width: 500px;
    padding: 3rem;
  }
}
```

## 実装技術スタック

### フロントエンド
- **React**: UIフレームワーク
- **@supabase/supabase-js**: Supabaseクライアント
- **React Router**: ルーティング
- **React Hook Form**: フォーム管理
- **React Query**: データ取得・キャッシュ

### バックエンド
- **Supabase Auth**: 認証サービス
- **PostgreSQL**: データベース
- **Row Level Security**: データ保護

## 設定・環境変数

```env
# Supabase設定
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth設定
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
```

## エラーハンドリング

### 認証エラー種別
- **Invalid credentials**: 認証情報が正しくない
- **Email not confirmed**: メール確認が未完了
- **User not found**: ユーザーが存在しない
- **Network error**: ネットワーク接続エラー

### エラー表示
```jsx
const AuthError = ({ error }) => {
  const errorMessages = {
    'Invalid credentials': 'メールアドレスまたはパスワードが正しくありません',
    'Email not confirmed': 'メールアドレスの確認が必要です',
    'User not found': 'ユーザーが見つかりません',
    'Network error': '接続に失敗しました。再度お試しください'
  };

  return (
    <div className="error-message">
      {errorMessages[error] || '認証エラーが発生しました'}
    </div>
  );
};
```

## 開発・テスト

### 開発環境
- **ローカル開発**: Supabase Local Development
- **テスト**: Jest + React Testing Library
- **E2Eテスト**: Cypress（認証フローのテスト）

### テスト項目
1. **単体テスト**
   - 認証コンポーネントのテスト
   - 認証フックのテスト
   - バリデーション機能のテスト

2. **統合テスト**
   - 認証フローの動作確認
   - RLSポリシーの動作確認
   - OAuth認証の動作確認

3. **E2Eテスト**
   - ユーザー登録からログインまでの一連の流れ
   - パスワードリセットの動作確認
   - ソーシャルログインの動作確認

## 運用・保守

### 監視項目
- **認証成功率**: 認証の成功・失敗率
- **レスポンス時間**: 認証処理の応答時間
- **エラー発生率**: 各種エラーの発生頻度
- **アクティブユーザー数**: 日次・月次のアクティブユーザー

### セキュリティ対策
- **定期的なパスワード変更の推奨**
- **不正アクセスの検知・通知**
- **セッション管理の最適化**
- **OAuth設定の定期的な見直し**

## 今後の拡張予定

### フェーズ2
- **Magic Link認証**: パスワードレス認証
- **二要素認証 (MFA)**: セキュリティ強化
- **Apple認証**: iOS用户向け

### フェーズ3
- **SSO対応**: 企業向け機能
- **権限管理**: 管理者・一般ユーザーの区別
- **プライバシー設定**: 詳細なプライバシー制御

この認証設計により、セキュアで使いやすい認証システムを構築し、ユーザーの利便性とデータ保護を両立できます。