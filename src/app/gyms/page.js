"use client";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, ChevronLeft, ChevronRight, Navigation, Building2, Users2, Building, ArrowLeft } from 'lucide-react';
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
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000" 
        },
        { 
            id: 2, 
            name: language === 'ar' ? "فرع الياسمين" : "Al-Yasmin Branch", 
            location: language === 'ar' ? "الرياض - طريق الملك عبدالعزيز" : "Riyadh - King Abdulaziz Road", 
            rating: 4.8, 
            trainers: 8,
            image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000" 
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden pb-40 transition-colors duration-500">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-0 -translate-x-1/2 translate-y-1/2"></div>

            {/* Premium Ultra-Compact Header */}
            <section className="relative pt-4 pb-2 px-4 z-20 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-2"
                >
                    <div className="flex flex-col text-start">
                        <h1 className="text-base md:text-lg font-black text-white tracking-tighter flex items-center gap-2">
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">{t('main') || 'الرئيسية'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">{language === 'ar' ? 'صالاتنا' : 'Our Gyms'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'فروع كابتينة' : 'Captina Gyms'}</span>
                        </h1>
                        <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">
                            {language === 'ar' ? 'أفضل صالات رياضية مجهزة بأحدث الأجهزة' : "Elite gyms with world-class facilities"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{language === 'ar' ? 'تغطية واسعة' : 'Wide Coverage'}</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            <div className="container mx-auto px-6 py-4 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gyms.map((gym, idx) => (
                        <motion.div 
                            key={gym.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative bg-[#1a2235]/40 backdrop-blur-3xl rounded-2xl overflow-hidden border border-white/5 shadow-xl transition-all duration-500 hover:border-primary/20">
                                <div className="relative h-40 overflow-hidden">
                                    <img src={gym.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" alt={gym.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-60"></div>
                                    
                                    <div className="absolute top-2 right-2 bg-white/5 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10 flex items-center gap-1 shadow-lg">
                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                        <span className="text-[9px] font-black text-white">{gym.rating}</span>
                                    </div>
                                    
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="text-base font-black text-white mb-0.5 tracking-tight leading-none truncate">{gym.name}</h3>
                                        <div className="flex items-center gap-1 text-white/60">
                                            <MapPin className="w-2.5 h-2.5 text-primary" />
                                            <span className="text-[8px] font-bold truncate tracking-wide">{gym.location}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-2 flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5 shrink-0">
                                        <Users2 className="w-3 h-3 text-primary" />
                                        <p className="text-[10px] font-black text-white leading-none">{gym.trainers}</p>
                                    </div>
                                    
                                    <button className="flex-1 bg-white text-slate-950 font-black py-2 px-2 rounded-lg transition-all shadow-md hover:bg-primary hover:text-white active:scale-95 text-[8px] flex items-center justify-center gap-1.5 uppercase tracking-widest whitespace-nowrap">
                                        <Navigation className="w-2.5 h-2.5" />
                                        {language === 'ar' ? 'الخريطة' : 'Map'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Facilities section - more compact */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-10 p-6 rounded-[2rem] bg-white/5 border border-white/5 relative overflow-hidden backdrop-blur-sm"
                >
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: language === 'ar' ? 'أحدث الأجهزة' : 'Elite Gear', icon: Building },
                            { label: language === 'ar' ? 'مساحات تدريب' : 'Wide Areas', icon: Star },
                            { label: language === 'ar' ? 'أبطال معتمدون' : 'Certified Team', icon: Users2 },
                            { label: language === 'ar' ? 'عروض حصرية' : 'Exclusive Offers', icon: Star },
                        ].map((item, i) => (
                            <div key={i} className="text-center flex flex-col items-center gap-1.5">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                                    <item.icon className="w-4 h-4 text-primary/60" />
                                </div>
                                <h4 className="text-[8px] font-black text-white/80 uppercase tracking-widest">{item.label}</h4>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

