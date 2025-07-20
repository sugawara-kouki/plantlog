-- Seed data for植物観察アプリ
-- 実際のスキーマに合わせたシンプルなseedデータ

-- まず既存のデータをクリア（開発環境のみ）
TRUNCATE TABLE watering_records CASCADE;
TRUNCATE TABLE observation_records CASCADE;
TRUNCATE TABLE plants CASCADE;
TRUNCATE TABLE plant_types CASCADE;

-- 植物種類のマスターデータ
INSERT INTO plant_types (name, scientific_name, care_difficulty) VALUES
('モンステラ', 'Monstera deliciosa', '易しい'),
('サンセベリア', 'Sansevieria trifasciata', '易しい'),
('ポトス', 'Epipremnum aureum', '易しい'),
('ゴムの木', 'Ficus elastica', '普通'),
('アロエベラ', 'Aloe vera', '易しい');

-- テスト用ユーザーを作成
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'authenticated',
    'authenticated',
    'test@example.com',
    '$2a$10$Q/S.4Kj7Xd6Nk9gUKE6t8eKr1C4q8VjCfIRXK.Qf9lRmw4XGvgJ2m',
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
)
ON CONFLICT (id) DO NOTHING;

-- 開発環境用の固定UUID
DO $$
DECLARE
    test_user_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
    -- 植物データ（type_idは初期スキーマのデータ＋新しいseedデータのIDを使用）
    INSERT INTO plants (user_id, name, type_id, purchase_date, height, memo, watering_schedule, last_watering_date, next_watering_date, current_status) VALUES
    (test_user_id, 'モンステラ', 6, '2024-01-15', 45, '新芽が出てきて成長が楽しみです', 7, '2024-07-15', '2024-07-22', '元気'),
    (test_user_id, 'サンセベリア', 7, '2024-02-01', 25, '水やりを忘れがちですが元気に育っています', 14, '2024-07-10', '2024-07-24', '元気'),
    (test_user_id, 'ポトス', 9, '2024-03-10', 20, '少し葉が黄色くなってきました', 5, '2024-07-17', '2024-07-19', '普通');

    -- 観察記録
    INSERT INTO observation_records (user_id, plant_id, observation_date, height, watered, memo, status) VALUES
    (test_user_id, 1, '2024-07-15 10:00:00', 45, true, '新しい葉が2枚展開しました', '元気'),
    (test_user_id, 2, '2024-07-16 09:00:00', 25, false, '変化なく安定しています', '元気'),
    (test_user_id, 3, '2024-07-17 11:00:00', 20, true, '葉の色が少し薄くなってきました', '普通'),
    (test_user_id, 1, '2024-07-10 10:00:00', 44, true, '順調に成長中', '元気'),
    (test_user_id, 2, '2024-07-05 09:00:00', 25, false, '特に変化なし', '元気');

    -- 水やり記録
    INSERT INTO watering_records (user_id, plant_id, watering_date) VALUES
    (test_user_id, 1, '2024-07-15'),
    (test_user_id, 1, '2024-07-08'),
    (test_user_id, 1, '2024-07-01'),
    (test_user_id, 2, '2024-07-10'),
    (test_user_id, 2, '2024-06-26'),
    (test_user_id, 3, '2024-07-17'),
    (test_user_id, 3, '2024-07-12'),
    (test_user_id, 3, '2024-07-07');
END $$;