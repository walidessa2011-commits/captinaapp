"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, ShoppingBag, Star, 
    ArrowRight, ArrowLeft, Heart, Plus, 
    ChevronRight, ChevronLeft
} from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function StorePage() {
    const { darkMode, language, t } = useApp();
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const products = t('productsData') || [];
    const categories = t('categoriesData') || [];

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === categories.find(c => c.id === activeCategory)?.name;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-32">
            {/* Header / Search Area */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-white/5 pt-8 pb-6 px-4 sticky top-0 z-30 transition-colors">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-start">
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">{t('storeTitle')}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold transition-colors">{t('storeSub')}</p>
                        </div>
                        <button className="relative p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-all">
                            <ShoppingBag className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                                2
                            </span>
                        </button>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 start-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder={t('searchPlaceholder')}
                            className="w-full bg-gray-50 dark:bg-slate-900/50 border-0 rounded-2xl py-4 ps-12 pe-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all text-start"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* Categories */}
                <div className="mb-10 text-start">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white transition-colors">{t('categoriesTitle')}</h2>
                        <button className="text-primary text-xs font-black flex items-center gap-1">
                            {t('viewAll')}
                            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scrollbar-hide">
                        <button 
                            onClick={() => setActiveCategory("all")}
                            className={`flex-none px-6 py-3 rounded-2xl font-black text-sm transition-all border ${
                                activeCategory === 'all' 
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' 
                                : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5'
                            }`}
                        >
                            {language === 'ar' ? 'الكل' : 'All'}
                        </button>
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex-none px-6 py-3 rounded-2xl font-black text-sm transition-all border flex items-center gap-3 ${
                                    activeCategory === cat.id 
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' 
                                    : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5'
                                }`}
                            >
                                <img src={cat.img} alt={cat.name} className="w-6 h-6 rounded-lg object-cover" />
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div 
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all duration-500"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 end-3 flex flex-col gap-2">
                                        <button className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 start-3">
                                        <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] text-white font-bold">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            {product.rating}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 text-start">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-wider mb-1">{product.category}</p>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white line-clamp-1 mb-2 transition-colors">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold">{t('currency')}</span>
                                            <span className="text-lg font-black text-gray-900 dark:text-white leading-none transition-colors">{product.price}</span>
                                        </div>
                                        <button className="w-10 h-10 bg-gray-900 dark:bg-primary rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg shadow-gray-200 dark:shadow-primary/20">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Promotional banner */}
                <div className="mt-12 bg-gray-900 dark:bg-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden text-start">
                    <div className="relative z-10 max-w-[60%]">
                        <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-4 inline-block">
                            {language === 'ar' ? 'عرض حصري' : 'Exclusive Offer'}
                        </span>
                        <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                            {language === 'ar' ? 'استعد للبطولة القادمة' : 'Get Ready for the Next Championship'}
                        </h2>
                        <p className="text-gray-400 text-sm font-bold mb-6">
                            {language === 'ar' ? 'خصومات تصل إلى ٤٠٪ على جميع أدوات الملاكمة' : 'Discounts up to 40% on all boxing equipment'}
                        </p>
                        <button className="bg-white text-gray-900 px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                            {t('buyNow')}
                            {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                    {/* Abstract shapes for design */}
                    <div className="absolute -end-10 -bottom-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute end-4 bottom-4 w-32 h-32 opacity-20">
                        <ShoppingBag className="w-full h-full text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
