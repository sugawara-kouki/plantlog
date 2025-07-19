# Next.js コンポーネント設計 - 植物観察アプリ

## プロジェクト構成

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証グループ
│   │   ├── login/
│   │   │   └── page.tsx          # ログインページ
│   │   └── signup/
│   │       └── page.tsx          # サインアップページ
│   ├── (dashboard)/              # 認証後ダッシュボードグループ
│   │   ├── layout.tsx            # ダッシュボードレイアウト
│   │   ├── page.tsx              # ホームページ
│   │   ├── plants/
│   │   │   ├── page.tsx          # 植物一覧ページ
│   │   │   ├── register/
│   │   │   │   └── page.tsx      # 植物登録ページ
│   │   │   └── [id]/
│   │   │       └── page.tsx      # 植物詳細ページ
│   │   ├── records/
│   │   │   ├── page.tsx          # 観察記録一覧
│   │   │   └── new/
│   │   │       └── page.tsx      # 観察記録作成
│   │   └── watering/
│   │       └── page.tsx          # 水やり管理ページ
│   ├── globals.css               # グローバルスタイル
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # ルートページ（リダイレクト）
├── components/                   # 再利用可能コンポーネント
│   ├── ui/                       # UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Avatar.tsx
│   │   └── Badge.tsx
│   ├── forms/                    # フォームコンポーネント
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── PlantRegistrationForm.tsx
│   │   └── ObservationForm.tsx
│   ├── layout/                   # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── BottomNavigation.tsx
│   │   └── Sidebar.tsx
│   ├── plant/                    # 植物関連コンポーネント
│   │   ├── PlantCard.tsx
│   │   ├── PlantList.tsx
│   │   ├── PlantStats.tsx
│   │   └── PhotoUpload.tsx
│   └── dashboard/                # ダッシュボード専用コンポーネント
│       ├── WelcomeSection.tsx
│       ├── QuickActions.tsx
│       ├── TodaysTasks.tsx
│       ├── Statistics.tsx
│       └── RecentActivity.tsx
├── lib/                          # ユーティリティ・設定
│   ├── auth.ts                   # 認証関連
│   ├── supabase.ts               # Supabase設定
│   ├── utils.ts                  # 汎用ユーティリティ
│   └── types.ts                  # TypeScript型定義
├── hooks/                        # カスタムフック
│   ├── useAuth.ts                # 認証フック
│   ├── usePlants.ts              # 植物データフック
│   └── useWatering.ts            # 水やりフック
└── styles/                       # スタイル関連
    └── globals.css               # Tailwind CSS設定
```

## コア型定義

```typescript
// lib/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Plant {
  id: string;
  user_id: string;
  name: string;
  type: string;
  purchase_date: string;
  height?: number;
  photo_url?: string;
  watering_frequency: number;
  last_watered?: string;
  next_watering?: string;
  status: 'healthy' | 'warning' | 'needs_attention';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ObservationRecord {
  id: string;
  plant_id: string;
  user_id: string;
  observation_date: string;
  height?: number;
  condition: string;
  notes?: string;
  photos: string[];
  created_at: string;
}

export interface WateringRecord {
  id: string;
  plant_id: string;
  user_id: string;
  watered_at: string;
  notes?: string;
}
```

## 認証レイアウト設計

### AuthLayout
```typescript
// app/(auth)/layout.tsx
interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-linear-to-br from-primary/5 to-primary/10 min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md px-6">
        <AppLogo />
        {children}
      </div>
    </div>
  );
}
```

### LoginForm
```typescript
// components/forms/LoginForm.tsx
interface LoginFormProps {
  onSubmit: (data: LoginData) => Promise<void>;
  loading?: boolean;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  // React Hook Form実装
  // バリデーション
  // ソーシャルログイン（Google, GitHub）
}
```

## ダッシュボードレイアウト設計

### DashboardLayout
```typescript
// app/(dashboard)/layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="max-w-sm mx-auto px-4 py-6 lg:max-w-6xl lg:px-8 lg:py-8">
        {children}
      </main>
      <BottomNavigation className="lg:hidden" />
      <div className="h-20 lg:hidden" />
    </div>
  );
}
```

### Header
```typescript
// components/layout/Header.tsx
interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, showBack, actions }: HeaderProps) {
  // レスポンシブ対応
  // ナビゲーション
  // ユーザープロフィール
  // アクションボタン
}
```

### BottomNavigation
```typescript
// components/layout/BottomNavigation.tsx
interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'ホーム', icon: HomeIcon },
  { href: '/plants', label: '植物', icon: PlantIcon },
  { href: '/records', label: '記録', icon: EditIcon },
  { href: '/watering', label: '水やり', icon: WateringIcon },
];

