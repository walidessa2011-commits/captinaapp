"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function GlobalModal() {
    const { alert, setAlert, darkMode, language } = useApp();

    const handleConfirm = () => {
        if (alert?.onConfirm) alert.onConfirm();
        setAlert(null);
    };

    const handleCancel = () => {
        if (alert?.onCancel) alert.onCancel();
        setAlert(null);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
            case 'error': return <XCircle className="w-8 h-8 text-rose-500" />;
            case 'info': return <Info className="w-8 h-8 text-blue-500" />;
            default: return <AlertCircle className="w-8 h-8 text-amber-500" />;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-500/10';
            case 'error': return 'bg-rose-500/10';
            case 'info': return 'bg-blue-500/10';
            default: return 'bg-amber-500/10';
        }
    };

    return (
        <AnimatePresence mode="wait">
            {alert && (
                <div key="global-modal" className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-auto">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCancel}
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`${darkMode ? 'bg-[#1a2235]' : 'bg-white'} w-full max-w-[320px] rounded-[2rem] overflow-hidden shadow-2xl relative z-10 border ${darkMode ? 'border-white/10' : 'border-gray-100'}`}
                    >
                        <div className="p-6 text-center">
                            <div className={`w-14 h-14 ${getIconBg(alert.type)} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors`}>
                                {getIcon(alert.type)}
                            </div>
                            
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-tight">
                                {alert.title || (language === 'ar' ? 'تنبيه' : 'Alert')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-[11px] font-bold mb-6 leading-relaxed">
                                {alert.message}
                            </p>

                            <div className="flex gap-2">
                                {(alert.type === 'confirm' || alert.cancelText) && (
                                    <button 
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-black py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest"
                                    >
                                        {alert.cancelText || (language === 'ar' ? 'تراجع' : 'Cancel')}
                                    </button>
                                )}
                                <button 
                                    onClick={handleConfirm}
                                    className={`flex-1 ${alert.type === 'error' ? 'bg-rose-600' : 'bg-primary'} text-white font-black py-3 rounded-xl shadow-lg transition-all text-[10px] uppercase tracking-widest hover:opacity-90`}
                                >
                                    {alert.confirmText || (language === 'ar' ? 'موافق' : 'OK')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
