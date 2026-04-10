-- Secure deletion function for guestbook with admin support
CREATE OR REPLACE FUNCTION delete_message(msg_id uuid, u_id text, admin_secret text DEFAULT '')
RETURNS boolean AS $$
DECLARE
    deleted_count int;
BEGIN
    -- Check if it's the owner OR if it's the admin
    IF (admin_secret = 'AETHER_ADMIN_2024') OR EXISTS (SELECT 1 FROM public.messages WHERE id = msg_id AND user_id = u_id) THEN
        DELETE FROM public.messages 
        WHERE id = msg_id;
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RETURN deleted_count > 0;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get a hash of a user_id without exposing it
CREATE OR REPLACE FUNCTION get_user_id_hash(u_id text)
RETURNS text AS $$
BEGIN
    RETURN md5(u_id);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- View to hide raw user_id from public but allow identification by hash
CREATE OR REPLACE VIEW public.v_messages AS
SELECT 
    id, 
    created_at, 
    text, 
    nickname, 
    avatar_url, 
    md5(user_id) as user_id_hash
FROM public.messages;

-- Grant permissions to the anon role
GRANT SELECT ON public.v_messages TO anon;
GRANT EXECUTE ON FUNCTION delete_message(uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION get_user_id_hash(text) TO anon;

-- Ensure RLS is active and correct on the base table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Select: Anyone can view (but they should use the view to be safe)
-- Insert: Anyone can insert
-- Delete: No one can delete directly via the table (must use the RPC)
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can delete their own messages" ON public.messages;
DROP POLICY IF EXISTS "No direct deletes" ON public.messages;

CREATE POLICY "Anyone can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "No direct deletes" ON public.messages FOR DELETE USING (false);
