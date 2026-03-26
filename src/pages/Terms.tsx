import { motion } from 'motion/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Terms & Conditions</h1>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors duration-300">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
              <FileText size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Invest Pro Terms of Service</h2>
            
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-6">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
                <p className="leading-relaxed">
                  By accessing and using Invest Pro, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Investment Risks</h3>
                <p className="leading-relaxed">
                  All investments carry inherent risks. Past performance is not indicative of future results. You should only invest money that you can afford to lose.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Account Security</h3>
                <p className="leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials. Invest Pro will not be liable for any loss or damage arising from your failure to protect your account information.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Deposits and Withdrawals</h3>
                <p className="leading-relaxed">
                  All deposits and withdrawals are subject to review and approval by our administration team. Processing times may vary depending on the payment method chosen.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Referral Program</h3>
                <p className="leading-relaxed">
                  The referral program offers a 2% commission on the deposits made by users who sign up using your unique referral link. Abuse of the referral system may result in account suspension.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Modifications</h3>
                <p className="leading-relaxed">
                  Invest Pro reserves the right to modify these terms at any time. Continued use of the platform following any changes constitutes acceptance of the new terms.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
