"use client";
import { useState, useEffect, useMemo } from 'react';
import { 
    ChevronLeft, CreditCard, Box, Truck, 
    ShieldCheck, ArrowRight, ShoppingBag,
    MapPin, Phone, User, CheckCircle2,
    Package, ArrowLeft, Sparkles, AlertCircle,
    Calendar, Clock, Home, Dumbbell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { darkMode, language, cart, cartTotal, user, userData, products, removeFromCart, gyms, updateCartItemMetadata, setAlert } = useApp();
    const router = useRouter();
    
    const [step, setStep] = useState(1); // 1: Info, 2: Confirmation, 3: Success
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const saudiCities = [
        { en: 'Riyadh', ar: 'الرياض' },
        { en: 'Jeddah', ar: 'جدة' },
        { en: 'Dammam', ar: 'الدمام' },
        { en: 'Mecca', ar: 'مكة المكرمة' },
        { en: 'Medina', ar: 'المدينة المنورة' },
        { en: 'Khobar', ar: 'الخبر' },
        { en: 'Abha', ar: 'أبها' },
        { en: 'Tabuk', ar: 'تبوك' },
        { en: 'Buraidah', ar: 'بريدة' },
        { en: 'Dhofar', ar: 'ظفار' },
        { en: 'Taif', ar: 'الطائف' },
        { en: 'Hail', ar: 'حائل' },
    ];

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        city: '',
        address: ''
    });

    const isTrialItem = (item) => 
        item.metadata?.isTrial || 
        item.id === 'trial' || 
        item.metadata?.packageId === 'trial' ||
        item.id === 'offer-trial-free' ||
        item.name?.toLowerCase()?.includes('trial') ||
        item.name?.includes('تجريبية');

    const trialItems = useMemo(() => cart.filter(isTrialItem), [cart]);
    const hasTrial = trialItems.length > 0;



    const detectLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // For a more premium experience, we could use reverse geocoding here
                // For now, let's just show an alert or pre-fill with coordinate-based info
                setAlert({
                    title: language === 'ar' ? 'تم تحديد الموقع' : 'Location Detected',
                    message: language === 'ar' ? `تم تحديد موقعك بدقة (${latitude.toFixed(2)}, ${longitude.toFixed(2)})` : `Detected at (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
                    type: 'success'
                });
                setFormData(prev => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
            }, (error) => {
                setAlert({
                    title: language === 'ar' ? 'عذراً' : 'Error',
                    message: language === 'ar' ? 'لم نتمكن من الوصول لموقعك. يرجى تفعيل الموقع.' : 'Could not access location. Please enable location services.',
                    type: 'error'
                });
            });
        }
    };

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || userData.fullName || '',
                phone: prev.phone || userData.phone || '',
                city: prev.city || userData.city || '',
                address: prev.address || userData.address || ''
            }));
        }
    }, [userData]);

    // Sync trial items from cart
    useEffect(() => {
        if (hasTrial && trialItems.length > 0) {
            const item = trialItems[0];
            const meta = item.metadata || {};
            
            // Just for summary display, we can read meta directly
            if (!meta.bookedDate || !meta.bookedTime || !meta.location) {
                // If somehow they got here without data, send them back
                router.push('/cart');
            }
        }
    }, [hasTrial, trialItems, router]);

    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        if (products.length > 0 && cart.length > 0) {
            // Get categories of items in cart
            const cartProductIds = cart.map(item => item.productId);
            const cartCategories = Array.from(new Set(cart.map(item => {
                const p = products.find(prod => prod.id === item.productId);
                return p?.category_en;
            }).filter(Boolean)));

            const filtered = products
                .filter(p => !cartProductIds.includes(p.id))
                .filter(p => cartCategories.length === 0 || cartCategories.includes(p.category_en))
                .slice(0, 4);
            
            let finalProducts = [];
            if (filtered.length < 4) {
                const alreadyIncluded = filtered.map(f => f.id);
                const extras = products
                    .filter(p => !cartProductIds.includes(p.id) && !alreadyIncluded.includes(p.id))
                    .slice(0, 4 - filtered.length);
                finalProducts = [...filtered, ...extras];
            } else {
                finalProducts = filtered;
            }

            // Only update if the IDs changed to avoid infinite loops
            const currentIds = similarProducts.map(p => p.id).join(',');
            const newIds = finalProducts.map(p => p.id).join(',');
            if (currentIds !== newIds) {
                setSimilarProducts(finalProducts);
            }
        } else if (products.length > 0 && similarProducts.length === 0) {
            setSimilarProducts(products.slice(0, 4));
        }
    }, [products, cart, similarProducts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = async () => {
        if (!user) {
            alert(language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                userId: user.uid,
                userEmail: user.email || '',
                userName: formData.fullName || '',
                userPhone: formData.phone || '',
                deliveryInfo: {
                    address: formData.address || '',
                    city: formData.city || ''
                },
                paymentMethod: paymentMethod || 'credit_card',
                items: cart.map(item => ({
                    id: item.productId || item.id || '',
                    cartId: item.cartId || '',
                    name: item.name_en || item.name || '',
                    name_en: item.name_en || item.name || '',
                    name_ar: item.name_ar || '',
                    image: item.image || '',
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    size: item.size || 'N/A',
                    color: item.color || 'N/A',
                    type: item.type || 'product',
                    metadata: item.metadata || {}
                })),
                itemsNames: cart.map(item => item.name_en || item.name || ''),
                totalAmount: cartTotal || 0,
                totalPrice: cartTotal || 0, // for MyOrders compatibility
                status: 'processing',
                statusText: language === 'ar' ? 'قيد المعالجة' : 'Processing',
                createdAt: serverTimestamp()
            };

            const orderRef = await addDoc(collection(db, "orders"), orderData);

            // SPECIAL CASE: Handle Subscriptions and Bookings from Cart items
            for (const item of cart) {
                if (item.type === 'subscription' && item.metadata) {
                    const subData = {
                        ...item.metadata,
                        orderId: orderRef.id,
                        userId: user.uid,
                        status: 'pending',
                        paymentStatus: 'pending',
                        createdAt: serverTimestamp()
                    };

                    // Clean undefined values
                    Object.keys(subData).forEach(key => {
                        if (subData[key] === undefined) subData[key] = null;
                    });

                    await addDoc(collection(db, "subscriptions"), subData);

                    if (item.metadata.isTrial) {
                        // Mark trial as used
                        await updateDoc(doc(db, "users", user.uid), {
                            has_used_trial: true
                        });

                        // Create booking record for trial
                        await addDoc(collection(db, "bookings"), {
                            userId: user.uid,
                            orderId: orderRef.id,
                            trainer: {
                                id: item.metadata.trainerId || '',
                                name: item.metadata.trainerName || ''
                            },
                            date: item.metadata.bookedDate || item.metadata.startDate || '',
                            time: item.metadata.bookedTime || item.metadata.preferredTime || '',
                            trainingLocation: {
                                type: item.metadata.location || 'home',
                                address: item.metadata.location === 'home' ? (formData.address || '') : (item.metadata.preSelectedGymId || ''),
                                gymName: item.metadata.location === 'gym' ? (item.metadata.preSelectedGymName || '') : ''
                            },
                            status: 'confirmed',
                            type: 'trial',
                            sport: {
                                id: item.metadata.sportId || '',
                                name: item.metadata.sportName || ''
                            },
                            createdAt: serverTimestamp()
                        });
                    }
                }
            }
            
            // Clear cart
            cart.forEach(item => removeFromCart(item.cartId));
            
            setStep(3);
        } catch (error) {
            console.error("Error creating order:", error);
            alert(language === 'ar' ? 'حدث خطأ أثناء إتمام الطلب' : 'Error completing order');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 3) {
        return (
            <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} flex items-center justify-center p-6`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="max-w-md w-full bg-white dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/10 shadow-premium text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-primary to-blue-500" />
                    
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                    >
                        <CheckCircle2 className="w-12 h-12" />
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-emerald-500/20 rounded-full"
                        />
                    </motion.div>

                    <h2 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tighter uppercase italic`}>
                        {language === 'ar' ? 'تهانينا! تم استلام طلبك' : 'Congrats! Order Placed'}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 mb-10 leading-relaxed uppercase tracking-widest px-4">
                        {language === 'ar' ? 'نحن نجهز معداتك الآن. يمكنك تتبع حالة الطلب من ملفك الشخصي.' : "We're preparing your gear. You can track your order status in your profile."}
                    </p>

                    <div className="space-y-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href="/profile/orders" className="block w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black transition-all">
                                {language === 'ar' ? 'عرض طلباتي' : 'View My Orders'}
                            </Link>
                        </motion.div>
                        <Link href="/store" className="block w-full py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-all flex items-center justify-center gap-2 group">
                            {language === 'ar' ? 'العودة للمتجر' : 'Continue Shopping'}
                            <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-20 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-6xl mx-auto px-4 pt-8">
                <header className="flex items-center justify-between mb-8">
                    <Link href="/store" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                        <ChevronLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
                    </Link>
                    <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                        {language === 'ar' ? 'إتمام الطلب' : 'Secure Checkout'}
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column: Form / Confirmation */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8 order-1">
                        <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8 text-start"
                            >
                                <section className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-5 lg:p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-xs font-black dark:text-white uppercase tracking-widest leading-none">{language === 'ar' ? 'البيانات الشخصية' : 'Personal Information'}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-start">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                                            <input 
                                                type="text" 
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder={language === 'ar' ? 'الاسم' : 'Full Name'} 
                                                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-3.5 text-[11px] font-bold dark:text-white outline-none focus:ring-2 ring-primary/20 transition-all text-start" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">{language === 'ar' ? 'الهاتف' : 'Phone'}</label>
                                            <input 
                                                type="text" 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder={language === 'ar' ? 'الرقم' : 'Phone'} 
                                                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-3.5 text-[11px] font-bold dark:text-white outline-none focus:ring-2 ring-primary/20 transition-all text-start" 
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-5 lg:p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-xs font-black dark:text-white uppercase tracking-widest leading-none">{language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-start">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between px-2 min-h-[14px]">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'المدينة' : 'City'}</label>
                                            </div>
                                            <select 
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-3.5 text-[11px] font-bold dark:text-white outline-none focus:ring-2 ring-primary/20 transition-all ${!formData.city ? 'ring-2 ring-amber-500/30' : ''}`} 
                                            >
                                                <option value="">{language === 'ar' ? 'اختر' : 'City'}</option>
                                                {saudiCities.map(city => (
                                                    <option key={city.en} value={city.en}>
                                                        {language === 'ar' ? city.ar : city.en}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between px-2 min-h-[14px]">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'الحي/الشارع' : 'District'}</label>
                                                <button 
                                                    onClick={detectLocation}
                                                    className="text-[8px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:opacity-70"
                                                >
                                                    <MapPin className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                            <input 
                                                type="text" 
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder={language === 'ar' ? 'الحي' : 'District'} 
                                                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-3.5 text-[11px] font-bold dark:text-white outline-none focus:ring-2 ring-primary/20 transition-all text-start" 
                                            />
                                        </div>
                                    </div>
                                </section>

                                {hasTrial && trialItems[0]?.metadata?.bookedDate && (
                                    <motion.section 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-primary/5 dark:bg-primary/5 backdrop-blur-xl p-6 rounded-[2rem] border border-primary/20 shadow-premium space-y-4 overflow-hidden relative"
                                    >
                                        <div className="flex items-center justify-between relative text-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div className="text-start">
                                                    <h3 className="text-sm font-black dark:text-white uppercase tracking-widest leading-none">
                                                        {language === 'ar' ? 'موعد الحصة التجريبية' : 'Trial Session Booking'}
                                                    </h3>
                                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                                        {language === 'ar' ? 'تم تأكيد الموعد' : 'Booking confirmed'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link href="/cart" className="text-[10px] font-black text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary/20 transition-all">
                                                {language === 'ar' ? 'تعديل' : 'Edit'}
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center text-center gap-1">
                                                <Calendar className="w-4 h-4 text-primary mb-1" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{language === 'ar' ? 'اليوم' : 'Day'}</span>
                                                <span className="text-xs font-black dark:text-white">{trialItems[0].metadata.bookedDate}</span>
                                            </div>
                                            <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center text-center gap-1">
                                                <Clock className="w-4 h-4 text-primary mb-1" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{language === 'ar' ? 'الوقت' : 'Time'}</span>
                                                <span className="text-xs font-black dark:text-white">{trialItems[0].metadata.bookedTime}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                                {trialItems[0].metadata.location === 'gym' ? <Dumbbell className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                                            </div>
                                            <div className="text-start">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'مكان الحصة' : 'Location'}</span>
                                                <h4 className="text-xs font-black dark:text-white uppercase tracking-tight">
                                                    {trialItems[0].metadata.location === 'gym' ? (trialItems[0].metadata.preSelectedGymName || (language === 'ar' ? 'في النادي' : 'At Gym')) : (language === 'ar' ? 'في المنزل' : 'At Home')}
                                                </h4>
                                            </div>
                                        </div>
                                    </motion.section>
                                )}

                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={
                                        !formData.fullName || 
                                        !formData.phone || 
                                        !formData.address || 
                                        !formData.city ||
                                        (hasTrial && (
                                            !trialItems[0]?.metadata?.bookedDate || 
                                            !trialItems[0]?.metadata?.bookedTime || 
                                            (trialItems[0]?.metadata?.location === 'gym' && !trialItems[0]?.metadata?.preSelectedGymId)
                                        ))
                                    }
                                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 group text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {language === 'ar' ? 'تأكيد البيانات واختيار الدفع' : 'Confirm Information & Payment'}
                                    <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} 
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6 text-start"
                            >
                                {/* Review Section */}
                                <div className="bg-emerald-50 dark:bg-emerald-500/5 backdrop-blur-xl p-6 rounded-[2rem] border border-emerald-500/20 shadow-premium space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            {language === 'ar' ? 'مراجعة بيانات التوصيل' : 'Review Delivery Info'}
                                        </h3>
                                        <button onClick={() => setStep(1)} className="text-[10px] font-black text-primary uppercase underline tracking-widest">
                                            {language === 'ar' ? 'تعديل' : 'Edit'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/50 dark:bg-white/10 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                                <User className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5 tracking-tighter">{language === 'ar' ? 'المستلم' : 'Receiver'}</p>
                                                <p className="text-sm font-black dark:text-white uppercase tracking-tighter">{formData.fullName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/50 dark:bg-white/10 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                                <Phone className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5 tracking-tighter">{language === 'ar' ? 'رقم التواصل' : 'Contact No.'}</p>
                                                <p className="text-sm font-black dark:text-white">{formData.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 md:col-span-2">
                                            <div className="w-10 h-10 bg-white/50 dark:bg-white/10 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                                <MapPin className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5 tracking-tighter">{language === 'ar' ? 'عنوان التوصيل' : 'Delivery Destination'}</p>
                                                <p className="text-sm font-black dark:text-white uppercase tracking-tighter">{formData.city}, {formData.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Selection Section */}
                                <section className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <CreditCard className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-xs font-black dark:text-white uppercase tracking-widest">{language === 'ar' ? 'اختر طريقة الدفع' : 'Choose Payment Method'}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => setPaymentMethod('credit_card')}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 group transition-all ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-transparent bg-slate-100 dark:bg-white/5 hover:border-black/10'}`}
                                        >
                                            <CreditCard className={`w-5 h-5 ${paymentMethod === 'credit_card' ? 'text-primary' : 'text-gray-400'}`} />
                                            <span className={`text-[9px] font-black uppercase ${paymentMethod === 'credit_card' ? 'text-primary' : 'text-gray-500'}`}>{language === 'ar' ? 'بطاقة' : 'Card'}</span>
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 group transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-transparent bg-slate-100 dark:bg-white/5 hover:border-black/10'}`}
                                        >
                                            <ShoppingBag className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-primary' : 'text-gray-400'}`} />
                                            <span className={`text-[9px] font-black uppercase ${paymentMethod === 'cod' ? 'text-primary' : 'text-gray-500'}`}>{language === 'ar' ? 'كاش' : 'Cash'}</span>
                                        </button>
                                    </div>
                                </section>
                                
                                <div className="pt-4">
                                    <button 
                                        onClick={handleSubmitOrder}
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 group text-xs disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                {language === 'ar' ? 'إرسال الطلب الآن' : 'Send Order Now'}
                                                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="w-full mt-6 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-rose-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className={`w-3 h-3 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                        {language === 'ar' ? 'العودة لتعديل البيانات' : 'Back to Edit Details'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6 order-2 lg:sticky lg:top-8 h-fit">
                        <section className="bg-slate-900 border border-white/5 p-5 lg:p-6 rounded-[2rem] shadow-2xl relative overflow-hidden text-start">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                            
                            <h3 className="text-white text-[10px] lg:text-xs font-black uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-3">
                                <Box className="w-4 h-4 text-primary" />
                                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                            </h3>
                            
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pe-2">
                                {cart.map((item) => (
                                    <div key={item.cartId} className="flex justify-between items-center text-white/70">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black truncate max-w-[120px] uppercase tracking-tighter dark:text-white">{item.name}</span>
                                            {item.type === 'subscription' ? (
                                                <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest text-primary">
                                                    {item.metadata?.trainerName ? `${language === 'ar' ? 'مع ' : 'With '} ${item.metadata.trainerName}` : (language === 'ar' ? 'بدون مدرب' : 'Self-training')}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest text-white/70">
                                                    {item.quantity}x {item.size !== 'N/A' && item.size ? item.size : ''} {item.color && item.color !== 'N/A' ? `/ ${item.color?.name_en || item.color}` : ''}
                                                </span>
                                            )}
                                            {isTrialItem(item) && item.metadata?.bookedDate && (
                                                <div className="flex flex-col gap-0.5 mt-1 border-l border-primary/30 pl-2">
                                                    <span className="text-[8px] font-black text-primary/80 flex items-center gap-1 uppercase">
                                                        <Calendar className="w-2.5 h-2.5" />
                                                        {item.metadata.bookedDate} @ {item.metadata.bookedTime}
                                                    </span>
                                                    <span className="text-[8px] font-black text-primary/60 flex items-center gap-1 uppercase">
                                                        <MapPin className="w-2.5 h-2.5" />
                                                        {item.metadata.location === 'gym' ? (item.metadata.preSelectedGymName || (language === 'ar' ? 'النادي' : 'The Club')) : (language === 'ar' ? 'المنزل' : 'At Home')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-black text-white shrink-0 tracking-tighter">{item.price * item.quantity} <small className="text-[8px] opacity-40 uppercase">SAR</small></span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                    <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                    <span className="text-white/70">{cartTotal} SAR</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                    <span>{language === 'ar' ? 'التوصيل' : 'Delivery Fee'}</span>
                                    <span className="text-emerald-500">{language === 'ar' ? 'مجاناً' : 'FREE'}</span>
                                </div>
                                <div className="flex justify-between pt-6 border-t border-white/10">
                                    <span className="text-sm font-black text-white uppercase tracking-widest">{language === 'ar' ? 'الإجمالي الكلي' : 'Grand Total'}</span>
                                    <span className="text-2xl font-black text-primary tracking-tighter">{cartTotal} <small className="text-[10px] opacity-50">SAR</small></span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-2 opacity-30 justify-center">
                                <ShieldCheck className="w-4 h-4 text-white" />
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Secure encrypted checkout</span>
                            </div>
                        </section>
                    </div>

                    {/* Similar Products Section */}
                    <div className="lg:col-span-2 mt-4 lg:mt-12 space-y-6 lg:space-y-8 order-3">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2.5 bg-amber-500/10 rounded-2xl">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                            </div>
                            <h3 className="text-lg lg:text-xl font-black dark:text-white uppercase tracking-tighter italic">
                                {language === 'ar' ? 'منتجات قد تنال إعجابك' : 'Suggested for You'}
                            </h3>
                            <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'أكمل مجموعتك الرياضية' : 'Complete your training gear'}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProducts.map((p) => (
                                <motion.div
                                    key={p.id}
                                    whileHover={{ y: -10 }}
                                    className="group relative bg-white dark:bg-[#1e293b]/50 rounded-[2.5rem] p-4 border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-all text-start"
                                >
                                    <Link href={`/store/${p.id}`}>
                                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-5 bg-gray-50 dark:bg-white/5 relative">
                                            <img 
                                                src={p.image} 
                                                alt={p.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{language === 'ar' ? 'عرض المنتج' : 'View Product'}</span>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <h4 className="text-[11px] font-black dark:text-white uppercase tracking-tight truncate mb-1">{p.name}</h4>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs font-black text-primary">{p.price} <small className="text-[8px] uppercase">SAR</small></p>
                                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowRight className={`w-3 h-3 text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
