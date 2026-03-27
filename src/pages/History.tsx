import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.uid) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    const subscription = supabase.channel('transactions_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.uid}` }, fetchTransactions)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const filteredTransactions = transactions.filter(tx => {
    if (tx.type !== activeTab) return false;
    
    // Simple filter logic for demo purposes
    if (filter === 'All') return true;
    
    const txDate = new Date(tx.created_at || tx.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - txDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (filter === '3 Days' && diffDays <= 3) return true;
    if (filter === '1 Week' && diffDays <= 7) return true;
    if (filter === '1 Month' && diffDays <= 30) return true;
    
    return false;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex flex-col gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/app/settings')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Transaction History</h1>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {filter} <ChevronDown size={16} />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-40 transition-colors duration-300">
                {['3 Days', '1 Week', '1 Month', 'All'].map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${filter === f ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl transition-colors duration-300">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'deposit'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'withdraw'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {loading ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading transactions...</div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    tx.type === 'deposit' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.type === 'deposit' ? <ArrowDownToLine size={20} /> : <ArrowUpFromLine size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{tx.user_name || user?.displayName || 'User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.date} {tx.time && `• ${tx.time}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${tx.amount.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount} PKR
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${tx.status === 'Completed' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500 transition-colors duration-300">
                <ArrowUpFromLine size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Transactions Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Try changing the filter to see more history.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
