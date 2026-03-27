import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, ArrowRight, Zap, TrendingUp, Shield, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const PLANS = [
  { id: 1, name: 'Bronze', price: 50, daily: 2.5, total: 75, duration: 30, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { id: 2, name: 'Silver', price: 100, daily: 5, total: 150, duration: 30, popular: true, color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/20' },
  { id: 3, name: 'Gold', price: 500, daily: 30, total: 900, duration: 30, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  { id: 4, name: 'Platinum', price: 1000, daily: 70, total: 2100, duration: 30, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  { id: 5, name: 'Diamond', price: 5000, daily: 400, total: 12000, duration: 30, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
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
        const { data } = await supabase.from('users').select('deposit_balance').eq('id', user.uid).single();
        if (data) setBalance(data.deposit_balance || 0);
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
      const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', user.uid).single();
      if (userError || !userData) throw new Error("User account not found. Please contact support.");

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

      const { error: updateError } = await supabase.from('users').update({
        deposit_balance: newDepositBalance,
        balance: newTotalBalance,
        total_investment: newTotalInvestment,
        active_plans_count: (userData.active_plans_count || 0) + 1
      }).eq('id', user.uid);

      if (updateError) throw updateError;

      const { error: planError } = await supabase.from('active_plans').insert({
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

      await supabase.from('transactions').insert({
        user_id: user.uid,
        type: 'investment',
        amount: `-${plan.price}`,
        status: 'Completed',
        title: `Purchased ${plan.name} Plan`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

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
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b,transparent_70%)] opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/app')} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Investment Portal</p>
            <h1 className="text-2xl font-bold tracking-tight">Growth Plans</h1>
          </div>
        </div>

        {/* Balance Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 mb-12 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Zap size={80} />
          </div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Available for Investment</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold tracking-tighter">{balance.toLocaleString()}</h2>
            <span className="text-sm font-bold text-white/20 uppercase">PKR</span>
          </div>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3"
            >
              <Info size={18} />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold flex items-center gap-3"
            >
              <CheckCircle2 size={18} />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans Grid */}
        <div className="space-y-6">
          {PLANS.map((plan, idx) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden ${
                plan.popular 
                  ? 'bg-[#0a0a0a] border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.1)]' 
                  : 'bg-[#0a0a0a] border-white/5 hover:border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-bl-2xl">
                  Most Popular
                </div>
              )}
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.bg} ${plan.border} border`}>
                    <TrendingUp size={24} className={plan.color} />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">{plan.name}</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{plan.duration} Days Cycle</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Entry Price</p>
                  <p className="text-3xl font-bold tracking-tighter">
                    {plan.price.toLocaleString()} <span className="text-sm font-bold text-white/20">PKR</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Daily ROI</p>
                  <p className="text-xl font-bold">{plan.daily} <span className="text-xs text-white/20">PKR</span></p>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Total ROI</p>
                  <p className="text-xl font-bold text-emerald-400">{plan.total} <span className="text-xs opacity-40">PKR</span></p>
                </div>
              </div>

              <button
                onClick={() => handleInvest(plan)}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  plan.popular 
                    ? 'bg-white text-black hover:bg-white/90' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Invest Now <ArrowRight size={20} /></>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <Shield size={12} /> Principal Protected
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
