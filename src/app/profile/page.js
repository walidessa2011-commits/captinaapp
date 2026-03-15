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
        <div className="min-h-screen bg-slate-50 dark:bg-[#001f3f] pb-24 transition-colors duration-300">
            {/* Header / Cover Image - Compact */}
            <div className="relative h-40 md:h-56 overflow-hidden">
                <img 
                    src={trainee.cover} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                
                {/* Back Button */}
                <div className="absolute top-4 left-4">
                    <Link href="/" className="bg-white/20 backdrop-blur-lg p-2 rounded-xl text-white border border-white/20">
                        {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </Link>
                </div>

                {/* Cover Action */}
                <button 
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-lg p-2 rounded-xl text-white border border-white/20"
                >
                    <Camera className="w-5 h-5" />
                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'cover')} />
                </button>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-10 max-w-2xl lg:max-w-5xl">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-xl border border-gray-100 dark:border-white/5 mb-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 -mt-14 md:-mt-16 mb-4">
                        <div className="relative">
                            <img
                                src={trainee.image}
                                alt={trainee.name}
                                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-3xl border-4 border-white dark:border-slate-800 shadow-lg"
                            />
                            <button 
                                onClick={() => profileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-800"
                            >
                                <Camera className="w-4 h-4" />
                                <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'profile')} />
                            </button>
                        </div>
                        <div className="text-center md:text-start flex-1 pt-4">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">{trainee.name}</h2>
                            <p className="text-[10px] font-bold text-gray-400 mb-2">{language === 'ar' ? 'عضو منذ يناير 2024' : 'Member since Jan 2024'}</p>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    {language === 'ar' ? 'عضو ذهبي' : 'Gold Member'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-50 dark:border-white/5">
                        <div className="text-center">
                            <div className="text-lg font-black text-gray-900 dark:text-white leading-none">{trainee.sessionsCompleted}</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase mt-1">{content.sessionsCompleted}</div>
                        </div>
                        <div className="text-center border-x border-gray-50 dark:border-white/5">
                            <div className="text-lg font-black text-gray-900 dark:text-white leading-none">{trainee.activeSports}</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase mt-1">{content.activeSports}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-black text-gray-900 dark:text-white leading-none">{trainee.streak}</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase mt-1">{content.streakDays}</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <button className="bg-primary text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        <Calendar className="w-5 h-5" />
                        <span className="text-[11px] font-black">{language === 'ar' ? 'احجز حصة' : 'Book Session'}</span>
                    </button>
                    <button className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-lg hover:scale-[1.02] transition-all">
                        <Clock className="w-5 h-5" />
                        <span className="text-[11px] font-black">{language === 'ar' ? 'سجل الحصص' : 'Session Log'}</span>
                    </button>
                </div>

                {/* Upcoming Bookings Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white">{content.upcomingSessions}</h3>
                        <Link href="/profile/bookings" className="text-[10px] font-bold text-primary">{t('viewAll')}</Link>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="px-4 py-2 bg-rose-500/10 flex items-center justify-between border-b border-rose-500/5">
                                <div className="flex items-center gap-2">
                                    <Dumbbell className="w-3 h-3 text-rose-500" />
                                    <span className="text-[10px] font-black text-rose-500 uppercase">{language === 'ar' ? 'كاراتيه' : 'Karate'}</span>
                                </div>
                                <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">{language === 'ar' ? 'قادمة' : 'Upcoming'}</span>
                            </div>
                            <div className="p-4 flex items-center gap-4">
                                <img src="https://via.placeholder.com/150" className="w-12 h-12 rounded-xl object-cover" alt="Trainer" />
                                <div className="flex-1 text-start">
                                    <h4 className="text-xs font-black text-gray-900 dark:text-white leading-tight">الكابتن أحمد الحسيني</h4>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1">15 يناير • 05:00 م</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Package Section */}
                <div className="mb-6">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-5 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="text-start">
                                <h4 className="text-sm font-black mb-1">{language === 'ar' ? 'باقة 3 أشهر' : '3 Months Package'}</h4>
                                <p className="text-[10px] font-semibold text-white/80">24 {language === 'ar' ? 'حصة تدريبية' : 'Training Sessions'}</p>
                            </div>
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black">{language === 'ar' ? 'نشطة' : 'Active'}</span>
                        </div>
                        <div className="mb-4 relative z-10">
                            <div className="flex justify-between text-[10px] font-bold mb-1.5">
                                <span>16 {language === 'ar' ? 'من' : 'of'} 24</span>
                                <span>67%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-white h-full rounded-full" style={{ width: '67%' }}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4 relative z-10 text-start">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5">
                                <p className="text-[8px] font-bold text-white/60 uppercase">{content.startDate}</p>
                                <p className="text-[10px] font-black">1 نوف 2024</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5">
                                <p className="text-[8px] font-bold text-white/60 uppercase">{content.endDate}</p>
                                <p className="text-[10px] font-black">31 يناير 2025</p>
                            </div>
                        </div>
                        <button className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider relative z-10">
                            {content.renewPackage}
                        </button>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white px-2 mb-3 text-start">{content.personalInfo}</h3>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm divide-y divide-gray-50 dark:divide-white/5">
                            {[
                                { icon: User, label: language === 'ar' ? 'الاسم بالكامل' : 'Full Name', value: trainee.name, color: 'text-primary', bg: 'bg-primary/5' },
                                { icon: Mail, label: content.email, value: trainee.email, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                                { icon: Phone, label: content.phone, value: trainee.phone, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                                { icon: Cake, label: content.birthday, value: trainee.birthday, color: 'text-purple-500', bg: 'bg-purple-500/5' },
                                { icon: Map, label: content.location, value: trainee.city, color: 'text-rose-500', bg: 'bg-rose-500/5' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 text-start">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg}`}>
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{item.label}</p>
                                        <p className="text-xs font-black text-gray-900 dark:text-white">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Training Preferences Section */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-3">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white">{content.trainingPreferences}</h3>
                            <button className="text-[10px] font-bold text-primary">{language === 'ar' ? 'تحديث' : 'Update'}</button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-sm text-start space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{language === 'ar' ? 'الرياضات المفضلة' : 'Favorite Sports'}</p>
                                <div className="flex flex-wrap gap-2">
                                    {['كاراتيه', 'تايكوندو', 'ملاكمة'].map((sport, i) => (
                                        <span key={i} className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/10">{sport}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{content.fitnessLevel}</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-500">{language === 'ar' ? 'متوسط' : 'Intermediate'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Achievements Header */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-3">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white">{content.myAchievements}</h3>
                            <Link href="/profile/achievements" className="text-[10px] font-bold text-primary">{t('viewAll')}</Link>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { icon: TrendingUp, label: '30 د', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { icon: Trophy, label: '50 ح', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                { icon: Star, label: '5 ن', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                                { icon: Dumbbell, label: '3 ر', color: 'text-orange-500', bg: 'bg-orange-500/10' }
                            ].map((badge, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${badge.bg}`}>
                                        <badge.icon className={`w-5 h-5 ${badge.color}`} />
                                    </div>
                                    <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment History Section */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-3 text-start">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white">{content.paymentHistory}</h3>
                            <Link href="/profile/payments" className="text-[10px] font-bold text-primary">{t('viewAll')}</Link>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm divide-y divide-gray-50 dark:divide-white/5">
                            {[
                                { name: language === 'ar' ? 'باقة 3 أشهر' : '3 Months Package', date: '1 نوف 2024', amount: '799 ر.س', status: 'paid' },
                                { name: language === 'ar' ? 'باقة شهر واحد' : '1 Month Package', date: '1 أكت 2024', amount: '299 ر.س', status: 'paid' },
                                { name: language === 'ar' ? 'حصة تجريبية' : 'Trial Session', date: '15 سبت 2024', amount: '0 ر.س', status: 'free' }
                            ].map((pay, i) => (
                                <div key={i} className="flex items-center justify-between p-4 text-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pay.status === 'paid' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
                                            <ShieldCheck className={`w-5 h-5 ${pay.status === 'paid' ? 'text-emerald-500' : 'text-blue-500'}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white leading-none mb-1">{pay.name}</h4>
                                            <p className="text-[9px] font-bold text-gray-400">{pay.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <p className="text-xs font-black text-gray-900 dark:text-white mb-0.5">{pay.amount}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-wider ${pay.status === 'paid' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                            {pay.status === 'paid' ? (language === 'ar' ? 'مدفوع' : 'Paid') : (language === 'ar' ? 'مجاني' : 'Free')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions removed per user request */}
            </div>
        </div>
    );
}
