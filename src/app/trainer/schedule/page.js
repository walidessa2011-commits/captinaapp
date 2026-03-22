"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    ChevronRight, 
    Calendar as CalendarIcon, 
    Clock, 
    MapPin, 
    Plus,
    Filter,
    Settings,
    Map
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function TrainerSchedule() {
    const { language, darkMode } = useApp();
    const [view, setView] = useState('daily'); // daily, weekly, monthly
    const [selectedDate, setSelectedDate] = useState(new Date());

    const sessions = [
        {
            id: 1,
            time: '04:00 PM',
            duration: '60 min',
            trainee: 'Ahmed K.',
            sport: 'MMA',
            type: 'Home',
            status: 'upcoming',
            color: 'bg-orange-500'
        },
        {
            id: 2,
            time: '06:30 PM',
            duration: '90 min',
            trainee: 'Sara S.',
            sport: 'Boxing',
            type: 'Gym',
            status: 'completed',
            color: 'bg-blue-500'
        },
        {
            id: 3,
            time: '08:00 PM',
            duration: '60 min',
            trainee: 'Khalid M.',
            sport: 'Fitness',
            type: 'Home',
            status: 'upcoming',
            color: 'bg-emerald-500'
        }
    ];

    const ViewToggle = () => (
        <div className={`p-1 rounded-2xl flex transition-colors ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
            {['daily', 'weekly', 'monthly'].map((v) => (
                <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex-1 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-[#E51B24] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                    {v === 'daily' ? (language === 'ar' ? 'يومي' : 'Daily') : v === 'weekly' ? (language === 'ar' ? 'أسبوعي' : 'Weekly') : (language === 'ar' ? 'شهري' : 'Monthly')}
                </button>
            ))}
        </div>
    );

    const CalendarHeader = () => (
        <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black italic uppercase">
                {selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
                <button className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-black/5 hover:bg-black/5'}`}>
                    <ChevronLeft className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />
                </button>
                <button className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-black/5 hover:bg-black/5'}`}>
                    <ChevronRight className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-6 pb-32 max-w-lg mx-auto space-y-8">
            <header className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black italic uppercase">{language === 'ar' ? 'جدول الحصص' : 'Schedule'}</h2>
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-xl bg-[#E51B24] text-white flex items-center justify-center shadow-lg shadow-[#E51B24]/20"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>
                <ViewToggle />
            </header>

            <CalendarHeader />

            {/* Timeline View */}
            <section className="space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={view}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        {sessions.map((session, idx) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
                                className={`group p-5 rounded-[2rem] border relative overflow-hidden flex gap-5 transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-black/5 hover:bg-black/5'}`}
                            >
                                {/* Time Column */}
                                <div className="flex flex-col items-center justify-center gap-1 min-w-[60px] border-r border-white/10 pr-4">
                                    <span className="text-[10px] font-black uppercase text-[#E51B24]">{session.time.split(' ')[1]}</span>
                                    <span className="text-lg font-black italic">{session.time.split(' ')[0]}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h4 className="font-black text-sm">{session.trainee}</h4>
                                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{session.sport}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${session.type === 'Home' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'bg-blue-500/20 text-blue-500 border border-blue-500/30'}`}>
                                            {session.type}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-1">
                                        <div className="flex items-center gap-1.5 opacity-40">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px] font-bold">{session.duration}</span>
                                        </div>
                                        {session.type === 'Home' && (
                                            <div className="flex items-center gap-1.5 text-[#E51B24]">
                                                <MapPin className="w-3 h-3" />
                                                <span className="text-[10px] font-bold underline underline-offset-2">{language === 'ar' ? 'عرض الموقع' : 'View Location'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Session Indicator */}
                                {session.status === 'upcoming' && idx === 0 && (
                                    <div className="absolute top-0 right-0 p-2">
                                        <div className="w-2 h-2 rounded-full bg-[#E51B24] shadow-[0_0_8px_#E51B24] animate-pulse"></div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* Map Integration Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-6 rounded-[2.5rem] border flex items-center justify-between group relative overflow-hidden ${darkMode ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-white/10' : 'bg-blue-50/50 border-black/5'}`}
            >
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <Map className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-black text-sm italic uppercase">{language === 'ar' ? 'خارطة الطريق' : 'Daily Route'}</h4>
                        <p className="text-[10px] font-bold opacity-40">{language === 'ar' ? 'تحسين المسار لليوم' : 'Optimize sessions route'}</p>
                    </div>
                </div>
                <ChevronRight className={`w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${language === 'en' ? '' : 'rotate-180'}`} />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500/20"></div>
            </motion.button>
            <div className={`fixed top-0 right-0 w-[400px] h-[400px] blur-[150px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>
        </div>
    );
}
