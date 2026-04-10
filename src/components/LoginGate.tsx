import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-8" />
          <h2 className="font-headline text-2xl font-bold text-white tracking-[0.4em] mb-2 uppercase">
            AETHER
          </h2>
          <p className="text-primary font-headline tracking-[0.2em] text-[10px] uppercase opacity-60">
            Initializing Neural Link...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !user.isLoggedIn) {
    // Redirect to login page but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
