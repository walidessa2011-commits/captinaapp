"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MapPin, Plus, Trash2, ChevronLeft, Map, 
    Navigation2, Home, Briefcase, Globe, Info,
    X, CheckCircle2, AlertCircle, Save
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    collection, query, where, getDocs, 
    addDoc, deleteDoc, doc, serverTimestamp, 
    onSnapshot, updateDoc, writeBatch 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function MyAddresses() {
    const { t, language, darkMode, setAlert } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        type: 'home', // home, work, other
        details: '',
        city: '',
        lat: null,
        lng: null
    });

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            const q = query(collection(db, "addresses"), where("userId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const addrs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAddresses(addrs);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user, loadingAuth, router]);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.details) {
            setAlert({
                show: true,
                message: language === 'ar' ? 'يرجى إكمال البيانات' : 'Please complete all fields',
                type: 'error'
            });
            return;
        }

        try {
            const isFirst = addresses.length === 0;
            await addDoc(collection(db, "addresses"), {
                ...formData,
                userId: user.uid,
                isPrimary: isFirst,
                createdAt: serverTimestamp()
            });
            setIsAdding(false);
            setFormData({ title: '', type: 'home', details: '', city: '', lat: null, lng: null });
            setAlert({
                show: true,
                message: language === 'ar' ? 'تم إضافة العنوان بنجاح' : 'Address added successfully',
                type: 'success'
            });
        } catch (error) {
            console.error("Error adding address:", error);
            setAlert({
                show: true,
                message: language === 'ar' ? 'فشل حفظ العنوان' : 'Failed to save address',
                type: 'error'
            });
        }
    };

    const handleSetPrimary = async (id) => {
        try {
            const batch = writeBatch(db);
            
            // Remove primary from all others
            addresses.forEach(addr => {
                if (addr.isPrimary) {
                    batch.update(doc(db, "addresses", addr.id), { isPrimary: false });
                }
            });

            // Set new primary
            batch.update(doc(db, "addresses", id), { isPrimary: true });
            
            await batch.commit();
            
            setAlert({
                show: true,
                message: language === 'ar' ? 'تم تعيين العنوان كعنوان أساسي' : 'Primary address updated',
                type: 'success'
            });
        } catch (error) {
            console.error("Error setting primary address:", error);
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            await deleteDoc(doc(db, "addresses", id));
            setAlert({
                show: true,
                message: language === 'ar' ? 'تم حذف العنوان' : 'Address deleted',
                type: 'success'
            });
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData(prev => ({
                    ...prev,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }));
                setAlert({
                    show: true,
                    message: language === 'ar' ? 'تم تحديد موقعك بدقة' : 'Location determined accurately',
                    type: 'success'
                });
            }, () => {
                setAlert({
                    show: true,
                    message: language === 'ar' ? 'تعذر الوصول للموقع' : 'Could not access location',
                    type: 'error'
                });
            });
        }
    };

    if (loadingAuth || loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-[#001f3f]' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#001f3f]' : 'bg-gray-50'} pb-40`}>
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-50">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#001f3f]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-all active:scale-95"
                        >
                            <ChevronLeft className={`w-6 h-6 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                {language === 'ar' ? 'عناويني' : 'My Addresses'}
                            </h1>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                {language === 'ar' ? 'عناوين التوصيل والخدمات' : 'Shipping & Service Gateways'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-6 relative z-10">
                {/* Empty State */}
                {addresses.length === 0 && !isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] p-12 border border-dashed border-gray-200 dark:border-white/10 text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                            {language === 'ar' ? 'لا يوجد عناوين مسجلة' : 'No Saved Addresses'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold max-w-[280px] mx-auto mb-8">
                            {language === 'ar' ? 'أضف عناوينك لتسهيل عملية طلب المنتجات وتدريب الكباتن' : 'Save your locations for faster shipping and trainer bookings'}
                        </p>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                        >
                            {language === 'ar' ? 'أضف عنوانك الأول' : 'Add Your First Address'}
                        </button>
                    </motion.div>
                )}

                {/* Addresses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {addresses.map((addr) => (
                            <motion.div 
                                key={addr.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-white/90 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-premium group hover:border-emerald-500/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${
                                            addr.type === 'home' ? 'bg-blue-500/10 text-blue-500' :
                                            addr.type === 'work' ? 'bg-amber-500/10 text-amber-500' :
                                            'bg-purple-500/10 text-purple-500'
                                        }`}>
                                            {addr.type === 'home' ? <Home className="w-4 h-4" /> :
                                             addr.type === 'work' ? <Briefcase className="w-4 h-4" /> :
                                             <MapPin className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{addr.title}</h3>
                                            <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{addr.type}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-tight text-start">{addr.details}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {addr.lat && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                                <Navigation2 className="w-2.5 h-2.5 text-emerald-500" />
                                                <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
                                                    {language === 'ar' ? 'محدد' : 'Pinned'}
                                                </span>
                                            </div>
                                        )}
                                        {addr.isPrimary ? (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-primary text-white rounded-lg shadow-lg shadow-primary/20">
                                                <CheckCircle2 className="w-2.5 h-2.5" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">
                                                    {language === 'ar' ? 'أساسي' : 'Primary'}
                                                </span>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleSetPrimary(addr.id)}
                                                className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline"
                                            >
                                                {language === 'ar' ? 'تعيين كعنوان أساسي' : 'Set as Primary'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                {/* Floating Add Button specifically positioned high enough to clear bottom nav */}
                <div className="fixed bottom-32 left-0 right-0 z-40 px-6 flex justify-center pointer-events-none">
                    <motion.button 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                        className="pointer-events-auto flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-3xl shadow-2xl shadow-primary/40 text-xs font-black uppercase tracking-[0.2em] border border-white/20"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{language === 'ar' ? 'إضافة عنوان جديد' : 'Add New Address'}</span>
                    </motion.button>
                </div>

                {/* Add Address Modal */}
                <AnimatePresence>
                    {isAdding && (
                        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsAdding(false)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            ></motion.div>
                            
                            <motion.div 
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                className="bg-white dark:bg-[#1a2235] w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 relative z-10 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {language === 'ar' ? 'إضافة عنوان جديد' : 'Pin New Address'}
                                    </h2>
                                    <button 
                                        onClick={() => setIsAdding(false)}
                                        className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl hover:text-rose-500 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddAddress} className="space-y-6">
                                    <div className="grid grid-cols-3 gap-3">
                                        {['home', 'work', 'other'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type })}
                                                className={`py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    formData.type === type 
                                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500'
                                                }`}
                                            >
                                                {type === 'home' ? (language === 'ar' ? 'المنزل' : 'Home') :
                                                 type === 'work' ? (language === 'ar' ? 'العمل' : 'Work') :
                                                 (language === 'ar' ? 'أخرى' : 'Other')}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <input 
                                                type="text"
                                                placeholder={language === 'ar' ? 'اسم العنوان (مثال: منزلي)' : 'Address Title (e.g. My Flat)'}
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <textarea 
                                                placeholder={language === 'ar' ? 'العنوان بالتفصيل (الحي، الشارع، رقم المبنى)' : 'Exact Details (Neighborhood, St, Building)'}
                                                rows={3}
                                                value={formData.details}
                                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                            />
                                        </div>

                                        {/* Map Simulation Picker */}
                                        <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 group">
                                            <div className="h-32 bg-slate-200 dark:bg-white/10 flex flex-col items-center justify-center text-center p-4">
                                                <div className="absolute inset-0 opacity-20 grayscale">
                                                    <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600" className="w-full h-full object-cover" alt="Map" />
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={handleGetLocation}
                                                    className="relative z-10 flex items-center gap-2 bg-white/90 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest text-primary shadow-lg"
                                                >
                                                    <Navigation2 className="w-4 h-4" />
                                                    {language === 'ar' ? 'تحديد مكاني الحالي' : 'Use Current Live Location'}
                                                </button>
                                                {formData.lat && (
                                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-emerald-500 rounded-lg text-[8px] font-black text-white uppercase tracking-tighter">
                                                        GPS {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                                    >
                                        <Save className="w-4 h-4" />
                                        {language === 'ar' ? 'حفظ العنوان' : 'Verify & Save Address'}
                                    </button>

                                    {/* Added spacing to clear bottom navigation on mobile */}
                                    <div className="h-20 md:hidden"></div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
