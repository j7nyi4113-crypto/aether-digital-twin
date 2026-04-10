import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  text: string;
  nickname: string;
  avatarUrl: string;
  timestamp: number;
  userIdHash: string; // Hash of the user_id for identification
}

export default function Guestbook() {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNicknameWarning, setShowNicknameWarning] = useState(false);
  const [localUserIdHash, setLocalUserIdHash] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [localUserId] = useState(() => {
    let id = localStorage.getItem('aether-user-id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('aether-user-id', id);
    }
    return id;
  });

  // Get the hash of localUserId from server once and check for admin key
  useEffect(() => {
    const checkAdminAndGetHash = async () => {
      if (supabase) {
        // Check for admin key in localStorage
        const adminKey = localStorage.getItem('aether-admin-key');
        if (adminKey === 'AETHER_ADMIN_2024') {
          setIsAdmin(true);
        }

        const { data, error } = await supabase.rpc('get_user_id_hash', { u_id: localUserId });
        if (!error && data) {
          setLocalUserIdHash(data);
        }
      }
    };
    checkAdminAndGetHash();
    
    // Add event listener to react to admin key changes from Navbar
    const handleAdminChange = () => {
      const adminKey = localStorage.getItem('aether-admin-key');
      setIsAdmin(adminKey === 'AETHER_ADMIN_2024');
    };
    window.addEventListener('adminStatusChanged', handleAdminChange);
    return () => window.removeEventListener('adminStatusChanged', handleAdminChange);
  }, [localUserId]);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages if supabase is available
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
          // When a new message arrives via realtime, we don't have the hash directly in the table payload
          // We'll get the hash from server to keep it consistent
          let hash = 'external';
          if (payload.new.user_id === localUserId) {
            hash = localUserIdHash;
          } else {
            // For other users, we can just get the hash from the server if we really need it,
            // but for realtime display, we can just show it without the hash initially.
            // Or better: call the RPC to get the hash.
            const { data } = await supabase.rpc('get_user_id_hash', { u_id: payload.new.user_id });
            hash = data || 'external';
          }

          const newMsg: Message = {
            id: payload.new.id,
            text: payload.new.text,
            nickname: payload.new.nickname,
            avatarUrl: payload.new.avatar_url,
            timestamp: new Date(payload.new.created_at).getTime(),
            userIdHash: hash
          };
          setMessages((current) => {
            if (current.find(m => m.id === newMsg.id)) return current;
            return [newMsg, ...current];
          });
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
          setMessages((current) => current.filter(msg => msg.id !== payload.old.id));
        })
        .subscribe();
    }

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [localUserId]); // Add localUserId as dependency for the realtime check

  const fetchMessages = async () => {
    if (!supabase) {
      setIsLoading(false);
      setMessages([
        {
          id: '1',
          text: 'Supabase not configured. This is a fallback message.',
          nickname: 'System',
          avatarUrl: 'https://picsum.photos/seed/system/100/100',
          timestamp: Date.now(),
          userIdHash: 'system'
        }
      ]);
      return;
    }
    try {
      // Fetch from the secure view instead of the table
      const { data, error } = await supabase
        .from('v_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          text: msg.text,
          nickname: msg.nickname,
          avatarUrl: msg.avatar_url,
          timestamp: new Date(msg.created_at).getTime(),
          userIdHash: msg.user_id_hash
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const currentNickname = localStorage.getItem('aether-nickname') || 'Guest';
    
    if (currentNickname === 'Guest') {
      setShowNicknameWarning(true);
      setTimeout(() => setShowNicknameWarning(false), 3000);
      return;
    }

    const currentAvatar = localStorage.getItem('aether-avatar') || 'https://picsum.photos/seed/aether-user/100/100';
    const textToSend = newMessage.trim();
    
    setIsSending(true);
    setNewMessage('');
    setShowNicknameWarning(false);

    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            text: textToSend, 
            nickname: currentNickname, 
            avatar_url: currentAvatar,
            user_id: localUserId
          }
        ]);

      if (error) throw error;
      window.dispatchEvent(new Event('newMessagePosted'));
    } catch (error: any) {
      console.error('Error sending message:', error);
      setNewMessage(textToSend);
      alert(`Failed to send message: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const adminKey = localStorage.getItem('aether-admin-key') || '';
      
      // Use the updated RPC with admin support
      const { data, error } = await supabase.rpc('delete_message', {
        msg_id: messageId,
        u_id: localUserId,
        admin_secret: adminKey
      });

      if (error) throw error;
      if (!data) throw new Error('Delete failed. You might not have permission to delete this message.');
      
      setMessages(current => current.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete message.');
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pl-24 pr-12 pb-24 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl glass-panel p-10 md:p-16 rounded-[3rem] border-white/5 relative overflow-hidden mb-12"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -z-10" />

        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-white tracking-wide uppercase">
              {t('Visitor Log', '访客留言板')}
            </h1>
            <p className="text-primary font-headline tracking-widest text-xs uppercase mt-1">
              {t('Guestbook', '— 留下你的数字化足迹')}
            </p>
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="mb-12 relative">
          <div className="relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('留下你的思考...', '留下你的思考...')}
              className={`w-full bg-white/5 border ${showNicknameWarning ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-6 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors resize-none h-32 font-light text-sm`}
              maxLength={500}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="absolute bottom-4 right-4 p-3 bg-primary/20 text-primary hover:bg-primary hover:text-black rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-primary/20 disabled:hover:text-primary cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          
          <AnimatePresence>
            {showNicknameWarning && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="flex items-center gap-2 text-red-400 font-headline text-xs tracking-widest uppercase bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-4 h-4" />
                  {t('需要先在右上角个人主页修改昵称后才能留言', '需要先在右上角个人主页修改昵称后才能留言')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Messages List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center py-20 text-white/20">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-headline text-xs tracking-widest uppercase">{t('Loading Messages...', '加载留言中...')}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-white/20 border border-dashed border-white/5 rounded-3xl">
              <MessageSquare className="w-12 h-12 mb-4 opacity-10" />
              <p className="font-headline text-xs tracking-widest uppercase">{t('No messages yet', '尚无留言')}</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors relative group"
              >
                <img 
                  src={msg.avatarUrl} 
                  alt={msg.nickname} 
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10" 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                      <span className="font-headline text-sm text-primary tracking-wide font-bold">
                        {msg.nickname}
                      </span>
                      <span className="font-headline text-[10px] tracking-widest text-white/40 uppercase">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {(isAdmin || (msg.userIdHash === localUserIdHash && localUserIdHash !== '')) && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                        title={isAdmin ? t('管理员删除', '管理员删除') : t('删除留言', '删除留言')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-white/80 font-light leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
