# コンポーネント設計書

## 共通コンポーネント

### 1. Header
**責任**: アプリケーション全体のヘッダー表示

**Props**:
```typescript
interface HeaderProps {
  user: {
    name: string;
    avatar?: string;
  };
  showNavigation?: boolean;
  onMenuClick?: () => void;
}
```

**機能**:
- ロゴとタイトル表示
- ユーザープロフィール表示
- デスクトップナビゲーション
- レスポンシブ対応

### 2. BottomNavigation
**責任**: モバイル用のボトムナビゲーション

**Props**:
```typescript
interface BottomNavigationProps {
  activeTab: 'home' | 'plants' | 'record' | 'watering';
  onTabChange: (tab: string) => void;
}
```

**機能**:
- 4つのタブ表示
- アクティブ状態の管理
- アイコンとラベル表示

### 3. Button
**責任**: 再利用可能なボタンコンポーネント

**Props**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**バリエーション**:
- Primary: 緑背景、白文字
- Secondary: 白背景、グレーボーダー
- Ghost: 背景なし、テキストのみ

### 4. Input
**責任**: フォーム入力フィールド

**Props**:
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'date';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}
```

**機能**:
- ボーダーボトムスタイル
- エラー状態の表示
- フォーカス時のアクセントカラー

### 5. Card
**責任**: コンテンツのカードレイアウト

**Props**:
```typescript
interface CardProps {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
```

**機能**:
- 角丸、影付きのカード
- ホバー効果
- クリック可能なバリエーション

## 機能別コンポーネント

### 1. PlantCard
**責任**: 植物情報の表示

**Props**:
```typescript
interface PlantCardProps {
  plant: {
    id: string;
    name: string;
    type: string;
    purchaseDate: string;
    lastRecord: string;
    status: 'healthy' | 'needs_water' | 'concern';
    image?: string;
  };
  onEdit?: (id: string) => void;
  onWater?: (id: string) => void;
  onRecord?: (id: string) => void;
}
```

**機能**:
- 植物の基本情報表示
- ステータスバッジ
- アクションボタン
- 画像表示

### 2. WelcomeCard
**責任**: ホーム画面の歓迎カード

**Props**:
```typescript
interface WelcomeCardProps {
  userName: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}
```

**機能**:
- 時間帯に応じた挨拶
- グラデーション背景
- アイコン表示

### 3. TaskCard
**責任**: 今日のタスク表示

**Props**:
```typescript
interface TaskCardProps {
  tasks: {
    id: string;
    type: 'watering' | 'recording';
    plantName: string;
    dueDate: string;
  }[];
  onComplete: (taskId: string) => void;
}
```

**機能**:
- タスクリスト表示
- 完了ボタン
- 植物アイコン

### 4. StatisticsCard
**責任**: 統計情報の表示

**Props**:
```typescript
interface StatisticsCardProps {
  stats: {
    totalPlants: number;
    monthlyRecords: number;
    upcomingWatering: number;
  };
}
```

**機能**:
- 数値の表示
- アイコン付きの統計項目
- 強調表示

### 5. ActivityFeed
**責任**: 最近のアクティビティ表示

**Props**:
```typescript
interface ActivityFeedProps {
  activities: {
    id: string;
    type: 'watering' | 'recording' | 'registration';
    plantName: string;
    timestamp: string;
  }[];
}
```

**機能**:
- 時系列でのアクティビティ表示
- アイコン付きの項目
- タイムスタンプ

## フォームコンポーネント

### 1. PlantRegistrationForm
**責任**: 植物登録フォーム

**Props**:
```typescript
interface PlantRegistrationFormProps {
  onSubmit: (data: PlantData) => void;
  loading?: boolean;
}
```

**機能**:
- 植物情報の入力
- 画像アップロード
- バリデーション
- 送信処理

### 2. RecordingForm
**責任**: 観察記録フォーム

**Props**:
```typescript
interface RecordingFormProps {
  plantId: string;
  onSubmit: (data: RecordData) => void;
  loading?: boolean;
}
```

**機能**:
- 観察データの入力
- 写真撮影・アップロード
- 測定値入力
- メモ機能

## レイアウトコンポーネント

### 1. PageLayout
**責任**: 基本ページレイアウト

**Props**:
```typescript
interface PageLayoutProps {
  title: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  children: React.ReactNode;
}
```

**機能**:
- ヘッダー、メインコンテンツ、フッター
- レスポンシブデザイン
- 戻るボタン

### 2. GridLayout
**責任**: グリッドレイアウト

**Props**:
```typescript
interface GridLayoutProps {
  columns: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**機能**:
- レスポンシブグリッド
- 可変カラム数
- ギャップ調整

## 状態管理

### Context
- **AuthContext**: 認証状態
- **PlantContext**: 植物データ
- **ThemeContext**: テーマ設定

### Custom Hooks
- **useAuth**: 認証機能
- **usePlants**: 植物管理
- **useRecords**: 記録管理
- **useWatering**: 水やり管理

## アニメーション

### トランジション
- **フェードイン**: 0.2秒
- **スライドイン**: 0.3秒
- **ホバー**: 0.15秒

### インタラクション
- **ボタンクリック**: スケール効果
- **カードホバー**: 影の変化
- **フォーカス**: ボーダー色変化