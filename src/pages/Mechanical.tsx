import { motion } from 'motion/react';
import { Gauge, Zap, Wind, Scale, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import heroBg from '../assets/hero-bg.jpg';
import { useTranslation } from 'react-i18next';

const stats = [
  { label: '功率 | POWER', value: '780', unit: 'kW', icon: Zap, color: 'text-tertiary' },
  { label: '扭矩 | TORQUE', value: '1,200', unit: 'Nm', icon: Gauge, color: 'text-secondary' },
  { label: '风阻 | DRAG', value: '0.19', unit: 'Cd', icon: Wind, color: 'text-primary' },
  { label: '重量 | WEIGHT', value: '1,850', unit: 'kg', icon: Scale, color: 'text-on-surface' },
];

export default function Mechanical() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen pt-24 pl-24 pr-12 pb-24 flex flex-col">
      {/* Main Chassis Display Area */}
      <div className="flex-grow relative flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-6xl aspect-video"
        >
          {/* Main Car Image (Chassis) */}
          <img
            src={heroBg}
            className="w-full h-full object-contain opacity-90 mix-blend-screen"
            alt="Chassis"
          />
          
          {/* Interactive Hotspots */}
          <Hotspot x="30%" y="40%" label={t("动力总成")} sub={t("Power Unit")} />
          <Hotspot x="60%" y="35%" label={t("悬挂系统")} sub={t("Suspension")} />
          <Hotspot x="80%" y="60%" label={t("气动扩散器")} sub={t("Diffuser")} />
        </motion.div>

        {/* Floating Data Overlays */}
        <div className="absolute top-10 left-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-2xl border-white/10 w-64"
          >
            <div className="font-headline text-[10px] tracking-widest text-primary uppercase mb-4">{t('底盘完整度 | Chassis Integrity')}</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-headline text-3xl font-bold text-white">100</span>
              <span className="text-xs text-on-surface-variant mb-1">%</span>
            </div>
            <div className="flex gap-1 h-1">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={cn("flex-grow rounded-full", i < 18 ? "bg-tertiary" : "bg-white/10")} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl border-white/10 w-72"
          >
            <div className="font-headline text-[10px] tracking-widest text-secondary uppercase mb-4">{t('热力状态 | Thermal Status')}</div>
            <div className="space-y-3">
              <ThermalBar label={t('前电机 | Front Motor')} value={42} />
              <ThermalBar label={t('后电机 | Rear Motor')} value={58} />
              <ThermalBar label={t('电池组 | Battery Pack')} value={35} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className="glass-panel p-6 rounded-2xl border-white/10 group hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={cn("w-6 h-6", stat.color)} />
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            <div className="font-headline text-[10px] tracking-widest text-on-surface-variant uppercase mb-1">{t(stat.label)}</div>
            <div className="flex items-end gap-2">
              <span className="font-headline text-4xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-on-surface-variant mb-2 font-headline uppercase">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Hotspot({ x, y, label, sub }: { x: string, y: string, label: string, sub: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute group"
      style={{ left: x, top: y }}
    >
      <div className="relative">
        <div className="w-4 h-4 rounded-full bg-tertiary shadow-[0_0_15px_rgba(128,236,255,0.8)] animate-pulse" />
        <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 w-32">
          <div className="glass-panel p-3 rounded-xl border-white/10">
            <div className="font-headline text-xs font-bold text-white whitespace-nowrap">{label}</div>
            <div className="font-headline text-[8px] text-tertiary uppercase tracking-widest">{sub}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ThermalBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[8px] uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span>{value}°C</span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-tertiary to-secondary transition-all duration-1000" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
