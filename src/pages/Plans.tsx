import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const PLANS = [
  { id: 1, name: 'Bronze', price: 50, daily: 2.5, total: 75, duration: 30 },
  { id: 2, name: 'Silver', price: 100, daily: 5, total: 150, duration: 30, popular: true },
  { id: 3, name: 'Gold', price: 500, daily: 30, total: 900, duration: 30 },
  { id: 4, name: 'Platinum', price: 1000, daily: 70, total: 2100, duration: 30 },
  { id: 5, name: 'Diamond', price: 5000, daily: 400, total: 12000, duration: 30 },
];

export default function Plans() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (isSupabaseConfigured && user?.uid) {
        const { data } = await supabase
          .from('users')
          .select('deposit_balance')
          .eq('id', user.uid)
          .single();
          
        if (data) {
          setBalance(data.deposit_balance || 0);
        }
      }
    };
    fetchBalance();
  }, [user]);

  const handleInvest = async (plan: typeof PLANS[0]) => {
    if (!isSupabaseConfigured || !user?.uid) {
      setError("System configuration error. Please try again later.");
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.uid)
        .single();
        
      if (userError || !userData) {
        throw new Error("User account not found. Please contact support.");
      }

      const currentBalance = userData.deposit_balance || 0;

      if (currentBalance < plan.price) {
        setError(`Insufficient deposit balance! You have ${currentBalance} PKR but need ${plan.price} PKR.`);
        setTimeout(() => navigate('/app/deposit'), 3000);
        setLoading(false);
        return;
      }

      const newDepositBalance = currentBalance - plan.price;
      const newTotalBalance = Math.max(0, (userData.balance || 0) - plan.price);
      const newTotalInvestment = (userData.total_investment || 0) + plan.price;

      // 1. Update user balances
      const { error: updateError } = await supabase
        .from('users')
        .update({
          deposit_balance: newDepositBalance,
          balance: newTotalBalance,
          total_investment: newTotalInvestment,
          active_plans_count: (userData.active_plans_count || 0) + 1
        })
        .eq('id', user.uid);

      if (updateError) throw updateError;

      // 2. Save active plan
      const { error: planError } = await supabase
        .from('active_plans')
        .insert({
          user_id: user.uid,
          plan_id: plan.id,
          name: plan.name,
          price: plan.price,
          daily_return: plan.daily,
          total_return: plan.total,
          duration: plan.duration,
          status: 'active',
          returns_received: 0,
          last_return_date: new Date().toISOString()
        });

      if (planError) throw planError;

      // 3. Save transaction
      await supabase.from('transactions').insert({
        user_id: user.uid,
        type: 'investment',
        amount: `-${plan.price}`,
        status: 'Completed',
        title: `Purchased ${plan.name} Plan`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      // 4. Save notification
      await supabase.from('notifications').insert({
        user_id: user.uid,
        title: 'Plan Purchased',
        message: `You have successfully purchased the ${plan.name} plan for ${plan.price} PKR.`,
        read: false,
      });

      setSuccess('Investment successful! Plan activated.');
      setTimeout(() => navigate('/app/active-plan'), 1500);
    } catch (err: any) {
      console.error("Error purchasing plan:", err);
      setError(`Failed to purchase plan: ${err.message || "Unknown error"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={() => navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Investment Plans</h1>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            {success}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {PLANS.map((plan) => (
            <div key={plan.id} className={`relative p-6 rounded-3xl border transition-colors duration-300 ${plan.popular ? 'bg-indigo-900 border-indigo-800 text-white shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm'}`}>
              {plan.popular && <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">Most Popular</div>}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name} Plan</h3>
                  <p className={`text-xs ${plan.popular ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>Duration: {plan.duration} Days</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs mb-1 ${plan.popular ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>Price</p>
                  <p className="text-2xl font-extrabold">{plan.price} <span className="text-sm font-medium">PKR</span></p>
                </div>
              </div>

              <div className={`space-y-3 mb-6 p-4 rounded-2xl transition-colors duration-300 ${plan.popular ? 'bg-white/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm flex items-center gap-2 ${plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-300'}`}>
                    <CheckCircle2 size={16} className={plan.popular ? 'text-indigo-300' : 'text-emerald-500 dark:text-emerald-400'} /> Daily Return
                  </span>
                  <span className="font-bold">{plan.daily} PKR</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm flex items-center gap-2 ${plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-300'}`}>
                    <CheckCircle2 size={16} className={plan.popular ? 'text-indigo-300' : 'text-emerald-500 dark:text-emerald-400'} /> Total Return
                  </span>
                  <span className="font-bold">{plan.total} PKR</span>
                </div>
              </div>

              <button
                onClick={() => handleInvest(plan)}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? 'bg-white text-indigo-900 hover:bg-slate-100 shadow-white/20' 
                    : 'bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 shadow-indigo-100 dark:shadow-none'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Start Investing'}
              </button>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
