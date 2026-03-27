import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  HelpCircle, 
  Users, 
  ArrowLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../store/auth';

type Tab = 'plans' | 'payments' | 'faqs' | 'users' | 'referrals';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('plans');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/app');
      return;
    }
    fetchData();
  }, [activeTab, isAdmin]);

  const fetchData = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      let result;
      if (activeTab === 'plans') {
        result = await supabase.from('plans').select('*').order('price', { ascending: true });
      } else if (activeTab === 'payments') {
        result = await supabase.from('payment_methods').select('*');
      } else if (activeTab === 'faqs') {
        result = await supabase.from('faqs').select('*').order('order', { ascending: true });
      } else if (activeTab === 'users') {
        result = await supabase.from('users').select('*').order('created_at', { ascending: false });
      } else if (activeTab === 'referrals') {
        result = await supabase.from('users').select('*').not('referred_by', 'is', null).order('created_at', { ascending: false });
      }
      
      if (result?.error) throw result.error;
      setData(result?.data || []);
    } catch (err) {
      console.error(`Error fetching ${activeTab}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) return;
    try {
      let error;
      if (isAdding) {
        const { id, ...newData } = editForm;
        const { error: err } = await supabase.from(activeTab === 'payments' ? 'payment_methods' : activeTab).insert(newData);
        error = err;
      } else {
        const { error: err } = await supabase.from(activeTab === 'payments' ? 'payment_methods' : activeTab).update(editForm).eq('id', editingId);
        error = err;
      }
      
      if (error) throw error;
      setEditingId(null);
      setIsAdding(false);
      fetchData();
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save changes.");
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    if (!isSupabaseConfigured) return;
    
    try {
      const { error } = await supabase.from(activeTab === 'payments' ? 'payment_methods' : activeTab).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item.");
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId('new');
    if (activeTab === 'plans') {
      setEditForm({ name: '', price: 0, daily_return: 0, total_return: 0, duration: 30, popular: false });
    } else if (activeTab === 'payments') {
      setEditForm({ name: '', logo_url: '', account_number: '', account_title: '', bank_name: '', active: true });
    } else if (activeTab === 'faqs') {
      setEditForm({ question: '', answer: '', order: data.length + 1, active: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
        </div>
        <button 
          onClick={handleAdd}
          className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto px-6 py-4 gap-2 no-scrollbar bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        {[
          { id: 'plans', label: 'Plans', icon: Package },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'faqs', label: 'FAQs', icon: HelpCircle },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'referrals', label: 'Referrals', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300"
              >
                {editingId === item.id ? (
                  <div className="space-y-4">
                    {activeTab === 'plans' && (
                      <div className="grid grid-cols-2 gap-4">
                        <input className="col-span-2 p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Plan Name" />
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} placeholder="Price" />
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.daily_return} onChange={e => setEditForm({...editForm, daily_return: Number(e.target.value)})} placeholder="Daily Return" />
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.total_return} onChange={e => setEditForm({...editForm, total_return: Number(e.target.value)})} placeholder="Total Return" />
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.duration} onChange={e => setEditForm({...editForm, duration: Number(e.target.value)})} placeholder="Duration" />
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={editForm.popular} onChange={e => setEditForm({...editForm, popular: e.target.checked})} /> Popular
                        </label>
                      </div>
                    )}
                    {activeTab === 'payments' && (
                      <div className="grid grid-cols-2 gap-4">
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Method Name" />
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.logo_url} onChange={e => setEditForm({...editForm, logo_url: e.target.value})} placeholder="Logo URL" />
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.account_number} onChange={e => setEditForm({...editForm, account_number: e.target.value})} placeholder="Account Number" />
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.account_title} onChange={e => setEditForm({...editForm, account_title: e.target.value})} placeholder="Account Title" />
                        <input className="col-span-2 p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.bank_name} onChange={e => setEditForm({...editForm, bank_name: e.target.value})} placeholder="Bank Name (Optional)" />
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.checked})} /> Active
                        </label>
                      </div>
                    )}
                    {activeTab === 'faqs' && (
                      <div className="space-y-4">
                        <input className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.question} onChange={e => setEditForm({...editForm, question: e.target.value})} placeholder="Question" />
                        <textarea className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.answer} onChange={e => setEditForm({...editForm, answer: e.target.value})} placeholder="Answer" rows={3} />
                        <div className="flex gap-4">
                          <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.order} onChange={e => setEditForm({...editForm, order: Number(e.target.value)})} placeholder="Order" />
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.checked})} /> Active
                          </label>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 justify-end">
                      <button onClick={handleCancel} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={20}/></button>
                      <button onClick={handleSave} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"><Save size={20}/></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {activeTab === 'plans' && item.name}
                        {activeTab === 'payments' && item.name}
                        {activeTab === 'faqs' && item.question}
                        {(activeTab === 'users' || activeTab === 'referrals') && (item.full_name || item.email)}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activeTab === 'plans' && `${item.price} PKR | ${item.duration} Days`}
                        {activeTab === 'payments' && `${item.account_number} | ${item.account_title}`}
                        {activeTab === 'faqs' && `Order: ${item.order} | ${item.active ? 'Active' : 'Inactive'}`}
                        {activeTab === 'users' && `Balance: ${item.balance} PKR | Joined: ${new Date(item.created_at).toLocaleDateString()}`}
                        {activeTab === 'referrals' && `Referred By: ${item.referred_by} | Joined: ${new Date(item.created_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    {activeTab !== 'users' && activeTab !== 'referrals' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"><Edit2 size={18}/></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            
            {isAdding && editingId === 'new' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-2xl p-4 shadow-sm transition-colors duration-300"
              >
                <div className="space-y-4">
                  {activeTab === 'plans' && (
                    <div className="grid grid-cols-2 gap-4">
                      <input className="col-span-2 p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Plan Name" />
                      <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} placeholder="Price" />
                      <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.daily_return} onChange={e => setEditForm({...editForm, daily_return: Number(e.target.value)})} placeholder="Daily Return" />
                      <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.total_return} onChange={e => setEditForm({...editForm, total_return: Number(e.target.value)})} placeholder="Total Return" />
                      <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.duration} onChange={e => setEditForm({...editForm, duration: Number(e.target.value)})} placeholder="Duration" />
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={editForm.popular} onChange={e => setEditForm({...editForm, popular: e.target.checked})} /> Popular
                      </label>
                    </div>
                  )}
                  {activeTab === 'payments' && (
                    <div className="grid grid-cols-2 gap-4">
                      <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Method Name" />
                      <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.logo_url} onChange={e => setEditForm({...editForm, logo_url: e.target.value})} placeholder="Logo URL" />
                      <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.account_number} onChange={e => setEditForm({...editForm, account_number: e.target.value})} placeholder="Account Number" />
                      <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.account_title} onChange={e => setEditForm({...editForm, account_title: e.target.value})} placeholder="Account Title" />
                      <input className="col-span-2 p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.bank_name} onChange={e => setEditForm({...editForm, bank_name: e.target.value})} placeholder="Bank Name (Optional)" />
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.checked})} /> Active
                      </label>
                    </div>
                  )}
                  {activeTab === 'faqs' && (
                    <div className="space-y-4">
                      <input className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.question} onChange={e => setEditForm({...editForm, question: e.target.value})} placeholder="Question" />
                      <textarea className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" value={editForm.answer} onChange={e => setEditForm({...editForm, answer: e.target.value})} placeholder="Answer" rows={3} />
                      <div className="flex gap-4">
                        <input className="p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700" type="number" value={editForm.order} onChange={e => setEditForm({...editForm, order: Number(e.target.value)})} placeholder="Order" />
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.checked})} /> Active
                        </label>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 justify-end">
                    <button onClick={handleCancel} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={20}/></button>
                    <button onClick={handleSave} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"><Save size={20}/></button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
