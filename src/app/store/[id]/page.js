"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, Star, ShoppingBag, Heart, 
    Plus, Minus, Share2, ShieldCheck, Truck, 
    ArrowRight, Sparkles, Zap
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { 
        darkMode, language, products, addToCart, setIsCartOpen,
        favorites, toggleFavorite
    } = useApp();
    
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specs");
    const [mainImage, setMainImage] = useState("");

    useEffect(() => {
        if (products && id) {
            const found = products.find(p => p.id === id);
            if (found) {
                setProduct(found);
                setMainImage(found.image);
                setSelectedSize(found.sizes?.[0] || "");
                setSelectedColor(found.colors?.[0] || null);
            }
        }
    }, [id, products]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, {
            size: selectedSize,
            color: selectedColor,
            quantity: quantity
        });
        setIsCartOpen(true);
    };

    if (!product) return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50'} flex items-center justify-center`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    const similarGear = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} transition-colors duration-500 pb-20`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Immersive Product Hero */}
            <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={mainImage}
                        src={mainImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full object-cover"
                        alt={product.name}
                    />
                </AnimatePresence>
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0a0f1a] via-black/20 to-transparent`}></div>

                {/* Navigation & Actions */}
                <div className="absolute top-8 inset-x-6 flex items-center justify-between z-30">
                    <button 
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl"
                    >
                        {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => toggleFavorite(id)}
                            className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-xl ${favorites.includes(id) ? 'text-rose-500' : 'text-white'}`}
                        >
                            <Heart className={`w-5 h-5 ${favorites.includes(id) ? 'fill-current' : ''}`} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-16 inset-x-6 z-20">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="bg-primary/20 backdrop-blur-md text-primary px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border border-primary/20">{product.category}</span>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight mt-3 drop-shadow-2xl">
                                {product.name}
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Thumbs and Detailed Preview */}
                <div className="space-y-6">
                    {/* Badge Stats on top of details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mb-2" />
                            <p className="text-xs font-black dark:text-white">{product.rating} / 5.0</p>
                            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'تقييم العملاء' : 'Customer Review'}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <Zap className="w-4 h-4 text-primary fill-primary mb-2" />
                            <p className="text-xs font-black dark:text-white">{language === 'ar' ? 'بريميوم' : 'Premium Material'}</p>
                            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'جودة عالية' : 'NanoFiber Tech'}</p>
                        </div>
                    </div>

                    {/* Image Thumbnails */}
                    <div className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-white/10">
                        <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">{language === 'ar' ? 'معرض الصور' : 'Visual Gallery'}</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {[product.image, ... (product.images || [])].filter(img => !!img).slice(0, 4).map((img, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${mainImage === img ? 'border-primary shadow-lg shadow-primary/10 scale-105' : 'border-transparent hover:border-primary/20'}`}
                                >
                                    <img src={img} className={`w-full h-full object-cover transition-opacity ${mainImage === img ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Informational Content */}
                <div className="flex flex-col text-start">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-black text-primary tracking-tighter">{product.price}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">SAR</span>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-6 opacity-80">
                            {product.description}
                        </p>
                    </motion.div>

                    {/* Choices */}
                    <div className="space-y-4 mb-6">
                        {product.sizes && (
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">{language === 'ar' ? 'اختر المقاس' : 'Select Size'}</h4>
                                    <button className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline">{language === 'ar' ? 'جدول المقاسات' : 'Size Guide'}</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <button 
                                            key={size} onClick={() => setSelectedSize(size)}
                                            className={`min-w-[50px] h-[50px] rounded-2xl flex items-center justify-center text-[10px] font-black transition-all border-2 ${selectedSize === size ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:border-primary/40'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.colors && (
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest mb-3">{language === 'ar' ? 'اختر اللون' : 'Select Color'}</h4>
                                <div className="flex flex-wrap gap-4">
                                    {product.colors.map(color => (
                                        <button 
                                            key={color.code} onClick={() => setSelectedColor(color)}
                                            className={`group relative flex flex-col items-center gap-2`}
                                        >
                                            <div className={`w-10 h-10 rounded-2xl border-2 p-1 transition-all ${selectedColor?.code === color.code ? 'border-primary ring-2 ring-primary/10 scale-110' : 'border-transparent'}`}>
                                                <div className="w-full h-full rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: color.code }} />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${selectedColor?.code === color.code ? 'text-primary' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                                {language === 'ar' ? color.name_ar : color.name_en}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest mb-3">{language === 'ar' ? 'الكمية' : 'Quantity'}</h4>
                                <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-2xl p-1 w-fit border border-white/5">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-white/10 transition-all"><Minus className="w-4 h-4 dark:text-white" /></button>
                                    <span className="w-10 text-center text-base font-black dark:text-white">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-white/10 transition-all"><Plus className="w-4 h-4 dark:text-white" /></button>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end items-end">
                                <div className="p-4 bg-primary/5 rounded-[1.5rem] border border-primary/10 text-end w-full">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{language === 'ar' ? 'المجموع' : 'Subtotal'}</p>
                                    <p className="text-2xl font-black text-primary tracking-tighter leading-none">{product.price * quantity} <small className="text-[10px]">SAR</small></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-[3] bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                        >
                            <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            {language === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}
                        </button>
                        <button 
                            onClick={() => toggleFavorite(id)}
                            className={`flex-1 bg-white dark:bg-white/5 py-5 rounded-2xl border flex items-center justify-center transition-all active:scale-95 ${favorites.includes(id) ? 'text-rose-500 bg-rose-50/50 dark:bg-rose-500/10 border-rose-500/30' : 'dark:text-white border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                        >
                            <Heart className={`w-5 h-5 ${favorites.includes(id) ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="text-start">
                                <p className="text-[10px] font-black dark:text-white uppercase tracking-widest">{language === 'ar' ? 'جودة مضمونة' : 'Authentic'}</p>
                                <p className="text-[8px] font-bold text-gray-500">{language === 'ar' ? 'فحص جودة' : 'Quality Check'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Truck className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="text-start">
                                <p className="text-[10px] font-black dark:text-white uppercase tracking-widest">{language === 'ar' ? 'شحن سريع' : 'Fast Shipping'}</p>
                                <p className="text-[8px] font-bold text-gray-500">{language === 'ar' ? 'خلال يومين' : 'Within 2 days'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs for Details/Reviews */}
            <div className="max-w-5xl mx-auto px-6 mt-16">
                <div className="flex border-b border-white/5 gap-8 mb-8">
                    {["specs", "features", "reviews"].map(tab => (
                        <button 
                            key={tab} onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {language === 'ar' 
                                ? (tab === 'specs' ? 'المواصفات' : tab === 'features' ? 'المميزات' : 'التقييمات') 
                                : (tab === 'specs' ? 'Specs' : tab === 'features' ? 'Features' : 'Reviews')}
                            {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                        </button>
                    ))}
                </div>
                
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/5 text-start min-h-[200px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {activeTab === 'specs' && (
                                <>
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-white/5 pb-3">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'الخامة' : 'Fabric'}</span>
                                            <span className="text-[10px] font-black dark:text-white">Nano-Tech Polyester</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-3">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'المنشأ' : 'Origin'}</span>
                                            <span className="text-[10px] font-black dark:text-white">Italy</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-white/5 pb-3">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'الوزن' : 'Weight'}</span>
                                            <span className="text-[10px] font-black dark:text-white">120g ULTRA LIGHT</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-3">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'الموسم' : 'Season'}</span>
                                            <span className="text-[10px] font-black dark:text-white">All Season 2026</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeTab === 'features' && (
                                <div className="col-span-2 space-y-3">
                                    <li className="text-xs font-bold dark:text-white flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> 
                                        {language === 'ar' ? 'تقنية التنفس الذكي لثبات الأداء' : 'Smart breathability tech'}
                                    </li>
                                    <li className="text-xs font-bold dark:text-white flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> 
                                        {language === 'ar' ? 'مقاومة تامة للتمدد والتقلص' : 'Stretch/Shrink resistant'}
                                    </li>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Related Products */}
            {similarGear.length > 0 && (
                <div className="max-w-5xl mx-auto px-6 mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-start">
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">{language === 'ar' ? 'اكتشف المزيد' : 'Complete Look'}</p>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{language === 'ar' ? 'معدات أخرى' : 'Other Gear'}</h2>
                        </div>
                        <Link href="/store" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
                            {language === 'ar' ? 'عرض الكل' : 'View All'}
                            <ArrowRight className={`w-3 h-3 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {similarGear.map((p) => (
                            <Link key={p.id} href={`/store/${p.id}`} className="group">
                                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[1.5rem] overflow-hidden border border-white/5 p-1.5 shadow-premium transition-all hover:-translate-y-2">
                                    <div className="aspect-square rounded-[1.2rem] overflow-hidden relative mb-3">
                                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-30" />
                                        <div className="absolute bottom-3 start-3">
                                            <span className="text-[12px] font-black text-white tracking-tighter">{p.price} SAR</span>
                                        </div>
                                    </div>
                                    <div className="px-3 pb-3 text-start">
                                        <p className="text-[7px] font-black text-primary uppercase tracking-widest mb-0.5">{p.category}</p>
                                        <h3 className="text-xs font-black dark:text-white truncate group-hover:text-primary transition-colors">{p.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
