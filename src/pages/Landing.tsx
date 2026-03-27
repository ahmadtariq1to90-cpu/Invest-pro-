import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, TrendingUp, Shield, Zap, ChevronUp, Facebook, Twitter, Instagram, Youtube, MessageCircle, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchPlans();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPlans = async () => {
    if (!isSupabaseConfigured) {
      setLoadingPlans(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Invest Pro</span>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-20 px-6 transition-colors duration-300"
          >
            <div className="flex flex-col gap-6 text-xl font-medium">
              <button onClick={() => scrollToSection('home')} className="text-left text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</button>
              <button onClick={() => scrollToSection('plans')} className="text-left text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Plans</button>
              <button onClick={() => scrollToSection('about')} className="text-left text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</button>
              <button onClick={() => scrollToSection('features')} className="text-left text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Feature</button>
              <button onClick={() => scrollToSection('connect')} className="text-left text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Connect</button>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 transition-colors duration-300"></div>
              <Link to="/login" className="text-left text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link>
              <Link to="/register" className="text-left text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Register</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Grow Your Wealth <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                With Invest Pro
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The smartest, most secure platform to invest your money and earn daily returns. Start your journey to financial freedom today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <button 
                onClick={() => scrollToSection('plans')}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                View Plans
              </button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-slate-900 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Why Choose Us?</h2>
              <p className="text-slate-600 dark:text-slate-400">Built for security, designed for growth.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: 'Secure & Safe', desc: 'Bank-grade security for your investments.' },
                { icon: Zap, title: 'Fast Withdrawals', desc: 'Get your money when you need it, instantly.' },
                { icon: TrendingUp, title: 'Daily Returns', desc: 'Watch your portfolio grow every single day.' }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="plans" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Investment Plans</h2>
              <p className="text-slate-600 dark:text-slate-400">Choose the plan that fits your goals.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {loadingPlans ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : plans.length > 0 ? (
                plans.map((plan, i) => (
                  <div key={i} className={`relative p-8 rounded-3xl border transition-colors duration-300 ${plan.popular ? 'bg-indigo-900 border-indigo-800 text-white shadow-2xl scale-105 z-10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'}`}>
                    {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-bold rounded-full">Most Popular</div>}
                    <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name} Plan</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className={plan.popular ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}>PKR</span>
                    </div>
                    <ul className={`space-y-4 mb-8 ${plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      <li className="flex justify-between"><span>Daily Return:</span> <span className="font-semibold">{plan.daily_return} PKR</span></li>
                      <li className="flex justify-between"><span>Total Return:</span> <span className="font-semibold">{plan.total_return} PKR</span></li>
                      <li className="flex justify-between"><span>Duration:</span> <span className="font-semibold">{plan.duration} Days</span></li>
                    </ul>
                    <Link to="/register" className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${plan.popular ? 'bg-white text-indigo-900 hover:bg-slate-100' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/50'}`}>
                      Start Investing
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-slate-500">No plans available at the moment.</div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="connect" className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Invest Pro</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8">
              Your trusted partner in digital investments. Secure, fast, and reliable.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com/investpro" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/investpro" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" title="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/investpro" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/investpro" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://t.me/investpro" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" title="Telegram">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('plans')} className="hover:text-white transition-colors">Plans</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Help & Support</h4>
              <ul className="space-y-3">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Invest Pro. All rights reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
