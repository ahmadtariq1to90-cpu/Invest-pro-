import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "../store/auth";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const ACTIVITIES = [
  {
    name: "Ali",
    action: "deposited",
    amount: "500 PKR",
    color: "text-green-500",
  },
  {
    name: "Ahmed",
    action: "withdrew",
    amount: "300 PKR",
    color: "text-red-500",
  },
  {
    name: "Usman",
    action: "deposited",
    amount: "1000 PKR",
    color: "text-green-500",
  },
  {
    name: "Sara",
    action: "invested",
    amount: "5000 PKR",
    color: "text-indigo-500",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem('welcomeShown');
  });

  const handleCloseWelcome = () => {
    sessionStorage.setItem('welcomeShown', 'true');
    setShowWelcome(false);
  };
  const [showBalance, setShowBalance] = useState(true);
  const [liveActivity, setLiveActivity] = useState<
    (typeof ACTIVITIES)[0] | null
  >(null);
  const [filter, setFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.uid) return;

    const fetchData = async () => {
      // Fetch user data
      const { data: uData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.uid)
        .single();
      if (uData) setUserData(uData);

      // Fetch recent activity
      const { data: txs } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.uid)
        .order("created_at", { ascending: false })
        .limit(5);
      if (txs) setRecentActivity(txs);

      // Fetch unread notifications
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.uid)
        .eq("read", false);
      if (count !== null) setUnreadNotifications(count);
    };

    fetchData();

    // Set up realtime subscriptions
    const userSub = supabase.channel('user_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${user.uid}` }, fetchData)
      .subscribe();

    const txSub = supabase.channel('tx_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.uid}` }, fetchData)
      .subscribe();

    const notifSub = supabase.channel('notif_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.uid}` }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(userSub);
      supabase.removeChannel(txSub);
      supabase.removeChannel(notifSub);
    };
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomActivity =
        ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      setLiveActivity(randomActivity);
      setTimeout(() => setLiveActivity(null), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcome && (
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
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden transition-colors duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#25D366] to-emerald-400"></div>
              <button
                onClick={handleCloseWelcome}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 mt-2">
                Welcome {user?.displayName || "User"}!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Join our official WhatsApp channel for daily updates, tips, and
                free rewards.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseWelcome}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
                <a
                  href="https://whatsapp.com/channel/investpro"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCloseWelcome}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-200 flex items-center justify-center"
                >
                  Join Now
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Activity Popup */}
      <AnimatePresence>
        {liveActivity && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2 whitespace-nowrap transition-colors duration-300"
          >
            <div
              className={`w-2 h-2 rounded-full ${liveActivity.color.replace("text-", "bg-")}`}
            ></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">
                {liveActivity.name}
              </span>{" "}
              {liveActivity.action}{" "}
              <span className={liveActivity.color}>{liveActivity.amount}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Section */}
      <div className="bg-indigo-600 text-white rounded-b-[2.5rem] pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <Link to="/app/profile" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 overflow-hidden hover:scale-105 transition-transform">
              {userData?.profile_image || user?.photoURL ? (
                <img
                  src={userData?.profile_image || user?.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xl font-bold">
                  {user?.displayName?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </Link>
            <div>
              <h2 className="font-bold text-lg leading-tight">
                {user?.displayName || "User"}
              </h2>
              <p className="text-indigo-200 text-xs">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://whatsapp.com/channel/investpro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 bg-[#25D366] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-green-900/20 hover:scale-105 transition-transform"
            >
              Join Channel
            </a>
            <Link to="/app/notifications" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors relative">
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-indigo-600"></div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-6 -mt-16 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 font-medium">Total Balance</p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            {showBalance
              ? (userData?.balance || 0).toLocaleString() + ".00"
              : "••••••••"}{" "}
            <span className="text-xl text-slate-400 font-medium">PKR</span>
          </h1>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 transition-colors duration-300"></div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Deposit Balance</p>
              <p className="font-bold text-slate-900 dark:text-white">
                {showBalance
                  ? (userData?.deposit_balance || 0).toLocaleString() + ".00"
                  : "••••"}{" "}
                PKR
              </p>
            </div>
            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 transition-colors duration-300"></div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Plans</p>
              <p className="font-bold text-indigo-600 dark:text-indigo-400">
                {userData?.active_plans_count || 0} Plans
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
        {[
          {
            title: "Total Investment",
            amount: (userData?.total_investment || 0).toLocaleString(),
            icon: TrendingUp,
            color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
          },
          {
            title: "Total Deposit",
            amount: (userData?.total_deposit || 0).toLocaleString(),
            icon: ArrowDownToLine,
            color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
          },
          {
            title: "Total Withdraw",
            amount: (userData?.total_withdraw || 0).toLocaleString(),
            icon: ArrowUpFromLine,
            color: "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
          },
          {
            title: "Referral Earnings",
            amount: (userData?.referral_earnings || 0).toLocaleString(),
            icon: Users,
            color: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-3 transition-colors duration-300"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
            >
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                {stat.title}
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {showBalance ? stat.amount : "••••"} PKR
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors duration-300"
            >
              {filter} <ChevronDown size={16} />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-30 transition-colors duration-300">
                {["3 Days", "1 Week", "1 Month", "All"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {recentActivity.length > 0 ? (
          <div className="flex flex-col gap-4">
            {recentActivity.map((tx) => (
              <div key={tx.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    tx.type === 'deposit' || tx.type === 'return' || tx.type === 'profit' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 
                    tx.type === 'investment' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                    'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'return' || tx.type === 'profit' ? <ArrowDownToLine size={20} /> : 
                     tx.type === 'investment' ? <TrendingUp size={20} /> : <ArrowUpFromLine size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{tx.user_name || user?.displayName || 'User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.date} {tx.time && `• ${tx.time}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${tx.amount.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount} PKR
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${tx.status === 'Completed' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
              <TrendingUp className="text-slate-300 dark:text-slate-600" size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No recent activity</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Your recent transactions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
