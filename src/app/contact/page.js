"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function Contact() {
    const { t, language } = useApp();
    const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] transition-colors duration-300 pb-40 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] -z-0"></div>

            {/* Header / Breadcrumbs - Compact Version */}
            <header className="relative z-20 pt-6 px-4">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{t('contactPage.breadcrumbs.home')}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{t('contactPage.breadcrumbs.contact')}</span>
                    </motion.div>

                    {/* Consolidated Title Line - Horizontal */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter italic uppercase text-center">
                                {t('contactPage.heroTitle')}
                            </h1>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="grid md:grid-cols-5 gap-6">
                    {/* Contact Info */}
                    <div className="md:col-span-2 space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 text-start relative overflow-hidden"
                        >
                            <h2 className="text-xl font-black mb-4">
                                {t('contactPage.infoTitle')}
                            </h2>
                            <p className="text-white/70 text-sm font-bold mb-6 leading-relaxed">
                                {t('contactPage.infoDesc')}
                            </p>
                            
                            <div className="space-y-4">
                                {[
                                    { icon: MapPin, label: t('contactPage.labels.location'), value: t('contactPage.values.address') },
                                    { icon: Phone, label: t('contactPage.labels.phone'), value: '0551447768' },
                                    { icon: Mail, label: t('contactPage.labels.email'), value: 'support@captina.sa' },
                                    { icon: Clock, label: t('contactPage.labels.hours'), value: t('contactPage.values.hours') }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-white/50 uppercase">{item.label}</p>
                                            <p className="text-sm font-black">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-3"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                    {t('contactPage.formTitle')}
                                </h3>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-1.5 text-start">
                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2">
                                        {t('contactPage.labels.fullName')}
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 rounded-2xl p-4 focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 dark:text-white" 
                                        placeholder={t('contactPage.placeholders.name')} 
                                    />
                                </div>
                                <div className="space-y-1.5 text-start">
                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2">
                                        {t('contactPage.labels.phone')}
                                    </label>
                                    <input 
                                        type="tel" 
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 rounded-2xl p-4 focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 dark:text-white" 
                                        placeholder="05xxxxxxxx" 
                                    />
                                </div>
                                <div className="space-y-1.5 text-start">
                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2">
                                        {t('contactPage.labels.message')}
                                    </label>
                                    <textarea 
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 rounded-2xl p-4 focus:border-primary outline-none transition-all h-32 text-sm font-bold text-gray-900 dark:text-white resize-none" 
                                        placeholder={t('contactPage.placeholders.message')}
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <Send className="w-4 h-4" />
                                    {submitted 
                                        ? t('contactPage.status.sent')
                                        : t('contactPage.status.send')
                                    }
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
