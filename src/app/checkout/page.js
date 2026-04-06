"use client";
import { useState, useEffect, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, CreditCard, Box, Truck,
    ShieldCheck, ArrowRight, ShoppingBag, MapPin, Phone,
    User, CheckCircle2, Package, ArrowLeft, Sparkles,
    Calendar, Clock, Home, Dumbbell, Tag, Lock, Loader2,
    Wallet, Star, Building2, AlertCircle, X, Plus, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { buildSubscriptionData } from "@/utils/subscriptionUtils";
import { useRouter } from 'next/navigation';

const SAUDI_CITIES = [
    { en: 'Riyadh', ar: 'الرياض' }, { en: 'Jeddah', ar: 'جدة' },
    { en: 'Dammam', ar: 'الدمام' }, { en: 'Mecca', ar: 'مكة المكرمة' },
    { en: 'Medina', ar: 'المدينة المنورة' }, { en: 'Khobar', ar: 'الخبر' },
    { en: 'Abha', ar: 'أبها' }, { en: 'Tabuk', ar: 'تبوك' },
    { en: 'Buraidah', ar: 'بريدة' }, { en: 'Taif', ar: 'الطائف' },
    { en: 'Hail', ar: 'حائل' }, { en: 'Jizan', ar: 'جازان' },
];

const PROMO_CODES = { 'CAPTINA10': 10, 'WELCOME20': 20, 'FIGHT15': 15, 'CHAMP25': 25 };

export default function CheckoutPage() {
    const { darkMode, language, cart, cartTotal, user, userData, products, removeFromCart, gyms, setAlert } = useApp();
    const router = useRouter();

    const [step, setStep] = useState(1); // 1: Info, 2: Review+Payment, 3: Success
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(null); // { code, discount }
    const [promoInput, setPromoInput] = useState('');

    const [formData, setFormData] = useState({
        fullName: '', phone: '', city: '', address: '', notes: ''
    });

    const ar = language === 'ar';
    const bg = darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50';
    const card = darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100';
    const textC = darkMode ? 'text-white' : 'text-slate-900';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
    const inp = darkMode
        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:bg-white/8'
        : 'bg-slate-50 border-gray-200 text-slate-900 placeholder:text-gray-400 focus:border-primary/40 focus:bg-white';

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    const isTrialItem = (item) =>
        item.metadata?.isTrial || item.id === 'trial' ||
        item.name?.toLowerCase()?.includes('trial') || item.name?.includes('تجريبية');

    const trialItems = useMemo(() => cart.filter(isTrialItem), [cart]);
    const hasTrial = trialItems.length > 0;
    const storeItems = useMemo(() => cart.filter(i => !isTrialItem(i) && i.type !== 'subscription'), [cart]);
    const subItems = useMemo(() => cart.filter(i => i.type === 'subscription' && !isTrialItem(i)), [cart]);

    const discountAmount = promoApplied ? Math.round(cartTotal * promoApplied.discount / 100) : 0;
    const finalTotal = cartTotal - discountAmount;

    const similarProducts = useMemo(() => {
        if (!products.length) return [];
        const cartIds = cart.map(i => i.productId);
        return products.filter(p => !cartIds.includes(p.id)).slice(0, 4);
    }, [products, cart]);

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || getText(userData.fullName) || userData.displayName || '',
                phone: prev.phone || userData.phone || '',
                city: prev.city || userData.city || '',
                address: prev.address || userData.address || '',
            }));
        }
    }, [userData]);

    const handleApplyPromo = () => {
        const disc = PROMO_CODES[promoInput.toUpperCase().trim()];
        if (disc) {
            setPromoApplied({ code: promoInput.toUpperCase().trim(), discount: disc });
            setAlert({ title: ar ? '🎉 تم تطبيق الكود!' : '🎉 Code Applied!', message: ar ? `خصم ${disc}% على طلبك` : `${disc}% discount applied`, type: 'success' });
        } else {
            setAlert({ title: ar ? 'كود غير صحيح' : 'Invalid Code', message: ar ? 'تحقق من الكود وحاول مجدداً' : 'Check the code and try again', type: 'error' });
        }
    };

    const detectLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFormData(p => ({ ...p, address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
                    setAlert({ title: ar ? 'تم تحديد الموقع' : 'Location Detected', message: ar ? 'تم تحديد موقعك بنجاح' : 'Location captured successfully', type: 'success' });
                },
                () => setAlert({ title: ar ? 'خطأ' : 'Error', message: ar ? 'يرجى تفعيل الموقع' : 'Please enable location services', type: 'error' })
            );
        }
    };

    const handleSubmitOrder = async () => {
        if (!user) { router.push('/login'); return; }
        if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
            setAlert({ title: ar ? 'بيانات ناقصة' : 'Missing Info', message: ar ? 'يرجى إكمال جميع الحقول المطلوبة' : 'Please fill all required fields', type: 'info' });
            return;
        }
        setIsSubmitting(true);
        try {
            const baseOrder = {
                userId: user.uid, userEmail: user.email || '',
                userName: formData.fullName, userPhone: formData.phone,
                deliveryInfo: { address: formData.address, city: formData.city, notes: formData.notes },
                paymentMethod, promoCode: promoApplied?.code || null,
                discountAmount, subtotal: cartTotal, totalAmount: finalTotal,
                status: 'processing', createdAt: serverTimestamp()
            };

            let orderId = `order_${Date.now()}`;

            if (storeItems.length > 0) {
                const ref = await addDoc(collection(db, 'orders'), {
                    ...baseOrder,
                    items: storeItems.map(i => ({
                        id: i.productId || i.id, cartId: i.cartId,
                        name: getText(i.name), image: i.image || '',
                        price: i.price, quantity: i.quantity,
                        size: i.size || null, color: i.color?.code || null,
                    })),
                    itemsCount: storeItems.reduce((a, b) => a + b.quantity, 0),
                });
                orderId = ref.id;
            }

            // Handle subscriptions
            for (const item of [...subItems, ...trialItems]) {
                if (item.metadata) {
                    // Compute session counts from the package data stored in metadata
                    const pkgData = item.metadata.packageData || item.metadata;
                    const sessionFields = buildSubscriptionData(pkgData, new Date().toISOString().slice(0, 10));
                    const subData = {
                        ...item.metadata,
                        ...sessionFields,
                        orderId,
                        userId: user.uid,
                        status: 'pending',
                        paymentStatus: 'pending',
                        createdAt: serverTimestamp(),
                    };
                    Object.keys(subData).forEach(k => { if (subData[k] === undefined) subData[k] = null; });
                    await addDoc(collection(db, 'subscriptions'), subData);

                    if (item.metadata.isTrial) {
                        await updateDoc(doc(db, 'users', user.uid), { has_used_trial: true });
                        await addDoc(collection(db, 'bookings'), {
                            userId: user.uid, orderId,
                            trainer: { id: item.metadata.trainerId || '', name: getText(item.metadata.trainerName) || '' },
                            date: item.metadata.bookedDate || item.metadata.startDate || '',
                            time: item.metadata.bookedTime || item.metadata.preferredTime || '',
                            clientName: formData.fullName, phone: formData.phone,
                            trainingLocation: {
                                type: item.metadata.location || 'home',
                                address: item.metadata.location === 'home' ? formData.address : (item.metadata.preSelectedGymId || ''),
                                gymName: item.metadata.location === 'gym' ? (getText(item.metadata.preSelectedGymName) || '') : ''
                            },
                            status: 'confirmed', type: 'trial',
                            sport: { id: item.metadata.sportId || '', name: getText(item.metadata.sportName) || '' },
                            createdAt: serverTimestamp()
                        });
                    }
                }
            }

            cart.forEach(item => removeFromCart(item.cartId));
            setStep(3);
        } catch (err) {
            console.error(err);
            setAlert({ title: ar ? 'خطأ' : 'Error', message: ar ? 'حدث خطأ أثناء الطلب، حاول مجدداً' : 'Order failed, please try again', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── SUCCESS SCREEN ───────────────────────────────────────────────────────
    if (step === 3) {
        return (
            <div className={`min-h-screen ${bg} flex items-center justify-center p-6`} dir={ar ? 'rtl' : 'ltr'}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 18 }}
                    className="max-w-md w-full relative"
                >
                    {/* Card */}
                    <div className={`${card} border rounded-[3rem] p-10 text-center relative overflow-hidden shadow-2xl`}>
                        {/* Top accent line */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-primary to-amber-400 rounded-t-[3rem]" />

                        {/* Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                        >
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            <motion.div
                                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                className="absolute inset-0 bg-emerald-500/20 rounded-full"
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <h2 className={`text-2xl font-black ${textC} mb-2 tracking-tight`}>
                                {ar ? '🎉 تم استلام طلبك!' : '🎉 Order Confirmed!'}
                            </h2>
                            <p className={`text-sm font-bold ${muted} mb-8 leading-relaxed`}>
                                {ar
                                    ? 'شكراً لك! سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الطلب وترتيب التوصيل.'
                                    : "Thank you! Our team will contact you within 24 hours to confirm and arrange delivery."}
                            </p>

                            <div className={`${darkMode ? 'bg-white/5' : 'bg-slate-50'} rounded-2xl p-4 mb-8 flex items-center gap-4 text-start`}>
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>{ar ? 'إجمالي الطلب' : 'Order Total'}</p>
                                    <p className={`text-lg font-black text-primary`}>{finalTotal} {ar ? 'ر.س' : 'SAR'}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/profile/orders" className="block w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">
                                    {ar ? 'تتبع طلبي' : 'Track My Order'}
                                </Link>
                                <Link href="/store" className={`block w-full py-4 rounded-2xl font-black text-sm ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-white border border-gray-200 text-gray-600'} hover:opacity-80 active:scale-[0.98] transition-all`}>
                                    {ar ? 'متابعة التسوق' : 'Continue Shopping'}
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─── EMPTY CART ────────────────────────────────────────────────────────────
    if (!cart?.length) {
        return (
            <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-6 px-4`} dir={ar ? 'rtl' : 'ltr'}>
                <div className={`w-24 h-24 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className={`text-2xl font-black ${textC}`}>{ar ? 'السلة فارغة' : 'Cart is Empty'}</h2>
                <p className={`text-sm font-bold ${muted}`}>{ar ? 'أضف منتجات للمتابعة' : 'Add items to continue'}</p>
                <Link href="/store" className="px-8 py-4 bg-primary text-white rounded-full font-black shadow-xl shadow-primary/20">
                    {ar ? 'تسوق الآن' : 'Shop Now'}
                </Link>
            </div>
        );
    }

    // ─── MAIN CHECKOUT ─────────────────────────────────────────────────────────
    return (
        <div className={`min-h-screen ${bg} pb-24 transition-colors duration-500`} dir={ar ? 'rtl' : 'ltr'}>
            {/* Background blobs */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

            <div className="max-w-6xl mx-auto px-4 pt-6 relative z-10">
                {/* ── Header ── */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => step > 1 ? setStep(s => s - 1) : router.back()}
                        className={`w-11 h-11 ${card} border rounded-2xl flex items-center justify-center transition-all active:scale-95 hover:border-primary/30`}
                    >
                        {ar ? <ChevronRight className={`w-5 h-5 ${textC}`} /> : <ChevronLeft className={`w-5 h-5 ${textC}`} />}
                    </button>
                    <div>
                        <h1 className={`text-xl font-black ${textC} tracking-tight`}>
                            {ar ? 'إتمام الطلب' : 'Checkout'}
                        </h1>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>
                            {ar ? `${cart.length} منتج في السلة` : `${cart.length} item(s)`}
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 ms-auto">
                        {[
                            { n: 1, label: ar ? 'البيانات' : 'Info' },
                            { n: 2, label: ar ? 'الدفع' : 'Payment' },
                        ].map((s, i) => (
                            <div key={s.n} className="flex items-center gap-2">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${step >= s.n ? 'bg-primary text-white' : darkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                    {step > s.n ? <CheckCircle2 className="w-3 h-3" /> : <span>{s.n}</span>}
                                    <span className="hidden sm:inline">{s.label}</span>
                                </div>
                                {i === 0 && <div className={`w-6 h-0.5 rounded-full ${step > 1 ? 'bg-primary' : darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT: Forms */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">

                            {/* ── STEP 1: INFO ── */}
                            {step === 1 && (
                                <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">

                                    {/* Personal Info */}
                                    <div className={`${card} border rounded-[2rem] p-6`}>
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            <h3 className={`text-sm font-black ${textC} uppercase tracking-wider`}>{ar ? 'البيانات الشخصية' : 'Personal Info'}</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { key: 'fullName', label: ar ? 'الاسم الكامل *' : 'Full Name *', type: 'text', icon: User },
                                                { key: 'phone', label: ar ? 'رقم الجوال *' : 'Phone Number *', type: 'tel', icon: Phone },
                                            ].map(({ key, label, type, icon: Icon }) => (
                                                <div key={key} className="relative">
                                                    <Icon className={`absolute ${ar ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                                                    <input
                                                        type={type} placeholder={label} value={formData[key]}
                                                        onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                                                        className={`w-full border rounded-xl py-3 text-sm font-bold outline-none transition-all ${inp} ${ar ? 'pr-10 pl-3' : 'pl-10 pr-3'} ${!formData[key] ? 'border-amber-500/30' : ''}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className={`${card} border rounded-[2rem] p-6`}>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                </div>
                                                <h3 className={`text-sm font-black ${textC} uppercase tracking-wider`}>{ar ? 'عنوان التوصيل' : 'Delivery Address'}</h3>
                                            </div>
                                            <button onClick={detectLocation} className="text-[10px] font-black text-primary flex items-center gap-1 hover:opacity-70 transition-opacity">
                                                <MapPin className="w-3 h-3" />
                                                {ar ? 'تحديد الموقع' : 'Detect'}
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <select
                                                value={formData.city}
                                                onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                                                className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all ${inp} ${!formData.city ? 'border-amber-500/30' : ''}`}
                                            >
                                                <option value="">{ar ? 'اختر المدينة *' : 'Select City *'}</option>
                                                {SAUDI_CITIES.map(c => <option key={c.en} value={c.en}>{ar ? c.ar : c.en}</option>)}
                                            </select>
                                            <input
                                                type="text" placeholder={ar ? 'الحي / اسم الشارع *' : 'District / Street *'}
                                                value={formData.address}
                                                onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                                                className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all ${inp} ${!formData.address ? 'border-amber-500/30' : ''}`}
                                            />
                                            <input
                                                type="text" placeholder={ar ? 'ملاحظات للتوصيل (اختياري)' : 'Delivery notes (optional)'}
                                                value={formData.notes}
                                                onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                                                className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all ${inp}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Trial Session Summary */}
                                    {hasTrial && trialItems[0]?.metadata?.bookedDate && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="border border-primary/30 rounded-[2rem] p-6 bg-primary/5 space-y-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-sm font-black ${textC}`}>{ar ? 'موعد الحصة التجريبية' : 'Trial Session'}</h3>
                                                        <p className={`text-[10px] font-bold ${muted} uppercase tracking-wider`}>{ar ? 'تم تأكيد الحجز' : 'Booking confirmed'}</p>
                                                    </div>
                                                </div>
                                                <Link href="/cart" className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-xl">
                                                    {ar ? 'تعديل' : 'Edit'}
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { icon: Calendar, label: ar ? 'اليوم' : 'Date', val: trialItems[0].metadata.bookedDate },
                                                    { icon: Clock, label: ar ? 'الوقت' : 'Time', val: trialItems[0].metadata.bookedTime },
                                                    {
                                                        icon: trialItems[0].metadata.location === 'gym' ? Building2 : Home,
                                                        label: ar ? 'المكان' : 'Location',
                                                        val: trialItems[0].metadata.location === 'gym'
                                                            ? (getText(trialItems[0].metadata.preSelectedGymName) || (ar ? 'النادي' : 'Gym'))
                                                            : (ar ? 'المنزل' : 'Home')
                                                    },
                                                ].map(({ icon: Icon, label, val }) => (
                                                    <div key={label} className={`${darkMode ? 'bg-white/5' : 'bg-white'} rounded-2xl p-3 text-center`}>
                                                        <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                                                        <p className={`text-[9px] font-bold ${muted} uppercase`}>{label}</p>
                                                        <p className={`text-[10px] font-black ${textC} mt-0.5`}>{val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!formData.fullName || !formData.phone || !formData.city || !formData.address}
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {ar ? 'متابعة لاختيار الدفع' : 'Continue to Payment'}
                                        {ar ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                    </button>
                                </motion.div>
                            )}

                            {/* ── STEP 2: PAYMENT ── */}
                            {step === 2 && (
                                <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">

                                    {/* Delivery Review */}
                                    <div className="border border-emerald-500/30 rounded-[2rem] p-5 bg-emerald-500/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="flex items-center gap-2 text-sm font-black text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {ar ? 'بيانات التوصيل' : 'Delivery Info'}
                                            </span>
                                            <button onClick={() => setStep(1)} className={`text-[10px] font-black text-primary underline`}>{ar ? 'تعديل' : 'Edit'}</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-start">
                                            <div>
                                                <p className={`text-[9px] font-bold ${muted} uppercase mb-0.5`}>{ar ? 'الاسم' : 'Name'}</p>
                                                <p className={`text-xs font-black ${textC}`}>{formData.fullName}</p>
                                            </div>
                                            <div>
                                                <p className={`text-[9px] font-bold ${muted} uppercase mb-0.5`}>{ar ? 'الجوال' : 'Phone'}</p>
                                                <p className={`text-xs font-black ${textC}`}>{formData.phone}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className={`text-[9px] font-bold ${muted} uppercase mb-0.5`}>{ar ? 'العنوان' : 'Address'}</p>
                                                <p className={`text-xs font-black ${textC}`}>{formData.city} — {formData.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className={`${card} border rounded-[2rem] p-6`}>
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <CreditCard className="w-4 h-4 text-primary" />
                                            </div>
                                            <h3 className={`text-sm font-black ${textC} uppercase tracking-wider`}>{ar ? 'طريقة الدفع' : 'Payment Method'}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { v: 'credit_card', label: ar ? 'بطاقة ائتمانية / مدى' : 'Credit / Debit Card', icon: CreditCard, sub: ar ? 'فيزا، ماستركارد، مدى' : 'Visa, Mastercard, Mada' },
                                                { v: 'wallet', label: ar ? 'محفظة إلكترونية' : 'Digital Wallet', icon: Wallet, sub: ar ? 'Apple Pay، STC Pay، Tamara' : 'Apple Pay, STC Pay, Tamara' },
                                                { v: 'cod', label: ar ? 'الدفع عند الاستلام' : 'Cash on Delivery', icon: Package, sub: ar ? 'ادفع عند وصول طلبك' : 'Pay when order arrives' },
                                            ].map(({ v, label, icon: Icon, sub }) => (
                                                <button
                                                    key={v} onClick={() => setPaymentMethod(v)}
                                                    className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${paymentMethod === v ? 'border-primary bg-primary/8' : darkMode ? 'border-white/8 bg-white/3 hover:border-white/15' : 'border-gray-100 bg-slate-50 hover:border-gray-200'}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === v ? 'bg-primary text-white' : darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 text-start">
                                                        <p className={`text-sm font-black ${paymentMethod === v ? 'text-primary' : textC}`}>{label}</p>
                                                        <p className={`text-[10px] font-bold ${muted}`}>{sub}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === v ? 'border-primary' : darkMode ? 'border-white/20' : 'border-gray-300'}`}>
                                                        {paymentMethod === v && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Promo Code */}
                                    <div className={`${card} border rounded-[2rem] p-6`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                                <Tag className="w-4 h-4 text-amber-500" />
                                            </div>
                                            <h3 className={`text-sm font-black ${textC} uppercase tracking-wider`}>{ar ? 'كود الخصم' : 'Promo Code'}</h3>
                                        </div>

                                        {promoApplied ? (
                                            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                    <div>
                                                        <p className="text-sm font-black text-emerald-500">{promoApplied.code}</p>
                                                        <p className={`text-[10px] font-bold ${muted}`}>{ar ? `خصم ${promoApplied.discount}%` : `${promoApplied.discount}% off`} — {ar ? 'وفّرت' : 'Saved'} {discountAmount} {ar ? 'ر.س' : 'SAR'}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setPromoApplied(null)} className={`${muted} hover:text-rose-500 transition-colors`}>
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    value={promoInput}
                                                    onChange={e => setPromoInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                                                    placeholder={ar ? 'أدخل الكود...' : 'Enter promo code...'}
                                                    className={`flex-1 border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all uppercase ${inp}`}
                                                />
                                                <button
                                                    onClick={handleApplyPromo}
                                                    disabled={!promoInput.trim()}
                                                    className="px-5 py-3 bg-amber-500 text-white rounded-xl text-xs font-black disabled:opacity-40 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
                                                >
                                                    {ar ? 'تطبيق' : 'Apply'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Security note */}
                                    <div className={`flex items-center gap-2 justify-center ${muted} py-1`}>
                                        <Lock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold">{ar ? 'جميع المعاملات مشفّرة بتقنية SSL 256-bit' : 'All transactions encrypted with SSL 256-bit'}</span>
                                    </div>

                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 text-sm"
                                    >
                                        {isSubmitting
                                            ? <><Loader2 className="w-5 h-5 animate-spin" /> {ar ? 'جاري إرسال الطلب...' : 'Placing Order...'}</>
                                            : <><ShieldCheck className="w-5 h-5" /> {ar ? `تأكيد الطلب — ${finalTotal} ر.س` : `Confirm Order — ${finalTotal} SAR`}</>
                                        }
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:sticky lg:top-6 h-fit space-y-4">
                        <div className="bg-slate-900 rounded-[2rem] p-6 border border-white/5 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/15 rounded-full blur-[60px] pointer-events-none" />

                            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                                <Box className="w-4 h-4 text-primary" />
                                {ar ? 'ملخص الطلب' : 'Order Summary'}
                            </h3>

                            <div className="space-y-2 mb-5 max-h-72 overflow-y-auto">
                                {cart.map(item => (
                                    <div key={item.cartId} className="flex items-center gap-3 p-2.5 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/10">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-white truncate">{getText(item.name)}</p>
                                            <p className="text-[9px] font-bold text-white/40">
                                                {item.type === 'subscription'
                                                    ? (ar ? 'اشتراك' : 'Subscription')
                                                    : `${item.quantity}x ${item.size || ''}`
                                                }
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-black text-primary whitespace-nowrap">
                                            {(item.price * item.quantity).toFixed(0)} {ar ? 'ر.س' : 'SAR'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2.5 pt-4 border-t border-white/10">
                                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                                    <span>{ar ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                    <span className="text-white/60">{cartTotal} {ar ? 'ر.س' : 'SAR'}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-[10px] font-bold uppercase">
                                        <span className="text-emerald-400">{ar ? 'خصم' : 'Discount'} ({promoApplied?.discount}%)</span>
                                        <span className="text-emerald-400">-{discountAmount} {ar ? 'ر.س' : 'SAR'}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                                    <span>{ar ? 'التوصيل' : 'Shipping'}</span>
                                    <span className="text-emerald-400">{ar ? 'مجاناً' : 'FREE'}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10">
                                    <span className="text-sm font-black text-white uppercase">{ar ? 'الإجمالي' : 'Total'}</span>
                                    <span className="text-2xl font-black text-primary">{finalTotal} <small className="text-[10px] opacity-50">{ar ? 'ر.س' : 'SAR'}</small></span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 opacity-30 justify-center">
                                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Secure Checkout</span>
                            </div>
                        </div>

                        {/* Suggested Products */}
                        {similarProducts.length > 0 && (
                            <div className={`${card} border rounded-[2rem] p-5`}>
                                <h4 className={`text-xs font-black ${textC} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    {ar ? 'قد يعجبك أيضاً' : 'You May Also Like'}
                                </h4>
                                <div className="space-y-2">
                                    {similarProducts.slice(0, 3).map(p => (
                                        <Link key={p.id} href={`/store/${p.id}`} className={`flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-all group`}>
                                            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-white/10">
                                                <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={e => e.target.style.display = 'none'} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[11px] font-black ${textC} truncate`}>{getText(p.name)}</p>
                                                <p className="text-[10px] font-black text-primary">{p.price} {ar ? 'ر.س' : 'SAR'}</p>
                                            </div>
                                            <Plus className={`w-3.5 h-3.5 ${muted} group-hover:text-primary transition-colors shrink-0`} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
