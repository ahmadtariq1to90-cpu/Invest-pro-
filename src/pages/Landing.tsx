import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, TrendingUp, Shield, Zap, ChevronUp, Facebook, Twitter, Instagram, Youtube, Send, Globe, Users, BarChart3, CheckCircle2, Play, ExternalLink, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Plans', id: 'plans' },
    { name: 'Features', id: 'features' },
    { name: 'Contact', id: 'connect' },
  ];

  const stats = [
    { label: 'Active Capital', value: '$42M+' },
    { label: 'Daily Profit', value: 'Up to 12%' },
    { label: 'Users', value: '10K+' },
    { label: 'Uptime', value: '99.9%' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-black/40 backdrop-blur-2xl py-4 border-b border-white/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={scrollToTop}>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/40 group-hover:rotate-[15deg] transition-all duration-500 group-hover:scale-110">
                <TrendingUp className="text-white w-7 h-7" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter leading-none">INVEST PRO</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400/80">Secure Investment</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-12">
              {navLinks.map((link) => (
                <button 
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 hover:text-white transition-all relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              <div className="flex items-center gap-8 ml-8 pl-8 border-l border-white/10">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-8 py-3.5 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all shadow-2xl shadow-white/5 hover:-translate-y-1 active:scale-95">
                  Open Account
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white/70 hover:text-white transition-all relative z-50 active:scale-90 border border-white/10"
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <motion.span 
                  animate={isMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full origin-center"
                ></motion.span>
                <motion.span 
                  animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  className="w-full h-0.5 bg-current rounded-full"
                ></motion.span>
                <motion.span 
                  animate={isMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full origin-center"
                ></motion.span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black pt-32 px-10 md:hidden"
          >
            <div className="flex flex-col gap-12">
              {navLinks.map((link, i) => (
                <motion.button 
                  key={link.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => scrollToSection(link.id)} 
                  className="text-5xl font-display font-black text-left text-white hover:text-indigo-500 transition-colors tracking-tighter"
                >
                  {link.name}
                </motion.button>
              ))}
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex flex-col gap-8">
                <Link to="/login" className="text-2xl font-black text-white/70 tracking-tight">Sign In</Link>
                <Link to="/register" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] text-center text-xl font-black shadow-2xl shadow-indigo-900/20 active:scale-95">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section - Split Layout */}
        <section id="home" className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-indigo-400 mb-8 md:mb-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Daily Returns Platform
              </div>
              
              <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-display font-black leading-[0.95] md:leading-[0.9] tracking-tighter mb-6 md:mb-10">
                INVEST & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-violet-400 bg-[length:200%_auto] animate-gradient text-nowrap">GROW.</span>
              </h1>
              
              <p className="text-base md:text-xl text-white/50 mb-8 md:mb-12 max-w-xl leading-relaxed font-medium">
                The easiest way to grow your money. Get daily returns on your investment with our secure and trusted platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto">
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-full font-black text-base md:text-lg transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-3 hover:-translate-y-1.5 active:scale-95"
                >
                  Start Now <ArrowRight size={20} md:size={24} strokeWidth={3} />
                </Link>
                <button 
                  onClick={() => scrollToSection('plans')}
                  className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-black text-base md:text-lg transition-all flex items-center justify-center gap-3 hover:-translate-y-1.5 active:scale-95"
                >
                  View Plans
                </button>
              </div>

              <div className="mt-12 md:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-10">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl md:text-3xl font-display font-black tracking-tighter">{stat.value}</p>
                    <p className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white/5 backdrop-blur-3xl p-2 rounded-[3rem] border border-white/10 shadow-2xl">
                <div className="bg-[#0a0a0a] rounded-[2.8rem] p-10 border border-white/5 overflow-hidden relative">
                  {/* Decorative Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                          <BarChart3 className="text-indigo-400" size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-lg tracking-tight">Daily Profits</h4>
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Live Investment Data</p>
                        </div>
                      </div>
                      <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                        Live Tracking
                      </div>
                    </div>
 
                    <div className="space-y-8">
                      {[
                        { label: 'Profit Projection', val: 88, color: 'from-indigo-500 to-violet-500' },
                        { label: 'Security Level', val: 94, color: 'from-blue-500 to-indigo-500' },
                        { label: 'Market Depth', val: 76, color: 'from-violet-500 to-purple-500' }
                      ].map((item, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.label}</span>
                            <span className="text-sm font-black text-white">{item.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.val}%` }}
                              transition={{ duration: 2, delay: 1 + i * 0.2, ease: "circOut" }}
                              className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 p-8 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <Play className="text-indigo-400 fill-indigo-400" size={16} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest">Platform Demo</span>
                      </div>
                      <ExternalLink size={18} className="text-white/30 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2.5rem] shadow-2xl z-20 flex flex-col items-center justify-center text-center w-40"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-3">
                  <Shield className="text-indigo-600" size={24} strokeWidth={2.5} />
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Security</p>
                <p className="text-xs font-black text-slate-900 tracking-tight leading-none">Tier-1 Vaults</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Section - Editorial Style */}
        <section id="about" className="py-24 md:py-40 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute -top-10 md:-top-20 -left-10 md:-left-20 w-48 md:w-64 h-48 md:h-64 bg-indigo-600/20 rounded-full blur-[80px] md:blur-[100px]"></div>
                <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4 md:space-y-6 pt-8 md:pt-12">
                    <div className="aspect-[4/5] bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 p-6 md:p-8 flex flex-col justify-end group hover:bg-white/10 transition-all">
                      <Users size={32} md:size={40} className="text-indigo-400 mb-4 md:mb-6" />
                      <h4 className="text-3xl md:text-4xl font-display font-black tracking-tighter">10K+</h4>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 mt-1 md:mt-2">Active Users</p>
                    </div>
                    <div className="aspect-square bg-indigo-600 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 flex flex-col justify-end shadow-2xl shadow-indigo-900/40">
                      <Globe size={32} md:size={40} className="text-white mb-4 md:mb-6" />
                      <h4 className="text-3xl md:text-4xl font-display font-black tracking-tighter text-white">120+</h4>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/70 mt-1 md:mt-2">Countries</p>
                    </div>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    <div className="aspect-square bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 p-6 md:p-8 flex flex-col justify-end group hover:bg-white/10 transition-all">
                      <Shield size={32} md:size={40} className="text-indigo-400 mb-4 md:mb-6" />
                      <h4 className="text-3xl md:text-4xl font-display font-black tracking-tighter">100%</h4>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 mt-1 md:mt-2">Secure</p>
                    </div>
                    <div className="aspect-[4/5] bg-violet-600 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 flex flex-col justify-end shadow-2xl shadow-violet-900/40">
                      <Zap size={32} md:size={40} className="text-white mb-4 md:mb-6" />
                      <h4 className="text-3xl md:text-4xl font-display font-black tracking-tighter text-white">24/7</h4>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/70 mt-1 md:mt-2">Support</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 md:mb-8">About Us</h2>
                <h3 className="text-3xl md:text-7xl font-display font-black mb-6 md:mb-10 leading-[1] md:leading-[0.9] tracking-tighter">
                  YOUR MONEY, <br />
                  <span className="text-white/30">SECURED.</span>
                </h3>
                <p className="text-base md:text-xl text-white/50 mb-6 md:mb-10 leading-relaxed font-medium">
                  Invest Pro is a secure investment platform built for everyone. We use advanced technology to provide consistent daily returns on your investments, ensuring your money works for you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
                  {[
                    { title: 'Daily Returns', desc: 'Consistent profit generation.' },
                    { title: 'Secure Platform', desc: 'Advanced security systems.' },
                    { title: 'Safe Storage', desc: 'Your funds are always protected.' },
                    { title: 'Easy Access', desc: 'Withdraw your profits anytime.' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1 md:space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-indigo-400" />
                        <span className="text-sm font-black tracking-tight">{item.title}</span>
                      </div>
                      <p className="text-[10px] md:text-[11px] text-white/30 leading-tight">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="group flex items-center gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-indigo-400 transition-colors"
                >
                  Learn More <ArrowRight size={18} md:size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Hardware Style */}
        <section id="features" className="py-20 md:py-40 px-6 sm:px-8 lg:px-12 bg-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-6 md:gap-10">
              <div className="max-w-2xl">
                <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 md:mb-6">Features</h2>
                <h3 className="text-3xl md:text-6xl font-display font-black tracking-tighter leading-tight md:leading-none">WHY CHOOSE US.</h3>
              </div>
              <p className="text-base md:text-lg text-white/40 max-w-sm leading-relaxed">Our platform is built to provide the best investment experience for our users.</p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: Shield, title: 'Secure Investing', desc: 'We use the best security measures to keep your investment safe and secure at all times.' },
                { icon: Zap, title: 'Fast Withdrawals', desc: 'Withdraw your daily profits quickly and easily whenever you want, without any delays.' },
                { icon: TrendingUp, title: 'Daily Profits', desc: 'Get consistent daily returns on your investment based on the plan you choose.' }
              ].map((feature, i) => (
                <div key={i} className="group relative p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/5 hover:border-indigo-500/30 transition-all duration-700 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-colors"></div>
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-10 text-white group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 border border-white/10">
                    <feature.icon size={28} md:size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-black mb-3 md:mb-6 tracking-tight">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm md:text-lg font-medium">{feature.desc}</p>
                  
                  <div className="mt-6 md:mt-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Learn More</span>
                    <ArrowRight size={14} className="text-indigo-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
 
        {/* Plans - Luxury/Prestige Style */}
        <section id="plans" className="py-20 md:py-40 px-6 sm:px-8 lg:px-12 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-24">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 md:mb-6">Our Plans</h2>
              <h3 className="text-3xl md:text-7xl font-display font-black tracking-tighter">CHOOSE A PLAN.</h3>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {[
                { name: 'Standard', min: 100, daily: '1.5%', total: '145%', duration: 30, color: 'white/5' },
                { name: 'Premium', min: 500, daily: '2.5%', total: '175%', duration: 30, popular: true, color: 'indigo-600' },
                { name: 'VIP', min: 1000, daily: '4.0%', total: '220%', duration: 30, color: 'white/5' },
              ].map((plan, i) => (
                <div key={i} className={`relative p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border transition-all duration-700 ${plan.popular ? 'bg-indigo-600 border-indigo-500 shadow-[0_40px_80px_-15px_rgba(79,70,229,0.3)] md:scale-105 z-10' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 px-5 md:px-6 py-1.5 md:py-2 bg-white text-indigo-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                      Most Selected
                    </div>
                  )}
                  
                  <div className="mb-6 md:mb-12">
                    <h3 className="text-xl md:text-3xl font-display font-black mb-1 md:mb-2 tracking-tighter">{plan.name}</h3>
                    <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${plan.popular ? 'text-white/70' : 'text-white/30'}`}>Plan {i + 1}</p>
                  </div>
 
                  <div className="flex items-baseline gap-2 mb-8 md:mb-12">
                    <span className="text-4xl md:text-6xl font-display font-black tracking-tighter">${plan.min}</span>
                    <span className={`text-xs md:text-sm font-black uppercase tracking-widest ${plan.popular ? 'text-white/60' : 'text-white/30'}`}>Minimum</span>
                  </div>
 
                  <div className="space-y-4 md:space-y-6 mb-10 md:mb-16">
                    {[
                      { label: 'Daily Profit', val: plan.daily },
                      { label: 'Total Return', val: plan.total },
                      { label: 'Duration', val: `${plan.duration} Days` },
                      { label: 'Withdrawal', val: 'Daily' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest ${plan.popular ? 'text-white/60' : 'text-white/30'}`}>{row.label}</span>
                        <span className="font-black text-sm md:text-base tracking-tight">{row.val}</span>
                      </div>
                    ))}
                  </div>
 
                  <Link 
                    to="/register" 
                    className={`block w-full py-4 md:py-6 rounded-xl md:rounded-3xl font-black text-center text-xs md:text-sm uppercase tracking-[0.2em] transition-all ${plan.popular ? 'bg-white text-indigo-600 hover:bg-slate-100' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    Invest Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
 
        {/* CTA Section - Immersive */}
        <section className="py-20 md:py-40 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-8xl font-display font-black text-white mb-6 md:mb-10 leading-[1] md:leading-[0.9] tracking-tighter">
                START EARNING <br />
                TODAY.
              </h2>
              <p className="text-base md:text-xl text-indigo-100/70 mb-10 md:mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
                Join thousands of investors who are already earning daily profits with our platform. Secure your financial future today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
                <Link to="/register" className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-7 bg-white text-black hover:bg-indigo-100 rounded-full font-black text-lg md:text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  Join Now
                </Link>
                <Link to="/contact" className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-7 bg-transparent text-white border-2 border-white/30 hover:border-white rounded-full font-black text-lg md:text-xl transition-all">
                  Contact
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
 
      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-40 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-8"
          >
            <Mail size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Support</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.9] mb-8">
            NEED <span className="text-white/30">HELP?</span> <br />
            CONTACT US.
          </h2>
          <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Our support team is available 24/7 to assist you with your investments. Reach out to us anytime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="mailto:support@investpro.com" className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-white/10 transition-all group">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Email Support</h3>
              <p className="text-white/40 text-sm">support@investpro.com</p>
            </a>
            <a href="https://t.me/InvestProSupport" target="_blank" rel="noopener noreferrer" className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-white/10 transition-all group">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Telegram</h3>
              <p className="text-white/40 text-sm">@InvestProSupport</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="connect" className="bg-[#050505] text-white/40 py-20 md:py-32 px-6 sm:px-8 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6 md:mb-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/40">
                <TrendingUp className="text-white w-6 h-6 md:w-7 md:h-7" />
              </div>
              <span className="font-display font-black text-2xl md:text-3xl text-white tracking-tighter">INVEST PRO</span>
            </div>
            <p className="text-sm md:text-lg text-white/30 max-w-md mb-8 md:mb-12 leading-relaxed font-medium">
              The world's most trusted daily return investment platform. Secure, transparent, and built for your growth.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                <Mail size={18} className="text-indigo-400" />
                <span className="text-sm font-black tracking-tight">support@investpro.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                <Send size={18} className="text-indigo-400" />
                <span className="text-sm font-black tracking-tight">@InvestProSupport</span>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6">
              {[Facebook, Twitter, Instagram, Youtube, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-500 border border-white/10 group">
                  <Icon size={18} md:size={24} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-6 md:mb-10">Navigation</h4>
            <ul className="space-y-3 md:space-y-6 text-xs md:text-sm font-black uppercase tracking-widest">
              <li><button onClick={() => scrollToSection('home')} className="hover:text-indigo-400 transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-indigo-400 transition-colors">About Us</button></li>
              <li><button onClick={() => scrollToSection('plans')} className="hover:text-indigo-400 transition-colors">Plans</button></li>
              <li><button onClick={() => scrollToSection('features')} className="hover:text-indigo-400 transition-colors">Features</button></li>
            </ul>
          </div>
 
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-6 md:mb-10">Support</h4>
            <ul className="space-y-3 md:space-y-6 text-xs md:text-sm font-black uppercase tracking-widest">
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Support</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 md:mt-32 pt-12 border-t border-white/5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] flex flex-col sm:flex-row justify-between items-center gap-6 md:gap-8">
          <p>© 2026 INVEST PRO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 md:gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-50 p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-900/50 transition-all hover:-translate-y-1 active:scale-95 border border-white/10"
            aria-label="Scroll to top"
          >
            <ChevronUp size={28} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
