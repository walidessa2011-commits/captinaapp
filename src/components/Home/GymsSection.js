"use client";
import { motion } from "framer-motion";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Star, MapPin, Dumbbell } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function GymsSection() {
    const { t, language, darkMode, gyms } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;
    const partnerGyms = gyms.filter(g => g.type === 'Partner');
    if (!partnerGyms.length) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="text-start">
                    <h2 className={`text-base md:text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
                        {ar ? 'نوادينا المعتمدة' : 'Partner Gyms'}
                    </h2>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        {ar ? 'أفضل المراكز الرياضية' : 'Top certified fitness centers'}
                    </p>
                </div>
                <Link href="/gyms" className="flex items-center gap-1 text-primary text-[10px] font-black hover:underline">
                    {t('viewAll')}
                    <ChevronLeft className={`w-3.5 h-3.5 ${ar ? '' : 'rotate-180'}`} />
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                {partnerGyms.map((gym, i) => (
                    <motion.div key={gym.id || i} whileHover={{ y: -5 }}
                        onClick={() => router.push(`/gyms/${gym.id}`)}
                        className={`flex-shrink-0 w-64 md:w-72 snap-start rounded-[1.8rem] border overflow-hidden cursor-pointer group transition-all ${darkMode ? 'bg-white/5 border-white/8 hover:border-white/15' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden">
                            <img src={gym.image} alt={getText(gym.name)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            {/* Rating */}
                            {gym.rating && (
                                <div className="absolute top-3 end-3 flex items-center gap-1 bg-white/90 dark:bg-black/50 backdrop-blur-md px-2 py-1 rounded-full">
                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                    <span className="text-[9px] font-black text-slate-900 dark:text-white">{gym.rating}</span>
                                </div>
                            )}
                            <span className="absolute top-3 start-3 text-[8px] font-black bg-primary text-white px-2 py-1 rounded-full uppercase tracking-wider">{gym.type}</span>
                        </div>

                        {/* Info */}
                        <div className="p-4 text-start">
                            <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-1`}>{getText(gym.name)}</p>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-primary" />
                                <p className={`text-[9px] font-bold ${darkMode ? 'text-white/40' : 'text-gray-400'} truncate`}>{getText(gym.location)}</p>
                            </div>
                            <div className={`mt-3 py-2 rounded-xl border text-center text-[9px] font-black text-primary uppercase tracking-wider ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                                {ar ? 'تفاصيل النادي' : 'View Gym'}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
