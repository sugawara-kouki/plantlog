-- 植物観察アプリ データベーススキーマ v2
-- PostgreSQL + Supabase Auth対応版

-- ユーザープロフィールテーブル（Supabase Authの補完）
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    display_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. 植物種類マスターテーブル（共通データなのでuser_id不要）
CREATE TABLE plant_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(200),
    care_difficulty VARCHAR(20) CHECK (care_difficulty IN ('易しい', '普通', '難しい')),
    default_watering_frequency INTEGER DEFAULT 7 CHECK (default_watering_frequency > 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 植物テーブル（user_id追加）
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type_id INTEGER REFERENCES plant_types(id),
    purchase_date DATE,
    height INTEGER, -- cm単位
    memo TEXT,
    watering_schedule INTEGER NOT NULL DEFAULT 7 CHECK (watering_schedule > 0),
    last_watering_date DATE,
    next_watering_date DATE,
    current_status VARCHAR(20) DEFAULT '普通' CHECK (current_status IN ('元気', '普通', '元気がない', '心配')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 観察記録テーブル（user_id追加）
CREATE TABLE observation_records (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    observation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    height INTEGER, -- cm単位
    watered BOOLEAN DEFAULT FALSE,
    memo TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('元気', '普通', '元気がない', '心配')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 水やり記録テーブル（user_id追加）
CREATE TABLE watering_records (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    watering_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 写真テーブル（user_id追加）
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 6. 編集履歴テーブル（user_id追加）
CREATE TABLE edit_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    observation_id INTEGER NOT NULL REFERENCES observation_records(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
-- ユーザープロフィール
CREATE INDEX idx_user_profiles_display_name ON user_profiles(display_name);

-- 植物種類
CREATE INDEX idx_plant_types_name ON plant_types(name);

-- 植物
CREATE INDEX idx_plants_user_id ON plants(user_id);
CREATE INDEX idx_plants_name ON plants(name);
CREATE INDEX idx_plants_type_id ON plants(type_id);
CREATE INDEX idx_plants_next_watering_date ON plants(next_watering_date);
CREATE INDEX idx_plants_user_name ON plants(user_id, name);

-- 観察記録
CREATE INDEX idx_observation_records_user_id ON observation_records(user_id);
CREATE INDEX idx_observation_records_plant_id ON observation_records(plant_id);
CREATE INDEX idx_observation_records_observation_date ON observation_records(observation_date);
CREATE INDEX idx_observation_records_user_plant ON observation_records(user_id, plant_id);

-- 水やり記録
CREATE INDEX idx_watering_records_user_id ON watering_records(user_id);
CREATE INDEX idx_watering_records_plant_id ON watering_records(plant_id);
CREATE INDEX idx_watering_records_watering_date ON watering_records(watering_date);
CREATE INDEX idx_watering_records_user_plant ON watering_records(user_id, plant_id);

-- 写真
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_plant_id ON photos(plant_id);
CREATE INDEX idx_photos_observation_id ON photos(observation_id);

-- 編集履歴
CREATE INDEX idx_edit_history_user_id ON edit_history(user_id);
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
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
    WHERE id = NEW.plant_id AND user_id = NEW.user_id;
    
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
    WHERE id = NEW.plant_id AND user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ language plpgsql;

-- 観察記録追加時のトリガー
CREATE TRIGGER update_plant_current_status
    AFTER INSERT ON observation_records
    FOR EACH ROW EXECUTE FUNCTION update_plant_status();

-- データ整合性を保つための制約関数
CREATE OR REPLACE FUNCTION check_user_data_consistency()
RETURNS TRIGGER AS $$
BEGIN
    -- observation_records作成時に、plant_idのuser_idと一致するかチェック
    IF TG_TABLE_NAME = 'observation_records' THEN
        IF NOT EXISTS (
            SELECT 1 FROM plants 
            WHERE id = NEW.plant_id AND user_id = NEW.user_id
        ) THEN
            RAISE EXCEPTION 'Plant does not belong to the specified user';
        END IF;
    END IF;
    
    -- watering_records作成時に、plant_idのuser_idと一致するかチェック
    IF TG_TABLE_NAME = 'watering_records' THEN
        IF NOT EXISTS (
            SELECT 1 FROM plants 
            WHERE id = NEW.plant_id AND user_id = NEW.user_id
        ) THEN
            RAISE EXCEPTION 'Plant does not belong to the specified user';
        END IF;
    END IF;
    
    -- photos作成時に、plant_idまたはobservation_idのuser_idと一致するかチェック
    IF TG_TABLE_NAME = 'photos' THEN
        IF NEW.plant_id IS NOT NULL THEN
            IF NOT EXISTS (
                SELECT 1 FROM plants 
                WHERE id = NEW.plant_id AND user_id = NEW.user_id
            ) THEN
                RAISE EXCEPTION 'Plant does not belong to the specified user';
            END IF;
        END IF;
        
        IF NEW.observation_id IS NOT NULL THEN
            IF NOT EXISTS (
                SELECT 1 FROM observation_records 
                WHERE id = NEW.observation_id AND user_id = NEW.user_id
            ) THEN
                RAISE EXCEPTION 'Observation record does not belong to the specified user';
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language plpgsql;

-- データ整合性チェックのトリガー
CREATE TRIGGER check_observation_records_user_consistency
    BEFORE INSERT OR UPDATE ON observation_records
    FOR EACH ROW EXECUTE FUNCTION check_user_data_consistency();

CREATE TRIGGER check_watering_records_user_consistency
    BEFORE INSERT OR UPDATE ON watering_records
    FOR EACH ROW EXECUTE FUNCTION check_user_data_consistency();

CREATE TRIGGER check_photos_user_consistency
    BEFORE INSERT OR UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION check_user_data_consistency();

-- 初期データ（植物の種類）
INSERT INTO plant_types (name, scientific_name, care_difficulty, default_watering_frequency, description) VALUES
('モンステラ', 'Monstera deliciosa', '普通', 7, '大きな葉が特徴的な観葉植物。適度な水やりと明るい間接光を好む。'),
('サンセベリア', 'Sansevieria trifasciata', '易しい', 14, '乾燥に強く育てやすい多肉植物。水やりは控えめに。'),
('フィカス', 'Ficus benjamina', '普通', 7, 'ゴムの木として親しまれる観葉植物。明るい場所を好む。'),
('ポトス', 'Epipremnum aureum', '易しい', 5, 'つる性で成長が早い観葉植物。水挿しでも育つ。'),
('フィロデンドロン', 'Philodendron hederaceum', '普通', 7, 'モンステラに似た葉を持つ観葉植物。湿度を好む。'),
('その他', NULL, NULL, 7, 'その他の植物');

-- ユーザープロフィール自動作成関数（Supabase Auth連携用）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 新規ユーザー登録時のトリガー
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- コメント追加
COMMENT ON TABLE user_profiles IS 'ユーザープロフィール情報（Supabase Authの補完）';
COMMENT ON TABLE plant_types IS '植物種類マスター（全ユーザー共通）';
COMMENT ON TABLE plants IS 'ユーザーの植物情報';
COMMENT ON TABLE observation_records IS '植物の観察記録';
COMMENT ON TABLE watering_records IS '水やり記録';
COMMENT ON TABLE photos IS '植物・観察記録の写真';
COMMENT ON TABLE edit_history IS '観察記録の編集履歴';

COMMENT ON COLUMN plants.user_id IS 'Supabase Auth連携：植物の所有者';
COMMENT ON COLUMN observation_records.user_id IS 'Supabase Auth連携：観察記録の作成者';
COMMENT ON COLUMN watering_records.user_id IS 'Supabase Auth連携：水やり記録の作成者';
COMMENT ON COLUMN photos.user_id IS 'Supabase Auth連携：写真の所有者';
COMMENT ON COLUMN edit_history.user_id IS 'Supabase Auth連携：編集履歴の作成者';