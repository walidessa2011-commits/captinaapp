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

            {/* Premium Ultra-Compact Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
                <div className="container mx-auto px-4 h-12 flex items-center justify-between max-w-4xl">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            {language === 'ar' ? <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                        </Link>
                        <h1 className="text-sm font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                            <span className="opacity-50 text-[9px] font-bold uppercase tracking-widest">{t('main') || 'الرئيسية'}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
                        </h1>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid md:grid-cols-5 gap-6">
                    {/* Contact Info */}
                    <div className="md:col-span-2 space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 text-start relative overflow-hidden"
                        >
                            <h2 className="text-xl font-black mb-4">
                                {language === 'ar' ? 'نحن هنا لمساعدتك' : "We're Here to Help"}
                            </h2>
                            <p className="text-white/70 text-sm font-bold mb-6 leading-relaxed">
                                {language === 'ar' ? 'فريقنا جاهز للإجابة على جميع استفساراتك حول الدورات والمدربين' : 'Our team is ready to answer all your questions about courses and trainers'}
                            </p>
                            
                            <div className="space-y-4">
                                {[
                                    { icon: MapPin, label: language === 'ar' ? 'الموقع' : 'Location', value: language === 'ar' ? 'الرياض، حي المونسية' : 'Riyadh, Al-Monsiya' },
                                    { icon: Phone, label: language === 'ar' ? 'الجوال' : 'Phone', value: '0551447768' },
                                    { icon: Mail, label: language === 'ar' ? 'البريد' : 'Email', value: 'support@captina.sa' },
                                    { icon: Clock, label: language === 'ar' ? 'ساعات العمل' : 'Working Hours', value: language === 'ar' ? '8 ص - 10 م' : '8 AM - 10 PM' }
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
                                    {language === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}
                                </h3>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-1.5 text-start">
                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2">
                                        {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 rounded-2xl p-4 focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 dark:text-white" 
                                        placeholder={language === 'ar' ? "أدخل اسمك" : "Enter your name"} 
                                    />
                                </div>
                                <div className="space-y-1.5 text-start">
                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2">
                                        {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
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
                                        {language === 'ar' ? 'الرسالة' : 'Message'}
                                    </label>
                                    <textarea 
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 rounded-2xl p-4 focus:border-primary outline-none transition-all h-32 text-sm font-bold text-gray-900 dark:text-white resize-none" 
                                        placeholder={language === 'ar' ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <Send className="w-4 h-4" />
                                    {submitted 
                                        ? (language === 'ar' ? 'تم الإرسال بنجاح ✓' : 'Sent Successfully ✓')
                                        : (language === 'ar' ? 'إرسال الرسالة' : 'Send Message')
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
