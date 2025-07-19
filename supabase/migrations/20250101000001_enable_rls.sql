-- Row Level Security (RLS) ポリシー設定
-- セキュリティ警告対応

-- 1. 全テーブルでRLSを有効化
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE observation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE watering_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_history ENABLE ROW LEVEL SECURITY;
-- plant_typesは共通データなのでRLS不要

-- 2. Plants テーブルのポリシー
CREATE POLICY "Users can view own plants" ON plants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plants" ON plants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plants" ON plants
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plants" ON plants
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Observation Records テーブルのポリシー
CREATE POLICY "Users can view own observations" ON observation_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own observations" ON observation_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own observations" ON observation_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own observations" ON observation_records
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Watering Records テーブルのポリシー
CREATE POLICY "Users can view own watering records" ON watering_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watering records" ON watering_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watering records" ON watering_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watering records" ON watering_records
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Photos テーブルのポリシー
CREATE POLICY "Users can view own photos" ON photos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos" ON photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos" ON photos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" ON photos
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Edit History テーブルのポリシー
CREATE POLICY "Users can view own edit history" ON edit_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own edit history" ON edit_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Plant Types テーブルのポリシー（全ユーザー読み取り可能）
CREATE POLICY "Everyone can view plant types" ON plant_types
    FOR SELECT USING (true);

-- 管理者のみ植物タイプの変更可能（将来の拡張用）
-- CREATE POLICY "Admins can modify plant types" ON plant_types
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');