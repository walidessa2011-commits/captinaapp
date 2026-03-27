"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ChevronLeft, 
    Phone, 
    MessageCircle, 
    MapPin, 
    CheckCircle2, 
    FileText,
    Activity,
    Dumbbell,
    MoreVertical,
    Plus,
    X,
    ClipboardCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ClientDetailsContent({ params }) {
    const { language, darkMode, setAlert, user } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview'); // overview, history, notes

    const [client, setClient] = useState(null);
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAttendance, setMarkingAttendance] = useState(false);

    useEffect(() => {
        if (!params?.id) return;
        
        let unsubSub;
        let unsubAttendance;

        const fetchData = async () => {
            try {
                // Fetch User Info
                const userDoc = await getDoc(doc(db, "users", params.id));
                if (userDoc.exists()) {
                    setClient({ id: userDoc.id, ...userDoc.data() });
                }

                // Listen for Active Subscription
                const subQuery = query(
                    collection(db, "subscriptions"),
                    where("userId", "==", params.id),
                    where("status", "in", ["active", "confirmed"]),
                    orderBy("createdAt", "desc"),
                    limit(1)
                );
                
                unsubSub = onSnapshot(subQuery, (snap) => {
                    if (!snap.empty) {
                        setActiveSubscription({ id: snap.docs[0].id, ...snap.docs[0].data() });
                    } else {
                        setActiveSubscription(null);
                    }
                });

                // Listen for Attendance History
                const attQuery = query(
                    collection(db, "attendance"),
                    where("userId", "==", params.id),
                    orderBy("date", "desc")
                );

                unsubAttendance = onSnapshot(attQuery, (snap) => {
                    const history = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                    setAttendanceHistory(history);
                });

                setLoading(false);
            } catch (err) {
                console.error("Error fetching client data:", err);
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            if (unsubSub) unsubSub();
            if (unsubAttendance) unsubAttendance();
        };
    }, [params]);

    const handleMarkAttendance = async () => {
        if (!activeSubscription || !client || markingAttendance) return;
        
        setAlert({
            title: language === 'ar' ? 'تأكيد الحضور' : 'Confirm Attendance',
            message: language === 'ar' ? 'هل أنت متأكد من تسجيل حضور المتدرب لهذه الجلسة؟' : 'Are you sure you want to mark attendance for this session?',
            type: 'confirm',
            onConfirm: async () => {
                setMarkingAttendance(true);
                try {
                    // Update Subscription
                    const subRef = doc(db, "subscriptions", activeSubscription.id);
                    const currentConsumed = activeSubscription.consumedSessions || 0;
                    const totalSess = activeSubscription.totalSessions || parseInt(activeSubscription.planLabel?.match(/\d+/)?.[0] || 12);
                    
                    const newConsumed = currentConsumed + 1;
                    const updates = { consumedSessions: newConsumed };
                    
                    if (newConsumed >= totalSess) {
                        updates.status = 'expired';
                    }

                    await updateDoc(subRef, updates);

                    // Add Attendance Record
                    await addDoc(collection(db, "attendance"), {
                        userId: client.id,
                        trainerId: user?.uid || null,
                        subscriptionId: activeSubscription.id,
                        date: serverTimestamp(),
                        status: 'attended',
                        notes: ''
                    });

                    setAlert({
                        title: language === 'ar' ? 'تم بنجاح' : 'Success',
                        message: language === 'ar' ? 'تم تسجيل حضور المتدرب بنجاح' : 'Client attendance recorded successfully',
                        type: 'success'
                    });

                } catch (err) {
                    console.error("Error marking attendance:", err);
                    setAlert({
                        title: language === 'ar' ? 'خطأ' : 'Error',
                        message: language === 'ar' ? 'حدث خطأ أثناء تسجيل الحضور' : 'Error recording attendance',
                        type: 'error'
                    });
                } finally {
                    setMarkingAttendance(false);
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 pb-32 max-w-lg mx-auto">
                 <div className="w-8 h-8 border-4 border-[#E51B24] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 pb-32 max-w-lg mx-auto">
                 <p className={darkMode ? 'text-white' : 'text-slate-900'}>{language === 'ar' ? 'المتدرب غير موجود' : 'Client not found'}</p>
            </div>
        );
    }

    const totalSess = activeSubscription ? (activeSubscription.totalSessions || parseInt(activeSubscription.planLabel?.match(/\d+/)?.[0] || 12)) : 0;
    const consumedSess = activeSubscription?.consumedSessions || 0;
    const remaining = Math.max(0, totalSess - consumedSess);
    const progress = totalSess > 0 ? Math.round((consumedSess / totalSess) * 100) : 0;

    return (
        <div className={`p-6 pb-32 max-w-lg mx-auto space-y-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}
                >
                    <ChevronLeft className={`w-5 h-5 ${language === 'en' ? '' : 'rotate-180'}`} />
                </button>
                <h2 className="text-xl font-black italic uppercase tracking-wider">{language === 'ar' ? 'ملف المتدرب' : 'Client Profile'}</h2>
                <button className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                    <MoreVertical className="w-5 h-5 opacity-40" />
                </button>
            </div>

            {/* Profile Info Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-[3rem] border relative overflow-hidden text-center space-y-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-xl'}`}
            >
                <div className="relative inline-flex mx-auto">
                    <img src={client.photoURL || client.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200"} alt="" className="w-24 h-24 rounded-[2rem] object-cover border-4 border-[#E51B24]/20" />
                    <div className="absolute -bottom-2 -right-2 bg-[#E51B24] p-2 rounded-xl shadow-lg">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-2xl font-black italic">{client.fullName || client.name || 'Unnamed Client'}</h3>
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
                        {activeSubscription?.sportName || (language === 'ar' ? 'رياضة' : 'Sport')} • {activeSubscription?.planLabel || (language === 'ar' ? 'باقة' : 'Package')}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <a href={`tel:${client.phone}`} className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20">
                        <Phone className="w-4 h-4" />
                        {language === 'ar' ? 'اتصال' : 'Call'}
                    </a>
                    <a href={`https://wa.me/${client.phone?.replace('+', '')}`} className="flex items-center justify-center gap-2 bg-[#E51B24] text-white py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#E51B24]/20">
                        <MessageCircle className="w-4 h-4" />
                        {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                    </a>
                </div>
            </motion.div>

            {/* Attendance Action */}
            {activeSubscription && activeSubscription.status !== 'expired' ? (
                <button
                    onClick={handleMarkAttendance}
                    disabled={markingAttendance}
                    className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white p-5 rounded-3xl font-black shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                    <ClipboardCheck className="w-6 h-6" />
                    {markingAttendance ? (language === 'ar' ? 'جاري التسجيل...' : 'Marking...') : (language === 'ar' ? 'تسجيل حضور سريع' : 'Quick Mark Attendance')}
                </button>
            ) : (
                <div className="w-full flex items-center justify-center gap-3 bg-gray-500 text-white p-5 rounded-3xl font-black shadow-lg opacity-50 cursor-not-allowed">
                    <X className="w-6 h-6" />
                    {language === 'ar' ? 'لا يوجد اشتراك نشط لتسجيل الحضور' : 'No active subscription to mark attendance'}
                </div>
            )}

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                    <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">{language === 'ar' ? 'الجلسات المتبقية' : 'Remaining'}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black italic text-[#E51B24]">{remaining}</span>
                        <span className="text-xs font-bold opacity-20">/ {totalSess}</span>
                    </div>
                </div>
                <div className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                    <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">{language === 'ar' ? 'نسبة الإنجاز' : 'Completion'}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black italic text-emerald-500">{progress}%</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                {['overview', 'history', 'notes'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#E51B24]' : 'opacity-40'}`}
                    >
                        {tab === 'overview' ? (language === 'ar' ? 'نظرة عامة' : 'Details') : tab === 'history' ? (language === 'ar' ? 'السجل' : 'History') : (language === 'ar' ? 'ملاحظات' : 'Notes')}
                        {activeTab === tab && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E51B24]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <div className={`p-5 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'موقع المتدرب' : 'Client Location'}</p>
                                <p className="text-xs font-black italic">{client.address || client.city || (language === 'ar' ? 'غير متوفر' : 'Not Provided')}</p>
                            </div>
                        </div>
                        <div className={`p-5 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                            <div className="w-10 h-10 rounded-xl bg-[#E51B24]/10 flex items-center justify-center">
                                <Dumbbell className="w-5 h-5 text-[#E51B24]" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'هدف التدريب' : 'Training Focus'}</p>
                                <p className="text-xs font-black italic">{client.goal || (language === 'ar' ? 'غير متوفر' : 'Not Provided')}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-3">
                        {attendanceHistory.map(item => {
                            let formattedDate = '';
                            let formattedTime = '';
                            
                            if (item.date) {
                                // Handle both Firestore Timestamp and regular Date objects
                                const dateObj = item.date.toDate ? item.date.toDate() : new Date(item.date);
                                
                                formattedDate = dateObj.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                                formattedTime = dateObj.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                            } else {
                                formattedDate = language === 'ar' ? 'غير متوفر' : 'N/A';
                                formattedTime = '';
                            }

                            return (
                                <div key={item.id} className={`p-4 rounded-3xl border flex items-center justify-between ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'} ${item.status === 'missed' ? 'opacity-40' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'attended' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {item.status === 'attended' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black italic">{formattedDate}</p>
                                            <p className="text-[9px] font-bold opacity-40">{formattedTime}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black opacity-20 uppercase">#{item.id.slice(0, 6)}</span>
                                </div>
                            );
                        })}
                        {attendanceHistory.length === 0 && (
                            <p className="text-center text-xs font-bold opacity-40 py-8">{language === 'ar' ? 'لا يوجد سجل حضور' : 'No attendance history'}</p>
                        )}
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="space-y-4">
                        <p className="text-center text-xs font-bold opacity-40 py-8">{language === 'ar' ? 'لا توجد ملاحظات بعد' : 'No notes yet'}</p>
                        <button className="w-full py-4 rounded-3xl border border-dashed border-white/20 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            {language === 'ar' ? 'إضافة ملاحظة' : 'Add Private Note'}
                        </button>
                    </div>
                )}
            </div>
            
            <div className={`fixed top-0 right-0 w-[400px] h-[400px] blur-[150px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>
        </div>
    );
}
