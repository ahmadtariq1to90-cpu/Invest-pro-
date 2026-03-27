import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Mail, Lock, CheckCircle2 } from "lucide-react";
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
          // Check if user exists in the database
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden relative transition-colors duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
          <Link
            to="/"
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-8 relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && !showForgot && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                className="flex flex-col h-full justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Enter your email
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Sign in to access your investment dashboard.
                  </p>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
                  )}
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5"
                  >
                    Next <ArrowRight size={20} />
                  </button>
                  <div className="mt-6 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Register
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.form>
            )}

            {step === 2 && !showForgot && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                className="flex flex-col h-full justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Enter password
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Welcome back, {email}</p>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
                  )}
                  
                  <label className="flex items-start gap-3 cursor-pointer group mt-6">
                    <div className="relative flex items-center justify-center mt-1">
                      <input
                        type="checkbox"
                        required
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors group-hover:border-indigo-400"></div>
                      <CheckCircle2 className="absolute text-white w-4 h-4 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                      I have read and agree to the <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms and Conditions</Link>
                    </span>
                  </label>

                  <div className="mt-4 text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    type="submit"
                    disabled={!acceptedTerms || loading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5"
                  >
                    {loading ? "Logging in..." : "Login"}
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
                className="flex flex-col h-full justify-center text-center"
              >
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Forgot Password?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  If you forgot your password, please contact admin to reset it
                  securely.
                </p>

                <div className="flex flex-col gap-4 mb-8">
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-200 dark:shadow-none flex items-center justify-center gap-2"
                  >
                    Contact via WhatsApp
                  </a>
                  <a
                    href="https://t.me/investpro_admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2"
                  >
                    Contact via Telegram
                  </a>
                </div>

                <button
                  onClick={() => setShowForgot(false)}
                  className="text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden transition-colors duration-300 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Login Successful
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Welcome back! Redirecting to your dashboard...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
