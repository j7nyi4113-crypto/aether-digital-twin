import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Car, RefreshCw, Layers, Headphones, Cog, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import heroBg from '../assets/hero-bg.jpg';
import frame0 from '../assets/360/0.jpg';
import frame45 from '../assets/360/45.jpg';
import frame90 from '../assets/360/90.jpg';
import frame135 from '../assets/360/135.jpg';
import frame180 from '../assets/360/180.jpg';
import frame225 from '../assets/360/225.jpg';
import frame270 from '../assets/360/270.jpg';
import frame315 from '../assets/360/315.jpg';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import CoreEvolution from '../components/CoreEvolution';

interface Message {
  id: string;
  text: string;
  nickname: string;
  avatarUrl: string;
  timestamp: number;
}

const modules = [
  {
    id: '01',
    title: '机械灵魂',
    subtitle: 'Mechanical Soul',
    description: '探索底盘与核心动力模组的数字化重组，见证机械艺术与电子灵魂的交汇。',
    path: '/mechanical',
    icon: Car,
    color: 'text-tertiary',
    image: 'https://picsum.photos/seed/car-engine-detail/800/1000'
  },
  {
    id: '02',
    title: '漆面生长',
    subtitle: 'Surface Growth',
    description: '液态金属模拟与涂装工艺的实时演化，定制独属于你的以太色泽。',
    path: '/surface',
    icon: RefreshCw,
    color: 'text-secondary',
    image: 'https://picsum.photos/seed/car-paint-finish/800/1000'
  },
  {
    id: '03',
    title: '空间声场',
    subtitle: 'Acoustic Field',
    description: '3D全景声场渲染与物理引擎模拟，在数字空间感受引擎与风阻的嘶吼。',
    path: '/acoustic',
    icon: Headphones,
    color: 'text-tertiary',
    image: 'https://picsum.photos/seed/car-audio-system/800/1000'
  }
];

