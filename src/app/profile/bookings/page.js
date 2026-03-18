"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, MapPin, User, Info, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";

export default function MyBookings() {
    const { t, language, darkMode, setAlert } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [userData, setUserData] = useState(null);
    const content = t('bookingsPage');

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const docSnap = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
                if (!docSnap.empty) {
                    setUserData(docSnap.docs[0].data());
                }
            };
            fetchUserData();
        }
    }, [user]);

    const isAdmin = userData?.role === 'admin' || userData?.role === 'supervisor' || user?.email === 'admin@captina.sa';

    const fetchBookings = useCallback(async () => {
        if (user) {
            try {
                const q = query(
                    collection(db, "bookings"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => {
                    const d = doc.data();
                    let statusLabel = d.status;
                    if (language === 'ar') {
                        if (statusLabel === 'Confirmed' || statusLabel === 'مؤكد') statusLabel = "مؤكد";
                        else if (statusLabel === 'Pending' || statusLabel === 'قيد الانتظار') statusLabel = "قيد الانتظار";
                        else if (statusLabel === 'Cancelled' || statusLabel === 'ملغي') statusLabel = "ملغي";
                    }
                    return {
                        id: doc.id,
                        ...d,
                        service: d.serviceName || (language === 'ar' ? "جلسة تدريبية" : "Training Session"),
                        trainer: d.trainerName || (language === 'ar' ? "كابتن الرياضي" : "Coach"),
                        date: d.date || (language === 'ar' ? "غير محدد" : "Not set"),
                        time: d.time || "---",
                        location: d.location || (language === 'ar' ? "نادي كابتينا" : "Captina Club"),
                        status: statusLabel
                    };
                });
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                if (bookings.length === 0) {
                    setBookings([
                        { 
                            id: "dummy-1", 
                            service: language === 'ar' ? "تدريب شخصي - ملاكمة" : "Personal Training - Boxing", 
                            trainer: language === 'ar' ? "كابتن أحمد" : "Coach Ahmed", 
                            date: language === 'ar' ? "25 مارس 2026" : "March 25, 2026", 
                            time: "06:00 PM", 
                            location: language === 'ar' ? "الصالة الرئيسية - فرع الملقا" : "Main Hall - Al Malqa Branch",
                            status: language === 'ar' ? "مؤكد" : "Confirmed",
                            userId: user?.uid,
                            clientName: user?.displayName || "Test User",
                            notes: "This is a dummy booking for demonstration."
                        }
                    ]);
                }
            } finally {
                setLoading(false);
            }
        }
    }, [user, language]);

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }
        fetchBookings();
    }, [user, loadingAuth, router, fetchBookings]);

    const handleApprove = async (bookingId) => {
        try {
            if (typeof bookingId === 'string' && !bookingId.startsWith('dummy')) {
                const bookingRef = doc(db, "bookings", bookingId);
                await updateDoc(bookingRef, {
                    status: language === 'ar' ? "مؤكد" : "Confirmed",
                    approvedAt: serverTimestamp(),
                    approvedBy: user.uid
                });
            }
            
            setBookings(prev => prev.map(b => 
                b.id === bookingId 
                ? { ...b, status: language === 'ar' ? "مؤكد" : "Confirmed" } 
                : b
            ));
        } catch (error) {
            console.error("Error approving booking:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? "حدث خطأ أثناء قبول الحجز" : "Error approving booking",
                type: 'error'
            });
        }
    };

    const handleCancel = async (bookingId) => {
        setAlert({
            title: language === 'ar' ? 'تأكيد الإلغاء' : 'Confirm Cancellation',
            message: language === 'ar' 
                ? 'هل أنت متأكد من رغبتك في إلغاء هذه الجلسة؟ لا يمكن التراجع عن هذا الإجراء.' 
                : 'Are you sure you want to cancel this session? This action cannot be undone.',
            type: 'confirm',
            onConfirm: () => confirmCancel(bookingId)
        });
    };

    const confirmCancel = async (bookingId) => {
        if (!bookingId) return;

        try {
            const booking = bookings.find(b => b.id === bookingId);
            if (!booking) return;

            // If it's real firebase data
            if (typeof bookingId === 'string' && !bookingId.startsWith('dummy')) {
                const bookingRef = doc(db, "bookings", bookingId);
                await updateDoc(bookingRef, {
                    status: language === 'ar' ? "ملغي" : "Cancelled",
                    cancelledAt: serverTimestamp()
                });

                // Record in cancelled collection for tracking
                await setDoc(doc(collection(db, "cancelled_sessions")), {
                    bookingId,
                    userId: user.uid,
                    cancelledAt: serverTimestamp(),
                    reason: "User cancelled",
                    originalDetails: booking
                });
            }

            // Update local state
            setBookings(prev => prev.map(b => 
                b.id === bookingId 
                ? { ...b, status: language === 'ar' ? "ملغي" : "Cancelled" } 
                : b
            ));
        } catch (error) {
            console.error("Error cancelling booking:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? "حدث خطأ أثناء إلغاء الحجز" : "Error cancelling booking",
                type: 'error'
            });
        }
    };

    if (loadingAuth || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const textClass = darkMode ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-24 transition-colors relative overflow-hidden`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${darkMode ? 'bg-primary/20' : 'bg-primary/10'} rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>


            <div className="container mx-auto px-4 pt-10 relative z-20 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.length > 0 ? bookings.map((booking, idx) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setSelectedBooking(booking)}
                            className={`${darkMode ? 'bg-[#1a2235]/40 backdrop-blur-3xl' : 'bg-white shadow-lg'} rounded-[2rem] p-4 border ${darkMode ? 'border-white/5' : 'border-gray-100'} flex flex-col gap-4 hover:shadow-active transition-all cursor-pointer relative group`}
                        >
                            <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Info className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-base font-black text-gray-900 dark:text-white mb-1 truncate leading-tight">{booking.service}</h3>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-[10px]">
                                            <User className="w-3 h-3 text-primary shrink-0" />
                                            <span className="truncate">{booking.trainer}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-[10px]">
                                            <Clock className="w-3 h-3 text-primary shrink-0" />
                                            <span>{booking.date} | {booking.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-[10px]">
                                            <MapPin className="w-3 h-3 text-primary shrink-0" />
                                            <span className="truncate">{booking.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-gray-50 dark:border-white/5">
                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    booking.status === 'Cancelled' || booking.status === 'ملغي'
                                    ? 'bg-rose-100 text-rose-600'
                                    : booking.status === 'Pending' || booking.status === 'قيد الانتظار'
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                    {booking.status}
                                </div>
                                <div className="flex gap-2">
                                    {isAdmin && (booking.status === 'Pending' || booking.status === 'قيد الانتظار') && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleApprove(booking.id); }}
                                            className="bg-primary text-white font-black py-2 px-4 rounded-xl text-[9px] uppercase tracking-wider hover:bg-primary/80 transition-all shadow-md"
                                        >
                                            {language === 'ar' ? 'قبول' : 'Approve'}
                                        </button>
                                    )}
                                    {(booking.status !== 'Cancelled' && booking.status !== 'ملغي') && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleCancel(booking.id); }}
                                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black py-2 px-4 rounded-xl text-[9px] uppercase tracking-wider hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all shadow-md"
                                        >
                                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full bg-white dark:bg-slate-800 rounded-[3rem] p-12 text-center shadow-xl">
                            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">{content.empty}</p>
                        </div>
                    )}
                </div>
            {/* Session Details Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`${darkMode ? 'bg-[#1a2235]' : 'bg-white'} w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border ${darkMode ? 'border-white/10' : 'border-gray-100'}`}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <button onClick={() => setSelectedBooking(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                                    {selectedBooking.service}
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 font-black">{language === 'ar' ? 'المدرب' : 'Trainer'}</p>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-primary" />
                                                <span className="font-bold text-xs text-gray-700 dark:text-gray-200">{selectedBooking.trainer}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 font-black">{language === 'ar' ? 'الحالة' : 'Status'}</p>
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                                                <span className="font-bold text-xs text-gray-700 dark:text-gray-200">{selectedBooking.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <div>
                                                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black">{language === 'ar' ? 'التاريخ والوقت' : 'Date & Time'}</p>
                                                <p className="font-bold text-xs text-gray-700 dark:text-gray-200">{selectedBooking.date} | {selectedBooking.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <div>
                                                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black">{language === 'ar' ? 'الموقع' : 'Location'}</p>
                                                <p className="font-bold text-xs text-gray-700 dark:text-gray-200">{selectedBooking.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedBooking.notes && (
                                        <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10">
                                            <p className="text-[9px] uppercase tracking-widest text-primary mb-1 font-black">{language === 'ar' ? 'ملاحظات إضافية' : 'Extra Notes'}</p>
                                            <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300 italic">"{selectedBooking.notes}"</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-6">
                                        {isAdmin && (selectedBooking.status === 'Pending' || selectedBooking.status === 'قيد الانتظار') && (
                                            <button 
                                                onClick={() => { handleApprove(selectedBooking.id); setSelectedBooking(null); }}
                                                className="flex-1 bg-primary text-white font-black py-3 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-[10px] uppercase tracking-widest"
                                            >
                                                {language === 'ar' ? 'قبول' : 'Approve'}
                                            </button>
                                        )}
                                        {(selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'ملغي') && (
                                            <button 
                                                onClick={() => { handleCancel(selectedBooking.id); setSelectedBooking(null); }}
                                                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black py-3 rounded-xl transition-all text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white"
                                            >
                                                {language === 'ar' ? 'إلغاء الحجز' : 'Cancel'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}
