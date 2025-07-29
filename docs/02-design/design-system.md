# 植物観察アプリ - デザインシステム

## カラーパレット

### メインカラー
- **Primary Green**: `#22c55e` - アクション、アクセント、ブランドカラー
- **Primary Green Light**: `#22c55e/10` - 背景、通知エリア
- **Primary Green Dark**: `#16a34a` - ホバー状態

### グレースケール
- **Gray 900**: `#111827` - メインテキスト
- **Gray 700**: `#374151` - セカンダリテキスト
- **Gray 600**: `#4b5563` - 補助テキスト
- **Gray 500**: `#6b7280` - プレースホルダー
- **Gray 300**: `#d1d5db` - ボーダー、アイコン
- **Gray 200**: `#e5e7eb` - 軽いボーダー
- **Gray 100**: `#f3f4f6` - 背景
- **Gray 50**: `#f9fafb` - 薄い背景
- **White**: `#ffffff` - 背景

### 状態カラー
- **Success**: `#10b981` - 成功状態
- **Warning**: `#f59e0b` - 警告状態
- **Error**: `#ef4444` - エラー状態
- **Info**: `#3b82f6` - 情報状態

## タイポグラフィ

### フォント
- **メインフォント**: Inter, Noto Sans JP, sans-serif
- **フォールバック**: system-ui, -apple-system, sans-serif

### フォントサイズ
- **Headline 1**: `text-3xl` (30px) - ページタイトル
- **Headline 2**: `text-2xl` (24px) - セクションタイトル
- **Headline 3**: `text-xl` (20px) - サブセクション
- **Body Large**: `text-lg` (18px) - 重要なテキスト
- **Body**: `text-base` (16px) - 通常テキスト
- **Body Small**: `text-sm` (14px) - 補助テキスト
- **Caption**: `text-xs` (12px) - キャプション、ラベル

### フォントウェイト
- **Regular**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)

## スペーシング

### マージン・パディング
- **xs**: `2px` - 極小
- **sm**: `4px` - 小
- **md**: `8px` - 中
- **lg**: `16px` - 大
- **xl**: `24px` - 特大
- **2xl**: `32px` - 超大

### レイアウト
- **コンテナ幅**: 
  - Mobile: `max-w-sm` (384px)
  - Desktop: `max-w-6xl` (1152px)
- **セクション間隔**: `mb-12` (48px)
- **アイテム間隔**: `space-y-4` (16px)

## コンポーネント

### ボタン
- **Primary**: 緑背景、白文字
- **Secondary**: 白背景、グレーボーダー
- **Ghost**: 背景なし、テキストのみ
- **サイズ**: sm, md, lg

### フォーム
- **入力フィールド**: ボーダーボトムスタイル
- **フォーカス**: アクセントカラーのボーダー
- **エラー**: 赤いボーダーとメッセージ

### カード
- **ボーダー**: `border-gray-200`
- **背景**: `bg-white`
- **角丸**: `rounded-lg`
- **影**: `shadow-xs`

## アイコン

### サイズ
- **Small**: `w-4 h-4` (16px)
- **Medium**: `w-6 h-6` (24px)
- **Large**: `w-8 h-8` (32px)

### スタイル
- **ストローク**: 2px
- **カラー**: グレー系、アクション時はアクセントカラー

## レスポンシブブレークポイント

- **Mobile**: `< 1024px`
- **Desktop**: `>= 1024px` (`lg:`)

## アニメーション

### トランジション
- **デフォルト**: `transition-colors`
- **時間**: `duration-200`
- **イージング**: ease-in-out

### ホバー効果
- **ボタン**: 色の変化
- **カード**: ボーダーカラーの変化
- **リンク**: 色の変化