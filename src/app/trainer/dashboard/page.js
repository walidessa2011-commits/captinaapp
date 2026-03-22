"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    Clock, 
    MapPin, 
    Plus, 
    QrCode, 
    Timer,
    ChevronRight,
    Star,
    Award,
    Bell,
    CheckCircle2,
    User,
    Dumbbell
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import QRScanner from '@/components/trainer/QRScanner';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function TrainerDashboard() {
    const { language, darkMode, userData } = useApp();
    const [authUser] = useAuthState(auth);
    const [stats, setStats] = useState({
        todaySessions: 0,
        activeSubscribers: 0,
        pendingBookings: 0,
        monthlyEarnings: 0
    });
    const [nextSession, setNextSession] = useState(null);
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScanner, setShowScanner] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications] = useState([
        { id: 1, title: language === 'ar' ? 'جلسة جديدة' : 'New Session', body: language === 'ar' ? 'تم حجز حصة جديدة' : 'New session booked', time: '2m ago' },
        { id: 2, title: language === 'ar' ? 'تم الدفع' : 'Payment Received', body: language === 'ar' ? 'تم استلام ١٥٠ ر.س' : 'Received 150 SAR', time: '1h ago' }
    ]);

    const getText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') return field[language] || field['ar'] || field['en'] || '';
        return field;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!authUser) return;
            setLoading(true);
            const uid = authUser.uid;

            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayStr = today.toISOString().split('T')[0];

                // 1. Today's Sessions (bookings for today)
                let todaySessions = 0;
                try {
                    const bookingsRef = collection(db, "bookings");
                    const bookingsQ = query(
                        bookingsRef,
                        where("trainer.id", "==", uid),
                        where("status", "in", ["confirmed", "pending"]),
                        limit(50)
                    );
                    const bookingsSnap = await getDocs(bookingsQ);
                    // Filter for today's bookings
                    bookingsSnap.docs.forEach(doc => {
                        const data = doc.data();
                        const bookingDate = data.date?.toDate?.() ? data.date.toDate() : new Date(data.date);
                        if (bookingDate.toISOString().split('T')[0] === todayStr) {
                            todaySessions++;
                        }
                    });
                } catch (e) { console.error("Bookings query error:", e); }

                // 2. Active Subscribers
                let activeSubscribers = 0;
                try {
                    const subsRef = collection(db, "subscriptions");
                    const subsQ = query(
                        subsRef,
                        where("trainerId", "==", uid),
                        where("status", "==", "confirmed")
                    );
                    const subsSnap = await getDocs(subsQ);
                    activeSubscribers = subsSnap.size;
                } catch (e) { console.error("Subs query error:", e); }

                // 3. Pending Bookings
                let pendingBookings = 0;
                try {
                    const pendingRef = collection(db, "bookings");
                    const pendingQ = query(
                        pendingRef,
                        where("trainer.id", "==", uid),
                        where("status", "==", "pending")
                    );
                    const pendingSnap = await getDocs(pendingQ);
                    pendingBookings = pendingSnap.size;
                } catch (e) { console.error("Pending query error:", e); }

                // 4. Monthly Earnings (sum of confirmed subscription amounts this month)
                let monthlyEarnings = 0;
                try {
                    const subsRef2 = collection(db, "subscriptions");
                    const earningsQ = query(
                        subsRef2,
                        where("trainerId", "==", uid),
                        where("status", "==", "confirmed")
                    );
                    const earningsSnap = await getDocs(earningsQ);
                    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    earningsSnap.docs.forEach(doc => {
                        const data = doc.data();
                        const createdAt = data.createdAt?.toDate?.() ? data.createdAt.toDate() : null;
                        if (createdAt && createdAt >= firstOfMonth) {
                            monthlyEarnings += (data.amount || data.price || 0);
                        }
                    });
                } catch (e) { console.error("Earnings query error:", e); }

                setStats({ todaySessions, activeSubscribers, pendingBookings, monthlyEarnings });

                // 5. Next Session — first upcoming booking
                try {
                    const nextRef = collection(db, "bookings");
                    const nextQ = query(
                        nextRef,
                        where("trainer.id", "==", uid),
                        where("status", "in", ["confirmed", "pending"]),
                        orderBy("createdAt", "desc"),
                        limit(1)
                    );
                    const nextSnap = await getDocs(nextQ);
                    if (!nextSnap.empty) {
                        const d = nextSnap.docs[0].data();
                        setNextSession({
                            traineeName: d.userName || d.traineeName || (language === 'ar' ? 'متدرب' : 'Trainee'),
                            sport: getText(d.sportName) || getText(d.sport) || '',
                            time: d.timeSlot || d.time || '--:--',
                            location: getText(d.locationType) || (language === 'ar' ? 'غير محدد' : 'Not specified'),
                        });
                    }
                } catch (e) { console.error("Next session query error:", e); }

                // 6. Recent Attendance
                try {
                    const attRef = collection(db, "attendance");
                    const attQ = query(
                        attRef,
                        where("trainerId", "==", uid),
                        orderBy("scanTime", "desc"),
                        limit(5)
                    );
                    const attSnap = await getDocs(attQ);
                    setRecentAttendance(attSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                } catch (e) { console.error("Attendance query error:", e); }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [authUser, language]);

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`p-4 rounded-[2rem] border backdrop-blur-md flex flex-col gap-3 transition-all ${darkMode ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-black/5'}`}
        >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
                <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{label}</p>
                <p className="text-xl font-black italic">{loading ? '...' : value}</p>
            </div>
        </motion.div>
    );

    const QuickAction = ({ icon: Icon, label, color, onClick }) => (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col items-center gap-3 group"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${color} group-hover:shadow-[0_0_20px_rgba(229,27,36,0.2)]`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</span>
        </motion.button>
    );

    return (
        <div className="p-6 pb-32 max-w-lg mx-auto space-y-8">
            {/* Header Greeting */}
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black italic uppercase">
                        {language === 'ar' ? `أهلاً، كابتن` : `Welcome, Coach`}
                    </h2>
                    <p className={`text-xs font-bold opacity-40`}>
                        {language === 'ar' ? 'جاهز لجلسة اليوم؟' : "Ready for today's sessions?"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all relative ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-sm'}`}
                    >
                        <Bell className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity" />
                        <div className="absolute top-3 right-3 w-2 h-2 bg-[#E51B24] rounded-full border-2 border-[#0D0D0F]"></div>
                    </button>
                    <div className="relative group">
                        <div className="w-14 h-14 rounded-2xl border-2 border-[#E51B24] p-1 overflow-hidden transition-all duration-500 group-hover:scale-105">
                            <img 
                                src={userData?.photoURL || authUser?.photoURL || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=200"} 
                                alt="Profile" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Notifications Dropdown */}
            <AnimatePresence>
                {showNotifications && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'} space-y-3`}
                    >
                        {notifications.map(n => (
                            <div key={n.id} className="flex items-start justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="text-[10px] font-black italic">{n.title}</h4>
                                    <p className="text-[9px] font-bold opacity-40">{n.body}</p>
                                </div>
                                <span className="text-[8px] opacity-20">{n.time}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-2 gap-4">
                <StatCard 
                    icon={Calendar} 
                    label={language === 'ar' ? 'جلسات اليوم' : 'Today Sessions'} 
                    value={stats.todaySessions} 
                    color="bg-blue-500 shadow-blue-500/20"
                />
                <StatCard 
                    icon={Users} 
                    label={language === 'ar' ? 'المشتركون' : 'Subscribers'} 
                    value={stats.activeSubscribers} 
                    color="bg-emerald-500 shadow-emerald-500/20"
                />
                <StatCard 
                    icon={Timer} 
                    label={language === 'ar' ? 'طلبات معلقة' : 'Pending'} 
                    value={stats.pendingBookings} 
                    color="bg-amber-500 shadow-amber-500/20"
                />
                <StatCard 
                    icon={TrendingUp} 
                    label={language === 'ar' ? 'الدخل الشهري' : 'Monthly'} 
                    value={`${stats.monthlyEarnings} ${language === 'ar' ? 'ر.س' : 'SAR'}`} 
                    color="bg-[#E51B24] shadow-[#E51B24]/20"
                />
            </section>

            {/* Next Up Card */}
            {nextSession && (
                <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 px-2">{language === 'ar' ? 'الجلسة القادمة' : 'Next Up'}</h3>
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-6 rounded-[2.5rem] border relative overflow-hidden ${darkMode ? 'bg-white/5 border-white/10 shadow-2xl shadow-black/80' : 'bg-white border-black/5 shadow-xl shadow-black/5'}`}
                    >
                        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[#E51B24]/10 border border-[#E51B24]/20">
                            <span className="text-[10px] font-black text-[#E51B24] uppercase tracking-wider">{nextSession.time}</span>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                                    <Users className="w-6 h-6 text-[#E51B24]" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-lg">{nextSession.traineeName}</h4>
                                    <div className="flex items-center gap-2 opacity-40 text-xs font-bold">
                                        <Award className="w-3 h-3" />
                                        <span>{nextSession.sport}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-2xl flex items-center justify-between ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-[#E51B24]" />
                                    <span className="text-xs font-bold">{nextSession.location}</span>
                                </div>
                                <motion.button 
                                    whileHover={{ x: 5 }}
                                    className="p-2 rounded-xl bg-[#E51B24] text-white shadow-lg shadow-[#E51B24]/20"
                                >
                                    <ChevronRight className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />
                                </motion.button>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#E51B24]/10 blur-3xl rounded-full"></div>
                    </motion.div>
                </section>
            )}

            {/* Recent Attendance Log */}
            {recentAttendance.length > 0 && (
                <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 px-2">{language === 'ar' ? 'سجل الحضور الأخير' : 'Recent Attendance'}</h3>
                    <div className="space-y-3">
                        {recentAttendance.map(att => (
                            <motion.div 
                                key={att.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-2xl border flex items-center gap-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-xs font-black ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>
                                        {att.traineeName || (language === 'ar' ? 'متدرب' : 'Trainee')}
                                    </h4>
                                    <p className="text-[10px] font-bold text-gray-500">
                                        {att.date} {att.sportName ? `• ${getText(att.sportName)}` : ''}
                                    </p>
                                </div>
                                {att.subscriptionValid ? (
                                    <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase">
                                        {language === 'ar' ? 'مشترك' : 'Active'}
                                    </span>
                                ) : (
                                    <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg uppercase">
                                        {language === 'ar' ? 'زائر' : 'Guest'}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Actions */}
            <section className="space-y-6 pt-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 px-2">{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
                <div className="grid grid-cols-3 gap-6">
                    <QuickAction 
                        icon={Plus} 
                        label={language === 'ar' ? 'إضافة متدرب' : 'Add Trainee'} 
                        color="bg-white/10" 
                        onClick={() => {}}
                    />
                    <QuickAction 
                        icon={Clock} 
                        label={language === 'ar' ? 'حظر وقت' : 'Block Time'} 
                        color="bg-white/10" 
                        onClick={() => {}}
                    />
                    <QuickAction 
                        icon={QrCode} 
                        label={language === 'ar' ? 'مسح QR' : 'Scan Code'} 
                        color="bg-[#E51B24]" 
                        onClick={() => setShowScanner(true)}
                    />
                </div>
            </section>

            {/* Background Effects */}
            <div className={`fixed top-0 right-0 w-[400px] h-[400px] blur-[150px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>

            <AnimatePresence>
                {showScanner && (
                    <QRScanner 
                        trainerId={authUser?.uid || ''}
                        trainerName={userData?.name || authUser?.displayName || ''}
                        language={language}
                        darkMode={darkMode}
                        onClose={() => setShowScanner(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
