"use client";
import React from 'react';
import { motion } from "framer-motion";
import { 
    ChevronLeft, CreditCard, Box, Truck, 
    ShieldCheck, ArrowRight, ShoppingBag
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';

export default function CheckoutPage() {
    const { darkMode, language, cart, cartTotal } = useApp();

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-20 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto px-6 pt-12">
                <header className="flex items-center justify-between mb-12">
                    <Link href="/store" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                        <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        <span className="text-xs font-black uppercase tracking-widest">{language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
                    </Link>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                        {language === 'ar' ? 'إتمام الطلب' : 'Secure Checkout'}
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Delivery Info */}
                    <div className="space-y-8">
                        <section className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-premium text-start">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">{language === 'ar' ? 'تفاصيل التوصيل' : 'Delivery Details'}</h3>
                            </div>
                            <div className="space-y-4">
                                <input type="text" placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full Name'} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl p-4 text-xs font-bold dark:text-white outline-none focus:ring-2 ring-primary/20 transition-all" />
                                <input type="text" placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl p-4 text-xs font-bold dark:text-white outline-none focus:ring-2 ring-primary/20 transition-all" />
                                <input type="text" placeholder={language === 'ar' ? 'العنوان' : 'Shipping Address'} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl p-4 text-xs font-bold dark:text-white outline-none focus:ring-2 ring-primary/20 transition-all" />
                            </div>
                        </section>

                        <section className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-premium text-start">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 rounded-2xl border-2 border-primary bg-primary/5 flex flex-col items-center gap-2 group transition-all">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase">{language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</span>
                                </button>
                                <button className="p-4 rounded-2xl border-2 border-transparent bg-slate-100 dark:bg-white/5 flex flex-col items-center gap-2 group transition-all hover:border-white/10">
                                    <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase">{language === 'ar' ? 'عند الاستلام' : 'Cash on Delivery'}</span>
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-8">
                        <section className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-start">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                            
                            <h3 className="text-white text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                <Box className="w-4 h-4 text-primary" />
                                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                            </h3>
                            
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pe-2">
                                {cart.map((item) => (
                                    <div key={item.cartId} className="flex justify-between items-center text-white/70">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black">{item.name}</span>
                                            <span className="text-[9px] font-bold opacity-50 uppercase">{item.quantity}x {item.size}</span>
                                        </div>
                                        <span className="text-xs font-black text-white">{item.price * item.quantity} <small className="text-[8px]">SAR</small></span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <div className="flex justify-between text-xs font-bold text-white/50 uppercase">
                                    <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                    <span>{cartTotal} SAR</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-white/50 uppercase">
                                    <span>{language === 'ar' ? 'التوصيل' : 'Delivery'}</span>
                                    <span className="text-primary">{language === 'ar' ? 'مجاناً' : 'FREE'}</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-white/10">
                                    <span className="text-sm font-black text-white uppercase tracking-widest">{language === 'ar' ? 'الإجمالي الكلي' : 'Total Amount'}</span>
                                    <span className="text-xl font-black text-primary">{cartTotal} <small className="text-[10px]">SAR</small></span>
                                </div>
                            </div>

                            <button className="w-full mt-10 bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-3 group text-xs">
                                {language === 'ar' ? 'تأكيد ودفع' : 'Confirm & Pay'}
                                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                                <ShieldCheck className="w-4 h-4 text-white" />
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Secure encrypted payment</span>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
