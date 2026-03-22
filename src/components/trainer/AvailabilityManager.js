"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    Moon, 
    Sun, 
    Calendar, 
    Plus, 
    Trash2, 
    Check,
    X,
    Save,
    ChevronRight,
    ToggleLeft as Toggle,
    Volume2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AvailabilityManager() {
    const { language, darkMode } = useApp();
    const [vacationMode, setVacationMode] = useState(false);
    const [schedule, setSchedule] = useState([
        { day: 'Sun', active: true, slots: [{ start: '08:00', end: '16:00' }] },
        { day: 'Mon', active: true, slots: [{ start: '08:00', end: '16:00' }] },
        { day: 'Tue', active: true, slots: [{ start: '08:00', end: '16:00' }] },
        { day: 'Wed', active: true, slots: [{ start: '08:00', end: '16:00' }] },
        { day: 'Thu', active: true, slots: [{ start: '08:00', end: '16:00' }] },
        { day: 'Fri', active: false, slots: [] },
        { day: 'Sat', active: false, slots: [] },
    ]);

    const toggleDay = (idx) => {
        const newSchedule = [...schedule];
        newSchedule[idx].active = !newSchedule[idx].active;
        if (newSchedule[idx].active && newSchedule[idx].slots.length === 0) {
            newSchedule[idx].slots = [{ start: '08:00', end: '16:00' }];
        }
        setSchedule(newSchedule);
    };

    return (
        <div className="space-y-8">
            {/* Vacation Mode Toggle */}
            <div className={`p-6 rounded-[2.5rem] border flex items-center justify-between transition-all ${vacationMode ? 'bg-[#E51B24]/10 border-[#E51B24]/30' : (darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5')}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${vacationMode ? 'bg-[#E51B24]' : 'bg-gray-500'}`}>
                        <Moon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-black text-sm italic uppercase">{language === 'ar' ? 'وضع الإجازة' : 'Vacation Mode'}</h4>
                        <p className="text-[10px] font-bold opacity-40">{language === 'ar' ? 'توقف مؤقتاً عن استقبال الطلبات' : 'Pause receiving new bookings'}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setVacationMode(!vacationMode)}
                    className={`w-14 h-8 rounded-full relative transition-colors ${vacationMode ? 'bg-[#E51B24]' : 'bg-gray-400'}`}
                >
                    <motion.div 
                        animate={{ x: vacationMode ? 24 : 4 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    />
                </button>
            </div>

            {/* Weekly Schedule */}
            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 px-2">{language === 'ar' ? 'ساعات العمل الأسبوعية' : 'Weekly Working Hours'}</h3>
                <div className="space-y-3">
                    {schedule.map((day, idx) => (
                        <div key={day.day} className={`p-4 rounded-[2rem] border flex items-center justify-between transition-all ${day.active ? (darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5') : 'opacity-40 grayscale border-transparent'}`}>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => toggleDay(idx)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${day.active ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}
                                >
                                    {day.active ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                </button>
                                <span className="font-black text-sm tracking-widest">{day.day}</span>
                            </div>

                            {day.active && (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/20 border border-white/5">
                                        <span className="text-[10px] font-black">{day.slots[0]?.start}</span>
                                        <span className="text-[10px] opacity-20">-</span>
                                        <span className="text-[10px] font-black">{day.slots[0]?.end}</span>
                                    </div>
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#E51B24] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#E51B24]/20 hover:brightness-110 transition-all flex items-center justify-center gap-3 mt-4"
            >
                <Save className="w-5 h-5" />
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </motion.button>
        </div>
    );
}
