-- Add system_prompt column to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS system_prompt text DEFAULT 'Kamu adalah asisten virtual yang ramah dan membantu untuk Vlow.AI.';

-- Add comment
COMMENT ON COLUMN public.site_settings.system_prompt IS 'The system prompt for the AI Agent in the Simulator.';
