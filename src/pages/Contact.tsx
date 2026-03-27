import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageCircle, Mail, Phone, MapPin, ChevronDown, ChevronUp, ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the investment work?",
      answer: "It's simple: You choose an investment plan, deposit your funds, and start receiving a fixed daily return directly into your account balance based on your chosen plan."
    },
    {
      question: "When can I withdraw my daily profits?",
      answer: "You can withdraw your daily profits at any time. Our system processes withdrawals quickly, transferring your earnings directly to your bank account, JazzCash, or EasyPaisa."
    },
    {
      question: "Is my investment capital secure?",
      answer: "Absolutely. We use advanced security protocols to ensure your funds are safe. Our platform is designed to provide consistent, reliable daily returns on your investment."
    },
    {
      question: "What is the minimum amount to start?",
      answer: "You can start investing with as little as $100. We believe in making daily profit generation accessible to everyone, regardless of their starting capital."
    },
    {
      question: "How do I contact support if I need help?",
      answer: "You can reach our Investor Support team 24/7 via WhatsApp, Telegram, or by filling out the contact form on this page. We are always here to assist you."
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      desc: "Instant chat support.",
      link: "https://wa.me/yournumber",
      color: "bg-emerald-500"
    },
    {
      icon: Send,
      title: "Telegram",
      desc: "Join our community.",
      link: "https://t.me/yourchannel",
      color: "bg-blue-500"
    },
    {
      icon: Mail,
      title: "Email Us",
      desc: "For detailed queries.",
      link: "mailto:support@investpro.com",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 selection:text-white pb-20 md:pb-32">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <header className="py-6 md:py-8 px-6 sm:px-8 lg:px-12 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <TrendingUp className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-display font-black text-lg md:text-xl tracking-tighter">INVEST PRO</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-32">
          {/* Left Column: FAQs & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 md:mb-6">Knowledge Base</h2>
            <h1 className="text-4xl md:text-7xl font-display font-black mb-8 md:mb-12 tracking-tighter leading-[1]">
              FREQUENTLY <br />
              <span className="text-white/30">ASKED</span> <br />
              QUESTIONS.
            </h1>

            <div className="space-y-2 md:space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-white/5">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-6 md:py-8 flex items-center justify-between text-left group"
                  >
                    <span className={`text-base md:text-lg font-black tracking-tight transition-colors pr-4 ${openFaq === i ? 'text-indigo-400' : 'text-white group-hover:text-white/80'}`}>
                      {faq.question}
                    </span>
                    {openFaq === i ? <ChevronUp className="text-indigo-400 flex-shrink-0" /> : <ChevronDown className="text-white/30 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 md:pb-8 text-sm md:text-base text-white/50 leading-relaxed font-medium">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {contactMethods.map((method, i) => (
                <a
                  key={i}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 md:p-8 bg-white/5 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${method.color} rounded-xl md:rounded-2xl flex items-center justify-center sm:mb-6 shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <method.icon className="text-white w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-tight mb-1 md:mb-2">{method.title}</h4>
                    <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-widest leading-tight">{method.desc}</p>
                  </div>
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
            <div className="bg-white/5 backdrop-blur-3xl p-6 sm:p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-display font-black mb-2 tracking-tighter">GET IN TOUCH</h3>
                <p className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-8 md:mb-12">Investor Support Team</p>

                <form className="space-y-6 md:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Subject</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                      <option className="bg-slate-900">General Inquiry</option>
                      <option className="bg-slate-900">Investment Plans</option>
                      <option className="bg-slate-900">Withdrawal Support</option>
                      <option className="bg-slate-900">Account Help</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Message</label>
                    <textarea 
                      rows={5}
                      placeholder="How can we help you today?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button className="w-full py-4 md:py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-base md:text-lg transition-all shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 group">
                    Send Message <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </button>
                </form>

                <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Support Line</p>
                      <p className="text-xs font-black">+1 (888) INVEST-PRO</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Location</p>
                      <p className="text-xs font-black">Global Operations</p>
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
