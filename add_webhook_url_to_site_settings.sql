-- Add n8n_webhook_url column to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS n8n_webhook_url text;

-- Add comment
COMMENT ON COLUMN public.site_settings.n8n_webhook_url IS 'The n8n Webhook URL for the AI Agent in the Simulator.';
