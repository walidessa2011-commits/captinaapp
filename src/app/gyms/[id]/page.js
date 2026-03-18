"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MapPin, 
    Star, 
    Users2, 
    Building, 
    ChevronLeft, 
    ChevronRight, 
    Phone, 
    Instagram, 
    Twitter, 
    ArrowRight, 
    ArrowLeft,
    Dumbbell,
    Trophy,
    Target,
    Zap,
    Navigation,
    Share2,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function GymDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { gyms, language, darkMode } = useApp();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const gym = gyms.find(g => g.id === id);

    if (!gym) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-[#0a0f1a] text-white" : "bg-white text-slate-900"}`}>
                <div className="text-center">
                    <h2 className="text-2xl font-black mb-4">{language === 'ar' ? 'الجيم غير موجود' : 'Gym Not Found'}</h2>
                    <button onClick={() => router.back()} className="text-primary font-bold flex items-center gap-2 mx-auto uppercase tracking-widest text-xs">
                        {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                        {language === 'ar' ? 'العودة للخلف' : 'Go Back'}
                    </button>
                </div>
            </div>
        );
    }

    const images = gym.images || [gym.image];
    const sports = gym.sports || [];

    const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-32 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Immersive Gallery Hero */}
            <div className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeImageIndex}
                        src={images[activeImageIndex]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full object-cover"
                        alt={gym.name}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0a0f1a] via-black/20 to-transparent"></div>

                {/* Navigation & Actions */}
                <div className="absolute top-8 inset-x-6 flex items-center justify-between z-30">
                    <button 
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl"
                    >
                        {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Hero Info Overlay */}
                <div className="absolute bottom-12 inset-x-8 z-20">
                    <div className="max-w-7xl mx-auto flex items-end justify-between">
                        <div className="flex flex-col gap-2">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] w-fit shadow-lg"
                            >
                                {language === 'ar' ? 'فرع كابتينا المعتمد' : 'Captina Certified Branch'}
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl"
                            >
                                {gym.name}
                            </motion.h1>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-4 text-white/90"
                            >
                                <div className="flex items-center gap-1.5 font-bold">
                                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                                    <span className="text-lg">{gym.rating}</span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                                <div className="flex items-center gap-2 font-bold">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span className="text-sm tracking-wide">{gym.location}</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Gallery Dots */}
                        <div className="hidden md:flex items-center gap-3 bg-black/20 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
                            {images.length > 1 && images.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`h-2 transition-all duration-500 rounded-full ${activeImageIndex === idx ? "w-12 bg-primary" : "w-4 bg-white/30 hover:bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Arrow Controls (Overlay) */}
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className={`absolute top-1/2 ${language === 'en' ? 'left-6' : 'right-6'} -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-all group/arrow z-30`}
                        >
                            <ChevronLeft className={`w-8 h-8 group-hover/arrow:scale-110 transition-transform ${language === 'en' ? '' : 'rotate-180'}`} />
                        </button>
                        <button 
                            onClick={nextImage}
                            className={`absolute top-1/2 ${language === 'en' ? 'right-6' : 'left-6'} -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-all group/arrow z-30`}
                        >
                            <ChevronRight className={`w-8 h-8 group-hover/arrow:scale-110 transition-transform ${language === 'en' ? '' : 'rotate-180'}`} />
                        </button>
                    </>
                )}
            </div>



            <main className="container mx-auto px-6 mt-12 relative z-10 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 flex flex-col gap-12">
                        {/* Features / Stats Grid */}
                        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: language === 'ar' ? 'عدد الصالات' : 'Halls Count', val: gym.halls || 1, icon: Building, color: 'from-blue-500/10 to-blue-500/20 text-blue-500' },
                                { label: language === 'ar' ? 'مدربي النخبة' : 'Elite Coaches', val: gym.trainers || 0, icon: Users2, color: 'from-amber-500/10 to-amber-500/20 text-amber-500' },
                                { label: language === 'ar' ? 'التقييم العام' : 'Global Rating', val: gym.rating, icon: Trophy, color: 'from-emerald-500/10 to-emerald-500/20 text-emerald-500' },
                                { label: language === 'ar' ? 'تجربة مميزة' : 'Premium Exp', val: 'VIP', icon: Zap, color: 'from-rose-500/10 to-rose-500/20 text-rose-500' },
                            ].map((stat, i) => (
                                <Box key={i} className={`p-6 rounded-[2rem] bg-gradient-to-br ${stat.color} border border-white/10 flex flex-col items-center gap-2 text-center`}>
                                    <stat.icon className="w-6 h-6 mb-1" />
                                    <span className="text-2xl font-black">{stat.val}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] opacity-60">{stat.label}</span>
                                </Box>
                            ))}
                        </section>

                        {/* Sports Section */}
                        <section>
                            <SectionHeader title={language === 'ar' ? 'الرياضات المتاحة' : 'Available Sports'} icon={Dumbbell} />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {sports.map((sport, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors group">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <Target className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-tight">{sport}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Facilities Checklist */}
                        <section>
                            <SectionHeader title={language === 'ar' ? 'المرافق والخدمات' : 'Facilities & Services'} icon={CheckCircle2} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {(language === 'ar' ? ['أحدث الأجهزة الرياضية', 'صالات مكيفة بالكامل', 'مواقف سيارات مجانية', 'خزائن ملابس خاصة', 'كافيه داخلي', 'متابعة أبطال كابتينا'] : ['Modern Gym Equipment', 'Full AC Halls', 'Free Parking', 'Private Lockers', 'Indoor Cafe', 'Captina Pro Coaching']).map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-white/5 border border-primary/5">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <span className="text-xs font-black opacity-80 uppercase tracking-widest">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Sidebar/Contact */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        {/* Map & Location */}
                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#1a2235]/60 border border-gray-100 dark:border-white/10 shadow-premium">
                            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{language === 'ar' ? 'موقعنا' : 'Location'}</h3>
                            <div className="relative w-full h-48 rounded-[2rem] overflow-hidden mb-6 group">
                                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="map" />
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <a href={gym.location_link} target="_blank" className="px-6 py-3 bg-white text-slate-900 font-black rounded-full shadow-2xl flex items-center gap-2 hover:bg-primary hover:text-white transition-all transform hover:scale-105">
                                        <Navigation className="w-5 h-5" />
                                        {language === 'ar' ? 'عرض على الخريطة' : 'View Map'}
                                    </a>
                                </div>
                            </div>
                            <p className="text-sm font-bold opacity-60 leading-relaxed mb-6">
                                {gym.location}
                            </p>
                            
                            <div className="h-px bg-gray-100 dark:bg-white/10 mb-6"></div>

                            {/* Contact Links */}
                            <div className="flex flex-col gap-4">
                                <ContactItem icon={Phone} label={language === 'ar' ? 'اتصل بنا' : 'Call Us'} val={gym.phone} />
                                {gym.social?.instagram && (
                                    <ContactItem icon={Instagram} label="Instagram" val={`@${gym.social.instagram}`} link={`https://instagram.com/${gym.social.instagram}`} />
                                )}
                                {gym.social?.twitter && (
                                    <ContactItem icon={Twitter} label="Twitter (X)" val={gym.social.twitter} />
                                )}
                            </div>
                        </div>

                        {/* CTA Sidebar Card */}
                        <div className="p-1 w-full rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/80 to-blue-600 shadow-2xl shadow-primary/30 group">
                            <div className="bg-slate-950/90 backdrop-blur-3xl p-8 rounded-[2.4rem] flex flex-col items-center text-center gap-6">
                                <div className="p-4 rounded-3xl bg-primary/20">
                                    <Zap className="w-10 h-10 text-primary animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                        {language === 'ar' ? 'هل أنت مستعد؟' : 'Ready to start?'}
                                    </h4>
                                    <p className="text-xs font-bold text-white/60 leading-relaxed">
                                        {language === 'ar' ? 'احجز حصتك التجريبية الآن في هذا الفرع واستفد من العروض الحصرية.' : 'Book your trial session now at this branch and enjoy exclusive deals.'}
                                    </p>
                                </div>
                                <button className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]">
                                    {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

// Helper Components
function Box({ children, className }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function SectionHeader({ title, icon: Icon }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-1 flex bg-primary rounded-full"></div>
            <Icon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
        </div>
    );
}

function ContactItem({ icon: Icon, label, val, link }) {
    const content = (
        <div className="flex items-center gap-4 group/item">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover/item:bg-primary/10 transition-colors">
                <Icon className="w-5 h-5 text-gray-400 group-hover/item:text-primary transition-colors" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</span>
                <span className="text-sm font-black">{val}</span>
            </div>
        </div>
    );

    return link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
            {content}
        </a>
    ) : content;
}
