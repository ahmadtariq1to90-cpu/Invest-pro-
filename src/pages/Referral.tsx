import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Share2, Users, TrendingUp, Gift, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export default function Referral() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  
  const referralCode = userData?.referralCode || 'INV-PRO-2026';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  useEffect(() => {
    const fetchUserDataAndReferrals = async () => {
      if (isFirebaseConfigured && db && user?.uid) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          
          if (data.referralCode) {
            const q = query(collection(db, 'users'), where('referredBy', '==', data.referralCode));
            const querySnapshot = await getDocs(q);
            const refs: any[] = [];
            querySnapshot.forEach((doc) => {
              refs.push({ id: doc.id, ...doc.data() });
            });
            setReferrals(refs);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={() => navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Refer & Earn</h1>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Hero Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
              <Gift size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2">Earn 2% Commission</h2>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-xs mx-auto">
              Invite your friends and earn 2% commission on every deposit they make.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-3 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Total Referrals</p>
                <p className="font-bold text-slate-900 dark:text-white text-xl">{userData?.totalReferrals || 0}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-3 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Total Earnings</p>
                <p className="font-bold text-slate-900 dark:text-white text-xl">{userData?.referralEarnings || 0} <span className="text-sm text-slate-500 dark:text-slate-400">PKR</span></p>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Your Referral Link</h3>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 truncate transition-colors duration-300">
                {referralLink}
              </div>
              <button
                onClick={() => handleCopy(referralLink)}
                className="w-12 h-12 flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 rounded-xl flex items-center justify-center transition-colors"
              >
                {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Share Via</h3>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleShare('WhatsApp')} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                <Share2 size={24} />
                <span className="text-xs font-bold">WhatsApp</span>
              </button>
              <button onClick={() => handleShare('Facebook')} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors">
                <Share2 size={24} />
                <span className="text-xs font-bold">Facebook</span>
              </button>
              <button onClick={() => handleShare('Telegram')} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors">
                <Share2 size={24} />
                <span className="text-xs font-bold">Telegram</span>
              </button>
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Recent Referrals</h3>
            <div className="space-y-4">
              {referrals.length > 0 ? referrals.map((ref, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold transition-colors duration-300">
                      {(ref.fullName || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{ref.fullName || 'User'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(ref.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${ref.totalInvestment > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    {ref.totalInvestment > 0 ? 'Active' : 'Inactive'}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No referrals yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
