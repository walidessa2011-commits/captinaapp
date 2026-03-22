"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function Contact() {
    const { t, language, contactInfo, submitInquiry } = useApp();
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const res = await submitInquiry(formData);
        
        if (res.success) {
            setSubmitted(true);
            setFormData({ name: '', phone: '', email: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        }
        setIsSubmitting(false);
    };

    const contactItems = [
        { 
            icon: MapPin, 
            label: t('contactPage.items.location'), 
            value: contactInfo ? (language === 'ar' ? contactInfo.address_ar : contactInfo.address_en) : t('contactPage.items.locationVal'),
            color: 'bg-blue-500'
        },
        { 
            icon: Phone, 
            label: t('contactPage.items.phone'), 
            value: contactInfo?.phone || '0551447768',
            color: 'bg-emerald-500'
        },
        { 
            icon: Mail, 
            label: t('contactPage.items.email'), 
            value: contactInfo?.email || 'support@captina.sa',
            color: 'bg-amber-500'
        },
        { 
            icon: Clock, 
            label: t('contactPage.items.workingHours'), 
            value: contactInfo ? (language === 'ar' ? contactInfo.workingHours_ar : contactInfo.workingHours_en) : t('contactPage.items.workingHoursVal'),
            color: 'bg-indigo-500'
        }
    ];

    return (
        <div className={`min-h-screen bg-white dark:bg-[#06080c] transition-colors duration-500 pb-40 overflow-hidden relative ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-0 pointer-events-none"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
            <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-primary rounded-full animate-ping opacity-20"></div>

            {/* Breadcrumbs Section */}
            <header className="relative z-20 pt-16 px-4">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-8"
                    >
                        <Link href="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all">
                            {t('contactPage.breadcrumbs.home')}
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                            {t('contactPage.breadcrumbs.contact')}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            {language === 'ar' ? 'الدعم المباشر متوفر الآن' : 'Live Support Available'}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-tight mb-4">
                            {language === 'ar' ? 'تواصل مع ' : 'Get in '}
                            <span className="text-primary italic relative">
                                {language === 'ar' ? 'كابتينا' : 'Touch'}
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute -bottom-2 left-0 h-1.5 bg-primary/20 rounded-full"
                                />
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 font-bold text-lg md:text-xl leading-relaxed mt-6">
                            {t('contactPage.heroDesc')}
                        </p>
                    </motion.div>
                </div>
            </header>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* Left Side: Contact Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid gap-4"
                        >
                            {contactItems.map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className={`w-14 h-14 ${item.color}/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                            <item.icon className={`w-7 h-7 text-gray-900 dark:text-white group-hover:text-primary transition-colors`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 opacity-70">
                                                {item.label}
                                            </p>
                                            <p className="text-base font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Abstract shape decoration */}
                                    <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* WhatsApp CTA Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-emerald-500 text-white rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer"
                        >
                            <a 
                                href={`https://wa.me/${contactInfo?.phone?.replace(/\s/g, '') || '966551447768'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between relative z-10"
                            >
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black italic uppercase leading-none">
                                        {language === 'ar' ? 'محادثة مباشرة عبر واتساب' : 'Live WhatsApp Chat'}
                                    </h4>
                                    <p className="text-white/80 text-sm font-bold">
                                        {language === 'ar' ? 'رد فورى على جميع استفساراتك' : 'Instant response for all your inquiries'}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-8 h-8 fill-current" />
                                </div>
                            </a>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </motion.div>
                    </div>

                    {/* Right Side: Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl border border-gray-100 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-black/5 relative overflow-hidden group">
                            {/* Subtle Form Decoration */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-[1.5rem] flex items-center justify-center shrink-0">
                                    <Send className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 italic uppercase">
                                        {t('contactPage.form.title')}
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm font-bold">
                                        {language === 'ar' ? 'سنقوم بالرد عليك شخصياً خلال أقل من 12 ساعة' : 'A personalized response will be sent in less than 12 hours'}
                                    </p>
                                </div>
                            </div>

                            {submitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-10 text-center flex flex-col items-center gap-6 py-20"
                                >
                                    <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 rotate-12">
                                        <CheckCircle2 className="w-12 h-12 text-white -rotate-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                            {t('contactPage.form.success')}
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-base font-bold max-w-sm mx-auto leading-relaxed">
                                            {language === 'ar' 
                                                ? 'تم توجيه رسالتك للإدارة العليا، سيتم مراجعة طلبك والرد عليك في أقرب وقت ممكن.'
                                                : 'Your message has been directed to senior management. We will review and respond as soon as possible.'}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="mt-4 px-10 py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-xl transition-all"
                                    >
                                        {language === 'ar' ? 'إرسال رسالة جديدة' : 'Send New Inquiry'}
                                    </button>
                                </motion.div>
                            ) : (
                                <form className="space-y-8" onSubmit={handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2 flex flex-col">
                                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase px-4 tracking-[0.2em] mb-1 opacity-70">
                                                {t('contactPage.form.name')}
                                            </label>
                                            <input 
                                                type="text" 
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-black/20 rounded-2xl p-5 outline-none transition-all text-sm font-black text-gray-900 dark:text-white shadow-inner" 
                                                placeholder={t('contactPage.form.name')} 
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col">
                                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase px-4 tracking-[0.2em] mb-1 opacity-70">
                                                {t('contactPage.form.phone')}
                                            </label>
                                            <input 
                                                type="tel" 
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-black/20 rounded-2xl p-5 outline-none transition-all text-sm font-black text-gray-900 dark:text-white shadow-inner" 
                                                placeholder="05XXXXXXXX" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase px-4 tracking-[0.2em] mb-1 opacity-70">
                                            {t('contactPage.form.email')}
                                        </label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-black/20 rounded-2xl p-5 outline-none transition-all text-sm font-black text-gray-900 dark:text-white shadow-inner" 
                                            placeholder="example@mail.com" 
                                        />
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase px-4 tracking-[0.2em] mb-1 opacity-70">
                                            {t('contactPage.form.message')}
                                        </label>
                                        <textarea 
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-black/20 rounded-[2rem] p-6 outline-none transition-all h-44 text-sm font-black text-gray-900 dark:text-white resize-none shadow-inner leading-relaxed" 
                                            placeholder={t('contactPage.form.placeholder')}
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-6 rounded-[2rem] shadow-2xl shadow-black/10 hover:translate-y-[-2px] active:scale-[0.98] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-4 text-sm tracking-widest uppercase group"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className={`w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                                                {t('contactPage.form.submit')}
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
