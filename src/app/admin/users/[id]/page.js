"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { 
    User, 
    Mail, 
    Phone, 
    Shield, 
    Save, 
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ImageUpload from "../../components/ImageUpload";

export default function EditUserPage({ params }) {
    const { id } = React.use(params);
    const { language, setAlert } = useApp();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        role: 'user',
        email: '',
        photoURL: '',
        createdAt: null
    });

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        fullName: data.fullName || '',
                        phone: data.phone || '',
                        role: data.role || 'user',
                        email: data.email || '',
                        photoURL: data.photoURL || '',
                        createdAt: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : null
                    });
                } else {
                    setAlert({
                        title: language === 'ar' ? 'خطأ' : 'Error',
                        message: language === 'ar' ? 'المستخدم غير موجود' : 'User not found',
                        type: 'error'
                    });
                    router.push('/admin/users');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, {
                fullName: formData.fullName,
                phone: formData.phone,
                role: formData.role,
                photoURL: formData.photoURL
            });

            setAlert({
                title: language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved Successfully',
                message: language === 'ar' ? 'تم تحديث بيانات المستخدم، يمكنك الرجوع الآن.' : 'User data has been updated.',
                type: 'success'
            });
            
            router.push('/admin/users');
        } catch (error) {
            console.error("Error updating user:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'حدث خطأ أثناء حفظ التعديلات' : 'Error saving changes',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header section w/ Back Button */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.push('/admin/users')}
                    className="p-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-gray-500 hover:text-primary dark:text-gray-400 group shadow-sm"
                >
                    {language === 'ar' ? <ChevronRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        {language === 'ar' ? 'تعديل بيانات المستخدم' : 'Edit User Profile'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'إدارة وتحديث التفاصيل الشخصية والصلاحيات الخاصة بالحساب.' : 'Manage and update personal details and account privileges.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Profile Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium flex flex-col items-center text-center">
                        <div className="relative mb-6 w-full">
                            <ImageUpload 
                                value={formData.photoURL}
                                onChange={(url) => setFormData(prev => ({ ...prev, photoURL: url }))}
                                label={language === 'ar' ? 'الصورة الشخصية' : 'Profile Picture'}
                                folder="users"
                                shape="circle"
                            />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 capitalize">
                            {formData.fullName || (language === 'ar' ? 'مستخدم بدون إسم' : 'Unnamed User')}
                        </h2>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4
                            ${formData.role === 'admin' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'}`}
                        >
                            <Shield className="w-3.5 h-3.5" />
                            {formData.role === 'admin' ? (language === 'ar' ? 'مدير النظام' : 'System Admin') : (language === 'ar' ? 'مستخدم قياسي' : 'Standard User')}
                        </span>
                        
                        <div className="w-full border-t border-gray-100 dark:border-white/10 pt-4 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-500">{language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}</span>
                                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {formData.createdAt || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-500">{language === 'ar' ? 'معرف الحساب' : 'Account ID'}</span>
                                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-widest text-[10px]"><User className="w-3.5 h-3.5 text-gray-400" /> {id.slice(0, 8)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form Overview */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="bg-white dark:bg-white/5 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium space-y-6">
                        
                        {/* Name */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/10 pb-2">
                                {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="text" 
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 dark:text-white font-bold placeholder-gray-400 focus:border-primary focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                        {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 dark:text-white font-bold placeholder-gray-400 focus:border-primary focus:bg-white transition-all outline-none text-left"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                    {language === 'ar' ? 'البريد الإلكتروني (محمي)' : 'Email Address (Locked)'}
                                </label>
                                <div className="relative group opacity-60">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        readOnly
                                        disabled
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 dark:text-white font-bold outline-none cursor-not-allowed text-left focus:ring-0"
                                        dir="ltr"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 px-2 mt-1">
                                    {language === 'ar' ? 'لا يمكن تعديل البريد الإلكتروني لأسباب أمنية.' : 'Email cannot be changed for security reasons.'}
                                </p>
                            </div>
                        </div>

                        {/* Security / Roles */}
                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/10">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/10 pb-2">
                                {language === 'ar' ? 'إعدادات الأمان والصلاحيات' : 'Security & Roles'}
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                                    {language === 'ar' ? 'الدور في النظام' : 'System Role'}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'role', value: 'user' } })}
                                        className={`flex items-center justify-center gap-3 py-3 rounded-2xl font-black text-xs transition-all border ${
                                            formData.role === 'user' 
                                            ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        <User className="w-4 h-4" />
                                        {language === 'ar' ? 'مستخدم تطبيقي' : 'Standard User'}
                                        {formData.role === 'user' && <CheckCircle2 className="w-4 h-4 ml-2" />}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'role', value: 'admin' } })}
                                        className={`flex items-center justify-center gap-3 py-3 rounded-2xl font-black text-xs transition-all border ${
                                            formData.role === 'admin' 
                                            ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 shadow-sm' 
                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400'
                                        }`}
                                    >
                                        <Shield className="w-4 h-4" />
                                        {language === 'ar' ? 'التحكم الإداري' : 'System Admin'}
                                        {formData.role === 'admin' && <CheckCircle2 className="w-4 h-4 ml-2" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8">
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-all disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-white/70" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>{language === 'ar' ? 'تحديث بيانات المستخدم' : 'Update User Data'}</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
