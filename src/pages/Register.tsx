import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, User, Mail, Lock, Gift, CheckCircle2 } from "lucide-react";
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
          
          // Create user document (using upsert to avoid conflict with trigger)
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
            // If RLS fails here, it's likely because Email Confirmations are enabled in Supabase
            throw new Error(`Profile creation failed: ${dbError.message}. (If you just set up Supabase, please go to Authentication -> Providers -> Email and turn OFF "Confirm email")`);
          }

          // Update referrer if referral code exists
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans py-12 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden relative transition-colors duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
          <Link
            to="/"
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Email Address"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Gift className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Referral Code (Optional)"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group mt-2">
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
                I agree to the{" "}
                <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Terms and Conditions
                </Link>
              </span>
            </label>

            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800/50 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <div className="mt-6 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </motion.form>
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
                Registration Successful
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Your account has been created! Redirecting to login...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
