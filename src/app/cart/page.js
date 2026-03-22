"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
    ShoppingBag, Trash2, Calendar, Clock, 
    Home, Dumbbell, MapPin, CheckCircle2, 
    ArrowRight, Sparkles, ChevronLeft,
    AlertCircle, Minus, Plus, ShieldCheck, Box
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CartPage() {
    const { 
        cart, removeFromCart, updateCartQuantity, 
        updateCartItemMetadata, language, t,
        gyms, userData
    } = useApp();
    const router = useRouter();

    const isTrialItem = (item) => 
        item.metadata?.isTrial || 
        item.id === 'trial' || 
        item.metadata?.packageId === 'trial' ||
        item.id === 'offer-trial-free' ||
        item.name?.toLowerCase()?.includes('trial') ||
        item.name?.includes('تجريبية');

    const hasTrial = useMemo(() => cart.some(isTrialItem), [cart]);
    const trialItems = useMemo(() => cart.filter(isTrialItem), [cart]);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const checkTrialReady = (item) => {
        if (!isTrialItem(item)) return true;
        const meta = item.metadata || {};
        const baseReady = meta.bookedDate && meta.bookedTime && meta.location;
        if (meta.location === 'gym') {
            return baseReady && meta.preSelectedGymId;
        }
        if (meta.location === 'home') {
            return baseReady && (meta.selectedAddressId || meta.customAddress);
        }
        return baseReady;
    };

    const isAllTrialReady = useMemo(() => cart.every(checkTrialReady), [cart]);

    const [editingItemId, setEditingItemId] = useState(null);

    // Removed automatic expansion to allow user control
    // useEffect(() => {
    //     if (hasTrial && !isAllTrialReady) {
    //         const firstUnready = cart.find(item => isTrialItem(item) && !checkTrialReady(item));
    //         if (firstUnready && !editingItemId) {
    //             setEditingItemId(firstUnready.cartId);
    //         }
    //     }
    // }, [hasTrial, isAllTrialReady, cart]);

    const nextDays = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
    });

    const timeSlots = Array.from({ length: 15 }, (_, i) => {
        const hour = i + 7;
        const display = hour > 12 ? `${hour - 12}:00 ${language === 'ar' ? 'مساءً' : 'PM'}` : `${hour}:00 ${language === 'ar' ? 'صباحاً' : 'AM'}`;
        const raw = `${hour}:00`;
        return { display, raw };
    });

    const handleCheckout = () => {
        if (hasTrial && !isAllTrialReady) {
            // Find the item that is not ready and scroll to it
            const firstNotReady = cart.find(item => isTrialItem(item) && !checkTrialReady(item));
            if (firstNotReady) {
                setEditingItemId(firstNotReady.cartId);
                const element = document.getElementById(`item-${firstNotReady.cartId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return;
        }
        router.push('/checkout');
    };


    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    {language === 'ar' ? 'حقيبة المنتجات فارغة' : 'Your Gear Bag is empty'}
                </h1>
                <p className="text-gray-500 mb-8 max-w-sm">
                    {language === 'ar' ? 'لم تقم بإضافة أي حزم أو منتجات بعد. ابدأ بالتسوق الآن!' : 'You haven\'t added any packages or products yet. Start shopping now!'}
                </p>
                <Link 
                    href="/store" 
                    className="bg-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    {language === 'ar' ? 'اكتشف المتجر' : 'Explore Store'}
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E17] py-1 px-4 md:px-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-gray-400 hover:text-primary transition-colors">
                            <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {language === 'ar' ? 'حقيبة المنتجات' : 'Gear Bag'}
                            </h1>
                            <p className="text-sm font-bold text-gray-400">
                                {cart.length} {language === 'ar' ? 'عنصر في الحقيبة' : 'items in your bag'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-3">
                        {/* Cart Items List */}
                        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
                            <div className="p-3 border-b border-gray-50 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                                <h3 className="text-[11px] font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                                    {language === 'ar' ? 'المنتجات والحزم' : 'Bag Items'}
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-white/5">
                                {cart.map((item) => (
                                    <div 
                                        key={item.cartId} 
                                        className={`p-3 md:p-4 flex flex-col md:flex-row gap-4 relative group transition-all hover:bg-primary/[0.02] hover:shadow-2xl hover:shadow-primary/5 rounded-xl border border-transparent hover:border-primary/20 cursor-default`}
                                    >
                                        {/* Image */}
                                        <div className={`w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-white/10 rounded-xl overflow-hidden shrink-0 relative transition-transform group-hover:scale-105`}>
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            {isTrialItem(item) && (
                                                <div className="absolute top-1 left-1 bg-primary text-white p-1 rounded-lg">
                                                    <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow space-y-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full mb-0.5 inline-block">
                                                        {item.type === 'package' ? (language === 'ar' ? 'باقة' : 'Package') : (language === 'ar' ? 'منتج' : 'Product')}
                                                    </span>
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                                        {item.name}
                                                    </h4>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.cartId)}
                                                    className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="text-xl font-black text-primary">
                                                    {item.price === 0 ? (language === 'ar' ? 'مجاني' : 'FREE') : `${item.price * item.quantity} SAR`}
                                                </div>
                                                
                                                {item.type === 'product' && (
                                                    <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/10">
                                                        <button 
                                                            onClick={() => updateCartQuantity(item.cartId, -1)}
                                                            className="p-2 hover:text-primary transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-black text-sm">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => updateCartQuantity(item.cartId, 1)}
                                                            className="p-2 hover:text-primary transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Advanced Collapsible Trial Booking */}
                                            {isTrialItem(item) && (
                                                <div id={`item-${item.cartId}`} className="mt-4 pt-2">
                                                    {/* Status & Toggle Header */}
                                                    <button 
                                                        onClick={() => setEditingItemId(editingItemId === item.cartId ? null : item.cartId)}
                                                        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${checkTrialReady(item) ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10' : 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${checkTrialReady(item) ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                                {checkTrialReady(item) ? <CheckCircle2 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                                            </div>
                                                            <div className="text-start">
                                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">
                                                                    {language === 'ar' ? 'تفاصيل الحجز' : 'BOOKING DETAILS'}
                                                                </p>
                                                                <p className={`text-xs font-bold ${checkTrialReady(item) ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                                    {checkTrialReady(item) 
                                                                        ? (language === 'ar' ? 'تم اختيار الموعد بنجاح' : 'Ready to confirm')
                                                                        : (language === 'ar' ? 'بانتظار إكمال البيانات' : 'Action required')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={`p-2 rounded-lg transition-transform ${editingItemId === item.cartId ? 'rotate-180 bg-white dark:bg-white/5' : ''}`}>
                                                            <ChevronLeft className={`w-4 h-4 text-gray-400 rotate-[-90deg]`} />
                                                        </div>
                                                    </button>

                                                    <AnimatePresence>
                                                        {editingItemId === item.cartId && (
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pt-4 space-y-4 px-1">
                                                                    {/* Selection Form */}
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">{language === 'ar' ? 'اليوم' : 'Date'}</label>
                                                                            <div className="relative group/select">
                                                                                <select 
                                                                                    value={item.metadata?.bookedDate || ''}
                                                                                    onChange={(e) => updateCartItemMetadata(item.cartId, { bookedDate: e.target.value })}
                                                                                    className="w-full bg-white dark:bg-[#1f2937] border-2 border-slate-50 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black dark:text-white outline-none appearance-none focus:border-primary/50 shadow-sm transition-all"
                                                                                >
                                                                                    <option value="" className="dark:bg-[#1f2937]">{language === 'ar' ? 'اختر اليوم' : 'Select Day'}</option>
                                                                                    {nextDays.map((d, idx) => (
                                                                                        <option key={idx} value={d.toISOString().split('T')[0]} className="dark:bg-[#1f2937]">
                                                                                            {d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none transition-transform group-focus-within/select:scale-110" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">{language === 'ar' ? 'الوقت' : 'Time'}</label>
                                                                            <div className="relative group/select">
                                                                                <select 
                                                                                    value={item.metadata?.bookedTime || ''}
                                                                                    onChange={(e) => updateCartItemMetadata(item.cartId, { bookedTime: e.target.value })}
                                                                                    className="w-full bg-white dark:bg-[#1f2937] border-2 border-slate-50 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black dark:text-white outline-none appearance-none focus:border-primary/50 shadow-sm transition-all"
                                                                                >
                                                                                    <option value="" className="dark:bg-[#1f2937]">{language === 'ar' ? 'اختر الوقت' : 'Select Time'}</option>
                                                                                    {timeSlots.map((slot, idx) => (
                                                                                        <option key={idx} value={slot.raw} className="dark:bg-[#1f2937]">{slot.display}</option>
                                                                                    ))}
                                                                                </select>
                                                                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none transition-transform group-focus-within/select:scale-110" />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">{language === 'ar' ? 'مكان التدريب' : 'Training Location'}</label>
                                                                        <div className="grid grid-cols-2 gap-3">
                                                                            <button 
                                                                                onClick={() => updateCartItemMetadata(item.cartId, { location: 'home' })}
                                                                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${item.metadata?.location === 'home' || !item.metadata?.location ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5' : 'border-slate-50 dark:border-white/5 text-gray-400 bg-white dark:bg-white/2'}`}
                                                                            >
                                                                                <Home className="w-4 h-4" />
                                                                                <span className="text-[10px] font-black uppercase">{language === 'ar' ? 'المنزل' : 'Home'}</span>
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => updateCartItemMetadata(item.cartId, { location: 'gym' })}
                                                                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${item.metadata?.location === 'gym' ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5' : 'border-slate-50 dark:border-white/5 text-gray-400 bg-white dark:bg-white/2'}`}
                                                                            >
                                                                                <Dumbbell className="w-4 h-4" />
                                                                                <span className="text-[10px] font-black uppercase">{language === 'ar' ? 'النادي' : 'Gym'}</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    <AnimatePresence>
                                                                        {item.metadata?.location === 'gym' && (
                                                                            <motion.div 
                                                                                initial={{ height: 0, opacity: 0, y: -10 }}
                                                                                animate={{ height: 'auto', opacity: 1, y: 0 }}
                                                                                exit={{ height: 0, opacity: 0, y: -10 }}
                                                                                className="overflow-hidden space-y-2"
                                                                            >
                                                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">{language === 'ar' ? 'اختر النادي المفضل' : 'Pick a Gym'}</label>
                                                                                <div className="relative group/select">
                                                                                    <select 
                                                                                        value={item.metadata?.preSelectedGymId || ''}
                                                                                        onChange={(e) => {
                                                                                            const gym = gyms.find(g => g.id === e.target.value);
                                                                                            updateCartItemMetadata(item.cartId, { 
                                                                                                preSelectedGymId: e.target.value,
                                                                                                preSelectedGymName: language === 'ar' ? gym?.name_ar : gym?.name_en 
                                                                                            });
                                                                                        }}
                                                                                        className="w-full bg-white dark:bg-[#1f2937] border-2 border-slate-50 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black dark:text-white outline-none appearance-none focus:border-primary/50 shadow-sm transition-all"
                                                                                    >
                                                                                        <option value="" className="dark:bg-[#1f2937]">{language === 'ar' ? 'اختر النادي المفضل' : 'Select Gym'}</option>
                                                                                        {gyms?.map(gym => (
                                                                                            <option key={gym.id} value={gym.id} className="dark:bg-[#1f2937]">{language === 'ar' ? gym.name_ar : gym.name_en}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none transition-transform group-focus-within/select:scale-110" />
                                                                                </div>
                                                                            </motion.div>
                                                                        )}

                                                                        {item.metadata?.location === 'home' && (
                                                                            <motion.div 
                                                                                initial={{ height: 0, opacity: 0, y: -10 }}
                                                                                animate={{ height: 'auto', opacity: 1, y: 0 }}
                                                                                exit={{ height: 0, opacity: 0, y: -10 }}
                                                                                className="overflow-hidden space-y-2"
                                                                            >
                                                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">{language === 'ar' ? 'عنوان التدريب' : 'Training Address'}</label>
                                                                                
                                                                                {userData?.addresses && userData.addresses.length > 0 ? (
                                                                                    <div className="relative group/select">
                                                                                        <select 
                                                                                            value={item.metadata?.selectedAddressId || ''}
                                                                                            onChange={(e) => {
                                                                                                const addr = userData.addresses.find(a => a.id === e.target.value);
                                                                                                updateCartItemMetadata(item.cartId, { 
                                                                                                    selectedAddressId: e.target.value,
                                                                                                    selectedAddress: addr?.address || addr?.title,
                                                                                                    customAddress: '' 
                                                                                                });
                                                                                            }}
                                                                                            className="w-full bg-white dark:bg-[#1f2937] border-2 border-slate-50 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black dark:text-white outline-none appearance-none focus:border-primary/50 shadow-sm transition-all"
                                                                                        >
                                                                                            <option value="" className="dark:bg-[#1f2937]">{language === 'ar' ? 'اختر من عناوينك المحفوظة' : 'Choose Saved Address'}</option>
                                                                                            {userData.addresses.map(addr => (
                                                                                                <option key={addr.id} value={addr.id} className="dark:bg-[#1f2937]">{addr.title || addr.address}</option>
                                                                                            ))}
                                                                                            <option value="new" className="dark:bg-[#1f2937]">{language === 'ar' ? '+ إضافة عنوان جديد' : '+ Add New Address'}</option>
                                                                                        </select>
                                                                                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none transition-transform group-focus-within/select:scale-110" />
                                                                                    </div>
                                                                                ) : null}

                                                                                {(!userData?.addresses || userData.addresses.length === 0 || item.metadata?.selectedAddressId === 'new') && (
                                                                                    <div className="relative group/input">
                                                                                        <input 
                                                                                            type="text"
                                                                                            placeholder={language === 'ar' ? 'اكتب العنوان بالتفصيل أو رابط خرائط جوجل' : 'Enter detailed address or Google Maps link'}
                                                                                            value={item.metadata?.customAddress || ''}
                                                                                            onChange={(e) => updateCartItemMetadata(item.cartId, { 
                                                                                                customAddress: e.target.value,
                                                                                                selectedAddressId: 'new',
                                                                                                selectedAddress: e.target.value
                                                                                            })}
                                                                                            className="w-full bg-white dark:bg-[#1f2937] border-2 border-slate-50 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black dark:text-white outline-none focus:border-primary/50 shadow-sm transition-all pr-11"
                                                                                        />
                                                                                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none transition-transform group-focus-within/input:scale-110" />
                                                                                    </div>
                                                                                )}
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>

                                                                    {checkTrialReady(item) && (
                                                                        <motion.button 
                                                                            initial={{ opacity: 0, y: 10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            onClick={() => setEditingItemId(null)}
                                                                            className="w-full py-2.5 bg-primary text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 mt-2"
                                                                        >
                                                                            <CheckCircle2 className="w-4 h-4" />
                                                                            {language === 'ar' ? 'حفظ الحجز والمتابعة' : 'Confirm & Close'}
                                                                        </motion.button>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* Instant Summary when closed */}
                                                    {editingItemId !== item.cartId && checkTrialReady(item) && (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                            className="mt-2 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-white/2 rounded-xl p-3 border border-gray-100 dark:border-white/5"
                                                        >
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                                                <Calendar className="w-3 h-3 text-primary" />
                                                                {item.metadata?.bookedDate}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                                                <Clock className="w-3 h-3 text-primary" />
                                                                {item.metadata?.bookedTime}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl p-3 space-y-2">
                            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase flex items-center gap-2 tracking-widest leading-none mb-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                {language === 'ar' ? 'ملخص الطلب' : 'Summary'}
                            </h3>
                            
                            <div className="space-y-1.5 border-b border-gray-50 dark:border-white/5 pb-2">
                                <div className="flex justify-between text-[11px] dark:text-gray-400 font-bold">
                                    <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                    <span className="text-slate-900 dark:text-white">{total} SAR</span>
                                </div>
                                <div className="flex justify-between text-[11px] dark:text-gray-400 font-bold">
                                    <span>{language === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                                    <span className="text-green-500">{language === 'ar' ? 'مجاني' : 'FREE'}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 -mx-3 px-3 py-1.5 border-y border-gray-50 dark:border-white/5">
                                <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {language === 'ar' ? 'المجموع الكلي' : 'Total'}
                                </span>
                                <span className="text-xl font-black text-primary">
                                    {total} <small className="text-[10px] uppercase">SAR</small>
                                </span>
                            </div>

                            {/* Special Alert for Missing Trial Details */}
                            {hasTrial && !isAllTrialReady && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex gap-2 text-amber-600 dark:text-amber-400"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-black leading-tight">
                                        {language === 'ar' 
                                            ? 'يرجى إكمال بيانات الحجز الخاصة بالحصة التجريبية.' 
                                            : 'Please complete billing details for trial session.'}
                                    </p>
                                </motion.div>
                            )}

                            <button 
                                onClick={handleCheckout}
                                disabled={hasTrial && !isAllTrialReady}
                                className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${hasTrial && !isAllTrialReady ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed' : 'bg-primary text-white shadow-primary/20 hover:shadow-primary/30 active:scale-95'}`}
                            >
                                {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
                                <ArrowRight className={`w-3.5 h-3.5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>

                            <p className="text-[8px] text-center text-gray-400 font-bold px-2 leading-tight">
                                {language === 'ar' 
                                    ? 'بالضغط على هذا الزر، أنت توافق على شروط وأحكام كابتنا وسياسة الخصوصية.' 
                                    : 'By clicking this button, you agree to Captina\'s terms and conditions and privacy policy.'}
                            </p>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="mt-4 flex gap-2">
                            <div className="flex-1 p-3 bg-white/50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
                                <ShieldCheck className="w-4 h-4 text-green-500 mb-1" />
                                <span className="text-[9px] font-black dark:text-gray-300 uppercase leading-none">{language === 'ar' ? 'دفع آمن' : 'Secure'}</span>
                            </div>
                            <div className="flex-1 p-3 bg-white/50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
                                <Box className="w-4 h-4 text-primary mb-1" />
                                <span className="text-[9px] font-black dark:text-gray-300 uppercase leading-none">{language === 'ar' ? 'توصيل سريع' : 'Fast'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

