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
        <div className="min-h-screen bg-[#0a0f1a] pb-40 transition-colors duration-500 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-0 -translate-x-1/2 translate-y-1/2"></div>

            {/* Premium Compact Header */}
            <section className="relative pt-4 pb-2 px-4 z-20 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between gap-2 border-b border-white/5 pb-2"
                >
                    <div className="flex flex-col text-start">
                        <h1 className="text-base md:text-lg font-black text-white tracking-tighter flex items-center gap-2">
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">{t('main') || 'الرئيسية'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">{language === 'ar' ? 'المتجر' : 'Store'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'متجر كابتينة' : 'Captina Store'}</span>
                        </h1>
                        <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">
                            {language === 'ar' ? 'تجهيزات الأبطال في مكان واحد' : "Champions' gear in one place"}
                        </p>
                    </div>

                    {/* Desktop Search & Cart - Compact */}
                    <div className="flex items-center gap-3">
                        <div className="relative group flex items-center max-w-[150px] md:max-w-xs">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                className="w-full bg-[#1a2235]/60 backdrop-blur-3xl border border-white/5 rounded-lg py-1.5 px-3 ps-8 focus:bg-white/5 transition-all outline-none text-white font-bold text-[9px] text-start"
                            />
                            <Search className={`absolute ${language === 'en' ? 'left-2.5' : 'right-2.5'} w-3 h-3 text-white/40 group-focus-within:text-primary transition-colors`} />
                        </div>
                        <button className="relative p-2 bg-primary rounded-lg text-white shadow-lg active:scale-95 transition-all">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white text-primary text-[7px] font-black rounded flex items-center justify-center border border-[#0a0f1a]">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-4 mt-6 relative z-10">
                {/* Categories - Compact Chips */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                             <Sparkles className="w-4 h-4 text-primary" />
                             <h2 className="text-sm font-black text-white tracking-tight uppercase">{t('categoriesTitle')}</h2>
                        </div>
                        <button className="text-[8px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md border border-white/5 hover:text-white transition-all">
                            {t('viewAll')}
                        </button>
                    </div>
                    
                    <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scrollbar-hide">
                        <button 
                            onClick={() => setActiveCategory("all")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 border ${activeCategory === 'all' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10' : 'bg-[#1a2235]/40 text-gray-400 border-white/5 hover:border-white/10'}`}
                        >
                            <span className="text-xs">🛍️</span>
                            <span className="text-[9px] font-black uppercase tracking-wider">{language === 'ar' ? 'الكل' : 'All'}</span>
                        </button>
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-300 border ${activeCategory === cat.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10' : 'bg-[#1a2235]/40 text-gray-400 border-white/5 hover:border-white/10'}`}
                            >
                                <div className="w-5 h-5 rounded overflow-hidden shadow-md">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-wider">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid - Extreme Density */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, idx) => (
                            <motion.div 
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-[#1a2235]/40 backdrop-blur-xl rounded-xl overflow-hidden border border-white/5 shadow-sm group hover:border-primary/20 transition-all duration-500 flex flex-col h-full"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden m-1.5 rounded-lg group-hover:scale-[1.02] transition-transform">
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a]/80 via-transparent to-transparent opacity-80"></div>
                                    
                                    <div className="absolute top-1.5 end-1.5">
                                        <button className="p-1.5 bg-black/40 backdrop-blur-md rounded-md text-white hover:text-rose-500 transition-all border border-white/10 group-active:scale-95">
                                            <Heart className="w-3 h-3 group-hover:fill-rose-500" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-1.5 start-2">
                                        <div className="flex items-center gap-1 text-[8px] text-white font-black drop-shadow-lg">
                                            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                            <span>{product.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-2.5 pb-2.5 pt-1 text-start flex flex-col flex-1">
                                    <div className="mb-2">
                                        <p className="text-[6px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">{product.category}</p>
                                        <h3 className="text-[10px] font-black text-white line-clamp-1 group-hover:text-primary transition-colors tracking-tighter">
                                            {product.name}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex items-end justify-between mt-auto">
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-xs font-black text-white tracking-tight leading-none">{product.price}</span>
                                            <span className="text-[7px] text-gray-500 font-bold lowercase">{t('currency')}</span>
                                        </div>
                                        <button className="p-1.5 bg-primary text-white rounded-lg shadow hover:scale-105 active:scale-95 transition-all">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Compact Promotional Banner */}
                <div className="mt-16 mb-20 bg-slate-900 rounded-[2rem] p-8 md:p-12 relative overflow-hidden text-start shadow-2xl border border-white/5 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest mb-4 inline-block border border-primary/20">
                                {language === 'ar' ? 'عرض حصري' : 'Exclusive Offer'}
                            </span>
                            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tighter">
                                {language === 'ar' ? 'استعد للبطولة القادمة بقمة لياقتك' : 'Get Ready for the Next Pro Level'}
                            </h2>
                            <p className="text-gray-400 text-xs font-bold mb-6 leading-relaxed opacity-70">
                                {language === 'ar' ? 'خصومات تصل إلى ٤٠٪ على جميع أدوات الملاكمة الاحترافية والمعدات الرياضية المختارة.' : 'Discounts up to 40% on all professional boxing equipment and selected high-perf gear.'}
                            </p>
                            <button className="bg-primary text-white px-8 py-3 rounded-xl text-[10px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl uppercase tracking-widest active:scale-95">
                                {t('buyNow')}
                                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
