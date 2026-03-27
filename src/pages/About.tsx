import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Shield, Zap, Users, Globe, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Total Deposits', value: '$10M+', icon: Globe },
    { label: 'Years Experience', value: '5+', icon: Award },
  ];

  const values = [
    {
      title: 'Our Mission',
      description: 'To provide accessible and high-yield investment opportunities for everyone, powered by cutting-edge technology and transparent processes.',
      icon: Target,
      color: 'bg-indigo-500',
    },
    {
      title: 'Security First',
      description: 'We prioritize the safety of your funds with multi-layer encryption, secure payment gateways, and rigorous internal audits.',
      icon: Shield,
      color: 'bg-emerald-500',
    },
    {
      title: 'Instant Growth',
      description: 'Our automated systems ensure that your earnings are calculated and credited instantly, providing a seamless investment experience.',
      icon: Zap,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl px-8 py-8 flex items-center gap-6 sticky top-0 z-50 border-b border-white/5">
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-all rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">About Us</h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Institutional Wealth Management</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="space-y-24"
        >
          {/* Hero Section */}
          <div className="relative rounded-[4rem] overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 p-16 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] group transition-all duration-700 hover:border-white/20">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent_70%)]"></div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                <Shield size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Global Institutional Standards</span>
              </div>
              <h2 className="text-6xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
                Empowering Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 animate-gradient bg-[length:200%_auto]">Financial Future</span>
              </h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
                We are a leading institutional investment platform dedicated to helping you grow your wealth through smart, automated, and secure strategies.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 text-center transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)] group"
              >
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-2xl shadow-indigo-900/20">
                  <stat.icon size={32} strokeWidth={2} />
                </div>
                <p className="text-4xl font-bold text-white mb-2 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Values Section */}
          <div className="space-y-16">
            <div className="text-center">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em] mb-4">Our Core Values</h3>
              <h4 className="text-4xl font-bold text-white tracking-tighter">What Drives Our Success</h4>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {values.map((value, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row gap-12 items-center md:items-start transition-all duration-500 hover:bg-white/10 hover:shadow-2xl group"
                >
                  <div className={`w-24 h-24 shrink-0 rounded-[2rem] ${value.color} flex items-center justify-center text-white shadow-2xl shadow-indigo-900/40 group-hover:scale-110 transition-transform duration-500`}>
                    <value.icon size={44} strokeWidth={2} />
                  </div>
                  <div className="text-center md:text-left">
                    <h5 className="text-3xl font-bold text-white mb-4 tracking-tighter">{value.title}</h5>
                    <p className="text-xl text-white/40 font-medium leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white/5 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="text-4xl font-bold text-white mb-10 tracking-tighter flex items-center gap-4">
              Our Story <Award className="text-indigo-400 w-8 h-8" />
            </h3>
            <div className="space-y-8 text-xl text-white/40 font-medium leading-relaxed">
              <p>
                Founded in 2020, our platform was born out of a simple idea: that institutional-grade investment tools should be available to everyone, not just the elite.
              </p>
              <p>
                Over the years, we have grown from a small team of passionate developers and financial experts to a global platform serving thousands of users worldwide. Our commitment to transparency, security, and innovation remains at the core of everything we do.
              </p>
              <p>
                Today, we continue to push the boundaries of what's possible in the world of digital finance, constantly evolving our systems to provide you with the best possible returns and a world-class user experience.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

}
