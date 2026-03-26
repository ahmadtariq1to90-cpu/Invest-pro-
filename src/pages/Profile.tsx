import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Camera, Edit2, Save, X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    country: ''
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isFirebaseConfigured && db && user?.uid) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            fullName: user?.displayName || data.fullName || '',
            email: user?.email || data.email || '',
            phone: data.phone || '',
            dob: data.dob || '',
            country: data.country || ''
          });
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        }
      }
    };
    fetchUserData();
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB for ImgBB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image is too large. Please choose an image under 5MB.');
        setTimeout(() => setError(''), 3000);
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        // Using ImgBB for free hosting
        const IMGBB_API_KEY = 'a0bef818769b760c618850ac0bfdcb9b'; 
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          const imageUrl = data.data.url;
          setProfileImage(imageUrl);
          
          if (auth?.currentUser && db) {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              profileImage: imageUrl
            });
            await updateProfile(auth.currentUser, { photoURL: imageUrl });
            setSuccess('Profile picture updated!');
            setTimeout(() => setSuccess(''), 3000);
          }
        } else {
          throw new Error(data.error?.message || "Upload failed");
        }
      } catch (err: any) {
        console.error("Profile image upload error:", err);
        setError(err.message || 'Failed to update profile picture. Please try again.');
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (isFirebaseConfigured && auth?.currentUser && db) {
        await updateProfile(auth.currentUser, { displayName: formData.fullName });
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          fullName: formData.fullName,
          phone: formData.phone,
          dob: formData.dob,
          country: formData.country
        });
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    setError('');
    setSuccess('');
    if (passwordData.new !== passwordData.confirm) {
      setError('New passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth?.currentUser && user?.email) {
        const credential = EmailAuthProvider.credential(user.email, passwordData.current);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, passwordData.new);
        setSuccess('Password updated successfully! Please login again next time.');
        setShowPasswordPanel(false);
        setPasswordData({ current: '', new: '', confirm: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Incorrect current password.');
      } else {
        setError(err.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24 relative overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app/settings')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profile</h1>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="p-2 -mr-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors">
            <Edit2 size={20} />
          </button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="p-2 -mr-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium">{success}</div>}
          
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-lg overflow-hidden">
                {profileImage || user?.photoURL ? (
                  <img src={profileImage || user?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  formData.fullName?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Camera size={14} />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">{formData.fullName || 'User Name'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{formData.email || 'user@example.com'}</p>
          </div>

          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled={true}
                  value={formData.email}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Country</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="e.g. Pakistan"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-6"
              >
                <Save size={20} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Security</h3>
            <button
              onClick={() => setShowPasswordPanel(true)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <Lock size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Change Password</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update your account password</p>
                </div>
              </div>
              <ArrowLeft size={20} className="text-slate-400 rotate-180" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Change Password Slide Panel */}
      <AnimatePresence>
        {showPasswordPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordPanel(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col transition-colors duration-300"
            >
              <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => setShowPasswordPanel(false)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Change Password</h2>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 bg-white dark:bg-slate-900 transition-colors duration-300">
                <button
                  onClick={() => setShowPasswordPanel(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800/50 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