// 模拟 8 个关键帧图片的路径 (0, 45, 90, 135, 180, 225, 270, 315)
const CAR_FRAMES = [
  frame0,
  frame45,
  frame90,
  frame135,
  frame180,
  frame225,
  frame270,
  frame315,
];

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 360 Viewer State
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [latestMessages, setLatestMessages] = useState<Message[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Frame interpolation logic
  const TOTAL_FRAMES = CAR_FRAMES.length;
  const DEGREES_PER_FRAME = 360 / TOTAL_FRAMES; // 45 degrees

  // Calculate current frame and next frame for interpolation
  const currentAngle = ((rotation % 360) + 360) % 360;
  const exactFrameIndex = currentAngle / DEGREES_PER_FRAME;
  const frame1Index = Math.floor(exactFrameIndex) % TOTAL_FRAMES;
  const frame2Index = (frame1Index + 1) % TOTAL_FRAMES;
  
  // Progress between the two frames (0 to 1)
  const interpolationProgress = exactFrameIndex - Math.floor(exactFrameIndex);

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX((e as React.PointerEvent).clientX);
    }
  };

  const handlePointerMove = useCallback((e: PointerEvent | TouchEvent) => {
    if (!isDragging) return;
    
    let currentX = 0;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = (e as PointerEvent).clientX;
    }

    const deltaX = currentX - startX;
    // Adjust sensitivity: 1 pixel drag = 0.5 degree rotation
    setRotation(prev => prev + deltaX * 0.5);
    setStartX(currentX);
  }, [isDragging, startX]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('v_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        if (data) {
          setLatestMessages(data.map(msg => ({
            id: msg.id,
            text: msg.text,
            nickname: msg.nickname,
            avatarUrl: msg.avatar_url,
            timestamp: new Date(msg.created_at).getTime()
          })));
        }
      } catch (err) {
        console.error('Error fetching latest messages:', err);
      }
    };

    fetchLatestMessages();

    // Realtime subscription for home page to show sync status
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel('public:messages_home')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
          setHasNewMessage(true);
          fetchLatestMessages();
        })
        .subscribe();
    }

    return () => {
      if (supabase && channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleStartEvolve = () => {
    // Scroll to top to ensure smooth transition to next page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Add a slight delay for the visual effect
    setTimeout(() => {
      navigate('/mechanical');
    }, 300);
  };

  const handleEcosystemLink = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate('/ecosystem');
    }, 300);
  };

  return (
    <div className="relative min-h-screen pt-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:h-[80vh] flex flex-col md:flex-row items-center px-6 md:px-24 overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            className="w-full h-full object-cover opacity-80 object-center"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl w-full text-center md:text-left mt-12 md:mt-0"
        >
          <div className="inline-block px-3 py-1 mb-6 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-[10px] tracking-[0.2em] font-headline uppercase">
            {t('Aether Spiritus Edition')}
          </div>
          <h1 className="font-headline text-[clamp(2.5rem,10vw,6rem)] font-bold tracking-tight mb-4 leading-none text-white">
            {t('AETHER')} <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">{t('灵境系列')}</span>
          </h1>
          <h2 className="font-headline text-xl md:text-3xl text-primary/80 tracking-widest mb-8 font-light">
            {t('AETHER SPIRIT SERIES')}
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg max-w-xl mx-auto md:mx-0 font-light leading-relaxed mb-10 px-4 md:px-0">
            {t('数字化孪生空间：重构车辆工程美学。')}<br />
            <span className="text-xs md:text-sm tracking-wider uppercase opacity-60">Digital Twin Space: Reconstructing Vehicle Engineering Aesthetics.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start px-4 md:px-0">
            <button 
              onClick={handleStartEvolve}
              className="bg-gradient-to-br from-primary to-primary-container px-10 py-4 rounded-xl text-on-primary font-bold font-headline tracking-widest text-sm hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(194,224,255,0.2)]"
            >
              {t('开启演化 | START EVOLVE')}
            </button>
            <button 
              onClick={handleEcosystemLink}
              className="glass-panel px-8 py-4 rounded-xl text-primary font-headline tracking-widest text-sm hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {t('生态联动 | ECOLOGICAL LINKAGE')}
            </button>
          </div>
        </motion.div>

        {/* Floating Data Panel - Now visible on mobile at the bottom of hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative md:absolute md:right-24 md:bottom-32 mt-12 md:mt-0 w-full max-w-[calc(100%-3rem)] md:w-72 glass-panel p-6 rounded-3xl border-white/10 z-10"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="font-headline text-[10px] tracking-widest text-secondary uppercase">{t('Core Status')}</div>
            <Car className={cn("w-5 h-5 transition-colors duration-1000", hasNewMessage ? "text-primary" : "text-white/20")} id="core-status-car" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] uppercase text-on-surface-variant">{t('Sync Rate')}</span>
              <span className={cn("font-headline text-lg transition-all duration-1000", hasNewMessage ? "text-primary" : "text-on-surface-variant")} id="core-status-sync">
                {hasNewMessage ? '100%' : '0%'}
              </span>
            </div>
            <div className="flex gap-1 h-1">
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    backgroundColor: hasNewMessage 
                      ? (i < 18 ? '#00D2FF' : 'rgba(255,255,255,0.1)') // 18 个蓝色，2 个灰色
                      : 'rgba(255,255,255,0.1)' // 全灰
                  }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex-grow rounded-full shadow-[0_0_8px_rgba(0,210,255,0.4)]"
                />
              ))}
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-[10px] uppercase text-on-surface-variant">{t('Tether Link')}</span>
              <span className={cn("font-headline text-lg transition-all duration-1000", hasNewMessage ? "text-secondary" : "text-on-surface-variant")} id="core-status-link">
                {hasNewMessage ? t('已激活') : t('ACTIVE')}
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Brand Introduction Section */}
      <section className="px-6 md:px-24 py-24 md:py-32 relative z-10 max-w-5xl mx-auto text-center md:text-left">
        
        {/* 360 Degree Viewer Module */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <div className="text-center mb-8">
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-white tracking-widest mb-2">
              AETHER 360°
            </h3>
            <p className="text-on-surface-variant text-sm font-light uppercase tracking-widest">
              Drag to explore the form
            </p>
          </div>
          
          <div 
            ref={containerRef}
            className="relative w-full aspect-video md:aspect-[21/9] bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          >
            {/* Preload all images to prevent flickering */}
            <div className="hidden">
              {CAR_FRAMES.map((src, i) => (
                <img key={i} src={src} alt="preload" />
              ))}
            </div>

            {/* Base Frame */}
            <img 
              src={CAR_FRAMES[frame1Index]} 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-75"
              alt="AETHER 360 View"
              style={{ opacity: 1 - interpolationProgress }}
            />
            
            {/* Next Frame Overlay for Interpolation */}
            <img 
              src={CAR_FRAMES[frame2Index]} 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-75"
              alt="AETHER 360 View Overlay"
              style={{ opacity: interpolationProgress }}
            />

            {/* Interactive Hints & HUD */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 pointer-events-none">
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="text-xs font-headline tracking-[0.2em] text-white/80">360° VIEWER</div>
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="w-1 h-1 rounded-full bg-white/50" />
            </div>

            <div className="absolute top-6 left-6 font-headline text-[10px] text-primary tracking-[0.3em] pointer-events-none">
              ANGLE: {Math.round(currentAngle)}°
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel p-8 md:p-16 rounded-[3rem] border-white/5 relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -z-10" />
           
           <h3 className="font-headline text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
             {t('intro_title', '这不仅仅是一辆车，它是科技与感官深度共鸣的结晶。')}
           </h3>
           <p className="text-primary font-headline tracking-widest text-sm mb-12 uppercase">
             {t('intro_subtitle', 'AETHER 灵境系列：连接未来的第四空间')}
           </p>

           <div className="space-y-8 text-on-surface-variant font-light leading-relaxed text-sm md:text-base">
             <p>
               <span className="text-white font-normal">{t('intro_quote', '“科技，从未如此贴近呼吸。”')}</span> {t('intro_p1', '这是 AETHER (以太) 灵境系列的核心宣言。在冷峻的工业数据背后，我们寻找的是一种温润的科技美学，让每一次出行都成为一场穿越数字与现实边界的沉浸之旅。')}
             </p>
             
             <div>
               <h4 className="text-tertiary font-headline tracking-widest text-xs mb-2 flex items-center justify-center md:justify-start gap-2">
                 <span className="w-1 h-1 rounded-full bg-tertiary"></span>
                 {t('intro_h1', '生长美学：流动的视觉盛宴')}
               </h4>
               <p>{t('intro_p2', 'AETHER 的外壳并非死板的覆盖物。通过独创的漆面生长技术，色彩仿佛拥有生命，在光影流转间如水墨般扩散、呼吸。极致的 0.19x Cd 物理形态，配合 GPGPU 粒子流场，让空气阻力化为肉眼可见的优雅律动。')}</p>
             </div>

             <div>
               <h4 className="text-secondary font-headline tracking-widest text-xs mb-2 flex items-center justify-center md:justify-start gap-2">
                 <span className="w-1 h-1 rounded-full bg-secondary"></span>
                 {t('intro_h2', '静谧岛屿：感官的私属边界')}
               </h4>
               <p>{t('intro_p3', '拉开车门，世界瞬间退后。基于 Web Audio 空间声场技术的深度消音逻辑，在舱门闭合的瞬间，外界的喧嚣将被高通滤波器精准剥离。等待你的是模拟高频电磁共振的纯净声场，以及如同“第四空间”般舒适、智能的座舱环境。在这里，车不再是交通工具，而是你心灵的延伸。')}</p>
             </div>

             <div>
               <h4 className="text-primary font-headline tracking-widest text-xs mb-2 flex items-center justify-center md:justify-start gap-2">
                 <span className="w-1 h-1 rounded-full bg-primary"></span>
                 {t('intro_h3', '纯粹动力：机械的原始张力')}
               </h4>
               <p>{t('intro_p4', '在 AETHER 优雅的身姿下，跳动着一颗低沉且有力的电驱心脏。一体化压铸底盘与固态电池包的完美融合，赋予了它超越物理极限的扭矩表现。每一次深踩踏板，伴随着赛博朋克风格的合成音效，你感受到的不仅是推背感，更是纯粹能量在指尖与足下的觉醒。')}</p>
             </div>
             
             <p className="pt-4 border-t border-white/5 text-white font-normal">
               {t('intro_footer', 'AETHER 灵境系列，现已开启数字沉浸预览。它不只是为了抵达目的地，更是为了在路途中，找回你与世界的连接感。')}
             </p>
           </div>
        </motion.div>
      </section>
      
      {/* Navigation Entry Cards - Now Refactored to CoreEvolution */}
      <CoreEvolution />

      {/* Latest Messages Section */}
      <section className="px-6 md:px-24 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 md:p-12 rounded-[2rem] border-white/5"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-2xl font-bold text-white tracking-widest uppercase">
                  {t('访客动态', '访客动态')}
                </h3>
                <p className="text-primary font-headline tracking-[0.2em] text-[10px] uppercase mt-1">
                  Latest Insights from the Community
                </p>
              </div>
            </div>
            <Link 
              to="/guestbook" 
              className="flex items-center gap-2 text-primary font-headline text-xs tracking-widest uppercase hover:gap-4 transition-all group"
            >
              {t('查看全部留言', '查看全部留言')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestMessages.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/5 rounded-2xl">
                <MessageSquare className="w-8 h-8 mb-3 opacity-10" />
                <p className="font-headline text-[10px] tracking-widest uppercase">{t('尚无访客足迹', '尚无访客足迹')}</p>
              </div>
            ) : (
              latestMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={msg.avatarUrl} 
                      alt={msg.nickname} 
                      className="w-8 h-8 rounded-full border border-white/10 object-cover" 
                    />
                    <div className="flex flex-col">
                      <span className="font-headline text-xs text-primary font-bold">{msg.nickname}</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-tighter">
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 font-light leading-relaxed line-clamp-3 mb-4 flex-grow italic">
                    "{msg.text}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-24 pb-32">
        <div className="glass-panel p-12 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center">
            <div className="font-headline text-4xl font-bold text-primary mb-2">4,200+</div>
            <div className="font-headline text-[10px] tracking-widest uppercase text-on-surface-variant">{t('Polygons (K)')}</div>
          </div>
          <div className="h-12 w-px bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="font-headline text-4xl font-bold text-secondary mb-2">0.18</div>
            <div className="font-headline text-[10px] tracking-widest uppercase text-on-surface-variant">{t('Drag Coeff (Cx)')}</div>
          </div>
          <div className="h-12 w-px bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="font-headline text-4xl font-bold text-tertiary mb-2">{t('Real-time')}</div>
            <div className="font-headline text-[10px] tracking-widest uppercase text-on-surface-variant">{t('Rendering')}</div>
          </div>
          <div className="h-12 w-px bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="font-headline text-4xl font-bold text-white mb-2">∞</div>
            <div className="font-headline text-[10px] tracking-widest uppercase text-on-surface-variant">{t('Possibilities')}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
