"use client";
import React, { useState, useEffect } from 'react';
import { 
    Plus, Search, Play, Trash2, Edit2, 
    Filter, MoreVertical, Clock, Eye,
    CheckCircle2, XCircle, AlertCircle,
    ChevronLeft, Film, PlaySquare, UserCheck,
    Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import ImageUpload from '../components/ImageUpload';

export default function AdminVideosPage() {
    const { language, darkMode, setAlert, sports = [] } = useApp();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [formLang, setFormLang] = useState('ar');

    // Form State
    const [formData, setFormData] = useState({
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        category: 'educational',
        sportId: '', // To link the video to a specific sport
        videoUrl: '', // This can be a YouTube embed or direct URL
        thumbnailUrl: '',
        duration: '',
        status: 'active'
    });

    const categories = [
        { id: 'educational', label: language === 'ar' ? 'تعليمية' : 'Educational' },
        { id: 'trainees', label: language === 'ar' ? 'المتدربين' : 'Trainees' },
        { id: 'trainers', label: language === 'ar' ? 'المدربين' : 'Trainers' },
        { id: 'others', label: language === 'ar' ? 'أخرى' : 'Others' }
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            fetchVideos();
        }
    }, []);

    const fetchVideos = async () => {
        try {
            const q = query(collection(db, "library"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const videosList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVideos(videosList);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setAlert({ type: 'error', message: language === 'ar' ? 'حدث خطأ في جلب الفيديوهات' : 'Error fetching videos' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingVideo) {
                await updateDoc(doc(db, "library", editingVideo.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
                setAlert({ type: 'success', message: language === 'ar' ? 'تم تحديث الفيديو بنجاح' : 'Video updated successfully' });
            } else {
                await addDoc(collection(db, "library"), {
                    ...formData,
                    createdAt: serverTimestamp(),
                    views: 0
                });
                setAlert({ type: 'success', message: language === 'ar' ? 'تم إضافة الفيديو بنجاح' : 'Video added successfully' });
            }
            setIsModalOpen(false);
            resetForm();
            fetchVideos();
        } catch (error) {
            console.error("Error saving video:", error);
            setAlert({ type: 'error', message: language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving video' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الفيديو؟' : 'Are you sure you want to delete this video?')) return;
        try {
            await deleteDoc(doc(db, "library", id));
            setAlert({ type: 'success', message: language === 'ar' ? 'تم حذف الفيديو بنجاح' : 'Video deleted successfully' });
            fetchVideos();
        } catch (error) {
            console.error("Error deleting video:", error);
            setAlert({ type: 'error', message: language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting video' });
        }
    };

    const resetForm = () => {
        setFormData({
            title: { ar: '', en: '' },
            description: { ar: '', en: '' },
            category: 'educational',
            sportId: '',
            videoUrl: '',
            thumbnailUrl: '',
            duration: '',
            status: 'active'
        });
        setEditingVideo(null);
    };

    // Safe text getter: handles both {ar, en} objects and plain strings
    const getText = (val) => {
        if (typeof val === 'object' && val !== null) {
            return val[language] || val['ar'] || val['en'] || '';
        }
        return val || '';
    };

    // Normalize text to {ar, en} object for form compatibility
    const normalizeText = (val) => {
        if (typeof val === 'object' && val !== null) return val;
        return { ar: val || '', en: val || '' };
    };

    const openEdit = (video) => {
        setEditingVideo(video);
        setFormData({
            title: normalizeText(video.title),
            description: normalizeText(video.description),
            category: video.category,
            sportId: video.sportId || '',
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            duration: video.duration,
            status: video.status
        });
        setIsModalOpen(true);
    };

    const filteredVideos = videos.filter(v => {
        const matchesSearch = 
            getText(v.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
            (v.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || v.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const bgClass = darkMode ? "bg-[#0f172a]" : "bg-gray-50";
    const cardClass = darkMode ? "bg-[#1e293b] border-white/5" : "bg-white border-gray-100";
    const textClass = darkMode ? "text-white" : "text-gray-900";

    return (
        <div className={`min-h-screen p-6 lg:p-10 ${bgClass}`}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20">
                        <PlaySquare className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-start">
                        <h1 className={`text-2xl font-black ${textClass} tracking-tight uppercase`}>
                            {language === 'ar' ? 'إدارة فيديوهات المكتبة' : 'Library Video Management'}
                        </h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest opacity-60">
                            {language === 'ar' ? `لديك ${videos.length} فيديو في المكتبة` : `You have ${videos.length} videos in library`}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    {language === 'ar' ? 'إضافة فيديو جديد' : 'Upload New Video'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: language === 'ar' ? 'إجمالي الفيديوهات' : 'Total Videos', val: videos.length, icon: <Film className="text-primary" />, bg: 'bg-primary/10' },
                    { label: language === 'ar' ? 'تعليمية' : 'Educational', val: videos.filter(v => v.category === 'educational').length, icon: <Play className="text-blue-500" />, bg: 'bg-blue-500/10' },
                    { label: language === 'ar' ? 'المتدربين' : 'Trainees', val: videos.filter(v => v.category === 'trainees').length, icon: <Eye className="text-emerald-500" />, bg: 'bg-emerald-500/10' },
                    { label: language === 'ar' ? 'المدربين' : 'Trainers', val: videos.filter(v => v.category === 'trainers').length, icon: <UserCheck className="text-orange-500" />, bg: 'bg-orange-500/10' },
                ].map((stat, i) => (
                    <div key={i} className={`${cardClass} p-6 rounded-[2rem] border shadow-sm flex items-center gap-5 group hover:shadow-xl transition-all`}>
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div className="text-start">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</span>
                            <div className={`text-2xl font-black ${textClass}`}>{stat.val}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Search */}
            <div className={`${cardClass} p-4 rounded-[2rem] border mb-8 flex flex-col md:flex-row gap-4 items-center`}>
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'ابحث باسم الفيديو...' : 'Search by video title...'}
                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold textClass outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['all', ...categories.map(c => c.id)].map(catId => (
                        <button 
                            key={catId}
                            onClick={() => setFilterCategory(catId)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                filterCategory === catId 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : `bg-gray-50 dark:bg-white/5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:bg-primary/10 hover:text-primary`
                            }`}
                        >
                            {catId === 'all' ? (language === 'ar' ? 'الكل' : 'All') : categories.find(c => c.id === catId)?.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredVideos.map((video, idx) => (
                        <motion.div 
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`${cardClass} rounded-[2.5rem] border overflow-hidden group hover:shadow-2xl transition-all relative`}
                        >
                            {/* Thumbnail Overlay with Actions */}
                            <div className="relative aspect-video overflow-hidden">
                                <img src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button 
                                        onClick={() => openEdit(video)}
                                        className="w-12 h-12 bg-white text-primary rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(video.id)}
                                        className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/20">
                                    <Clock className="w-3 h-3 text-white" />
                                    <span className="text-white text-[10px] font-black">{video.duration || '00:00'}</span>
                                </div>
                                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                                        <span className="text-white text-[9px] font-black uppercase tracking-widest">
                                            {categories.find(c => c.id === video.category)?.label}
                                        </span>
                                    </div>
                                    {video.sportId && (
                                        <div className="bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                                            <span className="text-white text-[9px] font-black uppercase tracking-widest">
                                                {sports.find(s => s.id === video.sportId)?.name || video.sportId}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 text-start">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className={`text-base font-black ${textClass} mb-1 line-clamp-1 truncate`}>
                                            {getText(video.title)}
                                        </h3>
                                        <p className="text-[10px] font-bold text-gray-400 line-clamp-2 min-h-[30px]">
                                            {getText(video.description)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 p-1.5 rounded-lg">
                                        {video.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-[10px] font-black text-gray-400">{video.views || 0}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">{video.status}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal - Add / Edit Video */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={`${cardClass} w-full max-w-4xl p-8 rounded-[3rem] border shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4 text-start">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20">
                                        {editingVideo ? <Edit2 className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
                                    </div>
                                    <div>
                                        <h2 className={`text-xl font-black ${textClass} tracking-tight`}>
                                            {editingVideo 
                                                ? (language === 'ar' ? 'تعديل الفيديو' : 'Edit Video Content') 
                                                : (language === 'ar' ? 'إضافة فيديو جديد' : 'Upload New Content')}
                                        </h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                            {language === 'ar' ? 'أدخل تفاصيل الفيديو والمحتوى' : 'Enter video details and metadata'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Language Toggle */}
                                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                                        <button 
                                            type="button"
                                            onClick={() => setFormLang('ar')}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formLang === 'ar' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:text-primary'}`}
                                        >
                                            عربي
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setFormLang('en')}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formLang === 'en' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:text-primary'}`}
                                        >
                                            EN
                                        </button>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl hover:text-rose-500 transition-colors">
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Current language indicator */}
                            <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20">
                                <Languages className="w-4 h-4 text-primary" />
                                <span className="text-xs font-black text-primary">
                                    {formLang === 'ar' ? 'أنت تكتب الآن باللغة العربية' : 'You are now typing in English'}
                                </span>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8 text-start">
                                    {/* Title (toggleable) */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                            {formLang === 'ar' ? 'عنوان الفيديو (عربي)' : 'Video Title (English)'}
                                        </label>
                                        <input 
                                            required={formLang === 'ar'}
                                            dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.25rem] py-4 px-6 text-sm font-bold textClass outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner"
                                            value={formData.title[formLang]}
                                            onChange={(e) => setFormData({...formData, title: {...formData.title, [formLang]: e.target.value}})}
                                            placeholder={formLang === 'ar' ? 'أدخل العنوان بالعربية' : 'Enter title in English'}
                                        />
                                    </div>
                                    {/* Description (toggleable) */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                            {formLang === 'ar' ? 'وصف الفيديو (عربي)' : 'Video Description (English)'}
                                        </label>
                                        <textarea 
                                            required={formLang === 'ar'}
                                            rows={3}
                                            dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.25rem] py-4 px-6 text-sm font-bold textClass outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner resize-none"
                                            value={formData.description[formLang]}
                                            onChange={(e) => setFormData({...formData, description: {...formData.description, [formLang]: e.target.value}})}
                                            placeholder={formLang === 'ar' ? 'أدخل الوصف بالعربية' : 'Enter description in English'}
                                        />
                                    </div>
                                    {/* Category & Sport */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                        <select 
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.25rem] py-4 px-6 text-sm font-bold textClass outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner"
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{language === 'ar' ? 'الرياضة التابعة لها' : 'Related Sport'}</label>
                                        <select 
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.25rem] py-4 px-6 text-sm font-bold textClass outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner"
                                            value={formData.sportId || ''}
                                            onChange={(e) => setFormData({...formData, sportId: e.target.value})}
                                        >
                                            <option value="">{language === 'ar' ? 'عام (لا تنتمي لرياضة معينة)' : 'General (Not related to a specific sport)'}</option>
                                            {sports.map(s => <option key={s.id} value={s.id}>{s.name || s.id}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status</label>
                                        <select 
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.25rem] py-4 px-6 text-sm font-bold textClass outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner"
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    {/* Video URL & Duration */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Video Source (Embed Link or URL)</label>
                                        <input 
                                            required
                                            placeholder="https://youtube.com/embed/..."
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.25rem] py-4 px-6 text-sm font-bold textClass outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner"
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Duration (e.g., 12:45)</label>
                                        <input 
                                            required
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.25rem] py-4 px-6 text-sm font-bold textClass outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Thumbnail selection */}
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 text-start">Thumbnail Image</label>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1">
                                            <ImageUpload 
                                                onUploadComplete={(url) => setFormData({...formData, thumbnailUrl: url})}
                                                currentImage={formData.thumbnailUrl}
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex flex-col justify-center gap-4 text-start">
                                            <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <AlertCircle className="w-5 h-5 text-primary" />
                                                    <span className="text-xs font-black uppercase textClass">{language === 'ar' ? 'تعليمات' : 'Instructions'}</span>
                                                </div>
                                                <p className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase tracking-wider">
                                                    {language === 'ar' 
                                                        ? 'يمكنك رفع صورة مباشرة أو وضع رابط خارجي (مثل imgbb). للحصول على أفضل النتائج، استخدم صورة بنسبة 16:9.' 
                                                        : 'You can either upload a file or provide an external link (like imgbb). For best results, use a 16:9 aspect ratio image.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-50 dark:border-white/5">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                {editingVideo ? (language === 'ar' ? 'حفظ التعديلات' : 'Commit Changes') : (language === 'ar' ? 'نشر الفيديو' : 'Publish Content')}
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500"
                                    >
                                        {language === 'ar' ? 'إلغاء' : 'Discard'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
