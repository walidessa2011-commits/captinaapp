"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wallet, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Download, 
    Filter, 
    ChevronRight, 
    PieChart,
    Calendar,
    CreditCard,
    DollarSign,
    MoreHorizontal
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function TrainerWallet() {
    const { language, darkMode } = useApp();
    const [activeTab, setActiveTab] = useState('earnings'); // earnings, payouts

    const stats = [
        { label: language === 'ar' ? 'الرصيد المتاح' : 'Available Balance', value: '1,250 SAR', icon: Wallet, color: 'text-emerald-500' },
        { label: language === 'ar' ? 'أرباح الشهر' : 'Monthly Revenue', value: '4,800 SAR', icon: TrendingUp, color: 'text-[#E51B24]' }
    ];

    const transactions = [
        { id: 'tx-1', type: 'earning', client: 'Salem O.', amount: '+150 SAR', date: '2026-03-20', method: 'Session' },
        { id: 'tx-2', type: 'payout', client: 'Bank Transfer', amount: '-2,000 SAR', date: '2026-03-18', method: 'Payout' },
        { id: 'tx-3', type: 'earning', client: 'Ahmed S.', amount: '+150 SAR', date: '2026-03-17', method: 'Session' },
        { id: 'tx-4', type: 'earning', client: 'Faisal H.', amount: '+450 SAR', date: '2026-03-15', method: 'Subscription' }
    ];

    return (
        <div className="p-6 pb-32 max-w-lg mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic uppercase tracking-wider">{language === 'ar' ? 'المحفظة' : 'My Wallet'}</h2>
                <div className="flex gap-2">
                    <button className={`p-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-sm'}`}>
                        <Download className="w-5 h-5 opacity-40" />
                    </button>
                    <button className={`p-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-sm'}`}>
                        <Filter className="w-5 h-5 opacity-40" />
                    </button>
                </div>
            </header>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 gap-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-8 rounded-[3rem] border relative overflow-hidden flex flex-col items-center text-center space-y-4 ${darkMode ? 'bg-gradient-to-br from-[#E51B24]/20 to-transparent border-white/10' : 'bg-gradient-to-br from-[#E51B24]/10 to-transparent border-black/5 shadow-xl'}`}
                >
                    <div className="w-16 h-16 rounded-[2rem] bg-[#E51B24] flex items-center justify-center text-white shadow-2xl shadow-[#E51B24]/40 mb-2">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-1">{language === 'ar' ? 'الرصيد الإجمالي' : 'Total Earnings'}</p>
                        <h3 className="text-4xl font-black italic">8,420 <span className="text-sm not-italic opacity-40 uppercase">sar</span></h3>
                    </div>
                    <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs hover:brightness-90 transition-all flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {language === 'ar' ? 'طلب سحب رصيد' : 'Request Payout'}
                    </button>
                </motion.div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-sm'}`}
                    >
                        <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                        <p className="text-[9px] font-black opacity-30 uppercase tracking-wider mb-0.5">{stat.label}</p>
                        <p className="text-lg font-black italic">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Chart Area Mock */}
            <div className={`p-8 rounded-[3rem] border relative overflow-hidden space-y-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-inner'}`}>
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{language === 'ar' ? 'تحليل الأرباح' : 'Revenue Analytics'}</h4>
                    <div className="flex gap-2">
                        {['W', 'M', 'Y'].map(t => (
                            <button key={t} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${t === 'M' ? 'bg-[#E51B24] text-white' : 'opacity-20 hover:opacity-100'}`}>{t}</button>
                        ))}
                    </div>
                </div>
                
                {/* Mock Chart Visualization */}
                <div className="h-32 flex items-end justify-between gap-2 px-2">
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className={`w-full rounded-t-lg transition-all ${i === 3 ? 'bg-[#E51B24]' : 'bg-white/10 group-hover:bg-white/20'}`}
                            />
                            <span className="text-[8px] font-black opacity-20">M{i+1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transactions */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">{language === 'ar' ? 'آخر العمليات' : 'Recent Transactions'}</h3>
                    <button className="text-[10px] font-black text-[#E51B24] uppercase underline underline-offset-4">{language === 'ar' ? 'الكل' : 'View All'}</button>
                </div>
                
                <div className="space-y-3">
                    {transactions.map((tx, idx) => (
                        <motion.div 
                            key={tx.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
                            className={`p-5 rounded-[2.5rem] border flex items-center justify-between transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-black/5 hover:border-black/10'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'earning' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#E51B24]/10 text-[#E51B24]'}`}>
                                    {tx.type === 'earning' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-black text-sm italic">{tx.client}</h4>
                                    <p className="text-[10px] font-bold opacity-30">{tx.date} • {tx.method}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-black italic ${tx.type === 'earning' ? 'text-emerald-500' : 'text-white'}`}>{tx.amount}</p>
                                <ChevronRight className={`w-4 h-4 opacity-10 ml-auto mt-1 ${language === 'en' ? '' : 'rotate-180'}`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
            
            <div className={`fixed top-1/2 left-0 w-[500px] h-[500px] blur-[180px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>
        </div>
    );
}
