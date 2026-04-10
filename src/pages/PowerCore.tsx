import { motion } from 'motion/react';
import { Zap, Battery, Cpu, Activity, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

const coreSpecs = [
  { label: '最高转速 | MAX RPM', value: '27,200', unit: 'rpm', icon: Cpu, color: 'text-tertiary' },
  { label: '最大马力 | MAX POWER', value: '1,548', unit: 'PS', icon: Zap, color: 'text-secondary' },
  { label: '系统电压 | VOLTAGE', value: '900', unit: 'V', icon: Activity, color: 'text-primary' },
  { label: '补能效率 | CHARGING', value: '11', unit: 'min', icon: Battery, color: 'text-on-surface' },
];

export default function PowerCore() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen pt-24 px-6 md:pl-24 md:pr-12 pb-24 flex flex-col">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12 lg:mt-0">
        {/* Left Side: Technical Visualization */}
        <div className="lg:col-span-8 relative aspect-video flex flex-col items-center justify-center overflow-hidden max-w-2xl mx-auto w-full lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full shrink-0 md:shrink"
          >
            <img
              src="https://picsum.photos/seed/electric-motor-core/1200/800?grayscale"
              className="w-full h-full object-contain opacity-50 mix-blend-screen"
              alt="Electric Motor Core"
              referrerPolicy="no-referrer"
            />
            
            {/* Exploded View Hotspots */}
            <Hotspot x="45%" y="40%" label={t("定子组件")} sub={t("Stator Assembly")} />
            <Hotspot x="55%" y="50%" label={t("转子核心")} sub={t("Rotor Core")} />
            <Hotspot x="30%" y="60%" label={t("SiC 逆变器")} sub={t("SiC Inverter")} />
          </motion.div>

          {/* Floating HUD Elements */}
          <div className="relative md:absolute md:top-0 md:right-0 mt-8 md:mt-0 space-y-6 w-full md:w-auto flex justify-center md:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 rounded-2xl border-white/10 w-full max-w-sm md:w-64"
            >
              <div className="font-headline text-[10px] tracking-widest text-tertiary uppercase mb-4">{t('Energy Flow')}</div>
              <div className="space-y-4">
                <FlowBar label={t("Motor Efficiency")} value={98.2} color="bg-tertiary" />
                <FlowBar label={t("Battery Health")} value={100} color="bg-primary" />
                <FlowBar label={t("Thermal Load")} value={45} color="bg-secondary" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Detailed Specs */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <div className="font-headline text-[10px] tracking-[0.4em] text-primary uppercase mb-4">Aether Drive v3.0</div>
            <h2 className="font-headline text-5xl font-bold text-white mb-6 leading-tight">{t('动力核心')}</h2>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
              {t('搭载全球领先的高转速电机与900V高压架构，重新定义电动时代的极致性能。')}
            </p>
          </div>

          <div className="space-y-4">
            <TechCard 
              title={t("CTB 电池包")} 
              desc={t("侧置电芯倒置技术，14层超强防护结构，10-80%充电仅需11分钟。")} 
              icon={Battery}
            />
            <TechCard 
              title={t("SiC 碳化硅")} 
              desc={t("第三代半导体逆变器，大幅降低开关损耗，提升系统综合效率至98%以上。")} 
              icon={Cpu}
            />
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {coreSpecs.map((spec, idx) => (
          <motion.div
            key={spec.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className="glass-panel p-6 rounded-2xl border-white/10 group hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <spec.icon className={cn("w-6 h-6", spec.color)} />
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            <div className="font-headline text-[10px] tracking-widest text-on-surface-variant uppercase mb-1">{t(spec.label)}</div>
            <div className="flex items-end gap-2">
              <span className="font-headline text-4xl font-bold text-white">{spec.value}</span>
              <span className="text-xs text-on-surface-variant mb-2 font-headline uppercase">{spec.unit}</span>
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
        <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(194,224,255,0.8)] animate-pulse" />
        <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 w-32">
          <div className="glass-panel p-3 rounded-xl border-white/10">
            <div className="font-headline text-xs font-bold text-white whitespace-nowrap">{label}</div>
            <div className="font-headline text-[8px] text-primary uppercase tracking-widest">{sub}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FlowBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[8px] uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className={cn("h-full transition-all duration-1000", color)} 
        />
      </div>
    </div>
  );
}

function TechCard({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  return (
    <div className="glass-panel p-5 rounded-xl border-white/5 flex gap-4 hover:bg-white/5 transition-all">
      <div className="p-3 rounded-lg bg-primary/10 h-fit">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-headline text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-[10px] text-on-surface-variant leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
