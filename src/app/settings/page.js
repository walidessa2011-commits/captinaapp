"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Shield, 
    Bell, 
    Moon, 
    Languages, 
    HelpCircle, 
    LogOut, 
    ChevronRight, 
    ChevronLeft,
    Camera,
    CheckCircle2,
    Settings as SettingsIcon,
    ArrowRight,
    Globe,
    CreditCard,
    Lock,
    Phone,
    Mail,
    Info,
    Sparkles,
    UserCheck,
    Cake,
    MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

export default function SettingsPage() {
    const { language, setLanguage, darkMode, setDarkMode, t, setAlert, userData } = useApp();
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [activeSection, setActiveSection] = useState('profile');
    const [primaryAddress, setPrimaryAddress] = useState(null);

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "addresses"), where("userId", "==", user.uid), where("isPrimary", "==", true));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    setPrimaryAddress(snapshot.docs[0].data());
                } else {
                    setPrimaryAddress(null);
                }
            });
            return () => unsubscribe();
        }
    }, [user]);

    const textClass = darkMode ? "text-white" : "text-slate-900";
    const bgClass = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";

    const handleLogout = () => {
        setAlert({
            title: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
            message: language === 'ar' ? 'هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟' : 'Are you sure you want to terminate your current session?',
            type: 'confirm',
            onConfirm: async () => {
                await auth.signOut();
                router.push('/login');
            }
        });
    };

    const sections = [
        { id: 'profile', icon: User, label: language === 'ar' ? 'الملف الشخصي' : 'Profile' },
        { id: 'account', icon: Lock, label: language === 'ar' ? 'الأمان' : 'Security' },
        { id: 'preferences', icon: Globe, label: language === 'ar' ? 'التفضيلات' : 'Preferences' },
        { id: 'support', icon: HelpCircle, label: language === 'ar' ? 'الدعم' : 'Support' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pb-20 transition-colors duration-500 overflow-hidden relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>

            {/* Minimal Spacer for dynamic header feel */}
            <div className="h-4 md:h-8"></div>

            <main className="max-w-4xl mx-auto px-4 pb-6 relative z-10">
                {/* Top Action Bar - Title & Back (New Pill Design) */}
                <div className="mb-2 p-1 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between shadow-premium transition-all">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-colors active:scale-95"
                        >
                            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-3 px-2 py-2 text-slate-900 dark:text-white">
                            <SettingsIcon className="w-4 h-4 text-primary" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                {language === 'ar' ? 'إعدادات الحساب' : 'Account Protocol'}
                            </span>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-6 opacity-30">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em]">
                            {language === 'ar' ? 'الرئيسية / الإعدادات' : 'Home / Settings'}
                        </p>
                    </div>
                </div>

                {/* Horizontal Navigation Bar - Pill Style */}
                <div className="mb-6 p-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-premium">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeSection === section.id 
                                ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-[1.02] translate-y-[-1px]' 
                                : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white'
                            }`}
                        >
                            <span className={activeSection === section.id ? 'text-white' : 'text-gray-400 dark:text-gray-500'}>
                                <section.icon className="w-4 h-4" />
                            </span>
                            <span className={activeSection === section.id ? 'inline' : 'hidden md:inline'}>
                                {section.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-6">

                    {/* Content Area */}
                    <div className="flex-grow space-y-6">
                        {activeSection === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {/* Compact Profile Card */}
                                <div className="bg-white dark:bg-[#1a2235]/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-premium">
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/20 bg-gray-50 dark:bg-white/5 relative">
                                                {user?.photoURL ? (
                                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                                        <User className="w-8 h-8 opacity-50" />
                                                    </div>
                                                )}
                                            </div>
                                            <button className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-primary rounded-lg text-white shadow-lg active:scale-90 transition-all border border-white/10">
                                                <Camera className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="text-start">
                                            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                                                {userData?.fullName || user?.displayName || (language === 'ar' ? 'بطل كابتينا' : 'Captina Hero')}
                                            </h2>
                                            <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase mb-2 truncate max-w-[150px]">{user?.email}</p>
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-lg border border-emerald-500/10 text-[7px] font-black uppercase tracking-widest">
                                                <CheckCircle2 className="w-2.5 h-2.5" />
                                                {language === 'ar' ? 'حساب موثق' : 'Verified'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Compact Settings Group */}
                                <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
                                    <div className="p-8 pb-4">
                                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">
                                            {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Intel'}
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { icon: User, label: language === 'ar' ? 'الاسم الكامل' : 'Full Name', value: userData?.fullName || user?.displayName || '...' },
                                                { icon: Mail, label: language === 'ar' ? 'البريد الإلكتروني' : 'Email Address', value: userData?.email || user?.email || '...' },
                                                { icon: Phone, label: language === 'ar' ? 'رقم الهاتف' : 'Mobile Access', value: userData?.phone || user?.phoneNumber || '+966' },
                                                { icon: Cake, label: language === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth', value: userData?.birthday || '---' },
                                                { icon: MapPin, label: language === 'ar' ? 'العنوان الأساسي' : 'Primary Address', value: primaryAddress ? `${primaryAddress.title} - ${primaryAddress.details}` : (language === 'ar' ? 'لم يتم تحديد عنوان أساسي' : 'No primary address set') }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group hover:border-primary/20 transition-all text-start">
                                                    <div className="flex items-center gap-4">
                                                        <item.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">{item.label}</span>
                                                            <span className="text-sm text-slate-900 dark:text-white font-bold">{item.value}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8">
                                            <Link 
                                                href="/profile/edit" 
                                                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary/10 text-primary font-black text-xs border border-primary/20 hover:bg-primary hover:text-white transition-all active:scale-95 uppercase tracking-widest"
                                            >
                                                <User className="w-4 h-4" />
                                                {language === 'ar' ? 'تعديل المعلومات الشخصية' : 'Edit Personal Intel'}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-8 pt-6">
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-rose-500/10 text-rose-500 font-black text-sm border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            {language === 'ar' ? 'تسجيل الخروج' : 'Terminate Session'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'account' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-premium p-8">
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">
                                        {language === 'ar' ? 'الأمان والخصوصية' : 'Security & Privacy'}
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: Lock, label: language === 'ar' ? 'كلمة المرور' : 'Password', sub: language === 'ar' ? 'تحديث كلمة مرور حسابك' : 'Update your account password', href: '/settings/password' },
                                            { icon: Shield, label: language === 'ar' ? 'الخصوصية' : 'Privacy Settings', sub: language === 'ar' ? 'التحكم في ظهور بياناتك' : 'Control your data visibility', href: '/settings/privacy' },
                                            { icon: UserCheck, label: language === 'ar' ? 'تحقق من الهوية' : 'Identity Verification', sub: language === 'ar' ? 'توثيق حسابك للحصول على المزايا' : 'Verify account for extra perks', href: '/settings/verify' },
                                            { icon: Sparkles, label: language === 'ar' ? 'جلسات نشطة' : 'Active Sessions', sub: language === 'ar' ? 'الأجهزة المسجلة دخولها حالياً' : 'Devices currently logged in', href: '#' },
                                        ].map((item, i) => (
                                            <Link href={item.href} key={i} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/20 hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col text-start">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white">{item.label}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{item.sub}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-primary transition-colors ${language === 'ar' ? 'rotate-180' : ''}`} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'preferences' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-premium p-8"
                            >
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">
                                    {language === 'ar' ? 'تفضيلات النظام' : 'System Overrides'}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                                                <Languages className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col text-start">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{language === 'ar' ? 'اللغة' : 'Active Language'}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{language === 'ar' ? 'العربية' : 'English'}</span>
                                            </div>
                                        </div>
                                        <select 
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="bg-white dark:bg-white/5 text-xs font-black text-slate-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 outline-none focus:border-primary transition-all uppercase tracking-widest"
                                        >
                                            <option value="ar" className="bg-white dark:bg-[#1a2235]">العربية</option>
                                            <option value="en" className="bg-white dark:bg-[#1a2235]">English</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                                <Moon className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col text-start">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{language === 'ar' ? 'الوضع الليلي' : 'Stealth Protocol'}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{darkMode ? 'Active' : 'Standby'}</span>
                                            </div>
                                        </div>
                                        <div 
                                            onClick={() => setDarkMode(!darkMode)}
                                            className={`relative w-14 h-7 rounded-full p-1 cursor-pointer transition-all duration-500 ${darkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                        >
                                            <motion.div 
                                                animate={{ 
                                                    x: darkMode ? (language === 'ar' ? -28 : 28) : 0 
                                                }}
                                                className="w-5 h-5 bg-white rounded-full shadow-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        {activeSection === 'support' && (
                             <motion.div
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-premium p-8"
                         >
                             <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">
                                 {language === 'ar' ? 'الدعم الفني' : 'Technical Support'}
                             </h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {[
                                     { icon: Info, label: language === 'ar' ? 'عن كابتينا' : 'About Platform', color: 'text-blue-500 dark:text-blue-400', href: '/about' },
                                     { icon: Shield, label: language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', color: 'text-emerald-500 dark:text-emerald-400', href: '/terms' },
                                     { icon: HelpCircle, label: language === 'ar' ? 'الأسئلة الشائعة' : 'Knowledge Base', color: 'text-amber-500 dark:text-amber-400', href: '/help' },
                                     { icon: Phone, label: language === 'ar' ? 'اتصل بنا' : 'Direct Uplink', color: 'text-rose-500 dark:text-rose-400', href: '/contact' }
                                 ].map((item, i) => (
                                     <Link href={item.href} key={i} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-white/10 group transition-all text-start">
                                         <div className={`p-3 bg-white dark:bg-white/5 rounded-xl ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                             <item.icon className="w-5 h-5" />
                                         </div>
                                         <span className="text-sm font-black text-slate-900 dark:text-white">{item.label}</span>
                                     </Link>
                                 ))}
                             </div>
                         </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
