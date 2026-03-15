"use client";
import { motion } from "framer-motion";
import { MapPin, Star, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function Gyms() {
    const { t, language } = useApp();

    const gyms = [
        { 
            id: 1, 
            name: language === 'ar' ? "فرع المونسية" : "Al-Monsiya Branch", 
            location: language === 'ar' ? "الرياض - طريق الأمير محمد بن سلمان" : "Riyadh - Prince Mohammed Bin Salman Road", 
            rating: 4.9, 
            trainers: 12,
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" 
        },
        { 
            id: 2, 
            name: language === 'ar' ? "فرع الياسمين" : "Al-Yasmin Branch", 
            location: language === 'ar' ? "الرياض - طريق الملك عبدالعزيز" : "Riyadh - King Abdulaziz Road", 
            rating: 4.8, 
            trainers: 8,
            image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=500" 
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#001f3f] pb-32 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-white/5 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                        {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </Link>
                    <h1 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                        {language === 'ar' ? 'فروعنا' : 'Our Branches'}
                    </h1>
                    <div className="w-9"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="text-start mb-8">
                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                        {language === 'ar' ? 'اكتشف فروعنا' : 'Discover Our Branches'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
                        {language === 'ar' ? 'أفضل صالات رياضية مجهزة بأحدث الأجهزة' : 'Best gyms equipped with the latest equipment'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {gyms.map((gym, idx) => (
                        <motion.div 
                            key={gym.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 group hover:shadow-xl transition-all duration-500"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img src={gym.image} alt={gym.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 fill-secondary text-secondary" />
                                        <span className="text-[10px] font-black text-gray-900 dark:text-white">{gym.rating}</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-black text-white mb-1">{gym.name}</h3>
                                    <div className="flex items-center gap-1 text-white/80">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-xs font-bold">{gym.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-sm font-black text-gray-900 dark:text-white">{gym.trainers}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{language === 'ar' ? 'مدرب' : 'Trainers'}</p>
                                    </div>
                                </div>
                                <button className="bg-primary text-white font-black py-3 px-6 rounded-2xl transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] text-xs flex items-center gap-2">
                                    <Navigation className="w-4 h-4" />
                                    {language === 'ar' ? 'عرض الخريطة' : 'View Map'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
