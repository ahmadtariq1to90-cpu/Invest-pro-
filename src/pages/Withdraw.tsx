import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
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
        const { data } = await supabase
          .from('users')
          .select('balance')
          .eq('id', user.uid)
          .single();
          
        if (data) {
          setBalance(data.balance || 0);
        }
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
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.uid)
        .single();
        
      if (userError || !userData) {
        throw new Error("User account not found. Please contact support.");
      }

      const currentBalance = userData.withdraw_balance || 0;
      const numAmount = Number(amount);

      if (currentBalance < numAmount) {
        setError(`Insufficient withdraw balance! You have ${currentBalance} PKR but trying to withdraw ${numAmount} PKR.`);
        setLoading(false);
        setShowPopup(false);
        return;
      }

      // Save transaction request (Status: Pending)
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

      // 1. Deduct withdraw balance and total balance
      const newWithdrawBalance = currentBalance - numAmount;
      const newTotalBalance = (userData.balance || 0) - numAmount;
      const { error: updateError } = await supabase
        .from('users')
        .update({
          withdraw_balance: newWithdrawBalance,
          balance: newTotalBalance
        })
        .eq('id', user.uid);

      if (updateError) throw updateError;

      // 2. Save transaction
      const { error: txError } = await supabase.from('transactions').insert(txData);
      if (txError) throw txError;

      // 3. Save notification
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={() => navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Withdraw Funds</h1>
      </div>

      <div className="p-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
        >
          {/* Balance Info */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <p className="text-indigo-100 font-medium mb-1">Available Withdraw Balance</p>
            <h2 className="text-4xl font-extrabold mb-4">{balance.toLocaleString()} <span className="text-xl text-indigo-200">PKR</span></h2>
            <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-max">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Ready to withdraw
            </div>
          </div>

          {/* Select Method */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Select Withdrawal Method</h3>
            <div className="grid grid-cols-3 gap-3">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    method.id === m.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-md shadow-indigo-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500'
                  }`}
                >
                  {method.id === m.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-900">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                  <img src={m.logo} alt={m.name} className="h-8 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enter Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Withdrawal Details</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Amount (PKR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Min: 100 PKR | Max: 10,000 PKR</p>
              </div>

              {method.id === 'bank' && (
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Meezan Bank"
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Account Title</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Ali Raza"
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 03001234567"
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all tracking-wider"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!amount || (method.id === 'bank' && !bankName) || !accountName || !accountNumber || loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800/50 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </motion.form>
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
                Withdraw Pending
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Thanks {user?.displayName || "User"}, your withdraw request is pending. When admin approves it, the balance will appear in your account. Please wait up to 24 hours.
              </p>
              <button
                onClick={handleConfirmAndSave}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-70"
              >
                {loading ? "Processing..." : "OK"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
