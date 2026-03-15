"use client";
import React from 'react';
import { motion } from "framer-motion";
import { 
    Settings, Bell, Lock, Eye, Moon, Globe, 
    HelpCircle, Info, ChevronLeft, ChevronRight, LogOut, 
    User, Smartphone, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function SettingsPage() {
    const { darkMode, toggleDarkMode, language, toggleLanguage, t } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [notifications, setNotifications] = React.useState(true);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    if (loadingAuth) {
        return (
            <div className="min-h-screen bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    React.useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
        }
    }, [user, loadingAuth, router]);

    if (!user) {
        return null;
    }

    const settingGroups = [
        {
            title: t('accountSecurity'),
            items: [
                { name: t('personalInfo'), icon: User, path: '/profile/edit' },
                { name: t('changePassword'), icon: Lock, path: '/settings/password' },
                { name: t('privacy'), icon: Eye, path: '/settings/privacy' },
                { name: t('accountVerification'), icon: ShieldCheck, path: '/settings/verify', badge: t('important') },
            ]
        },
        {
            title: t('appearance'),
            items: [
                { 
                    name: t('pushNotifications'), 
                    icon: Bell, 
                    type: 'toggle', 
                    value: notifications, 
                    action: () => setNotifications(!notifications) 
                },
                { 
                    name: t('darkMode'), 
                    icon: Moon, 
                    type: 'toggle', 
                    value: darkMode, 
                    action: toggleDarkMode 
                },
                { 
                    name: t('language'), 
                    icon: Globe, 
                    value: language === 'ar' ? 'العربية' : 'English',
                    action: toggleLanguage,
                    type: 'button'
                },
            ]
        },
        {
            title: t('support'),
            items: [
                { name: t('helpCenter'), icon: HelpCircle, path: '/help' },
                { name: t('aboutApp'), icon: Info, path: '/about' },
                { name: t('termsAndConditions'), icon: Smartphone, path: '/terms' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#001f3f] transition-colors duration-300 pb-20">
            {/* Compact Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-white/5 sticky top-0 z-40 transition-all">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/profile" className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                        {language === 'ar' ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </Link>
                    <h1 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">{t('settings')}</h1>
                    <div className="w-9"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 max-w-5xl">
                {/* User Summary Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-8 border border-gray-100 dark:border-white/5 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden shadow-inner">
                        <img src={user.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-start">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white leading-none mb-2">{user.displayName || 'User'}</h2>
                        <p className="text-sm font-bold text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {settingGroups.map((group, gIdx) => (
                        <div key={gIdx} className={`text-start h-full`}>
                            <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 mb-4 px-4 uppercase tracking-[0.2em]">{group.title}</h2>
                            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm transition-colors h-full">
                                {group.items.map((item, iIdx) => (
                                    <div key={iIdx}>
                                    {item.type === 'toggle' ? (
                                        <div className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b border-gray-50 dark:border-white/5 last:border-0 text-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                                            </div>
                                            
                                            <button 
                                                onClick={item.action}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${item.value ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${item.value ? (language === 'en' ? 'right-1' : 'left-1') : (language === 'en' ? 'left-1' : 'right-1')}`}></div>
                                            </button>
                                        </div>
                                    ) : item.type === 'button' ? (
                                        <button 
                                            onClick={item.action}
                                            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b border-gray-50 dark:border-white/5 last:border-0 text-start"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-400">{item.value}</span>
                                                {language === 'ar' ? (
                                                    <ChevronLeft className="w-4 h-4 text-gray-300" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                                )}
                                            </div>
                                        </button>
                                    ) : (
                                        <Link 
                                            href={item.path || '#'} 
                                            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b border-gray-50 dark:border-white/5 last:border-0 text-start"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {item.badge && <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded-md text-[10px] font-black">{item.badge}</span>}
                                                {item.value && <span className="text-xs font-bold text-gray-400">{item.value}</span>}
                                                {language === 'ar' ? (
                                                    <ChevronLeft className="w-4 h-4 text-gray-300" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                                )}
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 px-2 max-w-md mx-auto lg:max-w-none">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-xs font-black hover:bg-rose-500 hover:text-white transition-all"
                    >
                        <span>{t('logout')}</span>
                        <LogOut className="w-4 h-4" />
                    </button>
                    <p className="text-center text-gray-400 dark:text-gray-600 text-[9px] mt-4 font-bold uppercase tracking-widest">
                        App Version 1.0.4 • Captina 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
