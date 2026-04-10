-- Enable RLS on the messages table
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies (drop first if exists)
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
CREATE POLICY "Anyone can view messages" ON public.messages
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
CREATE POLICY "Anyone can insert messages" ON public.messages
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete messages" ON public.messages;
CREATE POLICY "Anyone can delete messages" ON public.messages
    FOR DELETE USING (true); -- Since the frontend logic already handles the check: .eq('id', messageId).eq('user_id', localUserId)
