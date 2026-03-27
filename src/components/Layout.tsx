import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useInvestmentReturns } from '../store/investment';

export default function Layout() {
  useInvestmentReturns();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      <main className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-900 shadow-xl relative overflow-hidden transition-colors duration-300">
        <Outlet />
        <BottomNav />
      </main>
    </div>
  );
}
