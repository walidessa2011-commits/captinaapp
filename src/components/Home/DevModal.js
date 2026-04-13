"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2 } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function DevModal({ isOpen, onClose, itemName }) {
    const { language } = useApp();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        className="fixed inset-x-4 bottom-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px] bg-white dark:bg-[#1a2235] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 p-8 z-[201]"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="flex flex-col items-center text-center gap-5">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                    <Settings2 className="w-10 h-10 text-white" />
                                </div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-2 rounded-[2rem] border border-amber-400/30 border-dashed"
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    {language === 'ar' ? 'قريباً!' : 'Coming Soon!'}
                                </h3>
                                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                                    {language === 'ar'
                                        ? `باقة "${itemName}" تحت التطوير حالياً. سيتم إطلاقها قريباً مع تجربة اشتراك متكاملة.`
                                        : `"${itemName}" is currently under development and will launch soon.`
                                    }
                                </p>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "70%" }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
