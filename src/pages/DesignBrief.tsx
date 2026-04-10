import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Github, MessageCircle, Phone, Terminal, Send, MessageSquare, Trash2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import visionaryAvatar from '../assets/visionary-avatar.jpg';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  text: string;
  nickname: string;
  avatarUrl: string;
  timestamp: number;
  userId: string;
}

export default function DesignBrief() {
  const { t } = useTranslation();
  const [showPerspective, setShowPerspective] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNicknameWarning, setShowNicknameWarning] = useState(false);
  
  const [localUserId] = useState(() => {
    let id = localStorage.getItem('aether-user-id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('aether-user-id', id);
    }
    return id;
  });

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages if supabase is available
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const newMsg: Message = {
            id: payload.new.id,
            text: payload.new.text,
            nickname: payload.new.nickname,
            avatarUrl: payload.new.avatar_url,
            timestamp: new Date(payload.new.created_at).getTime(),
            userId: payload.new.user_id || 'anonymous'
          };
          setMessages((current) => [newMsg, ...current]);
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
  }, []);

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
          userId: 'system'
        }
      ]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('messages')
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
          userId: msg.user_id || 'anonymous'
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback if table doesn't exist yet
      setMessages([
        {
          id: '1',
          text: '科技与美学的完美融合，期待完整的数字沉浸体验！',
          nickname: 'Cyber_Walker',
          avatarUrl: 'https://picsum.photos/seed/cyber/100/100',
          timestamp: Date.now() - 86400000,
          userId: 'anonymous'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const currentNickname = localStorage.getItem('aether-nickname') || 'Guest';
    
    // Check if the user is still using the default 'Guest' nickname
    if (currentNickname === 'Guest') {
      setShowNicknameWarning(true);
      // Optional: Auto-hide warning after 3 seconds
      setTimeout(() => setShowNicknameWarning(false), 3000);
      return;
    }

    const currentAvatar = localStorage.getItem('aether-avatar') || 'https://picsum.photos/seed/aether-user/100/100';
    const textToSend = newMessage.trim();
    setNewMessage(''); // Clear immediately for UX
    setShowNicknameWarning(false); // Hide warning if it was showing

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
      // Note: We don't manually add to state here because the realtime subscription will catch it
      // and update the state automatically. If realtime fails, we could fallback to manual.

      // Dispatch custom event to notify Home page
      window.dispatchEvent(new Event('newMessagePosted'));
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert if failed
      setNewMessage(textToSend);
      alert('Failed to send message. Please make sure the database table is created.');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', localUserId); // Extra security check

      if (error) throw error;
      
      // Update UI immediately for better UX, though realtime will also catch it
      setMessages(current => current.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message.');
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pl-24 pr-12 pb-24 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl glass-panel p-10 md:p-16 rounded-[3rem] border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tertiary to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-tertiary/10 text-tertiary">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-white tracking-wide">
              {t('db_title', 'AETHER 灵境系列：设计纲要')}
            </h1>
            <p className="text-tertiary font-headline tracking-widest text-xs uppercase mt-1">
              {t('db_subtitle', '— 寻求秩序与温度的共鸣')}
            </p>
          </div>
        </div>

        <div className="space-y-12 text-on-surface-variant font-light leading-relaxed text-sm md:text-base">
          {/* Section 1 */}
          <section>
            <h2 className="text-white font-headline text-lg mb-4 flex items-center gap-3">
              <span className="text-tertiary">01.</span>
              {t('db_h1', '设计初衷：填补“冷酷科技”的情感真空')}
            </h2>
            <div className="space-y-4 pl-8 border-l border-white/10">
              <p>{t('db_p1_1', '在当前的智能汽车时代，行业往往陷入了参数与算力的军备竞赛。然而，堆砌的屏幕和冰冷的传感器往往让用户感到疏离。')}</p>
              <p>
                <span className="text-white font-medium">{t('db_p1_2_label', '核心痛点：')}</span>
                {t('db_p1_2_text', '传统电动车设计过于强调“工具属性”，缺乏与驾驶者之间的情感纽带。')}
              </p>
              <p>
                <span className="text-tertiary font-medium">{t('db_p1_3_label', '设计使命：')}</span>
                {t('db_p1_3_text', 'AETHER 的诞生，是为了让科技不再是高高在上的复杂指令，而是像空气和水一样，自然、温润且具有呼吸感。我们设计的不是一个移动终端，而是一个能与灵魂对话的“灵境”。')}
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-white font-headline text-lg mb-4 flex items-center gap-3">
              <span className="text-primary">02.</span>
              {t('db_h2', '设计哲学：温润科技美学 (Warm-Tech Aesthetics)')}
            </h2>
            <div className="space-y-4 pl-8 border-l border-white/10">
              <p>{t('db_p2_1', '我们拒绝生硬的几何切割，转而向自然界寻求灵感。')}</p>
              <p>
                <span className="text-white font-medium">{t('db_p2_2_label', '流动的生命力：')}</span>
                {t('db_p2_2_text', '车辆不应是静止的金属壳。通过“漆面生长系统”和“动态粒子场”，我们将流体力学可视化，赋予车身动态的生命美学。')}
              </p>
              <p>
                <span className="text-white font-medium">{t('db_p2_3_label', '消失的边界：')}</span>
                {t('db_p2_3_text', '模糊数字化界面与物理实体之间的界限。通过隐形交互（Invisible UI）和触感反馈，让每一次操作都像触摸皮肤般自然。')}
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-white font-headline text-lg mb-4 flex items-center gap-3">
              <span className="text-secondary">03.</span>
              {t('db_h3', '空间定义：重塑“第四空间”的静谧值')}
            </h2>
            <div className="space-y-4 pl-8 border-l border-white/10">
              <p>{t('db_p3_1', '家、办公室、社交场所之外，人需要一个能够自我修复的过渡地带。')}</p>
              <p>
                <span className="text-white font-medium">{t('db_p3_2_label', '感官隔绝：')}</span>
                {t('db_p3_2_text', '设计“静谧转场”逻辑，核心目的是在都市噪音与个人世界之间建立一道“数字护城河”。')}
              </p>
              <p>
                <span className="text-white font-medium">{t('db_p3_3_label', '沉浸式声场：')}</span>
                {t('db_p3_3_text', '利用高频电磁共振的纯净模拟音，并非为了消除声音，而是为了重构听觉。这是一种空间音频的秩序感，让用户在进入座舱的一瞬间，感受到从物理世界到数字精神世界的跨越。')}
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-white font-headline text-lg mb-4 flex items-center gap-3">
              <span className="text-tertiary">04.</span>
              {t('db_h4', '人车关系：从“操控”转向“共生”')}
            </h2>
            <div className="space-y-4 pl-8 border-l border-white/10">
              <p>{t('db_p4_1', '在 AETHER 的世界里，车辆不再是被动的受令者，而是主动的观察者与陪伴者。')}</p>
              <p>
                <span className="text-white font-medium">{t('db_p4_2_label', '生态联动：')}</span>
                {t('db_p4_2_text', '车辆与“家”的无缝对接（人车家全生态），本质上是设计一种“无断点”的生活方式。当车灯亮起、空调自动调至舒适温度，那是科技对人类生活律动的精准捕捉。')}
              </p>
              <p>
                <span className="text-white font-medium">{t('db_p4_3_label', '性能的优雅化：')}</span>
                {t('db_p4_3_text', '我们展示底盘剥离与机械结构，不是为了炫耀工业实力，而是为了让用户理解机械的精密与安全，建立深层的信任感。')}
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-white font-headline text-lg mb-4 flex items-center gap-3">
              <span className="text-secondary">05.</span>
              {t('db_h5', '最终愿景：科技，从未如此贴近呼吸')}
            </h2>
            <div className="space-y-4 pl-8 border-l border-white/10">
              <p>{t('db_p5_1', '我们设计 AETHER，是为了在这个快节奏的数字时代，为人类保留一处可以呼吸、可以思考、可以沉浸的流动疆域。')}</p>
            </div>
          </section>

          {/* Footer Quote */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-10 mt-10 border-t border-white/10 text-center"
          >
            <p className="text-tertiary font-headline tracking-widest text-xs uppercase mb-4">
              {t('db_footer_label', '设计结语')}
            </p>
            <blockquote className="text-lg md:text-xl text-white font-light italic leading-relaxed max-w-2xl mx-auto">
              "{t('db_footer_quote', '好的设计不应该提供答案，而应该激发向往。AETHER 灵境系列是我们在数字化浪潮中，为人类感官递出的一张温柔邀请函。')}"
            </blockquote>
          </motion.div>
        </div>
      </motion.div>

      {/* The Visionary Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-4xl mt-12 glass-panel p-10 md:p-16 rounded-[3rem] border-white/5 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center"
      >
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border border-white/10 relative group">
          <motion.img 
            src={visionaryAvatar} 
            alt="Junyi Liu" 
            initial={{ filter: 'blur(10px)', opacity: 0.5 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-tertiary/10 mix-blend-overlay pointer-events-none" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="font-headline text-[10px] tracking-[0.3em] uppercase mb-2 text-tertiary">
            {t('db_visionary_label')}
          </div>
          <h3 className="font-headline text-2xl font-bold mb-1 text-white">Junyi Liu</h3>
          <h4 className="font-headline text-xs tracking-widest text-primary/60 uppercase mb-6">
            {t('db_visionary_title')}
          </h4>
          <p className="text-sm text-on-surface-variant font-light leading-relaxed mb-8">
            {t('db_visionary_desc')}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="relative group/tooltip flex justify-center">
              <button 
                className="p-3 rounded-full glass-panel hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white transition-colors text-primary/60 cursor-pointer" 
                onClick={(e) => {
                  e.currentTarget.focus();
                }}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <div className="absolute -top-12 opacity-0 group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 flex flex-col items-center">
                <div className="bg-black/80 backdrop-blur-md text-white font-headline tracking-wider text-[10px] px-3 py-2 rounded-lg border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  aoanqwao
                </div>
                <div className="w-2 h-2 bg-black/80 border-b border-r border-white/10 rotate-45 -mt-1" />
              </div>
            </div>

            <div className="relative group/tooltip flex justify-center">
              <button 
                className="p-3 rounded-full glass-panel hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white transition-colors text-primary/60 cursor-pointer" 
                onClick={(e) => {
                  e.currentTarget.focus();
                }}
              >
                <span className="font-bold text-xs leading-none inline-flex items-center justify-center w-4 h-4">QQ</span>
              </button>
              <div className="absolute -top-12 opacity-0 group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 flex flex-col items-center">
                <div className="bg-black/80 backdrop-blur-md text-white font-headline tracking-wider text-[10px] px-3 py-2 rounded-lg border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  2923205162
                </div>
                <div className="w-2 h-2 bg-black/80 border-b border-r border-white/10 rotate-45 -mt-1" />
              </div>
            </div>

            <div className="relative group/tooltip flex justify-center">
              <button 
                className="p-3 rounded-full glass-panel hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white transition-colors text-primary/60 cursor-pointer" 
                onClick={(e) => {
                  e.currentTarget.focus();
                }}
              >
                <Phone className="w-4 h-4" />
              </button>
              <div className="absolute -top-12 opacity-0 group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 flex flex-col items-center">
                <div className="bg-black/80 backdrop-blur-md text-white font-headline tracking-wider text-[10px] px-3 py-2 rounded-lg border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  +86 19883179170
                </div>
                <div className="w-2 h-2 bg-black/80 border-b border-r border-white/10 rotate-45 -mt-1" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Interactive Signature */}
      <div className="w-full max-w-4xl mt-24 text-center group relative h-32 flex flex-col items-center justify-center">
        <div className="font-headline text-xs text-on-surface-variant uppercase tracking-[0.5em] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Directed by
        </div>
        <svg 
          viewBox="0 0 400 100" 
          className="w-64 h-24 stroke-tertiary/40 group-hover:stroke-tertiary transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(128,236,255,0.8)]"
          fill="none" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M 50,50 C 70,30 90,20 110,40 C 130,60 120,80 140,70 C 160,60 170,30 190,40 C 210,50 200,80 220,70 C 240,60 250,40 270,30 C 290,20 310,40 330,60 C 350,80 340,40 360,50"
          />
        </svg>
      </div>

      {/* Message Board Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mt-12 mb-12 glass-panel p-8 md:p-12 rounded-[3rem] border-white/5"
      >
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-6 h-6 text-tertiary" />
          <h3 className="font-headline text-xl text-white tracking-widest uppercase">
            {t('Visitor Log')}
          </h3>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="mb-12 relative">
          <div className="relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('留下你的思考...')}
              className={`w-full bg-white/5 border ${showNicknameWarning ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-6 text-white placeholder:text-white/30 focus:outline-none focus:border-tertiary/50 transition-colors resize-none h-32 font-light text-sm`}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute bottom-4 right-4 p-3 bg-tertiary/20 text-tertiary hover:bg-tertiary hover:text-black rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-tertiary/20 disabled:hover:text-tertiary cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Nickname Warning Message */}
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: showNicknameWarning ? 1 : 0, height: showNicknameWarning ? 'auto' : 0 }}
            className="overflow-hidden mt-3"
          >
            <div className="flex items-center gap-2 text-red-400 font-headline text-xs tracking-widest uppercase bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <AlertCircle className="w-4 h-4" />
              {t('需要先在右上角个人主页修改昵称后才能留言')}
            </div>
          </motion.div>
        </form>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
            >
              <img 
                src={msg.avatarUrl} 
                alt={msg.nickname} 
                className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10" 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-headline text-sm text-primary tracking-wide">
                      {msg.nickname}
                    </span>
                    <span className="font-headline text-[10px] tracking-widest text-white/40 uppercase">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {msg.userId === localUserId && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                      title={t('删除留言')}
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
          ))}
        </div>
      </motion.div>

      {/* Designer Perspective Floating Button & Overlay */}
      <button 
        onClick={() => setShowPerspective(!showPerspective)}
        className="fixed bottom-8 right-8 z-50 glass-panel p-4 rounded-full border-tertiary/30 text-tertiary hover:bg-tertiary/10 hover:scale-110 transition-all shadow-[0_0_20px_rgba(128,236,255,0.2)]"
        title="Designer Perspective"
      >
        <Terminal className="w-6 h-6" />
      </button>

      {showPerspective && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-background/90 backdrop-blur-md flex items-center justify-center p-12"
        >
          <div className="max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-tertiary tracking-widest uppercase text-sm">
                [ Engineering Mode ] // Designer Perspective
              </h2>
              <button 
                onClick={() => setShowPerspective(false)}
                className="text-white/50 hover:text-white font-headline text-xs tracking-widest uppercase"
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel p-6 rounded-2xl border-white/5 font-mono text-xs text-primary/80 overflow-x-auto">
                <p className="text-white/40 mb-4">/* AETHER_CORE_SHADER.glsl */</p>
                <p>uniform float uTime;</p>
                <p>uniform vec3 uColor;</p>
                <p>varying vec2 vUv;</p>
                <br/>
                <p>void main() {'{'}</p>
                <p className="pl-4">vec2 p = vUv * 2.0 - 1.0;</p>
                <p className="pl-4">float d = length(p);</p>
                <p className="pl-4">float breathing = sin(d * 10.0 - uTime * 2.0) * 0.5 + 0.5;</p>
                <p className="pl-4">vec3 finalColor = mix(uColor, vec3(1.0), breathing * 0.2);</p>
                <p className="pl-4">gl_FragColor = vec4(finalColor, 1.0 - d);</p>
                <p>{'}'}</p>
              </div>

              <div className="flex flex-col justify-center">
                <div className="inline-block px-3 py-1 mb-4 rounded-full border border-tertiary/30 bg-tertiary/5 text-tertiary text-[10px] tracking-[0.2em] font-headline uppercase self-start">
                  Voice Note
                </div>
                <h3 className="font-headline text-xl text-white mb-4">"The pulse of the machine."</h3>
                <p className="text-on-surface-variant font-light text-sm leading-relaxed">
                  "当我写下这段 Shader 时，我思考的不是如何渲染一个完美的金属反光，而是如何让这块金属'呼吸'。正弦波（sine wave）是宇宙中最基础的生命律动，我将时间变量注入其中，AETHER 就有了自己的心跳。这就是我们在参数之上寻找的温度。"
                </p>
                <div className="mt-6 text-tertiary font-headline text-[10px] tracking-widest uppercase">
                  — Junyi Liu
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}