import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, HelpCircle, Send, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../store/auth';

export default function FAQ() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      if (!isSupabaseConfigured) return;
      
      setFetching(true);
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('active', true)
          .order('order', { ascending: true });
          
        if (error) throw error;
        setFaqs(data || []);
      } catch (err: any) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !isSupabaseConfigured) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('faq_submissions').insert({
        user_id: user?.uid || null,
        question: question.trim(),
        status: 'pending',
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      setSuccess(true);
      setQuestion('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error submitting question:", err);
      alert("Failed to submit question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={24} />
            </button>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">FAQ</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-100 dark:shadow-none transition-colors duration-300">
            <HelpCircle size={40} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions about investing, withdrawals, and account management.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Loading FAQs...</p>
            </div>
          ) : faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-900 dark:text-white text-lg pr-8">{faq.question || faq.q}</span>
                  <ChevronDown 
                    className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} 
                    size={24} 
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
                        {faq.answer || faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">No FAQs available at the moment.</p>
            </div>
          )}
        </div>

        {/* Submit Question Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-3xl p-8 transition-colors duration-300"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Still have questions?</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Can't find the answer you're looking for? Send us your question directly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-slate-400" />
              </div>
              <textarea
                required
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="Type your question here..."
              ></textarea>
            </div>

            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl text-center font-medium">
                Question submitted successfully! We'll reply via email.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800/50 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? "Submitting..." : (
                <>
                  Submit Question <Send size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
