-- 関数のセキュリティ警告修正
-- Function Search Path Mutable 警告対応

-- 1. updated_at自動更新のためのトリガー関数（セキュリティ強化版）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;

-- 2. 水やり予定日自動更新関数（セキュリティ強化版）
CREATE OR REPLACE FUNCTION calculate_next_watering_date()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    -- 水やり記録が追加されたら、対応する植物の次回水やり予定日を更新
    UPDATE public.plants 
    SET 
        last_watering_date = NEW.watering_date,
        next_watering_date = NEW.watering_date + INTERVAL '1 day' * watering_schedule
    WHERE id = NEW.plant_id;
    
    RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;

-- 3. 観察記録追加時に植物の状態を更新する関数（セキュリティ強化版）
CREATE OR REPLACE FUNCTION update_plant_status()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    -- 観察記録が追加されたら、対応する植物の現在の状態を更新
    UPDATE public.plants 
    SET current_status = NEW.status
    WHERE id = NEW.plant_id;
    
    RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;