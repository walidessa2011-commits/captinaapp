"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    CalendarCheck, 
    Search, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    Clock,
    User,
    Activity,
    CreditCard,
    Eye,
    Phone,
    Mail,
    MapPin,
    Calendar,
    X,
    Edit2,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where, addDoc } from "firebase/firestore";
import Pagination from '../components/Pagination';

export default function AdminBookings() {
    const { language, setAlert, darkMode } = useApp();
    const [bookings, setBookings] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            const bookingsSnap = await getDocs(collection(db, "bookings"));
            const bData = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'booking' }));

            const subsSnap = await getDocs(collection(db, "subscriptions"));
            const sData = subsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'subscription' }));

            const combined = [...bData, ...sData].sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });

            setBookings(combined);

            // Fetch users who have bookings
            const userIds = [...new Set(combined.map(b => b.userId).filter(Boolean))];
            if (userIds.length > 0) {
                // Firestore "in" query limited to 30. For simplicity in admin, if small scale, it's fine.
                // For larger scale, we'd fetch in batches of 30.
                const map = {};
                for (let i = 0; i < userIds.length; i += 30) {
                    const batch = userIds.slice(i, i + 30);
                    const usersQuery = query(collection(db, "users"), where("uid", "in", batch));
                    const usersSnap = await getDocs(usersQuery);
                    usersSnap.docs.forEach(d => {
                        const u = d.data();
                        map[u.uid] = u;
                    });
                }
                setUsersMap(map);
            }
        } catch (error) {
            console.error("Error fetching admin bookings:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [language, setAlert]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleDelete = (itemId) => {
        const item = bookings.find(b => b.id === itemId);
        if (!item) return;

        setAlert({
            title: language === 'ar' ? 'حذف السجل' : 'Delete Record',
            message: language === 'ar' ? 'هل أنت متأكد من حذف هذا السجل نهائياً؟' : 'Are you sure you want to delete this record permanently?',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    const collectionName = item.type === 'subscription' ? "subscriptions" : "bookings";
                    await deleteDoc(doc(db, collectionName, itemId));
                    setBookings(bookings.filter(b => b.id !== itemId));
                    if (selectedBooking?.id === itemId) setSelectedBooking(null);
                } catch (error) {
                    console.error("Error deleting:", error);
                }
            }
        });
    };

    const handleUpdateStatus = async (itemId, newStatus) => {
        const item = bookings.find(b => b.id === itemId);
        if (!item) return;

        setIsSaving(true);
        try {
            const collectionName = item.type === 'subscription' ? "subscriptions" : "bookings";
            await updateDoc(doc(db, collectionName, itemId), { status: newStatus });
            
            setBookings(prev => prev.map(b => b.id === itemId ? { ...b, status: newStatus } : b));
            if (selectedBooking?.id === itemId) {
                setSelectedBooking({ ...selectedBooking, status: newStatus });
            }

            // Send notification to user
            try {
                const isConfirmed = newStatus.toLowerCase().includes('confirm');
                const title_ar = isConfirmed ? 'تم قبول حجزك!' : 'تم رفض الحجز';
                const title_en = isConfirmed ? 'Booking Confirmed!' : 'Booking Rejected';
                const msg_ar = isConfirmed 
                    ? `تم قبول حجزك لـ ${item.planLabel || item.trainerName || item.gymName || 'الخدمة'}` 
                    : `نعتذر، تم رفض حجزك لـ ${item.planLabel || item.trainerName || item.gymName || 'الخدمة'}. يرجى التواصل معنا للمزيد.`;
                const msg_en = isConfirmed 
                    ? `Your booking for ${item.planLabel || item.trainerName || item.gymName || 'Service'} has been confirmed!` 
                    : `Sorry, your booking for ${item.planLabel || item.trainerName || item.gymName || 'Service'} was rejected. Please contact us for more info.`;

                await addDoc(collection(db, "notifications"), {
                    userId: item.userId,
                    title_ar,
                    title_en,
                    message_ar: msg_ar,
                    message_en: msg_en,
                    type: isConfirmed ? 'success' : 'error',
                    read: false,
                    createdAt: new Date(),
                    bookingId: itemId
                });
            } catch (err) {
                console.error("Error sending notification:", err);
            }
            
            setAlert({
                title: language === 'ar' ? 'تم التحديث' : 'Updated',
                message: language === 'ar' ? 'تم تحديث حالة الحجز بنجاح' : 'Booking status updated successfully',
                type: 'success'
            });
        } catch (error) {
            console.error("Error updating status:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };
    const handleUpdateBooking = async () => {
        if (!selectedBooking) return;
        setIsSaving(true);
        try {
            const collectionName = selectedBooking.type === 'subscription' ? "subscriptions" : "bookings";
            await updateDoc(doc(db, collectionName, selectedBooking.id), editedData);
            
            setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, ...editedData } : b));
            setSelectedBooking(prev => ({ ...prev, ...editedData }));
            setIsEditing(false);
            
            setAlert({
                title: language === 'ar' ? 'تم التحديث' : 'Updated',
                message: language === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully',
                type: 'success'
            });
        } catch (error) {
            console.error("Error updating booking:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'فشل تحديث البيانات' : 'Failed to update data',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const formatAddress = (addr) => {
        if (!addr) return "";
        if (typeof addr === 'string') return addr;
        if (typeof addr === 'object') {
            const { street, district, building, city } = addr;
            return [district, street, building, city].filter(Boolean).join(', ');
        }
        return String(addr);
    };

    const filteredBookings = bookings.filter(booking => {
        const user = usersMap[booking.userId] || {};
        const userName = booking.clientName || booking.userName || user.fullName || '';
        const userPhone = user.phone || booking.phone || '';
        const userEmail = user.email || '';
        const providerName = booking.trainerName || booking.gymName || '';
        const planName = booking.planLabel || '';
        
        const search = searchTerm.toLowerCase();
        return (
            userName.toLowerCase().includes(search) ||
            userPhone.includes(search) ||
            userEmail.toLowerCase().includes(search) ||
            providerName.toLowerCase().includes(search) ||
            planName.toLowerCase().includes(search)
        );
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        <CalendarCheck className="w-8 h-8 text-purple-500" />
                        {language === 'ar' ? 'إدارة الحجوزات' : 'Bookings Management'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'متابعة حجوزات النوادي والمدربين، وتأكيد أو إلغاء المواعيد مع بيانات العملاء.' : 'Track gym and trainer bookings, confirm or cancel appointments with customer data.'}
                    </p>
                </div>
            </div>

            {/* Filters / Search */}
            <div className={`p-4 rounded-[2rem] border transition-all ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-premium'}`}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-transparent focus-within:border-purple-500/20 transition-all ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث باسم العميل، الهاتف، الإيميل أو مقدم الخدمة...' : 'Search by customer, phone, email or provider...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                    />
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className={`rounded-[2rem] border overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-premium'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className={`border-b transition-colors ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'التفاصيل' : 'Details'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'السعر/الوقت' : 'Price / Time'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-white/10' : 'divide-gray-100'}`}>
                                <AnimatePresence>
                                    {paginatedBookings.length > 0 ? paginatedBookings.map((booking) => {
                                        const user = usersMap[booking.userId] || {};
                                        return (
                                            <motion.tr 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={booking.id} 
                                                className={`transition-all group ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-6 py-4" onClick={() => setSelectedBooking(booking)}>
                                                    <div className="flex items-center gap-4 cursor-pointer">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${booking.type === 'subscription' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 border-amber-100 dark:border-amber-500/20' : 'bg-purple-50 dark:bg-purple-500/10 text-purple-500 border-purple-100 dark:border-purple-500/20'}`}>
                                                            {booking.type === 'subscription' ? <CreditCard className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{booking.type === 'subscription' ? (booking.planLabel || 'Premium Plan') : (booking.trainerName || booking.gymName || 'Service Provider')}</span>
                                                            <span className="text-[11px] font-bold text-gray-500">{booking.sportName || booking.sportType || (booking.type === 'subscription' ? 'Plan Subscription' : 'General Session')}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-gray-200">
                                                            <User className="w-3.5 h-3.5 text-purple-500" />
                                                            {booking.clientName || booking.userName || user.fullName || 'Unknown User'}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-500 mt-0.5">{user.phone || booking.phone || (language === 'ar' ? 'بدون هاتف' : 'No phone')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-1.5">
                                                            <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                                                            {booking.totalPrice || 0} {language === 'ar' ? 'ر.س' : 'SAR'}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {booking.createdAt && typeof booking.createdAt.toDate === 'function' ? 
                                                                booking.createdAt.toDate().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : 
                                                                (booking.createdAt instanceof Date ? booking.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : (booking.createdAt || 'N/A'))}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider 
                                                        ${(booking.status === 'confirmed' || booking.status === 'Confirmed') ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                                        : (booking.status === 'cancelled' || booking.status === 'Cancelled') ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' 
                                                        : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}
                                                    >
                                                        {(booking.status === 'confirmed' || booking.status === 'Confirmed') ? <CheckCircle2 className="w-3.5 h-3.5" /> : (booking.status === 'cancelled' || booking.status === 'Cancelled') ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                        {(booking.status === 'confirmed' || booking.status === 'Confirmed') ? (language === 'ar' ? 'مقبول' : 'Accepted') 
                                                        : (booking.status === 'cancelled' || booking.status === 'Cancelled') ? (language === 'ar' ? 'مرفوض' : 'Rejected') 
                                                        : (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-end">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 rounded-xl transition-colors"
                                                            title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {(booking.status === 'Pending' || booking.status === 'قيد الانتظار' || !booking.status) && (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(booking.id, booking.type === 'subscription' ? 'confirmed' : 'Confirmed')}
                                                                    title={language === 'ar' ? 'قبول' : 'Accept'}
                                                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-xl transition-colors"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(booking.id, booking.type === 'subscription' ? 'cancelled' : 'Cancelled')}
                                                                    title={language === 'ar' ? 'رفض' : 'Reject'}
                                                                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl transition-colors"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        
                                                        {/* Delete */}
                                                        <button 
                                                            onClick={() => handleDelete(booking.id)}
                                                            title={language === 'ar' ? 'حذف السجل' : 'Delete Record'}
                                                            className="p-2 border border-rose-100 text-rose-400 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-bold">
                                                {language === 'ar' ? 'لم يتم العثور على حجوزات تطابق بحثك.' : 'No bookings found matching your search.'}
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

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`${darkMode ? 'bg-[#1a2235]' : 'bg-white'} w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border ${darkMode ? 'border-white/10' : 'border-gray-100'} max-h-[90vh] overflow-y-auto`}
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-lg ${selectedBooking.status?.toLowerCase().includes('confirm') ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-purple-600 shadow-purple-600/20'}`}>
                                            <CalendarCheck className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                                                {selectedBooking.gymName || selectedBooking.trainerName || (language === 'ar' ? 'تفاصيل السجل' : 'Record Details')}
                                            </h2>
                                            <p className="text-[10px] font-black uppercase text-purple-500 tracking-[0.2em]">
                                                {selectedBooking.type === 'subscription' ? (language === 'ar' ? 'اشتراك' : 'Subscription') : (language === 'ar' ? 'حجز جلسة' : 'Session Booking')}
                                                {` • #${selectedBooking.id.slice(0, 6)}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => {
                                                if(isEditing) {
                                                    handleUpdateBooking();
                                                } else {
                                                    setIsEditing(true);
                                                    setEditedData(selectedBooking);
                                                }
                                            }}
                                            className={`p-3 rounded-2xl border transition-all ${isEditing ? 'bg-emerald-500 border-emerald-500 text-white' : (darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400' : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600')}`}
                                        >
                                            {isEditing ? <Check className="w-5 h-5 shadow-sm" /> : <Edit2 className="w-5 h-5" />}
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setSelectedBooking(null);
                                                setIsEditing(false);
                                            }}
                                            className={`p-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-rose-500/10 text-gray-400 hover:text-rose-500' : 'bg-gray-50 border-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-500'}`}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Personal Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest border-l-4 border-purple-500 pl-3">
                                            {language === 'ar' ? 'بيانات العميل' : 'Customer Information'}
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 overflow-hidden border border-purple-500/20">
                                                        {usersMap[selectedBooking.userId]?.photoURL ? (
                                                            <img src={usersMap[selectedBooking.userId].photoURL} className="w-full h-full object-cover" alt="User" />
                                                        ) : (
                                                            <User className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الاسم' : 'Full Name'}</p>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                                            {selectedBooking.clientName || selectedBooking.userName || usersMap[selectedBooking.userId]?.fullName || '---'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                        <Phone className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'رقم الجوال' : 'Phone Number'}</p>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200" dir="ltr">
                                                            {usersMap[selectedBooking.userId]?.phone || selectedBooking.phone || '---'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                        <Mail className="w-5 h-5" />
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الإيميل' : 'Email Address'}</p>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">
                                                            {usersMap[selectedBooking.userId]?.email || (language === 'ar' ? 'غير مسجل' : 'Not Provided')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest border-l-4 border-amber-500 pl-3">
                                            {language === 'ar' ? 'تفاصيل الحجز' : 'Booking Details'}
                                        </h3>

                                        <div className="space-y-4">
                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الموعد' : 'Schedule'}</p>
                                                        {isEditing ? (
                                                            <div className="flex flex-col sm:flex-row gap-2 mt-1">
                                                                <input 
                                                                    type="text"
                                                                    className="bg-transparent border-b border-purple-500/50 outline-none font-bold text-sm dark:text-white"
                                                                    value={editedData.date || editedData.startDate || ''}
                                                                    placeholder={language === 'ar' ? 'التاريخ' : 'Date'}
                                                                    onChange={(e) => setEditedData({...editedData, [selectedBooking.type === 'subscription' ? 'startDate' : 'date']: e.target.value})}
                                                                />
                                                                <input 
                                                                    type="text"
                                                                    className="bg-transparent border-b border-purple-500/50 outline-none font-bold text-sm dark:text-white"
                                                                    value={editedData.time || ''}
                                                                    placeholder={language === 'ar' ? 'الوقت' : 'Time'}
                                                                    onChange={(e) => setEditedData({...editedData, time: e.target.value})}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                                                {selectedBooking.date || selectedBooking.startDate || '---'} | {selectedBooking.time || '---'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                        <MapPin className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الموقع' : 'Location'}</p>
                                                        {isEditing ? (
                                                            <input 
                                                                type="text"
                                                                className="bg-transparent border-b border-purple-500/50 outline-none font-bold text-sm dark:text-white w-full mt-1"
                                                                value={editedData.selectedGym?.name || formatAddress(editedData.address) || ''}
                                                                onChange={(e) => {
                                                                    if (editedData.selectedGym) {
                                                                        setEditedData({...editedData, selectedGym: {...editedData.selectedGym, name: e.target.value}});
                                                                    } else {
                                                                        setEditedData({...editedData, address: e.target.value});
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                                                {selectedBooking.selectedGym?.name || formatAddress(selectedBooking.address) || (language === 'ar' ? 'نادي كابتينا الرئيسي' : 'Captina Main Club')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                                        <CreditCard className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'التكلفة الإجمالية' : 'Total Cost'}</p>
                                                        {isEditing ? (
                                                            <input 
                                                                type="number"
                                                                className="bg-transparent border-b border-purple-500/50 outline-none font-bold text-lg text-rose-50 w-24 mt-1"
                                                                value={editedData.totalPrice || 0}
                                                                onChange={(e) => setEditedData({...editedData, totalPrice: parseFloat(e.target.value)})}
                                                            />
                                                        ) : (
                                                            <p className="font-black text-lg text-rose-500">
                                                                {selectedBooking.totalPrice || 0} {language === 'ar' ? 'ر.س' : 'SAR'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                { (selectedBooking.notes || isEditing) && (
                                    <div className={`mt-8 p-4 rounded-2xl border border-dashed ${darkMode ? 'bg-white/5 border-white/10' : 'bg-purple-50 border-purple-100'}`}>
                                        <p className="text-[10px] uppercase font-black text-purple-500 tracking-widest mb-2">{language === 'ar' ? 'ملاحظات إضافية' : 'Extra Notes'}</p>
                                        {isEditing ? (
                                            <textarea 
                                                className="w-full bg-transparent border-b border-purple-500/30 outline-none text-sm font-bold text-gray-600 dark:text-gray-300 min-h-[80px] resize-none"
                                                value={editedData.notes || ''}
                                                onChange={(e) => setEditedData({...editedData, notes: e.target.value})}
                                                placeholder={language === 'ar' ? 'أضف ملاحظاتك هنا...' : 'Add your notes here...'}
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-gray-600 dark:text-gray-300 italic">"{selectedBooking.notes}"</p>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons in Modal */}
                                <div className="mt-10 flex flex-wrap gap-4">
                                    {(selectedBooking.status === 'Pending' || selectedBooking.status === 'قيد الانتظار' || !selectedBooking.status) ? (
                                        <>
                                            <button 
                                                disabled={isSaving}
                                                onClick={() => handleUpdateStatus(selectedBooking.id, selectedBooking.type === 'subscription' ? 'confirmed' : 'Confirmed')}
                                                className="flex-1 min-w-[150px] bg-emerald-500 text-white font-black py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                                {language === 'ar' ? 'قبول الحجز' : 'Accept Booking'}
                                            </button>
                                            <button 
                                                disabled={isSaving}
                                                onClick={() => handleUpdateStatus(selectedBooking.id, selectedBooking.type === 'subscription' ? 'cancelled' : 'Cancelled')}
                                                className="flex-1 min-w-[150px] bg-rose-500 text-white font-black py-4 rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                {language === 'ar' ? 'رفض الحجز' : 'Reject Booking'}
                                            </button>
                                        </>
                                    ) : (
                                        <div className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border ${selectedBooking.status.toLowerCase().includes('confirm') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                            {selectedBooking.status.toLowerCase().includes('confirm') ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                            <span className="font-black uppercase tracking-widest">
                                                {language === 'ar' ? 'حالة الحجز الحالية: ' : 'Current Status: '}
                                                {selectedBooking.status.toLowerCase().includes('confirm') ? (language === 'ar' ? 'مقبول' : 'Accepted') : (language === 'ar' ? 'مرفوض' : 'Rejected')}
                                            </span>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(selectedBooking.id)}
                                        className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-rose-500/10 text-rose-400' : 'bg-gray-50 border-gray-100 hover:bg-rose-50 text-rose-500'}`}
                                        title={language === 'ar' ? 'حذف' : 'Delete'}
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

