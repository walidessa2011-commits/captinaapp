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
    Languages,
    RefreshCw,
    History,
    Calendar,
    ArrowRightCircle,
    Copy,
    Activity
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from "@/lib/firebase";
import { 
    collection, 
    getDocs, 
    doc, 
    updateDoc, 
    addDoc, 
    serverTimestamp, 
    getDoc, 
    query, 
    where, 
    orderBy, 
    limit 
} from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from "../../components/ImageUpload";
import Pagination from "../../components/Pagination"; // Assuming this path

export default function EditUserContent() {
    const { language, setAlert, darkMode, getText, getSubscriptionDetails } = useApp();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubLoading, setIsSubLoading] = useState(true);
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [formLang, setFormLang] = useState('ar');
    const [formData, setFormData] = useState({
        fullName: { ar: '', en: '' },
        phone: '',
        role: 'user',
        email: '',
        photoURL: '',
        createdAt: ''
    });
    const [previewImage, setPreviewImage] = useState(null);

    // Normalize text to object { ar, en }
    const normalizeText = (text) => {
        if (!text) return { ar: '', en: '' };
        if (typeof text === 'object') return { ar: text.ar || '', en: text.en || '' };
        return { ar: text, en: text };
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                setAlert({
                    show: true,
                    message: language === 'ar' ? 'معرف المستخدم مفقود' : 'User ID is missing',
                    type: 'error'
                });
                router.push('/admin/users');
                return;
            }
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

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            if (!id) return;
            setIsSubLoading(true);
            try {
                // Fetch Subscriptions
                const subQ = query(collection(db, "subscriptions"), where("userId", "==", id));
                const subSnap = await getDocs(subQ);
                let allSubs = subSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
                
                // Sort by date desc
                allSubs.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (new Date(a.createdAt).getTime() || 0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (new Date(b.createdAt).getTime() || 0);
                    return dateB - dateA;
                });
                setUserSubscriptions(allSubs);

                // Fetch Attendance History
                const attQ = query(
                    collection(db, "attendance"), 
                    where("userId", "==", id),
                    orderBy("date", "desc"),
                    limit(10)
                );
                const attSnap = await getDocs(attQ);
                setAttendanceHistory(attSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));

            } catch (err) {
                console.error("Error fetching subscription data:", err);
            } finally {
                setIsSubLoading(false);
            }
        };

        fetchSubscriptionData();
    }, [id]);

    const handleUpdateAttendance = async (subId, increment) => {
        const sub = userSubscriptions.find(s => s.id === subId);
        if (!sub) return;

        let newConsumed = (sub.consumedSessions || 0) + increment;
        if (newConsumed < 0) newConsumed = 0;
        
        setIsSaving(true);
        try {
            await updateDoc(doc(db, "subscriptions", subId), {
                consumedSessions: newConsumed,
                updatedAt: serverTimestamp()
            });

            const attendanceRecord = {
                userId: id,
                userName: getText(formData.fullName) || formData.email || 'Unknown',
                subscriptionId: subId,
                sportName: getText(sub.sportName) || sub.sportId || 'Unknown Sport',
                packageName: getText(sub.packageName || sub.planLabel) || 'Unknown Package',
                action: increment,
                date: new Date(),
                isAdminAction: true
            };

            const docRef = await addDoc(collection(db, "attendance"), attendanceRecord);

            // Update local state
            setUserSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, consumedSessions: newConsumed } : s));
            setAttendanceHistory(prev => [{ id: docRef.id, ...attendanceRecord }, ...prev].slice(0, 10));

            setAlert({
                show: true,
                message: language === 'ar' ? 'تم تسجيل الحضور بنجاح' : 'Attendance registered successfully',
                type: 'success'
            });
        } catch (error) {
            console.error("Error updating attendance:", error);
            setAlert({
                show: true,
                message: language === 'ar' ? 'حدث خطأ أثناء تحديث الحصص' : 'Error updating sessions',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

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

                            {/* Active Subscription & Attendance Panel */}
                            {userSubscriptions.length > 0 ? (
                                <div className="space-y-6">
                                    {userSubscriptions.filter(s => {
                                        const details = getSubscriptionDetails(s);
                                        return details && !['expired', 'cancelled', 'rejected'].includes(s.status?.toLowerCase());
                                    }).map((sub) => {
                                        const details = getSubscriptionDetails(sub);
                                        const progress = (details.consumedSessions / (details.totalSessions || 1)) * 100;

                                        return (
                                            <div key={sub.id} className="bg-white dark:bg-[#111827] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group">
                                                <div className={`absolute top-0 left-0 w-2 h-full ${details.barColor}`}></div>
                                                
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2.5 ${details.statusColor.replace('bg-', 'bg-opacity-10 ')} ${details.statusColor} rounded-xl`}>
                                                            <Activity className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                                                                {getText(sub.sportName) || (language === 'ar' ? 'رياضة غير محددة' : 'Unknown Sport')}
                                                            </h3>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${details.statusColor} text-white`}>
                                                                {details.statusLabel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-6">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-400 font-bold">{language === 'ar' ? 'الحصص المستهلكة' : 'Sessions Consumed'}</span>
                                                        <span className="font-black dark:text-white">{details.consumedSessions} / {details.totalSessions}</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            className={`h-full ${details.barColor}`}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleUpdateAttendance(sub.id, 1)}
                                                        disabled={isSaving || details.isPending}
                                                        className={`flex-grow py-3 ${details.barColor} hover:opacity-90 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:grayscale disabled:opacity-50`}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        {language === 'ar' ? 'تسجيل حضور' : 'Log Attendance'}
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleUpdateAttendance(sub.id, -1)}
                                                        disabled={isSaving || details.consumedSessions <= 0}
                                                        className="px-4 py-3 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-rose-500 rounded-xl transition-colors"
                                                        title={language === 'ar' ? 'تراجع' : 'Undo'}
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Attendance History */}
                                    {attendanceHistory.length > 0 && (
                                        <div className="bg-white dark:bg-[#111827] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <History className="w-4 h-4 text-primary" />
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                                    {language === 'ar' ? 'سجل الحضور الأخير' : 'Recent Attendance'}
                                                </h4>
                                            </div>
                                            <div className="space-y-3">
                                                {attendanceHistory.map((log) => (
                                                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-1.5 rounded-lg ${log.action > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                                {log.action > 0 ? <CheckCircle2 className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black dark:text-white leading-none mb-1">{getText(log.sportName)}</p>
                                                                <p className="text-[9px] font-bold text-gray-400">
                                                                    {log.date?.toDate ? log.date.toDate().toLocaleString() : new Date(log.date).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-[10px] font-black ${log.action > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                            {log.action > 0 ? '+1' : '-1'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Linked Accounts Help */}
                                    {(getText(formData.fullName).toLowerCase().includes('walid') || getText(formData.fullName).includes('وليد')) && (
                                        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                            <div className="flex gap-3">
                                                <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0" />
                                                <p className="text-[10px] font-bold text-blue-600/80 leading-relaxed">
                                                    {language === 'ar' 
                                                        ? 'ملاحظة: هذا المستخدم قد يمتلك حسابات متعددة (مدرب/متدرب). إذا لم يظهر الاشتراك المتوقع، تأكد من أنك في حساب "المتدرب" الصحيح.' 
                                                        : 'Note: This user may have multiple accounts (Trainer/Trainee). If the expected subscription is missing, ensure you are viewing the correct "Trainee" account.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                !isSubLoading && (
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 text-center">
                                        <div className="w-16 h-16 rounded-[2rem] bg-gray-100 dark:bg-white/10 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200 dark:border-white/10">
                                            <ShieldAlert className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
                                            {language === 'ar' ? 'لا توجد اشتراكات' : 'No Subscriptions'}
                                        </h4>
                                        <p className="text-[11px] font-bold text-gray-400 max-w-[200px] mx-auto">
                                            {language === 'ar' ? 'هذا المستخدم ليس لديه أي اشتراكات سابقة أو حالية في النظام.' : 'This user has no past or current subscriptions in the system.'}
                                        </p>
                                    </div>
                                )
                            )}
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
