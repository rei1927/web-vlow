-- Add hero_image_alt column to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS hero_image_alt text DEFAULT 'Vlow.AI Dashboard Interface';

-- Optional: Update existing row if needed (assuming id=1 exists)
UPDATE public.site_settings 
SET hero_image_alt = 'Vlow.AI Dashboard Interface' 
WHERE id = 1 AND hero_image_alt IS NULL;
