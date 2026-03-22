"use client";
import React, { useState, useEffect } from 'react';
import { 
    Save, ArrowLeft, Image as ImageIcon, Video, 
    Plus, Trash2, Layout, Info, Award, Clock,
    CheckCircle2, Languages, Film, Play,
    ChevronLeft, ChevronRight, XCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '../../components/ImageUpload';
import Link from 'next/link';

export default function AdminSportEdit({ params }) {
    const { language, darkMode, setAlert } = useApp();
    const router = useRouter();
    const sportId = params.id;
    const isNew = sportId === 'new';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formLang, setFormLang] = useState('ar');
    const [tab, setTab] = useState('basic'); // basic, gallery, videos, details

    const [formData, setFormData] = useState({
        id: '',
        name: { ar: '', en: '' },
        description: { ar: '', en: '' },
        image: '',
        heroImg: '',
        gallery: [],
        videos: [],
        stats: {
            intensity: 'High',
            duration: '60 min',
            equipment: { ar: '', en: '' },
            age: 'All ages'
        },
        benefits: [],
        status: 'active'
    });

    useEffect(() => {
        if (!isNew) {
            fetchSport();
        } else {
            setLoading(false);
        }
    }, [sportId]);

    const fetchSport = async () => {
        try {
            const docRef = doc(db, "sports", sportId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    ...formData,
                    ...data,
                    name: normalizeField(data.name),
                    description: normalizeField(data.description),
                    benefits: (data.benefits || []).map(b => normalizeField(b)),
                    stats: {
                        ...formData.stats,
                        ...data.stats,
                        equipment: normalizeField(data.stats?.equipment)
                    }
                });
            } else {
                setAlert({ type: 'error', message: 'Sport not found' });
                router.push('/admin/sports');
            }
        } catch (error) {
            console.error("Error fetching sport:", error);
        } finally {
            setLoading(false);
        }
    };

    const normalizeField = (val) => {
        if (typeof val === 'object' && val !== null) return { ar: val.ar || '', en: val.en || '' };
        return { ar: val || '', en: val || '' };
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!formData.id && isNew) {
            setAlert({ type: 'error', message: 'ID is required' });
            return;
        }

        setSaving(true);
        try {
            const docId = isNew ? formData.id.toLowerCase() : sportId;
            const finalData = {
                ...formData,
                id: docId,
                updatedAt: serverTimestamp()
            };
            if (isNew) {
                finalData.createdAt = serverTimestamp();
            }

            await setDoc(doc(db, "sports", docId), finalData);
            setAlert({ type: 'success', message: language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully' });
            if (isNew) router.push('/admin/sports');
        } catch (error) {
            console.error("Error saving sport:", error);
            setAlert({ type: 'error', message: 'Error saving' });
        } finally {
            setSaving(false);
        }
    };

    const addGalleryItem = (url) => {
        if (formData.gallery.includes(url)) return;
        setFormData({ ...formData, gallery: [...formData.gallery, url] });
    };

    const removeGalleryItem = (index) => {
        const newGallery = [...formData.gallery];
        newGallery.splice(index, 1);
        setFormData({ ...formData, gallery: newGallery });
    };

    const addVideo = () => {
        setFormData({
            ...formData,
            videos: [
                ...formData.videos,
                { 
                    title: { ar: '', en: '' }, 
                    url: '', 
                    thumbnail: '',
                    id: Date.now()
                }
            ]
        });
    };

    const removeVideo = (index) => {
        const newVideos = [...formData.videos];
        newVideos.splice(index, 1);
        setFormData({ ...formData, videos: newVideos });
    };

    const updateVideoField = (index, field, value, subLang = null) => {
        const newVideos = [...formData.videos];
        if (subLang) {
            newVideos[index][field][subLang] = value;
        } else {
            newVideos[index][field] = value;
        }
        setFormData({ ...formData, videos: newVideos });
    };

    const addBenefit = () => {
        setFormData({
            ...formData,
            benefits: [...formData.benefits, { ar: '', en: '' }]
        });
    };

    const removeBenefit = (index) => {
        const newBenefits = [...formData.benefits];
        newBenefits.splice(index, 1);
        setFormData({ ...formData, benefits: newBenefits });
    };

    const updateBenefit = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index][formLang] = value;
        setFormData({ ...formData, benefits: newBenefits });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    const inputClass = "w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.25rem] py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner";
    const labelClass = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-start block mb-2";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-5">
                    <button 
                        onClick={() => router.push('/admin/sports')}
                        className="w-12 h-12 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-primary transition-all hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft className={`w-6 h-6 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="text-start">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            {isNew ? (language === 'ar' ? 'إضافة رياضة جديدة' : 'Create New Sport') : (language === 'ar' ? 'تعديل الرياضة' : 'Edit Sport Profile')}
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                            {isNew ? 'Define a new athletic discipline' : `Editing ID: ${sportId}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10">
                        <button 
                            onClick={() => setFormLang('ar')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formLang === 'ar' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'}`}
                        >
                            عربي
                        </button>
                        <button 
                            onClick={() => setFormLang('en')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formLang === 'en' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'}`}
                        >
                            English
                        </button>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary hover:bg-primary-light text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 flex items-center gap-3"
                    >
                        {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {language === 'ar' ? 'حفظ البيانات' : 'Commit Changes'}
                    </button>
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex items-center gap-2 mb-8 px-4 py-3 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                <Languages className="w-5 h-5 text-primary" />
                <span className="text-xs font-black text-primary uppercase tracking-widest">
                    {formLang === 'ar' ? 'أنت تحرر الآن المحتوى باللغة العربية' : 'Editing content in English mode'}
                </span>
            </div>

            {/* Tabs */}
            <div className="flex bg-white dark:bg-white/5 p-2 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-x-auto no-scrollbar gap-2">
                {[
                    { id: 'basic', label: language === 'ar' ? 'المعلومات الأساسية' : 'Core Info', icon: Info },
                    { id: 'gallery', label: language === 'ar' ? 'معرض الصور' : 'Gallery', icon: ImageIcon },
                    { id: 'videos', label: language === 'ar' ? 'الفيديوهات' : 'Videos', icon: Video },
                    { id: 'details', label: language === 'ar' ? 'تفاصيل إضافية' : 'Advanced Details', icon: Layout }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                            tab === t.id 
                            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                            : 'text-gray-400 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <motion.div 
                key={tab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-white/5 rounded-[3rem] p-10 border border-gray-100 dark:border-white/10 shadow-premium"
            >
                {tab === 'basic' && (
                    <div className="grid md:grid-cols-2 gap-10 text-start">
                        {isNew && (
                            <div className="space-y-2">
                                <label className={labelClass}>Sport ID (Unique slug, e.g. boxing)</label>
                                <input 
                                    className={inputClass}
                                    value={formData.id}
                                    onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                                    placeholder="e.g. crossfit"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className={labelClass}>{formLang === 'ar' ? 'الاسم (عربي)' : 'Name (English)'}</label>
                            <input 
                                className={inputClass}
                                value={formData.name[formLang]}
                                onChange={(e) => setFormData({...formData, name: {...formData.name, [formLang]: e.target.value}})}
                                placeholder={formLang === 'ar' ? 'اسم الرياضة' : 'Sport Name'}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className={labelClass}>{formLang === 'ar' ? 'الوصف / النبذة' : 'Description / Bio'}</label>
                            <textarea 
                                rows={4}
                                className={inputClass + " resize-none"}
                                value={formData.description[formLang]}
                                onChange={(e) => setFormData({...formData, description: {...formData.description, [formLang]: e.target.value}})}
                                placeholder="Sport history, benefits, overview..."
                            />
                        </div>

                        <div className="space-y-6">
                            <label className={labelClass}>Main Thumbnail (List View)</label>
                            <ImageUpload 
                                onUploadComplete={(url) => setFormData({...formData, image: url})}
                                currentImage={formData.image}
                            />
                        </div>
                        <div className="space-y-6">
                            <label className={labelClass}>Hero Banner (Page Cover)</label>
                            <ImageUpload 
                                onUploadComplete={(url) => setFormData({...formData, heroImg: url})}
                                currentImage={formData.heroImg}
                            />
                        </div>
                    </div>
                )}

                {tab === 'gallery' && (
                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-start">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Sport Image Gallery</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Upload high quality photos for this sport</p>
                            </div>
                            <div className="w-full md:w-auto">
                                <ImageUpload onUploadComplete={addGalleryItem} label={language === 'ar' ? 'إضافة صورة' : 'Add Photo to Gallery'} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {formData.gallery.map((url, i) => (
                                <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-100 dark:border-white/5 shadow-premium">
                                    <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => removeGalleryItem(i)}
                                            className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'videos' && (
                    <div className="space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="text-start">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Sport Videos</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Add tutorials, highlights or educational clips</p>
                            </div>
                            <button 
                                onClick={addVideo}
                                className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20"
                            >
                                <Plus className="w-4 h-4" />
                                {language === 'ar' ? 'إضافة فيديو' : 'Add New Video'}
                            </button>
                        </div>

                        <div className="grid gap-6">
                            {formData.videos.map((video, i) => (
                                <div key={video.id || i} className="bg-gray-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 flex flex-col md:flex-row gap-8 relative group">
                                    <div className="w-full md:w-64 space-y-4">
                                        <label className={labelClass}>Video Thumbnail</label>
                                        <ImageUpload 
                                            onUploadComplete={(url) => updateVideoField(i, 'thumbnail', url)}
                                            currentImage={video.thumbnail}
                                        />
                                    </div>
                                    <div className="flex-grow grid md:grid-cols-2 gap-6 text-start">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className={labelClass}>{formLang === 'ar' ? 'عنوان الفيديو' : 'Video Title'}</label>
                                            <input 
                                                className={inputClass}
                                                value={video.title[formLang] || ''}
                                                onChange={(e) => updateVideoField(i, 'title', e.target.value, formLang)}
                                                placeholder="e.g. Boxing Stance 101"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className={labelClass}>URL / Embed ID</label>
                                            <input 
                                                className={inputClass}
                                                value={video.url}
                                                onChange={(e) => updateVideoField(i, 'url', e.target.value)}
                                                placeholder="https://youtube.com/embed/..."
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeVideo(i)}
                                        className="absolute top-6 right-6 w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'details' && (
                    <div className="grid md:grid-cols-1 gap-10 text-start">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary" />
                            Technical Specifications
                        </h3>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-4">
                                <label className={labelClass}>Intensity Level</label>
                                <select 
                                    className={inputClass}
                                    value={formData.stats.intensity}
                                    onChange={(e) => setFormData({...formData, stats: {...formData.stats, intensity: e.target.value}})}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="High">High</option>
                                    <option value="Extreme">Extreme</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className={labelClass}>Estimated Duration</label>
                                <input 
                                    className={inputClass}
                                    value={formData.stats.duration}
                                    onChange={(e) => setFormData({...formData, stats: {...formData.stats, duration: e.target.value}})}
                                    placeholder="e.g. 60 Min"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className={labelClass}>{formLang === 'ar' ? 'المعدات (لغة العرض)' : 'Equipment (Current Lang)'}</label>
                                <input 
                                    className={inputClass}
                                    value={formData.stats.equipment[formLang]}
                                    onChange={(e) => setFormData({...formData, stats: {...formData.stats, equipment: {...formData.stats.equipment, [formLang]: e.target.value}}})}
                                    placeholder="Gloves, Mat, etc."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className={labelClass}>Target Age</label>
                                <input 
                                    className={inputClass}
                                    value={formData.stats.age}
                                    onChange={(e) => setFormData({...formData, stats: {...formData.stats, age: e.target.value}})}
                                    placeholder="e.g. 15+"
                                />
                            </div>
                        </div>

                        <div className="space-y-6 mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Benefits & Results</h4>
                                <button 
                                    onClick={addBenefit}
                                    className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid gap-3">
                                {formData.benefits.map((benefit, i) => (
                                    <div key={i} className="flex gap-3">
                                        <input 
                                            className={inputClass}
                                            value={benefit[formLang]}
                                            onChange={(e) => updateBenefit(i, e.target.value)}
                                            placeholder={formLang === 'ar' ? 'أضف فائدة جديدة...' : 'Add a benefit...'}
                                        />
                                        <button 
                                            onClick={() => removeBenefit(i)}
                                            className="w-14 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all flex-shrink-0"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                {formData.benefits.length === 0 && (
                                    <p className="text-[10px] font-bold text-gray-400 italic">No benefits added yet. Click plus to add.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 mt-10">
                            <div className="flex items-center gap-4 mb-4">
                                <AlertCircle className="w-6 h-6 text-amber-500" />
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">System Notice</h4>
                            </div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                These details are displayed on the sport profile page in the technical summary section. 
                                Make sure to provide accurate info to help trainees choose the right sport for their level.
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
