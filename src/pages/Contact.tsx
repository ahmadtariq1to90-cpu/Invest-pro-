import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageCircle, Mail, Phone, MapPin, ChevronDown, ChevronUp, ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I start investing?",
      answer: "Starting your journey is simple. Create an account, complete your profile, and choose an investment plan that fits your goals. Once you deposit funds, your yield generation begins automatically."
    },
    {
      question: "Is my capital secure?",
      answer: "Yes. We use institutional-grade security protocols, including multi-signature cold storage and 256-bit encryption. 98% of our assets are kept offline to prevent any unauthorized access."
    },
    {
      question: "When can I withdraw my earnings?",
      answer: "You can initiate a withdrawal at any time. Our automated system processes requests 24/7. Depending on the network, funds typically arrive in your wallet within minutes to a few hours."
    },
    {
      question: "What is the minimum investment?",
      answer: "Our entry-level 'Standard' plan starts at just $100. We believe in making high-yield opportunities accessible to everyone, regardless of their starting capital."
    },
    {
      question: "How are the yields generated?",
      answer: "We utilize proprietary algorithmic trading strategies across multiple decentralized finance (DeFi) protocols and high-frequency markets to capture alpha and deliver consistent returns."
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      desc: "Instant chat with our desk.",
      link: "https://wa.me/yournumber",
      color: "bg-emerald-500"
    },
    {
      icon: Send,
      title: "Telegram Channel",
      desc: "Real-time protocol updates.",
      link: "https://t.me/yourchannel",
      color: "bg-blue-500"
    },
    {
      icon: Mail,
      title: "Email Desk",
      desc: "Official correspondence.",
      link: "mailto:support@investpro.com",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 selection:text-white pb-32">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <header className="py-8 px-6 sm:px-8 lg:px-12 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span className="font-display font-black text-xl tracking-tighter">INVEST PRO</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Terminal
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24">
        <div className="grid lg:grid-cols-2 gap-32">
          {/* Left Column: FAQs & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Knowledge Base</h2>
            <h1 className="text-5xl md:text-7xl font-display font-black mb-12 tracking-tighter leading-[0.9]">
              FREQUENTLY <br />
              <span className="text-white/30">ASKED</span> <br />
              QUESTIONS.
            </h1>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-white/5">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-8 flex items-center justify-between text-left group"
                  >
                    <span className={`text-lg font-black tracking-tight transition-colors ${openFaq === i ? 'text-indigo-400' : 'text-white group-hover:text-white/80'}`}>
                      {faq.question}
                    </span>
                    {openFaq === i ? <ChevronUp className="text-indigo-400" /> : <ChevronDown className="text-white/30" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 text-white/50 leading-relaxed font-medium">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-20 grid sm:grid-cols-3 gap-6">
              {contactMethods.map((method, i) => (
                <a
                  key={i}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className={`w-12 h-12 ${method.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <method.icon className="text-white" size={24} />
                  </div>
                  <h4 className="text-sm font-black tracking-tight mb-2">{method.title}</h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest leading-tight">{method.desc}</p>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-black mb-2 tracking-tighter">DIRECT INQUIRY</h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-12">Institutional Support Desk</p>

                <form className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Subject</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                      <option className="bg-slate-900">General Inquiry</option>
                      <option className="bg-slate-900">Technical Support</option>
                      <option className="bg-slate-900">Institutional Partnership</option>
                      <option className="bg-slate-900">Compliance / Legal</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Message</label>
                    <textarea 
                      rows={6}
                      placeholder="How can our desk assist you today?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 group">
                    Dispatch Message <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </button>
                </form>

                <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-2 gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Phone size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Global Line</p>
                      <p className="text-xs font-black">+1 (888) INVEST-PRO</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <MapPin size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">HQ Location</p>
                      <p className="text-xs font-black">Financial District, SG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
