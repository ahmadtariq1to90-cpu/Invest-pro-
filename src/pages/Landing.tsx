import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, TrendingUp, Shield, Zap, ChevronUp, Facebook, Twitter, Instagram, Youtube, Send, Globe, Users, BarChart3, CheckCircle2, Play, ExternalLink } from 'lucide-react';
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
    { label: 'Active Capital', value: '$42.8M+' },
    { label: 'Daily Yield', value: 'Up to 12%' },
    { label: 'Global Nodes', value: '1,240+' },
    { label: 'Uptime', value: '99.99%' },
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
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400/80">Institutional Grade</span>
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
        <section id="home" className="relative pt-48 pb-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Institutional Yield Protocol v2.5
              </div>
              
              <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-display font-black leading-[0.85] tracking-tighter mb-10">
                CAPITAL <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-violet-400 bg-[length:200%_auto] animate-gradient">EVOLUTION.</span>
              </h1>
              
              <p className="text-xl text-white/50 mb-12 max-w-xl leading-relaxed font-medium">
                Experience the next frontier of wealth generation. Our proprietary algorithms deliver consistent, institutional-grade returns in a secure, decentralized environment.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto px-12 py-6 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-full font-black text-lg transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-3 hover:-translate-y-1.5 active:scale-95"
                >
                  Launch Terminal <ArrowRight size={24} strokeWidth={3} />
                </Link>
                <button 
                  onClick={() => scrollToSection('plans')}
                  className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-black text-lg transition-all flex items-center justify-center gap-3 hover:-translate-y-1.5 active:scale-95"
                >
                  View Yields
                </button>
              </div>

              <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-10">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-display font-black tracking-tighter">{stat.value}</p>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
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
                          <h4 className="font-black text-white text-lg tracking-tight">Real-time Alpha</h4>
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Global Market Feed</p>
                        </div>
                      </div>
                      <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                        Live Tracking
                      </div>
                    </div>

                    <div className="space-y-8">
                      {[
                        { label: 'Yield Projection', val: 88, color: 'from-indigo-500 to-violet-500' },
                        { label: 'Risk Mitigation', val: 94, color: 'from-blue-500 to-indigo-500' },
                        { label: 'Liquidity Depth', val: 76, color: 'from-violet-500 to-purple-500' }
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
        <section id="about" className="py-40 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>
                <div className="relative z-10 grid grid-cols-2 gap-6">
                  <div className="space-y-6 pt-12">
                    <div className="aspect-[4/5] bg-white/5 rounded-[3rem] border border-white/10 p-8 flex flex-col justify-end group hover:bg-white/10 transition-all">
                      <Users size={40} className="text-indigo-400 mb-6" />
                      <h4 className="text-4xl font-display font-black tracking-tighter">50K+</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-2">Active Nodes</p>
                    </div>
                    <div className="aspect-square bg-indigo-600 rounded-[3rem] p-8 flex flex-col justify-end shadow-2xl shadow-indigo-900/40">
                      <Globe size={40} className="text-white mb-6" />
                      <h4 className="text-4xl font-display font-black tracking-tighter text-white">120+</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mt-2">Regions</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 p-8 flex flex-col justify-end group hover:bg-white/10 transition-all">
                      <Shield size={40} className="text-indigo-400 mb-6" />
                      <h4 className="text-4xl font-display font-black tracking-tighter">100%</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-2">Audited</p>
                    </div>
                    <div className="aspect-[4/5] bg-violet-600 rounded-[3rem] p-8 flex flex-col justify-end shadow-2xl shadow-violet-900/40">
                      <Zap size={40} className="text-white mb-6" />
                      <h4 className="text-4xl font-display font-black tracking-tighter text-white">24/7</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mt-2">Concierge</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8">The Protocol</h2>
                <h3 className="text-5xl md:text-7xl font-display font-black mb-10 leading-[0.9] tracking-tighter">
                  ENGINEERING <br />
                  <span className="text-white/30">FINANCIAL</span> <br />
                  FREEDOM.
                </h3>
                <p className="text-xl text-white/50 mb-10 leading-relaxed font-medium">
                  Invest Pro is not just a platform; it's a sophisticated financial ecosystem built on the principles of transparency, security, and algorithmic precision. We leverage high-frequency trading and automated yield farming to deliver returns that were previously reserved for institutional giants.
                </p>
                <div className="grid grid-cols-2 gap-8 mb-12">
                  {[
                    { title: 'Algorithmic Yield', desc: 'Proprietary AI-driven strategies.' },
                    { title: 'Real-time Audit', desc: 'Transparent on-chain verification.' },
                    { title: 'Cold Storage', desc: '98% of assets kept offline.' },
                    { title: 'Global Access', desc: 'Seamless cross-border capital.' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-indigo-400" />
                        <span className="text-sm font-black tracking-tight">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-white/30 leading-tight">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-indigo-400 transition-colors"
                >
                  Deep Dive into Technology <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Hardware Style */}
        <section id="features" className="py-40 px-6 sm:px-8 lg:px-12 bg-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
              <div className="max-w-2xl">
                <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Core Infrastructure</h2>
                <h3 className="text-5xl md:text-6xl font-display font-black tracking-tighter leading-none">BUILT FOR PERFORMANCE.</h3>
              </div>
              <p className="text-lg text-white/40 max-w-sm leading-relaxed">Our infrastructure is designed to handle massive throughput with zero latency.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: 'Fortress Security', desc: 'Multi-signature vaults and biometric authentication layers ensure your capital remains untouchable.' },
                { icon: Zap, title: 'Instant Liquidity', desc: 'Our automated clearing house ensures withdrawals are processed in milliseconds, 24/7/365.' },
                { icon: TrendingUp, title: 'Dynamic Yields', desc: 'Real-time rebalancing across multiple liquidity pools to capture the highest possible alpha.' }
              ].map((feature, i) => (
                <div key={i} className="group relative p-12 rounded-[3rem] bg-[#0a0a0a] border border-white/5 hover:border-indigo-500/30 transition-all duration-700 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-colors"></div>
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10 text-white group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 border border-white/10">
                    <feature.icon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-display font-black mb-6 tracking-tight">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed text-lg font-medium">{feature.desc}</p>
                  
                  <div className="mt-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Explore Module</span>
                    <ArrowRight size={14} className="text-indigo-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans - Luxury/Prestige Style */}
        <section id="plans" className="py-40 px-6 sm:px-8 lg:px-12 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Investment Tiers</h2>
              <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter">SELECT YOUR STRATEGY.</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: 'Standard', min: 100, daily: '1.5%', total: '145%', duration: 30, color: 'white/5' },
                { name: 'Premium', min: 500, daily: '2.5%', total: '175%', duration: 30, popular: true, color: 'indigo-600' },
                { name: 'Elite', min: 1000, daily: '4.0%', total: '220%', duration: 30, color: 'white/5' },
              ].map((plan, i) => (
                <div key={i} className={`relative p-12 rounded-[3.5rem] border transition-all duration-700 ${plan.popular ? 'bg-indigo-600 border-indigo-500 shadow-[0_40px_80px_-15px_rgba(79,70,229,0.3)] scale-105 z-10' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                      Most Selected
                    </div>
                  )}
                  
                  <div className="mb-12">
                    <h3 className="text-3xl font-display font-black mb-2 tracking-tighter">{plan.name}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${plan.popular ? 'text-white/70' : 'text-white/30'}`}>Tier {i + 1} Protocol</p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-12">
                    <span className="text-6xl font-display font-black tracking-tighter">${plan.min}</span>
                    <span className={`text-sm font-black uppercase tracking-widest ${plan.popular ? 'text-white/60' : 'text-white/30'}`}>Minimum</span>
                  </div>

                  <div className="space-y-6 mb-16">
                    {[
                      { label: 'Daily Yield', val: plan.daily },
                      { label: 'Total Return', val: plan.total },
                      { label: 'Duration', val: `${plan.duration} Days` },
                      { label: 'Compounding', val: 'Enabled' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${plan.popular ? 'text-white/60' : 'text-white/30'}`}>{row.label}</span>
                        <span className="font-black tracking-tight">{row.val}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    to="/register" 
                    className={`block w-full py-6 rounded-3xl font-black text-center text-sm uppercase tracking-[0.2em] transition-all ${plan.popular ? 'bg-white text-indigo-600 hover:bg-slate-100' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    Initialize Plan
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Immersive */}
        <section className="py-40 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
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
              <h2 className="text-5xl md:text-8xl font-display font-black text-white mb-10 leading-[0.9] tracking-tighter">
                YOUR FUTURE <br />
                IS WAITING.
              </h2>
              <p className="text-xl text-indigo-100/70 mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
                Join the elite circle of investors who have already unlocked the power of algorithmic wealth generation. Secure your spot in the protocol today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link to="/register" className="w-full sm:w-auto px-16 py-7 bg-white text-black hover:bg-indigo-100 rounded-full font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  Create Account
                </Link>
                <Link to="/contact" className="w-full sm:w-auto px-16 py-7 bg-transparent text-white border-2 border-white/30 hover:border-white rounded-full font-black text-xl transition-all">
                  Contact Desk
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="connect" className="bg-[#050505] text-white/40 py-32 px-6 sm:px-8 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/40">
                <TrendingUp className="text-white w-7 h-7" />
              </div>
              <span className="font-display font-black text-3xl text-white tracking-tighter">INVEST PRO</span>
            </div>
            <p className="text-lg text-white/30 max-w-md mb-12 leading-relaxed font-medium">
              The world's most advanced institutional-grade yield protocol. Secure, transparent, and engineered for the next generation of wealth.
            </p>
            <div className="flex gap-6">
              {[Facebook, Twitter, Instagram, Youtube, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-500 border border-white/10 group">
                  <Icon size={24} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-10">Navigation</h4>
            <ul className="space-y-6 text-sm font-black uppercase tracking-widest">
              <li><button onClick={() => scrollToSection('home')} className="hover:text-indigo-400 transition-colors">Protocol Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-indigo-400 transition-colors">Our Thesis</button></li>
              <li><button onClick={() => scrollToSection('plans')} className="hover:text-indigo-400 transition-colors">Yield Tiers</button></li>
              <li><button onClick={() => scrollToSection('features')} className="hover:text-indigo-400 transition-colors">Infrastructure</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-10">Support</h4>
            <ul className="space-y-6 text-sm font-black uppercase tracking-widest">
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Support Desk</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">FAQ / Knowledge</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors">Legal Framework</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Terminal Login</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] flex flex-col sm:flex-row justify-between items-center gap-8">
          <p>© 2026 INVEST PRO PROTOCOL. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-12">
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
