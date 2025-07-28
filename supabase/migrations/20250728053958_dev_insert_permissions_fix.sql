-- Development environment temporary INSERT permissions
-- Remove in production

-- Allow anonymous users to insert data in development
CREATE POLICY "Dev: Allow anonymous insert to plants" ON plants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Dev: Allow anonymous insert to observation_records" ON observation_records
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Dev: Allow anonymous insert to watering_records" ON watering_records
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Dev: Allow anonymous insert to photos" ON photos
    FOR INSERT WITH CHECK (true);

-- Add UPDATE and DELETE permissions for development testing
CREATE POLICY "Dev: Allow anonymous update to plants" ON plants
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow anonymous update to observation_records" ON observation_records
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow anonymous update to watering_records" ON watering_records
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow anonymous update to photos" ON photos
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow anonymous delete from plants" ON plants
    FOR DELETE USING (true);

CREATE POLICY "Dev: Allow anonymous delete from observation_records" ON observation_records
    FOR DELETE USING (true);

CREATE POLICY "Dev: Allow anonymous delete from watering_records" ON watering_records
    FOR DELETE USING (true);

CREATE POLICY "Dev: Allow anonymous delete from photos" ON photos
    FOR DELETE USING (true);