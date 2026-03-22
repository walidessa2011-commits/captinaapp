"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Settings, 
    Bell, 
    Globe, 
    Moon, 
    ShieldCheck, 
    LogOut, 
    ChevronRight, 
    Camera, 
    Award,
    Star,
    Edit3,
    Languages,
    Smartphone,
    HelpCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function TrainerProfile() {
    const { language, setLanguage, darkMode, setDarkMode, userData } = useApp();
    const router = useRouter();
    const [showEditHelp, setShowEditHelp] = useState(false);

    const trainer = {
        name: userData?.fullName?.[language] || userData?.fullName || (language === 'ar' ? 'مدرب' : 'Trainer'),
        specialty: userData?.specialty?.[language] || userData?.specialty || (language === 'ar' ? 'مدرب رياضي' : 'Fitness Coach'),
        rating: userData?.rating || 4.9,
        reviews: userData?.reviewsCount || userData?.reviews || 128,
        image: userData?.photoURL || "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200",
        bio: userData?.bio?.[language] || userData?.bio || (language === 'ar' ? 'خبرة في التدريب الرياضي' : 'Experienced fitness coach')
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push('/trainer/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const SettingItem = ({ icon: Icon, label, value, onClick, toggle, checked }) => (
        <button 
            onClick={onClick}
            className={`w-full p-5 rounded-[2rem] border flex items-center justify-between transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-black/5 hover:bg-black/5 shadow-sm'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                    <Icon className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-left">
                    <p className="text-xs font-black italic">{label}</p>
                    {value && <p className="text-[10px] font-bold opacity-30 mt-0.5">{value}</p>}
                </div>
            </div>
            
            {toggle ? (
                <div className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-[#E51B24]' : 'bg-gray-400'}`}>
                    <motion.div 
                        animate={{ x: checked ? 26 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    />
                </div>
            ) : (
                <ChevronRight className={`w-5 h-5 opacity-20 ${language === 'en' ? '' : 'rotate-180'}`} />
            )}
        </button>
    );

    return (
        <div className="p-6 pb-32 max-w-lg mx-auto space-y-8">
            {/* Profile Header */}
            <div className="relative">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-8 rounded-[3rem] border relative overflow-hidden flex flex-col items-center text-center space-y-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-xl'}`}
                >
                    <div className="relative group">
                        <img src={trainer.image} alt="" className="w-24 h-24 rounded-[2rem] object-cover border-4 border-[#E51B24]/20 shadow-2xl" />
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#E51B24] rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-white/10">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-black italic">{trainer.name}</h3>
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">{trainer.specialty}</p>
                    </div>

                    <div className="flex items-center gap-8 py-2">
                        <div className="text-center">
                            <p className="text-lg font-black italic tracking-tighter flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                {trainer.rating}
                            </p>
                            <p className="text-[8px] font-black opacity-30 uppercase">{language === 'ar' ? 'تقييم' : 'Rating'}</p>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-lg font-black italic tracking-tighter">{trainer.reviews}</p>
                            <p className="text-[8px] font-black opacity-30 uppercase">{language === 'ar' ? 'مشترك' : 'Review'}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowEditHelp(true)}
                        className={`mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E51B24] hover:opacity-80 transition-all`}
                    >
                        <Edit3 className="w-4 h-4" />
                        {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                    </button>
                </motion.div>
            </div>

            {/* Admin Notice for Profile Edits */}
            <AnimatePresence>
                {showEditHelp && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-5 flex gap-4"
                    >
                        <ShieldCheck className="w-6 h-6 text-blue-500 shrink-0" />
                        <div>
                            <h4 className="text-xs font-black uppercase text-blue-500 mb-1">{language === 'ar' ? 'ملاحظة التعديل' : 'Profile Edits'}</h4>
                            <p className="text-[10px] font-bold opacity-60 leading-relaxed">
                                {language === 'ar' 
                                    ? 'تعديل البيانات الأساسية يتطلب مراجعة من الإدارة لضمان جودة المحتوى والشهادات.' 
                                    : 'Editing core profile data requires admin review to ensure content quality and certifications.'}
                            </p>
                            <button onClick={() => setShowEditHelp(false)} className="text-[10px] font-black uppercase mt-3 underline decoration-blue-500/30 text-blue-500">
                                {language === 'ar' ? 'فهمت' : 'Understood'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Sections */}
            <div className="space-y-6">
                <section className="space-y-3">
                    <h4 className="px-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">{language === 'ar' ? 'تفضيلات التطبيق' : 'App Preferences'}</h4>
                    <div className="space-y-2">
                        <SettingItem 
                            icon={Languages} 
                            label={language === 'ar' ? 'اللغة' : 'Language'} 
                            value={language === 'ar' ? 'العربية' : 'English'} 
                            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                        />
                        <SettingItem 
                            icon={Moon} 
                            label={language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'} 
                            toggle 
                            checked={darkMode}
                            onClick={() => setDarkMode(!darkMode)}
                        />
                        <SettingItem 
                            icon={Bell} 
                            label={language === 'ar' ? 'التنبيهات' : 'Notifications'} 
                            toggle 
                            checked={true}
                        />
                    </div>
                </section>

                <section className="space-y-3">
                    <h4 className="px-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">{language === 'ar' ? 'معلومات قانونية' : 'Legal & Support'}</h4>
                    <div className="space-y-2">
                        <SettingItem icon={ShieldCheck} label={language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security'} />
                        <SettingItem icon={HelpCircle} label={language === 'ar' ? 'مركز المساعدة' : 'Help Center'} />
                    </div>
                </section>

                <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full p-6 rounded-[2.5rem] border border-[#E51B24]/20 flex items-center justify-center gap-3 group hover:bg-[#E51B24]/5 transition-all mt-8"
                >
                    <LogOut className="w-5 h-5 text-[#E51B24]" />
                    <span className="text-xs font-black uppercase text-[#E51B24] tracking-widest">{language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                </motion.button>
            </div>
            
            <div className={`fixed bottom-0 right-0 w-[400px] h-[400px] blur-[150px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-orange-500/5 opacity-100' : 'bg-orange-500/10 opacity-50'}`}></div>
        </div>
    );
}
