import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, User, Mail, Lock, Gift, CheckCircle2, ShieldCheck, Sparkles, UserPlus, TrendingUp, Globe, Zap } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function Register() {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: refCode,
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept terms and conditions");
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              displayName: formData.fullName,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          const myReferralCode = "INV" + Math.floor(10000 + Math.random() * 90000);
          
          const { error: dbError } = await supabase.from('users').upsert({
            id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            referred_by: formData.referralCode,
            referral_code: myReferralCode,
            balance: 0,
            deposit_balance: 0,
            withdraw_balance: 0,
            active_plans_count: 0,
            total_investment: 0,
            total_deposit: 0,
            total_withdraw: 0,
            referral_earnings: 0,
            total_referrals: 0,
            role: "client",
          });

          if (dbError) {
            console.error("Error creating user profile:", dbError);
            throw new Error(`Profile creation failed: ${dbError.message}. (If you just set up Supabase, please go to Authentication -> Providers -> Email and turn OFF "Confirm email")`);
          }

          if (formData.referralCode) {
            const { data: referrers } = await supabase
              .from('users')
              .select('id, total_referrals')
              .eq('referral_code', formData.referralCode)
              .limit(1);

            if (referrers && referrers.length > 0) {
              const referrer = referrers[0];
              await supabase
                .from('users')
                .update({ total_referrals: (referrer.total_referrals || 0) + 1 })
                .eq('id', referrer.id);
            }
          }
        }
      }
      setShowPopup(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      if (err.message.includes("already registered")) {
        setError("Email already registered, please login.");
      } else {
        setError(err.message || "Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-indigo-500/30 selection:text-white py-20">
      {/* Immersive Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Side: Branding & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/40">
              <TrendingUp className="text-white w-8 h-8" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-3xl tracking-tighter leading-none">INVEST PRO</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80">Investor Network</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.9] mb-10">
            JOIN THE <br />
            <span className="text-white/30">INVESTMENT</span> <br />
            NETWORK.
          </h1>

          <p className="text-xl text-white/40 mb-12 max-w-md leading-relaxed font-medium">
            Become part of the world's most advanced investment network. Secure your financial future with professional tools.
          </p>

          <div className="grid grid-cols-2 gap-8">
            {[
              { icon: ShieldCheck, label: 'Secured', desc: 'Tier-1 Vaults' },
              { icon: Globe, label: 'Global', desc: '120+ Countries' },
              { icon: Zap, label: 'Yield', desc: 'Up to 12% Daily' },
              { icon: CheckCircle2, label: 'Verified', desc: 'Audited Smart Contracts' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <item.icon className="text-indigo-400" size={20} />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight">{item.label}</p>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Register Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            {/* Header */}
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between relative z-10">
              <Link
                to="/"
                className="w-12 h-12 flex items-center justify-center text-white/30 hover:text-white transition-all rounded-2xl hover:bg-white/5 active:scale-90 border border-white/5"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </Link>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Create Your Account</h2>
              <div className="w-12"></div>
            </div>

            {/* Content */}
            <div className="p-12 relative z-10">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
              >
                <div className="mb-4">
                  <h3 className="text-4xl font-display font-black text-white mb-4 tracking-tighter flex items-center gap-4">
                    Get Started <UserPlus className="text-indigo-400 w-8 h-8 animate-pulse" />
                  </h3>
                  <p className="text-sm text-white/40 font-medium leading-relaxed">
                    Join 50,000+ investors and start growing your wealth today.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" strokeWidth={2.5} />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" strokeWidth={2.5} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                      placeholder="Email Address"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" strokeWidth={2.5} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                        placeholder="Password"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" strokeWidth={2.5} />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Gift className="h-5 w-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" strokeWidth={2.5} />
                    </div>
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      className="block w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                      placeholder="Referral Code (Optional)"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group mt-2">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-6 h-6 border-2 border-white/10 rounded-lg peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all group-hover:border-indigo-500/50"></div>
                    <CheckCircle2 className="absolute text-white w-4 h-4 opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-indigo-400 hover:underline">
                      Terms and Conditions
                    </Link>
                  </span>
                </label>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest">
                      {error}
                    </p>
                  </motion.div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-4 py-6 px-10 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-3xl font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl shadow-white/5 hover:-translate-y-1.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                  <div className="mt-10 text-center">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-indigo-400 hover:text-white transition-colors ml-2"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-white/5 border border-white/10 rounded-[4rem] p-16 w-full max-w-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 animate-gradient bg-[length:200%_auto]"></div>
              <div className="w-28 h-28 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-emerald-400 border border-emerald-500/20 shadow-2xl shadow-emerald-900/20">
                <CheckCircle2 size={56} strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-display font-black text-white mb-4 tracking-tighter">
                WELCOME!
              </h3>
              <p className="text-sm text-white/40 mb-12 leading-relaxed font-medium">
                Your account has been successfully created. Redirecting to login...
              </p>
              <div className="flex justify-center">
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
