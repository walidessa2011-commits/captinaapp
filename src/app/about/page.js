"use client";
import { motion } from "framer-motion";
import { 
    Info, Star, Award, Users, Rocket, 
    ChevronRight, ChevronLeft, Heart, 
    ShieldCheck, Zap, Target
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function AboutApp() {
    const { language } = useApp();

    const stats = [
        { label: language === 'ar' ? 'متدرب' : 'Trainees', value: '+10,000', icon: Users, color: 'text-blue-500' },
        { label: language === 'ar' ? 'مدرب' : 'Trainers', value: '+500', icon: Star, color: 'text-amber-500' },
        { label: language === 'ar' ? 'سنة نجاح' : 'Years Success', value: '3', icon: Rocket, color: 'text-primary' }
    ];

    const values = [
        {
            title: language === 'ar' ? 'الجودة' : 'Quality',
            desc: language === 'ar' ? 'نختار أفضل المدربين المعتمدين لضمان أفضل نتائج لمتدربينا.' : 'We select the best certified trainers to ensure the best results for our trainees.',
            icon: Award
        },
        {
            title: language === 'ar' ? 'الابتكار' : 'Innovation',
            desc: language === 'ar' ? 'نستخدم أحدث التقنيات لجعل تجربة التدريب سهلة وفعالة.' : 'We use the latest technology to make the training experience easy and effective.',
            icon: Zap
        },
        {
            title: language === 'ar' ? 'الالتزام' : 'Commitment',
            desc: language === 'ar' ? 'نلتزم بتحقيق أهدافك والوصول بك لأفضل نسخة من نفسك.' : 'We are committed to achieving your goals and reaching the best version of yourself.',
            icon: Target
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] transition-colors duration-300 pb-12">
            {/* Premium Ultra-Compact Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
                <div className="container mx-auto px-4 h-12 flex items-center justify-between max-w-2xl">
                    <div className="flex items-center gap-3">
                        <Link href="/settings" className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            {language === 'ar' ? <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                        </Link>
                        <h1 className="text-sm font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                            <span className="opacity-50 text-[9px] font-bold uppercase tracking-widest">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'عن التطبيق' : 'About App'}</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30 rotate-3">
                        <img src="/logo.png" alt="Captina" className="w-16 h-16 object-contain brightness-0 invert" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Captina</h2>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto italic">
                        {language === 'ar' 
                            ? '"منصتك المتكاملة للربط بين أفضل المدربين الرياضيين والمتدربين الطموحين لتحقيق أهدافهم الصحية والبدنية."' 
                            : '"Your integrated platform connecting best fitness trainers with ambitious trainees to achieve their health and physical goals."'}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm text-center">
                            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                            <h4 className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">{stat.value}</h4>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="space-y-8 text-start">
                    <section>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Rocket className="w-4 h-4 text-primary" />
                            </span>
                            {language === 'ar' ? 'قصتنا' : 'Our Story'}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                            {language === 'ar' 
                                ? 'بدأ كابتينا كفكرة بسيطة لسد الفجوة في عالم اللياقة البدنية. نحن نؤمن أن الحصول على مدرب محترف لا يجب أن يكون صعباً أو مكلفاً بشكل مبالغ فيه. منصتنا توفر لك كل ما تحتاجه لتبدأ رحلتك التحولية اليوم.' 
                                : 'Captina started as a simple idea to bridge the gap in the fitness world. We believe that getting a professional trainer should not be difficult or overpriced. Our platform provides everything you need to start your transformation journey today.'}
                        </p>
                    </section>

                    <section className="grid grid-cols-1 gap-4">
                        {values.map((v, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                    <v.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1">{v.title}</h4>
                                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

                {/* Footer Message */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-gray-400 flex items-center justify-center gap-2">
                        {language === 'ar' ? 'صنع بكل' : 'Made with'} <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {language === 'ar' ? 'في كابتينا' : 'at Captina'}
                    </p>
                    <p className="text-[9px] font-bold text-gray-500 mt-2 uppercase tracking-widest">© 2026 Captina App</p>
                </div>
            </main>
        </div>
    );
}
