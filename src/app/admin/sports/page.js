"use client";
import React, { useState, useEffect } from 'react';
import { 
    Plus, Search, Dumbbell, Trash2, Edit2, 
    MoreVertical, Eye, CheckCircle2, XCircle, 
    AlertCircle, Image as ImageIcon, Video, 
    Users, Info, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, setDoc } from "firebase/firestore";
import Link from 'next/link';
import Pagination from '../components/Pagination';

export default function AdminSportsPage() {
    const { language, darkMode, setAlert, t } = useApp();
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "sports"));
            const sportsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSports(sportsList);
        } catch (error) {
            console.error("Error fetching sports:", error);
            setAlert({ type: 'error', message: language === 'ar' ? 'حدث خطأ في جلب الرياضات' : 'Error fetching sports' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الرياضة؟' : 'Are you sure you want to delete this sport?')) return;
        try {
            await deleteDoc(doc(db, "sports", id));
            setAlert({ type: 'success', message: language === 'ar' ? 'تم حذف الرياضة بنجاح' : 'Sport deleted successfully' });
            fetchSports();
        } catch (error) {
            console.error("Error deleting sport:", error);
            setAlert({ type: 'error', message: language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting sport' });
        }
    };

    const initializeSports = async () => {
        if (!window.confirm(language === 'ar' ? 'هل تريد استيراد البيانات الافتراضية للرياضات؟' : 'Do you want to import default sports data?')) return;
        setLoading(true);
        const defaultSports = t('pageSportsData') || [];
        try {
            for (const sport of defaultSports) {
                const content = t(sport.id + 'Content') || {};
                const sportDoc = {
                    id: sport.id,
                    name: { ar: content.title || sport.name, en: sport.name },
                    description: { ar: content.description || sport.description, en: sport.description },
                    image: sport.image,
                    heroImg: content.heroImg || sport.image,
                    gallery: [],
                    videos: [],
                    benefits: (content.benefits || []).map(b => ({ ar: b, en: b })),
                    stats: {
                        intensity: sport.stats?.intensity || 'High',
                        duration: sport.stats?.duration || '60 min',
                        equipment: { ar: content.equipment || '', en: content.equipment || '' },
                        age: content.age || 'All ages'
                    },
                    status: 'active',
                    createdAt: serverTimestamp()
                };
                await setDoc(doc(db, "sports", sport.id), sportDoc);
            }
            setAlert({ type: 'success', message: language === 'ar' ? 'تم استيراد البيانات بنجاح' : 'Data imported successfully' });
            fetchSports();
        } catch (error) {
            console.error("Error initializing sports:", error);
            setAlert({ type: 'error', message: 'Error initializing' });
        } finally {
            setLoading(false);
        }
    };

    const filteredSports = sports.filter(s => {
        const name = typeof s.name === 'object' ? (s.name[language] || s.name.ar || s.name.en) : s.name;
        return (name || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredSports.length / itemsPerPage);
    const paginatedSports = filteredSports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const bgClass = darkMode ? "bg-[#0f172a]" : "bg-gray-50";
    const cardClass = darkMode ? "bg-[#1e293b] border-white/5" : "bg-white border-gray-100";
    const textClass = darkMode ? "text-white" : "text-gray-900";

    const getText = (val) => {
        if (typeof val === 'object' && val !== null) {
            return val[language] || val['ar'] || val['en'] || '';
        }
        return val || '';
    };

    return (
        <div className={`min-h-screen p-6 lg:p-10 ${bgClass}`}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20">
                        <Dumbbell className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-start">
                        <h1 className={`text-2xl font-black ${textClass} tracking-tight uppercase`}>
                            {language === 'ar' ? 'إدارة الرياضات' : 'Sports Management'}
                        </h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest opacity-60">
                            {language === 'ar' ? `لديك ${sports.length} رياضة مسجلة` : `You have ${sports.length} sports registered`}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={initializeSports}
                        className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-slate-900 dark:text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-gray-50 flex items-center gap-3"
                    >
                        <RefreshCw className="w-5 h-5" />
                        {language === 'ar' ? 'استيراد البيانات' : 'Import Defaults'}
                    </button>
                    <Link 
                        href="/admin/sports/new"
                        className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5" />
                        {language === 'ar' ? 'إضافة رياضة جديدة' : 'Add New Sport'}
                    </Link>
                </div>
            </div>

            {/* Filter & Search */}
            <div className={`${cardClass} p-4 rounded-[2rem] border mb-8 flex flex-col md:flex-row gap-4 items-center`}>
                <div className="relative flex-1 w-full text-start">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'ابحث باسم الرياضة...' : 'Search by sport name...'}
                        className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold ${textClass} outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Sports Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {paginatedSports.map((sport, idx) => (
                            <motion.div 
                                key={sport.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`${cardClass} rounded-[2.5rem] border overflow-hidden group hover:shadow-2xl transition-all relative flex flex-col`}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img 
                                        src={sport.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400"} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-start">
                                        <h3 className="text-white font-black text-lg uppercase tracking-tight">{getText(sport.name)}</h3>
                                        <span className="text-primary text-[10px] font-black uppercase tracking-widest">{sport.id}</span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <p className="text-[10px] font-bold text-gray-400 line-clamp-2 mb-4">
                                            {getText(sport.description)}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-[8px] font-black text-gray-500">
                                                <ImageIcon className="w-3 h-3" />
                                                {sport.gallery?.length || 0}
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-[8px] font-black text-gray-500">
                                                <Video className="w-3 h-3" />
                                                {sport.videos?.length || 0}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                                        <div className="flex gap-2">
                                            <Link 
                                                href={`/admin/sports/${sport.id}`}
                                                className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(sport.id)}
                                                className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <Link 
                                            href={`/sports/${sport.id}`}
                                            target="_blank"
                                            className="text-[9px] font-black text-gray-400 hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest"
                                        >
                                            View Page
                                            <Eye className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
