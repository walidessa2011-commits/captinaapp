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
    Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "../components/ImageUpload";
import { Loader2 } from 'lucide-react';

export default function AdminProducts() {
    const { language, setAlert } = useApp();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '0',
        stock: '0',
        image: '',
        description: '',
        status: 'active',
        productCode: '',
        sizes: '',
        colors: '',
        favoritesCount: '0'
    });

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
                name: product.name || '',
                category: product.category || '',
                price: String(product.price || 0),
                stock: String(product.stock || 0),
                image: product.image || '',
                description: product.description || '',
                status: product.status || 'active',
                productCode: product.productCode || '',
                sizes: product.sizes || '',
                colors: product.colors || '',
                favoritesCount: String(product.favoritesCount || 0)
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: '',
                price: '0',
                stock: '0',
                image: '',
                description: '',
                status: 'active',
                productCode: '',
                sizes: '',
                colors: '',
                favoritesCount: '0'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

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
        (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                {/* Optional logic for adding products */}
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
                                <AnimatePresence>
                                    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                        <motion.tr 
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
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white capitalize line-clamp-1">{product.name || 'Unnamed Product'}</span>
                                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg w-fit mt-1">
                                                            <Tag className="w-3 h-3" />
                                                            {product.category || 'General'}
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
                                                    {/* Toggle Display */}
                                                    <button 
                                                        onClick={() => handleToggleStatus(product.id, product.status)}
                                                        title={language === 'ar' ? 'تغيير العرض' : 'Toggle Visibility'}
                                                        className="p-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-blue-500/10 hover:text-blue-500 rounded-xl transition-colors"
                                                    >
                                                        {product.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                                    </button>
                                                    
                                                    {/* Edit */}
                                                    <button 
                                                        onClick={() => handleOpenModal(product)}
                                                        title={language === 'ar' ? 'تعديل المنتج' : 'Edit Product'}
                                                        className="p-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-blue-500/10 hover:text-blue-500 rounded-xl transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>

                                                    {/* Delete */}
                                                    <button 
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        title={language === 'ar' ? 'حذف المنتج' : 'Delete Product'}
                                                        className="p-2 bg-gray-100 dark:bg-white/10 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-bold">
                                                {language === 'ar' ? 'لم يتم العثور على منتجات تطابق بحثك.' : 'No products found matching your search.'}
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
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
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        {editingProduct ? (language === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
                                    </h2>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <XCircle className="w-6 h-6 text-gray-400" />
                                    </button>
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
                                                {language === 'ar' ? 'وصف المنتج' : 'Product Description'}
                                            </label>
                                            <textarea 
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                rows={4}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all resize-none"
                                                placeholder={language === 'ar' ? 'اكتب تفاصيل المنتج هنا...' : 'Enter product details here...'}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {language === 'ar' ? 'اسم المنتج' : 'Product Name'}
                                            </label>
                                            <input 
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                placeholder={language === 'ar' ? 'مثال: قفازات ملاكمة' : 'e.g. Boxing Gloves'}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                                                {language === 'ar' ? 'التصنيف' : 'Category'}
                                            </label>
                                            <input 
                                                type="text"
                                                value={formData.category}
                                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                placeholder={language === 'ar' ? 'مثال: معدات رياضية' : 'e.g. Equipment'}
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

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1">
                                                    <Maximize className="w-3 h-3" />
                                                    {language === 'ar' ? 'المقاسات' : 'Sizes'}
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={formData.sizes}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                    placeholder={language === 'ar' ? 'S, M, L' : 'S, M, L'}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1">
                                                    <Palette className="w-3 h-3" />
                                                    {language === 'ar' ? 'الألوان' : 'Colors'}
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={formData.colors}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, colors: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                                                    placeholder={language === 'ar' ? 'أحمر، أزرق' : 'Red, Blue'}
                                                />
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
