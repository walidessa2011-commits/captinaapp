"use client";
import { motion } from "framer-motion";
import { 
    User, Settings, Package, Calendar, LogOut, ChevronLeft, ChevronRight,
    TrendingUp, Target, MapPin, ShoppingBag, Trophy, Clock, Camera,
    Star, MessageCircle, CreditCard, ShieldCheck, Heart, Dumbbell,
    Phone, Mail, Cake, Map, Navigation2, Plus, Trash2, MapPinOff, Users, QrCode, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect, useRef } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc, getDoc, collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { storage, auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Profile() {
    const { 
        t, language, darkMode, setAlert, 
        favorites, products, toggleFavorite,
        favoriteTrainers, toggleFavoriteTrainer, trainers,
        favoriteSports, toggleFavoriteSport, sports,
        appContent,
        user, userData, loadingAuth
    } = useApp();

    const getText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') {
            return field[language] || field['ar'] || field['en'] || '';
        }
        return field;
    };
    const router = useRouter();
    const [loadingSub, setLoadingSub] = useState(true);
    const content = t('profileSections');

    const [uploading, setUploading] = useState({ profile: false, cover: false });
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const [activeSubscription, setActiveSubscription] = useState(null);
    const [upcomingSchedules, setUpcomingSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [trainingStats, setTraingStats] = useState({ sessions: 0, activeSports: 0, streak: 0 });
 
     useEffect(() => {
         if (!loadingAuth && !user) {
             router.push('/login');
             return;
         }
 
                      const fetchProfile = async () => {
             if (user) {
                 try {
                     // Fetch latest subscription
                     const subsRef = collection(db, "subscriptions");
                     const q = query(
                         subsRef, 
                         where("userId", "==", user.uid),
                         orderBy("createdAt", "desc"),
                         limit(1)
                     );
                     const subSnap = await getDocs(q);
                     if (!subSnap.empty) {
                         setActiveSubscription({ id: subSnap.docs[0].id, ...subSnap.docs[0].data() });
                     }

                     // Fetch Training Schedules
                     const schedulesRef = collection(db, "training_schedules");
                     const sq = query(
                         schedulesRef,
                         where("userId", "==", user.uid)
                     );
                     const schedulesSnap = await getDocs(sq);
                     const schedulesList = schedulesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                     
                     // Logic for "Upcoming Sessions" based on current weekly cycle
                     const now = new Date();
                     const currentDayIdx = now.getDay(); // 0-6
                     const currentMinutes = now.getHours() * 60 + now.getMinutes();

                     const timeToMinutes = (timeStr) => {
                         if (!timeStr) return 0;
                         const [time, period] = timeStr.split(' ');
                         let [hours, minutes] = time.split(':').map(Number);
                         if (period === 'PM' && hours !== 12) hours += 12;
                         if (period === 'AM' && hours === 12) hours = 0;
                         return hours * 60 + (minutes || 0);
                     };

                     const sortedUpcoming = schedulesList.map(session => {
                         const sessionMinutes = timeToMinutes(session.time);
                         let daysUntil = (session.dayIdx - currentDayIdx + 7) % 7;
                         
                         // If session is today but already passed, move to next week
                         if (daysUntil === 0 && sessionMinutes <= currentMinutes) {
                             daysUntil = 7;
                         }

                         return { ...session, daysUntil, absoluteMinutes: daysUntil * 1440 + sessionMinutes };
                     }).sort((a, b) => a.absoluteMinutes - b.absoluteMinutes);

                     setUpcomingSchedules(sortedUpcoming);

                     // Fetch Dynamic Stats: Completed Sessions
                     const bookingsRef = collection(db, "bookings");
                     const completedQuery = query(
                         bookingsRef,
                         where("userId", "==", user.uid),
                         where("status", "==", "completed")
                     );
                     const completedSnap = await getDocs(completedQuery);
                     const completedCount = completedSnap.size;

                     // Update training stats state
                     setTraingStats({
                         sessions: completedCount,
                         activeSports: new Set(schedulesList.map(s => s.name_en || s.name_ar)).size,
                         streak: userData?.streak || 0 
                     });

                 } catch (error) {
                     console.error("Error fetching profile details:", error);
                 } finally {
                     setLoadingSub(false);
                     setLoadingSchedules(false);
                 }
             }
         };

         fetchProfile();
     }, [user, loadingAuth, router]);

    const handleImageUpload = async (file, type) => {
        if (!file || !user) return;
        
        setUploading(prev => ({ ...prev, [type]: true }));
        try {
            const fileRef = ref(storage, `users/${user.uid}/${type}_${Date.now()}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);

            // Update Firestore - This will trigger onSnapshot globally in AppContext
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                [type === 'profile' ? 'photoURL' : 'coverURL']: downloadURL
            });

            // Update Auth Profile for additional consistency
            if (type === 'profile') {
                await updateProfile(user, { photoURL: downloadURL });
            }

            setAlert({
                title: language === 'ar' ? 'تم التحديث' : 'Updated',
                message: language === 'ar' ? 'تم تحديث الصورة بنمساح' : 'Image updated successfully',
                type: 'success'
            });

        } catch (error) {
            console.error(`Error uploading ${type} image:`, error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading image',
                type: 'error'
            });
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleLogout = () => {
        setAlert({
            title: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
            message: language === 'ar' ? 'هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟' : 'Are you sure you want to log out from your account?',
            type: 'confirm',
            onConfirm: async () => {
                await signOut(auth);
                router.push('/login');
            }
        });
    };

    if (loadingAuth || (user && loadingSub)) {
        return (
            <div className="min-h-screen bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const trainee = {
        name: userData?.fullName || user?.displayName || (language === 'ar' ? "مستخدم جديد" : "New User"),
        email: user?.email || "No email",
        phone: userData?.phone || (language === 'ar' ? "لا يوجد رقم" : "No phone"),
        goal: userData?.goal || (language === 'ar' ? "لم يتم تحديد هدف بعد" : "No goal set yet"),
        package: userData?.package || (language === 'ar' ? "باقة تجريبية" : "Trial Package"),
        expiry: userData?.expiry || "---",
        image: userData?.photoURL || user?.photoURL || appContent?.profile_defaults?.defaultAvatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
        cover: userData?.coverURL || appContent?.profile_defaults?.defaultCover || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
        address: userData?.address || (language === 'ar' ? "لم يتم إضافة عنوان" : "No address added"),
        city: userData?.city || (language === 'ar' ? "الرياض، السعودية" : "Riyadh, KSA"),
        birthday: userData?.birthday || (language === 'ar' ? "15 مارس 1995" : "March 15, 1995"),
        sessionsCompleted: trainingStats.sessions,
        activeSports: trainingStats.activeSports,
        streak: trainingStats.streak,
        ordersCount: userData?.ordersCount || 0,
        achievementsCount: userData?.achievementsCount || 0,
        bookingsCount: userData?.bookingsCount || 0
    };

    const textClass = darkMode ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-24 transition-colors duration-300 relative overflow-hidden`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 -right-24 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px]"></div>
            </div>



            {/* Header / Cover Image - Minimized Premium Version */}
            <div className="relative mx-4 md:mx-auto max-w-2xl overflow-hidden rounded-[1.5rem] border border-gray-100 dark:border-white/10 shadow-premium group">
                <div className="relative h-20 md:h-24">
                    <img 
                        src={trainee.cover} 
                        alt="Cover" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                {/* Cover Action */}
                <button 
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute top-3 right-3 bg-white/10 backdrop-blur-xl p-2 rounded-lg text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95 shadow-lg"
                >
                    <Camera className="w-3.5 h-3.5" />
                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'cover')} />
                </button>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20 max-w-2xl">
                {/* Profile Header Card - Even More Compact */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[1.8rem] p-3 md:p-4 border border-gray-100 dark:border-white/10 mb-6 shadow-premium"
                >
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg"></div>
                            <img
                                src={trainee.image}
                                alt={trainee.name}
                                className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl border-2 border-white dark:border-[#1a2235] shadow-xl relative z-10"
                            />
                            <button 
                                onClick={() => profileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-lg shadow-lg border border-white dark:border-[#1a2235] z-20 hover:scale-110 transition-all active:scale-90"
                            >
                                <Camera className="w-3 h-3" />
                                <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'profile')} />
                            </button>
                        </div>
                        
                        <div className="flex-1 text-center md:text-start">
                             <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">{trainee.name}</h2>
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[6px] font-black uppercase tracking-widest border border-primary/20 w-fit mx-auto md:mx-0">
                                    {language === 'ar' ? 'عضو ذهبي' : 'Gold Member'}
                                </span>
                             </div>

                            {/* Contact Info Row */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2 text-[7px] font-bold text-gray-400">
                                <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 py-0.5 px-2 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
                                    <Mail className="w-2.5 h-2.5 text-primary" />
                                    <span className="opacity-80 lowercase">{trainee.email}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 py-0.5 px-2 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
                                    <Phone className="w-2.5 h-2.5 text-emerald-500" />
                                    <span className="opacity-80">{trainee.phone}</span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <div className="flex items-center gap-1 text-gray-400 font-bold text-[8px] uppercase tracking-wider">
                                    <Trophy className="w-2.5 h-2.5 text-amber-500" />
                                    <span>{language === 'ar' ? 'المستوى' : 'Level'} {Math.floor(trainee.sessionsCompleted / 5) + 1}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(trainee.sessionsCompleted % 5) / 5 * 100}%` }}
                                            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                                        ></motion.div>
                                    </div>
                                    <p className="text-[7px] font-black text-primary/60 uppercase">
                                        {5 - (trainee.sessionsCompleted % 5)} {language === 'ar' ? 'حصص للمستوى القادم' : 'to Level Up'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid - Even More Compact */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100 dark:border-white/5">
                        <div className="flex flex-col items-center">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg mb-1">
                                <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                            <div className="text-base font-black text-slate-900 dark:text-white leading-none">{trainee.sessionsCompleted}</div>
                            <div className="text-[8px] font-black text-gray-500 uppercase mt-1 tracking-wider">{content.sessionsCompleted}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg mb-1">
                                <Target className="w-3.5 h-3.5 text-indigo-500" />
                            </div>
                            <div className="text-base font-black text-slate-900 dark:text-white leading-none">{trainee.activeSports}</div>
                            <div className="text-[8px] font-black text-gray-500 uppercase mt-1 tracking-wider">{content.activeSports}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-1.5 bg-rose-500/10 rounded-lg mb-1">
                                <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                            </div>
                            <div className="text-base font-black text-slate-900 dark:text-white leading-none">{trainee.streak}</div>
                            <div className="text-[8px] font-black text-gray-500 uppercase mt-1 tracking-wider">{content.streakDays}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions Grid - Premium Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {activeSubscription ? (
                        <>
                            <button 
                                onClick={() => router.push('/profile/training?tab=classes')}
                                className="bg-primary text-white rounded-[1.5rem] p-5 flex items-center justify-center gap-3 shadow-premium hover:scale-[1.02] transition-all active:scale-95 group"
                            >
                                <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                    <Dumbbell className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                                    {t('trainingPage.tabs.classes')}
                                </span>
                            </button>
                            <button 
                                onClick={() => router.push('/profile/training?tab=programs')}
                                className="bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-gray-100 dark:border-white/10 rounded-[1.5rem] p-5 flex items-center justify-center gap-3 shadow-premium hover:bg-gray-50 dark:hover:bg-white/10 hover:scale-[1.02] transition-all active:scale-95 outline-none group"
                            >
                                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors text-primary">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                                    {t('trainingPage.tabs.programs')}
                                </span>
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => router.push('/packages')}
                            className="bg-primary text-white rounded-[1.5rem] p-5 flex items-center justify-center gap-3 shadow-premium hover:scale-[1.02] transition-all active:scale-95 group"
                        >
                            <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-wider">
                                {language === 'ar' ? 'اشترك الآن' : 'Join Now'}
                            </span>
                        </button>
                    )}
                    
                    <button 
                        onClick={() => router.push('/profile/orders')}
                        className={`bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-gray-100 dark:border-white/10 rounded-[1.5rem] p-5 flex items-center justify-center gap-3 shadow-premium hover:bg-gray-50 dark:hover:bg-white/10 hover:scale-[1.02] transition-all active:scale-95 outline-none group ${activeSubscription ? 'col-span-2' : ''}`}
                    >
                        <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-xl group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/10 transition-colors text-emerald-500">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-wider">{language === 'ar' ? 'طلباتي' : 'My Orders'}</span>
                    </button>
                    
                    <button 
                        onClick={() => router.push('/profile/card')}
                        className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-white/10 rounded-[1.5rem] p-5 flex items-center justify-center gap-3 shadow-premium hover:scale-[1.02] transition-all active:scale-95 outline-none group col-span-2"
                    >
                        <div className="p-2 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors text-primary">
                            <QrCode className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-wider">{language === 'ar' ? 'بطاقتي' : 'My Card'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Upcoming Sessions - Dynamic Data */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{content.upcomingSessions}</h3>
                                </div>
                                <Link href="/profile/training" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">{t('viewAll')}</Link>
                            </div>
                            
                            {loadingSchedules ? (
                                <div className="p-8 text-center bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto opacity-40"></div>
                                </div>
                            ) : upcomingSchedules.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingSchedules.slice(0, 2).map((session, idx) => (
                                        <motion.div 
                                            key={session.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => router.push('/profile/training')}
                                            className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium group cursor-pointer"
                                        >
                                            <div className="px-5 py-2.5 bg-primary/5 dark:bg-primary/10 flex items-center justify-between border-b border-primary/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-primary/20 rounded-lg">
                                                        <Dumbbell className="w-3.5 h-3.5 text-primary" />
                                                    </div>
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                                                        {language === 'ar' ? session.name_ar : session.name_en}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                                                        {language === 'ar' ? 'مجدولة' : 'Scheduled'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                                                    <Dumbbell className="w-6 h-6 text-primary/40" />
                                                </div>
                                                <div className="flex-1 text-start">
                                                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                                                        {language === 'ar' ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][session.dayIdx] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][session.dayIdx]}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock className="w-3 h-3 text-primary" />
                                                        <p className="text-[10px] font-bold text-gray-500 tracking-tight">{session.time}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 text-gray-300 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                    <Clock className="w-8 h-8 text-gray-200 dark:text-white/10 mx-auto mb-3" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {language === 'ar' ? 'لا توجد حصص قادمة' : 'No upcoming classes'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Package Info - Live Data Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className={`bg-gradient-to-br ${activeSubscription ? 'from-amber-500/20 to-slate-900 border-amber-500/30' : 'from-gray-500/10 to-slate-900 border-white/5'} rounded-[2rem] p-6 border relative overflow-hidden shadow-premium group`}
                        >
                            {/* Special Post-Trial Offer Badge */}
                            {!activeSubscription && userData?.has_used_trial && (
                                <div className="absolute top-0 left-0 right-0 bg-amber-500 py-1 text-center z-20">
                                    <span className="text-[9px] font-black text-black uppercase tracking-[0.2em] animate-pulse">
                                        {language === 'ar' ? 'عرض خاص: خصم 20% على باقتك الأولى!' : 'SPECIAL OFFER: 20% OFF YOUR FIRST PACKAGE!'}
                                    </span>
                                </div>
                            )}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
                            
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="text-start">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Package className={`w-4 h-4 ${activeSubscription ? 'text-amber-500' : 'text-gray-400'}`} />
                                        <h4 className={`text-xs font-black uppercase tracking-wider ${activeSubscription ? 'text-amber-500' : 'text-gray-400'}`}>
                                            {activeSubscription ? activeSubscription.planLabel : (language === 'ar' ? 'لا يوجد اشتراك نشط' : 'No Active Subscription')}
                                        </h4>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-400">
                                        {activeSubscription 
                                            ? (language === 'ar' ? `بدءاً من ${activeSubscription.startDate}` : `Starting ${activeSubscription.startDate}`)
                                            : (language === 'ar' ? 'اشترك الآن للحصول على باقة تدريب' : 'Subscribe now to get a training package')
                                        }
                                    </p>
                                </div>
                                <span className={`${activeSubscription?.status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black'} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none shadow-lg`}>
                                    {activeSubscription 
                                        ? (activeSubscription.status === 'confirmed' ? (language === 'ar' ? 'نشطة' : 'Active') : (language === 'ar' ? 'قيد المراجعة' : 'Pending'))
                                        : (language === 'ar' ? 'غير مشترك' : 'Not Joined')
                                    }
                                </span>
                            </div>
                            
                            <div className="mb-6 relative z-10">
                                <div className="flex justify-between text-[11px] font-black text-gray-300 mb-2">
                                    <span>{activeSubscription ? activeSubscription.sportName : (language === 'ar' ? '0 حصص متبقية' : '0 Sessions remaining')}</span>
                                    <span className="text-amber-500">{activeSubscription ? '100%' : '0%'}</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: activeSubscription ? '100%' : '0%' }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                    ></motion.div>
                                </div>
                            </div>
                            
                            {!activeSubscription && !userData?.has_used_trial && (
                                <motion.button 
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: [0.95, 1.02, 0.95] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    onClick={() => {
                                        const pkg = { id: 'trial', name: language === 'ar' ? 'حصّة تجريبية' : 'Free Trial', price: 0 };
                                        addToCart(pkg, { 
                                            type: 'subscription', 
                                            metadata: { 
                                                packageId: 'trial',
                                                isTrial: true
                                            } 
                                        });
                                        setIsCartOpen(true);
                                    }}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 shadow-xl shadow-emerald-500/20 mb-4 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {language === 'ar' ? 'احجز حصة مجانية الآن' : 'Book Free Trial Now'}
                                </motion.button>
                            )}

                            <button 
                                onClick={() => router.push('/packages')}
                                className="w-full bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-500 border border-amber-500/20 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95"
                            >
                                {activeSubscription ? (language === 'ar' ? 'تعديل أو تجديد' : 'Edit or Renew') : (language === 'ar' ? 'اشترك الآن' : 'Subscribe Now')}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Achievements - Real Progress Logic */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{content.myAchievements}</h3>
                                </div>
                                <button 
                                    onClick={() => setAlert({
                                        title: language === 'ar' ? 'إنجازاتك' : 'Your Achievements',
                                        message: language === 'ar' ? 'أكمل المزيد من الحصص والتمارين لفتح أوسمة جديدة!' : 'Complete more sessions and workouts to unlock new badges!',
                                        type: 'info'
                                    })}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                >
                                    {t('viewAll')}
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { 
                                        icon: TrendingUp, 
                                        label: `${trainee.streak}d`, 
                                        name: language === 'ar' ? 'المثابر' : 'Consistent',
                                        desc: language === 'ar' ? 'وصلت لـ 89 يوماً متواصلة' : 'Reached 89 days streak',
                                        color: 'bg-blue-500', text: 'text-blue-500', 
                                        unlocked: trainee.streak >= 30 
                                    },
                                    { 
                                        icon: Trophy, 
                                        label: `${trainee.sessionsCompleted}s`, 
                                        name: language === 'ar' ? 'الوحش' : 'The Beast',
                                        desc: language === 'ar' ? 'أتممت 24 حصة تدريبية' : 'Completed 24 sessions',
                                        color: 'bg-amber-500', text: 'text-amber-500', 
                                        unlocked: trainee.sessionsCompleted >= 20 
                                    },
                                    { 
                                        icon: Star, 
                                        label: `Pro`, 
                                        name: language === 'ar' ? 'نجم صاعد' : 'Rising Star',
                                        desc: language === 'ar' ? 'عضوية ذهبية نشطة' : 'Active Gold Membership',
                                        color: 'bg-purple-500', text: 'text-purple-500', 
                                        unlocked: true 
                                    },
                                    { 
                                        icon: Dumbbell, 
                                        label: `${trainee.activeSports}`, 
                                        name: language === 'ar' ? 'متعدد المهارات' : 'Multi-Skilled',
                                        desc: language === 'ar' ? 'تمارس 3 رياضات مختلفة' : 'Practice 3 different sports',
                                        color: 'bg-orange-500', text: 'text-orange-500', 
                                        unlocked: trainee.activeSports >= 2 
                                    },
                                ].map((badge, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        onClick={() => setAlert({
                                            title: badge.name,
                                            message: badge.desc,
                                            type: 'success'
                                        })}
                                        className={`bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 dark:border-white/10 shadow-premium group cursor-pointer ${!badge.unlocked ? 'opacity-40 grayscale' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl ${badge.color}/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform relative`}>
                                            <badge.icon className={`w-5 h-5 ${badge.text}`} />
                                            {badge.unlocked && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1a2235]"></div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase mt-1">{badge.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* My Addresses Section - Premium Glass Card */}
                        <div className="space-y-4 pb-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                        {language === 'ar' ? 'عناويني المسجلة' : 'My Saved Addresses'}
                                    </h3>
                                </div>
                                <Link href="/profile/addresses" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
                                    {language === 'ar' ? 'إدارة العناوين' : 'Manage Addresses'}
                                </Link>
                            </div>
                            
                            <motion.div 
                                onClick={() => router.push('/profile/addresses')}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-premium flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                        <MapPin className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div className="text-start">
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                            {language === 'ar' ? 'عناوين الشحن والتوصيل' : 'Shipping & Delivery'}
                                        </h4>
                                        <p className="text-[10px] font-bold text-gray-500 mt-0.5 leading-tight">
                                            {language === 'ar' ? 'أضف مواقعك المفضلة لسرعة الطلب' : 'Add favorite locations for faster checkout'}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Plus className="w-4 h-4" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
                
                {/* Favorite Trainers Section */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                {language === 'ar' ? 'المدربون المفضلون' : 'Favorite Trainers'}
                            </h3>
                        </div>
                        <Link href="/trainers" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                            {language === 'ar' ? 'اكتشف المزيد' : 'Discover More'}
                        </Link>
                    </div>

                    {favoriteTrainers.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
                            {trainers.filter(tr => favoriteTrainers.includes(tr.id)).map((trainer) => (
                                <motion.div 
                                    key={trainer.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => router.push(`/trainers/${trainer.id}`)}
                                    className="flex-shrink-0 w-40 md:w-56 snap-start bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2rem] p-4 border border-gray-100 dark:border-white/10 shadow-premium group cursor-pointer"
                                >
                                    <div className="relative mb-3">
                                        <div className="aspect-square rounded-2xl overflow-hidden">
                                            <img src={trainer.image || trainer.profileImage || "/trainers/default_trainer.png"} alt={getText(trainer.name)} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavoriteTrainer(trainer.id);
                                            }}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-lg"
                                        >
                                            <Heart className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                    </div>
                                    <div className="text-start">
                                        <h4 className="text-[11px] md:text-xs font-black text-slate-900 dark:text-white truncate">
                                            {getText(trainer.name)}
                                        </h4>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider truncate mb-2">
                                            {getText(trainer.specialty)}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                            <span className="text-[10px] font-black text-primary">{trainer.rating || "5.0"}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-gray-100 dark:border-white/10 text-center shadow-premium">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-primary opacity-30" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-500">
                                {language === 'ar' ? 'لم تضف أي مدربين للمفضلة بعد' : 'No favorite trainers yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Favorite Sports Section */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                {language === 'ar' ? 'الرياضات المفضلة' : 'Favorite Sports'}
                            </h3>
                        </div>
                        <Link href="/sports" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">
                            {language === 'ar' ? 'كل الرياضات' : 'All Sports'}
                        </Link>
                    </div>

                    {favoriteSports.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
                            {sports.filter(s => favoriteSports.includes(s.id)).map((sport) => (
                                <motion.div 
                                    key={sport.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => router.push(`/sports/${sport.slug || sport.id}`)}
                                    className="flex-shrink-0 w-48 md:w-64 snap-start relative h-32 md:h-40 rounded-[2rem] overflow-hidden shadow-premium group cursor-pointer border border-white/10"
                                >
                                    <img src={sport.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" alt={getText(sport.name)} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleFavoriteSport(sport.id);
                                        }}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg z-20"
                                    >
                                        <Heart className="w-4 h-4 fill-current" />
                                    </button>
                                    <div className="absolute bottom-4 left-4 right-4 text-start z-10">
                                        <h4 className="text-sm md:text-base font-black text-white uppercase tracking-tight leading-none mb-1">{getText(sport.name)}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                                            <span className="text-[8px] md:text-[10px] font-bold text-white/70 uppercase tracking-widest">{sport.stats?.intensity || 'High'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-gray-100 dark:border-white/10 text-center shadow-premium">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Dumbbell className="w-6 h-6 text-blue-500 opacity-30" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-500">
                                {language === 'ar' ? 'لم تختر أي رياضة مفضلة بعد' : 'No favorite sports yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Wishlist / Favorites Section */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-rose-500 rounded-full"></div>
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                {language === 'ar' ? 'المنتجات المفضلة' : 'Favorite Products'}
                            </h3>
                        </div>
                        <Link href="/store" className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">
                            {language === 'ar' ? 'تسوق المزيد' : 'Shop More'}
                        </Link>
                    </div>

                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
                            {products.filter(p => favorites.includes(p.id)).map((product) => (
                                <motion.div 
                                    key={product.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => router.push(`/store/${product.id}`)}
                                    className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-3xl p-3 border border-gray-100 dark:border-white/10 shadow-premium group cursor-pointer"
                                >
                                    <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute top-2 right-2">
                                            <div className="w-8 h-8 rounded-xl bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-lg">
                                                <Heart className="w-4 h-4 fill-current" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-start px-1">
                                        <h4 className="text-[11px] font-black text-slate-900 dark:text-white line-clamp-1 truncate">{product.name}</h4>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] font-black text-primary">{product.price} {language === 'ar' ? 'رس' : 'SAR'}</span>
                                            <div className="flex items-center gap-0.5">
                                                <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                                <span className="text-[9px] font-bold text-gray-500">{product.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] p-12 border border-gray-100 dark:border-white/10 text-center shadow-premium pb-12">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-rose-500 opacity-20" />
                            </div>
                            <p className="text-sm font-bold text-gray-500">
                                {language === 'ar' ? 'لا توجد منتجات مفضلة بعد' : 'No favorite products yet'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
