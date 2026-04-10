import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { Gauge, Zap, Wind, Scale, ChevronRight, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import heroBg from '../assets/hero-bg.jpg';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const radarData = {
  labels: ['功率', '响应', '散热', '静谧性'],
  datasets: [
    {
      label: 'AETHER 灵境系列',
      data: [100, 100, 95, 90],
      backgroundColor: 'rgba(128, 236, 255, 0.2)',
      borderColor: 'rgba(128, 236, 255, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(128, 236, 255, 1)',
    },
    {
      label: '某德系豪华性能电跑',
      data: [85, 75, 80, 70],
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 1,
      borderDash: [5, 5],
      pointBackgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
  ],
};

const radarOptions = {
  scales: {
    r: {
      angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12, family: 'sans-serif' } },
      ticks: { display: false, max: 100, min: 0 }
    }
  },
  plugins: {
    legend: {
      labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'sans-serif' } }
    }
  }
};

const lineData = {
  labels: ['0', '2k', '4k', '6k', '8k', '10k', '12k', '14k', '16k', '18k', '20k', '21k'],
  datasets: [
    {
      label: 'AETHER 灵境系列',
      data: [0, 850, 850, 850, 850, 850, 850, 800, 720, 650, 580, 500],
      borderColor: 'rgba(128, 236, 255, 1)',
      backgroundColor: 'rgba(128, 236, 255, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
    },
    {
      label: '某美系顶级三电机版',
      data: [0, 900, 1020, 950, 800, 700, 600, 500, 420, 350, 300, 280],
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 2,
      borderDash: [5, 5],
      tension: 0.4,
      pointRadius: 0,
      fill: false,
    },
  ],
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 1100,
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)' },
      title: { display: true, text: '扭矩 (N·m)', color: 'rgba(255, 255, 255, 0.5)' }
    },
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)' },
      title: { display: true, text: '转速 (RPM)', color: 'rgba(255, 255, 255, 0.5)' }
    }
  },
  plugins: {
    legend: {
      labels: { color: 'rgba(255, 255, 255, 0.7)' }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
};

function AnimatedNumber({ value, suffix = '', duration = 2, decimals = 0 }: { value: number, suffix?: string, duration?: number, decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate: (v) => {
          if (ref.current) {
            ref.current.textContent = v.toFixed(decimals) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [value, duration, decimals, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  { label: '功率 | POWER', value: '580', unit: 'kW', icon: Zap, color: 'text-tertiary' },
  { label: '扭矩 | TORQUE', value: '1,200', unit: 'Nm', icon: Gauge, color: 'text-secondary' },
  { label: '风阻 | DRAG', value: '0.198', unit: 'Cd', icon: Wind, color: 'text-primary' },
  { label: '重量 | WEIGHT', value: '2,150', unit: 'kg', icon: Scale, color: 'text-on-surface' },
];

export default function Mechanical() {
  const { t } = useTranslation();
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [showTorqueModal, setShowTorqueModal] = useState(false);
  const [showDragModal, setShowDragModal] = useState(false);
  const [dragCompareValue, setDragCompareValue] = useState(50); // 0 = Traditional, 100 = AETHER
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showExplodedView, setShowExplodedView] = useState(false);

  const handleTouchMove = () => {
    if (showTorqueModal && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div 
      className="relative min-h-screen pt-24 px-6 md:pl-24 md:pr-12 pb-24 md:pb-12 flex flex-col"
      onTouchMove={handleTouchMove}
    >
      {/* Main Chassis Display Area */}
      <div className="flex-grow relative flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: showPowerModal ? 1.5 : showTorqueModal ? 1.6 : showDragModal ? 1.3 : showWeightModal ? 0.9 : 1,
            x: showPowerModal ? '-15%' : showTorqueModal ? '-20%' : showDragModal ? '5%' : showWeightModal ? '15%' : '0%',
            y: showPowerModal ? '10%' : showTorqueModal ? '5%' : showDragModal ? '-5%' : showWeightModal ? '5%' : '0%',
            filter: showDragModal ? 'brightness(1.5) contrast(1.2)' : 'none'
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="relative w-full max-w-6xl aspect-video"
        >
          {/* Main Car Image (Chassis) - Exploded view handling */}
          <motion.div
            animate={{ 
              y: showWeightModal ? -50 : 0,
              opacity: showWeightModal ? 0.8 : 0.9
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full h-full absolute inset-0"
          >
            <img
              src={heroBg}
              className={cn("w-full h-full object-contain mix-blend-screen transition-all duration-1000", showDragModal ? "hue-rotate-[180deg]" : "")}
              alt="Chassis"
            />
          </motion.div>

          {/* Exploded View Parts for Weight Modal */}
          <AnimatePresence>
            {showWeightModal && (
              <>
                {/* Battery Pack */}
                <motion.div 
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 80 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  className="absolute bottom-[20%] left-[25%] w-[50%] h-[10%] border-2 border-primary/50 bg-primary/10 rounded-xl flex items-center justify-center backdrop-blur-sm pointer-events-none"
                >
                  <span className="text-white font-headline text-sm tracking-widest drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">固态电池包 - 120kg</span>
                </motion.div>

                {/* Front Casting */}
                <motion.div 
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: -80 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
                  className="absolute top-[40%] left-[10%] w-[20%] h-[20%] border-2 border-secondary/50 bg-secondary/10 rounded-xl flex items-center justify-center backdrop-blur-sm pointer-events-none"
                >
                  <span className="text-white font-headline text-xs tracking-widest text-center drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">前舱<br/>一体压铸</span>
                </motion.div>

                {/* Rear Casting */}
                <motion.div 
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 80 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.9 }}
                  className="absolute top-[40%] right-[10%] w-[20%] h-[20%] border-2 border-tertiary/50 bg-tertiary/10 rounded-xl flex items-center justify-center backdrop-blur-sm pointer-events-none"
                >
                  <span className="text-white font-headline text-xs tracking-widest text-center drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">后地板<br/>一体压铸</span>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Center of Gravity (CG) Indicator */}
          <AnimatePresence>
            {showWeightModal && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-[55%] left-[45%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <div className="w-1/2 h-[2px] bg-black absolute" />
                    <div className="h-1/2 w-[2px] bg-black absolute" />
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-white tracking-widest bg-black/50 px-2 py-1 rounded">CG / 重心</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Highlighting Aero Parts for Drag Modal */}
          <AnimatePresence>
            {showDragModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                {/* Wind tunnel particle lines (simplified CSS simulation) */}
                <div className="absolute top-[20%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-[slide_3s_linear_infinite]" />
                <div className="absolute top-[30%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70 shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-[slide_2.5s_linear_infinite_0.5s]" />
                <div className="absolute top-[40%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-[slide_4s_linear_infinite_1s]" />
                <div className="absolute top-[60%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-[slide_2s_linear_infinite_0.2s]" />

                {/* Highlight specific aero parts */}
                {/* Roofline */}
                <div className="absolute top-[25%] left-[30%] w-[40%] h-[10%] border-t-2 border-primary/50 rounded-[100%] shadow-[0_-5px_15px_rgba(0,255,255,0.3)] animate-pulse" />
                {/* Diffuser */}
                <div className="absolute bottom-[35%] right-[20%] w-[15%] h-[5%] bg-primary/20 blur-md rounded-full animate-pulse" />
                {/* Virtual Mirrors */}
                <div className="absolute top-[40%] left-[35%] w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(0,255,255,1)] animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Highlighting Half-shaft & Wheel Motor for Torque Modal */}
          <AnimatePresence>
            {showTorqueModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                {/* Visual representation of energy flow to wheels */}
                <div className="absolute top-[45%] left-[20%] w-[10%] h-[2px] bg-secondary shadow-[0_0_15px_rgba(128,236,255,0.8)] animate-pulse rotate-12" />
                <div className="absolute top-[45%] right-[20%] w-[10%] h-[2px] bg-secondary shadow-[0_0_15px_rgba(128,236,255,0.8)] animate-pulse -rotate-12" />
                
                <div className="absolute top-[48%] left-[18%] w-12 h-12 rounded-full border-2 border-secondary shadow-[0_0_20px_rgba(128,236,255,0.5)] animate-[spin_2s_linear_infinite] border-t-transparent" />
                <div className="absolute top-[48%] right-[18%] w-12 h-12 rounded-full border-2 border-secondary shadow-[0_0_20px_rgba(128,236,255,0.5)] animate-[spin_2s_linear_infinite] border-t-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Interactive Hotspots */}
          <Hotspot x="30%" y="40%" label={t("动力总成")} sub={t("Power Unit")} />
          <Hotspot x="60%" y="35%" label={t("悬挂系统")} sub={t("Suspension")} />
          <Hotspot x="80%" y="60%" label={t("气动扩散器")} sub={t("Diffuser")} />
        </motion.div>

        {/* Floating Data Overlays */}
        <div className="w-full md:absolute md:top-10 md:left-10 space-y-4 md:space-y-8 relative mt-8 md:mt-0 z-10 flex flex-col items-center md:items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-2xl border-white/10 w-full max-w-sm md:w-64"
          >
            <div className="font-headline text-[10px] tracking-widest text-primary uppercase mb-4">{t('底盘完整度 | Chassis Integrity')}</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-headline text-3xl font-bold text-white">100</span>
              <span className="text-xs text-on-surface-variant mb-1">%</span>
            </div>
            <div className="flex gap-1 h-1">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="flex-grow rounded-full bg-primary" />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl border-white/10 w-full max-w-sm md:w-72"
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
            onClick={() => {
              if (stat.label === '功率 | POWER') {
                setShowPowerModal(true);
              } else if (stat.label === '扭矩 | TORQUE') {
                setShowTorqueModal(true);
              } else if (stat.label === '风阻 | DRAG') {
                setShowDragModal(true);
              } else if (stat.label === '重量 | WEIGHT') {
                setShowWeightModal(true);
              }
            }}
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

      {/* Power Detail Modal */}
      <AnimatePresence>
        {showPowerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-md"
            onClick={() => setShowPowerModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel p-8 md:p-12 rounded-3xl border-white/20 shadow-2xl custom-scrollbar text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowPowerModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-wide mb-2">瞬时爆发与永恒秩序</h2>
                <p className="text-tertiary uppercase tracking-widest text-sm font-headline mb-6">Instant Surge &amp; Eternal Order</p>
                <p className="text-on-surface-variant text-lg leading-relaxed border-l-2 border-tertiary pl-4">
                  在 AETHER 的世界里，功率不仅仅是内部电机的转速，它是对能量精准掌控的艺术。我们拒绝突兀的暴力加速，追求的是一种如激流般汹涌却如丝绸般顺滑的动力释放。
                </p>
              </div>

              <div className="space-y-10">
                {/* Section 1 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-tertiary">01 /</span> 核心动力参数：静谧的野兽
                  </h3>
                  <p className="text-on-surface-variant mb-4">AETHER 搭载的“以太驱动”双电机系统，系统综合最大功率达到 <span className="text-white font-bold"><AnimatedNumber value={580} duration={2} /> kW</span> (约 789 匹马力)。</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="glass-panel p-4 rounded-xl border-white/10">
                      <div className="text-xs text-on-surface-variant uppercase mb-1">峰值扭矩</div>
                      <div className="text-2xl font-bold text-secondary"><AnimatedNumber value={850} duration={2.2} /> <span className="text-sm font-normal text-on-surface-variant">N·m 瞬时爆发</span></div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border-white/10">
                      <div className="text-xs text-on-surface-variant uppercase mb-1">0-100km/h 加速</div>
                      <div className="text-2xl font-bold text-primary"><AnimatedNumber value={2.84} decimals={2} duration={2.5} /> <span className="text-sm font-normal text-on-surface-variant">秒（竞赛模式下）</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-tertiary font-bold mr-2">技术亮点：</span>
                    <span className="text-on-surface-variant">采用碳纤维转子包裹技术，即便在 21,000rpm 的极高转速下，依然能保持极低的电磁噪音与完美的动平衡。</span>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-tertiary">02 /</span> 行业基准对比：重新定义巅峰
                  </h3>
                  <p className="text-on-surface-variant mb-6">我们将 AETHER 与当前市场的顶尖性能标杆进行了深度对标。这不仅是数值的超越，更是效率的革新。</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-on-surface-variant text-sm">
                            <th className="py-3 px-4 font-normal">车型</th>
                            <th className="py-3 px-4 font-normal">最大功率 (kW)</th>
                            <th className="py-3 px-4 font-normal">功率密度 (kW/kg)</th>
                            <th className="py-3 px-4 font-normal">动力响应延迟 (ms)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 bg-white/5">
                            <td className="py-4 px-4 font-bold text-tertiary">AETHER 灵境系列</td>
                            <td className="py-4 px-4 font-bold text-white">580</td>
                            <td className="py-4 px-4 text-on-surface-variant"><span className="text-white font-bold">4.2</span> (行业领先)</td>
                            <td className="py-4 px-4 text-on-surface-variant"><span className="text-white font-bold">&lt; 10ms</span> (神经级响应)</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-4 px-4 text-on-surface-variant">某德系豪华性能电跑</td>
                            <td className="py-4 px-4 text-on-surface-variant">560</td>
                            <td className="py-4 px-4 text-on-surface-variant">3.8</td>
                            <td className="py-4 px-4 text-on-surface-variant">~30ms</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4 text-on-surface-variant">某美系三电机旗舰</td>
                            <td className="py-4 px-4 text-on-surface-variant">760</td>
                            <td className="py-4 px-4 text-on-surface-variant">3.9</td>
                            <td className="py-4 px-4 text-on-surface-variant">~25ms</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="w-full max-w-xs mx-auto aspect-square glass-panel p-4 rounded-2xl border-white/10">
                      <Radar data={radarData} options={radarOptions} />
                    </div>
                  </div>

                  <div className="bg-tertiary/10 p-4 rounded-xl border border-tertiary/20">
                    <span className="text-tertiary font-bold mr-2">深度解析：</span>
                    <span className="text-on-surface-variant leading-relaxed">虽然某些三电机车型在绝对功率数值上占优，但 AETHER 通过全固态电池的高倍率放电性能以及更轻量化的三合一电驱系统，实现了更高的推重比。这意味着在实际驾驶中，AETHER 的动态灵活性与出弯后的再加速能力更具侵略性。</span>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-tertiary">03 /</span> 性能背后的克制
                  </h3>
                  <p className="text-on-surface-variant mb-6">高功率不应以牺牲舒适为代价。AETHER 的动力系统集成了“主动频率对冲”技术：</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-panel p-5 rounded-xl border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                      <h4 className="font-bold text-white mb-2">电磁消音</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">系统自动检测电机高频啸叫，通过音响系统实时释放反向声波。</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                      <h4 className="font-bold text-white mb-2">热管理逻辑</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">即使连续 10 次全力加速，自研的“冰点循环”冷却系统也能确保电机功率输出不产生任何热衰减，让巅峰状态始终在线。</p>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Torque Detail Modal */}
      <AnimatePresence>
        {showTorqueModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-md"
            onClick={() => setShowTorqueModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel p-8 md:p-12 rounded-3xl border-white/20 shadow-2xl custom-scrollbar text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowTorqueModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-wide mb-2">扭矩的意志：瞬时觉醒的物理法则</h2>
                <p className="text-secondary uppercase tracking-widest text-sm font-headline mb-6">The Will of Torque</p>
                <p className="text-on-surface-variant text-lg leading-relaxed border-l-2 border-secondary pl-4">
                  引言：如果说功率决定了速度的上限，那么扭矩则决定了灵魂的爆发力。AETHER 并不追求毫无意义的空转，我们要实现的是：在你的指尖触碰加速键的百万分之一秒内，将大地的摩擦力转化为背部的推力。
                </p>
              </div>

              <div className="space-y-10">
                {/* Section 1 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-secondary">01 /</span> 核心技术：矢量扭矩分配 (Vectoring Mastery)
                  </h3>
                  <p className="text-on-surface-variant mb-4">AETHER 的动力核心能输出高达 <span className="text-white font-bold"><AnimatedNumber value={850} duration={2} /> N·m</span> 的综合扭矩。但这并非蛮力，而是通过自研的 <span className="text-secondary font-bold">Aether-Flow 智控算法</span> 进行毫秒级的管理。</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="glass-panel p-5 rounded-xl border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                      <h4 className="font-bold text-white mb-2">瞬时响应</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">扭矩建立时间仅为 <span className="text-white font-bold">8ms</span>，比人类痛觉神经的传导速度快 10 倍。</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                      <h4 className="font-bold text-white mb-2">全域覆盖</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">凭借碳纤维包裹电机，AETHER 能在 <span className="text-white font-bold">0-12,000 rpm</span> 的极广区间内维持 90% 以上的峰值扭矩输出，彻底告别传统电驱在中后段的疲软感。</p>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-secondary">02 /</span> 巅峰对标：谁才是真正的路面主宰？
                  </h3>
                  <p className="text-on-surface-variant mb-6">我们将扭矩的控制精度与输出效率作为衡量标准，与行业标杆进行了一场无声的较量。</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-on-surface-variant text-sm">
                            <th className="py-3 px-4 font-normal">评价维度</th>
                            <th className="py-3 px-4 font-normal text-secondary">AETHER 灵境系列</th>
                            <th className="py-3 px-4 font-normal">某意系超级电跑</th>
                            <th className="py-3 px-4 font-normal">某美系顶级三电机版</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 bg-white/5">
                            <td className="py-4 px-4 text-on-surface-variant">峰值扭矩 (N·m)</td>
                            <td className="py-4 px-4 font-bold text-white">850</td>
                            <td className="py-4 px-4 text-on-surface-variant">710</td>
                            <td className="py-4 px-4 text-on-surface-variant">1020</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-4 px-4 text-on-surface-variant">响应延迟 (ms)</td>
                            <td className="py-4 px-4 font-bold text-white">8</td>
                            <td className="py-4 px-4 text-on-surface-variant">25</td>
                            <td className="py-4 px-4 text-on-surface-variant">20</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-white/5">
                            <td className="py-4 px-4 text-on-surface-variant">单轮扭矩调整频率</td>
                            <td className="py-4 px-4 font-bold text-white">20,000 次/秒</td>
                            <td className="py-4 px-4 text-on-surface-variant">8,000 次/秒</td>
                            <td className="py-4 px-4 text-on-surface-variant">12,000 次/秒</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4 text-on-surface-variant">轮端滑移率控制</td>
                            <td className="py-4 px-4 font-bold text-white">±1% (极致精准)</td>
                            <td className="py-4 px-4 text-on-surface-variant">±3%</td>
                            <td className="py-4 px-4 text-on-surface-variant">±5%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="w-full h-64 glass-panel p-4 rounded-2xl border-white/10">
                      <Line data={lineData} options={lineOptions} />
                    </div>
                  </div>

                  <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                    <span className="text-secondary font-bold mr-2">深度解析：</span>
                    <span className="text-on-surface-variant leading-relaxed">尽管对手可能拥有更高的绝对扭矩数值，但 AETHER 的优势在于<strong className="text-white">“有效扭矩率”</strong>。在大扭矩输出时，多数车辆会因为轮胎打滑导致能量损耗，而 AETHER 凭借每秒 2 万次的轮端调整频率，确保每一牛·米的力都能精准地转化为向前的动能，而非轮胎的焦糊味。</span>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-secondary">03 /</span> 场景化体验：力与美的克制
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-panel p-5 rounded-xl border-white/10 group hover:border-secondary/50 transition-colors">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-secondary" /> 弹射模式
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">扭矩呈阶梯式爆发，模拟如同喷气式飞机起飞般的线性压迫感。</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border-white/10 group hover:border-primary/50 transition-colors">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <Wind className="w-4 h-4 text-primary" /> 湿滑/雪地
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">扭矩以极高频率微调输出，确保即便在冰面上，车辆也能像吸附在路面上一样稳健前行。</p>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag Detail Modal */}
      <AnimatePresence>
        {showDragModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-md"
            onClick={() => setShowDragModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel p-8 md:p-12 rounded-3xl border-white/20 shadow-2xl custom-scrollbar text-white overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Canvas Background Simulation */}
              <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden mix-blend-screen z-0">
                <div className="absolute top-[20%] left-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[slide_2s_linear_infinite]" />
                <div className="absolute top-[40%] left-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[slide_3s_linear_infinite_0.5s]" />
                <div className="absolute top-[60%] left-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[slide_2.5s_linear_infinite_1s]" />
                <div className="absolute top-[80%] left-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[slide_4s_linear_infinite_0.2s]" />
              </div>

              <button 
                onClick={() => setShowDragModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-wide mb-2">风的雕琢：0.198 Cd 的流体哲学</h2>
                <p className="text-primary uppercase tracking-widest text-sm font-headline mb-6">Sculpted by Air</p>
                <p className="text-on-surface-variant text-lg leading-relaxed border-l-2 border-primary pl-4">
                  引言：在高速移动中，空气曾是阻力，但在 AETHER 这里，空气成为了我们的雕刻刀。0.198 Cd 的风阻系数，不仅仅是为了追求极致的续航，更是为了实现那种“划破寂静而不留痕迹”的优雅。
                </p>
              </div>

              <div className="space-y-10 relative z-10">
                {/* Section 1 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-primary">01 /</span> 核心数据：挑战物理极限的轮廓
                  </h3>
                  <p className="text-on-surface-variant mb-4">AETHER 灵境系列的量产风阻系数锁定在 <span className="text-white font-bold">0.198 Cd</span>，这一数字代表了量产轿车领域的第一梯队。</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="glass-panel p-5 rounded-xl border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                      <h4 className="font-bold text-white mb-2">形态即功能</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">采用“水滴形”仿生座舱设计，配合全封闭式平整底盘，让气流在进入车底后能以最快的速度排空。</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-tertiary"></div>
                      <h4 className="font-bold text-white mb-2">主动进化</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">搭载 Aero-Active 气动套件，包括主动式进气格栅与感应式尾部扩散器，随车速自动调节角度，平衡下压力与风阻。</p>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-primary">02 /</span> 行业标杆对比：与风共舞的胜负
                  </h3>
                  <p className="text-on-surface-variant mb-6">风阻系数每降低 0.01 Cd，纯电续航约可提升 10km。AETHER 在节能与美感之间找到了黄金分割点。</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-on-surface-variant text-sm">
                            <th className="py-3 px-4 font-normal">车型</th>
                            <th className="py-3 px-4 font-normal">风阻系数 (Cd)</th>
                            <th className="py-3 px-4 font-normal">气动核心技术</th>
                            <th className="py-3 px-4 font-normal">造型流派</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 bg-white/5">
                            <td className="py-4 px-4 font-bold text-primary">AETHER 灵境系列</td>
                            <td className="py-4 px-4 font-bold text-white">0.198</td>
                            <td className="py-4 px-4 text-on-surface-variant">主动扩散器 + 虚拟外后视镜</td>
                            <td className="py-4 px-4 text-on-surface-variant text-primary">仿生流体 (Bio-Flow)</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-4 px-4 text-on-surface-variant">某德系标杆电轿</td>
                            <td className="py-4 px-4 text-white">0.202</td>
                            <td className="py-4 px-4 text-on-surface-variant">轮毂导流片</td>
                            <td className="py-4 px-4 text-on-surface-variant">现代极简</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-4 px-4 text-on-surface-variant">某美系纯电轿车</td>
                            <td className="py-4 px-4 text-white">0.208</td>
                            <td className="py-4 px-4 text-on-surface-variant">隐藏式门把手</td>
                            <td className="py-4 px-4 text-on-surface-variant">运动俯冲</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4 text-on-surface-variant">传统豪华燃油车</td>
                            <td className="py-4 px-4 text-white/50">0.26 - 0.30</td>
                            <td className="py-4 px-4 text-on-surface-variant">固定格栅</td>
                            <td className="py-4 px-4 text-on-surface-variant">机械力量</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Interactive Slider Simulation */}
                    <div className="w-full glass-panel p-6 rounded-2xl border-white/10 relative">
                      <div className="text-xs text-on-surface-variant uppercase tracking-widest mb-4 flex justify-between">
                        <span>传统造型</span>
                        <span className="text-primary font-bold">AETHER 仿生</span>
                      </div>
                      
                      {/* Visual Area */}
                      <div className="h-32 bg-black/50 rounded-xl overflow-hidden relative mb-6 border border-white/5">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Wind className={cn("w-12 h-12 transition-all duration-500", dragCompareValue > 50 ? "text-primary" : "text-white/20")} />
                        </div>
                        
                        {/* Particles representing air resistance */}
                        {Array.from({ length: 20 }).map((_, i) => {
                          const isSmooth = dragCompareValue > 50;
                          return (
                            <motion.div
                              key={i}
                              className="absolute h-[1px] bg-primary shadow-[0_0_5px_rgba(0,255,255,0.8)]"
                              initial={{ left: '-10%', top: `${Math.random() * 100}%`, width: isSmooth ? '20%' : '5%', opacity: isSmooth ? 0.6 : 1 }}
                              animate={{ 
                                left: '110%',
                                top: isSmooth ? `${Math.random() * 100}%` : `${(Math.random() * 100) + (Math.random() > 0.5 ? 10 : -10)}%`,
                              }}
                              transition={{ 
                                duration: isSmooth ? 1 + Math.random() : 2 + Math.random() * 2, 
                                repeat: Infinity, 
                                ease: "linear",
                                delay: Math.random() * 2
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Slider Control */}
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={dragCompareValue} 
                        onChange={(e) => setDragCompareValue(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant">
                        <span>Cd 0.28</span>
                        <span className={cn("transition-colors", dragCompareValue > 50 ? "text-primary" : "")}>Cd 0.198</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                    <span className="text-primary font-bold mr-2">深度解析：</span>
                    <span className="text-on-surface-variant leading-relaxed">虽然目前市场上已出现接近 0.20 的车型，但 AETHER 的突破在于：我们没有为了风阻而牺牲内部空间。通过对 A 柱倾角与 C 柱下滑曲线的百万次模拟（CFD），我们在保证后排乘客头部空间的同时，实现了超越竞品的导流效率。</span>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-primary">03 /</span> 听觉的副产品：静谧之源
                  </h3>
                  <p className="text-on-surface-variant mb-6">低风阻带来的最直观感受不是续航，而是风噪的消失。</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-panel p-5 rounded-xl border-white/10 group hover:border-primary/50 transition-colors">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        湍流控制
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">AETHER 成功消除了外后视镜位置的低频脉动，即使在 120km/h 的高速巡航下，风噪也仅为 <span className="text-white font-bold">58 分贝</span>。</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border-white/10 group hover:border-tertiary/50 transition-colors">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        无感穿越
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">这种极致的顺滑感，让驾驶者仿佛不是在推动空气前进，而是在空气中自由穿行。</p>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Weight Detail Modal */}
      <AnimatePresence>
        {showWeightModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-start p-4 sm:p-6 md:p-12 bg-black/40 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel p-8 md:p-12 rounded-3xl border-white/20 shadow-2xl custom-scrollbar text-white pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              onScroll={(e) => {
                // Simulate chassis slight shake on scroll
                const target = e.target as HTMLElement;
                const scrollPercentage = target.scrollTop / (target.scrollHeight - target.clientHeight);
                const bg = document.querySelector('.aspect-video > div:first-child') as HTMLElement;
                if (bg) {
                  bg.style.transform = `rotate(${Math.sin(scrollPercentage * Math.PI * 4) * 2}deg)`;
                }
              }}
            >
              <button 
                onClick={() => {
                  setShowWeightModal(false);
                  setShowExplodedView(false);
                }}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-wide mb-2">质量的平衡：轻量化与低重心的重构</h2>
                <p className="text-on-surface uppercase tracking-widest text-sm font-headline mb-6">Art of Mass</p>
                <p className="text-on-surface-variant text-lg leading-relaxed border-l-2 border-on-surface pl-4">
                  引言：在 AETHER 的哲学里，每一克重量都必须有其存在的意义。我们不单纯追求纸面上的“轻”，我们追求的是让这 2000 多公斤的物质，在弯道中消失于无形。
                </p>
              </div>

              <div className="space-y-10">
                {/* Section 1 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-3"><span className="text-on-surface">01 /</span> 核心技术：一体化压铸与材料革命</span>
                  </h3>
                  <p className="text-on-surface-variant mb-4">AETHER 灵境系列的整备质量控制在 <span className="text-white font-bold">2,150 kg</span>（长续航版）。</p>
                  
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="glass-panel p-5 rounded-xl border-white/10">
                      <h4 className="font-bold text-white mb-2">一体化底盘</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">采用行业领先的 8,000 吨级一体化压铸技术，将后底盘 70 多个零件整合为一，不仅减重 <span className="text-white font-bold">25%</span>，更极大提升了车身刚性。</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border-white/10">
                      <h4 className="font-bold text-white mb-2">固态电池优势</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">相比传统液态锂电池，AETHER 搭载的固态电池包能量密度提升 30%，在同等续航下，电池包减重近 <span className="text-white font-bold">120 kg</span>。</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border-white/10">
                      <h4 className="font-bold text-white mb-2">黄金配重比</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed"><span className="text-white font-bold">50:50</span> 的前后轴荷分布，配合低于 <span className="text-white font-bold">450mm</span> 的质心高度，让车身在高速过弯时拥有极佳的抗侧倾能力。</p>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-on-surface">02 /</span> 行业横向对比：效率与操控的博弈
                  </h3>
                  <p className="text-on-surface-variant mb-6">在同级别豪华纯电轿跑中，AETHER 证明了“大空间”与“轻量化”可以并存。</p>
                  
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-on-surface-variant text-sm">
                          <th className="py-3 px-4 font-normal">评价维度</th>
                          <th className="py-3 px-4 font-normal text-white">AETHER 灵境系列</th>
                          <th className="py-3 px-4 font-normal">某德系豪华电轿</th>
                          <th className="py-3 px-4 font-normal">某美系三电机旗舰</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5 bg-white/5">
                          <td className="py-4 px-4 text-on-surface-variant">整备质量 (kg)</td>
                          <td className="py-4 px-4 font-bold text-white">2,150</td>
                          <td className="py-4 px-4 text-on-surface-variant">2,340</td>
                          <td className="py-4 px-4 text-on-surface-variant">2,250</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-4 px-4 text-on-surface-variant">车身刚性 (N·m/deg)</td>
                          <td className="py-4 px-4 font-bold text-white">42,000 (极高)</td>
                          <td className="py-4 px-4 text-on-surface-variant">38,000</td>
                          <td className="py-4 px-4 text-on-surface-variant">40,000</td>
                        </tr>
                        <tr className="border-b border-white/5 bg-white/5">
                          <td className="py-4 px-4 text-on-surface-variant">推重比 (hp/ton)</td>
                          <td className="py-4 px-4 font-bold text-white">367</td>
                          <td className="py-4 px-4 text-on-surface-variant">243</td>
                          <td className="py-4 px-4 text-on-surface-variant text-secondary">453 (暴力倾向)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Weight Sensation Lines */}
                  <div className="glass-panel p-6 rounded-2xl border-white/10 mb-6">
                    <div className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">轻量化系数视觉感知</div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-white font-bold">AETHER (1.8 轻盈级)</span>
                        </div>
                        <div className="h-[2px] w-[60%] bg-gradient-to-r from-transparent via-white to-transparent" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-on-surface-variant">某美系旗舰 (2.0)</span>
                        </div>
                        <div className="h-[4px] w-[75%] bg-white/40 rounded-full" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-on-surface-variant">某德系豪华 (2.1)</span>
                        </div>
                        <div className="h-[8px] w-[90%] bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                    <span className="text-white font-bold mr-2">深度解析：</span>
                    <span className="text-on-surface-variant leading-relaxed">对比竞品，AETHER 在整备质量上拥有显著优势。这意味着在制动时，刹车系统需要克服的惯性更小，制动距离更短；在加速时，单位功率带动的重量更轻。更关键的是，得益于底盘零件的高度集成，AETHER 的簧下质量极低，配合主动悬挂，能以更快的响应处理路面颠簸。</span>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-on-surface">03 /</span> 消失的质量感
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-panel p-5 rounded-xl border-white/10">
                      <h4 className="font-bold text-white mb-2">灵境感知</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">这种轻量化设计在驾驶时表现为一种“无感”。通过四轮矢量扭矩对质量惯性的补偿，驾驶者会感觉像在驾驶一辆轴距更短、更轻盈的紧凑型跑车。</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border-white/10">
                      <h4 className="font-bold text-white mb-2">续航利好</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">每一百公里的能耗因轻量化技术降低了约 <span className="text-white font-bold">5%</span>，这是对可持续科技的最高致敬。</p>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

function IntegrityBar() {
  return (
    <div className="flex gap-1 h-1">
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "flex-grow rounded-full",
            i < 20 ? "bg-primary" : "bg-white/10"
          )} 
        />
      ))}
    </div>
  );
}
