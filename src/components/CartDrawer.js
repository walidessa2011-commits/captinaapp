"use client";
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShoppingBag, X, ShoppingCart, Trash2, 
    ArrowRight, Plus, Minus
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';

export default function CartDrawer() {
    const { 
        darkMode, language, isCartOpen, setIsCartOpen,
        cart, removeFromCart, updateCartQuantity, 
        cartTotal, cartCount 
    } = useApp();

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
                        <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0">
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

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
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
                                        className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-primary/20 transition-all text-start relative"
                                    >
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 shrink-0 shadow-sm">
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                        </div>
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <h4 className="text-xs font-black dark:text-white truncate mb-1">{item.name}</h4>
                                            <div className="flex gap-2 mb-2 min-h-[1.25rem]">
                                                {item.size && (
                                                    <span className="bg-white/10 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-white/5 dark:text-white uppercase">
                                                        {item.size}
                                                    </span>
                                                )}
                                                {item.color && (
                                                    <div 
                                                        className="w-3 h-3 rounded-full border border-white/20 mt-0.5" 
                                                        style={{ backgroundColor: item.color.code }} 
                                                        title={language === 'ar' ? item.color.name_ar : item.color.name_en}
                                                    />
                                                )}
                                            </div>
                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="text-sm font-black text-primary">
                                                    {item.price * item.quantity} <small className="text-[8px] uppercase">SAR</small>
                                                </span>
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
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.cartId)} 
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-8 bg-gray-50 dark:bg-slate-900/50 border-t border-white/10 shrink-0">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                        {language === 'ar' ? 'الإجمالي' : 'Total Value'}
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {cartTotal}
                                        </span>
                                        <span className="text-xs font-bold text-gray-500">SAR</span>
                                    </div>
                                </div>
                                <Link 
                                    href="/checkout" 
                                    onClick={() => setIsCartOpen(false)} 
                                    className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:shadow-primary/50 flex items-center justify-center gap-3 group transition-all text-xs"
                                >
                                    {language === 'ar' ? 'إتمام الطلب' : 'Confirm Order'}
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
