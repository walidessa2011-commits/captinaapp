"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, ArrowLeft, Phone, Video, 
    Smile, Image as ImageIcon, Paperclip, Check, CheckCheck,
    Info, ShieldCheck, Loader2
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { trainersData } from '@/lib/trainersData';
import { db } from "@/lib/firebase";
import { 
    doc, getDoc, onSnapshot, collection, 
    addDoc, serverTimestamp, query, orderBy 
} from "firebase/firestore";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ChatContent({ params: routeParams }) {
    const { language, darkMode, t, user, getText, setAlert } = useApp();
    const router = useRouter(); // Keeping this for router.back()
    
    // Use the params passed from the server component
    const id = routeParams?.id;
    
    const [trainerInfo, setTrainerInfo] = useState(null);
    const [loadingTrainer, setLoadingTrainer] = useState(true);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    // 1. Fetch Trainer Info
    useEffect(() => {
        async function fetchTrainer() {
            if (!id) return;
            setLoadingTrainer(true);
            try {
                // Check static data first
                if (trainersData[id]) {
                    setTrainerInfo(trainersData[id]);
                    setLoadingTrainer(false);
                    return;
                }

                // Check Firestore
                const docRef = doc(db, "trainers", id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Normalize name structure to always be an object with ar/en
                    const normalizedName = typeof data.name === 'object' 
                        ? data.name 
                        : { 
                            ar: data.name_ar || data.name || id, 
                            en: data.name_en || data.name || id 
                        };

                    setTrainerInfo({
                        ...data,
                        name: normalizedName,
                        profileImage: data.image || data.profileImage || "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400"
                    });
                } else {
                    console.error("Trainer not found in Firestore or static data");
                    setTrainerInfo(null);
                }
            } catch (err) {
                console.error("Error fetching trainer:", err);
                setTrainerInfo(null);
            } finally {
                setLoadingTrainer(false);
            }
        }

        fetchTrainer();
    }, [id]);

    // 2. Real-time Messages
    useEffect(() => {
        if (!user || !id) {
            setLoadingMessages(false);
            return;
        }

        // Create a unique Chat ID (alphabetical order of UIDs)
        const chatDocId = [user.uid, id].sort().join('_');
        const messagesRef = collection(db, "chats", chatDocId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Format time for display
                    time: data.timestamp?.toDate() 
                        ? new Date(data.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                        : ''
                };
            });
            setMessages(fetchedMessages);
            setLoadingMessages(false);
        }, (err) => {
            console.error("Error listening to messages:", err);
            setLoadingMessages(false);
        });

        return () => unsubscribe();
    }, [user, id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !id) {
            if (!user) setAlert?.({ title: language === 'ar' ? 'تنبيه' : 'Alert', message: language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'You must login first', type: 'error' });
            return;
        }

        const chatDocId = [user.uid, id].sort().join('_');
        const msgText = newMessage;
        setNewMessage('');
        setIsSending(true);

        try {
            // First ensure the chat metadata document exists (optional but good practice)
            // await setDoc(doc(db, "chats", chatDocId), {
            //     lastMessage: msgText,
            //     lastMessageTime: serverTimestamp(),
            //     participants: [user.uid, id],
            //     updatedAt: serverTimestamp()
            // }, { merge: true });

            await addDoc(collection(db, "chats", chatDocId, "messages"), {
                text: msgText,
                senderId: user.uid,
                receiverId: id,
                timestamp: serverTimestamp(),
                status: 'sent'
            });
            
            setIsSending(false);
        } catch (err) {
            console.error("Error sending message:", err);
            setNewMessage(msgText);
            setIsSending(false);
            if (setAlert) {
                setAlert({
                    title: language === 'ar' ? 'خطأ' : 'Error',
                    message: language === 'ar' 
                        ? `فشل إرسال الرسالة: ${err.message || 'خطأ غير معروف'}` 
                        : `Failed to send message: ${err.message || 'Unknown error'}`,
                    type: 'error'
                });
            }
        }
    };

    if (loadingTrainer) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"}`}>
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest text-center">
                    {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </p>
            </div>
        );
    }

    if (!trainerInfo) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="p-8 bg-red-500/10 rounded-full mb-6">
                    <Info className="w-12 h-12 text-red-500" />
                </div>
                <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    {language === 'ar' ? 'المدرب غير موجود' : 'Trainer Not Found'}
                </h2>
                <button 
                    onClick={() => router.back()}
                    className="mt-4 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all"
                >
                    {language === 'ar' ? 'رجوع' : 'Go Back'}
                </button>
            </div>
        );
    }

    // Helper to get string name safely
    const getTrainerName = () => {
        if (!trainerInfo) return id || "";
        if (typeof trainerInfo.name === 'object') {
            return trainerInfo.name[language] || trainerInfo.name.ar || trainerInfo.name.en || id;
        }
        return trainerInfo.name || id;
    };

    const trainerName = getTrainerName();
    
    function trainerImgFallback(img) {
        if (!img) return "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400";
        return img;
    }

    const trainerImage = trainerImgFallback(trainerInfo.profileImage || trainerInfo.image);

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
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-primary/20 bg-gray-200">
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

                {!user && !loadingMessages && (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-orange-500/5 rounded-[2.5rem] border border-dashed border-orange-500/20">
                        <div className="p-4 bg-orange-500/10 rounded-full mb-4">
                            <Info className="w-8 h-8 text-orange-500" />
                        </div>
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4 px-6`}>
                            {language === 'ar' ? 'يرجى تسجيل الدخول لبدء المحادثة مع المدرب' : 'Please login to start the conversation with the trainer'}
                        </p>
                        <Link href="/login">
                            <button className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
                                {language === 'ar' ? 'تسجيل الدخول' : 'Login NOW'}
                            </button>
                        </Link>
                    </div>
                )}

                {loadingMessages && user && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] md:max-w-[70%] group`}>
                                <div className={`
                                    relative p-4 md:p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm
                                    ${msg.senderId === user?.uid 
                                        ? 'bg-primary text-white rounded-te-none' 
                                        : `${darkMode ? 'bg-[#1f2937]/80' : 'bg-white shadow-md shadow-gray-100'} ${darkMode ? 'text-white' : 'text-slate-800'} rounded-ts-none`}
                                `}>
                                    {msg.text}
                                    
                                    <div className={`flex items-center gap-1 mt-2 ${msg.senderId === user?.uid ? 'justify-end opacity-70' : 'justify-start opacity-70'}`}>
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{msg.time}</span>
                                        {msg.senderId === user?.uid && (
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
            <div className={`sticky bottom-0 p-4 md:p-6 ${darkMode ? 'bg-[#0a0f1a]/80' : 'bg-slate-50/80'} backdrop-blur-xl border-t ${darkMode ? 'border-white/5' : 'border-slate-100'} z-50`}>
                <form 
                    onSubmit={handleSendMessage}
                    className="max-w-4xl mx-auto flex items-center gap-2 md:gap-4"
                >
                    <div className="flex items-center gap-1">
                        <button type="button" className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-200 hover:bg-slate-300'} text-gray-400 transition-all active:scale-95`}>
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={language === 'ar' ? "اكتب رسالتك هنا..." : "Type your message here..."}
                            disabled={!user}
                            className={`
                                w-full py-4 px-6 rounded-3xl outline-none transition-all text-sm font-medium
                                ${darkMode 
                                    ? 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-primary/50' 
                                    : 'bg-white border-slate-200 text-slate-800 focus:border-primary/50 shadow-sm'}
                                border
                            `}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={!newMessage.trim() || !user || isSending}
                        className={`
                            p-4 rounded-3xl transition-all active:scale-90 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:grayscale
                            ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}
                        `}
                    >
                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
