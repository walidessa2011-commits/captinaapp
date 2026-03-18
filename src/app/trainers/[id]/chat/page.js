"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, ArrowLeft, MoreVertical, Phone, Video, 
    Smile, Image as ImageIcon, Paperclip, Check, CheckCheck,
    Sidebar, Info, ShieldCheck, Zap
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { trainersData } from '@/lib/trainersData';
import { use } from 'react';
import Link from 'next/link';

export default function TrainerChat({ params }) {
    const { language, darkMode, t } = useApp();
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const trainerInfo = trainersData[id] || trainersData['ahmed-hussaini'];
    
    const [messages, setMessages] = useState([
        { id: 1, text: language === 'ar' ? `مرحباً بك! كيف يمكنني مساعدتك في رحلتك الرياضية اليوم؟` : `Hello! How can I help you with your fitness journey today?`, sender: 'trainer', time: '09:00', status: 'read' }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const userMsg = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            time: time,
            status: 'sent'
        };

        setMessages([...messages, userMsg]);
        setNewMessage('');

        // Simulate Typing & Response
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                text: language === 'ar' ? 'شكراً لرسالتك. سأقوم بالرد عليك في أقرب وقت ممكن لمناقشة التفاصيل.' : 'Thank you for your message. I will get back to you as soon as possible to discuss the details.',
                sender: 'trainer',
                time: time,
                status: 'read'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1500);
    };

    const trainerName = trainerInfo.name[language];
    const trainerImage = trainerInfo.profileImage;
    const trainerTitle = trainerInfo.title[language];

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} transition-colors duration-500 flex flex-col`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* Header */}
            <header className={`${darkMode ? 'bg-[#111827]/80' : 'bg-white/80'} backdrop-blur-xl border-b ${darkMode ? 'border-white/5' : 'border-slate-100'} sticky top-0 z-50 px-4 md:px-6 py-4`}>
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/trainers/${id}`}>
                            <button className={`p-2 rounded-xl ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'} transition-all active:scale-95`}>
                                {language === 'ar' ? <ArrowLeft className="rotate-180 w-5 h-5 text-gray-400" /> : <ArrowLeft className="w-5 h-5 text-gray-400" />}
                            </button>
                        </Link>
                        
                        <div className="relative">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-primary/20">
                                <img src={trainerImage} className="w-full h-full object-cover" alt={trainerName} />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#111827] rounded-full"></div>
                        </div>

                        <div>
                            <h1 className={`text-sm md:text-base font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight leading-tight`}>{trainerName}</h1>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{language === 'ar' ? 'نشط الآن' : 'Active Now'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <button className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-primary/10 hover:text-primary text-gray-400' : 'bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-500'} transition-all active:scale-95 hidden sm:block`}>
                            <Phone className="w-4 h-4" />
                        </button>
                        <button className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-primary/10 hover:text-primary text-gray-400' : 'bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-500'} transition-all active:scale-95 hidden sm:block`}>
                            <Video className="w-4 h-4" />
                        </button>
                        <button className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'} text-gray-400 transition-all active:scale-95`}>
                            <Info className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Body */}
            <main 
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-8 space-y-6 max-w-4xl mx-auto w-full no-scrollbar"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 mb-4 inline-flex flex-col items-center">
                        <ShieldCheck className="w-6 h-6 text-primary mb-2" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center px-4 max-w-[200px]">
                            {language === 'ar' ? 'هذه الدردشة مشفرة وآمنة تماماً' : 'This chat is encrypted and secured'}
                        </p>
                    </div>
                    <div className={`${darkMode ? 'bg-white/5' : 'bg-slate-200'} h-[1px] w-32 mb-8`}></div>
                </div>

                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] md:max-w-[70%] group`}>
                                <div className={`
                                    relative p-4 md:p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm
                                    ${msg.sender === 'user' 
                                        ? 'bg-primary text-white rounded-te-none' 
                                        : `${darkMode ? 'bg-[#1f2937]/80' : 'bg-white shadow-md shadow-gray-100'} ${darkMode ? 'text-white' : 'text-slate-800'} rounded-ts-none`}
                                `}>
                                    {msg.text}
                                    
                                    <div className={`flex items-center gap-1 mt-2 ${msg.sender === 'user' ? 'justify-end opacity-70' : 'justify-start opacity-70'}`}>
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{msg.time}</span>
                                        {msg.sender === 'user' && (
                                            msg.status === 'read' 
                                            ? <CheckCheck className="w-3 h-3" /> 
                                            : <Check className="w-3 h-3" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </main>

            {/* Input Area */}
            <footer className={`${darkMode ? 'bg-[#0a0f1a]/80' : 'bg-white/80'} backdrop-blur-xl border-t ${darkMode ? 'border-white/5' : 'border-slate-100'} p-4 md:p-6 pb-12 sticky bottom-0 z-50`}>
                <form 
                    onSubmit={handleSendMessage}
                    className="max-w-4xl mx-auto flex items-center gap-2 md:gap-4"
                >
                    <div className="flex items-center gap-1">
                        <button type="button" className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'} transition-all active:scale-95`}>
                            <Smile className="w-5 h-5" />
                        </button>
                        <button type="button" className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'} transition-all active:scale-95 hidden sm:block`}>
                            <Paperclip className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 relative">
                        <input 
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                            className={`w-full ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-transparent'} border-2 rounded-[2rem] py-4 px-6 md:px-8 text-sm font-bold focus:border-primary focus:bg-transparent transition-all outline-none ${darkMode ? 'text-white' : 'text-slate-900'} placeholder:opacity-50`}
                        />
                        <button type="button" className={`absolute ${language === 'en' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 p-2 rounded-xl text-primary hover:bg-primary/10 transition-all active:scale-95 hidden md:block`}>
                            <ImageIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-primary text-white p-4 rounded-[1.5rem] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <Send className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                </form>
            </footer>
        </div>
    );
}