export function BottomNavigation({ className }: { className?: string }) {
  // モバイル専用ナビゲーション
  // アクティブ状態管理
}
```

## ホームページコンポーネント

### WelcomeSection
```typescript
// components/dashboard/WelcomeSection.tsx
interface WelcomeSectionProps {
  userName: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

export function WelcomeSection({ userName, timeOfDay }: WelcomeSectionProps) {
  // 時間帯に応じた挨拶
  // グラデーション背景
  // アニメーション効果
}
```

### TodaysTasks
```typescript
// components/dashboard/TodaysTasks.tsx
interface Task {
  id: string;
  type: 'watering' | 'observation';
  plantName: string;
  plantId: string;
  dueDate: string;
}

interface TodaysTasksProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

export function TodaysTasks({ tasks, onCompleteTask }: TodaysTasksProps) {
  // 今日のタスク表示
  // タスク完了機能
  // 優先度表示
}
```

### QuickActions
```typescript
// components/dashboard/QuickActions.tsx
interface QuickAction {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'primary' | 'secondary';
}

const quickActions: QuickAction[] = [
  { label: '植物を登録', href: '/plants/register', icon: PlusIcon, variant: 'primary' },
  { label: '記録する', href: '/records/new', icon: EditIcon, variant: 'secondary' },
];

export function QuickActions() {
  // デスクトップ：サイドバー表示
  // モバイル：グリッド表示
}
```

## 植物関連コンポーネント

### PlantCard
```typescript
// components/plant/PlantCard.tsx
interface PlantCardProps {
  plant: Plant;
  variant: 'default' | 'compact' | 'detailed';
  onEdit?: (plantId: string) => void;
  onWater?: (plantId: string) => void;
  onRecord?: (plantId: string) => void;
}

export function PlantCard({ plant, variant, onEdit, onWater, onRecord }: PlantCardProps) {
  // 植物情報表示
  // ステータスバッジ
  // 進捗バー
  // アクションボタン
  // レスポンシブ対応
}
```

### PlantList
```typescript
// components/plant/PlantList.tsx
interface PlantListProps {
  plants: Plant[];
  loading?: boolean;
  onFilter?: (filter: PlantFilter) => void;
  onSort?: (sort: PlantSort) => void;
}

interface PlantFilter {
  status?: Plant['status'];
  needsWatering?: boolean;
  search?: string;
}

export function PlantList({ plants, loading, onFilter, onSort }: PlantListProps) {
  // フィルタリング機能
  // ソート機能
  // 検索機能
  // グリッド/リスト表示切り替え
}
```

### PhotoUpload
```typescript
// components/plant/PhotoUpload.tsx
interface PhotoUploadProps {
  onUpload: (files: File[]) => Promise<string[]>;
  maxFiles?: number;
  acceptedTypes?: string[];
  loading?: boolean;
}

export function PhotoUpload({ onUpload, maxFiles = 1, acceptedTypes, loading }: PhotoUploadProps) {
  // ドラッグ&ドロップ
  // プレビュー機能
  // 圧縮機能
  // プログレス表示
}
```

## フォームコンポーネント

### PlantRegistrationForm
```typescript
// components/forms/PlantRegistrationForm.tsx
interface PlantRegistrationData {
  name: string;
  type: string;
  purchaseDate: string;
  height?: number;
  wateringFrequency: number;
  firstWateringDate?: string;
  notes?: string;
  photos: File[];
}

interface PlantRegistrationFormProps {
  onSubmit: (data: PlantRegistrationData) => Promise<void>;
  loading?: boolean;
}

export function PlantRegistrationForm({ onSubmit, loading }: PlantRegistrationFormProps) {
  // ステップ形式
  // バリデーション
  // 下書き保存
  // 写真アップロード
}
```

### ObservationForm
```typescript
// components/forms/ObservationForm.tsx
interface ObservationData {
  plantId: string;
  observationDate: string;
  height?: number;
  condition: string;
  notes?: string;
  photos: File[];
}

interface ObservationFormProps {
  plantId: string;
  onSubmit: (data: ObservationData) => Promise<void>;
  loading?: boolean;
}

export function ObservationForm({ plantId, onSubmit, loading }: ObservationFormProps) {
  // 植物選択
  // 観察項目入力
  // 写真撮影・アップロード
  // 過去データ参照
}
```

## UIコンポーネント

### Button
```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Button({ variant, size, loading, icon: Icon, children, ...props }: ButtonProps) {
  // バリアント対応
  // ローディング状態
  // アイコン対応
  // アクセシビリティ
}
```

### Input
```typescript
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  helper?: string;
}

