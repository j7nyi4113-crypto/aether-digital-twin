import { motion } from 'motion/react';
import { Wind, Gauge, Layers, MoveDown, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

const aeroSpecs = [
  { label: '风阻系数 | DRAG COEFF', value: '0.195', unit: 'Cd', icon: Wind, color: 'text-tertiary' },
  { label: '下压力 | DOWNFORCE', value: '280', unit: 'kg', icon: MoveDown, color: 'text-secondary' },
  { label: '主动格栅 | ACTIVE GRILLE', value: '4', unit: 'Stages', icon: Layers, color: 'text-primary' },
  { label: '气动效率 | EFFICIENCY', value: '94', unit: '%', icon: Gauge, color: 'text-on-surface' },
];

export default function AeroKit() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen pt-24 px-6 md:pl-24 md:pr-12 pb-24 flex flex-col">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12 lg:mt-0">
        {/* Left Side: Aero Visualization */}
        <div className="lg:col-span-7 relative aspect-square flex items-center justify-center overflow-hidden max-w-lg mx-auto w-full lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Wind Tunnel Simulation Effect */}
            <div className="absolute inset-0 z-0 opacity-30">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [-100, 1200],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "linear"
                  }}
                  className="absolute h-px bg-gradient-to-r from-transparent via-tertiary to-transparent"
                  style={{ 
                    top: `${10 + i * 6}%`, 
                    width: '300px',
                    left: '-10%'
                  }}
                />
              ))}
            </div>

            <img
              src="https://picsum.photos/seed/car-aerodynamics/1000/1000?grayscale"
              className="relative z-10 w-4/5 h-4/5 object-contain opacity-70 mix-blend-screen"
              alt="Aerodynamics Visualization"
              referrerPolicy="no-referrer"
            />
            
            <AeroHotspot x="20%" y="45%" label={t("主动进气格栅")} sub={t("Active Grille")} />
            <AeroHotspot x="50%" y="25%" label={t("气动车顶")} sub={t("Aero Roof")} />
            <AeroHotspot x="85%" y="65%" label={t("可变扩散器")} sub={t("Active Diffuser")} />
          </motion.div>
        </div>

        {/* Right Side: Aero Details */}
        <div className="lg:col-span-5 space-y-12">
          <div>
            <div className="font-headline text-[10px] tracking-[0.4em] text-tertiary uppercase mb-4">Fluid Dynamics v4.1</div>
            <h2 className="font-headline text-5xl font-bold text-white mb-6 leading-tight">{t('气动套件')}</h2>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
              {t('每一处曲线都经过数千小时的CFD模拟，实现 0.195Cd 的超低风阻，让空气成为前进的助力。')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AeroFeature 
              title={t("主动气动系统")} 
              desc={t("根据车速实时调整格栅开合与尾翼角度，平衡风阻与下压力。")}
              icon={Layers}
            />
            <AeroFeature 
              title={t("气帘导流技术")} 
              desc={t("优化轮毂区域气流，减少侧向涡流，提升高速行驶稳定性。")}
              icon={Wind}
            />
          </div>

          <div className="glass-panel p-8 rounded-3xl border-white/10">
            <div className="font-headline text-[10px] tracking-widest text-secondary uppercase mb-6">{t('Drag Distribution')}</div>
            <div className="space-y-6">
              <DragMetric label={t("Frontal Area")} value={35} />
              <DragMetric label={t("Wheel Wells")} value={22} />
              <DragMetric label={t("Underbody")} value={18} />
              <DragMetric label={t("Rear Wake")} value={25} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {aeroSpecs.map((spec, idx) => (
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

function AeroHotspot({ x, y, label, sub }: { x: string, y: string, label: string, sub: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute group z-20"
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

function DragMetric({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[8px] uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="h-full bg-gradient-to-r from-tertiary to-primary" 
        />
      </div>
    </div>
  );
}

function AeroFeature({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="p-4 rounded-2xl bg-tertiary/10 border border-tertiary/20">
        <Icon className="w-6 h-6 text-tertiary" />
      </div>
      <div>
        <h4 className="font-headline text-lg font-bold text-white mb-2">{title}</h4>
        <p className="text-sm text-on-surface-variant font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
