"use client";
import { motion } from "framer-motion";
import Link from 'next/link';
import { ChevronLeft, PlaySquare, GraduationCap, Users, UserCheck, Film, Search } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';

export default function LibraryPage() {
    const { t, language, darkMode } = useApp();
    const router = useRouter();

    const bgClass = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const textClass = darkMode ? "text-white" : "text-gray-900";
    const cardBg = darkMode ? "bg-white/5 border-white/5" : "bg-white border-gray-100";
    const textMuted = darkMode ? "text-gray-400" : "text-gray-500";

    const categories = [
        {
            id: 'educational',
            title: language === 'ar' ? 'فيديوهات تعليمية لكل رياضة' : 'Educational Videos',
            desc: language === 'ar' ? 'دروس وشروحات احترافية لمختلف الرياضات' : 'Professional lessons for various sports',
            icon: <GraduationCap className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600",
            color: "from-blue-500 to-indigo-600"
        },
        {
            id: 'trainees',
            title: language === 'ar' ? 'فيديوهات المتدربين' : 'Trainee Videos',
            desc: language === 'ar' ? 'انجازات وبطولات متدربي كابتنا' : 'Achievements of Captina trainees',
            icon: <Users className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1599058917233-57c0e88cfb4c?q=80&w=600",
            color: "from-emerald-500 to-teal-600"
        },
        {
            id: 'trainers',
            title: language === 'ar' ? 'فيديوهات المدربين' : 'Trainer Videos',
            desc: language === 'ar' ? 'نصائح وتوجيهات من نخبة المدربين' : 'Tips from our elite trainers',
            icon: <UserCheck className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600",
            color: "from-orange-500 to-rose-600"
        },
        {
            id: 'others',
            title: language === 'ar' ? 'فيديوهات أخرى' : 'Other Videos',
            desc: language === 'ar' ? 'تغطيات، فعاليات ومحتوى متنوع' : 'Events, coverage and more',
            icon: <Film className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=600",
            color: "from-purple-500 to-pink-600"
        }
    ];

    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-500 pb-32`}>
            {/* Header - Pill Style */}
            <div className={`sticky top-0 z-50 ${darkMode ? 'bg-[#0a0f1a]/80' : 'bg-slate-50/80'} backdrop-blur-xl border-b ${darkMode ? 'border-white/5' : 'border-gray-200'} px-4 py-4 md:py-6`}>
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.back()}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-all`}
                        >
                            <ChevronLeft className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="flex flex-col text-start">
                            <h1 className={`text-xl md:text-2xl font-black ${textClass} tracking-tighter flex items-center gap-2`}>
                                <PlaySquare className="w-5 h-5 text-primary" />
                                {language === 'ar' ? 'مكتبة كابتنا' : 'Captina Library'}
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <span>{t('home')}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span className="text-primary">{language === 'ar' ? 'المكتبة المرئية' : 'Video Library'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} text-gray-500 active:scale-95 transition-all`}>
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <main className="container mx-auto px-4 pt-8">
                <div className="mb-8 text-center">
                    <h2 className={`text-2xl md:text-4xl font-black ${textClass} tracking-tighter mb-2`}>
                        {language === 'ar' ? 'استكشف المحتوى' : 'Explore Content'}
                    </h2>
                    <p className={`text-xs md:text-sm font-bold ${textMuted} max-w-md mx-auto`}>
                        {language === 'ar' ? 'مئات الفيديوهات الحصرية لتعزيز لياقتك ومهاراتك' : 'Hundreds of exclusive videos to boost your fitness and skills'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map((cat, i) => (
                        <Link href={`/library/${cat.id}`} key={cat.id}>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`group relative h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-xl border ${darkMode ? 'border-white/10' : 'border-gray-200'} bg-black`}
                            >
                                <img 
                                    src={cat.image} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110"
                                    alt={cat.title}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-tr ${cat.color} mix-blend-multiply opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
                                
                                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                                            {cat.icon}
                                        </div>
                                        <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                                            <ChevronLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                    
                                    <div className="text-start">
                                        <h3 className="text-xl md:text-3xl font-black text-white mb-2 drop-shadow-md">{cat.title}</h3>
                                        <p className="text-white/80 text-xs md:text-sm font-bold drop-shadow-md">{cat.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
