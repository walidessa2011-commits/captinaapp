"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyBookings() {
    const { t, language, darkMode } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const content = t('bookingsPage');

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }

        const fetchBookings = async () => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "bookings"),
                        where("userId", "==", user.uid),
                        orderBy("createdAt", "desc")
                    );
                    const querySnapshot = await getDocs(q);
                    const data = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        // Fallback labels for UI if fields missing
                        service: doc.data().serviceName || (language === 'ar' ? "جلسة تدريبية" : "Training Session"),
                        trainer: doc.data().trainerName || (language === 'ar' ? "كابتن الرياضي" : "Coach"),
                        date: doc.data().date || (language === 'ar' ? "غير محدد" : "Not set"),
                        time: doc.data().time || "---",
                        location: doc.data().location || (language === 'ar' ? "نادي كابتينا" : "Captina Club"),
                        status: doc.data().statusText || content.status
                    }));
                    setBookings(data);
                } catch (error) {
                    console.error("Error fetching bookings:", error);
                    // Keep dummy data if collection doesn't exist yet for demonstration
                    if (bookings.length === 0) {
                        setBookings([
                             { 
                                id: 1, 
                                service: language === 'ar' ? "تدريب شخصي - ملاكمة" : "Personal Training - Boxing", 
                                trainer: language === 'ar' ? "كابتن أحمد" : "Coach Ahmed", 
                                date: language === 'ar' ? "25 مارس 2026" : "March 25, 2026", 
                                time: "06:00 PM", 
                                location: language === 'ar' ? "الصالة الرئيسية - فرع الملقا" : "Main Hall - Al Malqa Branch",
                                status: content.status
                            }
                        ]);
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBookings();
    }, [user, loadingAuth, router, language, content.status]);

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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {bookings.length > 0 ? bookings.map((booking, idx) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`${darkMode ? 'bg-[#1a2235]/40 backdrop-blur-3xl' : 'bg-white shadow-xl'} rounded-[2.5rem] p-6 border ${darkMode ? 'border-white/5' : 'border-gray-100'} flex flex-col md:flex-row gap-6 items-center`}
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shrink-0">
                                <Calendar className="w-10 h-10" />
                            </div>
                            
                            <div className="flex-grow text-center md:text-start">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{booking.service}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
                                        <User className="w-4 h-4 text-primary" />
                                        <span>{booking.trainer}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span>{booking.date} | {booking.time}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm md:col-span-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{booking.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 space-y-3 w-full md:w-auto">
                                <div className="bg-emerald-100 text-emerald-600 px-6 py-2 rounded-full text-xs font-black text-center">
                                    {booking.status}
                                </div>
                                <button className="w-full bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 font-bold py-2 rounded-xl text-xs hover:bg-rose-50 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100">
                                    {language === 'ar' ? 'إلغاء الحجز' : 'Cancel Booking'}
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-20 text-center shadow-xl">
                            <Calendar className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                            <p className="text-gray-500 font-bold">{content.empty}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
