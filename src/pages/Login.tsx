import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Mail, Lock, CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Globe, Zap } from "lucide-react";
import { useAuth } from "../store/auth";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === 1 && email) {
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

          if (error) throw error;

          if (!data) {
            setError("Account not found. Please register first.");
            setLoading(false);
            return;
          }
        }
        setStep(2);
      } catch (err: any) {
        console.error("Error checking email:", err);
        setError("Error verifying account. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (step === 2 && password) {
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
        } else {
          login({ uid: "123", email, displayName: email.split("@")[0] });
        }
        setShowPopup(true);
        setTimeout(() => {
          navigate("/app");
        }, 1500);
      } catch (err: any) {
        if (err.message.includes("Invalid login credentials")) {
          setError("Account not found or invalid password. Please register first.");
        } else {
          setError(err.message || "Failed to login. Please check your credentials.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Immersive Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[150px]"></div>
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
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80">Investor Portal</span>
            </div>
          </div>

          <h1 className="text-7xl font-display font-black tracking-tighter leading-[0.9] mb-10">
            SECURE <br />
            <span className="text-white/30">INVESTMENT</span> <br />
            ACCESS.
          </h1>

          <p className="text-xl text-white/40 mb-12 max-w-md leading-relaxed font-medium">
            Enter your secure investment portal. Your dashboard awaits with real-time analytics and portfolio management.
          </p>

          <div className="grid grid-cols-2 gap-8">
            {[
              { icon: ShieldCheck, label: 'AES-256', desc: 'Military Grade' },
              { icon: Globe, label: 'Global', desc: 'Anywhere Access' },
              { icon: Zap, label: 'Instant', desc: 'Zero Latency' },
              { icon: CheckCircle2, label: 'Audited', desc: 'Tier-1 Security' }
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

        {/* Right Side: Login Form */}
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
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                {showForgot ? "Recovery" : step === 1 ? "Authentication" : "Security Check"}
              </h2>
              <div className="w-12"></div>
            </div>

            {/* Content */}
            <div className="p-12 min-h-[500px] flex flex-col relative z-10">
              <AnimatePresence mode="wait">
                {step === 1 && !showForgot && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleNext}
                    className="flex flex-col flex-1"
                  >
                    <div className="flex-1">
                      <div className="mb-12">
                        <h3 className="text-4xl font-display font-black text-white mb-4 tracking-tighter flex items-center gap-4">
                          Welcome <Sparkles className="text-indigo-400 w-8 h-8 animate-pulse" />
                        </h3>
                        <p className="text-sm text-white/40 font-medium leading-relaxed">
                          Access your investment dashboard with secure authentication.
                        </p>
                      </div>

                      <div className="space-y-8">
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" strokeWidth={2.5} />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                            placeholder="Email Address"
                          />
                        </div>
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
                      </div>
                    </div>

                    <div className="mt-16">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-4 py-6 px-10 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-3xl font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl shadow-white/5 hover:-translate-y-1.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {loading ? "Verifying..." : "Continue"} 
                        <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                      <div className="mt-10 text-center">
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                          New to the platform?{" "}
                          <Link
                            to="/register"
                            className="text-indigo-400 hover:text-white transition-colors ml-2"
                          >
                            Create Account
                          </Link>
                        </p>
                      </div>
                    </div>
                  </motion.form>
                )}

                {step === 2 && !showForgot && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleNext}
                    className="flex flex-col flex-1"
                  >
                    <div className="flex-1">
                      <div className="mb-12">
                        <h3 className="text-4xl font-display font-black text-white mb-4 tracking-tighter">
                          Security Check
                        </h3>
                        <p className="text-sm text-white/40 font-medium truncate">
                          Confirming identity for <span className="text-indigo-400">{email}</span>
                        </p>
                      </div>

                      <div className="space-y-8">
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" strokeWidth={2.5} />
                          </div>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                            placeholder="••••••••"
                          />
                        </div>
                        
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
                        
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors">
                              Accept <Link to="/terms" className="text-indigo-400 hover:underline">Terms</Link>
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setShowForgot(true)}
                            className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                          >
                            Recovery?
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-16 flex gap-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/30 hover:text-white rounded-3xl transition-all border border-white/10 active:scale-90"
                      >
                        <ArrowLeft size={24} strokeWidth={2.5} />
                      </button>
                      <button
                        type="submit"
                        disabled={!acceptedTerms || loading}
                        className="flex-1 flex items-center justify-center gap-4 py-6 px-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed text-white rounded-3xl font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl shadow-indigo-900/40 hover:-translate-y-1.5 active:scale-[0.98]"
                      >
                        {loading ? "Authenticating..." : "Sign In"}
                      </button>
                    </div>
                  </motion.form>
                )}

                {showForgot && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col flex-1 justify-center text-center"
                  >
                    <div className="w-24 h-24 bg-indigo-600/10 text-indigo-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-indigo-600/20 shadow-2xl shadow-indigo-900/20">
                      <Lock size={40} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-4xl font-display font-black text-white mb-6 tracking-tighter">
                      Account Recovery
                    </h3>
                    <p className="text-sm text-white/40 mb-12 leading-relaxed font-medium">
                      For account security, password resets are handled manually by our support team.
                    </p>

                    <div className="space-y-6 mb-12">
                      <a
                        href="https://wa.me/yournumber"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-3xl font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-green-900/20 hover:-translate-y-1.5"
                      >
                        WhatsApp Desk
                      </a>
                      <a
                        href="https://t.me/yourchannel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-6 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-3xl font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-900/20 hover:-translate-y-1.5"
                      >
                        Telegram Channel
                      </a>
                    </div>

                    <button
                      onClick={() => setShowForgot(false)}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
                    >
                      Back to Authentication
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
                ACCESS GRANTED
              </h3>
              <p className="text-sm text-white/40 mb-12 leading-relaxed font-medium">
                Authentication successful. Synchronizing your dashboard...
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
