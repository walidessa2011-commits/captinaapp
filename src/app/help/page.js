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
    const { language } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);
    const [activeTab, setActiveTab] = useState('faq'); // 'faq' or 'contact'
    
    // Form state
    const [formData, setFormData] = useState({ subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const faqs = [
        {
            q: language === 'ar' ? 'كيف يمكنني حجز حصة تدريبية؟' : 'How can I book a training session?',
            a: language === 'ar' 
                ? 'يمكنك حجز حصة من خلال الذهاب لصفحة المدربين، اختيار المدرب المفضل، ثم الضغط على زر "احجز الآن" واختيار اليوم والوقت المناسب.' 
                : 'You can book a session by going to the Trainers page, selecting your preferred trainer, then clicking the "Book Now" button and choosing a suitable day and time.'
        },
        {
            q: language === 'ar' ? 'هل يمكنني إلغاء الحجز؟' : 'Can I cancel my booking?',
            a: language === 'ar'
                ? 'نعم، يمكنك إلغاء الحجز قبل بدء الحصة بـ 24 ساعة على الأقل من خلال صفحة "حجوزاتي" في ملفك الشخصي.'
                : 'Yes, you can cancel your booking at least 24 hours before the session starts through the "My Bookings" page in your profile.'
        },
        {
            q: language === 'ar' ? 'كيف أقوم بتجديد الباقة؟' : 'How do I renew my package?',
            a: language === 'ar'
                ? 'عند اقتراب انتهاء باقتك، سيظهر لك تنبيه في صفحة الملف الشخصي. يمكنك الضغط على "تجديد الباقة" وإتمام عملية الدفع.'
                : 'When your package is near expiration, a notification will appear on your Profile page. You can click "Renew Package" and complete the payment process.'
        },
        {
            q: language === 'ar' ? 'هل التطبيق يدعم لغات أخرى؟' : 'Does the app support other languages?',
            a: language === 'ar'
                ? 'نعم، التطبيق يدعم اللغتين العربية والإنجليزية. يمكنك تغيير اللغة من صفحة الإعدادات.'
                : 'Yes, the app supports both Arabic and English. You can change the language from the Settings page.'
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
            alert(language === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Error submitting');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] transition-colors duration-300 pb-40 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] -z-0"></div>

            {/* Premium Ultra-Compact Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
                <div className="container mx-auto px-4 h-12 flex items-center justify-between max-w-3xl">
                    <div className="flex items-center gap-3">
                        <Link href="/settings" className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            {language === 'ar' ? <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                        </Link>
                        <h1 className="text-sm font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                            <span className="opacity-50 text-[9px] font-bold uppercase tracking-widest">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'مركز المساعدة' : 'Help Center'}</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 max-w-3xl">
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
                        {language === 'ar' ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you today?'}
                    </h2>
                    
                    <div className="relative max-w-xl mx-auto group">
                        <div className="absolute inset-0 bg-primary blur-2xl opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-lg text-white shadow-2xl focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                            placeholder={language === 'ar' ? 'ابحث عن إجابات سريعة...' : 'Search for rapid answers...'}
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
                        {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('contact')}
                        className={`flex-1 py-4 rounded-[2rem] text-sm font-black uppercase transition-all duration-500 ${activeTab === 'contact' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-gray-400 hover:text-white'}`}
                    >
                        {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'faq' ? (
                        <motion.div 
                            key="faq"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-premium hover:translate-y-[-2px] transition-all">
                                        <button 
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                            className="w-full p-8 flex items-center justify-between gap-6 text-start"
                                        >
                                            <span className="text-lg font-black text-gray-900 dark:text-white leading-tight">{faq.q}</span>
                                            <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center transition-all duration-500 ${openFaq === idx ? 'rotate-180 bg-primary/10 text-primary' : 'text-gray-400'}`}>
                                                <ChevronDown className="w-6 h-6" />
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === idx && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-8 pb-8 pt-0 text-base font-bold text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-white/5 py-6">
                                                        {faq.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                                    <p className="text-xl text-gray-500 font-bold tracking-tight">{language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching results found'}</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="contact"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 text-center transition-all hover:shadow-2xl hover:translate-y-[-4px] group">
                                    <div className="w-16 h-16 bg-primary shadow-lg shadow-primary/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Premium Support</h4>
                                    <p className="text-xl font-black text-gray-900 dark:text-white">support@captina.sa</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 text-center transition-all hover:shadow-2xl hover:translate-y-[-4px] group">
                                    <div className="w-16 h-16 bg-blue-500 shadow-lg shadow-blue-500/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all">
                                        <Phone className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Hotline 24/7</h4>
                                    <p className="text-xl font-black text-gray-900 dark:text-white">+966 9200 0000</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-[3.5rem] p-10 md:p-14 border border-gray-100 dark:border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 text-start tracking-tighter">
                                    {language === 'ar' ? 'أرسل لنا رسالة خاصة' : 'Send us a direct message'}
                                </h3>

                                {success && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-emerald-500 text-white p-6 rounded-[2rem] text-sm font-black flex items-center gap-4 shadow-xl"
                                    >
                                        <CheckCircle2 className="w-6 h-6" />
                                        {language === 'ar' ? 'تم إرسال رسالتك بنجاح! سنرد عليك قريباً.' : 'Message received! Our team will contact you shortly.'}
                                    </motion.div>
                                )}

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-3 px-2 tracking-widest">
                                            {language === 'ar' ? 'موضوع الاستفسار' : 'Inquiry Subject'}
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 dark:bg-slate-700/50 border-0 rounded-[2rem] p-6 text-gray-900 dark:text-white text-lg focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                                            placeholder={language === 'ar' ? 'حدد موضوع رسالتك هنا...' : 'Define your subject here...'}
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-3 px-2 tracking-widest">
                                            {language === 'ar' ? 'تفاصيل الرسالة' : 'Message Details'}
                                        </label>
                                        <textarea 
                                            className="w-full bg-gray-50 dark:bg-slate-700/50 border-0 rounded-[2rem] p-8 text-gray-900 dark:text-white text-lg focus:ring-4 focus:ring-primary/20 transition-all outline-none min-h-[200px] resize-none"
                                            placeholder={language === 'ar' ? 'اشرح لنا ما يدور في ذهنك بالتفصيل...' : 'Explain in detail how we can help...'}
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-20 bg-primary text-white rounded-[2rem] text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                    >
                                        {loading ? (
                                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>{language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span>
                                                <Send className="w-6 h-6 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
