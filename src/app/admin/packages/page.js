"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    Dumbbell, 
    Search, 
    Trash2, 
    Edit, 
    CheckCircle2, 
    XCircle,
    Plus,
    Clock,
    Tag,
    Star,
    Loader2,
    Check,
    Languages,
    Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import Pagination from '../components/Pagination';

export default function AdminPackages() {
    const { language, setAlert } = useApp();
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [formLang, setFormLang] = useState('ar'); 
    const [formData, setFormData] = useState({
        name: { ar: '', en: '' },
        description: { ar: '', en: '' },
        price: '0',
        oldPrice: '0',
        discount: '0',
        durationText: { ar: '', en: '' },
        features: { ar: [], en: [] },
        badge: { ar: '', en: '' },
        featured: false,
        months: '1',
        sessionsPerWeek: '3',
        sport: 'general',
        order: '1'
    });

    const fetchPackages = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, "packages"), orderBy("order", "asc"));
            const snap = await getDocs(q);
            setPackages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const getText = (val) => {
        if (typeof val === 'object' && val !== null) {
            return val[language] || val['ar'] || val['en'] || '';
        }
        return val || '';
    };

    const normalizeText = (val) => {
        if (typeof val === 'object' && val !== null) return { ar: val.ar || '', en: val.en || '' };
        return { ar: val || '', en: val || '' };
    };

    const normalizeArray = (val) => {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            return { ar: Array.isArray(val.ar) ? val.ar : [], en: Array.isArray(val.en) ? val.en : [] };
        }
        return { ar: Array.isArray(val) ? val : [], en: Array.isArray(val) ? val : [] };
    };

    const handleOpenModal = (pkg = null) => {
        if (pkg) {
            setEditingPackage(pkg);
            setFormData({
                name: normalizeText(pkg.name_ar || pkg.name),
                description: normalizeText(pkg.desc_ar || pkg.description),
                price: String(pkg.price || 0),
                oldPrice: String(pkg.oldPrice || 0),
                discount: String(pkg.discount || 0),
                durationText: normalizeText(pkg.duration_ar || pkg.duration || pkg.durationText),
                features: {
                    ar: pkg.features_ar || (Array.isArray(pkg.features) ? pkg.features : []),
                    en: pkg.features_en || (Array.isArray(pkg.features) ? pkg.features : [])
                },
                badge: normalizeText(pkg.badge_ar || pkg.badge),
                featured: pkg.featured || false,
                months: String(pkg.months || 1),
                sessionsPerWeek: String(pkg.sessionsPerWeek || 3),
                sport: pkg.sport || 'general',
                order: String(pkg.order || 1)
            });
        } else {
            setEditingPackage(null);
            setFormData({
                name: { ar: '', en: '' },
                description: { ar: '', en: '' },
                price: '0',
                oldPrice: '0',
                discount: '0',
                durationText: { ar: '', en: '' },
                features: { ar: [], en: [] },
                badge: { ar: '', en: '' },
                featured: false,
                months: '1',
                sessionsPerWeek: '3',
                sport: 'general',
                order: String(packages.length + 1)
            });
        }
        setFormLang('ar');
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const finalData = {
                name_ar: formData.name.ar,
                name_en: formData.name.en,
                desc_ar: formData.description.ar,
                desc_en: formData.description.en,
                price: Number(formData.price),
                oldPrice: Number(formData.oldPrice),
                discount: Number(formData.discount),
                duration_ar: formData.durationText.ar,
                duration_en: formData.durationText.en,
                features_ar: formData.features.ar,
                features_en: formData.features.en,
                badge_ar: formData.badge.ar,
                badge_en: formData.badge.en,
                featured: formData.featured,
                months: Number(formData.months),
                sessionsPerWeek: Number(formData.sessionsPerWeek),
                sport: formData.sport,
                order: Number(formData.order),
                updatedAt: serverTimestamp(),
                // Backwards compatibility for frontend
                name: language === 'ar' ? formData.name.ar : formData.name.en,
                description: language === 'ar' ? formData.description.ar : formData.description.en,
                features: language === 'ar' ? formData.features.ar : formData.features.en,
                duration: language === 'ar' ? formData.durationText.ar : formData.durationText.en,
                badge: language === 'ar' ? formData.badge.ar : formData.badge.en,
                currency: language === 'ar' ? 'ر.س' : 'SAR'
            };

            if (editingPackage) {
                await updateDoc(doc(db, "packages", editingPackage.id), finalData);
            } else {
                finalData.createdAt = serverTimestamp();
                await addDoc(collection(db, "packages"), finalData);
            }
            
            setAlert({
                title: language === 'ar' ? 'تم بنجاح' : 'Success',
                message: language === 'ar' ? 'تم حفظ التغييرات بنجاح.' : 'Changes saved successfully.',
                type: 'success'
            });
            setIsModalOpen(false);
            fetchPackages();
        } catch (error) {
            console.error("Error saving package:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'حدث خطأ أثناء الحفظ.' : 'Error saving package.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id, name) => {
        setAlert({
            title: language === 'ar' ? 'حذف الباقة' : 'Delete Package',
            message: language === 'ar' ? `هل أنت متأكد من حذف "${name}"؟` : `Delete "${name}"?`,
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "packages", id));
                    setPackages(packages.filter(p => p.id !== id));
                } catch (error) {
                    console.error("Error deleting package:", error);
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        <Dumbbell className="w-8 h-8 text-[#7C3AED]" />
                        {language === 'ar' ? 'إدارة الباقات' : 'Package Management'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'قم بإضافة وتعديل باقات الاشتراك والعروض الخاصة.' : 'Add and manage subscription packages and special offers.'}
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black rounded-2xl transition-colors shadow-lg shadow-purple-500/30 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'ar' ? 'إضافة باقة' : 'Add Package'}</span>
                </button>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الباقة' : 'Package'}</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'السعر' : 'Price'}</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الحصص/أسبوع' : 'Sessions/Wk'}</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'المدة' : 'Duration'}</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الميزة' : 'Featured'}</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                            {packages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${pkg.featured ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <Dumbbell className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 dark:text-white capitalize">{pkg.name_ar || pkg.name}</span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{pkg.sport}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{pkg.price} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                                            {pkg.discount > 0 && <span className="text-[10px] text-rose-500 font-bold">-{pkg.discount}%</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black">
                                            {pkg.sessionsPerWeek || 3} {language === 'ar' ? 'حصص' : 'sessions'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-500">
                                        {pkg.duration_ar || pkg.duration || pkg.durationText}
                                    </td>
                                    <td className="px-6 py-4">
                                        {pkg.featured ? (
                                            <span className="p-1 px-3 bg-purple-100 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                                                <Star className="w-3 h-3 fill-purple-600" />
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-300">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-end">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(pkg)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-xl hover:text-purple-500 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(pkg.id, pkg.name_ar || pkg.name)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-xl hover:text-rose-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {Math.ceil(packages.length / itemsPerPage) > 1 && (
                    <div className="p-6 border-t border-gray-100 dark:border-white/10">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={Math.ceil(packages.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSaving && setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 border border-white/10 overflow-hidden">
                            <div className="p-8 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                                        {editingPackage ? 'Edit Package' : 'New Package'}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                                            <button type="button" onClick={() => setFormLang('ar')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${formLang === 'ar' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>عربي</button>
                                            <button type="button" onClick={() => setFormLang('en')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${formLang === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><XCircle className="w-6 h-6 text-gray-400" /></button>
                                    </div>
                                </div>

                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Name ({formLang})</label>
                                            <input type="text" value={formData.name[formLang]} onChange={(e) => setFormData(p => ({ ...p, name: { ...p.name, [formLang]: e.target.value } }))} className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Description ({formLang})</label>
                                            <input type="text" value={formData.description[formLang]} onChange={(e) => setFormData(p => ({ ...p, description: { ...p.description, [formLang]: e.target.value } }))} className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Badge Text ({formLang})</label>
                                            <input type="text" value={formData.badge[formLang]} onChange={(e) => setFormData(p => ({ ...p, badge: { ...p.badge, [formLang]: e.target.value } }))} placeholder="e.g. Most Popular" className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Price</label>
                                            <input type="number" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Old Price</label>
                                            <input type="number" value={formData.oldPrice} onChange={(e) => setFormData(p => ({ ...p, oldPrice: e.target.value }))} className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Discount %</label>
                                            <input type="number" value={formData.discount} onChange={(e) => setFormData(p => ({ ...p, discount: e.target.value }))} className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Months</label>
                                            <input type="number" value={formData.months} onChange={(e) => setFormData(p => ({ ...p, months: e.target.value }))} className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'الحصص/أسبوع' : 'Sessions/Week'}</label>
                                            <input type="number" min="1" max="7" value={formData.sessionsPerWeek} onChange={(e) => setFormData(p => ({ ...p, sessionsPerWeek: e.target.value }))} className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Duration Text ({formLang})</label>
                                            <input type="text" value={formData.durationText[formLang]} onChange={(e) => setFormData(p => ({ ...p, durationText: { ...p.durationText, [formLang]: e.target.value } }))} placeholder="e.g. 1 Month - 3 Sessions/Week" className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Sport Type</label>
                                            <select value={formData.sport} onChange={(e) => setFormData(p => ({ ...p, sport: e.target.value }))} className="w-full bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500 appearance-none">
                                                <option value="general">General Fitness</option>
                                                <option value="boxing">Boxing</option>
                                                <option value="karate">Karate</option>
                                                <option value="taekwondo">Taekwondo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                            Features ({formLang})
                                            <span className="text-[10px] lowercase text-gray-400 font-bold italic italic">(Press Enter to add)</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl min-h-[100px]">
                                            {formData.features[formLang].map((feat, index) => (
                                                <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white text-[10px] font-black rounded-lg uppercase">
                                                    {feat}
                                                    <button type="button" onClick={() => setFormData(p => ({ ...p, features: { ...p.features, [formLang]: p.features[formLang].filter((_, i) => i !== index) } }))}><XCircle className="w-3.5 h-3.5 hover:text-rose-200" /></button>
                                                </span>
                                            ))}
                                            <input 
                                                type="text" 
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const val = e.target.value.trim();
                                                        if (val && !formData.features[formLang].includes(val)) {
                                                            setFormData(p => ({ ...p, features: { ...p.features, [formLang]: [...p.features[formLang], val] } }));
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                                className="bg-transparent border-none outline-none flex-1 text-sm font-bold dark:text-white"
                                                placeholder="Add a feature..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-500/10 rounded-2xl border border-purple-100 dark:border-purple-500/20">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500 text-white rounded-xl"><Star className="w-5 h-5 fill-white" /></div>
                                            <div>
                                                <p className="text-sm font-black dark:text-white">Featured Package</p>
                                                <p className="text-[10px] font-bold text-gray-500">Will have solid purple background and special badge.</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))} className={`w-12 h-6 rounded-full transition-colors relative ${formData.featured ? 'bg-purple-500' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.featured ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 font-black rounded-2xl">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="flex-[2] py-4 bg-purple-500 hover:bg-purple-600 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2">
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingPackage ? 'Update Package' : 'Create Package'}
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
