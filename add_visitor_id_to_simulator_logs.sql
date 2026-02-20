-- Add visitor_id column to simulator_logs for FingerprintJS support
ALTER TABLE public.simulator_logs 
ADD COLUMN IF NOT EXISTS visitor_id text;

-- Add index for visitor_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_simulator_logs_visitor_id ON public.simulator_logs(visitor_id);

-- Update RLS if needed (existing policy is broad so it might be fine, but good to check)
-- "Allow public access to logs" allows ALL, so it covers new column too.
