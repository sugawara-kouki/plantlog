-- 開発環境用のRLSバイパス設定
-- 本番環境では使用しない

-- 開発環境でanonymousユーザーでもテストデータを表示可能にする
CREATE POLICY "Dev: Allow anonymous access to test data" ON plants
    FOR SELECT USING (true);

CREATE POLICY "Dev: Allow anonymous access to test observations" ON observation_records
    FOR SELECT USING (true);

CREATE POLICY "Dev: Allow anonymous access to test watering" ON watering_records
    FOR SELECT USING (true);

CREATE POLICY "Dev: Allow anonymous access to test photos" ON photos
    FOR SELECT USING (true);

CREATE POLICY "Dev: Allow anonymous access to test edit history" ON edit_history
    FOR SELECT USING (true);