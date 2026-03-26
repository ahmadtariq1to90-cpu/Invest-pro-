import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Upload, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { doc, setDoc, collection, serverTimestamp, updateDoc, increment, addDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

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
    if (!isFirebaseConfigured || !db || !user?.uid) {
      setError("System configuration error. Please try again later.");
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);
    
    try {
      let screenshotUrl = '';
      
      // 1. Upload image to ImgBB (Free Alternative)
      if (screenshot) {
        const formData = new FormData();
        formData.append('image', screenshot);
        
        // Using a public API key for demo, you should use your own from https://api.imgbb.com/
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
          throw new Error(uploadErr.message || "Failed to upload screenshot to free server. Please try again.");
        }
      }

      // 2. Save deposit request in Firestore
      const now = new Date();
      const txData = {
        type: 'deposit',
        amount: `+${amount}`,
        depositAmount: Number(amount),
        status: 'Pending',
        title: `Deposit via ${method.name}`,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        userName: user.displayName || 'User',
        userEmail: user.email || '',
        screenshotUrl: screenshotUrl,
        timestamp: serverTimestamp(),
        method: method.name,
      };

      try {
        await addDoc(collection(db, 'users', user.uid, 'transactions'), txData);

        // Save notification
        await addDoc(collection(db, 'users', user.uid, 'notifications'), {
          title: 'Deposit Request Submitted',
          message: `Your deposit request of ${amount} PKR via ${method.name} is pending approval.`,
          timestamp: serverTimestamp(),
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={() => step === 2 ? setStep(1) : navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Deposit Funds</h1>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-8"
            >
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              {/* Select Method */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Select Payment Method</h3>
                <div className="grid grid-cols-3 gap-3">
                  {METHODS.map((m) => (
                    <button
                      key={m.id}
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

              {/* Enter Amount */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Enter Amount (PKR)</h3>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setAmount(p.toString())}
                      className="py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">Min: 100 PKR | Max: 10,000 PKR</p>
              </div>

              <button
                onClick={handleNext}
                disabled={!amount || Number(amount) < 100 || Number(amount) > 10000}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800/50 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 mt-4"
              >
                Continue <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-3xl p-6 text-center transition-colors duration-300">
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-1">You are depositing</p>
                <h2 className="text-4xl font-extrabold text-indigo-900 dark:text-indigo-100 mb-4">{amount} <span className="text-xl text-indigo-700 dark:text-indigo-300">PKR</span></h2>
                <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-indigo-100 dark:border-slate-700 transition-colors duration-300">
                  <img src={method.logo} alt={method.name} className="h-5 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{method.name}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Payment Details</h3>
                
                <div className="space-y-4">
                  {method.id === 'bank' && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Bank Name</p>
                      <p className="font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">{(method as any).bankName}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Account Title</p>
                    <p className="font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">{method.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 font-mono font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 tracking-wider transition-colors duration-300">
                        {method.account}
                      </p>
                      <button
                        onClick={() => copyToClipboard(method.account)}
                        className="px-4 py-3 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl transition-colors"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Upload Proof</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Please transfer the exact amount and upload the screenshot of successful transaction.</p>
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl cursor-pointer transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 mb-2 transition-colors" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium">
                      {screenshot ? screenshot.name : 'Click to upload screenshot'}
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] || null)} />
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!screenshot || loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800/50 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Submitting..." : "Submit Deposit"}
              </button>
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
                Deposit Pending
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Thanks {user?.displayName || "User"}, your deposit is pending. When admin approves it, the balance will appear in your account. Please wait up to 24 hours.
              </p>
              
              {loading && uploadProgress > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    <span>Uploading Screenshot...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-indigo-600"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleConfirmAndSave}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-70"
              >
                {loading ? (uploadProgress > 0 ? "Uploading..." : "Processing...") : "OK"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
