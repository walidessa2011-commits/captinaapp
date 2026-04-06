"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Check, Zap, Shield, Crown, Clock, Gift, Dumbbell, ShoppingCart,
    ChevronLeft, ChevronRight, Tag, Star, Sparkles, Lock, X,
    Calendar, ArrowRight, Users, Target, TrendingUp, Award,
    CheckCircle2, Phone, MessageCircle, Loader2, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ── Icons per package tier ──────────────────────────────────────
const TIER_ICONS = { trial: Zap, basic: Shield, elite: Crown, premium: Award };
const TIER_COLORS = {
    trial: { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30' },
    basic: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-500', light: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/30' },
    elite: { bg: 'from-primary to-rose-600', text: 'text-primary', light: 'bg-primary/5', border: 'border-primary/30' },
    premium: { bg: 'from-amber-500 to-orange-600', text: 'text-amber-500', light: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30' },
};

function getTier(pkg) {
    if (pkg.isTrial) return 'trial';
    if (pkg.featured) return 'premium';
    if ((pkg.price || 0) >= 400) return 'elite';
    if ((pkg.price || 0) >= 200) return 'basic';
    return 'trial';
}

// ── Subscribe Modal ──────────────────────────────────────────────
function SubscribeModal({ pkg, onClose, language, darkMode, user, setAlert }) {
    const ar = language === 'ar';
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: plan confirm, 2: contact info, 3: success
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', city: '', notes: '' });

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    const handleSubmit = async () => {
        if (!form.name || !form.phone) {
            setAlert({ title: ar ? 'تنبيه' : 'Required', message: ar ? 'يرجى إدخال الاسم والجوال' : 'Please enter name and phone', type: 'info' });
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, "subscription_requests"), {
                userId: user?.uid || null,
                userEmail: user?.email || null,
                packageId: pkg.id,
                packageName: getText(pkg.name),
                price: pkg.price,
                customerName: form.name,
                customerPhone: form.phone,
                city: form.city,
                notes: form.notes,
                status: 'pending',
                createdAt: serverTimestamp(),
            });
            setStep(3);
        } catch (e) {
            console.error(e);
            setAlert({ title: ar ? 'خطأ' : 'Error', message: ar ? 'حدث خطأ، حاول مجدداً' : 'Error occurred, try again', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const tier = getTier(pkg);
    const colors = TIER_COLORS[tier];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end md:items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ type: 'spring', damping: 22 }}
                className={`w-full max-w-md ${darkMode ? 'bg-[#1a2235]' : 'bg-white'} rounded-[2.5rem] shadow-2xl border ${darkMode ? 'border-white/10' : 'border-gray-100'} overflow-hidden`}
                dir={ar ? 'rtl' : 'ltr'}
            >
                {/* Top accent */}
                <div className={`h-1.5 bg-gradient-to-r ${colors.bg}`} />

                <div className="p-7">
                    {/* Close */}
                    <button onClick={onClose} className={`absolute top-6 ${ar ? 'left-6' : 'right-6'} w-8 h-8 ${darkMode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-all`}>
                        <X className="w-4 h-4" />
                    </button>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Confirm Plan */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                <div className="text-center">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                                        {React.createElement(TIER_ICONS[tier] || Dumbbell, { className: 'w-8 h-8 text-white' })}
                                    </div>
                                    <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-1`}>{ar ? 'اشترك الآن' : 'Subscribe Now'}</h3>
                                    <p className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{getText(pkg.name)}</p>
                                </div>

                                <div className={`${darkMode ? 'bg-white/5' : 'bg-slate-50'} rounded-2xl p-4 space-y-3`}>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ar ? 'الباقة' : 'Package'}</span>
                                        <span className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{getText(pkg.name)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ar ? 'المدة' : 'Duration'}</span>
                                        <span className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{getText(pkg.duration) || getText(pkg.durationText) || (ar ? 'شهري' : 'Monthly')}</span>
                                    </div>
                                    <div className={`flex justify-between items-center pt-3 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ar ? 'السعر' : 'Price'}</span>
                                        <span className={`text-xl font-black ${colors.text}`}>{pkg.price} {ar ? 'ر.س' : 'SAR'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {(pkg.features || pkg.features_ar || []).slice(0, 4).map((f, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle2 className={`w-4 h-4 ${colors.text} shrink-0`} />
                                            <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{typeof f === 'string' ? f : f[language] || f.ar}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => setStep(2)} className={`w-full py-4 bg-gradient-to-r ${colors.bg} text-white rounded-2xl font-black text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2`}>
                                    {ar ? 'متابعة' : 'Continue'}
                                    {ar ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Contact Info */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div>
                                    <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-1`}>{ar ? 'بياناتك الشخصية' : 'Your Details'}</h3>
                                    <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ar ? 'سيتواصل معك فريقنا لتأكيد الاشتراك' : 'Our team will contact you to confirm'}</p>
                                </div>

                                {[
                                    { k: 'name', label: ar ? 'الاسم الكامل *' : 'Full Name *', icon: Users, type: 'text' },
                                    { k: 'phone', label: ar ? 'رقم الجوال *' : 'Phone Number *', icon: Phone, type: 'tel' },
                                    { k: 'city', label: ar ? 'المدينة' : 'City', icon: MapPin, type: 'text' },
                                    { k: 'notes', label: ar ? 'ملاحظات (اختياري)' : 'Notes (optional)', icon: MessageCircle, type: 'text' },
                                ].map(({ k, label, icon: Icon, type }) => (
                                    <div key={k} className="relative">
                                        <Icon className={`absolute ${ar ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <input type={type} placeholder={label} value={form[k]}
                                            onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                                            className={`w-full border rounded-xl py-3 text-sm font-bold outline-none transition-all ${ar ? 'pr-10 pl-3' : 'pl-10 pr-3'} ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50' : 'bg-slate-50 border-gray-200 text-slate-900 placeholder:text-gray-400 focus:border-primary/40 focus:bg-white'}`}
                                        />
                                    </div>
                                ))}

                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setStep(1)} className={`flex-1 py-3.5 rounded-2xl font-black text-sm border ${darkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'} transition-all`}>
                                        {ar ? 'رجوع' : 'Back'}
                                    </button>
                                    <button onClick={handleSubmit} disabled={loading} className={`flex-1 py-3.5 bg-gradient-to-r ${colors.bg} text-white rounded-2xl font-black text-sm shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2`}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        {loading ? (ar ? 'جاري...' : 'Sending...') : (ar ? 'تأكيد الطلب' : 'Confirm')}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5 py-4">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                                    className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </motion.div>
                                <div>
                                    <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>{ar ? '🎉 تم إرسال طلبك!' : '🎉 Request Sent!'}</h3>
                                    <p className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>
                                        {ar ? 'سيتواصل معك فريقنا خلال 24 ساعة لتأكيد اشتراكك وإتمام الدفع.' : 'Our team will contact you within 24 hours to confirm your subscription and complete payment.'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <button onClick={onClose} className={`w-full py-4 bg-gradient-to-r ${colors.bg} text-white rounded-2xl font-black text-sm shadow-xl`}>
                                        {ar ? 'حسناً، شكراً!' : 'Great, Thank You!'}
                                    </button>
                                    <button onClick={() => { onClose(); }} className={`w-full py-3 text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {ar ? 'العودة للرئيسية' : 'Back to Home'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ── Main Page ────────────────────────────────────────────────────
export default function Packages() {
    const { t, language, darkMode, user, setAlert, packages, offers } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const [activeTab, setActiveTab] = useState('packages');
    const [selectedPkg, setSelectedPkg] = useState(null);

    // Sort: trial first, then 1 → 3 → 6 → 12 months
    const packagesList = useMemo(() => [
        ...packages.filter(p => !(p.id === 'trial' || p.isTrial)).sort((a, b) => (a.months || 99) - (b.months || 99)),
        ...packages.filter(p => p.id === 'trial' || p.isTrial),
    ], [packages]);
    const offersList = offers || [];

    const bg = darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50';
    const card = darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100';
    const textC = darkMode ? 'text-white' : 'text-slate-900';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    const handleSubscribe = (pkg) => {
        if (pkg.isTrial || pkg.id?.includes('trial')) {
            router.push('/booking?trial=true');
        } else {
            setSelectedPkg(pkg);
        }
    };

    return (
        <div className={`min-h-screen ${bg} pb-40 transition-colors duration-500 relative overflow-hidden`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG Blobs */}
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/15 rounded-full blur-[150px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px] -z-0 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 pt-6 relative z-10">

                {/* ── Top Bar ── */}
                <div className={`mb-8 p-1.5 rounded-full ${card} border flex items-center justify-between shadow-sm`}>
                    <div className="flex items-center gap-1">
                        <button onClick={() => router.back()} className={`w-10 h-10 flex items-center justify-center ${textC} hover:text-primary transition-colors active:scale-95`}>
                            {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        <Crown className="w-4 h-4 text-primary ms-2" />
                        <span className={`text-xs font-black uppercase tracking-[0.2em] ${textC} ms-1`}>
                            {activeTab === 'packages' ? (ar ? 'باقات الاشتراك' : 'Subscription Plans') : (ar ? 'العروض الحصرية' : 'Exclusive Offers')}
                        </span>
                    </div>
                    {/* Tab Switcher */}
                    <div className={`flex gap-1 p-1 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-full`}>
                        {[
                            { k: 'packages', icon: Crown, label: ar ? 'الباقات' : 'Plans' },
                            { k: 'offers', icon: Tag, label: ar ? 'العروض' : 'Offers' },
                        ].map(({ k, icon: Icon, label }) => (
                            <button key={k} onClick={() => setActiveTab(k)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all ${activeTab === k ? 'bg-primary text-white shadow-md' : `${muted} hover:text-primary`}`}>
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Header ── */}
                <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="w-8 h-px bg-primary/40" />
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                            {activeTab === 'packages' ? (ar ? 'اختر باقتك' : 'Choose Your Plan') : (ar ? 'عروض حصرية' : 'Exclusive Deals')}
                        </span>
                        <span className="w-8 h-px bg-primary/40" />
                    </div>
                    <h1 className={`text-3xl md:text-4xl font-black ${textC} tracking-tight`}>
                        {activeTab === 'packages'
                            ? <>{ar ? 'انضم إلى ' : 'Join Our '}<span className="text-primary">{ar ? 'أبطالنا' : 'Champions'}</span></>
                            : <>{ar ? 'اكتشف ' : 'Discover '}<span className="text-primary">{ar ? 'هداياك' : 'Your Gifts'}</span></>
                        }
                    </h1>
                    <p className={`text-sm font-bold ${muted} mt-2`}>
                        {ar ? 'تدريب احترافي متخصص في فنون القتال والدفاع عن النفس' : 'Professional training in martial arts & self-defense'}
                    </p>
                </motion.div>

                {/* ── Stats Bar ── */}
                <div className={`grid grid-cols-3 gap-3 mb-10 p-4 ${card} border rounded-[2rem]`}>
                    {[
                        { icon: Users, val: '500+', label: ar ? 'متدرب نشط' : 'Active Trainees' },
                        { icon: Award, val: '50+', label: ar ? 'مدرب معتمد' : 'Certified Trainers' },
                        { icon: Star, val: '4.9', label: ar ? 'تقييم المتدربين' : 'Trainee Rating' },
                    ].map(({ icon: Icon, val, label }, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-1">
                            <Icon className="w-5 h-5 text-primary mb-1" />
                            <span className={`text-lg font-black ${textC}`}>{val}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${muted}`}>{label}</span>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* ── PACKAGES TAB ── */}
                    {activeTab === 'packages' && (
                        <motion.div key="pkgs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                                {packagesList.map((pkg, i) => {
                                    const tier = getTier(pkg);
                                    const colors = TIER_COLORS[tier];
                                    const isTrial = pkg.isTrial || pkg.id?.includes('trial');
                                    const TierIcon = TIER_ICONS[tier] || Dumbbell;
                                    const features = pkg.features || (ar ? pkg.features_ar : pkg.features_en) || [];

                                    return (
                                        <motion.div
                                            key={pkg.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            className="relative group"
                                        >
                                            {/* Featured glow */}
                                            {pkg.featured && (
                                                <div className="absolute -inset-px bg-gradient-to-br from-primary/50 to-rose-500/50 rounded-[2rem] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}

                                            <div className={`relative flex flex-col h-full rounded-[2rem] border p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${
                                                pkg.featured
                                                    ? 'bg-gradient-to-b from-slate-900 to-slate-800 border-white/10 text-white shadow-2xl'
                                                    : `${card} border shadow-sm hover:shadow-md`
                                            }`}>

                                                {/* Badge */}
                                                {isTrial ? (
                                                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                                                        <span className="bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" /> {ar ? 'متاح الآن' : 'Available Now'}
                                                        </span>
                                                    </div>
                                                ) : pkg.featured ? (
                                                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                                                        <span className="bg-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
                                                            <Crown className="w-3 h-3" /> {ar ? 'الأكثر طلباً' : 'Most Popular'}
                                                        </span>
                                                    </div>
                                                ) : null}

                                                {/* Icon + Title */}
                                                <div className="flex items-start justify-between mb-5 mt-2">
                                                    <div>
                                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-3 shadow-lg`}>
                                                            <TierIcon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <h3 className={`text-base font-black ${pkg.featured ? 'text-white' : textC} leading-tight`}>{getText(pkg.name)}</h3>
                                                        <div className={`flex items-center gap-1.5 mt-1 text-[10px] font-bold ${pkg.featured ? 'text-white/60' : muted}`}>
                                                            <Clock className="w-3 h-3" />
                                                            {getText(pkg.duration) || getText(pkg.durationText) || (ar ? 'شهري' : 'Monthly')}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className={`text-xs font-medium leading-relaxed mb-5 ${pkg.featured ? 'text-white/70' : muted}`}>
                                                    {getText(pkg.description)}
                                                </p>

                                                {/* Features */}
                                                <ul className="space-y-2.5 mb-6 flex-1">
                                                    {(Array.isArray(features) ? features : []).map((feat, fi) => (
                                                        <li key={fi} className="flex items-center gap-2.5 text-xs font-bold">
                                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${pkg.featured ? 'bg-white/20' : colors.light}`}>
                                                                <Check className={`w-2.5 h-2.5 ${pkg.featured ? 'text-white' : colors.text}`} />
                                                            </div>
                                                            <span className={pkg.featured ? 'text-white/80' : darkMode ? 'text-gray-300' : 'text-slate-700'}>{typeof feat === 'string' ? feat : feat[language] || feat.ar}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {/* Price + CTA */}
                                                <div className={`pt-5 border-t ${pkg.featured ? 'border-white/10' : darkMode ? 'border-white/5' : 'border-gray-100'} space-y-3`}>
                                                    <div className="flex items-baseline justify-between">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${pkg.featured ? 'text-white/50' : muted}`}>{ar ? 'السعر' : 'Price'}</span>
                                                        <div className="flex items-baseline gap-1">
                                                            {pkg.oldPrice && pkg.oldPrice > pkg.price && (
                                                                <span className={`text-sm line-through ${pkg.featured ? 'text-white/30' : 'text-gray-400'}`}>{pkg.oldPrice}</span>
                                                            )}
                                                            <span className={`text-2xl font-black ${colors.text}`}>{pkg.price}</span>
                                                            <span className={`text-[10px] font-bold ${pkg.featured ? 'text-white/50' : muted}`}>{ar ? 'ر.س' : 'SAR'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Link href={`/packages/${pkg.id}`}
                                                            className={`py-3 rounded-xl text-center text-[10px] font-black border transition-all active:scale-95 ${pkg.featured ? 'border-white/20 text-white hover:bg-white/10' : `${darkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}`}>
                                                            {ar ? 'التفاصيل' : 'Details'}
                                                        </Link>
                                                        <button
                                                            onClick={() => handleSubscribe(pkg)}
                                                            className={`py-3 rounded-xl text-[10px] font-black shadow-lg transition-all active:scale-95 ${
                                                                isTrial
                                                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                                                    : `bg-gradient-to-r ${colors.bg} text-white hover:opacity-90`
                                                            }`}
                                                        >
                                                            {isTrial ? (ar ? 'احجز الآن' : 'Book Now') : (ar ? 'اشترك' : 'Subscribe')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ── OFFERS TAB ── */}
                    {activeTab === 'offers' && (
                        <motion.div key="offs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {offersList.map((offer, i) => (
                                <motion.div key={offer.id || i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                                    className={`group relative ${card} border rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all hover:-translate-y-1`}>
                                    <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden shrink-0">
                                        <img src={offer.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600'}
                                            alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/70 to-transparent" />
                                        {(offer.discount || offer.badge) && (
                                            <div className="absolute top-4 start-4">
                                                <span className="bg-primary text-white text-[8px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5" />
                                                    {offer.discount ? `${offer.discount}% ${ar ? 'خصم' : 'OFF'}` : getText(offer.badge)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <h3 className={`text-lg font-black ${textC} mb-1 group-hover:text-primary transition-colors`}>{getText(offer.title)}</h3>
                                            <p className={`text-xs font-bold ${muted} mb-3 leading-relaxed`}>{getText(offer.subtitle) || getText(offer.desc)}</p>
                                            {offer.expiryDate && (
                                                <div className="flex items-center gap-1.5 text-amber-500 mb-3">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">{ar ? 'ينتهي: ' : 'Expires: '}{offer.expiryDate}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => offer.isTrial ? router.push('/booking?trial=true') : router.push('/booking')}
                                            className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
                                        >
                                            {ar ? 'احتجز الآن' : 'Claim Offer'}
                                            {ar ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Help Section ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className={`mt-16 text-center ${card} border rounded-[2.5rem] p-10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="relative z-10 max-w-md mx-auto">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <MessageCircle className="w-7 h-7 text-primary" />
                        </div>
                        <h2 className={`text-2xl font-black ${textC} mb-2`}>{ar ? 'غير متأكد من اختيارك؟' : 'Not Sure Which Plan?'}</h2>
                        <p className={`text-sm font-bold ${muted} mb-7`}>{ar ? 'تحدث مع خبرائنا وسيساعدونك في اختيار الباقة الأنسب لأهدافك' : 'Talk to our experts and they will help you choose the right plan'}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/contact" className="px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
                                {ar ? 'تحدث مع خبير' : 'Talk to Expert'}
                            </Link>
                            <Link href="/booking?trial=true" className={`px-8 py-3.5 ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'} rounded-2xl font-black text-sm hover:opacity-80 active:scale-95 transition-all`}>
                                {ar ? 'جرّب مجاناً' : 'Try for Free'}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Subscribe Modal ── */}
            <AnimatePresence>
                {selectedPkg && (
                    <SubscribeModal
                        pkg={selectedPkg}
                        onClose={() => setSelectedPkg(null)}
                        language={language}
                        darkMode={darkMode}
                        user={user}
                        setAlert={setAlert}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
