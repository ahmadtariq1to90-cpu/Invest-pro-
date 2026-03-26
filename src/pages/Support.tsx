import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, MessageCircle, Send, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Support() {
  const navigate = useNavigate();

  const supportLinks = [
    { icon: Mail, title: 'Email Support', desc: 'support@investpro.com', color: 'text-rose-600 bg-rose-50', link: 'mailto:support@investpro.com' },
    { icon: Phone, title: 'Phone Support', desc: '+92 300 1234567', color: 'text-indigo-600 bg-indigo-50', link: 'tel:+923001234567' },
    { icon: MessageCircle, title: 'WhatsApp Group', desc: 'Join our community', color: 'text-[#25D366] bg-[#25D366]/10', link: 'https://chat.whatsapp.com/investpro' },
    { icon: MessageCircle, title: 'WhatsApp Channel', desc: 'Daily updates & news', color: 'text-[#25D366] bg-[#25D366]/10', link: 'https://whatsapp.com/channel/investpro' },
    { icon: Users, title: 'Telegram Group', desc: 'Discuss with members', color: 'text-[#0088cc] bg-[#0088cc]/10', link: 'https://t.me/investpro_group' },
    { icon: Send, title: 'Telegram Channel', desc: 'Official announcements', color: 'text-[#0088cc] bg-[#0088cc]/10', link: 'https://t.me/investpro_channel' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={() => navigate('/app/settings')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2">How can we help?</h2>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-xs mx-auto">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {supportLinks.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <ArrowLeft size={16} className="rotate-180" />
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
