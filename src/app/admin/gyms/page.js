"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    Building2, 
    Search, 
    MoreVertical, 
    Trash2, 
    Edit, 
    CheckCircle2, 
    XCircle,
    Plus,
    MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "../components/ImageUpload";
import { Loader2 } from 'lucide-react';

export default function AdminGyms() {
    const { language, setAlert } = useApp();
    const [gyms, setGyms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingGym, setEditingGym] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        image: '',
        status: 'active',
        features: [] // Example extra field
    });

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
                name: gym.name || '',
                address: gym.address || '',
                image: gym.image || '',
                status: gym.status || 'active',
                features: gym.features || []
            });
        } else {
            setEditingGym(null);
            setFormData({
                name: '',
                address: '',
                image: '',
                status: 'active',
                features: []
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

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
        (gym.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (gym.address || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                {/* Optional logic for adding gyms via modal or navigating to create page */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredGyms.length > 0 ? filteredGyms.map((gym, idx) => (
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
                                        <img src={gym.image} alt={gym.name} className="w-full h-full object-cover" />
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
                                        <h3 className="font-black text-lg text-slate-900 dark:text-white line-clamp-1">{gym.name || 'Unnamed Gym'}</h3>
                                    </div>
                                    <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-4 line-clamp-1">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        {gym.address || (language === 'ar' ? 'عنوان غير محدد' : 'No address specified')}
                                    </p>

                                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
                                        {/* Edit Action */}
                                        <button 
                                            onClick={() => handleOpenModal(gym)}
                                            title={language === 'ar' ? 'تعديل النادي' : 'Edit Gym'}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 hover:bg-emerald-500 hover:text-white text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            {language === 'ar' ? 'تعديل' : 'Edit'}
                                        </button>
                                        
                                        {/* Status Toggle Action */}
                                        <button 
                                            onClick={() => handleToggleStatus(gym.id, gym.status)}
                                            title={language === 'ar' ? 'تغيير الحالة' : 'Toggle Status'}
                                            className={`p-2 rounded-xl border transition-colors ${gym.status === 'active' ? 'border-amber-200 text-amber-500 hover:bg-amber-50 dark:border-amber-500/30 dark:hover:bg-amber-500/10' : 'border-emerald-200 text-emerald-500 hover:bg-emerald-50 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10'}`}
                                        >
                                            {gym.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </button>

                                        {/* Delete Action */}
                                        <button 
                                            onClick={() => handleDelete(gym.id, gym.name)}
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
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        {editingGym ? (language === 'ar' ? 'تعديل النادي' : 'Edit Gym') : (language === 'ar' ? 'إضافة نادي جديد' : 'Add New Gym')}
                                    </h2>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <XCircle className="w-6 h-6 text-gray-400" />
                                    </button>
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
                                                {language === 'ar' ? 'اسم النادي' : 'Gym Name'}
                                            </label>
                                            <input 
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-emerald-500 transition-all"
                                                placeholder={language === 'ar' ? 'مثال: جولدز جيم' : 'e.g. Gold\'s Gym'}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {language === 'ar' ? 'العنوان / الموقع' : 'Address / Location'}
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input 
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold dark:text-white outline-none focus:border-emerald-500 transition-all"
                                                    placeholder={language === 'ar' ? 'مثال: الرياض، حي المروج' : 'e.g. Riyadh, Al Murooj'}
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
