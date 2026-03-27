import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Wallet, Plus, ArrowDownToLine, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl px-4 py-3 flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-50 pointer-events-none"></div>
        
        <NavLink to="/app" end className={({ isActive }) => clsx("flex flex-col items-center gap-1.5 transition-all duration-300 relative z-10", isActive ? "text-white scale-110" : "text-white/40 hover:text-white/60")}>
          {({ isActive }) => (
            <>
              <Home size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
            </>
          )}
        </NavLink>
        
        <NavLink to="/app/deposit" className={({ isActive }) => clsx("flex flex-col items-center gap-1.5 transition-all duration-300 relative z-10", isActive ? "text-white scale-110" : "text-white/40 hover:text-white/60")}>
          {({ isActive }) => (
            <>
              <ArrowDownToLine size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Deposit</span>
            </>
          )}
        </NavLink>

        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/app/referral')}
          className="relative w-14 h-14 -mt-10 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white border-4 border-[#050505] shadow-xl">
            <Plus size={28} strokeWidth={3} />
          </div>
        </motion.button>

        <NavLink to="/app/withdraw" className={({ isActive }) => clsx("flex flex-col items-center gap-1.5 transition-all duration-300 relative z-10", isActive ? "text-white scale-110" : "text-white/40 hover:text-white/60")}>
          {({ isActive }) => (
            <>
              <Wallet size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Withdraw</span>
            </>
          )}
        </NavLink>

        <NavLink to="/app/settings" className={({ isActive }) => clsx("flex flex-col items-center gap-1.5 transition-all duration-300 relative z-10", isActive ? "text-white scale-110" : "text-white/40 hover:text-white/60")}>
          {({ isActive }) => (
            <>
              <Settings size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Settings</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
}
