"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
    HelpCircle, Search, MessageCircle, Mail, Phone, 
    ChevronRight, ChevronLeft, ChevronDown, Plus, Minus,
    LifeBuoy, Book, Send, AlertCircle, CheckCircle2,
    UserCircle, CreditCard, Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function HelpCenter() {
    const { language, t } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);
    const [activeTab, setActiveTab] = useState('faq'); // 'faq' or 'contact'
    
    // Form state
    const [formData, setFormData] = useState({ subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const faqs = [
        {
            q: t('helpPage.faqs.booking.q'),
            a: t('helpPage.faqs.booking.a')
        },
        {
            q: t('helpPage.faqs.cancel.q'),
            a: t('helpPage.faqs.cancel.a')
        },
        {
            q: t('helpPage.faqs.renew.q'),
            a: t('helpPage.faqs.renew.a')
        },
        {
            q: t('helpPage.faqs.lang.q'),
            a: t('helpPage.faqs.lang.a')
        }
    ];

    const filteredFaqs = faqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
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
            alert(t('helpPage.form.submitError') || (language === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Error submitting'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] transition-colors duration-300 pb-40 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] -z-0"></div>

            {/* Header / Breadcrumbs - Compact Version */}
            <header className="relative z-20 pt-6 px-4">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{t('helpPage.breadcrumbs.home')}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <Link href="/settings" className="hover:text-primary transition-colors">{t('helpPage.breadcrumbs.settings')}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{t('helpPage.breadcrumbs.help')}</span>
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
                                {t('helpPage.heroTitle')}
                            </h1>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 max-w-3xl">
                {/* Premium Hero Search Section */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-28 h-28 bg-primary shadow-2xl shadow-primary/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transform -rotate-6"
                    >
                        <LifeBuoy className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight">
                        {t('helpPage.heroHeader')}
                    </h2>
                    
                    <div className="relative max-w-xl mx-auto group">
                        <div className="absolute inset-0 bg-primary blur-2xl opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-lg text-white shadow-2xl focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                            placeholder={t('helpPage.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Premium Tabs */}
                <div className="flex bg-white/5 backdrop-blur-xl p-2 rounded-[2.5rem] mb-12 border border-white/5 max-w-md mx-auto shadow-2xl">
                    <button 
                        onClick={() => setActiveTab('faq')}
                        className={`flex-1 py-4 rounded-[2rem] text-sm font-black uppercase transition-all duration-500 ${activeTab === 'faq' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-gray-400 hover:text-white'}`}
                    >
                        {t('helpPage.tabs.faq')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('contact')}
                        className={`flex-1 py-4 rounded-[2rem] text-sm font-black uppercase transition-all duration-500 ${activeTab === 'contact' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-gray-400 hover:text-white'}`}
                    >
                        {t('helpPage.tabs.contact')}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'faq' ? (
                        <motion.div 
                            key="faq"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden group hover:border-primary/30 transition-all shadow-xl"
                                >
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-8 py-6 flex items-center justify-between text-left"
                                    >
                                        <span className={`text-lg font-black tracking-tight transition-colors ${openFaq === index ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                                            {faq.q}
                                        </span>
                                        <ChevronDown className={`w-6 h-6 text-primary transition-transform duration-500 ${openFaq === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-8 pb-8"
                                            >
                                                <div className="pt-4 border-t border-white/5 text-gray-400 leading-relaxed text-lg font-medium">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )) : (
                                <div className="text-center py-20 opacity-40">
                                    <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-xl font-black uppercase tracking-widest">{t('helpPage.noResults') || (language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching results found')}</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="contact"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 pb-20"
                        >
                            {/* Contact Options Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-primary/30 transition-all">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{t('helpPage.contactItems.premium')}</h3>
                                    <p className="text-gray-500 font-medium">{t('helpPage.contactItems.premiumDesc')}</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-primary/30 transition-all">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Mail className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{t('helpPage.contactItems.hotline')}</h3>
                                    <p className="text-gray-500 font-medium">{t('helpPage.contactItems.hotlineDesc')}</p>
                                </div>
                            </div>

                            {/* Direct Contact Form */}
                            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>
                                <h3 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase italic">{t('helpPage.form.title')}</h3>
                                
                                {success ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-primary/20 border border-primary/30 text-primary p-8 rounded-3xl text-center font-black"
                                    >
                                        <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
                                        {t('helpPage.form.success')}
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('helpPage.form.subject')}</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-600 font-medium"
                                                placeholder={t('helpPage.form.subjectPlaceholder')}
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('helpPage.form.message')}</label>
                                            <textarea 
                                                rows="5"
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-600 font-medium resize-none"
                                                placeholder={t('helpPage.form.messagePlaceholder')}
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary hover:bg-primary-dark text-white font-black uppercase py-6 rounded-[2rem] shadow-2xl shadow-primary/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <Send className="w-6 h-6" />
                                            <span>{loading ? t('contactPage.form.loading') : t('helpPage.form.submit')}</span>
                                        </button>
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
