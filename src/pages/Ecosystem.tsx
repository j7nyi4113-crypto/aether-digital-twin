import { motion } from 'motion/react';
import { Smartphone, Watch, Home, Car, Share2, Zap, ShieldCheck, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

const devices = [
  { name: '智能手机', label: 'Smartphone', icon: Smartphone, status: 'Connected', color: 'text-primary' },
  { name: '智能手表', label: 'Smartwatch', icon: Watch, status: 'Active', color: 'text-secondary' },
  { name: '智能家居', label: 'Smart Home', icon: Home, status: 'Standby', color: 'text-tertiary' },
];

export default function Ecosystem() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen pt-24 pl-24 pr-12 pb-24 flex flex-col">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Visual Representation */}
        <div className="relative aspect-square flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Pulsing Rings */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-full h-full rounded-full border border-primary/20"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute w-3/4 h-3/4 rounded-full border border-secondary/20"
            />
          </div>
          
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="relative w-1/2 h-1/2"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel p-4 rounded-2xl border-white/10">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 glass-panel p-4 rounded-2xl border-white/10">
              <Watch className="w-8 h-8 text-secondary" />
            </div>
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel p-4 rounded-2xl border-white/10">
              <Home className="w-8 h-8 text-tertiary" />
            </div>
          </motion.div>

          <div className="z-10 bg-gradient-to-br from-primary to-secondary p-8 rounded-full shadow-[0_0_60px_rgba(194,224,255,0.4)]">
            <Car className="w-16 h-16 text-background" />
          </div>
        </div>

        {/* Right: Info & Controls */}
        <div className="space-y-12">
          <div>
            <div className="font-headline text-[10px] tracking-[0.4em] text-primary uppercase mb-4">Aether Connect v4.2</div>
            <h2 className="font-headline text-5xl font-bold text-white mb-6 leading-tight">{t('无缝生态联动')}</h2>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
              {t('打破硬件边界，实现车辆与个人数字生态的深度融合。从远程控车到健康监测同步，一切尽在掌握。')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {devices.map((device) => (
              <div key={device.name} className="glass-panel p-6 rounded-2xl border-white/10">
                <device.icon className={cn("w-6 h-6 mb-4", device.color)} />
                <div className="font-headline text-sm font-bold text-white mb-1">{t(device.name)}</div>
                <div className="font-headline text-[8px] text-on-surface-variant uppercase tracking-widest mb-4">{t(device.label)}</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                  <span className="text-[10px] text-tertiary uppercase font-bold">{t(device.status)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            <FeatureItem icon={ShieldCheck} label={t("安全加密")} />
            <FeatureItem icon={Zap} label={t("极速响应")} />
            <FeatureItem icon={Globe} label={t("全球漫游")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
        <Icon className="w-5 h-5 text-primary/60" />
      </div>
      <span className="font-headline text-[10px] tracking-widest text-on-surface-variant uppercase">{label}</span>
    </div>
  );
}
