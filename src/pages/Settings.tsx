import { motion } from 'motion/react';
import { ArrowLeft, User, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Clock, Users, History, HelpCircle, FileText, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { useTheme } from '../store/theme';

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    sessionStorage.removeItem('welcomeShown');
    logout();
    navigate('/');
  };

  const menuGroups = [
    {
      title: 'Preferences',
      items: [
        { 
          icon: theme === 'dark' ? Sun : Moon, 
          label: theme === 'dark' ? 'Light Mode' : 'Dark Mode', 
          onClick: toggleTheme, 
          color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400' 
        },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', path: '/app/profile', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400' },
        { icon: TrendingUp, label: 'Investment Plans', path: '/app/plans', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' },
        { icon: Clock, label: 'Active Plan', path: '/app/active-plan', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400' },
      ]
    },
    {
      title: 'Finance',
      items: [
        { icon: ArrowDownToLine, label: 'Deposit', path: '/app/deposit', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
        { icon: ArrowUpFromLine, label: 'Withdraw', path: '/app/withdraw', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400' },
        { icon: History, label: 'Transaction History', path: '/app/history', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400' },
      ]
    },
    {
      title: 'More',
      items: [
        { icon: Users, label: 'Referral', path: '/app/referral', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30 dark:text-cyan-400' },
        { icon: HelpCircle, label: 'Help & Support', path: '/app/support', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400' },
        { icon: HelpCircle, label: 'FAQ', path: '/faq', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400' },
        { icon: FileText, label: 'Terms and Conditions', path: '/terms', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={() => navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          {menuGroups.map((group, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider px-2">{group.title}</h3>
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
                {group.items.map((item, j) => (
                  item.onClick ? (
                    <button
                      key={j}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                          <item.icon size={20} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</span>
                      </div>
                      <ChevronRight size={20} className="text-slate-400" />
                    </button>
                  ) : (
                    <Link
                      key={j}
                      to={item.path!}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                          <item.icon size={20} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</span>
                      </div>
                      <ChevronRight size={20} className="text-slate-400" />
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-4 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl font-bold text-lg transition-colors border border-rose-100 dark:border-rose-900/30 mt-4"
          >
            <LogOut size={20} />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
}
