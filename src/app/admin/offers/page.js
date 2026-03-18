"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    Tag, 
    Search, 
    Trash2, 
    Edit, 
    CheckCircle2, 
    XCircle,
    Plus,
    Percent,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "../components/ImageUpload";
import { Loader2, Calendar } from 'lucide-react';

export default function AdminOffers() {
    const { language, setAlert } = useApp();
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discountAmount: '0',
        validUntil: '',
        image: '',
        status: 'active'
    });

    const fetchOffers = async () => {
        setIsLoading(true);
        try {
            const offersSnap = await getDocs(collection(db, "offers"));
            setOffers(offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching offers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleDelete = (offerId, offerTitle) => {
        setAlert({
            title: language === 'ar' ? 'إنهاء العرض' : 'Delete Offer',
            message: language === 'ar' ? `هل أنت متأكد من حذف العرض "${offerTitle}"؟` : `Are you sure you want to delete the offer "${offerTitle}"?`,
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "offers", offerId));
                    setOffers(offers.filter(o => o.id !== offerId));
                } catch (error) {
                    console.error("Error deleting offer:", error);
                    alert("Error deleting offer");
                }
            }
        });
    };

    const handleOpenModal = (offer = null) => {
        if (offer) {
            setEditingOffer(offer);
            setFormData({
                title: offer.title || '',
                description: offer.description || '',
                discountAmount: String(offer.discountAmount || 0),
                validUntil: offer.validUntil || '',
                image: offer.image || '',
                status: offer.status || 'active'
            });
        } else {
            setEditingOffer(null);
            setFormData({
                title: '',
                description: '',
                discountAmount: '0',
                validUntil: '',
                image: '',
                status: 'active'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        setIsSaving(true);
        try {
            const offerData = {
                ...formData,
                discountAmount: Number(formData.discountAmount) || 0,
                updatedAt: serverTimestamp()
            };

            if (editingOffer) {
                await updateDoc(doc(db, "offers", editingOffer.id), offerData);
                setAlert({
                    title: language === 'ar' ? 'تم التحديث' : 'Updated',
                    message: language === 'ar' ? 'تم تحديث العرض بنجاح.' : 'Offer updated successfully.',
                    type: 'success'
                });
            } else {
                offerData.createdAt = serverTimestamp();
                await addDoc(collection(db, "offers"), offerData);
                setAlert({
                    title: language === 'ar' ? 'تمت الإضافة' : 'Added',
                    message: language === 'ar' ? 'تم إضافة العرض الجديد بنجاح.' : 'New offer added successfully.',
                    type: 'success'
                });
            }
            setIsModalOpen(false);
            fetchOffers();
        } catch (error) {
            console.error("Error saving offer:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'حدث خطأ أثناء حفظ البيانات.' : 'Error saving offer data.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const filteredOffers = offers.filter(offer => 
        (offer.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (offer.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        <Tag className="w-8 h-8 text-rose-500" />
                        {language === 'ar' ? 'إدارة العروض' : 'Offers Management'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'إنشاء الحملات الترويجية، ومراقبة صلاحية العروض والخصومات.' : 'Create promotional campaigns and monitor offer validity and discounts.'}
                    </p>
                </div>
                {/* Optional logic for adding offers */}
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl transition-colors shadow-lg shadow-rose-500/30 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'ar' ? 'إنشاء عرض جديد' : 'Create New Offer'}</span>
                </button>
            </div>

            {/* Filters / Search */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-rose-500/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث بعنوان العرض...' : 'Search by offer title...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                    />
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredOffers.length > 0 ? filteredOffers.map((offer, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                key={offer.id}
                                className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden group hover:-translate-y-1 transition-transform relative"
                            >
                                <div className={`absolute -right-12 -top-12 w-32 h-32 bg-rose-500/10 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-500`}></div>

                                <div className="p-6 relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-rose-50 overflow-hidden dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-xl border border-rose-100 dark:border-rose-500/20">
                                            {offer.image ? (
                                                <img src={offer.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Percent className="w-6 h-6" />
                                            )}
                                        </div>
                                        <span className={`px-3 py-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl ${offer.status === 'active' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'}`}>
                                            {offer.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {offer.status === 'active' ? (language === 'ar' ? 'فعال' : 'Active') : (language === 'ar' ? 'منتهي' : 'Expired')}
                                        </span>
                                    </div>

                                    <h3 className="font-black text-xl text-slate-900 dark:text-white line-clamp-1 mb-1">{offer.title || 'Untitled Offer'}</h3>
                                    <p className="text-xs font-bold text-gray-500 line-clamp-2 h-8 mb-4">{offer.description || 'No description provided.'}</p>

                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 px-3 py-2 rounded-xl text-xs font-bold">
                                            <span className="text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'الخصم' : 'Discount'}</span>
                                            <span className="text-rose-500">{offer.discountAmount}%</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 px-3 py-2 rounded-xl text-xs font-bold">
                                            <span className="text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {language === 'ar' ? 'صالح حتى' : 'Valid Until'}</span>
                                            <span className="text-slate-900 dark:text-white">{offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/10">
                                        <button 
                                            onClick={() => handleOpenModal(offer)}
                                            title={language === 'ar' ? 'تعديل العرض' : 'Edit Offer'}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 hover:bg-rose-500 hover:text-white text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            {language === 'ar' ? 'تعديل' : 'Edit'}
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleToggleStatus(offer.id, offer.status)}
                                            title={language === 'ar' ? 'تغيير الحالة' : 'Toggle Status'}
                                            className="p-2 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-colors"
                                        >
                                            {offer.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </button>

                                        <button 
                                            onClick={() => handleDelete(offer.id, offer.title)}
                                            title={language === 'ar' ? 'حذف العرض' : 'Delete Offer'}
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
                                <Tag className="w-12 h-12 text-gray-300" />
                                <span>{language === 'ar' ? 'لم يتم العثور على عروض تطابق بحثك.' : 'No offers found matching your search.'}</span>
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
                                        {editingOffer ? (language === 'ar' ? 'تعديل العرض' : 'Edit Offer') : (language === 'ar' ? 'إنشاء عرض جديد' : 'New Offer')}
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
                                        label={language === 'ar' ? 'صورة العرض / البانر' : 'Offer Banner Image'}
                                        folder="offers"
                                        shape="rectangle"
                                    />

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {language === 'ar' ? 'عنوان العرض' : 'Offer Title'}
                                            </label>
                                            <input 
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-rose-500 transition-all"
                                                placeholder={language === 'ar' ? 'مثال: خصم الصيف 50%' : 'e.g. Summer Sale 50%'}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {language === 'ar' ? 'وصف العرض' : 'Offer Description'}
                                            </label>
                                            <textarea 
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                rows={3}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-rose-500 transition-all resize-none"
                                                placeholder={language === 'ar' ? 'تفاصيل العرض...' : 'Offer details...'}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                    {language === 'ar' ? 'نسبة الخصم' : 'Discount %'}
                                                </label>
                                                <div className="relative">
                                                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input 
                                                        type="number"
                                                        value={formData.discountAmount}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: e.target.value }))}
                                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold dark:text-white outline-none focus:border-rose-500 transition-all text-left"
                                                        dir="ltr"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                    {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input 
                                                        type="date"
                                                        value={formData.validUntil}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold dark:text-white outline-none focus:border-rose-500 transition-all text-left"
                                                        dir="ltr"
                                                    />
                                                </div>
                                            </div>
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
                                            className="flex-[2] py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    {language === 'ar' ? 'حفظ العرض' : 'Save Offer'}
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
