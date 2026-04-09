import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, Zap, Wind, Scale, Layers, Sun, CloudSun, Moon, Settings, Cpu, Headphones, BookOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const isHome = location.pathname === '/';
  const isMechanical = location.pathname === '/mechanical';
  const isPower = location.pathname === '/power';
  const isAero = location.pathname === '/aero';
  const isLightweight = location.pathname === '/lightweight';
  const isSurface = location.pathname === '/surface';
  const isAcoustic = location.pathname === '/acoustic';
  const isEcosystem = location.pathname === '/ecosystem';

  return (
    <aside className="fixed left-0 top-24 bottom-24 w-20 rounded-r-3xl border-r border-white/10 bg-[#0f1419]/40 backdrop-blur-2xl flex flex-col items-center py-8 gap-8 z-40 shadow-[20px_0_40px_rgba(194,224,255,0.03)]">
      <div className="flex flex-col items-center gap-1 mb-4">
        {isHome ? (
          <>
            <Activity className="text-tertiary w-6 h-6" />
            <span className="font-headline text-[10px] text-tertiary/60 uppercase tracking-tighter">{t('Control')}</span>
          </>
        ) : (
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => navigate('/'), 300);
            }}
            className="flex flex-col items-center gap-1 group transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Activity className="text-tertiary w-6 h-6 group-hover:text-white transition-colors" />
            <span className="font-headline text-[10px] text-tertiary/60 uppercase tracking-tighter group-hover:text-white transition-colors">Home</span>
            <span className="font-headline text-[10px] text-tertiary/80 font-bold tracking-widest group-hover:text-white transition-colors">{t('首页')}</span>
          </button>
        )}
      </div>

      {/* Dynamic Buttons based on context */}
      {isSurface ? (
        <>
          <SidebarButton 
            icon={Sun} 
            label={t("HDR 环境")} 
            active={!location.search} 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => navigate('/surface'), 300);
            }}
          />
          <SidebarButton 
            icon={CloudSun} 
            label={t("落日加州")} 
            active={location.search.includes('env=cali')}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => navigate('/surface?env=cali'), 300);
            }}
          />
          <SidebarButton 
            icon={Moon} 
            label={t("午夜上海")} 
            active={location.search.includes('env=shanghai')}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => navigate('/surface?env=shanghai'), 300);
            }}
          />
        </>
      ) : (
        <>
          <SidebarButton 
            icon={Zap} 
            label={t("动力核心")} 
            active={isPower || isMechanical} 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => navigate('/mechanical'), 300);
            }}
          />
          <SidebarButton 
            icon={Headphones} 
            label={t("空间声场")} 
            active={isAcoustic} 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => navigate('/acoustic'), 300);
            }}
          />
          <SidebarButton 
            icon={Scale} 
            label={t("生态联动")} 
            active={isLightweight} 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => navigate('/ecosystem'), 300);
            }}
          />
        </>
      )}

      <div className="mt-auto">
        <SidebarButton 
          icon={BookOpen} 
          label={t("设计纲要")} 
          active={location.pathname === '/design-brief'}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => navigate('/design-brief'), 300);
          }}
        />
      </div>
    </aside>
  );
}

function SidebarButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-2 transition-all duration-300",
        active 
          ? "bg-gradient-to-br from-secondary to-tertiary text-background rounded-xl scale-110 shadow-[0_0_15px_rgba(128,236,255,0.4)] p-3" 
          : "text-primary/40 hover:text-primary scale-105 active:scale-95"
      )}
    >
      {!active && (
        <div className="p-3 rounded-xl transition-all group-hover:bg-white/5">
          <Icon className="w-6 h-6" />
        </div>
      )}
      {active && <Icon className="w-6 h-6" />}
      <span className={cn("font-headline text-[10px] uppercase", active && "font-bold")}>{label}</span>
    </button>
  );
}
