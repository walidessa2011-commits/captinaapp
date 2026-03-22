"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    CreditCard, 
    Search, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    Clock,
    User,
    Package,
    Truck,
    Eye,
    X,
    Phone,
    Mail,
    MapPin,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import Pagination from '../components/Pagination';

export default function AdminOrders() {
    const { language, setAlert } = useApp();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Changed from isLoading to loading
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [selectedOrder, setSelectedOrder] = useState(null); // New state for selected order
    const [showDetailsModal, setShowDetailsModal] = useState(false); // New state for modal visibility

    const fetchOrders = async () => {
        setLoading(true); // Changed from setIsLoading to setLoading
        try {
            const ordersSnap = await getDocs(collection(db, "orders"));
            setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false); // Changed from setIsLoading to setLoading
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = (orderId) => {
        setAlert({
            title: language === 'ar' ? 'حذف الطلب' : 'Delete Order',
            message: language === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب نهائياً؟' : 'Are you sure you want to delete this order permanently?',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "orders", orderId));
                    setOrders(orders.filter(o => o.id !== orderId));
                } catch (error) {
                    console.error("Error deleting order:", error);
                    alert("Error deleting order");
                }
            }
        });
    };

    const handleUpdateStatus = async (orderId, newStatus, orderData) => {
        try {
            const statusTextMap = {
                processing: { ar: 'قيد المعالجة', en: 'Processing' },
                shipping: { ar: 'قيد الشحن والتوصيل', en: 'Shipping & Delivery' },
                delivered: { ar: 'تم التوصيل بنجاح', en: 'Delivered Successfully' },
                cancelled: { ar: 'تم إلغاء الطلب', en: 'Order Cancelled' }
            };

            const statusText = language === 'ar' ? statusTextMap[newStatus].ar : statusTextMap[newStatus].en;

            await updateDoc(doc(db, "orders", orderId), { 
                status: newStatus,
                statusText: statusText
            });

            // Create Notification for the user
            if (orderData.userId) {
                await addDoc(collection(db, "notifications"), {
                    userId: orderData.userId,
                    title: language === 'ar' ? 'تحديث حالة الطلب' : 'Order Status Update',
                    message: language === 'ar' 
                        ? `تم تحديث حالة طلبك #${orderId.slice(-6)} إلى: ${statusText}` 
                        : `Your order #${orderId.slice(-6)} status has been updated to: ${statusText}`,
                    type: 'alert',
                    read: false,
                    createdAt: serverTimestamp()
                });
            }

            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, statusText } : o));
            
            if (setAlert) {
                setAlert({
                    title: language === 'ar' ? 'تم التحديث' : 'Updated',
                    message: language === 'ar' ? 'تم تحديث حالة الطلب وإرسال إشعار للعميل.' : 'Order status updated and notification sent to customer.',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Error updating order status");
        }
    };

    const filteredOrders = orders.filter(order => 
        (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (order.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-rose-500" />
                        {language === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'تتبع طلبات المنتجات وتحديث حالة الدفع والشحن.' : 'Track product orders and update payment & shipping statuses.'}
                    </p>
                </div>
            </div>

            {/* Filters / Search */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-rose-500/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث برقم الطلب أو العميل...' : 'Search by order ID or customer name...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                    />
                </div>
            </div>

            {/* List */}
            {loading ? ( // Changed from isLoading to loading
                <div className="flex items-center justify-center p-20">
                    <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'المجموع' : 'Total'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-end">{language === 'ar' ? 'تحديث الحالة / إجراء' : 'Update / Action'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                <AnimatePresence>
                                    {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                                        <motion.tr 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={order.id} 
                                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100 dark:border-rose-500/20 shadow-sm">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider block max-w-[120px] truncate" title={order.id}>#{order.id.slice(-6)}</span>
                                                        <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mt-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {order.createdAt && typeof order.createdAt.toDate === 'function' ? 
                                                                order.createdAt.toDate().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : 
                                                                (order.createdAt instanceof Date ? order.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : (order.createdAt || 'N/A'))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 capitalize">
                                                        <User className="w-4 h-4 text-gray-400 shrink-0" />
                                                        {order.userName || 'Guest User'}
                                                    </span>
                                                    {order.userEmail && <span className="text-[11px] font-bold text-gray-500 ml-5.5">{order.userEmail}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-slate-900 dark:text-white whitespace-nowrap bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-xl">
                                                    {order.totalAmount || 0} {language === 'ar' ? 'ر.س' : 'SAR'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider 
                                                    ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                                    : order.status === 'shipping' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                    : order.status === 'cancelled' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' 
                                                    : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}
                                                >
                                                    {order.status === 'delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : order.status === 'shipping' ? <Truck className="w-3.5 h-3.5" /> : order.status === 'cancelled' ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                    {order.status === 'delivered' ? (language === 'ar' ? 'مكتمل' : 'Delivered') 
                                                    : order.status === 'shipping' ? (language === 'ar' ? 'قيد الشحن' : 'Shipping') 
                                                    : order.status === 'cancelled' ? (language === 'ar' ? 'ملغى' : 'Cancelled') 
                                                    : (language === 'ar' ? 'قيد المعالجة' : 'Processing')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-end">
                                                <div className="flex items-center justify-end gap-2 pr-2">
                                                    {/* Status Dropdown/Selector simplified into sequence buttons or direct select */}
                                                    <select 
                                                        value={order.status || 'processing'}
                                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value, order)}
                                                        className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-2 py-1.5 outline-none focus:border-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <option value="processing" className="dark:bg-[#0f172a]">{language === 'ar' ? 'قيد المعالجة' : 'Processing'}</option>
                                                        <option value="shipping" className="dark:bg-[#0f172a]">{language === 'ar' ? 'قيد الشحن' : 'Shipping'}</option>
                                                        <option value="delivered" className="dark:bg-[#0f172a]">{language === 'ar' ? 'مكتمل (تم التوصيل)' : 'Delivered'}</option>
                                                        <option value="cancelled" className="dark:bg-[#0f172a]">{language === 'ar' ? 'إلغاء الطلب' : 'Cancelled'}</option>
                                                    </select>
                                                    
                                                    {/* View items details */}
                                                    <button 
                                                        title={language === 'ar' ? 'عرض تفاصيل الطلب' : 'View Details'}
                                                        onClick={() => { setSelectedOrder(order); setShowDetailsModal(true); }} // Modified onClick
                                                        className="p-1.5 bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-primary dark:text-gray-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-bold">
                                                {language === 'ar' ? 'لم يتم العثور على طلبات.' : 'No orders found matching your criteria.'}
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Order Details Modal */}
            <AnimatePresence>
                {showDetailsModal && selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetailsModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-gray-100 dark:border-white/10"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                            {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
                                        </h2>
                                        <p className="text-emerald-500 font-bold text-sm tracking-widest mt-1">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowDetailsModal(false)}
                                        className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/40 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Customer Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-white/30">
                                            {language === 'ar' ? 'بيانات العميل' : 'Customer Info'}
                                        </h3>
                                        <div className="p-5 rounded-3xl border bg-gray-50 border-gray-100 dark:bg-white/5 dark:border-white/5">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-4 h-4 text-rose-500" /> {/* Changed text-primary to text-rose-500 for consistency */}
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.userName}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <Phone className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-gray-600 dark:text-white/60">{selectedOrder.userPhone || selectedOrder.phone}</span>
                                                </div>
                                                <div className="flex items-start gap-3 text-sm">
                                                    <MapPin className="w-4 h-4 text-rose-500" /> 
                                                    <span className="text-gray-600 dark:text-white/60">
                                                        {selectedOrder.deliveryInfo?.city || selectedOrder.city}, {selectedOrder.deliveryInfo?.address || selectedOrder.address}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-white/30">
                                            {language === 'ar' ? 'المنتجات' : 'Products'}
                                        </h3>
                                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                            {selectedOrder.itemsNames?.map((item, i) => (
                                                <div key={i} className="p-4 rounded-2xl border flex items-center gap-4 bg-gray-50 border-gray-100 dark:bg-white/5 dark:border-white/5">
                                                    <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center"> {/* Changed bg-primary/10 to bg-rose-500/10 for consistency */}
                                                        <Package className="w-5 h-5 text-rose-500" /> {/* Changed text-primary to text-rose-500 for consistency */}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold truncate max-w-[150px] text-gray-900 dark:text-white">{item}</p>
                                                        {selectedOrder.items && selectedOrder.items[i] && (
                                                            <p className="text-[10px] text-gray-500 uppercase font-black">
                                                                {selectedOrder.items[i].quantity} x {selectedOrder.items[i].price} {language === 'ar' ? 'ر.س' : 'SAR'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="mt-10 p-6 rounded-3xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black uppercase tracking-widest text-emerald-600/60 dark:text-emerald-400/60">
                                                {language === 'ar' ? 'الإجمالي الكلي' : 'Grand Total'}
                                            </p>
                                            <p className="text-3xl font-black text-gray-900 dark:text-white">
                                                {selectedOrder.totalPrice} {language === 'ar' ? 'ريال' : 'SAR'}
                                            </p>
                                        </div>
                                        <div className={`px-5 py-2 rounded-2xl border font-black text-xs uppercase tracking-tighter ${
                                            selectedOrder.paymentMethod === 'credit_card' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                        }`}>
                                            {selectedOrder.paymentMethod === 'credit_card' ? (language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card') : (language === 'ar' ? 'دفع عند الاستلام' : 'COD')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
