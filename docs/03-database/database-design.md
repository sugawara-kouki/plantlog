# 植物観察アプリ - データベース設計書

## 概要

植物観察アプリのMVP機能要件に基づいたデータベース設計書です。PostgreSQLを使用し、植物管理・観察記録・水やり管理の機能を効率的にサポートするスキーマを定義しています。

## ER図

```
Plants (植物)
├── id (PK)
├── name
├── type
├── purchase_date
├── height
├── memo
├── watering_schedule
├── last_watering_date
├── next_watering_date
├── current_status
├── created_at
└── updated_at

Observation_Records (観察記録)
├── id (PK)
├── plant_id (FK → Plants.id)
├── observation_date
├── height
├── watered
├── memo
├── status
├── created_at
└── updated_at

Watering_Records (水やり記録)
├── id (PK)
├── plant_id (FK → Plants.id)
├── watering_date
└── created_at

Photos (写真)
├── id (PK)
├── plant_id (FK → Plants.id) [植物写真の場合]
├── observation_id (FK → Observation_Records.id) [観察写真の場合]
├── file_path
├── file_name
├── file_size
├── mime_type
└── created_at

Edit_History (編集履歴)
├── id (PK)
├── observation_id (FK → Observation_Records.id)
├── field_name
├── old_value
├── new_value
└── created_at
```

## リレーションシップ

```
Plants 1:N Observation_Records
Plants 1:N Watering_Records
Plants 1:N Photos (植物写真)
Observation_Records 1:N Photos (観察写真)
Observation_Records 1:N Edit_History
```

## テーブル設計詳細

### 1. Plants（植物テーブル）

植物の基本情報を管理するマスターテーブル。

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 植物ID（自動採番） |
| name | VARCHAR(255) | NOT NULL | 植物名 |
| type | VARCHAR(100) | NULL | 植物の種類 |
| purchase_date | DATE | NULL | 購入日 |
| height | INTEGER | NULL | 高さ（cm） |
| memo | TEXT | NULL | メモ |
| watering_schedule | INTEGER | NOT NULL, CHECK(3,5,7,10,14) | 水やり頻度（日数） |
| last_watering_date | DATE | NULL | 最終水やり日 |
| next_watering_date | DATE | NULL | 次回水やり予定日 |
| current_status | VARCHAR(20) | DEFAULT '普通' | 現在の状態 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**制約条件:**
- watering_schedule: 3, 5, 7, 10, 14のいずれかの値
- current_status: '元気', '普通', '元気がない', '心配'のいずれか

### 2. Observation_Records（観察記録テーブル）

日々の植物観察記録を管理するテーブル。

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 観察記録ID（自動採番） |
| plant_id | INTEGER | NOT NULL, FK | 植物ID |
| observation_date | TIMESTAMP WITH TIME ZONE | NOT NULL | 観察日時 |
| height | INTEGER | NULL | 測定した高さ（cm） |
| watered | BOOLEAN | DEFAULT FALSE | 水やり実施有無 |
| memo | TEXT | NULL | 観察メモ |
| status | VARCHAR(20) | NOT NULL | 植物の状態評価 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**制約条件:**
- plant_id: plantsテーブルのidを参照
- status: '元気', '普通', '元気がない', '心配'のいずれか

### 3. Watering_Records（水やり記録テーブル）

水やり実施記録を管理するテーブル。

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 水やり記録ID（自動採番） |
| plant_id | INTEGER | NOT NULL, FK | 植物ID |
| watering_date | DATE | NOT NULL | 水やり実施日 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**制約条件:**
- plant_id: plantsテーブルのidを参照

### 4. Photos（写真テーブル）

植物写真と観察写真を管理するテーブル。

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 写真ID（自動採番） |
| plant_id | INTEGER | NULL, FK | 植物ID（植物写真の場合） |
| observation_id | INTEGER | NULL, FK | 観察記録ID（観察写真の場合） |
| file_path | VARCHAR(500) | NOT NULL | ファイルパス |
| file_name | VARCHAR(255) | NOT NULL | ファイル名 |
| file_size | INTEGER | NOT NULL | ファイルサイズ（byte） |
| mime_type | VARCHAR(100) | NOT NULL | MIMEタイプ |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**制約条件:**
- plant_id: plantsテーブルのidを参照
- observation_id: observation_recordsテーブルのidを参照
- CHECK制約: plant_idまたはobservation_idのいずれか一方のみNOT NULL

### 5. Edit_History（編集履歴テーブル）

