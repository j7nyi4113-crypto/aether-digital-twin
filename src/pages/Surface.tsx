import { motion, AnimatePresence } from 'motion/react';
import { Layers, Sun, CloudSun, Moon, Palette, RefreshCw, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

import whiteCar from '../assets/white.png';
import blackCar from '../assets/black.png';
import yellowCar from '../assets/yellow.png';
import purpleCar from '../assets/purple.png';
import blueCar from '../assets/blue.png';
import caliBg from '../assets/cali.png';
import shanghaiBg from '../assets/shanghai.png';

const colors = [
  { name: '以太白', code: '#f8f9fa', label: 'Aether White', image: whiteCar },
  { name: '深空灰', code: '#343a40', label: 'Deep Space', image: blackCar },
  { name: '液态金', code: '#ffd700', label: 'Liquid Gold', image: yellowCar },
  { name: '极光紫', code: '#6f42c1', label: 'Aurora Purple', image: purpleCar },
  { name: '赛博蓝', code: '#007bff', label: 'Cyber Blue', image: blueCar },
];

const environments = [
  { name: 'Daylight', label: 'HDR 环境', icon: Sun, bg: null },
  { name: 'Golden Hour', label: '落日加州', icon: CloudSun, bg: caliBg },
  { name: 'Night', label: '午夜上海', icon: Moon, bg: shanghaiBg },
];

export default function Surface() {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [activeEnv, setActiveEnv] = useState(environments[0]);
  const [isAutoEvolving, setIsAutoEvolving] = useState(true);
  const evolutionTimer = useRef<any>(null);

  // Auto Evolution Logic
  useEffect(() => {
    if (isAutoEvolving && !activeEnv.bg) {
      evolutionTimer.current = setInterval(() => {
        setActiveColor((prev) => {
          const currentIndex = colors.findIndex(c => c.name === prev.name);
          const nextIndex = (currentIndex + 1) % colors.length;
          return colors[nextIndex];
        });
      }, 5000); // Change color every 5 seconds
    } else {
      if (evolutionTimer.current) clearInterval(evolutionTimer.current);
    }

    return () => {
      if (evolutionTimer.current) clearInterval(evolutionTimer.current);
    };
  }, [isAutoEvolving, activeEnv.bg]);

  // Read URL query params to set the environment initially
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const envParam = searchParams.get('env');
    if (envParam === 'cali') {
      setActiveEnv(environments[1]); // Golden Hour
    } else if (envParam === 'shanghai') {
      setActiveEnv(environments[2]); // Night
    } else {
      setActiveEnv(environments[0]); // Daylight
    }
  }, [location.search]);

  return (
    <div className="relative min-h-screen pt-24 px-6 md:pl-24 md:pr-12 pb-24 flex flex-col">
      <div className="flex-grow relative flex flex-col md:flex-row items-center justify-center overflow-hidden mt-10 gap-12">
        <div className="relative w-full max-w-6xl aspect-video shrink-0 md:shrink">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeColor.name}-${activeEnv.name}`}
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={activeEnv.bg ? activeEnv.bg : activeColor.image}
                className="w-full h-full object-contain opacity-90 transition-opacity duration-500"
                alt={activeEnv.bg ? activeEnv.name : `${activeColor.name} Car Body`}
                referrerPolicy="no-referrer"
              />
              
              {/* Material Glow Effect during Evolution */}
              {isAutoEvolving && !activeEnv.bg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${activeColor.code}33 0%, transparent 70%)`
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Detail View Overlay */}
        {!activeEnv.bg && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 w-full max-w-sm md:w-80 glass-panel p-8 rounded-3xl border-white/10 z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="font-headline text-[10px] tracking-[0.3em] text-secondary uppercase">{t('Material Specs')}</div>
              {isAutoEvolving && (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8px] text-primary font-headline tracking-widest uppercase">{t('Evolving')}</span>
                </div>
              )}
            </div>
            
            <h3 className="font-headline text-2xl font-bold text-white mb-2">{t(activeColor.name)}</h3>
            <p className="text-xs text-on-surface-variant font-light mb-8 leading-relaxed">
              {isAutoEvolving 
                ? t('实时演化模式已开启。纳米级液态金属涂层正在根据环境光照与电荷流动进行色相偏移。')
                : t('手动配置模式。纳米级液态金属涂层支持实时光线追踪反射与多层色相演化。')}
            </p>
            
            <div className="space-y-6">
              <SpecItem label="Reflectivity" value={isAutoEvolving ? "Dynamic" : "92%"} progress={92} />
              <SpecItem label="Glossiness" value={isAutoEvolving ? "Dynamic" : "88%"} progress={88} />
              <SpecItem label="Metallic" value="100%" progress={100} />
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <button 
                onClick={() => setIsAutoEvolving(!isAutoEvolving)}
                className={cn(
                  "w-full py-4 rounded-xl border font-headline text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3",
                  isAutoEvolving 
                    ? "bg-primary/20 border-primary/40 text-primary" 
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                )}
              >
                {isAutoEvolving ? <Zap className="w-3 h-3 fill-current" /> : <RefreshCw className="w-3 h-3" />}
                {isAutoEvolving ? t('停止演化 | STOP EVOLVE') : t('开启自动演化 | AUTO EVOLVE')}
              </button>
              
              <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white/40 font-headline text-[10px] tracking-widest uppercase cursor-not-allowed">
                {t('保存配置 | SAVE CONFIG')}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Color Selection Bar & Environment Controls */}
      <div className="mt-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-12">
        {/* Only show color circles when in default HDR environment (activeEnv.bg is null) */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {!activeEnv.bg && colors.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                setActiveColor(color);
                setIsAutoEvolving(false); // Stop auto evolution on manual selection
              }}
              className={`group relative flex flex-col items-center gap-3 transition-all duration-300 ${activeColor.name === color.name ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
            >
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all ${activeColor.name === color.name ? 'border-primary shadow-[0_0_15px_rgba(194,224,255,0.5)]' : 'border-transparent'}`}
                style={{ backgroundColor: color.code }}
              />
              <span className={`font-headline text-[8px] uppercase tracking-widest ${activeColor.name === color.name ? 'text-primary' : 'text-on-surface-variant'}`}>
                {t(color.label)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-4 md:gap-6 glass-panel p-4 rounded-2xl border-white/10 w-full md:w-auto justify-center">
          {environments.map((env) => (
            <EnvironmentControl 
              key={env.name}
              icon={env.icon} 
              label={t(env.label)} 
              active={activeEnv.name === env.name} 
              onClick={() => setActiveEnv(env)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpecItem({ label, value, progress }: { label: string, value: string, progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[8px] uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
          className="h-full bg-secondary shadow-[0_0_10px_rgba(213,187,255,0.5)]" 
        />
      </div>
    </div>
  );
}

function EnvironmentControl({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group transition-all ${active ? 'text-primary' : 'text-on-surface-variant hover:text-white'}`}
    >
      <div className={`p-2 rounded-lg transition-all ${active ? 'bg-primary/10' : 'group-hover:bg-white/5'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-headline text-[8px] uppercase tracking-widest">{label}</span>
    </button>
  );
}
