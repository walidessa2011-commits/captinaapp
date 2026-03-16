"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, ShoppingBag, Star, 
    ArrowRight, ArrowLeft, Heart, Plus, 
    ChevronRight, ChevronLeft, Shield, Zap, Sparkles
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';

export default function StorePage() {
    const { darkMode, language, t } = useApp();
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const cartCount = 2;

    const products = t('productsData') || [];
    const categories = t('categoriesData') || [];

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === categories.find(c => c.id === activeCategory)?.name;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-32 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
            
            {/* Header / Breadcrumbs - Mobile Premium Alignment */}
            <header className="relative z-20 pt-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-start">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-4 text-[11px] font-black uppercase tracking-[0.2em] opacity-60"
                    >
                        <Link href="/" className="hover:text-primary transition-colors text-slate-900 dark:text-white">
                            {language === 'ar' ? 'الرئيسية' : 'Home'}
                        </Link>
                        <span className="text-gray-400">
                            {language === 'ar' ? ' / ' : ' / '}
                        </span>
                        <span className="text-primary font-black">
                            {language === 'ar' ? 'المتجر' : 'Store'}
                        </span>
                    </motion.div>

                    <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                        {/* Titling Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-1"
                        >
                            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                                {language === 'ar' ? 'تجهيزات الأبطال' : 'Elite Gear Store'}
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-primary rounded-full"></div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-80">
                                    {language === 'ar' ? 'جودة عالمية لمعداتك الرياضية' : 'Premium equipment for champions'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Search & Cart Component */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 w-full md:w-auto"
                        >
                            <div className="relative flex-1 md:w-80 group">
                                <Search className={`absolute ${language === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors`} />
                                <input 
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 h-12 px-12 text-xs font-black text-slate-900 dark:text-white outline-none focus:border-primary transition-all placeholder:opacity-50"
                                />
                            </div>
                            <button className="relative h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all">
                                <ShoppingBag className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-primary text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-primary">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
                {/* Categories */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{t('categoriesTitle')}</h2>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        <button 
                            onClick={() => setActiveCategory("all")}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border font-black text-[10px] uppercase tracking-widest active:scale-95 ${activeCategory === 'all' ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-primary/30'}`}
                        >
                            <span>🎁</span>
                            {language === 'ar' ? 'الكل' : 'All'}
                        </button>
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border font-black text-[10px] uppercase tracking-widest active:scale-95 ${activeCategory === cat.id ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-primary/30'}`}
                            >
                                <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/20">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                                </div>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, idx) => (
                            <motion.div 
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group"
                            >
                                <div className="bg-white/80 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium group transition-all duration-500 hover:shadow-active hover:-translate-y-2 flex flex-col h-full active:scale-[0.98]">
                                    <div className="relative aspect-square overflow-hidden m-1.5 rounded-[1.8rem]">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
                                        
                                        <div className="absolute top-3 end-3">
                                            <button className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl text-white hover:text-rose-500 transition-all border border-white/30 flex items-center justify-center group-active:scale-90">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="absolute top-3 start-3">
                                            <div className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-[9px] font-black text-white flex items-center gap-1">
                                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                                {product.rating}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 pb-5 pt-2 flex flex-col flex-1">
                                        <div className="mb-4 text-start">
                                            <span className="text-[8px] font-black text-primary uppercase tracking-widest block mb-1">{product.category}</span>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{product.price}</span>
                                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{t('currency')}</span>
                                            </div>
                                            <button className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shadow-lg active:scale-90">
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Promotional Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 mb-20 p-1 rounded-[3.5rem] bg-gradient-to-br from-primary via-primary/50 to-indigo-500 shadow-3xl group relative overflow-hidden text-start"
                >
                    <div className="bg-slate-950 rounded-[3.4rem] p-10 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-2xl">
                                <span className="bg-primary text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block shadow-lg">
                                    {language === 'ar' ? 'خصومات الموسم' : 'Season Super Sale'}
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-none tracking-tighter uppercase italic">
                                    {language === 'ar' ? 'تجهز كبطل حقيقي بخصومات تصل لـ ٤٠٪' : 'Unleash the Beast with 40% Off'}
                                </h2>
                                <p className="text-white/50 text-base font-bold mb-10 leading-relaxed uppercase tracking-widest opacity-80">
                                    {language === 'ar' ? 'جميع أدوات الملاكمة والمعدات الرياضية المختارة متفرة الآن بأسعار حصرية لفترة محدودة جداً.' : 'Top-tier combat gear and premium performance apparel are now within your reach. Limited stock available.'}
                                </p>
                                <button className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2rem] hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                                    {t('buyNow')}
                                    <ArrowRight className={`w-4 h-4 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="hidden lg:block relative shrink-0">
                                <div className="w-80 h-80 rounded-full border border-white/5 flex items-center justify-center p-12 bg-white/5 backdrop-blur-3xl animate-float">
                                    <ShoppingBag className="w-full h-full text-white opacity-20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
