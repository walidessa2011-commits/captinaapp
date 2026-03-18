"use client";
import React, { useState, useEffect } from 'react';
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
    CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function AdminBookings() {
    const { language, setAlert } = useApp();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const bookingsSnap = await getDocs(collection(db, "bookings"));
            setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = (bookingId) => {
        setAlert({
            title: language === 'ar' ? 'حذف الحجز' : 'Delete Booking',
            message: language === 'ar' ? 'هل أنت متأكد من حذف هذا الحجز نهائياً؟' : 'Are you sure you want to delete this booking permanently?',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "bookings", bookingId));
                    setBookings(bookings.filter(b => b.id !== bookingId));
                } catch (error) {
                    console.error("Error deleting booking:", error);
                    alert("Error deleting booking");
                }
            }
        });
    };

    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error("Error updating booking status:", error);
            alert("Error updating status");
        }
    };

    const filteredBookings = bookings.filter(booking => 
        (booking.gymName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (booking.trainerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.userName || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                        {language === 'ar' ? 'متابعة حجوزات النوادي والمدربين، وتأكيد أو إلغاء المواعيد.' : 'Track gym and trainer bookings, confirm or cancel appointments.'}
                    </p>
                </div>
            </div>

            {/* Filters / Search */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-purple-500/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث باسم العميل أو مقدم الخدمة...' : 'Search by customer or provider name...'}
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
                <div className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'التفاصيل' : 'Details'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'السعر/الوقت' : 'Price / Time'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                <AnimatePresence>
                                    {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                                        <motion.tr 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={booking.id} 
                                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 border border-purple-100 dark:border-purple-500/20 shadow-sm">
                                                        <Activity className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{booking.trainerName || booking.gymName || 'Service Provider'}</span>
                                                        <span className="text-[11px] font-bold text-gray-500">{booking.sportType || 'General Session'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-gray-300">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    {booking.userName || 'Unknown User'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-black text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-1.5">
                                                        <CreditCard className="w-4 h-4 text-purple-500" />
                                                        {booking.totalPrice || 0} {language === 'ar' ? 'ر.س' : 'SAR'}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {booking.createdAt ? booking.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider 
                                                    ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                                    : booking.status === 'cancelled' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' 
                                                    : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}
                                                >
                                                    {booking.status === 'confirmed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : booking.status === 'cancelled' ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                    {booking.status === 'confirmed' ? (language === 'ar' ? 'مؤكد' : 'Confirmed') 
                                                    : booking.status === 'cancelled' ? (language === 'ar' ? 'ملغى' : 'Cancelled') 
                                                    : (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-end">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {booking.status !== 'confirmed' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                            title={language === 'ar' ? 'تأكيد الحجز' : 'Confirm'}
                                                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-xl transition-colors"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {booking.status !== 'cancelled' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                                            title={language === 'ar' ? 'إلغاء الحجز' : 'Cancel'}
                                                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl transition-colors"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    
                                                    {/* Delete */}
                                                    <button 
                                                        onClick={() => handleDelete(booking.id)}
                                                        title={language === 'ar' ? 'حذف السجل' : 'Delete Record'}
                                                        className="p-2 border border-rose-100 text-rose-400 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10 rounded-xl transition-colors ml-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )) : (
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
        </div>
    );
}
