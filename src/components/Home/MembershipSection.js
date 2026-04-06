"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { Crown, Tag, Check, Clock, Dumbbell, ChevronLeft, Sparkles, Gift, ArrowRight } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function MembershipSection({ onDevModal }) {
    const { t, language, darkMode, packages, offers } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const [tab, setTab] = useState('packages');
    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    return (
        <section>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-px bg-primary/40" />
                    <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">{ar ? 'اشتراكات وعروض' : 'Plans & Offers'}</span>
                    <span className="w-8 h-px bg-primary/40" />
                </div>
                <h2 className={`text-xl md:text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight mb-4`}>
                    {ar ? 'انضم إلى ' : 'Join Our '}
                    <span className="text-primary">{ar ? 'أبطالنا' : 'Champions'}</span>
                </h2>

                {/* Tab Switch */}
                <div className={`flex gap-1 p-1 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                    {[
                        { k: 'packages', icon: Crown, label: ar ? 'الباقات' : 'Packages' },
                        { k: 'offers', icon: Tag, label: ar ? 'العروض' : 'Offers' },
                    ].map(({ k, icon: Icon, label }) => (
                        <button key={k} onClick={() => setTab(k)}
                            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${tab === k ? 'bg-primary text-white shadow-lg shadow-primary/30' : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-primary'}`}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* Packages */}
                {tab === 'packages' && (
                    <motion.div key="pkgs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {[...packages]
                            .filter(p => !(p.id === 'trial' || p.isTrial))
                            .sort((a, b) => (a.months || 99) - (b.months || 99))
                            .concat(packages.filter(p => p.id === 'trial' || p.isTrial))
                            .map((pkg, i) => {
                            const featured = pkg.months === 3 || pkg.featured;
                            const feats = Array.isArray(pkg.features) ? pkg.features : typeof pkg.features === 'string' ? pkg.features.split(',').map(s => s.trim()) : [];
                            return (
                                <div key={pkg.id || i} className="w-full">
                                    <div className={`relative rounded-[2rem] border p-6 h-full flex flex-col transition-all ${featured ? 'bg-gradient-to-b from-primary to-rose-700 border-primary/50 text-white shadow-2xl shadow-primary/25' : `${darkMode ? 'bg-white/5 border-white/8' : 'bg-white border-gray-100 shadow-md'}`}`}>
                                        {/* Discount badge */}
                                        {pkg.discount && (
                                            <div className="absolute -top-3 -start-2 -rotate-6">
                                                <span className="bg-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-lg shadow-lg">
                                                    {ar ? `خصم ${pkg.discount}%` : `${pkg.discount}% OFF`}
                                                </span>
                                            </div>
                                        )}
                                        {featured && (
                                            <div className="absolute -top-3 inset-x-0 flex justify-center">
                                                <span className="bg-amber-400 text-slate-900 text-[8px] font-black px-4 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5" />{ar ? 'الأكثر طلباً' : 'Most Popular'}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-start justify-between mb-4 mt-1">
                                            <div className="text-start">
                                                <h3 className="text-base font-black mb-0.5 leading-tight">{getText(pkg.name)}</h3>
                                                <div className={`flex items-center gap-1 text-[9px] font-bold ${featured ? 'text-white/70' : darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                                                    <Clock className="w-3 h-3" />
                                                    {getText(pkg.duration) || (ar ? `${pkg.months} شهر` : `${pkg.months} Mo`)}
                                                </div>
                                            </div>
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${featured ? 'bg-white/20' : 'bg-primary/10'}`}>
                                                <Dumbbell className={`w-5 h-5 ${featured ? 'text-white' : 'text-primary'}`} />
                                            </div>
                                        </div>

                                        <p className={`text-[10px] font-medium mb-4 leading-relaxed text-start ${featured ? 'text-white/70' : darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                                            {getText(pkg.description)}
                                        </p>

                                        <ul className="space-y-2.5 mb-5 flex-1 text-start">
                                            {feats.map((f, fi) => (
                                                <li key={fi} className="flex items-center gap-2 text-[10px] font-bold">
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${featured ? 'bg-white/20' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                                                        <Check className={`w-2.5 h-2.5 ${featured ? 'text-white' : 'text-emerald-500'}`} />
                                                    </div>
                                                    <span className={featured ? 'text-white/85' : darkMode ? 'text-gray-300' : 'text-slate-700'}>{typeof f === 'string' ? f : getText(f)}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className={`flex items-center justify-between pt-4 border-t ${featured ? 'border-white/15' : darkMode ? 'border-white/8' : 'border-gray-100'}`}>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black">{pkg.price}</span>
                                                <span className={`text-[9px] font-bold ${featured ? 'text-white/60' : 'text-primary'}`}>{pkg.currency || (ar ? 'ر.س' : 'SAR')}</span>
                                            </div>
                                            <button onClick={() => router.push(`/packages/${pkg.id}`)}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md ${featured ? 'bg-white text-primary hover:shadow-lg' : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/30'}`}>
                                                {ar ? 'التفاصيل' : 'Details'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Offers */}
                {tab === 'offers' && (
                    <motion.div key="offs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {offers?.map((offer, i) => (
                            <div key={offer.id || i} className={`relative group rounded-[1.8rem] border overflow-hidden flex min-h-[140px] cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${darkMode ? 'bg-white/5 border-white/8' : 'bg-white border-gray-100 shadow-sm'}`}
                                onClick={() => onDevModal(getText(offer.title))}>
                                <div className="w-1/3 relative overflow-hidden shrink-0">
                                    <img src={offer.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
                                    <div className="absolute top-3 start-3">
                                        <span className="text-[7px] font-black bg-primary text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                            <Sparkles className="w-2 h-2" />{getText(offer.badge) || (ar ? 'عرض' : 'Offer')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between text-start">
                                    <div>
                                        <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'} line-clamp-1 mb-1`}>{getText(offer.title)}</h3>
                                        <p className={`text-[9px] font-bold ${darkMode ? 'text-white/40' : 'text-gray-400'} line-clamp-2 leading-relaxed`}>{getText(offer.subtitle) || getText(offer.desc)}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-current/5 mt-2">
                                        <span className={`text-[8px] font-bold ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>{offer.expiryDate ? `${ar ? 'ينتهي' : 'Ends'} ${offer.expiryDate}` : ''}</span>
                                        <span className="flex items-center gap-1 text-primary text-[9px] font-black">{ar ? 'عرض التفاصيل' : 'View'}<ArrowRight className={`w-3 h-3 ${ar ? 'rotate-180' : ''}`} /></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-6 text-center">
                <Link href="/packages" className={`inline-flex items-center gap-2 text-[10px] font-black text-primary border border-primary/30 px-6 py-3 rounded-2xl hover:bg-primary hover:text-white transition-all active:scale-95`}>
                    {ar ? 'عرض جميع الباقات' : 'View All Plans'}
                    <ChevronLeft className={`w-3.5 h-3.5 ${ar ? '' : 'rotate-180'}`} />
                </Link>
            </div>
        </section>
    );
}
