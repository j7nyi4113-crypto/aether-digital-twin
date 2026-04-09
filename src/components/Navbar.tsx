import { Link, useLocation } from 'react-router-dom';
import { Globe, Camera } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: '首页', path: '/' },
  { name: '机械灵魂', path: '/mechanical' },
  { name: '漆面生长', path: '/surface' },
  { name: '空间声场', path: '/acoustic' },
  { name: '生态联动', path: '/ecosystem' },
];

export default function Navbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('aether-avatar') || 'https://picsum.photos/seed/aether-user/100/100';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem('aether-avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f1419]/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex justify-between items-center px-6 md:px-12 py-6 max-w-full">
        <Link to="/" className="text-2xl font-bold tracking-[0.1em] text-primary font-headline uppercase">
          {t('AETHER')}
        </Link>
        
        <div className="hidden md:flex gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "font-headline tracking-[0.05em] uppercase text-sm transition-all duration-300 hover:text-tertiary hover:scale-105",
                location.pathname === item.path
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-gray-400"
              )}
            >
              {t(item.name)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-primary font-headline text-sm tracking-[0.05em]">
          <div className="relative" ref={langRef}>
            <Globe 
              className="w-5 h-5 cursor-pointer hover:text-tertiary transition-colors" 
              onClick={() => setIsLangOpen(!isLangOpen)}
            />
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-4 w-24 bg-[#0f1419]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)] origin-top-right"
                >
                  <button 
                    className={cn("px-4 py-3 text-left hover:bg-white/10 transition-colors", i18n.language === 'zh' ? "text-primary" : "text-gray-400")}
                    onClick={() => changeLanguage('zh')}
                  >
                    CN
                  </button>
                  <div className="h-px bg-white/10 w-full" />
                  <button 
                    className={cn("px-4 py-3 text-left hover:bg-white/10 transition-colors", i18n.language === 'en' ? "text-primary" : "text-gray-400")}
                    onClick={() => changeLanguage('en')}
                  >
                    EN
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div 
            className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden ml-2 relative group cursor-pointer"
            onClick={handleAvatarClick}
            title={t('点击上传头像')}
          >
            <img
              src={avatarUrl}
              alt="User"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
