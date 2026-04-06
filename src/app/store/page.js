"use client";
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShoppingBag, Star, Heart, Plus, Minus,
    ShoppingCart, ChevronLeft, ChevronRight, Filter,
    X, SlidersHorizontal, TrendingUp, Sparkles, Tag,
    Check, Grid3X3, List, ArrowUpDown, Zap
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── Sort options ────────────────────────────────────────────────
const SORT_OPTIONS = [
    { k: 'default', ar: 'الافتراضي', en: 'Default' },
    { k: 'price_asc', ar: 'السعر: الأقل أولاً', en: 'Price: Low to High' },
    { k: 'price_desc', ar: 'السعر: الأعلى أولاً', en: 'Price: High to Low' },
    { k: 'rating', ar: 'الأعلى تقييماً', en: 'Top Rated' },
    { k: 'name', ar: 'الاسم أ-ي', en: 'Name A-Z' },
];

// ── Product Card ────────────────────────────────────────────────
function ProductCard({ product, ar, darkMode, onAddToCart, isFavorite, onToggleFav, view }) {
    const [adding, setAdding] = useState(false);
    const getText = (f) => !f ? '' : typeof f === 'object' ? f[ar ? 'ar' : 'en'] || f.ar || f.en || '' : f;

    const handleAdd = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        onAddToCart(product);
        setTimeout(() => setAdding(false), 1000);
    };

    const discount = product.oldPrice && product.oldPrice > product.price
        ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

    if (view === 'list') {
        return (
            <Link href={`/store/${product.id}`}>
                <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-4 p-3 rounded-2xl border transition-all hover:border-primary/30 active:scale-[0.99] ${darkMode ? 'bg-white/5 border-white/8 hover:bg-white/8' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                        {discount > 0 && <span className="absolute top-1 start-1 text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded-md">-{discount}%</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-[9px] font-black text-primary uppercase tracking-wider mb-0.5`}>{getText(product.category)}</p>
                        <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>{getText(product.name)}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-current" />
                            <span className="text-[10px] font-bold text-amber-500">{product.rating}</span>
                            {Array.isArray(product.sizes) && product.sizes.length > 0 && <span className={`text-[9px] font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'} ms-1`}>{product.sizes.length} {ar ? 'مقاس' : 'sizes'}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <div>
                            {product.oldPrice && <span className={`text-[9px] line-through ${darkMode ? 'text-gray-600' : 'text-gray-400'} block text-end`}>{product.oldPrice}</span>}
                            <span className={`text-base font-black text-primary`}>{product.price} <span className={`text-[9px] font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{ar ? 'ر.س' : 'SAR'}</span></span>
                        </div>
                        <button onClick={handleAdd}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg ${adding ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-primary shadow-primary/30'} text-white`}>
                            {adding ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                    </div>
                </motion.div>
            </Link>
        );
    }

    return (
        <Link href={`/store/${product.id}`}>
            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`group rounded-[1.5rem] overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] flex flex-col h-full ${darkMode ? 'bg-white/5 border-white/8 hover:border-white/15' : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}>
                {/* Image */}
                <div className="relative aspect-square overflow-hidden m-1.5 rounded-[1.2rem]">
                    <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Badges */}
                    <div className="absolute top-2 start-2 flex flex-col gap-1">
                        {discount > 0 && <span className="text-[8px] font-black bg-primary text-white px-2 py-0.5 rounded-full shadow-lg">-{discount}%</span>}
                        {product.isNew && <span className="text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-lg">{ar ? 'جديد' : 'New'}</span>}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-2 end-2 flex items-center gap-0.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[9px] font-black text-white">{product.rating}</span>
                    </div>

                    {/* Fav button */}
                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleFav(product.id); }}
                        className="absolute bottom-2 end-2 w-8 h-8 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90 shadow-lg">
                        <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-current' : 'text-gray-500'}`} />
                    </button>

                    {/* Quick add */}
                    <div className="absolute bottom-2 start-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={handleAdd}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-black text-white shadow-xl transition-all active:scale-90 ${adding ? 'bg-emerald-500' : 'bg-primary'}`}>
                            {adding ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            {adding ? (ar ? 'تمت الإضافة' : 'Added!') : (ar ? 'أضف للسلة' : 'Add')}
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="px-3 pb-3 pt-1 flex flex-col flex-1 text-start">
                    <p className={`text-[8px] font-black text-primary uppercase tracking-wider mb-0.5`}>{getText(product.category)}</p>
                    <h3 className={`text-xs font-black ${darkMode ? 'text-white' : 'text-slate-900'} line-clamp-2 leading-tight mb-2 flex-1`}>{getText(product.name)}</h3>

                    {/* Colors preview */}
                    {Array.isArray(product.colors) && product.colors.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                            {product.colors.slice(0, 4).map((c, i) => (
                                <div key={i} className="w-3 h-3 rounded-full border border-white/50 shadow-sm" style={{ background: c?.code || c || '#ccc' }} />
                            ))}
                            {product.colors.length > 4 && <span className={`text-[8px] font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>+{product.colors.length - 4}</span>}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            {product.oldPrice && product.oldPrice > product.price && (
                                <span className={`text-[9px] line-through ${darkMode ? 'text-gray-600' : 'text-gray-400'} block`}>{product.oldPrice} {ar ? 'ر.س' : 'SAR'}</span>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className={`text-base font-black text-primary`}>{product.price}</span>
                                <span className={`text-[8px] font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{ar ? 'ر.س' : 'SAR'}</span>
                            </div>
                        </div>
                        <button onClick={handleAdd}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg ${adding ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-900 dark:bg-white shadow-black/20 dark:shadow-white/10'} ${adding ? 'text-white' : 'text-white dark:text-slate-900'}`}>
                            {adding ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

// ── Main Page ────────────────────────────────────────────────────
export default function StorePage() {
    const {
        darkMode, language, products, categories,
        cart, addToCart, cartCount, setIsCartOpen,
        favorites, toggleFavorite
    } = useApp();

    const ar = language === 'ar';
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [view, setView] = useState('grid'); // grid | list
    const [showSort, setShowSort] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [onlyFav, setOnlyFav] = useState(false);
    const [onlySale, setOnlySale] = useState(false);
    const searchRef = useRef(null);

    const bg = darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50';
    const card = darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100';
    const textC = darkMode ? 'text-white' : 'text-slate-900';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
    const inp = darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600' : 'bg-slate-50 border-gray-200 text-slate-900 placeholder:text-gray-400';

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    const handleAddToCart = (product) => {
        const colorsArr = Array.isArray(product.colors) ? product.colors : [];
        const sizesArr = Array.isArray(product.sizes) ? product.sizes : [];
        addToCart(product, {
            size: sizesArr[0] || null,
            color: colorsArr[0] || null,
            quantity: 1,
        });
        setIsCartOpen(true);
    };

    // ── Filter + Sort ──
    const filtered = useMemo(() => {
        let list = [...products];

        // Category
        if (activeCat !== 'all') {
            const cat = categories.find(c => c.id === activeCat);
            if (cat) list = list.filter(p =>
                getText(p.category)?.toLowerCase() === getText(cat.name)?.toLowerCase() ||
                p.category_en?.toLowerCase() === (cat.name_en || cat.name)?.toLowerCase() ||
                p.category_ar === (cat.name_ar || cat.name)
            );
        }

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                getText(p.name)?.toLowerCase().includes(q) ||
                getText(p.description)?.toLowerCase().includes(q) ||
                getText(p.category)?.toLowerCase().includes(q)
            );
        }

        // Price
        list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Favorites only
        if (onlyFav) list = list.filter(p => favorites.includes(p.id));

        // Sale only
        if (onlySale) list = list.filter(p => p.oldPrice && p.oldPrice > p.price);

        // Sort
        switch (sortBy) {
            case 'price_asc': list.sort((a, b) => a.price - b.price); break;
            case 'price_desc': list.sort((a, b) => b.price - a.price); break;
            case 'rating': list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
            case 'name': list.sort((a, b) => getText(a.name).localeCompare(getText(b.name))); break;
        }

        return list;
    }, [products, activeCat, search, sortBy, priceRange, onlyFav, onlySale, favorites, language]);

    const hasFilters = activeCat !== 'all' || search || sortBy !== 'default' || onlyFav || onlySale;
    const clearFilters = () => { setActiveCat('all'); setSearch(''); setSortBy('default'); setOnlyFav(false); setOnlySale(false); setPriceRange([0, 2000]); };

    const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 500), [products]);

    const featuredProducts = useMemo(() => products.filter(p => p.rating >= 4.8).slice(0, 4), [products]);

    return (
        <div className={`min-h-screen ${bg} pb-32 relative overflow-hidden transition-colors duration-300`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 pt-4 relative z-10">

                {/* ── Top Bar ── */}
                <div className={`${card} border rounded-[1.5rem] p-2 mb-4 flex items-center gap-2`}>
                    <button onClick={() => router.push('/')} className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} rounded-xl transition-all active:scale-95`}>
                        {ar ? <ChevronRight className={`w-5 h-5 ${textC}`} /> : <ChevronLeft className={`w-5 h-5 ${textC}`} />}
                    </button>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className={`absolute ${ar ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder={ar ? 'ابحث في المتجر...' : 'Search store...'}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className={`w-full border rounded-xl py-2.5 text-sm font-bold outline-none transition-all ${inp} ${ar ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:border-primary/40`}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className={`absolute ${ar ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2`}>
                                <X className={`w-3.5 h-3.5 ${muted}`} />
                            </button>
                        )}
                    </div>

                    {/* Actions */}
                    <button onClick={() => setShowFilters(s => !s)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 relative ${showFilters ? 'bg-primary text-white' : darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                        <SlidersHorizontal className="w-4 h-4" />
                        {hasFilters && <span className="absolute -top-1 -end-1 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-[#0a0f1a]" />}
                    </button>
                    <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'} transition-all active:scale-95`}>
                        {view === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsCartOpen(true)}
                        className="relative w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all">
                        <ShoppingCart className="w-4 h-4" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-white text-primary text-[9px] font-black rounded-full flex items-center justify-center border-2 border-primary shadow">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* ── Filters Panel ── */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-4">
                            <div className={`${card} border rounded-[1.5rem] p-5 space-y-4`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-black ${textC} uppercase tracking-wider flex items-center gap-2`}><Filter className="w-3.5 h-3.5 text-primary" />{ar ? 'فلاتر البحث' : 'Filters'}</span>
                                    {hasFilters && <button onClick={clearFilters} className="text-[10px] font-black text-rose-500 hover:underline">{ar ? 'مسح الكل' : 'Clear All'}</button>}
                                </div>

                                {/* Quick toggles */}
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { k: 'fav', label: ar ? '❤️ المفضلة فقط' : '❤️ Favorites Only', active: onlyFav, toggle: () => setOnlyFav(s => !s) },
                                        { k: 'sale', label: ar ? '🏷️ خصومات فقط' : '🏷️ On Sale Only', active: onlySale, toggle: () => setOnlySale(s => !s) },
                                    ].map(({ k, label, active, toggle }) => (
                                        <button key={k} onClick={toggle}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all ${active ? 'bg-primary text-white border-primary' : darkMode ? 'border-white/10 text-gray-400 hover:border-white/20' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                            {active && <Check className="w-3 h-3" />}
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Sort */}
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-wider ${muted} mb-2`}>{ar ? 'ترتيب حسب' : 'Sort By'}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {SORT_OPTIONS.map(({ k, ar: arL, en: enL }) => (
                                            <button key={k} onClick={() => setSortBy(k)}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all ${sortBy === k ? 'bg-primary text-white border-primary' : darkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                                                {sortBy === k && <Check className="w-3 h-3" />}
                                                {ar ? arL : enL}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className={`text-[10px] font-black uppercase tracking-wider ${muted}`}>{ar ? 'نطاق السعر' : 'Price Range'}</p>
                                        <span className="text-[10px] font-black text-primary">{priceRange[0]} — {priceRange[1]} {ar ? 'ر.س' : 'SAR'}</span>
                                    </div>
                                    <input type="range" min={0} max={maxPrice} value={priceRange[1]}
                                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                                        className="w-full accent-primary h-1.5 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Categories ── */}
                <div className="mb-5">
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <button onClick={() => setActiveCat('all')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shrink-0 ${activeCat === 'all' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : `${card} border ${muted} hover:border-primary/30`}`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            {ar ? 'الكل' : 'All'}
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${activeCat === 'all' ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>{products.length}</span>
                        </button>
                        {categories.map(cat => {
                            const count = products.filter(p =>
                                getText(p.category)?.toLowerCase() === getText(cat.name)?.toLowerCase() ||
                                p.category_en?.toLowerCase() === (cat.name_en || '').toLowerCase()
                            ).length;
                            return (
                                <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shrink-0 ${activeCat === cat.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : `${card} border ${muted} hover:border-primary/30`}`}>
                                    <div className="w-5 h-5 rounded-md overflow-hidden shrink-0">
                                        <img src={cat.img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    {getText(cat.name)}
                                    {count > 0 && <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${activeCat === cat.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>{count}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Featured Banner (only when no filters) ── */}
                {!hasFilters && featuredProducts.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'الأكثر مبيعاً' : 'Best Sellers'}</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                            {featuredProducts.map(p => (
                                <Link key={p.id} href={`/store/${p.id}`}
                                    className={`flex-shrink-0 w-44 ${card} border rounded-2xl overflow-hidden hover:border-primary/30 transition-all group active:scale-[0.98]`}>
                                    <div className="aspect-video relative overflow-hidden">
                                        <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-2 start-2 flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black">
                                            <Star className="w-2.5 h-2.5 fill-current" />{p.rating}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className={`text-[10px] font-black ${textC} truncate`}>{getText(p.name)}</p>
                                        <p className="text-xs font-black text-primary mt-0.5">{p.price} {ar ? 'ر.س' : 'SAR'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Results Header ── */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${textC}`}>{filtered.length}</span>
                        <span className={`text-xs font-bold ${muted}`}>{ar ? 'منتج' : 'product(s)'}</span>
                        {search && <span className={`text-xs font-bold ${muted}`}>{ar ? `لـ "${search}"` : `for "${search}"`}</span>}
                    </div>
                    {hasFilters && (
                        <button onClick={clearFilters} className="flex items-center gap-1 text-[10px] font-black text-rose-500 hover:underline">
                            <X className="w-3 h-3" />{ar ? 'مسح الفلاتر' : 'Clear Filters'}
                        </button>
                    )}
                </div>

                {/* ── Products Grid / List ── */}
                {filtered.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {view === 'grid' ? (
                            <motion.div key="grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {filtered.map(p => (
                                    <ProductCard key={p.id} product={p} ar={ar} darkMode={darkMode}
                                        onAddToCart={handleAddToCart} isFavorite={favorites.includes(p.id)}
                                        onToggleFav={toggleFavorite} view="grid" />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="list" className="space-y-2">
                                {filtered.map(p => (
                                    <ProductCard key={p.id} product={p} ar={ar} darkMode={darkMode}
                                        onAddToCart={handleAddToCart} isFavorite={favorites.includes(p.id)}
                                        onToggleFav={toggleFavorite} view="list" />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
                        <div className={`w-20 h-20 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mb-4`}>
                            <ShoppingBag className={`w-10 h-10 ${muted} opacity-40`} />
                        </div>
                        <h3 className={`text-lg font-black ${textC} mb-2`}>{ar ? 'لا توجد نتائج' : 'No Results'}</h3>
                        <p className={`text-sm font-bold ${muted} mb-5`}>{ar ? 'جرّب تغيير الفلاتر أو البحث بكلمة أخرى' : 'Try changing filters or search term'}</p>
                        <button onClick={clearFilters} className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all">
                            {ar ? 'عرض كل المنتجات' : 'Show All Products'}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
