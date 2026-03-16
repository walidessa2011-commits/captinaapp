"use client";
import { motion } from "framer-motion";
import { 
    User, Settings, Package, Calendar, LogOut, ChevronLeft, ChevronRight,
    TrendingUp, Target, MapPin, ShoppingBag, Trophy, Clock, Camera,
    Star, MessageCircle, CreditCard, ShieldCheck, Heart, Dumbbell,
    Phone, Mail, Cake, Map
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect, useRef } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { storage, auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Profile() {
    const { t, language, darkMode } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const content = t('profileSections');

    const [uploading, setUploading] = useState({ profile: false, cover: false });
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProfileData(docSnap.data());
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setLoading(false);
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

            // Update Firestore
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                [type === 'profile' ? 'photoURL' : 'coverURL']: downloadURL
            });

            // Update Auth Profile if it's the profile picture
            if (type === 'profile') {
                await updateProfile(user, { photoURL: downloadURL });
            }

            // Update local state
            setProfileData(prev => ({
                ...prev,
                [type === 'profile' ? 'photoURL' : 'coverURL']: downloadURL
            }));

        } catch (error) {
            console.error(`Error uploading ${type} image:`, error);
            alert(language === 'ar' ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading image');
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    if (loadingAuth || (user && loading)) {
        return (
            <div className="min-h-screen bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const trainee = {
        name: profileData?.fullName || user?.displayName || (language === 'ar' ? "مستخدم جديد" : "New User"),
        email: user?.email || "No email",
        phone: profileData?.phone || (language === 'ar' ? "لا يوجد رقم" : "No phone"),
        goal: profileData?.goal || (language === 'ar' ? "لم يتم تحديد هدف بعد" : "No goal set yet"),
        package: profileData?.package || (language === 'ar' ? "باقة تجريبية" : "Trial Package"),
        expiry: profileData?.expiry || "---",
        image: profileData?.photoURL || user?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
        cover: profileData?.coverURL || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
        address: profileData?.address || (language === 'ar' ? "لم يتم إضافة عنوان" : "No address added"),
        city: profileData?.city || (language === 'ar' ? "الرياض، السعودية" : "Riyadh, KSA"),
        birthday: profileData?.birthday || (language === 'ar' ? "15 مارس 1995" : "March 15, 1995"),
        sessionsCompleted: profileData?.sessionsCompleted || 24,
        activeSports: profileData?.activeSports || 3,
        streak: profileData?.streak || 89,
        ordersCount: profileData?.ordersCount || 0,
        achievementsCount: profileData?.achievementsCount || 6,
        bookingsCount: profileData?.bookingsCount || 2
    };

    const textClass = darkMode ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-24 transition-colors duration-300 relative overflow-hidden`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 -right-24 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px]"></div>
            </div>



            {/* Header / Cover Image - Premium Glass Version */}
            <div className="relative mx-4 md:mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-premium group">
                <div className="relative h-48 md:h-56">
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
                    className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl p-3 rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95 shadow-lg"
                >
                    <Camera className="w-5 h-5" />
                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'cover')} />
                </button>
            </div>

            <div className="container mx-auto px-6 -mt-24 relative z-20 max-w-4xl">
                {/* Profile Header Card - Centered Premium */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/10 mb-8 shadow-premium text-center"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl"></div>
                            <img
                                src={trainee.image}
                                alt={trainee.name}
                                className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-[2rem] border-4 border-white dark:border-[#1a2235] shadow-2xl relative z-10"
                            />
                            <button 
                                onClick={() => profileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-2xl shadow-xl border-4 border-white dark:border-[#1a2235] z-20 hover:scale-110 transition-all active:scale-90"
                            >
                                <Camera className="w-5 h-5" />
                                <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'profile')} />
                            </button>
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2 tracking-tight">{trainee.name}</h2>
                        
                        <div className="flex items-center gap-3">
                            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                {language === 'ar' ? 'عضو ذهبي' : 'Gold Member'}
                            </span>
                            <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                                <Trophy className="w-3 h-3 text-amber-500" />
                                <span>Level 12</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid - More Modern */}
                    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100 dark:border-white/5">
                        <div className="flex flex-col items-center">
                            <div className="p-3 bg-blue-500/10 rounded-2xl mb-3">
                                <Dumbbell className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white leading-none">{trainee.sessionsCompleted}</div>
                            <div className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-wider">{content.sessionsCompleted}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl mb-3">
                                <Target className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white leading-none">{trainee.activeSports}</div>
                            <div className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-wider">{content.activeSports}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-3 bg-rose-500/10 rounded-2xl mb-3">
                                <TrendingUp className="w-5 h-5 text-rose-500" />
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white leading-none">{trainee.streak}</div>
                            <div className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-wider">{content.streakDays}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions Grid - Premium Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="bg-primary text-white rounded-[1.5rem] p-5 flex items-center justify-center gap-3 shadow-premium hover:shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 group">
                        <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-wider">{language === 'ar' ? 'احجز حصة' : 'Book Session'}</span>
                    </button>
                    <button 
                        onClick={() => router.push('/profile/bookings')}
                        className="bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-gray-100 dark:border-white/10 rounded-[1.5rem] p-5 flex items-center justify-center gap-3 shadow-premium hover:bg-gray-50 dark:hover:bg-white/10 hover:scale-[1.02] transition-all active:scale-95 outline-none group"
                    >
                        <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-colors text-primary">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-wider">{language === 'ar' ? 'سجل الحصص' : 'Session Log'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Upcoming Bookings - Premium List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{content.upcomingSessions}</h3>
                                </div>
                                <Link href="/profile/bookings" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">{t('viewAll')}</Link>
                            </div>
                            
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium group cursor-pointer"
                            >
                                <div className="px-5 py-3 bg-rose-500/5 dark:bg-rose-500/10 flex items-center justify-between border-b border-rose-500/5">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-rose-500/20 rounded-lg">
                                            <Dumbbell className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{language === 'ar' ? 'كاراتيه' : 'Karate'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{language === 'ar' ? 'قادمة' : 'In 2 Days'}</span>
                                    </div>
                                </div>
                                <div className="p-5 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 overflow-hidden shadow-inner border border-gray-100 dark:border-white/10">
                                        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200" className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Trainer" />
                                    </div>
                                    <div className="flex-1 text-start">
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">الكابتن أحمد الحسيني</h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            <p className="text-[11px] font-bold text-gray-500 tracking-tight">15 مارس • 05:00 م</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Package Info - Premium Gradient Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-amber-500/20 to-[#1a2235] rounded-[2rem] p-6 border border-amber-500/30 relative overflow-hidden shadow-premium group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
                            
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="text-start">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Package className="w-4 h-4 text-amber-500" />
                                        <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider">{language === 'ar' ? 'باقة 3 أشهر' : '3 Months Package'}</h4>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-400">24 {language === 'ar' ? 'حصة تدريبية متاحة' : 'Training Sessions Available'}</p>
                                </div>
                                <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none shadow-lg">
                                    {language === 'ar' ? 'نشطة' : 'Active'}
                                </span>
                            </div>
                            
                            <div className="mb-6 relative z-10">
                                <div className="flex justify-between text-[11px] font-black text-gray-300 mb-2">
                                    <span>16 {language === 'ar' ? 'من' : 'of'} 24 {language === 'ar' ? 'حصة متبقية' : 'Remaining'}</span>
                                    <span className="text-amber-500">67%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '67%' }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                    ></motion.div>
                                </div>
                            </div>
                            
                            <button className="w-full bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-500 border border-amber-500/20 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95">
                                {content.renewPackage}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Personal Information - List Premium */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{content.personalInfo}</h3>
                            </div>
                            <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-premium">
                                {[
                                    { icon: Mail, label: content.email, value: trainee.email, color: 'bg-blue-500', text: 'text-blue-500' },
                                    { icon: Phone, label: content.phone, value: trainee.phone, color: 'bg-emerald-500', text: 'text-emerald-500' },
                                    { icon: Cake, label: content.birthday, value: trainee.birthday, color: 'bg-purple-500', text: 'text-purple-500' },
                                    { icon: MapPin, label: content.location, value: trainee.city, color: 'bg-rose-500', text: 'text-rose-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 p-4 text-start border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <div className={`w-11 h-11 rounded-2xl ${item.color}/10 flex items-center justify-center border border-${item.text}/20 shrink-0 group-hover:scale-110 transition-transform`}>
                                            <item.icon className={`w-5 h-5 ${item.text}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1.5 tracking-wider">{item.label}</p>
                                            <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{item.value}</p>
                                        </div>
                                        <button className="text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{language === 'ar' ? 'تعديل' : 'Edit'}</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements - Premium Badges */}
                        <div className="space-y-4 pb-12">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{content.myAchievements}</h3>
                                </div>
                                <Link href="/profile/achievements" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">{t('viewAll')}</Link>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { icon: TrendingUp, label: '30 d', color: 'bg-blue-500', text: 'text-blue-500' },
                                    { icon: Trophy, label: '50 s', color: 'bg-amber-500', text: 'text-amber-500' },
                                    { icon: Star, label: '5 r', color: 'bg-purple-500', text: 'text-purple-500' },
                                    { icon: Dumbbell, label: '3 g', color: 'bg-orange-500', text: 'text-orange-500' }
                                ].map((badge, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 dark:border-white/10 shadow-premium group cursor-pointer"
                                    >
                                        <div className={`w-10 h-10 rounded-xl ${badge.color}/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                            <badge.icon className={`w-5 h-5 ${badge.text}`} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase mt-1">{badge.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
