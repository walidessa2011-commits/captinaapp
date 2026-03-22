"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    ShoppingBag, 
    Search, 
    MoreVertical, 
    Trash2, 
    Edit, 
    CheckCircle2, 
    XCircle,
    Plus,
    Tag,
    Image as ImageIcon,
    Hash,
    Palette,
    Maximize,
    Heart,
    Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "../components/ImageUpload";
import { Loader2 } from 'lucide-react';

import Pagination from '../components/Pagination';

export default function AdminProducts() {
    const { language, setAlert } = useApp();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formLang, setFormLang] = useState('ar'); // Language toggle for form inputs
    const [formData, setFormData] = useState({
        name: { ar: '', en: '' },
        category: { ar: '', en: '' },
        price: '0',
        stock: '0',
        image: '',
        description: { ar: '', en: '' },
        status: 'active',
        productCode: '',
        sizes: [],
        colors: [],
        favoritesCount: '0'
    });

    // Helper: get display text from bilingual or plain string
    const getText = (val) => {
        if (typeof val === 'object' && val !== null) {
            return val[language] || val['ar'] || val['en'] || '';
        }
        return val || '';
    };

    // Helper: normalize to bilingual object
    const normalizeText = (val) => {
        if (typeof val === 'object' && val !== null) return { ar: val.ar || '', en: val.en || '' };
        return { ar: val || '', en: val || '' };
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const productsSnap = await getDocs(collection(db, "products"));
            setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggleStatus = async (productId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateDoc(doc(db, "products", productId), {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
            setProducts(products.map(p => p.id === productId ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error("Error toggling status:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'فشل في تغيير حالة المنتج' : 'Failed to toggle product status',
                type: 'error'
            });
        }
    };

    const handleDelete = (productId, productName) => {
        setAlert({
            title: language === 'ar' ? 'حذف المنتج' : 'Delete Product',
            message: language === 'ar' ? `هل أنت متأكد من حذف المنتج "${productName}"؟` : `Are you sure you want to delete the product "${productName}"?`,
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "products", productId));
                    setProducts(products.filter(p => p.id !== productId));
                } catch (error) {
                    console.error("Error deleting product:", error);
                    alert("Error deleting product");
                }
            }
        });
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: normalizeText(product.name),
                category: normalizeText(product.category),
                price: String(product.price || 0),
                stock: String(product.stock || 0),
                image: product.image || '',
                description: normalizeText(product.description),
                status: product.status || 'active',
                productCode: product.productCode || '',
                sizes: Array.isArray(product.sizes) ? product.sizes : (product.sizes ? product.sizes.split(',').map(s => s.trim()) : []),
                colors: Array.isArray(product.colors) ? product.colors : [],
                favoritesCount: String(product.favoritesCount || 0)
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: { ar: '', en: '' },
                category: { ar: '', en: '' },
                price: '0',
                stock: '0',
                image: '',
                description: { ar: '', en: '' },
                status: 'active',
                productCode: '',
                sizes: [],
                colors: [],
                favoritesCount: '0'
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
            const productData = {
                ...formData,
                price: Number(formData.price) || 0,
                stock: Number(formData.stock) || 0,
                favoritesCount: Number(formData.favoritesCount) || 0,
                updatedAt: serverTimestamp()
            };

            if (editingProduct) {
                await updateDoc(doc(db, "products", editingProduct.id), productData);
                setAlert({
                    title: language === 'ar' ? 'تم التحديث' : 'Updated',
                    message: language === 'ar' ? 'تم تحديث المنتج بنجاح.' : 'Product updated successfully.',
                    type: 'success'
                });
            } else {
                productData.createdAt = serverTimestamp();
                await addDoc(collection(db, "products"), productData);
                setAlert({
                    title: language === 'ar' ? 'تمت الإضافة' : 'Added',
                    message: language === 'ar' ? 'تم إضافة المنتج الجديد بنجاح.' : 'New product added successfully.',
                    type: 'success'
                });
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'حدث خطأ أثناء حفظ البيانات.' : 'Error saving product data.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const filteredProducts = products.filter(product => 
        getText(product.name).toLowerCase().includes(searchTerm.toLowerCase()) || 
        getText(product.category).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Language Toggle Component
    const LangToggle = () => (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
            <button 
                type="button"
                onClick={() => setFormLang('ar')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formLang === 'ar' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-blue-500'}`}
            >
                عربي
            </button>
            <button 
                type="button"
                onClick={() => setFormLang('en')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formLang === 'en' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-blue-500'}`}
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
                        <ShoppingBag className="w-8 h-8 text-blue-500" />
                        {language === 'ar' ? 'إدارة المنتجات' : 'Products Management'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'إضافة منتجات المتجر، التعديل على المخزون والسعر، وتحديد الحالة.' : 'Add store products, modify inventory and prices, and manage active status.'}
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl transition-colors shadow-lg shadow-blue-500/30 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'ar' ? 'إضافة منتج' : 'Add New Product'}</span>
                </button>
            </div>

            {/* Filters / Search */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-blue-500/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث باسم المنتج أو التصنيف...' : 'Search by product name or category...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                    />
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'المنتج' : 'Product'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'السعر' : 'Price'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'المخزون' : 'Stock'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                <AnimatePresence mode="popLayout">
                                    {paginatedProducts.length > 0 ? paginatedProducts.map((product) => (
                                         <motion.tr 
                                             layout
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             exit={{ opacity: 0 }}
                                             key={product.id} 
                                             className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                         >
                                             <td className="px-6 py-4">
                                                 <div className="flex items-center gap-4">
                                                     <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/5 flex items-center justify-center shrink-0">
                                                         {product.image ? (
                                                             <img src={product.image} alt={getText(product.name)} className="w-full h-full object-cover" />
                                                         ) : (
                                                             <ImageIcon className="w-6 h-6 text-gray-400" />
                                                         )}
                                                     </div>
                                                     <div className="flex flex-col">
                                                         <span className="text-sm font-black text-slate-900 dark:text-white capitalize line-clamp-1">{getText(product.name) || 'Unnamed Product'}</span>
                                                         <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg w-fit mt-1">
                                                             <Tag className="w-3 h-3" />
                                                             {getText(product.category) || 'General'}
                                                         </div>
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className="px-6 py-4">
                                                 <span className="text-sm font-black text-slate-900 dark:text-white whitespace-nowrap">
                                                     {product.price || 0} {language === 'ar' ? 'ر.س' : 'SAR'}
                                                 </span>
                                             </td>
                                             <td className="px-6 py-4">
                                                 <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${product.stock > 10 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : product.stock > 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                                     {product.stock || 0} {language === 'ar' ? 'وحدة' : 'Units'}
                                                 </span>
                                             </td>
                                             <td className="px-6 py-4">
                                                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${product.status === 'active' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'}`}>
                                                     {product.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                     {product.status === 'active' ? (language === 'ar' ? 'متاح' : 'Available') : (language === 'ar' ? 'مخفي' : 'Hidden')}
                                                 </span>
                                             </td>
                                             <td className="px-6 py-4 text-end">
                                                 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                     <button 
                                                         onClick={() => handleToggleStatus(product.id, product.status)}
                                                         title={language === 'ar' ? 'تغيير العرض' : 'Toggle Visibility'}
                                                         className="p-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-blue-500/10 hover:text-blue-500 rounded-xl transition-colors"
                                                     >
                                                         {product.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                                     </button>
                                                     <button 
                                                         onClick={() => handleOpenModal(product)}
                                                         title={language === 'ar' ? 'تعديل المنتج' : 'Edit Product'}
                                                         className="p-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-blue-500/10 hover:text-blue-500 rounded-xl transition-colors"
                                                     >
                                                         <Edit className="w-4 h-4" />
                                                     </button>
                                                     <button 
                                                         onClick={() => handleDelete(product.id, getText(product.name))}
                                                         title={language === 'ar' ? 'حذف المنتج' : 'Delete Product'}
                                                         className="p-2 bg-gray-100 dark:bg-white/10 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                                                     >
                                                         <Trash2 className="w-4 h-4" />
                                                     </button>
                                                 </div>
                                             </td>
                                         </motion.tr>
                                     )) : (
                                         <motion.tr 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                         >
                                             <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-bold">
                                                 {language === 'ar' ? 'لم يتم العثور على منتجات تطابق بحثك.' : 'No products found matching your search.'}
                                             </td>
                                         </motion.tr>
                                     )}
                                 </AnimatePresence>
                             </tbody>
                        </table>
                        <Pagination 
                             currentPage={currentPage}
                             totalPages={totalPages}
                             onPageChange={setCurrentPage}
                         />
                    </div>
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
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10"
                        >
                            <div className="p-8 max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        {editingProduct ? (language === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
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
                                <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                                    <Languages className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                                        {formLang === 'ar' ? 'أنت تكتب الآن باللغة العربية' : 'You are now typing in English'}
                                    </span>
                                </div>

                                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <ImageUpload 
                                            value={formData.image}
                                            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                            label={language === 'ar' ? 'صورة المنتج' : 'Product Image'}
                                            folder="products"
                                            shape="rectangle"
                                        />
                                        
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {formLang === 'ar' ? 'وصف المنتج (عربي)' : 'Product Description (English)'}
                                            </label>
                                            <textarea 
                                                value={formData.description[formLang]}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, [formLang]: e.target.value } }))}
                                                rows={4}
                                                dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all resize-none"
                                                placeholder={formLang === 'ar' ? 'اكتب تفاصيل المنتج هنا...' : 'Enter product details here...'}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {formLang === 'ar' ? 'اسم المنتج (عربي)' : 'Product Name (English)'}
                                            </label>
                                            <input 
                                                type="text"
                                                required={formLang === 'ar'}
                                                value={formData.name[formLang]}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: { ...prev.name, [formLang]: e.target.value } }))}
                                                dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                placeholder={formLang === 'ar' ? 'مثال: قفازات ملاكمة' : 'e.g. Boxing Gloves'}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {formLang === 'ar' ? 'التصنيف (عربي)' : 'Category (English)'}
                                            </label>
                                            <input 
                                                type="text"
                                                value={formData.category[formLang]}
                                                onChange={(e) => setFormData(prev => ({ ...prev, category: { ...prev.category, [formLang]: e.target.value } }))}
                                                dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                placeholder={formLang === 'ar' ? 'مثال: معدات رياضية' : 'e.g. Equipment'}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                    {language === 'ar' ? 'السعر' : 'Price'}
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all text-left"
                                                    dir="ltr"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                    {language === 'ar' ? 'المخزون' : 'Stock'}
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all text-left"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1">
                                                    <Hash className="w-3 h-3" />
                                                    {language === 'ar' ? 'رمز المنتج' : 'Product Code'}
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={formData.productCode}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, productCode: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                    placeholder="e.g. PROD-001"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1">
                                                    <Heart className="w-3 h-3" />
                                                    {language === 'ar' ? 'المفضلات' : 'Favorites'}
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.favoritesCount}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, favoritesCount: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all text-left"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Maximize className="w-3 h-3" />
                                                        {language === 'ar' ? 'المقاسات المتاحة' : 'Available Sizes'}
                                                    </div>
                                                    <span className="text-[10px] lowercase text-gray-400 font-bold italic">
                                                        {language === 'ar' ? '(اضغط Enter للإضافة)' : '(Press Enter to add)'}
                                                    </span>
                                                </label>
                                                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus-within:border-blue-500 transition-all min-h-[52px]">
                                                    {formData.sizes.map((size, index) => (
                                                        <span key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                                                            {size}
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setFormData(p => ({ ...p, sizes: p.sizes.filter((_, i) => i !== index) }))}
                                                                className="hover:text-rose-200 transition-colors"
                                                            >
                                                                <XCircle className="w-3 h-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <input 
                                                        type="text"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const val = e.target.value.trim();
                                                                if (val && !formData.sizes.includes(val)) {
                                                                    setFormData(p => ({ ...p, sizes: [...p.sizes, val] }));
                                                                    e.target.value = '';
                                                                }
                                                            }
                                                        }}
                                                        className="bg-transparent border-none outline-none flex-1 text-sm font-bold dark:text-white min-w-[60px]"
                                                        placeholder={formData.sizes.length === 0 ? (language === 'ar' ? 'أضف مقاس...' : 'Add size...') : ''}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1">
                                                    <Palette className="w-3 h-3" />
                                                    {language === 'ar' ? 'الألوان المتاحة' : 'Available Colors'}
                                                </label>
                                                
                                                <div className="flex flex-wrap gap-3">
                                                    {formData.colors.map((color, index) => (
                                                        <div key={index} className="flex flex-col items-center gap-1 group relative">
                                                            <div className="w-10 h-10 rounded-xl border-2 border-white/10 shadow-lg p-1 group-hover:scale-105 transition-transform">
                                                                <div className="w-full h-full rounded-lg" style={{ backgroundColor: color.code }} />
                                                            </div>
                                                            <span className="text-[8px] font-black text-gray-400 truncate w-12 text-center uppercase tracking-widest">
                                                                {language === 'ar' ? color.name_ar : color.name_en}
                                                            </span>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setFormData(p => ({ ...p, colors: p.colors.filter((_, i) => i !== index) }))}
                                                                className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <XCircle className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/10 space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{language === 'ar' ? 'اللون' : 'Color'}</label>
                                                            <input 
                                                                type="color" 
                                                                id="colorPicker"
                                                                defaultValue="#3B82F6"
                                                                className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer outline-none block"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{language === 'ar' ? 'اسم اللون (عربي)' : 'Name (AR)'}</label>
                                                            <input 
                                                                type="text" 
                                                                id="colorNameAr"
                                                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 px-3 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                                placeholder={language === 'ar' ? 'مثال: أحمر' : 'Red'}
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{language === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</label>
                                                            <input 
                                                                type="text" 
                                                                id="colorNameEn"
                                                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 px-3 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                                placeholder="Red"
                                                            />
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const code = document.getElementById('colorPicker').value;
                                                                const name_ar = document.getElementById('colorNameAr').value.trim();
                                                                const name_en = document.getElementById('colorNameEn').value.trim();
                                                                if (name_ar || name_en) {
                                                                    setFormData(p => ({ 
                                                                        ...p, 
                                                                        colors: [...p.colors, { code, name_ar: name_ar || name_en, name_en: name_en || name_ar }] 
                                                                    }));
                                                                    document.getElementById('colorNameAr').value = '';
                                                                    document.getElementById('colorNameEn').value = '';
                                                                }
                                                            }}
                                                            className="self-end mb-0.5 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-6">
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
                                                className="flex-[2] py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        {language === 'ar' ? 'حفظ المنتج' : 'Save Product'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
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
