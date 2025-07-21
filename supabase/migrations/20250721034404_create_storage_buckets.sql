-- Create Storage bucket for plant images

-- Create plant-images bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'plant-images',
  'plant-images', 
  true,  -- public access
  false, -- disable AVIF autodetection
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Set up RLS policies for the bucket
-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload plant images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'plant-images' 
  AND auth.role() = 'authenticated'
);

-- Anyone can view images (public bucket)
CREATE POLICY "Anyone can view plant images" ON storage.objects
FOR SELECT USING (bucket_id = 'plant-images');

-- Users can only delete their own images
CREATE POLICY "Users can delete own plant images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'plant-images' 
  AND auth.uid() = owner
);

-- Users can only update their own images
CREATE POLICY "Users can update own plant images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'plant-images' 
  AND auth.uid() = owner
);