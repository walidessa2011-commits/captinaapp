"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    Building2, 
    Search, 
    Trash2, 
    Edit, 
    CheckCircle2, 
    XCircle,
    Plus,
    MapPin,
    Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "../components/ImageUpload";
import { Loader2 } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function AdminGyms() {
    const { language, setAlert } = useApp();
    const [gyms, setGyms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingGym, setEditingGym] = useState(null);
    const [formLang, setFormLang] = useState('ar');
    const [formData, setFormData] = useState({
        name: { ar: '', en: '' },
        address: { ar: '', en: '' },
        image: '',
        status: 'active',
        features: []
    });

    // Helper: get display text from bilingual or plain string
    const getText = (val) => {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            return val[language] || val['ar'] || val['en'] || '';
        }
        return val || '';
    };

    // Helper: normalize to bilingual object
    const normalizeText = (val) => {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) return { ar: val.ar || '', en: val.en || '' };
        return { ar: val || '', en: val || '' };
    };

    const fetchGyms = async () => {
        setIsLoading(true);
        try {
            const gymsSnap = await getDocs(collection(db, "gyms"));
            setGyms(gymsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching gyms:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGyms();
    }, []);

    const handleDelete = (gymId, gymName) => {
        setAlert({
            title: language === 'ar' ? 'حذف النادي' : 'Delete Gym',
            message: language === 'ar' ? `هل أنت متأكد من حذف النادي "${gymName}" ومعلوماته بالكامل؟` : `Are you sure you want to delete the gym "${gymName}" and all its information?`,
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "gyms", gymId));
                    setGyms(gyms.filter(g => g.id !== gymId));
                } catch (error) {
                    console.error("Error deleting gym:", error);
                    alert("Error deleting gym");
                }
            }
        });
    };

    const handleOpenModal = (gym = null) => {
        if (gym) {
            setEditingGym(gym);
            setFormData({
                name: normalizeText(gym.name),
                address: normalizeText(gym.address),
                image: gym.image || '',
                status: gym.status || 'active',
                features: gym.features || []
            });
        } else {
            setEditingGym(null);
            setFormData({
                name: { ar: '', en: '' },
                address: { ar: '', en: '' },
                image: '',
                status: 'active',
                features: []
            });
        }
        setFormLang('ar');
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name.ar.trim() && !formData.name.en.trim()) return;

        setIsSaving(true);
        try {
            const gymData = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (editingGym) {
                await updateDoc(doc(db, "gyms", editingGym.id), gymData);
                setAlert({
                    title: language === 'ar' ? 'تم التحديث' : 'Updated',
                    message: language === 'ar' ? 'تم تحديث بيانات النادي بنجاح.' : 'Gym updated successfully.',
                    type: 'success'
                });
            } else {
                gymData.createdAt = serverTimestamp();
                await addDoc(collection(db, "gyms"), gymData);
                setAlert({
                    title: language === 'ar' ? 'تمت الإضافة' : 'Added',
                    message: language === 'ar' ? 'تم إضافة النادي الجديد بنجاح.' : 'New gym added successfully.',
                    type: 'success'
                });
            }
            setIsModalOpen(false);
            fetchGyms();
        } catch (error) {
            console.error("Error saving gym:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'حدث خطأ أثناء حفظ البيانات.' : 'Error saving gym data.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (gymId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await updateDoc(doc(db, "gyms", gymId), { status: newStatus });
            setGyms(gyms.map(g => g.id === gymId ? { ...g, status: newStatus } : g));
        } catch (error) {
            console.error("Error updating gym status:", error);
        }
    };

    const handleAddFeature = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newFeature = e.target.value.trim();
            if (!formData.features.includes(newFeature)) {
                setFormData(prev => ({
                    ...prev,
                    features: [...prev.features, newFeature]
                }));
            }
            e.target.value = '';
        }
    };

    const removeFeature = (feature) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter(f => f !== feature)
        }));
    };

    const filteredGyms = gyms.filter(gym => 
        getText(gym.name).toLowerCase().includes(searchTerm.toLowerCase()) || 
        getText(gym.address).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredGyms.length / itemsPerPage);
    const paginatedGyms = filteredGyms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Language Toggle Component
    const LangToggle = () => (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
            <button 
                type="button"
                onClick={() => setFormLang('ar')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formLang === 'ar' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-gray-400 hover:text-emerald-500'}`}
            >
                عربي
            </button>
            <button 
                type="button"
                onClick={() => setFormLang('en')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formLang === 'en' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-gray-400 hover:text-emerald-500'}`}
            >
                EN
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-emerald-500" />
                        {language === 'ar' ? 'إدارة النوادي' : 'Gyms Management'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'إدارة النوادي الرياضية المسجلة، عرض التفاصيل، التحكم بالحالة.' : 'Manage registered gyms, view details, control visibility and active status.'}
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-colors shadow-lg shadow-emerald-500/30 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'ar' ? 'إضافة نادي' : 'Add New Gym'}</span>
                </button>
            </div>

            {/* Filters / Search */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-emerald-500/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث باسم النادي أو العنوان...' : 'Search by gym name or address...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                    />
                </div>
            </div>

            {/* Grids */}
            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {paginatedGyms.length > 0 ? paginatedGyms.map((gym, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={gym.id}
                                    className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden group hover:-translate-y-1 transition-transform relative"
                                >
                                    {/* Gym Image */}
                                    <div className="h-40 w-full bg-gray-100 dark:bg-white/5 relative">
                                        {gym.image ? (
                                            <img src={gym.image} alt={getText(gym.name)} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Building2 className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-xl shadow-lg backdrop-blur-md ${gym.status === 'active' ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                                                {gym.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'معطل' : 'Inactive')}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col pt-3 relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-black text-lg text-slate-900 dark:text-white line-clamp-1">{getText(gym.name) || 'Unnamed Gym'}</h3>
                                        </div>
                                        <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-4 line-clamp-1">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            {getText(gym.address) || (language === 'ar' ? 'عنوان غير محدد' : 'No address specified')}
                                        </p>

                                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
                                            <button 
                                                onClick={() => handleOpenModal(gym)}
                                                title={language === 'ar' ? 'تعديل النادي' : 'Edit Gym'}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 hover:bg-emerald-500 hover:text-white text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                {language === 'ar' ? 'تعديل' : 'Edit'}
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleToggleStatus(gym.id, gym.status)}
                                                title={language === 'ar' ? 'تغيير الحالة' : 'Toggle Status'}
                                                className={`p-2 rounded-xl border transition-colors ${gym.status === 'active' ? 'border-amber-200 text-amber-500 hover:bg-amber-50 dark:border-amber-500/30 dark:hover:bg-amber-500/10' : 'border-emerald-200 text-emerald-500 hover:bg-emerald-50 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10'}`}
                                            >
                                                {gym.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                            </button>

                                            <button 
                                                onClick={() => handleDelete(gym.id, getText(gym.name))}
                                                title={language === 'ar' ? 'حذف جذري' : 'Force Delete'}
                                                className="p-2 border border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <motion.div 
                                    className="col-span-full p-12 text-center text-gray-500 font-bold bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium flex flex-col items-center gap-4"
                                >
                                    <Building2 className="w-12 h-12 text-gray-300" />
                                    <span>{language === 'ar' ? 'لم يتم العثور على نوادي تطابق بحثك.' : 'No gyms found matching your search.'}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSaving && setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10"
                        >
                            <div className="p-8 max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        {editingGym ? (language === 'ar' ? 'تعديل النادي' : 'Edit Gym') : (language === 'ar' ? 'إضافة نادي جديد' : 'Add New Gym')}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <LangToggle />
                                        <button 
                                            onClick={() => setIsModalOpen(false)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                                        >
                                            <XCircle className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Current language indicator */}
                                <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                    <Languages className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                        {formLang === 'ar' ? 'أنت تكتب الآن باللغة العربية' : 'You are now typing in English'}
                                    </span>
                                </div>

                                <form onSubmit={handleSave} className="space-y-6">
                                    {/* Image Upload Integration */}
                                    <ImageUpload 
                                        value={formData.image}
                                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                        label={language === 'ar' ? 'صورة النادي' : 'Gym Image'}
                                        folder="gyms"
                                        shape="rectangle"
                                    />

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {formLang === 'ar' ? 'اسم النادي (عربي)' : 'Gym Name (English)'}
                                            </label>
                                            <input 
                                                type="text"
                                                required={formLang === 'ar'}
                                                value={formData.name[formLang]}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: { ...prev.name, [formLang]: e.target.value } }))}
                                                dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-emerald-500 transition-all"
                                                placeholder={formLang === 'ar' ? 'مثال: جولدز جيم' : 'e.g. Gold\'s Gym'}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {formLang === 'ar' ? 'العنوان / الموقع (عربي)' : 'Address / Location (English)'}
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input 
                                                    type="text"
                                                    value={formData.address[formLang]}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, [formLang]: e.target.value } }))}
                                                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold dark:text-white outline-none focus:border-emerald-500 transition-all"
                                                    placeholder={formLang === 'ar' ? 'مثال: الرياض، حي المروج' : 'e.g. Riyadh, Al Murooj'}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {language === 'ar' ? 'المميزات / الخدمات (اضغط Enter للإضافة)' : 'Features / Services (Press Enter to add)'}
                                            </label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.features.map((feature, i) => (
                                                    <span key={i} className="flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                                                        {feature}
                                                        <button type="button" onClick={() => removeFeature(feature)} className="hover:text-rose-500">
                                                            <XCircle className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input 
                                                type="text"
                                                onKeyDown={handleAddFeature}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-emerald-500 transition-all"
                                                placeholder={language === 'ar' ? 'مثال: مسبح، مواقف، مدرب خاص...' : 'e.g. Pool, Parking, Personal Trainer...'}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black rounded-2xl"
                                        >
                                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    {language === 'ar' ? 'حفظ البيانات' : 'Save Details'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