export function Input({ label, error, icon: Icon, helper, ...props }: InputProps) {
  // ラベル表示
  // エラー表示
  // ヘルパーテキスト
  // アイコン対応
}
```

### Card
```typescript
// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  variant: 'default' | 'elevated' | 'bordered';
  padding: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Card({ children, variant, padding, className, onClick }: CardProps) {
  // バリアント対応
  // ホバー効果
  // クリック対応
  // シャドウ効果
}
```

## カスタムフック

### useAuth
```typescript
// hooks/useAuth.ts
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  // Supabase Auth連携
  // セッション管理
  // エラーハンドリング
  // リダイレクト処理
}
```

### usePlants
```typescript
// hooks/usePlants.ts
interface PlantsState {
  plants: Plant[];
  loading: boolean;
  error: string | null;
}

interface PlantsActions {
  fetchPlants: () => Promise<void>;
  createPlant: (data: Omit<Plant, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePlant: (id: string, data: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  waterPlant: (id: string) => Promise<void>;
}

export function usePlants(): PlantsState & PlantsActions {
  // CRUD操作
  // リアルタイム更新
  // キャッシュ管理
  // オプティミスティック更新
}
```

## レスポンシブ対応

### ブレークポイント
- **モバイル**: `< 1024px` - スマートフォン最適化
- **デスクトップ**: `>= 1024px` - デスクトップ最適化

### レイアウト戦略
1. **モバイルファースト**: 基本スタイルはモバイル向け
2. **プログレッシブエンハンスメント**: `lg:` プレフィックスでデスクトップ拡張
3. **コンテナ幅**: モバイル `max-w-sm`、デスクトップ `max-w-6xl`

### コンポーネント適応例
```typescript
// レスポンシブクラス適用例
className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6"
className="px-4 py-6 lg:px-8 lg:py-8"
className="text-xl lg:text-2xl"
```

## 状態管理

### ローカル状態
- React Hook Form（フォーム）
- useState（コンポーネント内状態）

### グローバル状態
- React Query（サーバー状態）
- Context API（認証状態）
- Zustand（クライアント状態）

### データフロー
```
User Action → Component → Custom Hook → API Call → State Update → UI Re-render
```

## パフォーマンス最適化

### コンポーネント最適化
- React.memo（props変更時のみ再レンダリング）
- useMemo（重い計算のメモ化）
- useCallback（関数のメモ化）

### 画像最適化
- Next.js Image コンポーネント
- 遅延読み込み
- WebP対応

### バンドル最適化
- 動的インポート
- コード分割
- Tree shaking

## セキュリティ

### 認証
- Supabase Row Level Security（RLS）
- JWT トークン
- セッション管理

### データ検証
- Zod スキーマ検証
- サニタイゼーション
- XSS対策

### 環境変数
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
```

## テスト戦略

### 単体テスト
- Jest + React Testing Library
- コンポーネントテスト
- フックテスト

### 統合テスト
- API連携テスト
- 認証フローテスト
- フォーム送信テスト

### E2Eテスト
- Playwright
- ユーザージャーニー全体
- クロスブラウザテスト

## 開発環境

### 依存関係
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.0.0",
    "tailwindcss": "^3.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 設定ファイル
- `tailwind.config.js` - Tailwind CSS設定
- `next.config.js` - Next.js設定
- `tsconfig.json` - TypeScript設定
- `.eslintrc.json` - ESLint設定

この設計により、既存のHTMLプロトタイプを完全にNext.jsコンポーネントに移行し、スケーラブルで保守性の高いアプリケーションを構築できます。