import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useInvestmentReturns } from '../store/investment';

export default function Layout() {
  useInvestmentReturns();
  
  return (
    <div className="min-h-screen bg-[#050505] transition-colors duration-500 selection:bg-indigo-500/30 selection:text-white">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <main className="max-w-md mx-auto min-h-screen bg-[#050505] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300 z-10 border-x border-white/5">
        <div className="min-h-screen pb-32">
          <Outlet />
        </div>
        <BottomNav />
      </main>
    </div>
  );
}
