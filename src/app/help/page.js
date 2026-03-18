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
            <header className="relative z-20 pt-8 px-6">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-6 text-[11px] font-black uppercase tracking-[0.2em] opacity-60 dark:opacity-50 text-slate-500 dark:text-slate-400"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{t('helpPage.breadcrumbs.home')}</Link>
                        {language === 'ar' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        <Link href="/settings" className="hover:text-primary transition-colors">{t('helpPage.breadcrumbs.settings')}</Link>
                        {language === 'ar' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        <span className="text-primary font-black">{t('helpPage.breadcrumbs.help')}</span>
                    </motion.div>

                    {/* Premium Title Layout */}
                    <div className="text-center relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-4 py-2 px-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <h1 className="text-sm md:text-base font-black text-primary tracking-widest uppercase italic">
                                {t('helpPage.title')}
                            </h1>
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 max-w-4xl relative z-10">
                {/* Premium Hero Search Section */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-32 h-32 bg-primary shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] rounded-[3rem] flex items-center justify-center mx-auto mb-10 animate-float"
                    >
                        <LifeBuoy className="w-14 h-14 text-white" />
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[1.1]">
                        {t('helpPage.heroHeader')}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        {t('helpPage.heroSub')}
                    </p>

                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                        <div className="relative">
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400 group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                            <input
                                type="text"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] py-8 pl-16 pr-8 text-xl text-slate-900 dark:text-white shadow-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-400"
                                placeholder={t('helpPage.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Premium Tabs */}
                <div className="flex bg-white dark:bg-slate-900/40 backdrop-blur-2xl p-2 rounded-[2.5rem] mb-16 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto shadow-xl">
                    <button
                        onClick={() => setActiveTab('faqs')}
                        className={`flex-1 py-5 rounded-[2.2rem] text-sm font-black uppercase tracking-wider transition-all duration-500 relative overflow-hidden ${activeTab === 'faqs' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {activeTab === 'faqs' && (
                            <motion.div
                                layoutId="activeTabBg"
                                className="absolute inset-0 bg-primary shadow-lg shadow-primary/30"
                                transition={{ type: "spring", duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{t('helpPage.tabs.faqs')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`flex-1 py-5 rounded-[2.2rem] text-sm font-black uppercase tracking-wider transition-all duration-500 relative overflow-hidden ${activeTab === 'contact' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {activeTab === 'contact' && (
                            <motion.div
                                layoutId="activeTabBg"
                                className="absolute inset-0 bg-primary shadow-lg shadow-primary/30"
                                transition={{ type: "spring", duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{t('helpPage.tabs.contact')}</span>
                    </button>
                </div>

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
                                    className="bg-white dark:bg-slate-900/30 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden group hover:border-primary/50 transition-all shadow-lg hover:shadow-2xl"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-10 py-8 flex items-center justify-between text-start"
                                    >
                                        <span className={`text-xl font-bold tracking-tight transition-colors ${openFaq === index ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openFaq === index ? 'bg-primary text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-10 pb-10"
                                            >
                                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium">
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
                            className="space-y-10 pb-20"
                        >
                            {/* Contact Options Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl group transition-all"
                                >
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                                        <ShieldCheck className="w-8 h-8 text-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">{t('helpPage.contactItems.premium')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{t('helpPage.contactItems.premiumDesc')}</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl group transition-all"
                                >
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500 transition-colors">
                                        <Phone className="w-8 h-8 text-blue-500 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">{t('helpPage.contactItems.hotline')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{t('helpPage.contactItems.hotlineDesc')}</p>
                                </motion.div>
                            </div>

                            {/* Direct Contact Form */}
                            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full translate-x-32 -translate-y-32"></div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter uppercase italic">{t('helpPage.form.title')}</h3>

                                {success ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-400 p-12 rounded-[2.5rem] text-center"
                                    >
                                        <CheckCircle2 className="w-20 h-20 mx-auto mb-6" />
                                        <p className="text-2xl font-black mb-2">{language === 'ar' ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}</p>
                                        <p className="font-medium opacity-80">{t('helpPage.form.success')}</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">{t('helpPage.form.subject')}</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-6 px-8 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium text-lg"
                                                placeholder={t('helpPage.form.subjectPlaceholder')}
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">{t('helpPage.form.message')}</label>
                                            <textarea
                                                rows="5"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl py-6 px-8 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium text-lg resize-none"
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
                                            className="w-full bg-primary hover:bg-primary-dark text-white font-black uppercase py-7 rounded-[2.5rem] shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_25px_50px_rgba(var(--primary-rgb),0.4)] transition-all flex items-center justify-center gap-4 disabled:opacity-50 text-xl"
                                        >
                                            {loading ? (
                                                <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <Send className="w-7 h-7" />
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
