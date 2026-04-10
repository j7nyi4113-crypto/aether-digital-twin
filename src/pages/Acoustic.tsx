import { motion } from 'motion/react';
import { Headphones, AudioLines, Mic2, Speaker, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const soundProfiles = [
  { 
    name: '灵境原声', 
    label: 'AETHER Pristine', 
    intention: '让物理空间消失。',
    philosophy: '追求极致的纯净与空间还原。模拟自然界中没有回响干扰的开阔环境，利用 7.1.4 物理声道抵消座舱内的金属与玻璃反射。',
    copy: '剥离物理噪音，回归声波本源。在这里，听见呼吸，听见星空。',
    audioSrc: '/audio/aether-pure.mp3',
    theme: 'pristine'
  },
  { 
    name: '机械咆哮', 
    label: 'Mechanical Roar', 
    intention: '重燃内燃机的灵魂。',
    philosophy: '针对高性能驾驶开发。采集 AETHER 原型机震动数据，通过车内音响补偿由于电动化流失的“机械生命力”，声音随踏板深度动态模拟气缸开合的颗粒感。',
    copy: '电流与机械的共振。每一分扭矩释放，都是一次澎湃的灵魂唤醒。',
    audioSrc: '/audio/mechanical-roar.mp3',
    theme: 'roar'
  },
  { 
    name: '未来脉冲', 
    label: 'Future Pulse', 
    intention: '定义下个世纪的行进感。',
    philosophy: '完全数字化的合成声学。将车辆的行驶风阻、重力感应（G值）转化为低频脉冲和高频电子音，营造一种在数字空间穿梭的轻盈感。',
    copy: '超越物质极限的数字节奏。穿梭于时空褶皱，感受流动的未来。',
    audioSrc: '/audio/future-pulse.mp3',
    theme: 'pulse'
  },
];

export default function Acoustic() {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProfile, setActiveProfile] = useState(soundProfiles[0]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
    }
  }, []);

  const handleProfileClick = (profile: typeof soundProfiles[0]) => {
    if (activeProfile.name === profile.name) {
      setIsPlaying(!isPlaying);
    } else {
      if (audioRef.current && isPlaying) {
        // Fade out current audio before switching
        const fadeOut = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.volume = 0; // Set to 0 before load to prepare for fade in
            }
            setActiveProfile(profile);
            // setIsPlaying(true) is already true, so we don't need to toggle it, but the activeProfile effect will handle the fade in.
          }
        }, 50);
      } else {
        setActiveProfile(profile);
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        // Fade in when playing starts (either from pause or new profile)
        if (audioRef.current.volume < 0.75) {
            const fadeIn = setInterval(() => {
              if (audioRef.current && audioRef.current.volume < 0.70) {
                audioRef.current.volume += 0.05;
              } else {
                clearInterval(fadeIn);
                if (audioRef.current) {
                    audioRef.current.volume = 0.75;
                }
              }
            }, 50);
        }
      } else {
         // Fade out when pausing
         const fadeOut = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
            if (audioRef.current) {
              audioRef.current.pause();
              // Don't set volume to 0 here, keep it for next time we might just click play
            }
          }
        }, 50);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      // Only set volume to 0 if it's going to play (fade in will handle the rest)
      // If it's not playing, keep it at 0.75 so if they hit play later it fades in correctly or starts at 0.75
      if (isPlaying) {
         audioRef.current.volume = 0;
         audioRef.current.play().catch(e => console.log("Audio play failed:", e));
         
         const fadeIn = setInterval(() => {
            if (audioRef.current && audioRef.current.volume < 0.70) {
              audioRef.current.volume += 0.05;
            } else {
              clearInterval(fadeIn);
              if (audioRef.current) {
                  audioRef.current.volume = 0.75;
              }
            }
          }, 50);
      } else {
         audioRef.current.volume = 0.75;
      }
    }
  }, [activeProfile]);

  return (
    <div className="relative min-h-screen pt-24 px-6 md:pl-24 md:pr-12 pb-24 flex flex-col">
      <audio
        ref={audioRef}
        src={activeProfile.audioSrc}
        onEnded={() => setIsPlaying(false)}
        loop
      />
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Visualizer Area */}
        <div className="relative w-full max-w-4xl aspect-video flex items-center justify-center overflow-hidden">
          {/* Theme-based Visualizers */}
          <div className="absolute inset-0 flex items-center justify-center">
            {activeProfile.theme === 'pristine' && (
              <div className="relative w-full h-full flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: isPlaying ? [1, 1.5, 2] : 1,
                      opacity: isPlaying ? [0.5, 0.2, 0] : 0.1,
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 1.3,
                      ease: "easeOut"
                    }}
                    className="absolute w-64 h-64 rounded-full border border-white/20"
                  />
                ))}
                <motion.div 
                  animate={{ opacity: isPlaying ? [0.1, 0.3, 0.1] : 0.1 }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-48 h-48 rounded-full bg-white/5 blur-2xl" 
                />
              </div>
            )}

            {activeProfile.theme === 'roar' && (
              <div className="flex items-center gap-1 h-64 px-4">
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isPlaying ? [20, Math.random() * 180 + 40, 20] : 10,
                      opacity: isPlaying ? [0.4, 1, 0.4] : 0.2,
                    }}
                    transition={{
                      duration: 0.2 + Math.random() * 0.2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-1.5 bg-gradient-to-t from-blue-600 via-purple-500 to-blue-400 rounded-none shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                  />
                ))}
              </div>
            )}

            {activeProfile.theme === 'pulse' && (
              <div className="relative w-full h-64 flex flex-col justify-center gap-4 px-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative w-full h-px bg-white/5 overflow-hidden">
                    <motion.div
                      animate={{
                        x: isPlaying ? ['-100%', '200%'] : '-100%',
                        opacity: isPlaying ? [0, 1, 0] : 0,
                      }}
                      transition={{
                        duration: 1.5 + (i * 0.2),
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.1
                      }}
                      className="absolute top-0 h-full w-32 bg-gradient-to-r from-transparent via-primary to-transparent"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 grid grid-cols-12 gap-2 opacity-10 pointer-events-none">
                  {[...Array(48)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: isPlaying ? [0.1, 0.8, 0.1] : 0.1 }}
                      transition={{ duration: 1, delay: Math.random() * 2, repeat: Infinity }}
                      className="w-1 h-1 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="z-10 w-24 h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group hover:bg-white/10 transition-all shadow-[0_0_50px_rgba(128,236,255,0.2)]"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 text-primary fill-primary" />
            ) : (
              <Play className="w-10 h-10 text-primary fill-primary ml-1" />
            )}
          </motion.button>
        </div>

        {/* Info Panel */}
        <motion.div
          key={activeProfile.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center max-w-3xl"
        >
          <div className="font-headline text-[10px] tracking-[0.4em] text-tertiary uppercase mb-2">Acoustic Engine v2.0</div>
          <div className="text-primary font-headline text-xs tracking-widest uppercase mb-4 opacity-60">
            {t(activeProfile.intention)}
          </div>
          <h2 className="font-headline text-4xl font-bold text-white mb-6">{t(activeProfile.name)}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <div className="text-[10px] text-tertiary font-headline uppercase tracking-widest mb-3">Design Philosophy</div>
              <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                {t(activeProfile.philosophy)}
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-center bg-primary/5">
              <div className="text-[10px] text-primary font-headline uppercase tracking-widest mb-3">Core Resonance</div>
              <p className="text-sm text-white font-light italic leading-relaxed">
                "{t(activeProfile.copy)}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Selection */}
      <div className="mt-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {soundProfiles.map((profile) => (
          <button
            key={profile.name}
            onClick={() => handleProfileClick(profile)}
            className={`glass-panel p-8 rounded-3xl border-white/10 text-left transition-all duration-500 group ${activeProfile.name === profile.name ? 'bg-white/10 border-primary/40' : 'hover:bg-white/5'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl transition-all ${activeProfile.name === profile.name ? 'bg-primary text-background' : 'bg-white/5 text-primary'}`}>
                {activeProfile.name === profile.name && isPlaying ? (
                  <AudioLines className="w-6 h-6 animate-pulse" />
                ) : (
                  <AudioLines className="w-6 h-6" />
                )}
              </div>
              <span className={`font-headline text-[10px] tracking-widest uppercase ${activeProfile.name === profile.name ? 'text-primary' : 'text-on-surface-variant'}`}>
                {activeProfile.name === profile.name ? (isPlaying ? t('Active') : t('Paused')) : t('Select')}
              </span>
            </div>
            <h4 className="font-headline text-lg font-bold text-white mb-1">{t(profile.name)}</h4>
            <p className="font-headline text-[10px] text-primary/60 uppercase tracking-widest">{t(profile.label)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
