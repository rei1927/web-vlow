-- Create the site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_settings (
    id bigint PRIMARY KEY,
    hero_image_url text,
    hero_image_alt text DEFAULT 'Vlow.AI Dashboard Interface',
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow read/write for now, or specific rules)
-- Policy for SELECT (Read access for everyone - public)
CREATE POLICY "Enable read access for all users" ON public.site_settings
    FOR SELECT USING (true);

-- Policy for INSERT/UPDATE (Write access - ideally admin only, but for now allow public/anon for demo)
-- You might want to restrict this to authenticated users later
CREATE POLICY "Enable insert/update for all users" ON public.site_settings
    FOR ALL USING (true) WITH CHECK (true);

-- Insert the initial default row (ID=1) if it doesn't exist
INSERT INTO public.site_settings (id, hero_image_url, hero_image_alt)
VALUES (1, NULL, 'Vlow.AI Dashboard Interface')
ON CONFLICT (id) DO NOTHING;
