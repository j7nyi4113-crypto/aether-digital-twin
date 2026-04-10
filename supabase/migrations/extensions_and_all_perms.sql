-- Ensure pgcrypto extension is enabled for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Re-verify permissions for messages table
GRANT ALL ON TABLE public.messages TO anon;
GRANT ALL ON TABLE public.messages TO authenticated;
GRANT ALL ON TABLE public.messages TO postgres;
GRANT ALL ON TABLE public.messages TO service_role;

-- Grant usage on all sequences in the public schema
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
