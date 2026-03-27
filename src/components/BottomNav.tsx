import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Wallet, Plus, ArrowDownToLine, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-50 rounded-t-3xl pb-safe transition-colors duration-300">
      <div className="flex justify-between items-center px-6 py-3">
        <NavLink to="/app" end className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300")}>
          <Home size={24} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </NavLink>
        
        <NavLink to="/app/deposit" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300")}>
          <ArrowDownToLine size={24} />
          <span className="text-[10px] font-medium">Deposit</span>
        </NavLink>

        <div className="relative -top-6">
          <button 
            onClick={() => navigate('/app/referral')}
            className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={28} />
          </button>
        </div>

        <NavLink to="/app/withdraw" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300")}>
          <Wallet size={24} />
          <span className="text-[10px] font-medium">Withdraw</span>
        </NavLink>

        <NavLink to="/app/settings" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300")}>
          <Settings size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </NavLink>
      </div>
    </div>
  );
}
