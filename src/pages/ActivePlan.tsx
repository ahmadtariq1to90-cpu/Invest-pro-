import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function ActivePlan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activePlans, setActivePlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  const fetchPlans = async () => {
    if (isSupabaseConfigured && user?.uid) {
      try {
        const { data: plans, error } = await supabase
          .from('active_plans')
          .select('*')
          .eq('user_id', user.uid)
          .eq('status', 'active');
          
        if (error) throw error;
        setActivePlans(plans || []);
      } catch (error) {
        console.error("Error fetching active plans:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const canClaim = (lastReturnDate: any) => {
    if (!lastReturnDate) return true;
    const lastDate = new Date(lastReturnDate);
    const nextReturnDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
    return now.getTime() >= nextReturnDate.getTime();
  };

  const handleClaim = async (plan: any) => {
    if (!user?.uid || !isSupabaseConfigured) return;
    
    setClaiming(plan.id);
    try {
      const newReturnsReceived = (plan.returns_received || 0) + 1;
      const isCompleted = newReturnsReceived >= plan.duration;

      // Fetch current user balance
      const { data: currentUser } = await supabase
        .from('users')
        .select('balance, withdraw_balance')
        .eq('id', user.uid)
        .single();

      if (currentUser) {
        // Update user balance
        await supabase
          .from('users')
          .update({
            balance: (currentUser.balance || 0) + plan.daily_return,
            withdraw_balance: (currentUser.withdraw_balance || 0) + plan.daily_return
          })
          .eq('id', user.uid);
      }

      // Update plan status
      await supabase
        .from('active_plans')
        .update({
          returns_received: newReturnsReceived,
          last_return_date: new Date().toISOString(),
          status: isCompleted ? 'completed' : 'active'
        })
        .eq('id', plan.id);

      // Add transaction
      await supabase.from('transactions').insert({
        user_id: user.uid,
        type: 'profit',
        amount: `+${plan.daily_return}`,
        status: 'Completed',
        title: `Daily Profit: ${plan.name} Plan`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      // Add notification
      await supabase.from('notifications').insert({
        user_id: user.uid,
        title: 'Daily Profit Claimed',
        message: `You successfully claimed ${plan.daily_return} PKR profit from your ${plan.name} plan.`,
        read: false,
      });

      // Refresh plans
      await fetchPlans();
    } catch (error) {
      console.error("Error claiming profit:", error);
    } finally {
      setClaiming(null);
    }
  };

  const formatTimeLeft = (lastReturnDate: any) => {
    if (!lastReturnDate) return "00:00:00";
    const lastDate = new Date(lastReturnDate);
    const nextReturnDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
    const diff = nextReturnDate.getTime() - now.getTime();
    
    if (diff <= 0) return "00:00:00";
    
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={() => navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Active Plans</h1>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {loading ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading active plans...</div>
          ) : activePlans.length > 0 ? (
            activePlans.map((plan) => (
              <div key={plan.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{plan.name} Plan</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Invested: {plan.price} PKR</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={14} /> Active
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl transition-colors duration-300">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Daily Return</p>
                    <p className="font-bold text-slate-900 dark:text-white">{plan.daily_return} PKR</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl transition-colors duration-300">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Earned</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{(plan.returns_received || 0) * plan.daily_return} PKR</p>
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 flex flex-col gap-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-bold uppercase tracking-wider mb-0.5">Next Return In</p>
                        <p className="font-mono font-bold text-indigo-900 dark:text-indigo-100 text-lg tracking-wider">
                          {canClaim(plan.last_return_date) ? "00:00:00" : formatTimeLeft(plan.last_return_date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-bold uppercase tracking-wider mb-0.5">Returns</p>
                      <p className="font-bold text-indigo-900 dark:text-indigo-100">{plan.returns_received || 0}/{plan.duration}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(plan)}
                    disabled={!canClaim(plan.last_return_date) || claiming === plan.id}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      canClaim(plan.last_return_date) 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {claiming === plan.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <TrendingUp size={18} />
                        {canClaim(plan.last_return_date) ? "Claim Daily Profit" : "Wait for Timer"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <TrendingUp className="text-indigo-300 dark:text-indigo-500" size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Plans</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">You don't have any active investment plans yet. Start investing to earn daily profits!</p>
              <button 
                onClick={() => navigate('/app/plans')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                View Investment Plans
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
