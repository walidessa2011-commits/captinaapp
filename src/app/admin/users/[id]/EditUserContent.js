"use client";

import React, { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    Shield, 
    Save, 
    ChevronRight, 
    ChevronLeft,
    CheckCircle2, 
    Loader2, 
    ArrowLeft,
    ShieldAlert,
    Trash2,
    Lock,
    Users,
    Check,
    Languages
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from "../../components/ImageUpload";

export default function EditUserContent({ params }) {
    const { id } = params;
    const { language, setAlert } = useApp();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: { ar: '', en: '' },
        phone: '',
        role: 'user',
        email: '',
        photoURL: '',
        createdAt: ''
    });
    const [formLang, setFormLang] = useState(language);
    const [previewImage, setPreviewImage] = useState(null);

    // Normalize text to object { ar, en }
    const normalizeText = (text) => {
        if (!text) return { ar: '', en: '' };
        if (typeof text === 'object') return { ar: text.ar || '', en: text.en || '' };
        return { ar: text, en: text };
    };

    // Helper to get text based on current language
    const getText = (textObj) => {
        if (!textObj) return '';
        return textObj[language] || textObj['ar'] || textObj['en'] || '';
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", id));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFormData({
                        fullName: normalizeText(data.fullName),
                        phone: data.phone || '',
                        role: data.role || 'user',
                        email: data.email || '',
                        photoURL: data.photoURL || '',
                        createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toLocaleDateString() : (data.createdAt instanceof Date ? data.createdAt.toLocaleDateString() : (data.createdAt || 'N/A'))
                    });
                    setPreviewImage(data.photoURL || null);
                } else {
                    setAlert({
                        show: true,
                        message: language === 'ar' ? 'المستخدم غير موجود' : 'User not found',
                        type: 'error'
                    });
                    router.push('/admin/users');
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setAlert({
                    show: true,
                    message: language === 'ar' ? 'فشل تحميل بيانات المستخدم' : 'Failed to load user data',
                    type: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id, language, router, setAlert]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, photoURL: url }));
        setPreviewImage(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateDoc(doc(db, "users", id), {
                fullName: formData.fullName,
                phone: formData.phone,
                role: formData.role,
                photoURL: formData.photoURL,
                updatedAt: new Date()
            });
            setAlert({
                show: true,
                message: language === 'ar' ? 'تم تحديث بيانات المستخدم بنجاح' : 'User data updated successfully',
                type: 'success'
            });
            router.push('/admin/users');
        } catch (error) {
            console.error("Error updating user:", error);
            setAlert({
                show: true,
                message: language === 'ar' ? 'فشل تحديث البيانات' : 'Failed to update data',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const LangToggle = () => (
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-white/10 rounded-xl">
            <button 
                type="button"
                onClick={() => setFormLang('ar')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${formLang === 'ar' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
                العربية
            </button>
            <button 
                type="button"
                onClick={() => setFormLang('en')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${formLang === 'en' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
                English
            </button>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            {!isLoading && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 max-w-6xl mx-auto px-4"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => router.back()}
                                className="p-3 bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-primary rounded-2xl transition-all"
                            >
                                <ChevronLeft className={`w-6 h-6 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <User className="w-8 h-8 text-primary" />
                                    {language === 'ar' ? 'تعديل بيانات المستخدم' : 'Edit User Profile'}
                                </h1>
                                <p className="text-gray-500 font-bold text-sm mt-1">
                                    {language === 'ar' ? `تحديث معلومات الحساب لـ ${formData.email}` : `Update account information for ${formData.email}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Info Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-[#111827] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative group mb-6">
                                        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-white/10 border-4 border-white dark:border-white/10 shadow-2xl relative transition-transform group-hover:scale-105 duration-500">
                                            {previewImage ? (
                                                <img 
                                                    src={previewImage} 
                                                    alt="Avatar" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Users className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            {/* Status Badge */}
                                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-[#111827] rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white capitalize">
                                        {getText(formData.fullName) || (language === 'ar' ? 'مستخدم بدون اسم' : 'Unnamed User')}
                                    </h2>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mt-2
                                        ${formData.role === 'admin' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'}`}
                                    >
                                        <Shield className="w-3 h-3" />
                                        {formData.role === 'admin' ? (language === 'ar' ? 'مسؤول' : 'Admin') : (language === 'ar' ? 'مستخدم' : 'User')}
                                    </span>

                                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 w-full space-y-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-400 font-bold">{language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}</span>
                                            <span className="text-slate-900 dark:text-white font-black">{formData.createdAt}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-400 font-bold">{language === 'ar' ? 'معرف المستخدم' : 'User ID'}</span>
                                            <span className="text-slate-900 dark:text-white font-black opacity-50 tracking-widest">{id.slice(0, 8)}...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-primary/5 dark:bg-primary/10 rounded-[2rem] p-6 border border-primary/10 dark:border-primary/20">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary rounded-xl text-white">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-primary mb-1 uppercase tracking-wider">
                                            {language === 'ar' ? 'إجراءات محمية' : 'Protected Actions'}
                                        </h4>
                                        <p className="text-xs font-bold text-primary/60 leading-relaxed">
                                            {language === 'ar' ? 'لا يمكن تعديل البريد الإلكتروني أو تاريخ الإنشاء لضمان أمان وسلامة سجلات المستخدم.' : 'Email and registration date cannot be modified to ensure security and audit integrity.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
                                <div className="space-y-6">
                                    {/* Name Section with Language Toggle */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                                            </label>
                                            <LangToggle />
                                        </div>
                                        
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                <Languages className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <input 
                                                type="text"
                                                value={formData.fullName[formLang]}
                                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: { ...prev.fullName, [formLang]: e.target.value } }))}
                                                className="w-full h-16 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 rounded-2xl pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                                                placeholder={formLang === 'ar' ? 'أدخل الاسم بالعربية...' : 'Enter name in English...'}
                                                dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{formLang}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Phone Number */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input 
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 rounded-2xl pl-12 pr-5 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                                                    placeholder="05xxxxxxx"
                                                />
                                            </div>
                                        </div>

                                        {/* User Role */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                {language === 'ar' ? 'مرتبة المستخدم' : 'User Role'}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                    <Shield className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <select 
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                    className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 rounded-2xl pl-12 pr-10 text-sm font-black text-slate-900 dark:text-white transition-all outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="user">{language === 'ar' ? 'مستخدم عادي' : 'Standard User'}</option>
                                                    <option value="trainer">{language === 'ar' ? 'مدرب' : 'Trainer'}</option>
                                                    <option value="admin">{language === 'ar' ? 'مسؤول نظام' : 'System Admin'}</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Upload Component */}
                                    <div className="space-y-2 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">
                                            {language === 'ar' ? 'تغيير صورة الملف الشخصي' : 'Change Profile Picture'}
                                        </label>
                                        <ImageUpload 
                                            onUploadComplete={handleImageUpload}
                                            initialImageUrl={formData.photoURL}
                                            folderPath="users"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button 
                                        type="submit"
                                        disabled={isSaving}
                                        className="h-16 flex-grow bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-primary/25 active:scale-95"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                {language === 'ar' ? 'حفظ التغييرات النهائية' : 'Save Final Changes'}
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => router.back()}
                                        className="h-16 px-10 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-95"
                                    >
                                        {language === 'ar' ? 'تجاهل' : 'Discard'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
