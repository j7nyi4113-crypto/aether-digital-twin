import { motion } from 'motion/react';
import { Layers, Sun, CloudSun, Moon, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
        <motion.div
          key={`${activeColor.name}-${activeEnv.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-6xl aspect-video shrink-0 md:shrink"
        >
          {/* Main Display: Car Body or Environment Image */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
             <img
              src={activeEnv.bg ? activeEnv.bg : activeColor.image}
              className="w-full h-full object-contain opacity-90 transition-opacity duration-500"
              alt={activeEnv.bg ? activeEnv.name : `${activeColor.name} Car Body`}
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Detail View Overlay (Only show when Daylight/Car is active) */}
        {!activeEnv.bg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 w-full max-w-sm md:w-80 glass-panel p-8 rounded-3xl border-white/10 z-10"
          >
            <div className="font-headline text-[10px] tracking-[0.3em] text-secondary uppercase mb-6">{t('Material Specs')}</div>
            <h3 className="font-headline text-2xl font-bold text-white mb-2">{t(activeColor.name)}</h3>
            <p className="text-xs text-on-surface-variant font-light mb-8 leading-relaxed">
              {t('纳米级液态金属涂层，支持实时光线追踪反射与多层色相演化。')}
            </p>
            
            <div className="space-y-6">
              <SpecItem label="Reflectivity" value="92%" />
              <SpecItem label="Glossiness" value="88%" />
              <SpecItem label="Metallic" value="100%" />
            </div>

            <button className="w-full mt-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-headline text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all">
              {t('保存配置 | SAVE CONFIG')}
            </button>
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
              onClick={() => setActiveColor(color)}
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

function SpecItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[8px] uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-secondary" style={{ width: value }} />
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
