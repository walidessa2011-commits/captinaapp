"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Star, Users2, Building2, ChevronLeft, ChevronRight,
    Phone, Instagram, Twitter, Dumbbell, Trophy, Target, Zap,
    Navigation, Share2, CheckCircle2, Shield, Clock, ArrowRight, Info
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import GymsMap from "../GymsMap";
import Link from "next/link";

const FACILITIES_AR = ['أحدث الأجهزة الرياضية', 'صالات مكيفة بالكامل', 'مواقف سيارات مجانية', 'خزائن ملابس خاصة', 'كافيه داخلي', 'متابعة مدربي كابتنا'];
const FACILITIES_EN = ['Modern Gym Equipment', 'Fully Air-Conditioned', 'Free Parking', 'Private Lockers', 'Indoor Café', 'Captina Coach Support'];

export default function GymDetails({ params }) {
    const id = params.id;
    const router = useRouter();
    const { gyms, trainers, language, darkMode, getText } = useApp();
    const [imgIdx, setImgIdx] = useState(0);
    const [activeTab, setActiveTab] = useState('about');

    const ar = language === 'ar';
    const gym = gyms.find(g => g.id === id);

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";

    if (!gym) return (
        <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-5 p-6 text-center`}>
            <Building2 className={`w-16 h-16 ${muted} opacity-30`} />
            <h2 className={`text-xl font-black ${textC}`}>{ar ? 'النادي غير موجود' : 'Gym Not Found'}</h2>
            <button onClick={() => router.back()} className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm">{ar ? 'رجوع' : 'Go Back'}</button>
        </div>
    );

    const images = gym.images?.length ? gym.images : [gym.image].filter(Boolean);
    const sports = gym.linked_sports || gym.sports || [];
    const linkedTrainers = gym.linked_trainers || [];
    const trainersCount = gym.trainers_count || gym.trainers || linkedTrainers.length || 0;
    const name = getText(gym.name);
    const location = getText(gym.location || gym.address);

    const TABS = [
        { id: 'about', icon: Info, label: ar ? 'نبذة' : 'About' },
        { id: 'sports', icon: Dumbbell, label: ar ? 'الرياضات' : 'Sports' },
        { id: 'trainers', icon: Users2, label: ar ? 'المدربون' : 'Trainers' },
        { id: 'facilities', icon: Shield, label: ar ? 'المرافق' : 'Facilities' },
    ];

    const stats = [
        { label: ar ? 'الصالات' : 'Halls', val: gym.halls || '—', icon: Building2, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
        { label: ar ? 'المدربون' : 'Coaches', val: trainersCount || '—', icon: Users2, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
        { label: ar ? 'التقييم' : 'Rating', val: gym.rating || '5.0', icon: Star, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
        { label: ar ? 'الخدمة' : 'Service', val: 'VIP', icon: Zap, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
    ];

    const handleShare = () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        navigator.share?.({ title: name, url }) || navigator.clipboard?.writeText(url);
    };

    return (
        <div className={`min-h-screen ${bg} pb-32 transition-colors duration-300 relative`} dir={ar ? 'rtl' : 'ltr'}>
            <div className="fixed top-0 end-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

            {/* ── Hero Gallery ── */}
            <div className="relative h-[42vh] md:h-[54vh] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img key={imgIdx} src={images[imgIdx] || '/placeholder.jpg'} alt={name}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer" />
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/15" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-24" />

                {/* Controls */}
                <div className="absolute top-5 inset-x-5 flex items-center justify-between z-20">
                    <button onClick={() => router.back()}
                        className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all">
                        {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={handleShare}
                        className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Image nav arrows */}
                {images.length > 1 && (
                    <>
                        <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                            className="absolute top-1/2 start-4 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white active:scale-90 z-10">
                            {ar ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                            className="absolute top-1/2 end-4 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white active:scale-90 z-10">
                            {ar ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </>
                )}

                {/* Bottom info */}
                <div className="absolute bottom-5 start-5 end-5 z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-5 h-0.5 bg-primary" />
                        <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.25em]">{ar ? 'نادي كابتنا المعتمد' : 'Captina Certified Gym'}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight drop-shadow-2xl">{name}</h1>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-[9px] font-black text-white">{gym.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span className="text-[9px] font-black text-white truncate max-w-48">{location}</span>
                        </div>
                    </div>

                    {/* Image dots */}
                    {images.length > 1 && (
                        <div className="flex gap-1.5 mt-3">
                            {images.map((_, i) => (
                                <button key={i} onClick={() => setImgIdx(i)}
                                    className="h-1.5 rounded-full transition-all"
                                    style={{ width: i === imgIdx ? 20 : 6, background: i === imgIdx ? '#E51B24' : 'rgba(255,255,255,0.3)' }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-5xl mx-auto px-4 -mt-3 relative z-10">

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {stats.map(({ label, val, icon: Icon, color }, i) => (
                        <div key={i} className={`${card} border rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center`}>
                            <div className={`w-8 h-8 ${color} rounded-xl flex items-center justify-center`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <p className={`text-sm font-black ${textC} leading-none`}>{val}</p>
                            <p className={`text-[8px] font-bold uppercase tracking-wider ${muted}`}>{label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className={`flex gap-1 p-1.5 rounded-[1.5rem] mb-4 ${darkMode ? 'bg-white/5 border border-white/8' : 'bg-white border border-gray-100 shadow-sm'}`}>
                    {TABS.map(({ id: tid, icon: Icon, label }) => (
                        <button key={tid} onClick={() => setActiveTab(tid)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all ${activeTab === tid ? 'bg-primary text-white shadow-lg shadow-primary/25' : `${muted} hover:text-primary`}`}>
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-4">

                                {/* ABOUT */}
                                {activeTab === 'about' && (
                                    <>
                                        {/* Description */}
                                        {getText(gym.description) && (
                                            <div className={`${card} border rounded-2xl p-5 text-start`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-1 h-5 bg-primary rounded-full" />
                                                    <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'عن النادي' : 'About the Gym'}</h3>
                                                </div>
                                                <p className={`text-sm font-medium leading-relaxed ${muted}`}>{getText(gym.description)}</p>
                                            </div>
                                        )}

                                        {/* Working hours */}
                                        {(gym.workingHours && Object.keys(gym.workingHours).length > 0) && (() => {
                                            const DAYS = ar
                                                ? [{ k: 'sun', label: 'الأحد' }, { k: 'mon', label: 'الاثنين' }, { k: 'tue', label: 'الثلاثاء' }, { k: 'wed', label: 'الأربعاء' }, { k: 'thu', label: 'الخميس' }, { k: 'fri', label: 'الجمعة' }, { k: 'sat', label: 'السبت' }]
                                                : [{ k: 'sun', label: 'Sun' }, { k: 'mon', label: 'Mon' }, { k: 'tue', label: 'Tue' }, { k: 'wed', label: 'Wed' }, { k: 'thu', label: 'Thu' }, { k: 'fri', label: 'Fri' }, { k: 'sat', label: 'Sat' }];
                                            const today = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
                                            return (
                                                <div className={`${card} border rounded-2xl p-5`}>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-1 h-5 bg-blue-500 rounded-full" />
                                                        <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'أوقات العمل' : 'Working Hours'}</h3>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        {DAYS.map(({ k, label }) => {
                                                            const d = gym.workingHours[k];
                                                            if (!d) return null;
                                                            const isToday = k === today;
                                                            return (
                                                                <div key={k} className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs ${isToday ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' : darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                                    <span className={`font-black ${isToday ? 'text-emerald-600 dark:text-emerald-400' : muted}`}>{label}{isToday && <span className="ms-1 text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">{ar ? 'اليوم' : 'Today'}</span>}</span>
                                                                    {d.closed
                                                                        ? <span className={`font-bold text-[10px] ${muted}`}>{ar ? 'مغلق' : 'Closed'}</span>
                                                                        : <span className={`font-black ${isToday ? 'text-emerald-700 dark:text-emerald-300' : textC}`}>{d.open} – {d.close}</span>
                                                                    }
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Book CTA */}
                                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-5 flex items-center gap-4">
                                            <div className="absolute top-0 end-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                                            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                                                <Zap className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1 text-start">
                                                <p className="text-white font-black text-sm">{ar ? 'هل أنت مستعد؟' : 'Ready to start?'}</p>
                                                <p className="text-white/50 text-[10px] font-bold">{ar ? 'احجز حصتك التجريبية الآن مجاناً' : 'Book your free trial session now'}</p>
                                            </div>
                                            <button onClick={() => router.push(`/booking?trial=true&gymId=${gym.id}&gymName=${encodeURIComponent(getText(gym.name))}`)}
                                                className="shrink-0 px-5 py-2.5 bg-primary text-white rounded-xl font-black text-xs shadow-lg shadow-primary/30 active:scale-95 transition-all">
                                                {ar ? 'احجز' : 'Book'}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* SPORTS */}
                                {activeTab === 'sports' && (
                                    <div className={`${card} border rounded-2xl p-5`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-5 bg-primary rounded-full" />
                                            <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'الرياضات المتاحة' : 'Available Sports'}</h3>
                                        </div>
                                        {sports.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {sports.map((sport, i) => (
                                                    <div key={i} className={`flex items-center gap-2.5 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl group hover:bg-primary/8 transition-all`}>
                                                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                                                            <Target className="w-4 h-4 text-primary group-hover:text-white" />
                                                        </div>
                                                        <span className={`text-xs font-black ${textC} truncate`}>{getText(sport)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <Dumbbell className={`w-10 h-10 ${muted} opacity-30 mx-auto mb-2`} />
                                                <p className={`text-xs font-bold ${muted}`}>{ar ? 'لم تُحدَّد الرياضات بعد' : 'Sports not listed yet'}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TRAINERS */}
                                {activeTab === 'trainers' && (
                                    <div className={`${card} border rounded-2xl p-5`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-5 bg-amber-500 rounded-full" />
                                            <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'مدربو الفرع' : 'Branch Coaches'}</h3>
                                        </div>
                                        {linkedTrainers.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {linkedTrainers.map((lt, i) => {
                                                    const full = trainers.find(t => t.id === lt.id);
                                                    const trName = full ? getText(full.name) : getText(lt.name);
                                                    const trImg = full?.image || lt.image || 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400';
                                                    return (
                                                        <button key={i} onClick={() => router.push(`/trainers/${lt.id}`)}
                                                            className={`${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl p-3 flex flex-col items-center gap-2 transition-all group`}>
                                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/20">
                                                                <img src={trImg} alt={trName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                                            </div>
                                                            <p className={`text-[10px] font-black ${textC} text-center group-hover:text-primary transition-colors truncate w-full`}>{trName}</p>
                                                            <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                                {ar ? 'معتمد' : 'Certified'}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <Users2 className={`w-10 h-10 ${muted} opacity-30 mx-auto mb-2`} />
                                                <p className={`text-xs font-bold ${muted}`}>{ar ? 'لم يُحدَّد المدربون بعد' : 'No coaches listed yet'}</p>
                                                <Link href="/trainers" className="text-[10px] font-black text-primary hover:underline mt-2 inline-block">{ar ? 'استعرض كل المدربين' : 'Browse All Trainers'}</Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* FACILITIES */}
                                {activeTab === 'facilities' && (
                                    <div className={`${card} border rounded-2xl p-5`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                            <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'المرافق والخدمات' : 'Facilities & Services'}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {(ar ? FACILITIES_AR : FACILITIES_EN).map((item, i) => (
                                                <div key={i} className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span className={`text-xs font-bold ${textC}`}>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Book Card */}
                        <div className={`${card} border rounded-[1.8rem] p-5 relative overflow-hidden`}>
                            <div className="absolute top-0 end-0 w-24 h-24 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
                            <div className="flex items-center gap-1.5 mb-3">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">{ar ? 'متاح الآن' : 'Open Now'}</span>
                            </div>
                            <h3 className={`text-sm font-black ${textC} mb-1`}>{ar ? 'احجز في هذا النادي' : 'Book at this Gym'}</h3>
                            <p className={`text-[10px] font-bold ${muted} mb-4`}>{ar ? 'حصة تجريبية مجانية' : 'Free trial session available'}</p>
                            <button onClick={() => router.push(`/booking?trial=true&gymId=${gym.id}&gymName=${encodeURIComponent(getText(gym.name))}`)}
                                className="block w-full py-4 bg-primary text-white text-center rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                {ar ? 'احجز مجاناً' : 'Book Free Trial'}
                            </button>
                        </div>

                        {/* Location */}
                        <div className={`${card} border rounded-[1.8rem] overflow-hidden`}>
                            <div className="p-4 border-b" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                <h3 className={`text-xs font-black ${textC} flex items-center gap-2 uppercase tracking-wider`}>
                                    <MapPin className="w-4 h-4 text-primary" />{ar ? 'الموقع' : 'Location'}
                                </h3>
                            </div>

                            {/* Map */}
                            {gym.embed_map ? (
                                <div className="h-52 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: gym.embed_map.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }} />
                            ) : (
                                <GymsMap customGyms={[gym]} className="h-52" />
                            )}

                            <div className="p-4 space-y-3">
                                <p className={`text-xs font-bold ${muted} flex items-start gap-2`}>
                                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />{location}
                                </p>
                                {gym.location_link && (
                                    <a href={gym.location_link} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 active:scale-95 transition-all">
                                        <Navigation className="w-3.5 h-3.5" />
                                        {ar ? 'الذهاب عبر خرائط جوجل' : 'Open in Google Maps'}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Contact */}
                        {(gym.phone || gym.social?.instagram || gym.social?.twitter) && (
                            <div className={`${card} border rounded-[1.8rem] p-5 space-y-3`}>
                                <h3 className={`text-xs font-black ${textC} uppercase tracking-wider mb-2`}>{ar ? 'التواصل' : 'Contact'}</h3>
                                {gym.phone && (
                                    <div className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Phone className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className={`text-[8px] font-bold uppercase tracking-wider ${muted}`}>{ar ? 'هاتف' : 'Phone'}</p>
                                            <p className={`text-xs font-black ${textC}`}>{gym.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {gym.social?.instagram && (
                                    <a href={`https://instagram.com/${gym.social.instagram}`} target="_blank" rel="noopener noreferrer"
                                        className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-all`}>
                                        <div className="w-8 h-8 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Instagram className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <div>
                                            <p className={`text-[8px] font-bold uppercase tracking-wider ${muted}`}>Instagram</p>
                                            <p className={`text-xs font-black ${textC}`}>@{gym.social.instagram}</p>
                                        </div>
                                    </a>
                                )}
                                {gym.social?.twitter && (
                                    <div className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                        <div className="w-8 h-8 bg-sky-50 dark:bg-sky-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Twitter className="w-4 h-4 text-sky-500" />
                                        </div>
                                        <div>
                                            <p className={`text-[8px] font-bold uppercase tracking-wider ${muted}`}>Twitter (X)</p>
                                            <p className={`text-xs font-black ${textC}`}>{gym.social.twitter}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
