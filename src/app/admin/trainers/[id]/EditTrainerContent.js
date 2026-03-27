"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { 
    User, 
    Link as LinkIcon, 
    MapPin, 
    Save, 
    ArrowLeft,
    CheckCircle2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Camera,
    Dumbbell,
    Award,
    Star,
    AtSign,
    DollarSign,
    Check,
    X,
    FileText,
    Image as ImageIcon,
    Plus,
    Trash2,
    Clock,
    Trophy,
    GraduationCap,
    Lightbulb,
    ChevronDown,
    Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "../../components/ImageUpload";

export default function EditTrainerContent({ params }) {
    const { id } = params;
    const { language, setAlert, sports, getText } = useApp();
    const router = useRouter();
    const isNew = id === 'new';
    
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);

    const [activeLang, setActiveLang] = useState('ar'); // Local state for the form editor

    // Form data matching the trainer schema with multilingual support
    const [formData, setFormData] = useState({
        name: { ar: '', en: '' },
        specialty: { ar: '', en: '' },
        image: '',
        coverImage: '',
        bio: { ar: '', en: '' },
        experience: '1',
        rating: '5.0',
        price: '0',
        location: '',
        status: 'active',
        verified: false,
        email: '',
        phone: '',
        achievements: [],
        certificates: [],
        expertise: [],
        schedule: { ar: '', en: '' }
    });

    useEffect(() => {
        const fetchTrainerData = async () => {
            if (isNew) return;
            setIsLoading(true);
            try {
                const docRef = doc(db, "trainers", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Helper to normalize strings to {ar, en} objects for backward compatibility
                    const normalizeText = (val) => {
                        if (typeof val === 'object' && val !== null) return val;
                        return { ar: val || '', en: val || '' };
                    };

                    // Helper for arrays
                    const normalizeArray = (arr) => {
                        if (!arr) return [];
                        return arr.map(item => {
                            if (typeof item === 'object' && item !== null) return item;
                            return { ar: item || '', en: item || '' };
                        });
                    };

                    setFormData({ 
                        ...formData, 
                        ...data,
                        name: normalizeText(data.name),
                        specialty: normalizeText(data.specialty),
                        bio: normalizeText(data.bio),
                        schedule: normalizeText(data.schedule),
                        achievements: normalizeArray(data.achievements),
                        certificates: normalizeArray(data.certificates),
                        expertise: normalizeArray(data.expertise)
                    });
                } else {
                    setAlert({
                        title: language === 'ar' ? 'خطأ' : 'Error',
                        message: language === 'ar' ? 'المدرب غير موجود' : 'Trainer not found',
                        type: 'error'
                    });
                    router.push('/admin/trainers');
                }
            } catch (error) {
                console.error("Error fetching trainer data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrainerData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle translatable text fields
        if (['name', 'specialty', 'bio', 'schedule'].includes(name)) {
            setFormData(prev => ({ 
                ...prev, 
                [name]: {
                    ...prev[name],
                    [activeLang]: value
                }
            }));
            return;
        }

        // Handle normal fields
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleListChange = (field, index, value) => {
        const newList = [...formData[field]];
        newList[index] = {
            ...newList[index],
            [activeLang]: value
        };
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    const addListItem = (field, customItem) => {
        const newItem = customItem || { ar: '', en: '' };
        setFormData(prev => ({ 
            ...prev, 
            [field]: [...prev[field], newItem] 
        }));
    };

    const removeListItem = (field, index) => {
        setFormData(prev => {
            const newList = [...prev[field]];
            newList.splice(index, 1);
            return { ...prev, [field]: newList };
        });
    };

    const toggleSportExpertise = (sport) => {
        // Use a functional update to ensure we're working with the very latest state
        // This prevents data loss when adding multiple items quickly or from stale closures
        setFormData(prev => {
            const expertise = [...prev.expertise];
            const sportNameAr = sport.name_ar || (sport.name && sport.name.ar) || '';
            const sportNameEn = sport.name_en || (sport.name && sport.name.en) || '';
            const sportId = sport.id || sport.slug || '';

            if (!sportId) return prev; // Cannot add a sport without a valid identifier

            // Check if already exists by ID
            const index = expertise.findIndex(item => item.id === sportId);

            if (index > -1) {
                // Remove if already exists (toggle off)
                expertise.splice(index, 1);
            } else {
                // Add new structured object
                expertise.push({
                    id: sportId,
                    ar: sportNameAr,
                    en: sportNameEn
                });
            }
            return { ...prev, expertise };
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        const currentName = formData.name.ar || formData.name.en;
        const currentSpecialty = formData.specialty.ar || formData.specialty.en;

        if (!currentName.trim() || !currentSpecialty.trim()) {
            setAlert({
                title: language === 'ar' ? 'تنبيه' : 'Warning',
                message: language === 'ar' ? 'يرجى إدخال اسم المدرب والتخصص (بالعربية على الأقل).' : 'Please provide at least an Arabic name and specialty.',
                type: 'warning'
            });
            return;
        }

        setIsSaving(true);
        try {
            // 1. Recursive cleanup function for nested objects/arrays
            const cleanData = (obj) => {
                if (Array.isArray(obj)) {
                    return obj
                        .map(item => (typeof item === 'object' && item !== null ? cleanData(item) : item))
                        .filter(item => item !== undefined);
                }
                if (typeof obj === 'object' && obj !== null) {
                    const newObj = {};
                    Object.keys(obj).forEach(key => {
                        if (obj[key] !== undefined) {
                            newObj[key] = cleanData(obj[key]);
                        }
                    });
                    return newObj;
                }
                return obj;
            };

            // 2. Prepare data, separating the internal state 'id' from firestore data
            const { id: _ignoreId, ...rest } = formData;
            
            // 3. Apply base transformations
            const trainerDataRaw = {
                ...rest,
                experience: Number(formData.experience) || 0,
                rating: Number(formData.rating) || 5.0,
                price: Number(formData.price) || 0,
                updatedAt: serverTimestamp()
            };

            // 4. Perform the deep cleanup to remove any potential 'undefined'
            const trainerData = cleanData(trainerDataRaw);

            if (isNew) {
                trainerData.createdAt = serverTimestamp();
                await addDoc(collection(db, "trainers"), trainerData);
                setAlert({
                    title: language === 'ar' ? 'تمت الإضافة بنجاح' : 'Added Successfully',
                    message: language === 'ar' ? 'تم إضافة بيانات المدرب بنجاح.' : 'Trainer data has been added.',
                    type: 'success'
                });
            } else {
                const docRef = doc(db, "trainers", id);
                await updateDoc(docRef, trainerData);
                setAlert({
                    title: language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved Successfully',
                    message: language === 'ar' ? 'تم تحديث بيانات المدرب بنجاح.' : 'Trainer data has been updated.',
                    type: 'success'
                });
            }
            
            router.push('/admin/trainers');
        } catch (error) {
            console.error("Error saving trainer profile:", error);
            // Specific error messages for permission vs generic
            const isPermissionError = error.code === 'permission-denied';
            setAlert({
                title: language === 'ar' ? 'فشل الحفظ' : 'Saving Failed',
                message: isPermissionError 
                    ? (language === 'ar' ? 'ليس لديك الصلاحيات الكافية لحفظ هذا التعديل.' : 'You do not have enough permissions.')
                    : (language === 'ar' ? `حدث خطأ: ${error.message}` : `Error occurred: ${error.message}`),
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* Header section w/ Back Button */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/admin/trainers')}
                        className="p-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-gray-500 hover:text-amber-500 dark:text-gray-400 group shadow-sm"
                    >
                        {language === 'ar' ? <ChevronRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                            {isNew ? (language === 'ar' ? 'إضافة مدرب جديد' : 'Add New Trainer') : (language === 'ar' ? 'تعديل بيانات المدرب' : 'Edit Trainer Profile')}
                        </h1>
                        <p className="text-sm font-bold text-gray-500 mt-1">
                            {language === 'ar' ? 'قم بإدارة كافة تفاصيل المدرب كالملف الشخصي، التخصصات، والصور.' : 'Manage all trainer details including profile, specialties, and media.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Language Toggle */}
            <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-2">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col items-center">
                    <button
                        type="button"
                        onClick={() => setActiveLang('ar')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all ${activeLang === 'ar' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                        AR
                    </button>
                    <div className="w-8 h-px bg-gray-100 dark:bg-white/10 my-1"></div>
                    <button
                        type="button"
                        onClick={() => setActiveLang('en')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all ${activeLang === 'en' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                        EN
                    </button>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-center shadow-lg ${activeLang === 'ar' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {activeLang === 'ar' ? 'تعديل المحتوى العربي' : 'Editing English Context'}
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Form: Images & Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium space-y-6">
                        {/* Profile Image Upload */}
                        <ImageUpload 
                            value={formData.image}
                            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            label={language === 'ar' ? 'صورة العرض' : 'Profile Picture'}
                            folder="trainers/profiles"
                            shape="circle"
                        />

                        {/* Cover Image Upload */}
                        <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                            <ImageUpload 
                                value={formData.coverImage}
                                onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                                label={language === 'ar' ? 'صورة الغلاف' : 'Cover Image'}
                                folder="trainers/covers"
                                shape="rectangle"
                            />
                        </div>



                        {/* Status Config */}
                        <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block px-1">
                                    {language === 'ar' ? 'حالة التفعيل' : 'Activation Status'}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'status', value: 'active' } })}
                                        className={`flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all border ${
                                            formData.status === 'active' 
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 cursor-default' 
                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {language === 'ar' ? 'نشط (متاح)' : 'Active'}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'status', value: 'inactive' } })}
                                        className={`flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all border ${
                                            formData.status === 'inactive' 
                                            ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 cursor-default' 
                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        <X className="w-3.5 h-3.5" />
                                        {language === 'ar' ? 'مخفي (معطل)' : 'Inactive'}
                                    </button>
                                </div>
                            </div>
                            
                            <label className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.verified ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30' : 'bg-gray-50 border-gray-100 dark:bg-white/5 dark:border-white/10 hover:border-amber-200'}`}>
                                <div className="flex items-center h-5 mt-0.5">
                                    <input 
                                        type="checkbox" 
                                        name="verified"
                                        checked={formData.verified}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 outline-none cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-black flex items-center gap-1.5 ${formData.verified ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <Award className="w-4 h-4" />
                                        {language === 'ar' ? 'مدرب موثق ومعتمد' : 'Verified Trainer'}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1">
                                        {language === 'ar' ? 'سيظهر علامة توثيق زرقاء بجانب إسمه' : 'Will display a verification badge.'}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Form: Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium space-y-6">
                        
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 border-b border-gray-100 dark:border-white/10 pb-2 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                        {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name[activeLang]}
                                            onChange={handleChange}
                                            placeholder={activeLang === 'ar' ? 'مثال: أحمد عبدلله' : 'e.g., John Doe'}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 pr-12 pl-4 text-slate-900 dark:text-white font-bold placeholder-gray-400 focus:border-amber-500 focus:bg-white transition-all outline-none md:text-sm text-base"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                        {language === 'ar' ? 'التخصص الرياضي *' : 'Specialty *'}
                                    </label>
                                    <div className="relative group">
                                        <Dumbbell className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                                        <input 
                                            type="text" 
                                            name="specialty"
                                            value={formData.specialty[activeLang]}
                                            onChange={handleChange}
                                            placeholder={activeLang === 'ar' ? 'مثال: لياقة بدنية أو كمال أجسام' : 'e.g., Fitness & Bodybuilding'}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 pr-12 pl-4 text-slate-900 dark:text-white font-bold placeholder-gray-400 focus:border-amber-500 focus:bg-white transition-all outline-none md:text-sm text-base"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 border-b border-gray-100 dark:border-white/10 pb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {language === 'ar' ? 'تفاصيل الخبرة والأسعار' : 'Experience & Pricing Details'}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                        {language === 'ar' ? 'سنوات الخبرة' : 'Years Experience'}
                                    </label>
                                    <div className="relative group flex items-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus-within:border-amber-500 focus-within:bg-white transition-all">
                                        <input 
                                            type="number" 
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="w-full bg-transparent py-3 px-4 text-slate-900 dark:text-white font-bold text-center outline-none md:text-sm text-base"
                                            dir="ltr"
                                            min="0"
                                        />
                                        <span className="text-xs font-bold text-gray-400 ml-4 absolute left-4">{language === 'ar' ? 'سنين' : 'Years'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                        {language === 'ar' ? 'التقييم العام' : 'Rating'}
                                    </label>
                                    <div className="relative group flex items-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus-within:border-amber-500 focus-within:bg-white transition-all">
                                        <input 
                                            type="number" 
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleChange}
                                            step="0.1" max="5.0" min="0"
                                            className="w-full bg-transparent py-3 px-4 text-slate-900 dark:text-white font-bold text-center outline-none md:text-sm text-base"
                                            dir="ltr"
                                        />
                                        <Star className="w-4 h-4 text-amber-500 absolute left-4 fill-amber-500" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                        {language === 'ar' ? 'سعر الجلسة / التدريب' : 'Session Price'}
                                    </label>
                                    <div className="relative group flex items-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus-within:border-amber-500 focus-within:bg-white transition-all">
                                        <input 
                                            type="number" 
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full bg-transparent py-3 px-4 text-slate-900 dark:text-white font-bold outline-none text-left md:text-sm text-base pl-12"
                                            dir="ltr"
                                            min="0"
                                        />
                                        <span className="text-xs font-black text-amber-600 absolute left-4">SAR</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                    {language === 'ar' ? 'نبذة تعريفية (Bio)' : 'Biography / Description'}
                                </label>
                                <textarea 
                                    name="bio"
                                    value={formData.bio[activeLang]}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder={activeLang === 'ar' ? 'اكتب نبذة عن المدرب ومؤهلاته وتجربته...' : 'Write about the trainer, their qualifications, and experience...'}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-slate-900 dark:text-white font-bold placeholder-gray-400 focus:border-amber-500 focus:bg-white transition-all outline-none resize-none md:text-sm text-base"
                                ></textarea>
                            </div>
                        </div>

                        {/* Professional Details Section */}
                        <div className="space-y-6 pt-2">
                             {/* Expertise Areas */}
                             <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 border-b border-gray-100 dark:border-white/10 pb-2 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    {language === 'ar' ? 'مجالات الخبرة / الرياضات' : 'Areas of Expertise / Sports'}
                                </h3>
                                
                                <div className="space-y-4">
                                    {/* Sports Selection From Database */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                                            {language === 'ar' ? 'اختر من الرياضات المتوفرة' : 'Select From Available Sports'}
                                        </p>
                                         <div className="relative group">
                                            <select 
                                                onChange={(e) => {
                                                    const selectedSport = sports.find(s => s.id === e.target.value);
                                                    if (selectedSport) toggleSportExpertise(selectedSport);
                                                    e.target.value = ""; // Reset to default placeholder
                                                }}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-slate-900 dark:text-white font-bold focus:border-amber-500 focus:bg-white transition-all outline-none md:text-sm text-base appearance-none cursor-pointer pr-10"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>{language === 'ar' ? 'اختر رياضة لإضافتها...' : 'Select a sport to add...'}</option>
                                                {sports.filter(s => !formData.expertise.some(item => item.id === s.id)).map(sport => (
                                                    <option key={sport.id} value={sport.id}>
                                                        {getText(sport.name)}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-amber-500 transition-colors`}>
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                         </div>
                                         {/* Selected Sports Chips */}
                                         <div className="flex flex-wrap gap-2 mt-3">
                                             {formData.expertise.filter(item => item.id).map((item) => (
                                                 <div 
                                                    key={item.id} 
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 animate-in fade-in zoom-in"
                                                 >
                                                     <Target className="w-3.5 h-3.5" />
                                                     <span>{getText(item)}</span>
                                                     <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            const idx = formData.expertise.findIndex(e => e.id === item.id);
                                                            removeListItem('expertise', idx);
                                                        }}
                                                        className="p-0.5 hover:bg-white/20 rounded-md transition-all ms-1"
                                                     >
                                                         <X className="w-3 h-3" />
                                                     </button>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>

                                     {/* Custom Expertise (Manual Entry) */}
                                     <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                                         <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                                             {language === 'ar' ? 'خبرات / شهادات إضافية مخصصة' : 'Additional Custom Expertise / Certs'}
                                         </p>
                                         <div className="flex gap-2">
                                             <div className="relative group flex-grow">
                                                 <input 
                                                     type="text" 
                                                     id="customExpertiseInput"
                                                     placeholder={language === 'ar' ? 'أدخل خبرة مخصصة...' : 'Enter custom expertise...'}
                                                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-slate-900 dark:text-white font-bold focus:border-amber-500 focus:bg-white transition-all outline-none md:text-sm text-base pl-10"
                                                     onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = e.target.value.trim();
                                                            if (val) {
                                                                addListItem('expertise', { ar: val, en: val });
                                                                e.target.value = '';
                                                            }
                                                        }
                                                     }}
                                                 />
                                                 <div className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 opacity-40 text-gray-400`}>
                                                    <Plus className="w-4 h-4" />
                                                 </div>
                                             </div>
                                             <button 
                                                 type="button"
                                                 onClick={() => {
                                                     const input = document.getElementById('customExpertiseInput');
                                                     const val = input.value.trim();
                                                     if (val) {
                                                         addListItem('expertise', { ar: val, en: val });
                                                         input.value = '';
                                                     }
                                                 }}
                                                 className="px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-premium"
                                             >
                                                 {language === 'ar' ? 'إضافة' : 'Add'}
                                             </button>
                                         </div>

                                         <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                             {formData.expertise.filter(item => !item.id).map((item, index) => (
                                                 <div key={index} className="flex gap-2 group animate-in slide-in-from-right-2 duration-300">
                                                     <div className="flex-grow bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2 px-4 text-sm font-bold dark:text-white flex items-center justify-between">
                                                         <span>{item[language] || item.ar || item.en}</span>
                                                     </div>
                                                     <button 
                                                         type="button"
                                                         onClick={() => {
                                                            const actualIndex = formData.expertise.indexOf(item);
                                                            removeListItem('expertise', actualIndex);
                                                         }}
                                                         className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all opacity-40 group-hover:opacity-100"
                                                     >
                                                         <Trash2 className="w-4 h-4" />
                                                     </button>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* Achievements */}
                             <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 border-b border-gray-100 dark:border-white/10 pb-2 flex items-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    {language === 'ar' ? 'الإنجازات والبطولات' : 'Achievements & Titles'}
                                </h3>
                                <div className="space-y-3">
                                    {formData.achievements.map((item, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={item[activeLang]}
                                                onChange={(e) => handleListChange('achievements', index, e.target.value)}
                                                className="flex-grow bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2 px-4 text-sm font-bold dark:text-white outline-none focus:border-amber-500 transition-all"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeListItem('achievements', index)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={() => addListItem('achievements')}
                                        className="w-full py-2 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-500 hover:text-amber-500 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        {language === 'ar' ? 'إضافة إنجاز' : 'Add Achievement'}
                                    </button>
                                </div>
                            </div>

                            {/* Certificates */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 border-b border-gray-100 dark:border-white/10 pb-2 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    {language === 'ar' ? 'الشهادات والمؤهلات' : 'Certificates & Qualifications'}
                                </h3>
                                <div className="space-y-3">
                                    {formData.certificates.map((item, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={item[activeLang]}
                                                onChange={(e) => handleListChange('certificates', index, e.target.value)}
                                                className="flex-grow bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2 px-4 text-sm font-bold dark:text-white outline-none focus:border-amber-500 transition-all"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeListItem('certificates', index)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={() => addListItem('certificates')}
                                        className="w-full py-2 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-500 hover:text-amber-500 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        {language === 'ar' ? 'إضافة شهادة' : 'Add Certificate'}
                                    </button>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 border-b border-gray-100 dark:border-white/10 pb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {language === 'ar' ? 'جدول المواعيد' : 'Appointment Schedule'}
                                </h3>
                                <textarea 
                                    name="schedule"
                                    value={formData.schedule[activeLang]}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder={activeLang === 'ar' ? 'مثال: الأحد - الخميس (4م - 10م)' : 'e.g. Sun - Thu (4PM - 10PM)'}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-slate-900 dark:text-white font-bold placeholder-gray-400 focus:border-amber-500 focus:bg-white transition-all outline-none resize-none md:text-sm text-base"
                                ></textarea>
                            </div>
                        </div>

                    </div>
                    
                    {/* Floating Submit Area */}
                    <div className="flex justify-end pt-4">
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSaving}
                            className="w-full sm:w-auto px-10 bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/30 transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="w-6 h-6 animate-spin text-white/70" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{isNew ? (language === 'ar' ? 'نشر ملف المدرب' : 'Publish Trainer Profile') : (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </form>
        </div>
    );
}
