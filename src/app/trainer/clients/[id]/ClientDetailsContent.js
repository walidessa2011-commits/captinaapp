"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ChevronLeft, 
    Phone, 
    MessageCircle, 
    MapPin, 
    CheckCircle2, 
    FileText,
    Activity,
    Dumbbell,
    MoreVertical,
    Plus,
    X
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function ClientDetailsContent({ params }) {
    const { language, darkMode } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview'); // overview, history, notes

    // Mock data
    const client = {
        name: language === 'ar' ? 'سالم العتيبي' : 'Salem Al-Otaibi',
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200",
        phone: '+966 501234567',
        location: language === 'ar' ? 'الرياض، النرجس' : 'Riyadh, An Narjis',
        sport: language === 'ar' ? 'ملاكمة' : 'Boxing',
        package: language === 'ar' ? 'باقة 10 حصص' : '10 Sessions Package',
        remaining: 3,
        total: 10,
        progress: 70,
        history: [
            { id: 1, date: '2026-03-20', time: '18:30', status: 'completed', type: 'Home' },
            { id: 2, date: '2026-03-18', time: '18:30', status: 'completed', type: 'Home' },
            { id: 3, date: '2026-03-15', time: '17:00', status: 'canceled', type: 'Gym' },
        ],
        notes: [
            { id: 1, date: '2026-03-18', text: language === 'ar' ? 'تحسن كبير في اللكمة اليسرى' : 'Significant improvement in left hook' },
            { id: 2, date: '2026-03-10', text: language === 'ar' ? 'يعاني من إصابة خفيفة في الركبة' : 'Suffering from mild knee injury' }
        ]
    };

    return (
        <div className="p-6 pb-32 max-w-lg mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}
                >
                    <ChevronLeft className={`w-5 h-5 ${language === 'en' ? '' : 'rotate-180'}`} />
                </button>
                <h2 className="text-xl font-black italic uppercase tracking-wider">{language === 'ar' ? 'ملف المتدرب' : 'Client Profile'}</h2>
                <button className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                    <MoreVertical className="w-5 h-5 opacity-40" />
                </button>
            </div>

            {/* Profile Info Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-[3rem] border relative overflow-hidden text-center space-y-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-xl'}`}
            >
                <div className="relative inline-flex mx-auto">
                    <img src={client.image} alt="" className="w-24 h-24 rounded-[2rem] object-cover border-4 border-[#E51B24]/20" />
                    <div className="absolute -bottom-2 -right-2 bg-[#E51B24] p-2 rounded-xl shadow-lg">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-2xl font-black italic">{client.name}</h3>
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">{client.sport} • {client.package}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20">
                        <Phone className="w-4 h-4" />
                        {language === 'ar' ? 'اتصال' : 'Call'}
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-[#E51B24] text-white py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#E51B24]/20">
                        <MessageCircle className="w-4 h-4" />
                        {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                    </button>
                </div>
            </motion.div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                    <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">{language === 'ar' ? 'الجلسات المتبقية' : 'Remaining'}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black italic text-[#E51B24]">{client.remaining}</span>
                        <span className="text-xs font-bold opacity-20">/ {client.total}</span>
                    </div>
                </div>
                <div className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                    <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">{language === 'ar' ? 'نسبة الإنجاز' : 'Completion'}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black italic text-emerald-500">{client.progress}%</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                {['overview', 'history', 'notes'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#E51B24]' : 'opacity-40'}`}
                    >
                        {tab === 'overview' ? (language === 'ar' ? 'نظرة عامة' : 'Details') : tab === 'history' ? (language === 'ar' ? 'السجل' : 'History') : (language === 'ar' ? 'ملاحظات' : 'Notes')}
                        {activeTab === tab && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E51B24]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <div className={`p-5 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'موقع التدريب' : 'Home Location'}</p>
                                <p className="text-xs font-black italic">{client.location}</p>
                            </div>
                        </div>
                        <div className={`p-5 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                            <div className="w-10 h-10 rounded-xl bg-[#E51B24]/10 flex items-center justify-center">
                                <Dumbbell className="w-5 h-5 text-[#E51B24]" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'هدف التدريب' : 'Training Focus'}</p>
                                <p className="text-xs font-black italic">{language === 'ar' ? 'خسارة الوزن وزيادة قوة التحمل' : 'Weight loss and endurance'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-3">
                        {client.history.map(item => (
                            <div key={item.id} className={`p-4 rounded-3xl border flex items-center justify-between ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'} ${item.status === 'canceled' ? 'opacity-40' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black italic">{item.date}</p>
                                        <p className="text-[9px] font-bold opacity-40">{item.time} • {item.type}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black opacity-20 uppercase">#{item.id}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="space-y-4">
                        {client.notes.map(note => (
                            <div key={note.id} className={`p-5 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-[#E51B24]">{note.date}</span>
                                    <FileText className="w-3 h-3 opacity-20" />
                                </div>
                                <p className="text-xs font-bold leading-relaxed">{note.text}</p>
                            </div>
                        ))}
                        <button className="w-full py-4 rounded-3xl border border-dashed border-white/20 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            {language === 'ar' ? 'إضافة ملاحظة' : 'Add Private Note'}
                        </button>
                    </div>
                )}
            </div>
            
            <div className={`fixed top-0 right-0 w-[400px] h-[400px] blur-[150px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>
        </div>
    );
}
