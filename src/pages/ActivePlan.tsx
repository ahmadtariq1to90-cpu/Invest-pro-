import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, TrendingUp, CheckCircle2, Zap, Shield, Info, ArrowRight } from 'lucide-react';
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

      const { data: currentUser } = await supabase
        .from('users')
        .select('balance, withdraw_balance')
        .eq('id', user.uid)
        .single();

      if (currentUser) {
        await supabase
          .from('users')
          .update({
            balance: (currentUser.balance || 0) + plan.daily_return,
            withdraw_balance: (currentUser.withdraw_balance || 0) + plan.daily_return
          })
          .eq('id', user.uid);
      }

      await supabase
        .from('active_plans')
        .update({
          returns_received: newReturnsReceived,
          last_return_date: new Date().toISOString(),
          status: isCompleted ? 'completed' : 'active'
        })
        .eq('id', plan.id);

      await supabase.from('transactions').insert({
        user_id: user.uid,
        type: 'profit',
        amount: `+${plan.daily_return}`,
        status: 'Completed',
        title: `Daily Profit: ${plan.name} Plan`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      await supabase.from('notifications').insert({
        user_id: user.uid,
        title: 'Daily Profit Claimed',
        message: `You successfully claimed ${plan.daily_return} PKR profit from your ${plan.name} plan.`,
        read: false,
      });

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
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Portfolio Management</p>
            <h1 className="text-2xl font-bold tracking-tight">Active Assets</h1>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-white/40 text-sm font-medium animate-pulse">Synchronizing portfolio...</p>
            </div>
          ) : activePlans.length > 0 ? (
            activePlans.map((plan, idx) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <TrendingUp size={120} />
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Live Asset</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1">{plan.name} Plan</h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Principal: {plan.price} PKR</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Zap size={14} className="text-indigo-400" />
                    <span className="text-xs font-bold tracking-tight">{plan.returns_received}/{plan.duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Yield</p>
                    <p className="text-xl font-bold">{plan.daily_return} <span className="text-xs text-white/20">PKR</span></p>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Total Accrued</p>
                    <p className="text-xl font-bold text-emerald-400">{(plan.returns_received || 0) * plan.daily_return} <span className="text-xs opacity-40">PKR</span></p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Next Payout</p>
                        <p className="font-mono text-xl font-bold tracking-wider text-indigo-100">
                          {canClaim(plan.last_return_date) ? "00:00:00" : formatTimeLeft(plan.last_return_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(plan)}
                    disabled={!canClaim(plan.last_return_date) || claiming === plan.id}
                    className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 active:scale-95 ${
                      canClaim(plan.last_return_date) 
                        ? 'bg-white text-black hover:bg-white/90' 
                        : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {claiming === plan.id ? (
                      <div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Zap size={20} />
                        {canClaim(plan.last_return_date) ? "Claim Daily Profit" : "Awaiting Cycle"}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-12 text-center relative overflow-hidden"
            >
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <TrendingUp className="text-white/20" size={48} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">No Active Assets</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-[280px] mx-auto">
                Your portfolio is currently empty. Start your investment journey to generate daily returns.
              </p>
              <button 
                onClick={() => navigate('/app/plans')}
                className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-white/90 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Explore Plans <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
