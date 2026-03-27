import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Share2, Users, TrendingUp, Gift, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Referral() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  
  const referralCode = userData?.referral_code || 'INV-PRO-2026';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  useEffect(() => {
    const fetchUserDataAndReferrals = async () => {
      if (isSupabaseConfigured && user?.uid) {
        const { data, error } = await supabase.from('users').select('*').eq('id', user.uid).single();
        if (data && !error) {
          setUserData(data);
          
          if (data.referral_code) {
            const { data: refsData, error: refsError } = await supabase
              .from('users')
              .select('*')
              .eq('referred_by', data.referral_code);
              
            if (refsData && !refsError) {
              setReferrals(refsData);
            }
          }
        }
      }
    };
    fetchUserDataAndReferrals();
  }, [user]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Join Invest Pro using my referral code: ${referralCode}`;
    const url = encodeURIComponent(referralLink);
    
    if (platform === 'WhatsApp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + referralLink)}`, '_blank');
    } else if (platform === 'Facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'Telegram') {
      window.open(`https://t.me/share/url?url=${url}&text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl px-6 py-6 flex items-center gap-4 sticky top-0 z-40 border-b border-white/5">
        <button 
          onClick={() => navigate('/app')} 
          className="p-3 text-white/60 hover:text-white transition-all rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Refer & Earn</h1>
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Grow your network</p>
        </div>
      </div>

      <div className="p-6 relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Hero Card */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[3rem] p-12 text-white shadow-[0_30px_60px_rgba(79,70,229,0.3)] relative overflow-hidden text-center group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"
            ></motion.div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Gift size={48} className="text-white" strokeWidth={2} />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight relative z-10">Earn 2% Commission</h2>
            <p className="text-indigo-100/60 text-sm font-medium leading-relaxed max-w-xs mx-auto relative z-10">
              Invite your friends and earn 2% commission on every deposit they make.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl flex flex-col gap-6 transition-all duration-500 hover:bg-white/10 hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Users size={28} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Total Referrals</p>
                <p className="font-bold text-white text-4xl tracking-tighter">{userData?.total_referrals || 0}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl flex flex-col gap-6 transition-all duration-500 hover:bg-white/10 hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <TrendingUp size={28} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Total Earnings</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-white text-4xl tracking-tighter">{userData?.referral_earnings || 0}</p>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">PKR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-[11px] font-bold text-white/40 mb-8 uppercase tracking-[0.2em]">Your Referral Link</h3>
            
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-medium text-white/40 truncate">
                {referralLink}
              </div>
              <button
                onClick={() => handleCopy(referralLink)}
                className="w-16 h-16 flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
              >
                {copied ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <Copy size={24} strokeWidth={2} />}
              </button>
            </div>

            <h3 className="text-[11px] font-bold text-white/40 mb-8 uppercase tracking-[0.2em]">Quick Share</h3>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => handleShare('WhatsApp')} className="flex flex-col items-center gap-4 p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-95 group">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 size={32} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
              </button>
              <button onClick={() => handleShare('Facebook')} className="flex flex-col items-center gap-4 p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 text-blue-400 hover:bg-blue-500/10 transition-all active:scale-95 group">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 size={32} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Facebook</span>
              </button>
              <button onClick={() => handleShare('Telegram')} className="flex flex-col items-center gap-4 p-6 rounded-[2rem] bg-sky-500/5 border border-sky-500/10 text-sky-400 hover:bg-sky-500/10 transition-all active:scale-95 group">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 size={32} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Telegram</span>
              </button>
            </div>
          </section>

          {/* Referral List */}
          <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
            <h3 className="text-[11px] font-bold text-white/40 mb-10 uppercase tracking-[0.2em]">Recent Referrals</h3>
            <div className="space-y-8">
              {referrals.length > 0 ? referrals.map((ref, i) => (
                <div key={i} className="flex items-center justify-between pb-8 border-b border-white/5 last:border-0 last:pb-0 group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-xl group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                      {(ref.full_name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">{ref.full_name || 'User'}</p>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{new Date(ref.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${ref.total_investment > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/5 text-white/20 border-white/5'}`}>
                    {ref.total_investment > 0 ? 'Active' : 'Inactive'}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/10">
                    <Users size={40} strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-bold text-white/20 uppercase tracking-widest">No referrals yet.</p>
                </div>
              )}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );

}
