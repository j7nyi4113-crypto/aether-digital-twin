import { motion } from 'motion/react';
import { Scale, Shield, Zap, Layers, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

const lightSpecs = [
  { label: '扭转刚度 | STIFFNESS', value: '43,500', unit: 'Nm/deg', icon: Layers, color: 'text-tertiary' },
  { label: '钢材强度 | STRENGTH', value: '2,200', unit: 'MPa', icon: Shield, color: 'text-secondary' },
  { label: '减重比例 | WEIGHT RED', value: '17', unit: '%', icon: Scale, color: 'text-primary' },
  { label: '零件集成 | INTEGRATION', value: '72', unit: 'to 1', icon: Zap, color: 'text-on-surface' },
];

export default function Lightweight() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen pt-24 pl-24 pr-12 pb-24 flex flex-col">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Body Structure Visualization */}
        <div className="lg:col-span-8 relative aspect-video flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full"
          >
            {/* Heatmap/Stress Visualization Style */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-secondary)_0%,_transparent_70%)]" />
            
            <img
              src="https://picsum.photos/seed/car-body-structure/1200/800?grayscale"
              className="w-full h-full object-contain opacity-60 mix-blend-screen"
              alt="Body Structure"
              referrerPolicy="no-referrer"
            />
            
            <StructureHotspot x="25%" y="55%" label={t("一体压铸前舱")} sub={t("Front Casting")} />
            <StructureHotspot x="75%" y="60%" label={t("一体压铸后地板")} sub={t("Rear Floor Casting")} />
            <StructureHotspot x="50%" y="35%" label={t("超高强度笼式车身")} sub={t("Cage Structure")} />
          </motion.div>

          {/* Stress Analysis HUD */}
          <div className="absolute bottom-10 left-10 space-y-4">
            <div className="glass-panel p-6 rounded-2xl border-white/10 w-72">
              <div className="font-headline text-[10px] tracking-widest text-secondary uppercase mb-4">{t('Stress Analysis')}</div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-grow h-2 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full" />
                <span className="text-[10px] text-on-surface-variant uppercase">{t('Safety Zone')}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                {t('一体压铸技术将72个零件合而为一，大幅提升车身刚度与碰撞安全性。')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Material Details */}
        <div className="lg:col-span-4 space-y-10">
          <div>
            <div className="font-headline text-[10px] tracking-[0.4em] text-secondary uppercase mb-4">Structural Integrity v2.0</div>
            <h2 className="font-headline text-5xl font-bold text-white mb-6 leading-tight">{t('轻量化')}</h2>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
              {t('通过一体压铸与多材料混合布局，在实现极致轻量化的同时，打造坚不可摧的“玄武车身”。')}
            </p>
          </div>

          <div className="space-y-6">
            <MaterialItem 
              title={t("2200MPa 超高强度钢")} 
              desc={t("应用于核心安全区域，提供坦克级的乘员舱保护。")}
              icon={Shield}
            />
            <MaterialItem 
              title={t("一体压铸技术")} 
              desc={t("减少840个焊点，重量减轻17%，扭转刚度提升至行业领先水平。")}
              icon={Layers}
            />
          </div>

          <div className="glass-panel p-8 rounded-3xl border-white/10">
            <div className="font-headline text-[10px] tracking-widest text-primary uppercase mb-6">{t('Material Composition')}</div>
            <div className="space-y-4">
              <CompositionBar label={t("Ultra-High Steel")} value={45} color="bg-secondary" />
              <CompositionBar label={t("Aluminum Alloy")} value={35} color="bg-primary" />
              <CompositionBar label={t("Carbon Fiber")} value={12} color="bg-tertiary" />
              <CompositionBar label={t("Other")} value={8} color="bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {lightSpecs.map((spec, idx) => (
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

function StructureHotspot({ x, y, label, sub }: { x: string, y: string, label: string, sub: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute group"
      style={{ left: x, top: y }}
    >
      <div className="relative">
        <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_15px_rgba(213,187,255,0.8)] animate-pulse" />
        <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 w-32">
          <div className="glass-panel p-3 rounded-xl border-white/10">
            <div className="font-headline text-xs font-bold text-white whitespace-nowrap">{label}</div>
            <div className="font-headline text-[8px] text-secondary uppercase tracking-widest">{sub}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CompositionBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[8px] uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, delay: 1 }}
          className={cn("h-full", color)} 
        />
      </div>
    </div>
  );
}

function MaterialItem({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  return (
    <div className="flex gap-5 items-center group cursor-pointer">
      <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-all">
        <Icon className="w-5 h-5 text-secondary" />
      </div>
      <div>
        <h4 className="font-headline text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-[10px] text-on-surface-variant leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
