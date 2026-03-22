"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    ChevronRight, 
    Users, 
    Clock, 
    AlertCircle,
    Phone,
    MapPin,
    MoreVertical,
    CheckCircle2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function TrainerClients() {
    const { language, darkMode } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const clients = [
        {
            id: 'client-1',
            name: language === 'ar' ? 'سالم العتيبي' : 'Salem Al-Otaibi',
            sport: language === 'ar' ? 'ملاكمة' : 'Boxing',
            package: language === 'ar' ? 'باقة 10 حصص' : '10 Sessions Package',
            remaining: 3,
            expiresIn: 4,
            status: 'active',
            lastSession: '2026-03-20',
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=100"
        },
        {
            id: 'client-2',
            name: language === 'ar' ? 'أحمد الشمراني' : 'Ahmed Al-Shamrani',
            sport: language === 'ar' ? 'كمال أجسام' : 'Bodybuilding',
            package: language === 'ar' ? 'اشتراك شهري' : 'Monthly Unlimited',
            remaining: 12,
            expiresIn: 15,
            status: 'active',
            lastSession: '2026-03-19',
            image: "https://images.unsplash.com/photo-1541534741688-6078c64b5cc5?q=80&w=100"
        },
        {
            id: 'client-3',
            name: language === 'ar' ? 'فيصل الحربي' : 'Faisal Al-Harbi',
            sport: language === 'ar' ? 'كيك بوكسينغ' : 'Kickboxing',
            package: language === 'ar' ? 'باقة 10 حصص' : '10 Sessions Package',
            remaining: 0,
            expiresIn: 0,
            status: 'expired',
            lastSession: '2026-03-15',
            image: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=100"
        }
    ];

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.sport.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 pb-32 max-w-lg mx-auto space-y-8">
            <header className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase">{language === 'ar' ? 'المتدربين' : 'Trainee Roster'}</h2>
                
                {/* Search & Filter */}
                <div className="flex gap-3">
                    <div className="flex-1 relative group">
                        <Search className={`absolute ${language === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:text-[#E51B24] transition-colors`} />
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={language === 'ar' ? 'بحث عن متدرب...' : 'Search trainees...'}
                            className={`w-full py-3.5 ${language === 'en' ? 'pl-11 pr-4' : 'pr-11 pl-4'} rounded-2xl border outline-none font-black text-xs transition-all ${darkMode ? 'bg-white/5 border-white/10 focus:bg-white/10 focus:border-[#E51B24]' : 'bg-black/5 border-black/5 focus:bg-black/10 focus:border-[#E51B24]'}`}
                        />
                    </div>
                    <button className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-black/5 hover:bg-black/5'}`}>
                        <Filter className="w-5 h-5 opacity-40" />
                    </button>
                </div>
            </header>

            {/* Client List */}
            <section className="space-y-4">
                {filteredClients.map((client, idx) => (
                    <Link key={client.id} href={`/trainer/clients/${client.id}`} className="block">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                            className={`p-5 rounded-[2.5rem] border flex items-center gap-4 transition-all hover:scale-[1.02] ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/[0.08]' : 'bg-white border-black/5 hover:border-black/10'}`}
                        >
                            <div className="relative">
                                <img src={client.image} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E51B24]/20" />
                                {client.expiresIn <= 5 && client.status !== 'expired' && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#E51B24] rounded-full flex items-center justify-center shadow-lg border-2 border-white/10">
                                        <AlertCircle className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-sm italic">{client.name}</h4>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${client.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-[#E51B24]/10 text-[#E51B24] border border-[#E51B24]/20'}`}>
                                        {client.status}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">{client.package}</p>
                                
                                <div className="flex items-center gap-3 pt-1">
                                    <div className="flex items-center gap-1.5 font-bold text-[9px]">
                                        <span className={client.remaining <= 3 ? 'text-[#E51B24]' : 'opacity-40'}>
                                            {language === 'ar' ? `${client.remaining} حصص متبقية` : `${client.remaining} Sessions left`}
                                        </span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                                    <div className="flex items-center gap-1.5 font-bold text-[9px] opacity-40">
                                        <Clock className="w-3 h-3" />
                                        <span>{language === 'ar' ? 'منذ 2 يوم' : '2d ago'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <ChevronRight className={`w-5 h-5 opacity-20 ${language === 'en' ? '' : 'rotate-180'}`} />
                        </motion.div>
                    </Link>
                ))}
            </section>

            {/* Background Effects */}
            <div className={`fixed bottom-0 left-0 w-[400px] h-[400px] blur-[150px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-emerald-500/5 opacity-100' : 'bg-emerald-500/10 opacity-50'}`}></div>
        </div>
    );
}
