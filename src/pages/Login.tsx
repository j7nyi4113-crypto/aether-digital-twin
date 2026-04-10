import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { MessageSquare, Scan, Smartphone, LogIn, CheckCircle, ChevronRight, User, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

export default function Login() {
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [loginStep, setLoginStep] = useState<'scan' | 'profile' | 'success'>('scan');
  
  // State for simulated profile data
  const [mockProfile, setMockProfile] = useState({
    nickname: '',
    avatar: ''
  });

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // If already logged in, redirect
    if (user?.isLoggedIn) {
      navigate(from, { replace: true });
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [user, navigate, from]);

  // Simulated Login Flow
  const handleSimulatedLogin = () => {
    // In a real WeChat flow, this would be the redirect back with user info
    // For now, we simulate "Scanning Success" -> "Getting Profile"
    setLoginStep('profile');
    
    // Auto-generate some mock data
    const mockId = Math.random().toString(36).substring(7);
    setMockProfile({
      nickname: `AETHER_${mockId}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockId}`
    });
  };

  const handleConfirmLogin = () => {
    login({
      id: Math.random().toString(36).substring(2),
      nickname: mockProfile.nickname || 'AETHER User',
      avatar: mockProfile.avatar || 'https://picsum.photos/seed/aether/100/100'
    });
    setLoginStep('success');
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 1500);
  };

  const handleJumpToWeChat = () => {
    // This would be the OAuth redirect URL
    alert('跳转到微信授权页面...\n(Demo: 这里会重定向到微信登录 URL)');
    handleSimulatedLogin();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden relative">
          {/* Top accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <AnimatePresence mode="wait">
            {loginStep === 'scan' && (
              <motion.div
                key="step-scan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center"
              >
                <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-8">
                  <MessageSquare className="w-8 h-8" />
                </div>
                
                <h1 className="font-headline text-2xl font-bold text-white mb-2 tracking-widest uppercase">
                  AETHER LOGIN
                </h1>
                <p className="text-on-surface-variant text-sm font-light mb-10 tracking-wide">
                  {isMobile ? '请通过微信登录以进入 AETHER 空间' : '使用微信扫码，开启数字化孪生之旅'}
                </p>

                {isMobile ? (
                  <button
                    onClick={handleJumpToWeChat}
                    className="w-full py-4 bg-[#07C160] hover:bg-[#06AD56] text-white rounded-2xl font-headline text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(7,193,96,0.3)] active:scale-95"
                  >
                    <Smartphone className="w-4 h-4" />
                    跳转微信登录 | WECHAT LOGIN
                  </button>
                ) : (
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] mb-8 cursor-pointer active:scale-95 transition-transform" onClick={handleSimulatedLogin}>
                      <QRCodeSVG 
                        value="https://aether.digital/mock-login" 
                        size={200}
                        fgColor="#0f1419"
                        level="H"
                        imageSettings={{
                          src: "https://trae.ai/favicon.ico", // Or Aether logo
                          height: 40,
                          width: 40,
                          excavate: true,
                        }}
                      />
                      {/* Fake Scan Overlay */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 flex items-center justify-center rounded-3xl transition-opacity">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold tracking-widest text-black flex items-center gap-2">
                          <Scan className="w-3 h-3" /> 点击模拟扫码
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isMobile && (
                  <div className="flex items-center gap-3 text-[10px] text-on-surface-variant tracking-[0.2em] uppercase mt-4">
                    <Scan className="w-3 h-3" />
                    微信扫一扫 | SCAN TO LOGIN
                  </div>
                )}
              </motion.div>
            )}

            {loginStep === 'profile' && (
              <motion.div
                key="step-profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-1 mb-8">
                  <img src={mockProfile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover shadow-lg" />
                </div>
                
                <h2 className="font-headline text-xl font-bold text-white mb-2 tracking-widest uppercase">
                  登录成功
                </h2>
                <p className="text-on-surface-variant text-[10px] font-light mb-8 tracking-[0.2em] uppercase">
                  WeChat Profile Sync Complete
                </p>

                <div className="w-full space-y-4 mb-10">
                  <div className="glass-panel p-4 rounded-2xl border-white/10 flex items-center gap-4">
                    <User className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <div className="text-[8px] uppercase text-white/40 tracking-widest mb-1">Nickname</div>
                      <input 
                        type="text" 
                        value={mockProfile.nickname} 
                        onChange={(e) => setMockProfile(p => ({ ...p, nickname: e.target.value }))}
                        className="bg-transparent border-none text-white text-sm w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="glass-panel p-4 rounded-2xl border-white/10 flex items-center gap-4 opacity-60">
                    <Image className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <div className="text-[8px] uppercase text-white/40 tracking-widest mb-1">Avatar Sync</div>
                      <div className="text-white text-xs truncate">{mockProfile.avatar}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmLogin}
                  className="w-full py-4 bg-primary text-black rounded-2xl font-headline text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 font-bold"
                >
                  <LogIn className="w-4 h-4" />
                  进入以太空间 | ENTER AETHER
                </button>
              </motion.div>
            )}

            {loginStep === 'success' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-10"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <CheckCircle className="w-12 h-12" />
                  </motion.div>
                </div>
                <h2 className="font-headline text-2xl font-bold text-white mb-2 tracking-widest uppercase">
                  WELCOME
                </h2>
                <p className="text-primary font-headline text-[10px] tracking-[0.3em] uppercase">
                  Access Granted | Identity Verified
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
           <span className="h-px w-12 bg-white/20" />
           <span className="text-[8px] tracking-[0.4em] uppercase text-white">Aether Security Protocol</span>
           <span className="h-px w-12 bg-white/20" />
        </div>
      </motion.div>
    </div>
  );
}
