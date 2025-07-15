-- 植物観察アプリ データベーススキーマ
-- PostgreSQL用のスキーマ定義

-- 1. 植物種類マスターテーブル
CREATE TABLE plant_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(200),
    care_difficulty VARCHAR(20) CHECK (care_difficulty IN ('易しい', '普通', '難しい')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 植物テーブル
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id INTEGER REFERENCES plant_types(id),
    purchase_date DATE,
    height INTEGER, -- cm単位
    memo TEXT,
    watering_schedule INTEGER NOT NULL CHECK (watering_schedule IN (3, 5, 7, 10, 14)),
    last_watering_date DATE,
    next_watering_date DATE,
    current_status VARCHAR(20) DEFAULT '普通' CHECK (current_status IN ('元気', '普通', '元気がない', '心配')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 観察記録テーブル
CREATE TABLE observation_records (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    observation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    height INTEGER, -- cm単位
    watered BOOLEAN DEFAULT FALSE,
    memo TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('元気', '普通', '元気がない', '心配')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 水やり記録テーブル
CREATE TABLE watering_records (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    watering_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 写真テーブル
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id) ON DELETE CASCADE,
    observation_id INTEGER REFERENCES observation_records(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_photo_relation CHECK (
        (plant_id IS NOT NULL AND observation_id IS NULL) OR
        (plant_id IS NULL AND observation_id IS NOT NULL)
    )
);

-- 6. 編集履歴テーブル
CREATE TABLE edit_history (
    id SERIAL PRIMARY KEY,
    observation_id INTEGER NOT NULL REFERENCES observation_records(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_plant_types_name ON plant_types(name);
CREATE INDEX idx_plants_name ON plants(name);
CREATE INDEX idx_plants_type_id ON plants(type_id);
CREATE INDEX idx_plants_next_watering_date ON plants(next_watering_date);
CREATE INDEX idx_observation_records_plant_id ON observation_records(plant_id);
CREATE INDEX idx_observation_records_observation_date ON observation_records(observation_date);
CREATE INDEX idx_watering_records_plant_id ON watering_records(plant_id);
CREATE INDEX idx_watering_records_watering_date ON watering_records(watering_date);
CREATE INDEX idx_photos_plant_id ON photos(plant_id);
CREATE INDEX idx_photos_observation_id ON photos(observation_id);
CREATE INDEX idx_edit_history_observation_id ON edit_history(observation_id);

-- updated_at自動更新のためのトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language plpgsql;

-- updated_atトリガー作成
CREATE TRIGGER update_plants_updated_at 
    BEFORE UPDATE ON plants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_observation_records_updated_at 
    BEFORE UPDATE ON observation_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 水やり予定日自動更新関数
CREATE OR REPLACE FUNCTION calculate_next_watering_date()
RETURNS TRIGGER AS $$
BEGIN
    -- 水やり記録が追加されたら、対応する植物の次回水やり予定日を更新
    UPDATE plants 
    SET 
        last_watering_date = NEW.watering_date,
        next_watering_date = NEW.watering_date + INTERVAL '1 day' * watering_schedule
    WHERE id = NEW.plant_id;
    
    RETURN NEW;
END;
$$ language plpgsql;

-- 水やり記録追加時のトリガー
CREATE TRIGGER update_next_watering_date
    AFTER INSERT ON watering_records
    FOR EACH ROW EXECUTE FUNCTION calculate_next_watering_date();

-- 観察記録追加時に植物の状態を更新する関数
CREATE OR REPLACE FUNCTION update_plant_status()
RETURNS TRIGGER AS $$
BEGIN
    -- 観察記録が追加されたら、対応する植物の現在の状態を更新
    UPDATE plants 
    SET current_status = NEW.status
    WHERE id = NEW.plant_id;
    
    RETURN NEW;
END;
$$ language plpgsql;

-- 観察記録追加時のトリガー
CREATE TRIGGER update_plant_current_status
    AFTER INSERT ON observation_records
    FOR EACH ROW EXECUTE FUNCTION update_plant_status();

-- 初期データ（植物の種類）
INSERT INTO plant_types (name, scientific_name, care_difficulty) VALUES
('モンステラ', 'Monstera deliciosa', '普通'),
('サンセベリア', 'Sansevieria trifasciata', '易しい'),
('フィカス', 'Ficus benjamina', '普通'),
('ポトス', 'Epipremnum aureum', '易しい'),
('その他', NULL, NULL);

-- 初期データ（サンプル植物）
INSERT INTO plants (name, type_id, purchase_date, height, memo, watering_schedule, current_status) VALUES
('サンプル植物', 1, '2024-01-01', 25, '初期データのサンプル植物です', 7, '元気');

-- 植物の状態の参考データ
-- '元気', '普通', '元気がない', '心配'

-- 水やりスケジュールの参考データ
-- 3, 5, 7, 10, 14 (日数)