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
    const { language } = useApp();
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
    const [saving, setSaving] = useState(false);

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
            <div className="min-h-screen bg-[#001f3f] flex items-center justify-center">
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
                    value: settings.profileVisible
                },
                {
                    id: 'showActivity',
                    icon: Activity,
                    title: language === 'ar' ? 'إظهار النشاط' : 'Show Activity',
                    desc: language === 'ar' ? 'عرض متى كنت نشطاً آخر مرة للآخرين' : 'Display when you were last active to others',
                    value: settings.showActivity
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
                    value: settings.shareAnalytics
                },
                {
                    id: 'marketingEmails',
                    icon: Bell,
                    title: language === 'ar' ? 'الرسائل التسويقية' : 'Marketing Communications',
                    desc: language === 'ar' ? 'تلقي عروض وأخبار عن الخدمات والمنتجات' : 'Receive offers and news about services and products',
                    value: settings.marketingEmails
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#001f3f] transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#001f3f]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 p-4">
                <div className="container mx-auto max-w-2xl flex items-center justify-between">
                    <Link href="/settings" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                        {language === 'ar' ? <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                    </Link>
                    <h1 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        {language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security'}
                    </h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-[11px] font-black text-primary uppercase tracking-widest px-2">
                                {section.title}
                            </h3>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm divide-y divide-gray-50 dark:divide-white/5">
                                {section.items.map((item) => (
                                    <div key={item.id} className="p-5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 text-start">
                                            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                                <item.icon className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{item.title}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 leading-tight">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleSetting(item.id)}
                                            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${item.value ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${item.value ? (language === 'ar' ? '-translate-x-7' : 'translate-x-7') : (language === 'ar' ? '-translate-x-1' : 'translate-x-1')}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Account Actions */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest px-2">
                            {language === 'ar' ? 'إدارة الحساب' : 'Account Management'}
                        </h3>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
                            <button className="w-full p-5 flex items-center justify-between group hover:bg-rose-500/5 transition-colors text-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0">
                                        <Trash2 className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-rose-500 mb-0.5">{language === 'ar' ? 'حذف الحساب' : 'Delete Account'}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 leading-tight">
                                            {language === 'ar' ? 'هذا الإجراء نهائي ولا يمكن التراجع عنه' : 'This action is final and cannot be undone'}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
