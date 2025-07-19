-- plant_types テーブルのRLS有効化
-- Policy Exists RLS Disabled エラー修正

-- plant_typesテーブルでRLSを有効化
ALTER TABLE plant_types ENABLE ROW LEVEL SECURITY;