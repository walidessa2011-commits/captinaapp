"use client";
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShoppingBag, X, ShoppingCart, Trash2, 
    ArrowRight, Plus, Minus, AlertCircle,
    Calendar, Clock, MapPin, Home, Dumbbell, Sparkles, CheckCircle2
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';

export default function CartDrawer() {
    const { 
        darkMode, language, isCartOpen, setIsCartOpen,
        cart, removeFromCart, updateCartQuantity, 
        cartTotal, cartCount, updateCartItemMetadata, gyms, t
    } = useApp();

    const [expandedTrialId, setExpandedTrialId] = React.useState(null);

    const isTrialItem = (item) => 
        item.metadata?.isTrial || 
        item.id === 'trial' || 
        item.metadata?.packageId === 'trial' ||
        item.id === 'offer-trial-free' ||
        item.name?.toLowerCase()?.includes('trial') ||
        item.name?.includes('تجريبية');

    const nextDays = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
    });

    const timeSlots = Array.from({ length: 16 }, (_, i) => {
        const hour = i + 7;
        const display = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
        const displayAr = hour > 12 ? `${hour - 12}:00 مساءً` : `${hour}:00 صباحاً`;
        return { display: language === 'ar' ? displayAr : display, raw: `${hour}:00` };
    });

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setIsCartOpen(false)} 
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
                    />
                    <motion.div 
                        initial={{ x: language === 'ar' ? '-100%' : '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: language === 'ar' ? '-100%' : '100%' }} 
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`${darkMode ? 'bg-[#0f172a]' : 'bg-white'} w-full max-w-[450px] h-full shadow-2xl relative z-10 flex flex-col`}
                    >
                        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                                    <ShoppingCart className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-start">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">
                                        {language === 'ar' ? 'حقيبة المنتجات' : 'Gear Bag'}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        {cartCount} {language === 'ar' ? 'قطع مختارة' : 'Items Selected'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsCartOpen(false)} 
                                className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center border border-transparent hover:border-white/10"
                            >
                                <X className="w-5 h-5 dark:text-white" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
                            {cart.length > 0 && cart.some(item => 
                                item.metadata?.isTrial || item.id === 'trial' || item.id === 'offer-trial-free' || item.name?.includes('تجريبية')
                            ) && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-1 rounded-[2rem] bg-gradient-to-br from-primary via-primary/50 to-blue-500 mb-8"
                                >
                                    <div className="bg-white dark:bg-slate-900 rounded-[1.9rem] p-5 flex items-center gap-4 border border-white/5">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <AlertCircle className="w-6 h-6 text-primary animate-pulse" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                                {language === 'ar' ? 'أكمل تفاصيل حصتك التجريبية' : 'Complete Trial Details'}
                                            </h4>
                                            <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
                                                {language === 'ar' ? 'برجاء اختيار الموعد والمكان في حقيبة المنتجات' : 'Please select date & time in your Gear Bag'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale">
                                    <div className="w-32 h-32 mb-8 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-16 h-16 dark:text-white" />
                                    </div>
                                    <h4 className="text-lg font-black dark:text-white mb-2">
                                        {language === 'ar' ? 'السلة فارغة' : 'Your Bag is Empty'}
                                    </h4>
                                    <p className="text-xs font-bold dark:text-gray-400">
                                        {language === 'ar' ? 'ابدأ في اكتشاف وتجهيز معداتك الآن' : 'Start exploring and gearing up now'}
                                    </p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div 
                                        key={item.cartId} 
                                        layout 
                                        initial={{ opacity: 0, x: 20 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        whileHover={{ y: -4, scale: 1.01 }}
                                        className="flex gap-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-white/5 group hover:border-primary/50 transition-all text-start relative hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
                                    >
                                        {/* Premium Hover Gradient Overlay */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/5 via-blue-500/5 to-transparent transition-opacity duration-300 pointer-events-none" />
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 shrink-0 shadow-sm">
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                        </div>
                                        <div className={`flex-1 flex flex-col min-w-0 ${language === 'ar' ? 'pl-8' : 'pr-8'}`}>
                                            <h4 className="text-xs font-black dark:text-white truncate mb-1">{item.name}</h4>
                                            <div className="flex flex-wrap gap-2 mb-2 min-h-[1.25rem]">
                                                {item.type && item.type !== 'product' && (
                                                    <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-md border border-primary/10 uppercase">
                                                        {item.type}
                                                    </span>
                                                )}
                                                {item.size && (
                                                    <span className="bg-white/10 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-white/5 dark:text-white uppercase">
                                                        {item.size}
                                                    </span>
                                                )}
                                                {item.metadata?.trainerName && (
                                                    <span className="text-[8px] text-gray-400 font-bold uppercase truncate max-w-full">
                                                        {language === 'ar' ? 'المدرب: ' : 'Trainer: '} {item.metadata.trainerName}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Unified Trial Booking Section */}
                                            {isTrialItem(item) && (
                                                <div className="mt-4 pt-3 border-t border-primary/10">
                                                    <button 
                                                        onClick={() => setExpandedTrialId(expandedTrialId === item.cartId ? null : item.cartId)}
                                                        className="w-full flex items-center justify-between group/btn py-1"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Sparkles className={`w-4 h-4 ${item.metadata?.bookedDate && item.metadata?.bookedTime ? 'text-green-500' : 'text-primary animate-pulse'}`} />
                                                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                                                {language === 'ar' ? 'بيانات الحصة التجريبية' : 'Trial Session Details'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {item.metadata?.bookedDate && item.metadata?.bookedTime && (
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                            )}
                                                            <motion.div
                                                                animate={{ rotate: expandedTrialId === item.cartId ? 180 : 0 }}
                                                            >
                                                                <Minus className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-primary transition-colors" />
                                                            </motion.div>
                                                        </div>
                                                    </button>

                                                    <AnimatePresence>
                                                        {expandedTrialId === item.cartId && (
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="space-y-4 py-4">
                                                                    {/* Date & Time Selectors */}
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="relative group">
                                                                            <select 
                                                                                value={item.metadata?.bookedDate || ''}
                                                                                onChange={(e) => updateCartItemMetadata(item.cartId, { bookedDate: e.target.value })}
                                                                                className="w-full bg-white dark:bg-[#1a2235] border border-gray-100 dark:border-white/10 rounded-2xl px-3 py-2.5 text-[10px] font-bold text-slate-900 dark:text-white outline-none appearance-none cursor-pointer focus:border-primary/50 transition-all shadow-sm"
                                                                            >
                                                                                <option value="" className="bg-white dark:bg-[#1a2235]">{language === 'ar' ? 'اختر التاريخ' : 'Pick Date'}</option>
                                                                                {nextDays.map((d, idx) => (
                                                                                    <option key={idx} value={d.toISOString().split('T')[0]} className="bg-white dark:bg-[#1a2235]">
                                                                                        {d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                                                                        </div>
                                                                        <div className="relative group">
                                                                            <select 
                                                                                value={item.metadata?.bookedTime || ''}
                                                                                onChange={(e) => updateCartItemMetadata(item.cartId, { bookedTime: e.target.value })}
                                                                                className="w-full bg-white dark:bg-[#1a2235] border border-gray-100 dark:border-white/10 rounded-2xl px-3 py-2.5 text-[10px] font-bold text-slate-900 dark:text-white outline-none appearance-none cursor-pointer focus:border-primary/50 transition-all shadow-sm"
                                                                            >
                                                                                <option value="" className="bg-white dark:bg-[#1a2235]">{language === 'ar' ? 'اختر الوقت' : 'Pick Time'}</option>
                                                                                {timeSlots.map((slot, idx) => (
                                                                                    <option key={idx} value={slot.raw} className="bg-white dark:bg-[#0f172a] hover:bg-primary/10">{slot.display}</option>
                                                                                ))}
                                                                            </select>
                                                                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                                                                        </div>
                                                                    </div>

                                                                    {/* Location Selector */}
                                                                    <div className="flex gap-3">
                                                                        <button 
                                                                            onClick={() => updateCartItemMetadata(item.cartId, { location: 'home' })}
                                                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all ${item.metadata?.location === 'home' || !item.metadata?.location ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20' : 'border-gray-50 dark:border-white/5 bg-white dark:bg-white/5 text-gray-400 opacity-60 hover:opacity-100'}`}
                                                                        >
                                                                            <Home className="w-4 h-4" />
                                                                            <span className="text-[10px] font-black uppercase tracking-tight">{language === 'ar' ? 'المنزل' : 'Home'}</span>
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => updateCartItemMetadata(item.cartId, { location: 'gym' })}
                                                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all ${item.metadata?.location === 'gym' ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20' : 'border-gray-50 dark:border-white/5 bg-white dark:bg-white/5 text-gray-400 opacity-60 hover:opacity-100'}`}
                                                                        >
                                                                            <Dumbbell className="w-4 h-4" />
                                                                            <span className="text-[10px] font-black uppercase tracking-tight">{language === 'ar' ? 'النادي' : 'Gym'}</span>
                                                                        </button>
                                                                    </div>

                                                                    {item.metadata?.location === 'gym' && (
                                                                        <div className="relative group animate-in slide-in-from-top duration-300">
                                                                            <select 
                                                                                value={item.metadata?.preSelectedGymId || ''}
                                                                                onChange={(e) => {
                                                                                    const gym = gyms.find(g => g.id === e.target.value);
                                                                                    updateCartItemMetadata(item.cartId, { 
                                                                                        preSelectedGymId: e.target.value,
                                                                                        preSelectedGymName: language === 'ar' ? gym?.name_ar : gym?.name_en 
                                                                                    });
                                                                                }}
                                                                                className="w-full bg-white dark:bg-[#1a2235] border border-gray-100 dark:border-white/10 rounded-2xl px-3 py-2.5 text-[10px] font-bold text-slate-900 dark:text-white outline-none appearance-none cursor-pointer focus:border-primary/50 transition-all shadow-sm"
                                                                            >
                                                                                <option value="" className="bg-white dark:bg-[#1a2235]">{language === 'ar' ? 'اختر النادي' : 'Pick Gym'}</option>
                                                                                {gyms?.map(gym => (
                                                                                    <option key={gym.id} value={gym.id} className="bg-white dark:bg-[#0f172a]">{language === 'ar' ? gym.name_ar : gym.name_en}</option>
                                                                                ))}
                                                                            </select>
                                                                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}

                                            <div className="mt-auto flex items-center justify-between pt-4">
                                                <span className="text-sm font-black text-primary">
                                                    {item.price * item.quantity} <small className="text-[8px] uppercase">SAR</small>
                                                </span>
                                                {item.type === 'product' && (
                                                    <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-white/10 shadow-sm">
                                                        <button onClick={() => updateCartQuantity(item.cartId, -1)} className="p-1.5 hover:text-primary transition-colors h-6 flex items-center">
                                                            <Minus className="w-3 h-3 dark:text-white" />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-black dark:text-white font-mono">
                                                            {item.quantity}
                                                        </span>
                                                        <button onClick={() => updateCartQuantity(item.cartId, 1)} className="p-1.5 hover:text-primary transition-colors h-6 flex items-center">
                                                            <Plus className="w-3 h-3 dark:text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.cartId)} 
                                            className={`absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'} w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-all z-10 hover:bg-rose-600 hover:scale-110 active:scale-95`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-white/10 shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                        {language === 'ar' ? 'الإجمالي' : 'Total Value'}
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {cartTotal}
                                        </span>
                                        <span className="text-xs font-bold text-gray-500">SAR</span>
                                    </div>
                                </div>

                                {cart.some(isTrialItem) && (
                                    <div className="mb-6 p-4 rounded-3xl bg-primary/5 border border-primary/20 flex items-start gap-4">
                                        <div className="p-2 bg-primary/20 rounded-xl">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-primary uppercase tracking-tight">
                                                {language === 'ar' ? 'أكمل بيانات الحصة التجريبية' : 'Complete Trial Details'}
                                            </h4>
                                            <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold mt-1 leading-relaxed">
                                                {language === 'ar' ? 'يرجى اختيار الموعد والمكان المفضلين للحصة لتتمكن من إتمام الطلب.' : 'Please pick your preferred date, time, and location to finish your order.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <Link 
                                    href="/cart"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full py-4 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:shadow-primary/50 flex items-center justify-center gap-3 group transition-all text-xs"
                                >
                                    {language === 'ar' ? 'عرض حقيبة المنتجات' : 'View Gear Bag'}
                                    <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                                </Link>
                                <p className="text-[9px] text-center mt-4 text-gray-500 font-bold uppercase tracking-widest opacity-60">
                                    {language === 'ar' ? 'تطبق الشروط والأحكام الخاصة بالشحن والاستبدال' : 'Terms & Conditions apply for shipping and returns'}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
