import { motion } from 'motion/react';
import { Headphones, AudioLines, Mic2, Speaker, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const soundProfiles = [
  { name: '灵境原声', label: 'Aether Pure', desc: '纯净电驱声场，模拟高频电磁共振。', audioSrc: '/audio/aether-pure.mp3' },
  { name: '机械咆哮', label: 'Mechanical Roar', desc: '模拟V12引擎的数字化重组，低沉有力。', audioSrc: '/audio/mechanical-roar.mp3' },
  { name: '未来脉冲', label: 'Future Pulse', desc: '赛博朋克风格的合成音效，充满科技感。', audioSrc: '/audio/future-pulse.mp3' },
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
        <div className="relative w-full max-w-4xl aspect-video flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center gap-1 md:gap-2 overflow-hidden px-4">
            {[...Array(window.innerWidth < 768 ? 20 : 40)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [10, Math.random() * (window.innerWidth < 768 ? 80 : 150) + 20, 10] : 10,
                  opacity: isPlaying ? [0.3, 1, 0.3] : 0.3,
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1 md:w-1.5 bg-gradient-to-t from-tertiary via-primary to-secondary rounded-full shrink-0"
              />
            ))}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center max-w-2xl"
        >
          <div className="font-headline text-[10px] tracking-[0.4em] text-tertiary uppercase mb-4">Acoustic Engine v2.0</div>
          <h2 className="font-headline text-4xl font-bold text-white mb-4">{t(activeProfile.name)}</h2>
          <p className="text-on-surface-variant font-light leading-relaxed">
            {t(activeProfile.desc)}
          </p>
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
