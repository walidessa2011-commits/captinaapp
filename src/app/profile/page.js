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
    const { t, language } = useApp();
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

    return (
        <div className="min-h-screen bg-[#0a0f1a] pb-24 transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Header / Cover Image - Compact */}
            <div className="relative h-32 md:h-40 overflow-hidden">
                <img 
                    src={trainee.cover} 
                    alt="Cover" 
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/80 to-[#0a0f1a]"></div>
                
                {/* Back Button */}
                <div className="absolute top-4 left-4">
                    <Link href="/" className="bg-white/5 backdrop-blur-lg p-2 rounded-lg text-white border border-white/10 active:scale-95">
                        {language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Link>
                </div>

                {/* Cover Action */}
                <button 
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute top-4 right-4 bg-white/5 backdrop-blur-lg p-2 rounded-lg text-white border border-white/10 active:scale-95"
                >
                    <Camera className="w-4 h-4" />
                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'cover')} />
                </button>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-10 max-w-4xl">
                {/* Profile Header Card - Compact */}
                <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-2xl p-4 border border-white/5 mb-4 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <img
                                src={trainee.image}
                                alt={trainee.name}
                                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border-2 border-white/10 shadow-lg"
                            />
                            <button 
                                onClick={() => profileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-lg shadow-lg border border-[#0a0f1a]"
                            >
                                <Camera className="w-3 h-3" />
                                <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'profile')} />
                            </button>
                        </div>
                        <div className="text-start flex-1">
                            <h2 className="text-base font-black text-white leading-tight mb-0.5 tracking-tighter">{trainee.name}</h2>
                            <p className="text-[8px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">{language === 'ar' ? 'عضو منذ يناير 2024' : 'Member since Jan 2024'}</p>
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border border-primary/20">
                                {language === 'ar' ? 'عضو ذهبي' : 'Gold Member'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats Grid - Compact */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/5">
                        <div className="text-center">
                            <div className="text-sm font-black text-white leading-none">{trainee.sessionsCompleted}</div>
                            <div className="text-[7px] font-extrabold text-gray-500 uppercase mt-1 tracking-wider">{content.sessionsCompleted}</div>
                        </div>
                        <div className="text-center border-x border-white/5">
                            <div className="text-sm font-black text-white leading-none">{trainee.activeSports}</div>
                            <div className="text-[7px] font-extrabold text-gray-500 uppercase mt-1 tracking-wider">{content.activeSports}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-black text-white leading-none">{trainee.streak}</div>
                            <div className="text-[7px] font-extrabold text-gray-500 uppercase mt-1 tracking-wider">{content.streakDays}</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid - Mini */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                    <button className="bg-primary text-white rounded-xl p-3 flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] transition-all active:scale-95">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-wider">{language === 'ar' ? 'احجز حصة' : 'Book Session'}</span>
                    </button>
                    <button className="bg-white/5 text-white border border-white/10 rounded-xl p-3 flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] transition-all active:scale-95 outline-none">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-wider">{language === 'ar' ? 'سجل الحصص' : 'Session Log'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Upcoming Bookings - Condensed */}
                        <div>
                            <div className="flex items-center justify-between px-1 mb-2">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">{content.upcomingSessions}</h3>
                                <Link href="/profile/bookings" className="text-[8px] font-black text-primary uppercase tracking-widest">{t('viewAll')}</Link>
                            </div>
                            <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-xl overflow-hidden border border-white/5">
                                <div className="px-3 py-1.5 bg-rose-500/10 flex items-center justify-between border-b border-rose-500/5">
                                    <div className="flex items-center gap-1.5">
                                        <Dumbbell className="w-2.5 h-2.5 text-rose-500" />
                                        <span className="text-[8px] font-black text-rose-500 uppercase">{language === 'ar' ? 'كاراتيه' : 'Karate'}</span>
                                    </div>
                                    <span className="text-[6px] font-black text-rose-500 uppercase tracking-widest">{language === 'ar' ? 'قادمة' : 'Upcoming'}</span>
                                </div>
                                <div className="p-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200" className="w-full h-full object-cover opacity-80" alt="Trainer" />
                                    </div>
                                    <div className="flex-1 text-start">
                                        <h4 className="text-[10px] font-black text-white leading-tight">الكابتن أحمد الحسيني</h4>
                                        <p className="text-[8px] font-bold text-gray-500 mt-0.5 tracking-tight">15 يناير • 05:00 م</p>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
                                </div>
                            </div>
                        </div>

                        {/* Package Info - Compact */}
                        <div className="bg-gradient-to-br from-amber-500/10 to-amber-700/5 rounded-xl p-4 border border-amber-500/20 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="text-start">
                                    <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-tight">{language === 'ar' ? 'باقة 3 أشهر' : '3 Months Package'}</h4>
                                    <p className="text-[8px] font-bold text-gray-500">24 {language === 'ar' ? 'حصة تدريبية' : 'Training Sessions'}</p>
                                </div>
                                <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest leading-none">
                                    {language === 'ar' ? 'نشطة' : 'Active'}
                                </span>
                            </div>
                            <div className="mb-3 relative z-10">
                                <div className="flex justify-between text-[8px] font-black text-gray-400 mb-1">
                                    <span>16 {language === 'ar' ? 'من' : 'of'} 24</span>
                                    <span>67%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" style={{ width: '67%' }}></div>
                                </div>
                            </div>
                            <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                                {content.renewPackage}
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Personal Information - Grid Compact */}
                        <div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-2 px-1 text-start">{content.personalInfo}</h3>
                            <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-xl border border-white/5 divide-y divide-white/5">
                                {[
                                    { icon: Mail, label: content.email, value: trainee.email, color: 'text-blue-500' },
                                    { icon: Phone, label: content.phone, value: trainee.phone, color: 'text-emerald-500' },
                                    { icon: Cake, label: content.birthday, value: trainee.birthday, color: 'text-purple-500' },
                                    { icon: MapPin, label: content.location, value: trainee.city, color: 'text-rose-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2.5 text-start">
                                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[7px] font-black text-gray-500 uppercase leading-none mb-0.5 tracking-wider">{item.label}</p>
                                            <p className="text-[10px] font-black text-white tracking-tight">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements - Condensed Icons */}
                        <div>
                            <div className="flex items-center justify-between px-1 mb-2">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">{content.myAchievements}</h3>
                                <Link href="/profile/achievements" className="text-[8px] font-black text-primary uppercase tracking-widest">{t('viewAll')}</Link>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { icon: TrendingUp, label: '30 d', color: 'text-blue-500' },
                                    { icon: Trophy, label: '50 s', color: 'text-amber-500' },
                                    { icon: Star, label: '5 r', color: 'text-purple-500' },
                                    { icon: Dumbbell, label: '3 g', color: 'text-orange-500' }
                                ].map((badge, i) => (
                                    <div key={i} className="bg-[#1a2235]/40 backdrop-blur-xl rounded-xl p-2.5 flex flex-col items-center justify-center border border-white/5 shadow-sm group hover:border-primary/20 transition-all">
                                        <badge.icon className={`w-4 h-4 ${badge.color} mb-1`} />
                                        <span className="text-[8px] font-black text-white uppercase">{badge.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
