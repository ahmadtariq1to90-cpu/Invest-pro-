import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Upload, CheckCircle2, ChevronRight, X, ShieldCheck, Zap, Globe, TrendingUp, Copy, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const METHODS = [
  { id: 'jazzcash', name: 'JazzCash', logo: 'https://i.ibb.co/39p1XHHh/images-2-fotor-bg-remover-2026022715323.png', account: '03001234567', title: 'Muhammad Ali' },
  { id: 'easypaisa', name: 'EasyPaisa', logo: 'https://i.ibb.co/YKZV0xm/images-fotor-bg-remover-2026022715449.png', account: '03451234567', title: 'Ahmed Khan' },
  { id: 'bank', name: 'Bank Transfer', logo: 'https://i.ibb.co/S94BqQd/images-1-fotor-bg-remover-2026022715540.png', account: 'PK12MEZN000123456789', title: 'Invest Pro LLC', bankName: 'Meezan Bank' },
];

const PRESETS = [100, 250, 500, 1000, 5000, 10000];

export default function Deposit() {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(METHODS[0]);
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = () => {
    setError('');
    const numAmount = Number(amount);
    if (numAmount < 100 || numAmount > 10000) {
      setError('Amount must be between 100 and 10,000 PKR');
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    setError('');
    if (!screenshot) {
      setError('Please upload payment screenshot');
      return;
    }
    if (screenshot.size > 5 * 1024 * 1024) {
      setError('Screenshot size must be less than 5MB');
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
    setUploadProgress(0);
    
    try {
      let screenshotUrl = '';
      
      if (screenshot) {
        const formData = new FormData();
        formData.append('image', screenshot);
        const IMGBB_API_KEY = 'a0bef818769b760c618850ac0bfdcb9b'; 
        
        try {
          const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
          });
          
          const data = await response.json();
          
          if (data.success) {
            screenshotUrl = data.data.url;
            setUploadProgress(100);
          } else {
            throw new Error(data.error?.message || "ImgBB upload failed");
          }
        } catch (uploadErr: any) {
          console.error("ImgBB Upload error:", uploadErr);
          throw new Error(`Upload failed: ${uploadErr.message || "Network error"}. Please check your connection or try a smaller image.`);
        }
      }

      const now = new Date();
      const txData = {
        user_id: user.uid,
        type: 'deposit',
        amount: `+${amount}`,
        deposit_amount: Number(amount),
        status: 'Pending',
        title: `Deposit via ${method.name}`,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        user_name: user.displayName || 'User',
        user_email: user.email || '',
        screenshot_url: screenshotUrl,
        method: method.name,
      };

      try {
        const { error: txError } = await supabase.from('transactions').insert(txData);
        if (txError) throw txError;

        await supabase.from('notifications').insert({
          user_id: user.uid,
          title: 'Deposit Request Submitted',
          message: `Your deposit request of ${amount} PKR via ${method.name} is pending approval.`,
          read: false,
        });
      } catch (dbErr: any) {
        console.error("Database error:", dbErr);
        throw new Error("Failed to save transaction. Please try again.");
      }

      setShowPopup(false);
      navigate('/app');
    } catch (err: any) {
      console.error("Error submitting deposit:", err);
      setError(err.message || "Failed to submit deposit. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-3xl px-8 py-8 flex items-center justify-between sticky top-0 z-40 border-b border-white/5">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => step === 2 ? setStep(1) : navigate('/app')} 
            className="w-12 h-12 flex items-center justify-center text-white/30 hover:text-white transition-all rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-90"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-black tracking-tighter text-white">DEPOSIT</h1>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Add money to your account</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">SECURE PAYMENT</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 relative z-10 max-w-4xl mx-auto mt-8 md:mt-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-5 gap-8 md:gap-12"
            >
              {/* Left Side: Instructions & Info */}
              <div className="lg:col-span-2 space-y-6 md:space-y-10">
                <div>
                  <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter leading-[0.9] mb-6">
                    ADD <br />
                    <span className="text-white/30">MONEY</span> <br />
                    NOW.
                  </h2>
                  <p className="text-white/40 font-medium leading-relaxed">
                    Deposit money into your account to start earning daily profits.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Zap, label: 'Instant', desc: 'Real-time verification' },
                    { icon: Globe, label: 'Global', desc: 'Multi-currency support' },
                    { icon: TrendingUp, label: 'Yield', desc: 'Immediate accrual' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500">
                        <item.icon className="text-indigo-400 group-hover:text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight">{item.label}</p>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="lg:col-span-3 space-y-8">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-xs font-black uppercase tracking-widest flex items-center gap-4 backdrop-blur-3xl"
                  >
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                    {error}
                  </motion.div>
                )}
                
                {/* Select Method */}
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 backdrop-blur-3xl relative overflow-hidden">
                  <div className="flex justify-between items-center mb-8 md:mb-10">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Select Payment Method</h3>
                    <div className="h-px w-20 bg-white/10"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {METHODS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m)}
                        className={`relative p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border transition-all duration-700 flex flex-col items-center gap-4 md:gap-6 group overflow-hidden ${
                          method.id === m.id 
                            ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_60px_rgba(79,70,229,0.15)]' 
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 relative z-10">
                          <img src={m.logo} alt={m.name} className="max-h-full max-w-full object-contain filter drop-shadow-2xl" referrerPolicy="no-referrer" />
                        </div>
                        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] relative z-10 ${method.id === m.id ? 'text-indigo-400' : 'text-white/30'}`}>{m.name}</span>
                        
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

                {/* Enter Amount */}
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 backdrop-blur-3xl relative overflow-hidden">
                  <h3 className="text-[10px] font-black text-white/30 mb-8 md:mb-10 uppercase tracking-[0.3em]">Enter Amount</h3>
                  <div className="relative mb-8 md:mb-10 group">
                    <span className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-white/20 font-display font-black text-xl md:text-3xl group-focus-within:text-indigo-500 transition-colors">Rs.</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-16 md:pl-24 pr-6 md:pr-10 py-6 md:py-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-[2.5rem] text-3xl md:text-5xl font-display font-black text-white focus:outline-none focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/10 transition-all placeholder:text-white/5 tracking-tighter"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setAmount(p.toString())}
                        className="py-3 md:py-5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black text-white/40 hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 uppercase tracking-[0.2em]"
                      >
                        {p.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-10 pt-8 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Min Threshold</p>
                      <p className="text-xs font-black text-white/60">100 PKR</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Max Threshold</p>
                      <p className="text-xs font-black text-white/60">10,000 PKR</p>
                    </div>
                  </div>
                </section>

                <button
                  onClick={handleNext}
                  disabled={!amount || Number(amount) < 100 || Number(amount) > 10000}
                  className="w-full py-6 md:py-8 bg-white text-black hover:bg-indigo-600 hover:text-white disabled:bg-white/5 disabled:text-white/10 rounded-2xl md:rounded-[2.5rem] font-black text-base md:text-lg uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all shadow-2xl shadow-white/5 hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4 group"
                >
                  Next <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-5 gap-12"
            >
              {/* Left Side: Summary */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-indigo-900/40">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Deposit Amount</p>
                  <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-8 md:mb-10 tracking-tighter">
                    {Number(amount).toLocaleString()} <span className="text-lg md:text-xl font-medium opacity-40 uppercase tracking-widest">PKR</span>
                  </h2>
                  
                  <div className="inline-flex items-center gap-4 md:gap-6 bg-black/20 backdrop-blur-3xl px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2.5rem] border border-white/10">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl md:rounded-2xl p-1.5 md:p-2 flex items-center justify-center">
                      <img src={method.logo} alt={method.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{method.name}</span>
                  </div>
                </div>
 
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 backdrop-blur-3xl">
                  <h3 className="text-[10px] font-black text-white/30 mb-6 md:mb-8 uppercase tracking-[0.3em]">How to Pay</h3>
                  <ul className="space-y-4 md:space-y-6">
                    {[
                      'Transfer the exact amount specified above.',
                      'Use the account details provided on the right.',
                      'Capture a clear screenshot of the success screen.',
                      'Upload the screenshot to verify the deposit.'
                    ].map((text, i) => (
                      <li key={i} className="flex gap-4 text-sm text-white/50 font-medium leading-relaxed">
                        <span className="text-indigo-400 font-black">0{i+1}.</span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Side: Details & Upload */}
              <div className="lg:col-span-3 space-y-8">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-xs font-black uppercase tracking-widest flex items-center gap-4 backdrop-blur-3xl"
                  >
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                    {error}
                  </motion.div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 backdrop-blur-3xl">
                  <h3 className="text-[10px] font-black text-white/30 mb-8 md:mb-10 uppercase tracking-[0.3em]">Payment Details</h3>
                  
                  <div className="space-y-8 md:space-y-10">
                    {method.id === 'bank' && (
                      <div className="group">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 md:mb-4 ml-4">Bank Name</p>
                        <div className="bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/10 group-hover:bg-white/10 transition-all">
                          <p className="text-lg md:text-xl font-black text-white tracking-tight">{(method as any).bankName}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="group">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 md:mb-4 ml-4">Account Holder Name</p>
                      <div className="bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/10 group-hover:bg-white/10 transition-all">
                        <p className="text-lg md:text-xl font-black text-white tracking-tight">{method.title}</p>
                      </div>
                    </div>
                    
                    <div className="group">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 md:mb-4 ml-4">Account Number</p>
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        <div className="flex-1 bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/10 group-hover:bg-white/10 transition-all">
                          <p className="text-xl md:text-2xl font-display font-black text-white tracking-widest break-all">{method.account}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(method.account)}
                          className="h-16 md:w-20 md:h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl md:rounded-[2rem] flex items-center justify-center transition-all active:scale-90 shadow-2xl shadow-indigo-900/40 group/btn"
                        >
                          {copied ? <CheckCircle2 size={24} /> : <Copy size={24} className="group-hover/btn:scale-110 transition-transform" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
 
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 backdrop-blur-3xl">
                  <div className="flex items-center gap-4 mb-8 md:mb-10">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Upload size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Upload Proof</h3>
                  </div>
                  
                  <label className="flex flex-col items-center justify-center w-full h-64 md:h-72 border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/5 rounded-[2rem] md:rounded-[3rem] cursor-pointer transition-all group relative overflow-hidden">
                    {screenshot ? (
                      <div className="flex flex-col items-center justify-center p-6 md:p-10 text-center">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-4 md:mb-6 text-emerald-400 border border-emerald-500/20 shadow-2xl shadow-emerald-900/20">
                          <CheckCircle2 size={32} md:size={48} strokeWidth={3} />
                        </div>
                        <p className="text-base md:text-lg font-black text-white truncate max-w-[250px] md:max-w-[300px] tracking-tight">
                          {screenshot.name}
                        </p>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-4">Click to re-upload</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 md:p-10 text-center">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-8 text-white/10 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all duration-700 border border-white/5 group-hover:border-indigo-500/20">
                          <Upload size={32} md:size={48} strokeWidth={2.5} />
                        </div>
                        <p className="text-base md:text-lg font-black text-white/60 uppercase tracking-[0.2em]">
                          Upload Receipt
                        </p>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-4">Max Size: 5MB</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] || null)} />
                  </label>
                </div>
 
                <button
                  onClick={handleSubmit}
                  disabled={!screenshot || loading}
                  className="w-full py-6 md:py-8 bg-white text-black hover:bg-indigo-600 hover:text-white disabled:bg-white/5 disabled:text-white/10 rounded-2xl md:rounded-[2.5rem] font-black text-base md:text-lg uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>Submit Deposit <CheckCircle2 size={20} /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              
              <h3 className="text-3xl md:text-4xl font-display font-black text-white mb-6 tracking-tighter">
                DEPOSIT SUBMITTED
              </h3>
              <p className="text-base md:text-lg text-white/40 mb-10 md:mb-12 leading-relaxed font-medium">
                Your deposit of <span className="text-white font-black">{Number(amount).toLocaleString()} PKR</span> has been submitted. It will be verified within 2-6 hours.
              </p>
              
              {loading && uploadProgress > 0 && (
                <div className="mb-10 md:mb-12">
                  <div className="flex justify-between text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-10 p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-rose-400 text-xs font-black uppercase tracking-widest backdrop-blur-3xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleConfirmAndSave}
                disabled={loading}
                className="w-full py-6 md:py-8 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 disabled:opacity-50 active:scale-95"
              >
                {loading ? (uploadProgress > 0 ? "UPLOADING..." : "PROCESSING...") : "GO TO DASHBOARD"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
