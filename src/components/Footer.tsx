import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Activity, Zap, Eye, Cpu, Wind, Search, Navigation } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import heroBg from '../assets/hero-bg.jpg';

export default function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [hexData, setHexData] = useState<string>('');
  
  // Manual Modal States
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate random hex string for background effect
  useEffect(() => {
    if (!showSystemModal) return;
    
    const generateHex = () => {
      const chars = '0123456789ABCDEF';
      let result = '';
      for (let i = 0; i < 200; i++) {
        result += chars[Math.floor(Math.random() * chars.length)] + (Math.random() > 0.8 ? ' ' : '');
      }
      return result;
    };

    setHexData(generateHex());
    const interval = setInterval(() => {
      setHexData(generateHex());
    }, 150); // fast update

    return () => clearInterval(interval);
  }, [showSystemModal]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight > 0) {
      setScrollProgress((target.scrollTop / scrollHeight) * 100);
    } else {
      setScrollProgress(100);
    }
  };

  // Reset scroll progress when modal opens
  useEffect(() => {
    if (showPrivacyModal) {
      setScrollProgress(0);
    }
  }, [showPrivacyModal]);

  return (
    <>
      <footer className="fixed bottom-0 w-full flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-6 bg-transparent z-40 pointer-events-none gap-4 md:gap-0">
        <div className="font-headline text-[10px] tracking-widest text-primary/40 uppercase text-center md:text-left">
          © 2026 AETHER DIGITAL TWIN. ALL RIGHTS RESERVED.
        </div>
        <nav className="flex gap-4 md:gap-8 font-headline text-[10px] tracking-widest pointer-events-auto">
          <a 
            className="text-primary/40 hover:text-tertiary transition-colors cursor-pointer uppercase" 
            onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}
          >
            Privacy Policy
          </a>
          <a 
            className="text-primary/40 hover:text-tertiary transition-colors cursor-pointer uppercase" 
            onClick={(e) => { e.preventDefault(); setShowSystemModal(true); }}
          >
            System Status
          </a>
          <a 
            className="text-primary/40 hover:text-tertiary transition-colors cursor-pointer uppercase" 
            onClick={(e) => { e.preventDefault(); setShowManualModal(true); }}
          >
            Manual
          </a>
        </nav>
      </footer>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl"
          >
            {/* Subtle animated background representing digital boundary */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <motion.div 
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-[200%] h-[200%] -top-[50%] -left-[50%] absolute bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
              />
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative w-full max-w-4xl h-[85vh] bg-background/40 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Reading Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-tertiary shadow-[0_0_10px_rgba(128,236,255,0.8)]"
                  style={{ width: `${scrollProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white z-20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Scrollable Content */}
              <div 
                className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar relative z-10"
                onScroll={handleScroll}
              >
                <div className="max-w-2xl mx-auto">
                  <header className="mb-16 text-center">
                    <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" strokeWidth={1.5} />
                    <h2 className="font-serif text-3xl md:text-4xl text-white mb-6 tracking-wide leading-tight">
                      隐私与数据主权：<br/>AETHER 的数字边界
                    </h2>
                    <p className="font-headline text-xs tracking-[0.3em] uppercase text-primary mb-8">
                      Privacy &amp; Digital Sovereignty
                    </p>
                    <div className="w-16 h-px bg-white/20 mx-auto mb-8" />
                    <p className="text-xl font-serif italic text-white/80 leading-relaxed">
                      “在 AETHER，我们不仅保护你的出行安全，更守护你的数字灵魂。”
                    </p>
                  </header>

                  <div className="space-y-16 font-serif text-white/70 leading-loose">
                    
                    {/* Section 1 */}
                    <section>
                      <h3 className="font-headline text-lg text-white mb-6 tracking-widest uppercase flex items-center gap-4">
                        <span className="text-primary font-bold">1.</span> 我们的承诺：数据即隐私，而非商品
                      </h3>
                      <p className="mb-6">
                        在 AETHER 灵境系列的设计初衷里，科技应当是隐形的。我们收集数据的唯一目的，是让车辆更懂你的习惯，而非将你转化为算法的标靶。
                      </p>
                      <ul className="space-y-4 pl-6 border-l border-white/10">
                        <li>
                          <strong className="text-white font-normal block mb-1">绝对私有：</strong>
                          你的生物识别信息（如面部解锁、心率监测）仅加密存储于车辆本地的安全芯片中，绝不上传云端。
                        </li>
                        <li>
                          <strong className="text-white font-normal block mb-1">零留痕模式：</strong>
                          开启“隐匿模式”后，车辆将停止记录任何位置与行为轨迹，让你的每一段旅程都只属于你自己。
                        </li>
                      </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                      <h3 className="font-headline text-lg text-white mb-6 tracking-widest uppercase flex items-center gap-4">
                        <span className="text-primary font-bold">2.</span> 我们如何感知，以及为何感知
                      </h3>
                      <p className="mb-6">
                        为了实现“温润科技”的交互体验，AETHER 会在以下维度与你产生数据共振：
                      </p>
                      <ul className="space-y-4 pl-6 border-l border-white/10">
                        <li>
                          <strong className="text-white font-normal block mb-1">感官自适应：</strong>
                          通过传感器感知舱内光线与温度，自动调节色温与音场。
                        </li>
                        <li>
                          <strong className="text-white font-normal block mb-1">驾驶辅助：</strong>
                          利用激光雷达获取环境数据，仅用于毫秒级的安全决策，所有环境图像均经过脱敏处理。
                        </li>
                        <li>
                          <strong className="text-white font-normal block mb-1">生态同步：</strong>
                          仅在你授权的情况下，同步你的数字日程，以便为你预先调节座舱状态。
                        </li>
                      </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                      <h3 className="font-headline text-lg text-white mb-6 tracking-widest uppercase flex items-center gap-4">
                        <span className="text-primary font-bold">3.</span> 数据主权：你拥有最高指挥权
                      </h3>
                      <p className="mb-6">
                        我们坚信，用户应该是数据的主人，而非被观测者。
                      </p>
                      <ul className="space-y-4 pl-6 border-l border-white/10">
                        <li>
                          <strong className="text-white font-normal block mb-1">透明查阅：</strong>
                          你可以随时通过 AETHER App 查阅车辆收集的所有非敏感数据类别。
                        </li>
                        <li>
                          <strong className="text-white font-normal block mb-1">一键清除：</strong>
                          像清理缓存一样简单，你可以随时擦除车辆在学习你驾驶习惯过程中产生的记录。
                        </li>
                        <li>
                          <strong className="text-white font-normal block mb-1">第三方拒绝：</strong>
                          我们承诺永不向任何第三方机构出售或共享你的个人出行特征。
                        </li>
                      </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                      <h3 className="font-headline text-lg text-white mb-6 tracking-widest uppercase flex items-center gap-4">
                        <span className="text-primary font-bold">4.</span> 法律与安全标准
                      </h3>
                      <p>
                        AETHER 严格遵守全球最严苛的数据保护条例（如 GDPR 及各国相关法律）。我们采用军用级的端到端加密技术，确保你的数字边界坚不可摧。
                      </p>
                    </section>

                    {/* Designer Quote */}
                    <div className="mt-16 p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <p className="font-headline text-xs tracking-widest text-primary uppercase mb-4">设计师寄语</p>
                      <p className="font-serif italic text-white/90 leading-relaxed text-lg">
                        “当你坐在 AETHER 舱内，你应当感受到的是绝对的自由与安全。这种安全感不仅来自坚固的车身，更来自那道看不见但足够可靠的数字屏障。”
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="p-8 border-t border-white/10 bg-background/80 backdrop-blur-xl flex justify-center z-20">
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="group relative px-12 py-4 overflow-hidden rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative font-headline text-sm tracking-widest text-white uppercase flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    开启我的数字私域
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Status Modal */}
      <AnimatePresence>
        {showSystemModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl font-mono"
          >
            {/* Hex Background Effect */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
              <p className="text-white text-justify leading-none text-2xl w-[150%] break-all font-mono whitespace-pre-wrap" style={{ wordBreak: 'break-all' }}>
                {hexData}
              </p>
            </div>

            <button 
              onClick={() => setShowSystemModal(false)}
              className="absolute top-8 right-8 p-3 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full max-w-[1400px] flex flex-col md:flex-row p-8 md:p-12 relative z-10 gap-8">
              
              {/* Left Column: Data Streams */}
              <div className="w-full md:w-[45%] flex flex-col h-full overflow-y-auto custom-scrollbar pr-4 pb-12">
                <header className="mb-10 pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-primary" />
                    <h2 className="font-headline text-2xl md:text-3xl text-white tracking-widest uppercase">
                      AETHER 神经系统实时概览
                    </h2>
                  </div>
                  <p className="text-primary/60 text-xs tracking-[0.2em] uppercase mb-4">Neural System Status</p>
                  <p className="text-white/50 text-sm font-sans italic border-l-2 border-primary/30 pl-3">
                    “全域感知，实时共鸣。AETHER 的每一个细胞都处于最佳律动。”
                  </p>
                </header>

                <div className="space-y-8 flex-1">
                  
                  {/* Powertrain */}
                  <section 
                    className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-5 rounded-2xl transition-colors cursor-default"
                    onMouseEnter={() => setHoveredSection('powertrain')}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                      <h3 className="text-white text-sm font-bold tracking-widest flex items-center gap-2">
                        <span className="text-primary font-mono text-xs">01</span> 核心动力中枢
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-tertiary tracking-widest">ACTIVE</span>
                        <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(0,210,255,0.8)]" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>固态能量矩阵 (Solid-State Battery)</span>
                          <span className="text-white">健康度 100% | 28°C</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-tertiary to-primary shadow-[0_0_5px_rgba(0,210,255,0.5)]" 
                          />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1 font-sans">说明：自研“冰点”热管理系统正持续监控电芯活性，确保电流输出如丝绸般平稳。</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>以太驱动电机 (Aether-Drive Motors)</span>
                          <span className="text-white">就绪</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-sans">说明：碳纤维转子平衡度已校验，随时准备释放 850 N·m 的瞬时意志。</p>
                      </div>
                    </div>
                  </section>

                  {/* Sensory & Perception */}
                  <section 
                    className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-5 rounded-2xl transition-colors cursor-default"
                    onMouseEnter={() => setHoveredSection('sensory')}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                      <h3 className="text-white text-sm font-bold tracking-widest flex items-center gap-2">
                        <span className="text-secondary font-mono text-xs">02</span> 感官与感知层
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-secondary tracking-widest">HIGH-SENSITIVITY</span>
                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>LiDAR 激光雷达阵列</span>
                          <span className="text-secondary animate-pulse">环境建模中...</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-sans">说明：三向激光扫描仪已建立 360° 实时数字孪生场，识别范围覆盖前方 300 米。(精度: 2mm)</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>灵境声学处理器 (Spatial Audio Engine)</span>
                          <span className="text-white">沉浸式</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-sans">说明：主动消音算法正在对冲外界 120Hz 频率的低频噪音，维持舱内 35dB 的绝对静谧。</p>
                      </div>
                    </div>
                  </section>

                  {/* Connectivity & Intelligence */}
                  <section 
                    className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-5 rounded-2xl transition-colors cursor-default"
                    onMouseEnter={() => setHoveredSection('intelligence')}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                      <h3 className="text-white text-sm font-bold tracking-widest flex items-center gap-2">
                        <span className="text-primary font-mono text-xs">03</span> 连接与智能
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-primary tracking-widest">SYNCING</span>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(128,236,255,0.8)]" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>AETHER OS 核心 (v2.4.0 "Vitality")</span>
                          <span className="text-white">CPU: 12%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: '12%' }} transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-white shadow-[0_0_5px_rgba(128,236,255,0.5)]" 
                          />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1 font-sans">状态：运行稳定。</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>全息交互界面 (Holographic UI)</span>
                          <span className="text-white">响应正常</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-sans">说明：手势识别传感器已校准，延迟低于 5ms。</p>
                      </div>
                    </div>
                  </section>

                  {/* Aero & Structure */}
                  <section 
                    className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-5 rounded-2xl transition-colors cursor-default"
                    onMouseEnter={() => setHoveredSection('aero')}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                      <h3 className="text-white text-sm font-bold tracking-widest flex items-center gap-2">
                        <span className="text-white/60 font-mono text-xs">04</span> 气动与结构
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/60 tracking-widest">MONITORING</span>
                        <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>主动气动套件 (Active Aero)</span>
                          <span className="text-white">动态闭合</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-sans">说明：后扩散器角度已优化，当前风阻锁定在 0.198 Cd 的理想值。</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>一体化底盘刚性</span>
                          <span className="text-white">结构完好</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-sans">说明：应力传感器未检测到任何疲劳损伤，抗扭强度维持在 42,000 N·m/deg。</p>
                      </div>
                    </div>
                  </section>

                </div>

                <div className="mt-8 text-center md:text-left text-[10px] text-white/30 tracking-[0.2em] font-sans">
                  AETHER IS BREATHING. DESIGNED BY JUNYI LIU
                </div>
              </div>

              {/* Right Column: Neural Network Map (3D Wireframe / Highlight) */}
              <div className="hidden md:flex w-[55%] h-full relative items-center justify-center">
                {/* Center glowing orbit */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80%] aspect-square rounded-full border border-white/5 opacity-20" />
                  <div className="absolute w-[60%] aspect-square rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute w-[40%] aspect-square rounded-full border border-secondary/10 animate-[spin_15s_linear_infinite_reverse]" />
                </div>

                <div className="relative w-full max-w-2xl aspect-video">
                  <img 
                    src={heroBg} 
                    alt="Neural Network Map" 
                    className="w-full h-full object-contain opacity-40 mix-blend-screen filter brightness-150 contrast-125"
                  />
                  
                  {/* Overlay Highlights based on Hover State */}
                  <AnimatePresence>
                    {hoveredSection === 'powertrain' && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {/* Battery Pack Glow */}
                        <div className="absolute bottom-[25%] left-[25%] w-[50%] h-[10%] bg-tertiary/40 blur-[20px] rounded-full animate-pulse" />
                        {/* Motors Glow */}
                        <div className="absolute bottom-[35%] left-[20%] w-[15%] h-[15%] bg-tertiary/50 blur-[25px] rounded-full" />
                        <div className="absolute bottom-[35%] right-[20%] w-[15%] h-[15%] bg-tertiary/50 blur-[25px] rounded-full" />
                      </motion.div>
                    )}

                    {hoveredSection === 'sensory' && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {/* LiDAR Roof Glow */}
                        <div className="absolute top-[25%] left-[45%] w-[10%] h-[10%] bg-secondary/60 blur-[15px] rounded-full animate-pulse" />
                        {/* Front Sensors Glow */}
                        <div className="absolute top-[45%] left-[10%] w-[10%] h-[10%] bg-secondary/40 blur-[20px] rounded-full" />
                      </motion.div>
                    )}

                    {hoveredSection === 'intelligence' && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {/* Cabin Center Glow */}
                        <div className="absolute top-[35%] left-[40%] w-[20%] h-[20%] bg-primary/40 blur-[30px] rounded-full animate-pulse" />
                        {/* Floating data bits simulation */}
                        <div className="absolute top-[30%] left-[45%] w-2 h-2 bg-primary shadow-[0_0_10px_rgba(0,210,255,1)] rounded-full animate-ping" />
                        <div className="absolute top-[38%] left-[55%] w-1.5 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,1)] rounded-full animate-ping delay-300" />
                      </motion.div>
                    )}

                    {hoveredSection === 'aero' && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {/* Underbody and Diffuser Glow */}
                        <div className="absolute bottom-[20%] left-[10%] right-[10%] h-[5%] bg-white/20 blur-[15px] rounded-full animate-pulse" />
                        <div className="absolute bottom-[25%] right-[15%] w-[15%] h-[10%] bg-white/30 blur-[20px] rounded-full" />
                        {/* Wheels outline glow */}
                        <div className="absolute top-[48%] left-[18%] w-12 h-12 border border-white/50 rounded-full blur-[4px]" />
                        <div className="absolute top-[48%] right-[18%] w-12 h-12 border border-white/50 rounded-full blur-[4px]" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Overlay Scanners */}
                  <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent shadow-[0_0_10px_rgba(0,210,255,0.5)] animate-[slide_4s_linear_infinite]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Modal */}
      <AnimatePresence>
        {showManualModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0A] overflow-hidden"
          >
            {/* Top Navigation & Search Bar */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-8 py-4 md:py-6 border-b border-white/5 z-20 gap-4 md:gap-0 relative">
              <div className="flex flex-col">
                <h2 className="font-serif text-xl md:text-2xl text-white tracking-widest">
                  AETHER 灵境使用手册
                </h2>
                <span className="font-headline text-[10px] text-primary/60 tracking-[0.3em] uppercase">
                  The Manual: Symbiosis Guide
                </span>
              </div>

              {/* Smart Search */}
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-white/30" />
                </div>
                <input
                  type="text"
                  placeholder="搜索交互方式、充电..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.includes('充电')) {
                      setActiveHotspot('charge');
                    } else if (e.target.value.includes('驾驶') || e.target.value.includes('模式')) {
                      setActiveHotspot('drive');
                    } else if (e.target.value.includes('手势') || e.target.value.includes('交互')) {
                      setActiveHotspot('interact');
                    } else if (e.target.value === '') {
                      setActiveHotspot(null);
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors font-sans"
                />
              </div>

              <button 
                onClick={() => setShowManualModal(false)}
                className="absolute top-4 right-4 md:relative md:top-auto md:right-auto p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row relative">
              
              {/* Left Side: Interactive 3D Wireframe / Hotspots */}
              <div className="w-full md:w-[60%] h-[40vh] md:h-full relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                
                <motion.div 
                  className="relative w-[80%] max-w-3xl aspect-video"
                  animate={{
                    rotateY: activeHotspot === 'charge' ? -15 : activeHotspot === 'drive' ? 10 : 0,
                    scale: activeHotspot ? 1.1 : 1
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <img 
                    src={heroBg} 
                    alt="AETHER Wireframe" 
                    className="w-full h-full object-contain opacity-50 mix-blend-screen filter grayscale contrast-150"
                  />

                  {/* Hotspots */}
                  {/* Door / Entry */}
                  <button 
                    className="absolute top-[45%] left-[45%] group"
                    onClick={() => setActiveHotspot('entry')}
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className={cn("absolute inset-0 rounded-full transition-all duration-500", activeHotspot === 'entry' ? "bg-primary/40 animate-ping" : "bg-white/10 group-hover:bg-white/20")} />
                      <div className={cn("w-2 h-2 rounded-full transition-colors", activeHotspot === 'entry' ? "bg-primary shadow-[0_0_10px_rgba(0,210,255,1)]" : "bg-white")} />
                    </div>
                  </button>

                  {/* Steering / Drive Modes */}
                  <button 
                    className="absolute top-[35%] left-[30%] group"
                    onClick={() => setActiveHotspot('drive')}
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className={cn("absolute inset-0 rounded-full transition-all duration-500", activeHotspot === 'drive' ? "bg-secondary/40 animate-ping" : "bg-white/10 group-hover:bg-white/20")} />
                      <div className={cn("w-2 h-2 rounded-full transition-colors", activeHotspot === 'drive' ? "bg-secondary shadow-[0_0_10px_rgba(139,92,246,1)]" : "bg-white")} />
                    </div>
                  </button>

                  {/* Center Console / Interaction */}
                  <button 
                    className="absolute top-[40%] left-[38%] group"
                    onClick={() => setActiveHotspot('interact')}
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className={cn("absolute inset-0 rounded-full transition-all duration-500", activeHotspot === 'interact' ? "bg-tertiary/40 animate-ping" : "bg-white/10 group-hover:bg-white/20")} />
                      <div className={cn("w-2 h-2 rounded-full transition-colors", activeHotspot === 'interact' ? "bg-tertiary shadow-[0_0_10px_rgba(128,236,255,1)]" : "bg-white")} />
                    </div>
                  </button>

                  {/* Charge Port */}
                  <button 
                    className="absolute top-[45%] right-[15%] group"
                    onClick={() => setActiveHotspot('charge')}
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className={cn("absolute inset-0 rounded-full transition-all duration-500", activeHotspot === 'charge' ? "bg-primary/40 animate-ping" : "bg-white/10 group-hover:bg-white/20")} />
                      <div className={cn("w-2 h-2 rounded-full transition-colors", activeHotspot === 'charge' ? "bg-primary shadow-[0_0_10px_rgba(0,210,255,1)]" : "bg-white")} />
                    </div>
                  </button>

                </motion.div>

                {/* Animated Scanner line */}
                <div className="absolute top-0 bottom-0 left-[30%] w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)] animate-[slide_6s_linear_infinite]" />
              </div>

              {/* Right Side: Manual Content Panel */}
              <div className="w-full md:w-[40%] h-full border-l border-white/5 bg-black/20 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                
                {/* Default State */}
                <AnimatePresence mode="wait">
                  {!activeHotspot && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col justify-center text-center"
                    >
                      <Navigation className="w-12 h-12 text-white/10 mx-auto mb-6" />
                      <h3 className="font-serif text-2xl text-white/80 mb-4">无需学习，只需感知</h3>
                      <p className="text-white/40 font-sans text-sm leading-relaxed max-w-sm mx-auto">
                        请点击左侧模型上的高亮热点，或使用顶部搜索框输入需求，例如“如何充电”、“驾驶模式”等。
                        <br/><br/>这里是你与 AETHER 达成默契的开始。
                      </p>
                    </motion.div>
                  )}

                  {/* Entry Hotspot */}
                  {activeHotspot === 'entry' && (
                    <motion.div 
                      key="entry"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="font-headline text-xs tracking-widest text-primary uppercase mb-2">01 / The Awakening</h3>
                        <h2 className="font-serif text-3xl text-white mb-6">唤醒与呼吸</h2>
                        
                        <div className="aspect-video bg-white/5 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative border border-white/10">
                          {/* CSS Animation replacing GIF/Lottie */}
                          <div className="absolute w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </div>
                          <p className="absolute bottom-4 text-[10px] text-white/30 uppercase tracking-widest">UWB Proximity Simulation</p>
                        </div>

                        <div className="space-y-6 text-sm font-sans text-white/60 leading-relaxed">
                          <div>
                            <strong className="text-white block mb-1">无感进入</strong>
                            当你携带 UWB 数字钥匙靠近 2 米范围内，AETHER 的隐藏式门把手会像呼吸一样自然弹出，车内氛围灯由冷色转为暖色，标志着系统已准备就绪。
                          </div>
                          <div>
                            <strong className="text-white block mb-1">语音指令</strong>
                            无需唤醒词。只需在座舱内说出你的需求，例如“我需要思考”，系统会自动调暗灯光、调低音量并启动静谧模式。
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Interact Hotspot */}
                  {activeHotspot === 'interact' && (
                    <motion.div 
                      key="interact"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="font-headline text-xs tracking-widest text-tertiary uppercase mb-2">02 / Interaction Ethos</h3>
                        <h2 className="font-serif text-3xl text-white mb-6">灵境交互逻辑</h2>
                        
                        <div className="aspect-video bg-white/5 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative border border-white/10">
                          {/* CSS Animation replacing GIF/Lottie */}
                          <motion.div 
                            className="w-16 h-16 border-2 border-tertiary/50 rounded-full flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-2 h-2 bg-tertiary rounded-full" />
                          </motion.div>
                          <motion.div 
                            className="absolute w-4 h-4 bg-white/80 rounded-full blur-[2px]"
                            animate={{ x: [-40, 40, -40], y: [20, -20, 20] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <p className="absolute bottom-4 text-[10px] text-white/30 uppercase tracking-widest">Holographic Gesture Sync</p>
                        </div>

                        <div className="space-y-6 text-sm font-sans text-white/60 leading-relaxed">
                          <div>
                            <strong className="text-white block mb-1">悬浮手势</strong>
                            AETHER 舍弃了大部分物理按键。在中央岛台上方悬空滑动，即可调节音量或温度。
                          </div>
                          <div>
                            <strong className="text-white block mb-1">眼动追踪</strong>
                            HUD（平视显示器）会根据你的视线焦点自动高亮重要信息。你看到的，即是 AETHER 关注的。
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Drive Hotspot */}
                  {activeHotspot === 'drive' && (
                    <motion.div 
                      key="drive"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="font-headline text-xs tracking-widest text-secondary uppercase mb-2">03 / Drive Modes</h3>
                        <h2 className="font-serif text-3xl text-white mb-6">动力模式切换</h2>
                        
                        <div className="aspect-video bg-white/5 rounded-2xl mb-6 flex flex-col items-center justify-center overflow-hidden relative border border-white/10 gap-4">
                          <div className="w-full px-12">
                            <div className="flex justify-between text-[10px] text-white/50 mb-2"><span>Serenity</span><span>Emerge</span></div>
                            <div className="w-full h-1 bg-white/10 rounded-full relative">
                              <motion.div 
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-secondary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                                animate={{ left: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                              />
                            </div>
                          </div>
                          <p className="absolute bottom-4 text-[10px] text-white/30 uppercase tracking-widest">Dynamic Output Curve</p>
                        </div>

                        <div className="space-y-6 text-sm font-sans text-white/60 leading-relaxed">
                          <div>
                            <strong className="text-white block mb-1">纯净态 (Serenity)</strong>
                            电机输出柔顺，动能回收平缓。适合城市通勤，营造极致的静谧岛屿。
                          </div>
                          <div>
                            <strong className="text-white block mb-1">觉醒态 (Emerge)</strong>
                            850 N·m 扭矩全量解锁。悬挂变硬，转向比收紧，声浪切换为 [Velocity Pressure] 模式，享受纯粹的驾驶操控。
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Charge Hotspot */}
                  {activeHotspot === 'charge' && (
                    <motion.div 
                      key="charge"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="font-headline text-xs tracking-widest text-primary uppercase mb-2">04 / Maintenance</h3>
                        <h2 className="font-serif text-3xl text-white mb-6">维护与生长</h2>
                        
                        <div className="aspect-video bg-white/5 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative border border-white/10">
                          <motion.div 
                            className="w-12 h-12 border-t-2 border-r-2 border-primary rounded-tr-xl"
                            animate={{ rotateX: [0, 180, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ transformOrigin: 'left bottom' }}
                          />
                          <div className="absolute w-8 h-8 bg-primary/20 rounded-full blur-md animate-pulse" />
                          <p className="absolute bottom-4 text-[10px] text-white/30 uppercase tracking-widest">Motorized Port Array</p>
                        </div>

                        <div className="space-y-6 text-sm font-sans text-white/60 leading-relaxed">
                          <div>
                            <strong className="text-white block mb-1">漆面养护</strong>
                            由于采用了“生长漆面”技术，请仅使用 AETHER 认证的生物洗剂，以保持纳米级电路的导电活性。
                          </div>
                          <div>
                            <strong className="text-white block mb-1">OTA 更新</strong>
                            AETHER 会在深夜自动进化。每一次醒来，它都会比昨天更懂你的驾驶偏好。
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
