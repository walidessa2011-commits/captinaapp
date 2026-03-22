"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
    HelpCircle, Search, MessageCircle, Mail, Phone,
    ChevronRight, ChevronLeft, ChevronDown, Plus, Minus,
    LifeBuoy, Book, Send, AlertCircle, CheckCircle2,
    UserCircle, CreditCard, Smartphone, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function HelpCenter() {
    const { language, t, setAlert, darkMode } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);
    const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' or 'contact'

    // Form state
    const [formData, setFormData] = useState({ subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const faqs = [
        {
            q: t('helpPage.form.faqs.booking.q'),
            a: t('helpPage.form.faqs.booking.a')
        },
        {
            q: t('helpPage.form.faqs.cancel.q'),
            a: t('helpPage.form.faqs.cancel.a')
        },
        {
            q: t('helpPage.form.faqs.renew.q'),
            a: t('helpPage.form.faqs.renew.a')
        },
        {
            q: t('helpPage.form.faqs.lang.q'),
            a: t('helpPage.form.faqs.lang.a')
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        (faq.q && faq.q.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (faq.a && faq.a.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "support_tickets"), {
                uid: auth.currentUser?.uid || 'anonymous',
                email: auth.currentUser?.email || 'anonymous',
                subject: formData.subject,
                message: formData.message,
                status: 'open',
                createdAt: new Date().toISOString()
            });
            setSuccess(true);
            setFormData({ subject: "", message: "" });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting ticket:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: t('helpPage.form.submitError') || (language === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Error submitting'),
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-40 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[150px] -z-0 translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] -z-0"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-30 -z-0"></div>

            {/* Header / Breadcrumbs - Refined Design */}
            <header className="relative z-20 pt-6 px-6">
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-[0.15em] opacity-60 dark:opacity-50 text-slate-500 dark:text-slate-400"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{t('helpPage.breadcrumbs.home')}</Link>
                        {language === 'ar' ? <ChevronLeft className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                        <Link href="/settings" className="hover:text-primary transition-colors">{t('helpPage.breadcrumbs.settings')}</Link>
                        {language === 'ar' ? <ChevronLeft className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                        <span className="text-primary font-black">{t('helpPage.breadcrumbs.help')}</span>
                    </motion.div>

                    {/* Premium Title Layout */}
                    <div className="text-center relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6 shadow-sm"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            <h1 className="text-xs md:text-sm font-black text-primary tracking-widest uppercase italic">
                                {t('helpPage.title')}
                            </h1>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 max-w-2xl relative z-10">
                {/* Premium Hero Search Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -15 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        className="relative mb-3"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                        <div className="relative bg-white dark:bg-white/5 p-3 rounded-2xl border border-white dark:border-white/10 shadow-premium">
                            <HelpCircle className="w-6 h-6 text-primary" />
                        </div>
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white text-center leading-tight tracking-tight mb-2">
                        {t('helpPage.header.title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-center text-xs max-w-lg mb-6 leading-relaxed">
                        {t('helpPage.header.subtitle')}
                    </p>

                    <div className="relative w-full max-w-xl group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl"></div>
                        <div className="relative flex items-center bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-white/10 p-1.5 rounded-2xl shadow-premium focus-within:border-primary transition-all">
                            <div className="w-10 h-10 flex items-center justify-center text-slate-400">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('helpPage.searchPlaceholder')}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white text-xs font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Premium Tabs */}
            <nav className="relative z-20 mt-8 mb-8">
                <div className="max-w-xl mx-auto flex items-center justify-center p-1 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                    <button
                        onClick={() => setActiveTab('faqs')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                            activeTab === 'faqs' 
                            ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-y-[-1px]' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5'
                        }`}
                    >
                        <Book className="w-3.5 h-3.5" />
                        {t('helpPage.tabs.faqs')}
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                            activeTab === 'contact' 
                            ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-y-[-1px]' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5'
                        }`}
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {t('helpPage.tabs.contact')}
                    </button>
                </div>
            </nav>

                <AnimatePresence mode="wait">
                    {activeTab === 'faqs' ? (
                        <motion.div
                            key="faqs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-5"
                        >
                            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-slate-900/30 backdrop-blur-md rounded-[1.8rem] border border-slate-200 dark:border-slate-800 overflow-hidden group hover:border-primary/40 transition-all shadow-md hover:shadow-xl"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-7 py-6 flex items-center justify-between text-start"
                                    >
                                        <span className={`text-base font-bold tracking-tight transition-colors ${openFaq === index ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${openFaq === index ? 'bg-primary text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-7 pb-7"
                                            >
                                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )) : (
                                <div className="text-center py-32">
                                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                                    </div>
                                    <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">{t('helpPage.noResults') || (language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching results found')}</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8 pb-16"
                        >
                            {/* Contact Options Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-7 rounded-[2.2rem] border border-slate-200 dark:border-slate-800 shadow-lg group transition-all"
                                >
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                        <ShieldCheck className="w-6 h-6 text-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{t('helpPage.contactItems.premium')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{t('helpPage.contactItems.premiumDesc')}</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-7 rounded-[2.2rem] border border-slate-200 dark:border-slate-800 shadow-lg group transition-all"
                                >
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                                        <Phone className="w-6 h-6 text-blue-500 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{t('helpPage.contactItems.hotline')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{t('helpPage.contactItems.hotlineDesc')}</p>
                                </motion.div>
                            </div>

                            {/* Direct Contact Form */}
                            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full translate-x-24 -translate-y-24"></div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase italic">{t('helpPage.form.title')}</h3>

                                {success ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-400 p-8 rounded-[1.8rem] text-center"
                                    >
                                        <CheckCircle2 className="w-14 h-14 mx-auto mb-4" />
                                        <p className="text-xl font-black mb-1">{language === 'ar' ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}</p>
                                        <p className="font-medium opacity-80 text-sm">{t('helpPage.form.success')}</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">{t('helpPage.form.subject')}</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-4 px-6 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium text-base"
                                                placeholder={t('helpPage.form.subjectPlaceholder')}
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">{t('helpPage.form.message')}</label>
                                            <textarea
                                                rows="4"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium text-base resize-none"
                                                placeholder={t('helpPage.form.messagePlaceholder')}
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary hover:bg-primary-dark text-white font-black uppercase py-5 rounded-[1.8rem] shadow-[0_15px_30px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-base"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    <span>{t('helpPage.form.submit')}</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
