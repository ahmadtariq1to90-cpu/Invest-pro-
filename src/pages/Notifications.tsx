import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { collection, query, orderBy, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isFirebaseConfigured && db && user?.uid) {
        try {
          const q = query(collection(db, 'users', user.uid, 'notifications'), orderBy('timestamp', 'desc'));
          const querySnapshot = await getDocs(q);
          const notifs: any[] = [];
          querySnapshot.forEach((doc) => {
            notifs.push({ id: doc.id, ...doc.data() });
          });
          setNotifications(notifs);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    if (!isFirebaseConfigured || !db || !user?.uid) return;
    
    const unreadNotifs = notifications.filter(n => !n.read);
    if (unreadNotifs.length === 0) return;

    try {
      const batch = writeBatch(db);
      unreadNotifs.forEach(notif => {
        const notifRef = doc(db, 'users', user.uid, 'notifications', notif.id);
        batch.update(notifRef, { read: true });
      });
      await batch.commit();
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {loading ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading notifications...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`bg-white dark:bg-slate-900 border ${notif.read ? 'border-slate-200 dark:border-slate-800' : 'border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10'} rounded-2xl p-4 shadow-sm flex items-start gap-4 transition-all duration-300`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  notif.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                }`}>
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`font-bold text-sm ${notif.read ? 'text-slate-900 dark:text-white' : 'text-indigo-900 dark:text-indigo-100'}`}>
                      {notif.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {notif.timestamp?.toDate().toLocaleDateString() || 'Just now'}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0"></div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500 transition-colors duration-300">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">All caught up!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">You don't have any new notifications.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
