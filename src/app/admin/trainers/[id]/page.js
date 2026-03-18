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
    Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "../../components/ImageUpload";

export default function EditTrainerPage({ params }) {
    const { id } = React.use(params);
    const { language, setAlert } = useApp();
    const router = useRouter();
    const isNew = id === 'new';
    
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);

    // Form data matching the trainer schema
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        image: '',
        coverImage: '',
        bio: '',
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
        schedule: ''
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
                    setFormData({ 
                        ...formData, 
                        ...data,
                        achievements: data.achievements || [],
                        certificates: data.certificates || [],
                        expertise: data.expertise || [],
                        schedule: data.schedule || ''
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
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleListChange = (field, index, value) => {
        const newList = [...formData[field]];
        newList[index] = value;
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    const addListItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeListItem = (field, index) => {
        const newList = [...formData[field]];
        newList.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.specialty.trim()) {
            setAlert({
                title: language === 'ar' ? 'تنبيه' : 'Warning',
                message: language === 'ar' ? 'يرجى إدخال اسم المدرب والتخصص على الأقل.' : 'Please provide at least a name and specialty.',
                type: 'warning'
            });
            return;
        }

        setIsSaving(true);
        try {
            const trainerData = {
                ...formData,
                experience: Number(formData.experience) || 0,
                rating: Number(formData.rating) || 5.0,
                price: Number(formData.price) || 0,
                updatedAt: serverTimestamp()
            };

            if (isNew) {
                trainerData.createdAt = serverTimestamp();
                await addDoc(collection(db, "trainers"), trainerData);
                setAlert({
                    title: language === 'ar' ? 'تمت الإضافة بنجاح' : 'Added Successfully',
                    message: language === 'ar' ? 'تم إضافة بيانات المدرب بنجاح والآن هو متاح في النظام.' : 'Trainer data has been added and is now live.',
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
            console.error("Error saving trainer:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'حدث خطأ أثناء حفظ التعديلات.' : 'Error saving changes.',
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

                        {/* Direct URL Inputs (Optional Fallback) */}
                        <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block px-2">
                                    {language === 'ar' ? 'رابط الصورة (اختياري)' : 'Image URL (Optional)'}
                                </label>
                                <input 
                                    type="url" 
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white font-bold outline-none focus:border-amber-500 transition-all text-left"
                                    dir="ltr"
                                />
                            </div>
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
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder={language === 'ar' ? 'مثال: أحمد عبدلله' : 'e.g., John Doe'}
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
                                            value={formData.specialty}
                                            onChange={handleChange}
                                            placeholder={language === 'ar' ? 'مثال: لياقة بدنية أو كمال أجسام' : 'e.g., Fitness & Bodybuilding'}
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
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder={language === 'ar' ? 'اكتب نبذة عن المدرب ومؤهلاته وتجربته...' : 'Write about the trainer, their qualifications, and experience...'}
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
                                <div className="space-y-3">
                                    {formData.expertise.map((item, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleListChange('expertise', index, e.target.value)}
                                                placeholder={language === 'ar' ? 'مثال: ملاكمة، كيك بوكسينغ' : 'e.g. Boxing, Kickboxing'}
                                                className="flex-grow bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2 px-4 text-sm font-bold dark:text-white outline-none focus:border-amber-500 transition-all"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeListItem('expertise', index)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={() => addListItem('expertise')}
                                        className="w-full py-2 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-500 hover:text-amber-500 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        {language === 'ar' ? 'إضافة مجال خبرة' : 'Add Expertise'}
                                    </button>
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
                                                value={item}
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
                                                value={item}
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
                                    value={formData.schedule}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder={language === 'ar' ? 'مثال: الأحد - الخميس (4م - 10م)' : 'e.g. Sun - Thu (4PM - 10PM)'}
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