観察記録の編集履歴を管理するテーブル。

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 編集履歴ID（自動採番） |
| observation_id | INTEGER | NOT NULL, FK | 観察記録ID |
| field_name | VARCHAR(100) | NOT NULL | 編集されたフィールド名 |
| old_value | TEXT | NULL | 編集前の値 |
| new_value | TEXT | NULL | 編集後の値 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 編集日時 |

**制約条件:**
- observation_id: observation_recordsテーブルのidを参照

## インデックス設計

### 主要なインデックス

```sql
-- 植物検索用
CREATE INDEX idx_plants_name ON plants(name);
CREATE INDEX idx_plants_next_watering_date ON plants(next_watering_date);

-- 観察記録検索用
CREATE INDEX idx_observation_records_plant_id ON observation_records(plant_id);
CREATE INDEX idx_observation_records_observation_date ON observation_records(observation_date);

-- 水やり記録検索用
CREATE INDEX idx_watering_records_plant_id ON watering_records(plant_id);
CREATE INDEX idx_watering_records_watering_date ON watering_records(watering_date);

-- 写真検索用
CREATE INDEX idx_photos_plant_id ON photos(plant_id);
CREATE INDEX idx_photos_observation_id ON photos(observation_id);

-- 編集履歴検索用
CREATE INDEX idx_edit_history_observation_id ON edit_history(observation_id);
```

## トリガー設計

### 1. 自動更新トリガー

```sql
-- updated_at自動更新
CREATE TRIGGER update_plants_updated_at 
    BEFORE UPDATE ON plants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_observation_records_updated_at 
    BEFORE UPDATE ON observation_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. ビジネスロジックトリガー

```sql
-- 水やり予定日自動更新
CREATE TRIGGER update_next_watering_date
    AFTER INSERT ON watering_records
    FOR EACH ROW EXECUTE FUNCTION calculate_next_watering_date();

-- 植物状態自動更新
CREATE TRIGGER update_plant_current_status
    AFTER INSERT ON observation_records
    FOR EACH ROW EXECUTE FUNCTION update_plant_status();
```

## セキュリティ設計

### 1. アクセス制御

```sql
-- アプリケーション用ユーザーの作成
CREATE USER plantlog_app WITH PASSWORD 'secure_password';

-- 必要最小限の権限付与
GRANT SELECT, INSERT, UPDATE, DELETE ON plants TO plantlog_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON observation_records TO plantlog_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON watering_records TO plantlog_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON photos TO plantlog_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON edit_history TO plantlog_app;

-- シーケンスの使用権限
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO plantlog_app;
```

### 2. データ検証

- CHECK制約による値の範囲制限
- NOT NULL制約による必須項目の強制
- 外部キー制約によるデータ整合性の保証

## パフォーマンス最適化

### 1. クエリ最適化

- 頻繁に使用される検索条件にインデックスを作成
- 複合インデックスの検討（必要に応じて）
- パーティショニングの検討（データ量増加時）

### 2. データ管理

- 定期的なVACUUMとANALYZEの実行
- 不要なデータの論理削除（物理削除の回避）
- 画像ファイルの外部ストレージ利用の検討

## 拡張性の考慮

### 1. 将来の機能拡張

- ユーザー管理機能の追加に備えたテーブル設計
- 植物種類のマスターテーブル化
- 環境データ（温度、湿度）の記録機能
- 植物の成長段階管理

### 2. スケーラビリティ

- 読み取り専用レプリカの構成
- 写真ファイルのCDN配信
- キャッシュ層の導入

## 運用・保守

### 1. バックアップ戦略

- 定期的なフルバックアップ
- 継続的なWALアーカイブ
- 復旧手順の文書化

### 2. 監視項目

- データベース接続数
- クエリ実行時間
- ストレージ使用量
- インデックス使用状況

## 初期データ

```sql
-- サンプルデータ
INSERT INTO plants (name, type, purchase_date, height, memo, watering_schedule, current_status) 
VALUES ('サンプル植物', 'モンステラ', '2024-01-01', 25, '初期データのサンプル植物です', 7, '元気');
```

## 参考データ

### 植物の種類
- モンステラ
- サンセベリア
- フィカス
- ポトス
- その他

### 植物の状態
- 元気
- 普通
- 元気がない
- 心配

### 水やりスケジュール
- 3日に1回
- 5日に1回
- 7日に1回
- 10日に1回
- 14日に1回

このデータベース設計により、植物観察アプリのMVP機能要件を満たしながら、将来の機能拡張にも対応できる堅牢で効率的なデータ管理が可能になります。