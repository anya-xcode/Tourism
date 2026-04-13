import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type AuthTravelShellProps = {
  children: ReactNode;
};

export function AuthTravelShell({ children }: AuthTravelShellProps) {
  return (
    <div className="auth-split-wrapper">
      {/* Decorative Side: Image/Inspiration */}
      <div className="auth-image-side">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.85] contrast-[1.1] transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-12 left-12 right-12 z-20 text-white"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 backdrop-blur-md border border-blue-400/30">
            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            <span className="text-[12px] font-bold uppercase tracking-widest text-blue-100">Global Discovery</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight font-poppins mb-4 text-white drop-shadow-md">
            Collect moments, <br />
            <span className="text-blue-300">not things.</span>
          </h2>
          <p className="text-lg font-medium text-white/80 max-w-[320px]">
            Join thousands of travelers exploring the world's most hidden gems.
          </p>
        </motion.div>
      </div>

      {/* Logic Side: Form */}
      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[440px]"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
