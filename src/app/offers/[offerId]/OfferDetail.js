"use client";
import React, { use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    Tag, 
    Sparkles, 
    Percent, 
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Gift,
    Share2,
    Heart,
    Loader2
} from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function OfferDetail({ offerId }) {
    const router = useRouter();
    const { language, t, darkMode, addToCart, setIsCartOpen, offers } = useApp();
    
    // Check both t('allOffersData') and the direct offers state
    const allOffers = offers && offers.length > 0 ? offers : (t('allOffersData') || []);
    const offer = allOffers.find(o => o.id === offerId);

    if (!offer && (!offers || offers.length === 0)) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-[#0a0f1a] text-white" : "bg-white text-slate-900"}`}>
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-bold">{language === 'ar' ? 'جاري تحميل العرض...' : 'Loading offer details...'}</p>
            </div>
        );
    }

    if (!offer) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-[#0a0f1a] text-white" : "bg-white text-slate-900"}`}>
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-black">{language === 'ar' ? 'العرض غير موجود' : 'Offer Not Found'}</h1>
                    <button 
                        onClick={() => router.push('/offers')}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
                    >
                        {language === 'ar' ? 'العودة للعروض' : 'Back to Offers'}
                    </button>
                </div>
            </div>
        );
    }

    const isAr = language === 'ar';

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-32 transition-colors duration-500`} dir={isAr ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>

            {/* Top Navigation */}
            <div className="max-w-7xl mx-auto px-6 pt-6 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-all active:scale-90 shadow-premium"
                    >
                        {isAr ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>

                    <div className="flex gap-3">
                        <button className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:text-red-500 transition-all active:scale-90 shadow-premium">
                            <Heart className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-all active:scale-90 shadow-premium">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Image Content */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] group"
                        >
                            <img 
                                src={offer.image || "https://images.unsplash.com/photo-1541534741688-6078c64ec4a9?q=80&w=1000"} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
                                alt={offer.title} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            <div className="absolute bottom-8 start-8 end-8">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-wrap gap-3 mb-4"
                                >
                                    <div className="px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20 backdrop-blur-md">
                                        {offer.badge}
                                    </div>
                                    <div className="px-5 py-2 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/30 backdrop-blur-md flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {offer.expiry}
                                    </div>
                                </motion.div>
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight"
                                >
                                    {offer.title}
                                </motion.h1>
                            </div>
                        </motion.div>

                        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: ShieldCheck, label: isAr ? 'ضمان كابتينا' : 'Captina Guarantee', color: 'text-green-500' },
                                { icon: Zap, label: isAr ? 'تفعيل فوري' : 'Instant Active', color: 'text-amber-500' },
                                { icon: Gift, label: isAr ? 'هدايا إضافية' : 'Extra Gifts', color: 'text-purple-500' },
                                { icon: CheckCircle2, label: isAr ? 'مقبول رسمياً' : 'Official Deal', color: 'text-blue-500' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-[2rem] text-center space-y-3 shadow-premium hover:border-primary/30 transition-colors">
                                    <item.icon className={`w-6 h-6 mx-auto ${item.color}`} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-tight">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Details & Action */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[3rem] p-8 md:p-10 border border-gray-100 dark:border-white/10 shadow-premium">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-primary/10 rounded-2xl">
                                            <Sparkles className="w-6 h-6 text-primary" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                            {isAr ? 'تفاصيل العرض الحصري' : 'Exclusive Offer Details'}
                                        </h2>
                                    </div>
                                    <p className="text-lg font-bold text-gray-500 dark:text-gray-400 leading-relaxed italic">
                                        "{offer.subtitle}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-[2.5rem] bg-slate-50 dark:bg-black/20 border border-gray-50 dark:border-white/5">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-primary" />
                                            {isAr ? 'عن هذا العرض' : 'About this offer'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 font-bold leading-loose text-sm">
                                            {offer.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            isAr ? 'صلاحية العرض لجميع نوادي كابتينا' : 'Offer valid across all Captina gyms',
                                            isAr ? 'إمكانية تجميد الإشتراك لمدة شهر' : 'Option to freeze subscription for 1 month',
                                            isAr ? 'دعم فني وتغذوي متوفر 24/7' : '24/7 technical and nutritional support',
                                            isAr ? 'تطبق الشروط والأحكام' : 'Terms and conditions apply',
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 dark:border-white/10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {isAr ? 'الحالة الحالية' : 'Current Status'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-sm font-black text-green-500 uppercase">
                                                    {isAr ? 'نشط الآن' : 'Active Now'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {isAr ? 'صالح حتى' : 'Valid Until'}
                                            </p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">
                                                {offer.expiry}
                                            </p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            const pkg = { 
                                                id: offer.id, 
                                                name: offer.title, 
                                                price: offer.price || 0,
                                                image: offer.image
                                            };
                                            addToCart(pkg, { 
                                                type: 'subscription', 
                                                metadata: { 
                                                    incomplete: true, 
                                                    packageId: offer.id,
                                                    offerId: offer.id,
                                                    isTrial: offer.id === 'offer-trial-free' || offer.id === 'trial'
                                                } 
                                            });
                                            setIsCartOpen(true);
                                        }}
                                        className="w-full bg-primary text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-[0.3rem] group"
                                    >
                                        {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                                        <ArrowRight className={`w-5 h-5 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
                                    </button>

                                    <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest">
                                        {isAr ? 'بمجرد التفعيل، لا يمكن إلغاء العرض' : 'Once activated, offer cannot be cancelled'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary info card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <Percent className="w-24 h-24" />
                            </div>
                            <div className="relative z-10 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Gift className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black tracking-tight">{isAr ? 'هل لديك كوبون؟' : 'Have a Coupon?'}</h4>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                                        {isAr ? 'أدخله عند الدفع لمزيد من التوفير' : 'Enter it at checkout for more savings'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
