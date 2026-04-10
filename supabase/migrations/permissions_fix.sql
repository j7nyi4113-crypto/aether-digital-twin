-- Ensure the anon role can insert into messages
GRANT INSERT, SELECT ON public.messages TO anon;
GRANT INSERT, SELECT ON public.messages TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Ensure the insert policy exists and is correct
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
CREATE POLICY "Anyone can insert messages" ON public.messages 
    FOR INSERT 
    WITH CHECK (true);

-- Ensure anyone can select for realtime to work
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
CREATE POLICY "Anyone can view messages" ON public.messages
    FOR SELECT USING (true);

-- Ensure the view also has select permissions for everyone
GRANT SELECT ON public.v_messages TO anon;
GRANT SELECT ON public.v_messages TO authenticated;

-- Ensure functions have execute permissions
GRANT EXECUTE ON FUNCTION delete_message(uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION delete_message(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_id_hash(text) TO anon;
GRANT EXECUTE ON FUNCTION get_user_id_hash(text) TO authenticated;
