"use client";
import { motion } from "framer-motion";
import { 
    Shield, Eye, Lock, Bell, ChevronRight, 
    ChevronLeft, Share2, Globe, Trash2, Activity
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PrivacySettings() {
    const { language, t } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    
    const [settings, setSettings] = useState({
        profileVisible: true,
        showActivity: true,
        shareAnalytics: false,
        marketingEmails: true,
        twoFactorAuth: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
        }

        const fetchSettings = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().privacySettings) {
                    setSettings(docSnap.data().privacySettings);
                }
                setLoading(false);
            }
        };
        fetchSettings();
    }, [user, loadingAuth, router]);

    const toggleSetting = async (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        
        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, {
                    privacySettings: newSettings
                });
            } catch (error) {
                console.error("Error updating privacy settings:", error);
            }
        }
    };

    if (loadingAuth || loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const sections = [
        {
            title: language === 'ar' ? 'الرؤية والملف الشخصي' : 'Visibility & Profile',
            items: [
                {
                    id: 'profileVisible',
                    icon: Globe,
                    title: language === 'ar' ? 'الملف الشخصي عام' : 'Public Profile',
                    desc: language === 'ar' ? 'السماح للآخرين برؤية ملفك وتطورك' : 'Allow others to see your profile and progress',
                    value: settings.profileVisible,
                    color: 'text-blue-400'
                },
                {
                    id: 'showActivity',
                    icon: Activity,
                    title: language === 'ar' ? 'إظهار النشاط' : 'Show Activity',
                    desc: language === 'ar' ? 'عرض متى كنت نشطاً آخر مرة للآخرين' : 'Display when you were last active to others',
                    value: settings.showActivity,
                    color: 'text-emerald-400'
                }
            ]
        },
        {
            title: language === 'ar' ? 'البيانات والأمان' : 'Data & Security',
            items: [
                {
                    id: 'shareAnalytics',
                    icon: Share2,
                    title: language === 'ar' ? 'مشاركة التحليلات' : 'Share Analytics',
                    desc: language === 'ar' ? 'ساعدنا في تحسين التطبيق بمشاركة بيانات مجهولة' : 'Help us improve by sharing anonymous usage data',
                    value: settings.shareAnalytics,
                    color: 'text-amber-400'
                },
                {
                    id: 'marketingEmails',
                    icon: Bell,
                    title: language === 'ar' ? 'الرسائل التسويقية' : 'Marketing Communications',
                    desc: language === 'ar' ? 'تلقي عروض وأخبار عن الخدمات والمنتجات' : 'Receive offers and news about services and products',
                    value: settings.marketingEmails,
                    color: 'text-rose-400'
                }
            ]
        }
    ];

    const textClass = "text-white";

    return (
        <div className="min-h-screen bg-[#0a0f1a] pb-20 transition-colors duration-500 overflow-hidden relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            
            {/* Immersive Header */}
            <header className="relative z-20 pt-16 pb-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <Link href="/settings" className="hover:text-primary transition-colors">{language === 'ar' ? 'الإعدادات' : 'Settings'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{language === 'ar' ? 'الخصوصية' : 'Privacy'}</span>
                    </motion.div>

                    {/* Consolidated Title Line */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <h1 className={`text-xl md:text-2xl font-black ${textClass} tracking-tighter italic uppercase text-center`}>
                            {language === 'ar' 
                                ? '( حماية بياناتك - خصوصية كابتينة )' 
                                : '( Secure Protocol - Privacy Core )'}
                        </h1>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-12"
                >
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] px-2">
                                {section.title}
                            </h3>
                            <div className="bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden divide-y divide-white/5">
                                {section.items.map((item) => (
                                    <div key={item.id} className="p-8 flex items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-5 text-start">
                                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 ${item.color}`}>
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-white mb-1 uppercase tracking-tight">{item.title}</h4>
                                                <p className="text-[10px] font-bold text-gray-500 leading-relaxed max-w-[200px] md:max-w-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div 
                                            onClick={() => toggleSetting(item.id)}
                                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-500 shrink-0 ${item.value ? 'bg-primary' : 'bg-gray-700'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-500 transform ${item.value ? (language === 'ar' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Danger Zone */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] px-2">
                            {language === 'ar' ? 'منطقة الخطر' : 'Terminal Actions'}
                        </h3>
                        <div className="bg-rose-500/5 backdrop-blur-3xl rounded-[2.5rem] border border-rose-500/10 shadow-2xl overflow-hidden">
                            <button className="w-full p-8 flex items-center justify-between group hover:bg-rose-500/10 transition-all text-start">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20 group-hover:scale-110 transition-transform">
                                        <Trash2 className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-rose-500 mb-1 uppercase tracking-tight">{language === 'ar' ? 'حذف الحساب نهائياً' : 'Redact Account Info'}</h4>
                                        <p className="text-[10px] font-bold text-rose-500/50 leading-relaxed uppercase tracking-widest">
                                            {language === 'ar' ? 'هذا الإجراء سيقوم بمسح كافة بياناتك' : 'Permanent deletion protocol'}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-rose-800 transition-transform ${language === 'ar' ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
