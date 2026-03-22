"use client";
import { motion } from "framer-motion";
import { ShieldAlert, Clock, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function TrainerStatus() {
    const { language, darkMode } = useApp();
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        router.push("/trainer/login");
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${darkMode ? 'bg-[#0D0D0F] text-white' : 'bg-slate-50 text-gray-900'} ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-full max-w-md p-10 rounded-[2.5rem] border text-center space-y-8 ${darkMode ? 'bg-white/5 border-white/10 shadow-2xl shadow-black/50' : 'bg-white border-black/5 shadow-xl'}`}
            >
                <div className="relative inline-flex mx-auto">
                    <div className="w-24 h-24 rounded-full bg-[#E51B24]/10 flex items-center justify-center relative z-10">
                        <Clock className="w-12 h-12 text-[#E51B24] animate-pulse" />
                    </div>
                    <div className="absolute inset-0 bg-[#E51B24]/20 blur-2xl rounded-full"></div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-black italic uppercase italic">
                        {language === 'ar' ? 'الحساب قيد المراجعة' : 'Account Under Review'}
                    </h1>
                    <p className={`text-sm font-bold opacity-60 leading-relaxed`}>
                        {language === 'ar' 
                            ? 'نحن حالياً نراجع طلبك للانضمام كمدرب. سيتم تفعيل حسابك بمجرد موافقة الإدارة. شكراً لصبرك.' 
                            : 'We are currently reviewing your request to join as a trainer. Your account will be activated once approved by the admin. Thank you for your patience.'}
                    </p>
                </div>

                <div className={`pt-4 border-t ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 mx-auto font-black text-xs uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
