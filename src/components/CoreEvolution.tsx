import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, RefreshCw, Headphones, Cog } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

gsap.registerPlugin(ScrollTrigger);

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

export default function CoreEvolution() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const splitDistance = isMobile ? 0 : 380; // Mobile doesn't split horizontally, or maybe just a little?
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Phase 1: Splitting (裂变阶段)
      if (isMobile) {
        tl.to(cardsRef.current, {
          y: (i) => (i - 1) * 150,
          scale: (i) => i === 1 ? 1 : 0.85,
          rotateZ: (i) => (i - 1) * 5, // Slight tilt
          duration: 1,
          ease: 'power2.inOut',
        });
      } else {
        tl.to(cardsRef.current, {
          x: (i) => (i - 1) * splitDistance,
          rotateZ: (i) => (i - 1) * 5, // Slight tilt during split
          scale: 1,
          duration: 1,
          ease: 'power2.inOut',
        });
      }

      // Phase 2: Flipping (翻转阶段)
      tl.to(cardsRef.current, {
        rotateY: 180,
        rotateZ: 0, // Reset tilt
        duration: 1.2,
        stagger: 0.1,
        ease: 'back.out(1.2)',
      }, '+=0.2');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-background py-32 flex flex-col items-center justify-center">
      {/* Title Header */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-10">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-white tracking-[0.4em] mb-4">
          CORE EVOLUTION
        </h2>
        <p className="text-primary font-headline tracking-[0.2em] text-xs uppercase opacity-60">
          AETHER DIGITAL TWIN ECOSYSTEM
        </p>
      </div>

      <div className="relative w-full max-w-7xl h-[500px] perspective-2000 flex items-center justify-center">
        {modules.map((module, idx) => (
          <div
            key={module.id}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="absolute w-[340px] h-[480px] preserve-3d cursor-pointer"
            style={{ zIndex: 10 - Math.abs(idx - 1) }}
          >
            {/* Card Inner Wrapper */}
            <div className="relative w-full h-full preserve-3d shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-[2.5rem]">
              
              {/* FRONT: Unified Cover Part */}
              <div className="absolute inset-0 backface-hidden rounded-[2.5rem] border border-white/10 bg-[#161b22] overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#c2e0ff_1px,_transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Core Icon in the middle card only or split? Let's put a subtle one in each */}
                <div className="absolute inset-0 flex items-center justify-center">
                   {idx === 1 ? (
                     <div className="relative flex flex-col items-center">
                       <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
                       <Cog className="w-24 h-24 text-primary animate-spin-slow mb-8 relative z-10" />
                       <div className="relative z-10 text-center">
                         <h3 className="font-headline text-3xl font-bold text-white tracking-[0.3em] mb-2">AETHER</h3>
                         <div className="px-6 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
                           <span className="text-[10px] text-primary font-headline tracking-widest uppercase">核心演化</span>
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div className="opacity-10 scale-150">
                        <Cog className={cn("w-48 h-48", idx === 0 ? "text-tertiary" : "text-secondary")} strokeWidth={0.5} />
                     </div>
                   )}
                </div>
                
                {/* Subtle ID Number */}
                <div className="absolute top-10 right-10 font-headline text-6xl font-black text-white/[0.03] select-none">
                  {module.id}
                </div>
                
                {/* Gradient Border Glow */}
                <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] group-hover:border-primary/40 transition-colors duration-500" />
              </div>

              {/* BACK: Detailed Content */}
              <div className="absolute inset-0 backface-hidden rounded-[2.5rem] border border-white/20 glass-panel rotate-y-180 flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                
                {/* Back Image / Effect */}
                <div className="absolute inset-0">
                  {module.id === '01' ? (
                    <div className="absolute inset-0 w-full h-full opacity-30 flex items-center justify-center">
                       <Cog className="absolute top-[-10%] left-[-10%] w-64 h-64 text-tertiary/20 animate-[spin_20s_linear_infinite]" />
                       <Cog className="absolute bottom-[-10%] right-[-10%] w-56 h-56 text-primary/20 animate-[spin_15s_linear_infinite_reverse]" />
                    </div>
                  ) : module.id === '02' ? (
                    <div className="absolute inset-0 w-full h-full opacity-40 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-black" />
                  ) : (
                    <img
                      src={module.image}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
                      alt={module.title}
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 mt-auto p-10">
                  <div className={cn("font-headline text-[10px] tracking-[0.3em] uppercase mb-3", module.color)}>
                    {t(`Module ${module.id}`)}
                  </div>
                  <h3 className="font-headline text-3xl font-bold mb-1 text-white">{t(module.title)}</h3>
                  <h4 className="font-headline text-xs tracking-widest text-primary/60 uppercase mb-6">{t(module.subtitle)}</h4>
                  <p className="text-xs text-on-surface-variant font-light mb-10 leading-relaxed max-w-[240px]">
                    {t(module.description)}
                  </p>
                  
                  <Link
                    to={module.path}
                    className={cn(
                      "inline-flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 font-headline text-[10px] tracking-widest uppercase transition-all duration-300 hover:bg-white/5",
                      module.color
                    )}
                  >
                    {t('进入模块 | ENTER')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Corner Gradient Glow */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll Down Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-primary/0 to-primary" />
        <span className="font-headline text-[9px] tracking-[0.3em] text-white uppercase">Scroll to Evolve</span>
      </div>
    </section>
  );
}
