import { motion } from 'motion/react';
import { ArrowRight, Car, RefreshCw, Layers, Headphones } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import heroBg from '../assets/hero-bg.jpg';
import { useTranslation } from 'react-i18next';

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
    title: '声场模拟',
    subtitle: 'Acoustic Simulation',
    description: '3D全景声场渲染与物理引擎模拟，在数字空间感受引擎与风阻的嘶吼。',
    path: '/acoustic',
    icon: Headphones,
    color: 'text-tertiary',
    image: 'https://picsum.photos/seed/car-audio-system/800/1000'
  }
];

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    <div className="relative min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center px-12 md:px-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            className="w-full h-full object-cover opacity-80"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl w-full"
        >
          <div className="inline-block px-3 py-1 mb-6 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-[10px] tracking-[0.2em] font-headline uppercase">
            {t('Aether Spiritus Edition')}
          </div>
          <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tight mb-4 leading-none text-white">
            {t('AETHER')} <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">{t('灵境系列')}</span>
          </h1>
          <h2 className="font-headline text-2xl md:text-3xl text-primary/80 tracking-widest mb-8 font-light">
            {t('AETHER SPIRIT SERIES')}
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl font-light leading-relaxed mb-10">
            {t('数字化孪生空间：重构车辆工程美学。')}<br />
            <span className="text-sm tracking-wider uppercase opacity-60">Digital Twin Space: Reconstructing Vehicle Engineering Aesthetics.</span>
          </p>
          <div className="flex gap-6">
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

        {/* Floating Data Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-24 bottom-32 hidden xl:block w-72 glass-panel p-6 rounded-3xl border-white/10"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="font-headline text-[10px] tracking-widest text-secondary uppercase">{t('Core Status')}</div>
            <Car className="text-tertiary w-5 h-5" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] uppercase text-on-surface-variant">{t('Sync Rate')}</span>
              <span className="font-headline text-lg text-primary">98.4%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '98.4%' }}
                transition={{ duration: 1.5, delay: 1 }}
                className="h-full bg-tertiary shadow-[0_0_8px_rgba(128,236,255,0.6)]"
              />
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-[10px] uppercase text-on-surface-variant">{t('Tether Link')}</span>
              <span className="font-headline text-lg text-secondary">{t('ACTIVE')}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Brand Introduction Section */}
      <section className="px-12 md:px-24 py-24 md:py-32 relative z-10 max-w-5xl mx-auto text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
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

      {/* Navigation Entry Cards */}
      <section className="px-12 md:px-24 py-12 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {modules.map((module, idx) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
          >
            <Link
              to={module.path}
              className="group relative aspect-[4/5] block overflow-hidden rounded-3xl glass-panel transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,210,255,0.1)]"
            >
              <img
                src={module.image}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                alt={module.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <div className={cn("font-headline text-[10px] tracking-[0.3em] uppercase mb-2", module.color)}>
                  {t(`Module ${module.id}`)}
                </div>
                <h3 className="font-headline text-2xl font-bold mb-1 text-white">{t(module.title)}</h3>
                <h4 className="font-headline text-xs tracking-widest text-primary/60 uppercase mb-4">{t(module.subtitle)}</h4>
                <p className="text-xs text-on-surface-variant font-light mb-6 leading-relaxed">
                  {t(module.description)}
                </p>
                <div className={cn("flex items-center gap-2 font-headline text-[10px] tracking-widest uppercase group-hover:gap-4 transition-all", module.color)}>
                  {t('进入模块 | ENTER')} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="px-12 md:px-24 pb-32">
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
