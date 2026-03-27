import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, Wallet, Shield, Zap, Info, ArrowRight, CreditCard, Building, TrendingDown, ShieldCheck, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const METHODS = [
  { id: 'jazzcash', name: 'JazzCash', logo: 'https://i.ibb.co/39p1XHHh/images-2-fotor-bg-remover-2026022715323.png' },
  { id: 'easypaisa', name: 'EasyPaisa', logo: 'https://i.ibb.co/YKZV0xm/images-fotor-bg-remover-2026022715449.png' },
  { id: 'bank', name: 'Bank Transfer', logo: 'https://i.ibb.co/S94BqQd/images-1-fotor-bg-remover-2026022715540.png' },
];

export default function Withdraw() {
  const [method, setMethod] = useState(METHODS[0]);
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBalance = async () => {
      if (isSupabaseConfigured && user?.uid) {
        const { data } = await supabase.from('users').select('balance').eq('id', user.uid).single();
        if (data) setBalance(data.balance || 0);
      }
    };
    fetchBalance();
  }, [user]);

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setError('');
    const numAmount = Number(amount);
    
    if (numAmount < 100) {
      setError('Minimum withdraw amount is 100 PKR.');
      return;
    }
    
    if (numAmount > balance) {
      setError('Insufficient withdraw balance.');
      return;
    }

    if ((method.id === 'jazzcash' || method.id === 'easypaisa') && !/^03\d{9}$/.test(accountNumber)) {
      setError('Please enter a valid JazzCash or Easypaisa number starting with 03.');
      return;
    }

    if (method.id === 'bank' && !bankName) {
      setError('Please enter your bank name.');
      return;
    }

    setShowPopup(true);
  };

  const handleConfirmAndSave = async () => {
    if (!isSupabaseConfigured || !user?.uid) {
      setError("System configuration error. Please try again later.");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', user.uid).single();
      if (userError || !userData) throw new Error("User account not found. Please contact support.");

      const currentBalance = userData.withdraw_balance || 0;
      const numAmount = Number(amount);

      if (currentBalance < numAmount) {
        setError(`Insufficient withdraw balance! You have ${currentBalance} PKR but trying to withdraw ${numAmount} PKR.`);
        setLoading(false);
        setShowPopup(false);
        return;
      }

      const now = new Date();
      const txData = {
        user_id: user.uid,
        type: 'withdraw',
        amount: `-${amount}`,
        withdraw_amount: numAmount,
        status: 'Pending',
        title: `Withdraw via ${method.name}`,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        user_name: user.displayName || 'User',
        user_email: user.email || '',
        phone_number: accountNumber,
        method: method.name,
        bank_name: method.id === 'bank' ? bankName : '',
        account_name: accountName,
        account_number: accountNumber,
      };

      const newWithdrawBalance = currentBalance - numAmount;
      const newTotalBalance = (userData.balance || 0) - numAmount;
      const { error: updateError } = await supabase.from('users').update({
        withdraw_balance: newWithdrawBalance,
        balance: newTotalBalance
      }).eq('id', user.uid);

      if (updateError) throw updateError;

      const { error: txError } = await supabase.from('transactions').insert(txData);
      if (txError) throw txError;

      await supabase.from('notifications').insert({
        user_id: user.uid,
        title: 'Withdraw Request Submitted',
        message: `Your withdraw request of ${amount} PKR via ${method.name} is pending approval.`,
        read: false,
      });

      setShowPopup(false);
      navigate('/app');
    } catch (err: any) {
      console.error("Error submitting withdraw:", err);
      setError(err.message || "Failed to submit withdraw. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-3xl px-8 py-8 flex items-center justify-between sticky top-0 z-40 border-b border-white/5">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/app')} 
            className="w-12 h-12 flex items-center justify-center text-white/30 hover:text-white transition-all rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-90"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-2xl font-display font-black tracking-tighter text-white uppercase">Withdraw Protocol</h1>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Institutional Liquidity Extraction</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">AES-256 SECURED</span>
          </div>
        </div>
      </div>

      <div className="p-8 relative z-10 max-w-5xl mx-auto mt-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Side: Balance & Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[4rem] p-12 relative overflow-hidden shadow-2xl shadow-indigo-900/40 group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Wallet size={120} strokeWidth={1} />
              </div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Withdrawable Balance</p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-7xl font-display font-black text-white tracking-tighter">{balance.toLocaleString()}</h2>
                <span className="text-xl font-medium text-white/40 uppercase tracking-widest">PKR</span>
              </div>
              
              <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] bg-black/20 w-max px-6 py-3 rounded-full border border-white/5 backdrop-blur-xl">
                <ShieldCheck size={14} className="text-indigo-400" /> Secure Protocol Active
              </div>
            </motion.div>

            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
              <h3 className="text-[10px] font-black text-white/30 mb-8 uppercase tracking-[0.3em]">Protocol Guidelines</h3>
              <div className="space-y-6">
                {[
                  { icon: Zap, label: 'Fast Processing', desc: 'Requests cleared in 2-6 hours' },
                  { icon: Globe, label: 'Global Reach', desc: 'Withdraw to any local bank' },
                  { icon: ShieldCheck, label: 'Verified Security', desc: 'Multi-factor authentication' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 transition-all duration-500">
                      <item.icon className="text-indigo-400 group-hover:text-white" size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-tight">{item.label}</p>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-xs font-black uppercase tracking-widest flex items-center gap-4 backdrop-blur-3xl"
                >
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Method Selection */}
              <section className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-3xl">
                <h3 className="text-[10px] font-black text-white/30 mb-10 uppercase tracking-[0.3em]">Extraction Gateway</h3>
                <div className="grid grid-cols-3 gap-6">
                  {METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`relative p-8 rounded-[2.5rem] border transition-all duration-700 flex flex-col items-center gap-6 group overflow-hidden ${
                        method.id === m.id 
                          ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_60px_rgba(79,70,229,0.15)]' 
                          : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 relative z-10">
                        <img src={m.logo} alt={m.name} className="max-h-full max-w-full object-contain filter drop-shadow-2xl" referrerPolicy="no-referrer" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] relative z-10 ${method.id === m.id ? 'text-indigo-400' : 'text-white/30'}`}>{m.name}</span>
                      
                      {method.id === m.id && (
                        <motion.div 
                          layoutId="activeMethodGlow"
                          className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Inputs */}
              <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 backdrop-blur-3xl space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Extraction Amount (PKR)</label>
                  <div className="relative group">
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Min 100 PKR"
                      className="w-full pl-10 pr-10 py-8 bg-white/5 border border-white/10 rounded-[2rem] text-3xl font-display font-black text-white focus:outline-none focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/10 transition-all placeholder:text-white/5 tracking-tighter"
                    />
                    <Zap className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-colors" size={24} />
                  </div>
                </div>

                {method.id === 'bank' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Bank Institution</label>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. Meezan Bank"
                        className="w-full pl-10 pr-10 py-8 bg-white/5 border border-white/10 rounded-[2rem] text-xl font-black text-white focus:outline-none focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/10 transition-all placeholder:text-white/5 tracking-tight"
                      />
                      <Building className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-colors" size={24} />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Beneficiary Title</label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-10 pr-10 py-8 bg-white/5 border border-white/10 rounded-[2rem] text-xl font-black text-white focus:outline-none focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/10 transition-all placeholder:text-white/5 tracking-tight"
                    />
                    <CreditCard className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-colors" size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Account Identifier</label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="03XXXXXXXXX"
                      className="w-full pl-10 pr-10 py-8 bg-white/5 border border-white/10 rounded-[2rem] text-2xl font-display font-black text-white focus:outline-none focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/10 transition-all placeholder:text-white/5 tracking-widest"
                    />
                    <Info className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-colors" size={24} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!amount || (method.id === 'bank' && !bankName) || !accountName || !accountNumber || loading}
                className="w-full py-8 bg-white text-black hover:bg-indigo-600 hover:text-white disabled:bg-white/5 disabled:text-white/10 rounded-[2.5rem] font-black text-lg uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>Initiate Extraction <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-[#050505]/95 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-white/5 border border-white/10 rounded-[4rem] p-16 w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 animate-gradient bg-[length:200%_auto]"></div>
              
              <div className="w-32 h-32 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 text-emerald-400 border border-emerald-500/20 shadow-2xl shadow-emerald-900/20">
                <CheckCircle2 size={64} strokeWidth={3} />
              </div>
              
              <h3 className="text-4xl font-display font-black text-white mb-6 tracking-tighter">
                EXTRACTION QUEUED
              </h3>
              <p className="text-lg text-white/40 mb-12 leading-relaxed font-medium">
                Your withdrawal of <span className="text-white font-black">{Number(amount).toLocaleString()} PKR</span> has been successfully queued. Protocol clearance usually takes 2-6 hours.
              </p>
              
              <button
                onClick={handleConfirmAndSave}
                disabled={loading}
                className="w-full py-8 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 disabled:opacity-50 active:scale-95"
              >
                {loading ? "PROCESSING..." : "CONFIRM & RETURN"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
