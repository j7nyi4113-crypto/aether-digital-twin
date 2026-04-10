import { Link, useLocation } from 'react-router-dom';
import { Globe, Camera, Edit2, Check, Menu, X, Activity, Zap, Headphones, Scale, MessageSquare, BookOpen, LogOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, logout, updateProfile } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [adminKey, setAdminKey] = useState(() => {
    return localStorage.getItem('aether-admin-key') || '';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nickname = user?.nickname || 'Guest';
  const avatarUrl = user?.avatar || 'https://picsum.photos/seed/aether-user/100/100';

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleAvatarClick = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isLangOpen) setIsLangOpen(false);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfile(nickname, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditingNickname = () => {
    setTempNickname(nickname);
    setIsEditingNickname(true);
  };

  const saveNickname = () => {
    if (tempNickname.trim()) {
      updateProfile(tempNickname.trim(), avatarUrl);
    }
    setIsEditingNickname(false);
  };

  const handleAdminKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAdminKey(val);
    localStorage.setItem('aether-admin-key', val);
    window.dispatchEvent(new Event('adminStatusChanged'));
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsEditingNickname(false);
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
    <>
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
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-primary hover:text-white transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
            <div className="relative" ref={profileRef}>
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleAvatarClick}
                title={t('个人主页')}
              >
                <span className="font-headline text-xs tracking-widest uppercase text-on-surface-variant group-hover:text-primary transition-colors hidden sm:block">
                  {nickname}
                </span>
                <div 
                  className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden relative"
                >
                  <img
                    src={avatarUrl}
                    alt="User"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-4 w-64 bg-[#0f1419]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)] origin-top-right z-50 p-6"
                  >
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-20 h-20 rounded-full border border-primary/40 overflow-hidden relative group/avatar cursor-pointer mb-4"
                        onClick={triggerFileUpload}
                        title={t('点击更换头像')}
                      >
                        <img
                          src={avatarUrl}
                          alt="User"
                          className="w-full h-full object-cover transition-opacity duration-300 group-hover/avatar:opacity-40"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                          <Camera className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      {isEditingNickname ? (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            type="text" 
                            value={tempNickname}
                            onChange={(e) => setTempNickname(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveNickname();
                              if (e.key === 'Escape') setIsEditingNickname(false);
                            }}
                            className="flex-1 bg-white/5 border border-primary/30 rounded-lg px-3 py-1.5 text-sm text-white font-headline focus:outline-none focus:border-primary"
                            autoFocus
                            maxLength={15}
                          />
                          <button 
                            onClick={saveNickname}
                            className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-black transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/name">
                          <span className="font-headline text-lg text-white font-bold tracking-wider">
                            {nickname}
                          </span>
                          <button 
                            onClick={startEditingNickname}
                            className="opacity-0 group-hover/name:opacity-100 p-1 text-primary/60 hover:text-primary transition-all"
                            title={t('修改昵称')}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      
                      {!isEditingNickname && (
                        <div className="text-[10px] text-on-surface-variant font-headline uppercase tracking-widest mt-1">
                          {t('AETHER 探索者')}
                        </div>
                      )}

                      <div className="mt-6 w-full pt-6 border-t border-white/5">
                        <div className="text-[10px] text-white/30 font-headline uppercase tracking-widest mb-2 px-1">
                          {t('管理员模式', 'Admin Access')}
                        </div>
                        <input 
                          type="password"
                          placeholder={t('输入密钥...', 'Enter Secret...')}
                          value={adminKey}
                          onChange={handleAdminKeyChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/30 transition-all"
                        />
                        {adminKey === 'AETHER_ADMIN_2024' && (
                          <div className="mt-2 text-[9px] text-primary font-headline uppercase tracking-widest text-center animate-pulse">
                            {t('管理员权限已激活', 'Admin Privileges Active')}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleLogout}
                        className="mt-8 w-full py-3 rounded-xl border border-red-500/20 text-red-400 font-headline text-[10px] tracking-widest uppercase hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-3 h-3" />
                        {t('退出登录', 'Logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-[#0f1419]/98 backdrop-blur-3xl z-[48] md:hidden overflow-y-auto pt-32 pb-12"
          >
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--color-primary)_0%,_transparent_70%)]" />
            
            <div className="relative z-10 flex flex-col p-8 gap-8">
              {/* Main Nav Items */}
              <div className="flex flex-col gap-6">
                <div className="text-[10px] text-primary/40 font-headline uppercase tracking-[0.3em] mb-2 border-b border-white/5 pb-2">
                  Navigation
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "font-headline tracking-[0.1em] uppercase text-2xl transition-all duration-300",
                      location.pathname === item.path ? "text-primary" : "text-white/60"
                    )}
                  >
                    {t(item.name)}
                  </Link>
                ))}
              </div>

              {/* Sidebar Items (Now in mobile menu) */}
              <div className="flex flex-col gap-6 mt-4">
                <div className="text-[10px] text-primary/40 font-headline uppercase tracking-[0.3em] mb-2 border-b border-white/5 pb-2">
                  Controls & Modules
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MobileMenuItem 
                    icon={Zap} 
                    label={t("动力核心")} 
                    to="/mechanical"
                    active={location.pathname === '/mechanical'}
                  />
                  <MobileMenuItem 
                    icon={Headphones} 
                    label={t("空间声场")} 
                    to="/acoustic"
                    active={location.pathname === '/acoustic'}
                  />
                  <MobileMenuItem 
                    icon={Scale} 
                    label={t("生态联动")} 
                    to="/ecosystem"
                    active={location.pathname === '/ecosystem'}
                  />
                  <MobileMenuItem 
                    icon={MessageSquare} 
                    label={t("访客留言")} 
                    to="/guestbook"
                    active={location.pathname === '/guestbook'}
                  />
                  <MobileMenuItem 
                    icon={BookOpen} 
                    label={t("设计纲要")} 
                    to="/design-brief"
                    active={location.pathname === '/design-brief'}
                  />
                  <MobileMenuItem 
                    icon={Activity} 
                    label={t("系统主页")} 
                    to="/"
                    active={location.pathname === '/'}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileMenuItem({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300",
        active 
          ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_20px_rgba(0,210,255,0.1)]" 
          : "bg-white/5 border-white/10 text-white/60"
      )}
    >
      <Icon className={cn("w-6 h-6", active ? "text-primary" : "text-white/40")} />
      <span className="font-headline text-[10px] uppercase tracking-widest text-center">{label}</span>
    </Link>
  );
}
