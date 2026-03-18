"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, ShoppingBag, Star, 
    ArrowRight, Heart, Plus, Minus,
    Sparkles, X, ShoppingCart, Trash2,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StorePage() {
    const { 
        darkMode, language, products, categories, 
        cart, removeFromCart, updateCartQuantity, 
        cartTotal, cartCount, isCartOpen, setIsCartOpen
    } = useApp();
    
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    
    const router = useRouter();

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === categories.find(c => c.id === activeCategory)?.name;
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleOpenProduct = (product) => {
        router.push(`/store/${product.id}`);
    };

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-32 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Minimal Spacer */}
            <div className="h-4 md:h-8"></div>

            <main className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Top Action Bar - Title & Back */}
                <div className="mb-4 p-1 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between shadow-premium transition-all">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => router.push('/')}
                            className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-colors active:scale-95"
                        >
                            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-3 px-2 py-2 text-slate-900 dark:text-white">
                            <ShoppingBag className="w-4 h-4 text-primary" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                {language === 'ar' ? 'المتجر ' : 'Elite Store'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pr-2 rtl:pr-0 rtl:pl-2">
                        {/* Compact Search */}
                        <div className="relative group hidden sm:block">
                            <Search className={`absolute ${language === 'en' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50 group-focus-within:text-white transition-colors`} />
                            <input 
                                type="text"
                                placeholder={language === 'ar' ? 'ابحث...' : 'Search...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-2 h-9 px-9 text-[10px] font-black text-white outline-none focus:border-white/30 transition-all placeholder:opacity-40 w-40 lg:w-60"
                            />
                        </div>
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all border border-white/20"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-primary text-[8px] font-black rounded-md flex items-center justify-center border border-primary">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-6 text-start">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{language === 'ar' ? 'التصنيفات' : 'Categories'}</h2>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        <button 
                            onClick={() => setActiveCategory("all")}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border font-black text-[10px] uppercase tracking-widest active:scale-95 ${activeCategory === 'all' ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-primary/30'}`}
                        >
                            <span>🎁</span> {language === 'ar' ? 'الكل' : 'All'}
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
                                key={product.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: idx * 0.05 }}
                                className="group cursor-pointer"
                                onClick={() => handleOpenProduct(product)}
                            >
                                <div className="bg-white/80 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium group transition-all duration-500 hover:shadow-active hover:-translate-y-2 flex flex-col h-full active:scale-[0.98]">
                                    <div className="relative aspect-square overflow-hidden m-1.5 rounded-[1.8rem]">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
                                        <div className="absolute top-3 end-3">
                                            <button className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl text-white hover:text-rose-500 transition-all border border-white/30 flex items-center justify-center group-active:scale-90" onClick={(e) => e.stopPropagation()}>
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="absolute top-3 start-3">
                                            <div className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-[9px] font-black text-white flex items-center gap-1">
                                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {product.rating}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 pb-5 pt-2 flex flex-col flex-1 text-start">
                                        <div className="mb-4">
                                            <span className="text-[8px] font-black text-primary uppercase tracking-widest block mb-1">{product.category}</span>
                                            <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tighter">{product.price}</span>
                                                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">SAR</span>
                                            </div>
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shadow-lg shadow-black/10">
                                                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
