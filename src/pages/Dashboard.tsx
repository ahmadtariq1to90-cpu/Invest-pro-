import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  ChevronDown,
  X,
  Plus,
  ArrowRight,
  Wallet,
  Zap,
  Shield,
  History as HistoryIcon,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from "../store/auth";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const ACTIVITIES = [
  { name: "Ali", action: "deposited", amount: "50,000 PKR", color: "text-emerald-400" },
  { name: "Ahmed", action: "withdrew", amount: "12,500 PKR", color: "text-rose-400" },
  { name: "Usman", action: "deposited", amount: "100,000 PKR", color: "text-emerald-400" },
  { name: "Sara", action: "invested", amount: "250,000 PKR", color: "text-indigo-400" },
];

const CHART_DATA = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 6890 },
  { name: 'Sat', value: 8390 },
  { name: 'Sun', value: 9490 },
];

const ALLOCATION_DATA = [
  { name: 'Fixed Income', value: 400, color: '#6366f1' },
  { name: 'Equity', value: 300, color: '#8b5cf6' },
  { name: 'Crypto', value: 200, color: '#10b981' },
  { name: 'Cash', value: 100, color: '#f59e0b' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem('welcomeShown'));
  const [showBalance, setShowBalance] = useState(true);
  const [liveActivity, setLiveActivity] = useState<(typeof ACTIVITIES)[0] | null>(null);
  const [filter, setFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const handleCloseWelcome = () => {
    sessionStorage.setItem('welcomeShown', 'true');
    setShowWelcome(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.uid) return;

    const fetchData = async () => {
      const { data: uData } = await supabase.from("users").select("*").eq("id", user.uid).single();
      if (uData) setUserData(uData);

      const { data: txs } = await supabase.from("transactions").select("*").eq("user_id", user.uid).order("created_at", { ascending: false }).limit(5);
      if (txs) setRecentActivity(txs);

      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.uid).eq("read", false);
      if (count !== null) setUnreadNotifications(count);
    };

    fetchData();

    const userSub = supabase.channel('user_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${user.uid}` }, fetchData).subscribe();
    const txSub = supabase.channel('tx_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.uid}` }, fetchData).subscribe();
    const notifSub = supabase.channel('notif_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.uid}` }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(userSub);
      supabase.removeChannel(txSub);
      supabase.removeChannel(notifSub);
    };
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      setLiveActivity(randomActivity);
      setTimeout(() => setLiveActivity(null), 2500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 mesh-gradient opacity-40"></div>
      <div className="fixed inset-0 z-0 noise-overlay"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Market Ticker */}
      <div className="relative z-20 bg-white/5 backdrop-blur-md border-b border-white/5 py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[
            { label: 'BTC/USD', value: '64,231.50', change: '+2.4%', up: true },
            { label: 'ETH/USD', value: '3,452.12', change: '+1.8%', up: true },
            { label: 'GOLD', value: '2,154.00', change: '-0.4%', up: false },
            { label: 'S&P 500', value: '5,123.44', change: '+0.9%', up: true },
            { label: 'PKR/USD', value: '278.50', change: '0.0%', up: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-8 border-r border-white/10 last:border-0">
              <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">{item.label}</span>
              <span className="text-xs font-bold font-mono">{item.value}</span>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {item.change}
              </span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {[
            { label: 'BTC/USD', value: '64,231.50', change: '+2.4%', up: true },
            { label: 'ETH/USD', value: '3,452.12', change: '+1.8%', up: true },
            { label: 'GOLD', value: '2,154.00', change: '-0.4%', up: false },
            { label: 'S&P 500', value: '5,123.44', change: '+0.9%', up: true },
            { label: 'PKR/USD', value: '278.50', change: '0.0%', up: true },
          ].map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-4 px-8 border-r border-white/10 last:border-0">
              <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">{item.label}</span>
              <span className="text-xs font-bold font-mono">{item.value}</span>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"></div>
              <button onClick={handleCloseWelcome} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Shield className="text-indigo-400" size={32} />
              </div>

              <h3 className="text-3xl font-bold tracking-tight mb-3 font-display">
                Institutional Access
              </h3>
              <p className="text-white/60 mb-8 leading-relaxed text-lg">
                Welcome to the elite tier of capital management. Your institutional-grade dashboard is now active.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="https://whatsapp.com/channel/investpro"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCloseWelcome}
                  className="w-full py-4 rounded-2xl font-bold text-black bg-white hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
                >
                  Join VIP Community <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={handleCloseWelcome}
                  className="w-full py-4 rounded-2xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Enter Terminal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Activity Toast */}
      <AnimatePresence>
        {liveActivity && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-16 left-1/2 z-[90] bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 whitespace-nowrap"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-medium text-white/80">
              <span className="font-bold text-white">{liveActivity.name}</span> {liveActivity.action}{" "}
              <span className={liveActivity.color}>{liveActivity.amount}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/app/profile" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-14 h-14 bg-[#0a0a0a] rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden transition-transform duration-500 group-hover:scale-105">
                {userData?.profile_image || user?.photoURL ? (
                  <img
                    src={userData?.profile_image || user?.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xl font-bold text-white/40">
                    {user?.displayName?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </Link>
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Capital Management</p>
              <h2 className="text-2xl font-bold tracking-tight font-display">
                {user?.displayName?.split(' ')[0] || "Investor"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/app/notifications" className="relative w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all group">
              <Bell size={22} className="text-white/60 group-hover:text-white transition-colors" />
              {unreadNotifications > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#050505] animate-pulse"></span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 space-y-8">
        {/* Balance Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-[2.5rem] blur-xl opacity-50"></div>
          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity size={120} />
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Market Active</span>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2.5 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="space-y-1 mb-10">
              <p className="text-white/40 text-xs font-medium tracking-wide">Total Portfolio Value</p>
              <div className="flex items-baseline gap-3">
                <h1 className="text-6xl font-bold tracking-tighter font-display">
                  {showBalance ? (userData?.balance || 0).toLocaleString() : "••••••••"}
                </h1>
                <span className="text-xl text-white/20 font-medium tracking-widest">PKR</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link to="/app/deposit" className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-white/10">
                <Plus size={20} /> Deposit
              </Link>
              <Link to="/app/withdraw" className="flex items-center justify-center gap-2 bg-white/5 text-white py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all active:scale-95">
                <ArrowUpFromLine size={20} /> Withdraw
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Liquid Assets</p>
                <p className="text-xl font-bold font-display">
                  {showBalance ? (userData?.deposit_balance || 0).toLocaleString() : "••••"} <span className="text-xs text-white/20">PKR</span>
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Yielding Plans</p>
                <div className="flex items-center justify-end gap-2">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <p className="text-xl font-bold text-emerald-400 font-display">
                    {userData?.active_plans_count || 0} <span className="text-xs opacity-60">Active</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Growth Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0a0a0a] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight font-display">Yield Analytics</h3>
              <p className="text-xs text-white/40">7-day performance projection</p>
            </div>
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
              <BarChart3 size={18} className="text-indigo-400" />
            </div>
          </div>
          
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Portfolio Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0a0a0a] rounded-[2.5rem] p-8 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
                <PieChartIcon size={18} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-bold tracking-tight font-display">Asset Allocation</h3>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ALLOCATION_DATA}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ALLOCATION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {ALLOCATION_DATA.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold">{item.value / 10}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0a0a0a] rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <Zap size={18} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold tracking-tight font-display">Yield Projection</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Monthly Target</p>
                  <p className="text-2xl font-bold font-display text-emerald-400">+24.5%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Est. Returns</p>
                  <p className="text-xl font-bold font-display">45,000 <span className="text-xs opacity-40">PKR</span></p>
                </div>
              </div>
              
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                ></motion.div>
              </div>
              <p className="text-[10px] font-bold text-white/20 text-center uppercase tracking-[0.3em]">65% of monthly goal achieved</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Transaction Log</p>
              <h3 className="text-2xl font-bold tracking-tight font-display">Recent Activity</h3>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-[10px] font-bold text-white/60 glass px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
              >
                {filter} <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-30 backdrop-blur-xl"
                  >
                    {["3 Days", "1 Week", "1 Month", "All"].map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setFilter(f);
                          setIsFilterOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-xs font-bold hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                      >
                        {f}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((tx, idx) => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 flex items-center justify-between hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      tx.type === 'deposit' || tx.type === 'return' || tx.type === 'profit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      tx.type === 'investment' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'return' || tx.type === 'profit' ? <ArrowDownToLine size={20} /> : 
                       tx.type === 'investment' ? <TrendingUp size={20} /> : <ArrowUpFromLine size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{tx.title || tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{tx.date} • {tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-base tracking-tight ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>
                      {tx.amount} <span className="text-[10px] font-bold text-white/20">PKR</span>
                    </p>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider mt-1 ${
                      tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </motion.div>
              ))}
              <Link to="/app/history" className="flex items-center justify-center gap-2 py-4 text-white/40 hover:text-white text-xs font-bold transition-colors group">
                View Full Transaction History <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="bg-[#0a0a0a] rounded-[2.5rem] p-16 border border-white/5 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <HistoryIcon className="text-white/10" size={32} />
              </div>
              <h4 className="text-lg font-bold mb-2">No Activity Yet</h4>
              <p className="text-sm text-white/40 max-w-[200px] mx-auto leading-relaxed">Your financial journey starts here. Make your first deposit to begin.</p>
            </div>
          )}
        </div>

        {/* Security Banner */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-3xl p-6 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
            <Shield className="text-indigo-400" size={24} />
          </div>
          <div>
            <p className="text-sm font-bold">Institutional Security Active</p>
            <p className="text-xs text-white/40">End-to-end encryption & cold storage enabled</p>
          </div>
        </div>
      </div>

      {/* Custom Styles for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
