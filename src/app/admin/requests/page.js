"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    FileText, 
    Search, 
    CheckCircle2, 
    XCircle,
    Clock,
    User,
    Eye,
    Phone,
    Mail,
    CreditCard,
    Target,
    TrendingUp,
    RefreshCw,
    Check,
    X,
    MessageSquare,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import Pagination from '../components/Pagination';

export default function AdminRequests() {
    const { language, setAlert, darkMode, getLoc } = useApp();
    const [requests, setRequests] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [subsMap, setSubsMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');

    const getTypeIcon = (type) => {
        switch (type) {
            case 'renew': return <RefreshCw className="w-5 h-5" />;
            case 'upgrade': return <TrendingUp className="w-5 h-5" />;
            case 'change_sport': return <Target className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'renew': return language === 'ar' ? 'تجديد الاشتراك' : 'Renew Subscription';
            case 'upgrade': return language === 'ar' ? 'ترقية الباقة' : 'Upgrade Plan';
            case 'change_sport': return language === 'ar' ? 'تغيير الرياضة' : 'Change Sport';
            default: return type;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'renew': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
            case 'upgrade': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
            case 'change_sport': return 'text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20';
            default: return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
        }
    };

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const reqSnap = await getDocs(collection(db, "subscription_requests"));
            let reqData = reqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort by date desc
            reqData.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });

            setRequests(reqData);

            // Fetch related users
            const userIds = [...new Set(reqData.map(r => r.userId).filter(Boolean))];
            const uMap = {};
            if (userIds.length > 0) {
                // For a robust app, you might query in batches of 30 due to Firestore 'in' limits.
                for (const uid of userIds) {
                    const uDoc = await getDoc(doc(db, "users", uid));
                    if (uDoc.exists()) uMap[uid] = uDoc.data();
                }
            }
            setUsersMap(uMap);

            // Fetch related subscriptions
            const subIds = [...new Set(reqData.map(r => r.currentSubscriptionId).filter(Boolean))];
            const sMap = {};
            if (subIds.length > 0) {
                for (const sid of subIds) {
                    const sDoc = await getDoc(doc(db, "subscriptions", sid));
                    if (sDoc.exists()) sMap[sid] = sDoc.data();
                }
            }
            setSubsMap(sMap);

        } catch (error) {
            console.error("Error fetching requests:", error);
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
        fetchRequests();
    }, [fetchRequests]);

    const handleUpdateStatus = async (requestId, newStatus) => {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        setIsSaving(true);
        try {
            await updateDoc(doc(db, "subscription_requests", requestId), { 
                status: newStatus,
                adminNotes: adminNotes || '',
                updatedAt: serverTimestamp()
            });
            
            setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus, adminNotes } : r));
            
            if (selectedRequest?.id === requestId) {
                setSelectedRequest(prev => ({ ...prev, status: newStatus, adminNotes }));
                setSelectedRequest(null);
            }

            // Send notification to user
            try {
                const isApproved = newStatus === 'approved';
                const title_ar = isApproved ? 'تمت الموافقة على طلبك' : 'تم رفض طلبك';
                const title_en = isApproved ? 'Request Approved' : 'Request Rejected';
                const typeLabelEn = getTypeLabel(req.type); // Gets translated label, but let's stick to safe fallback if needed
                
                const msg_ar = isApproved 
                    ? `تمت الموافقة على طلب ${getTypeLabel(req.type)} الخاص بك. يرجى مراجعة ملفك الشخصي.` 
                    : `نعتذر، لم نتمكن من الموافقة على طلبك. الرجاء التواصل مع الدعم.`;
                const msg_en = isApproved 
                    ? `Your request for ${req.type} has been approved. Please check your profile.` 
                    : `Sorry, we couldn't approve your request. Please contact support.`;

                await addDoc(collection(db, "notifications"), {
                    userId: req.userId,
                    title_ar,
                    title_en,
                    message_ar: msg_ar,
                    message_en: msg_en,
                    type: isApproved ? 'success' : 'error',
                    read: false,
                    createdAt: new Date(),
                    requestId: requestId
                });
            } catch (err) {
                console.error("Error sending notification:", err);
            }
            
            setAlert({
                title: language === 'ar' ? 'تم التحديث' : 'Updated',
                message: language === 'ar' ? 'تم تحديث حالة الطلب بنجاح' : 'Request status updated successfully',
                type: 'success'
            });
            setAdminNotes('');
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

    const handleWhatsAppContact = (req) => {
        const user = usersMap[req.userId] || {};
        const phone = user.phone;
        if (!phone) {
            setAlert({
                title: language === 'ar' ? 'تنبيه' : 'Alert',
                message: language === 'ar' ? 'رقم الجوال غير متوفر' : 'Phone number is not available',
                type: 'error'
            });
            return;
        }
        
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('05')) {
            formattedPhone = '966' + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('5')) {
            formattedPhone = '966' + formattedPhone;
        }
        
        const clientName = getLoc(user.fullName) || (language === 'ar' ? 'عميلنا العزيز' : 'Dear Customer');
        const reqType = getTypeLabel(req.type);
        
        let message = '';
        if (language === 'ar') {
            message = `مرحباً ${clientName}،\nنتواصل معك بخصوص طلبك (${reqType}). نتمنى منك تزويدنا بمزيد من التفاصيل.`;
        } else {
            message = `Hi ${clientName},\nWe are contacting you regarding your request (${reqType}). Please provide us with more details.`;
        }
        
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const filteredRequests = requests.filter(req => {
        const user = usersMap[req.userId] || {};
        const sub = subsMap[req.currentSubscriptionId] || {};
        const userName = user.fullName || '';
        const userPhone = user.phone || '';
        const userEmail = user.email || '';
        const typeLabel = getTypeLabel(req.type);
        const planName = sub.planLabel || '';
        
        const search = searchTerm.toLowerCase();
        return (
            String(getLoc(userName)).toLowerCase().includes(search) ||
            String(userPhone).includes(search) ||
            String(userEmail).toLowerCase().includes(search) ||
            String(req.type).toLowerCase().includes(search) ||
            String(getLoc(typeLabel)).toLowerCase().includes(search) ||
            String(getLoc(planName)).toLowerCase().includes(search)
        );
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        {language === 'ar' ? 'طلبات الاشتراكات' : 'Subscription Requests'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'إدارة طلبات التجديد، الترقية، وتغيير الرياضة للمشتركين الحاضرين.' : 'Manage renewal, upgrade, and sport change requests for current subscribers.'}
                    </p>
                </div>
            </div>

            <div className={`p-4 rounded-[2rem] border transition-all ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-premium'}`}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-transparent focus-within:border-blue-500/20 transition-all ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث باسم العميل، الهاتف، الإيميل أو نوع الطلب...' : 'Search by customer, phone, email or request type...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className={`rounded-[2rem] border overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-premium'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className={`border-b transition-colors ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'نوع الطلب' : 'Request Type'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الاشتراك الحالي' : 'Current Plan'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'تاريخ الطلب' : 'Requested At'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-white/10' : 'divide-gray-100'}`}>
                                <AnimatePresence>
                                    {paginatedRequests.length > 0 ? paginatedRequests.map((req) => {
                                        const user = usersMap[req.userId] || {};
                                        const sub = subsMap[req.currentSubscriptionId] || {};
                                        return (
                                            <motion.tr 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={req.id} 
                                                className={`transition-all group ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-6 py-4" onClick={() => setSelectedRequest(req)}>
                                                    <div className="flex items-center gap-4 cursor-pointer">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${getTypeColor(req.type)}`}>
                                                            {getTypeIcon(req.type)}
                                                        </div>
                                                        <span className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 whitespace-nowrap">
                                                            {getTypeLabel(req.type)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-gray-200">
                                                            <User className="w-3.5 h-3.5 text-blue-500" />
                                                            {getLoc(user.fullName) || (language === 'ar' ? 'مستخدم بدون اسم' : 'Unnamed User')}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-500 mt-0.5">{user.phone || (language === 'ar' ? 'بدون هاتف' : 'No phone')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-1.5">
                                                            <Activity className="w-3.5 h-3.5 text-indigo-500" />
                                                            {getLoc(sub.planLabel) || (language === 'ar' ? 'لا يوجد بيانات' : 'No Data')}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-500">
                                                            {getLoc(sub.sportName) || getLoc(sub.sportType) || '---'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 whitespace-nowrap">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {req.createdAt && typeof req.createdAt.toDate === 'function' ? 
                                                            req.createdAt.toDate().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : 
                                                            (req.createdAt || 'N/A')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider 
                                                        ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                                        : req.status === 'rejected' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' 
                                                        : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}
                                                    >
                                                        {req.status === 'approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : req.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                        {req.status === 'approved' ? (language === 'ar' ? 'مقبول' : 'Approved') 
                                                        : req.status === 'rejected' ? (language === 'ar' ? 'مرفوض' : 'Rejected') 
                                                        : (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-end">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => setSelectedRequest(req)}
                                                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 rounded-xl transition-colors"
                                                            title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {req.status === 'pending' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(req.id, 'approved')}
                                                                    title={language === 'ar' ? 'موافقة' : 'Approve'}
                                                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-xl transition-colors"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                                                    title={language === 'ar' ? 'رفض' : 'Reject'}
                                                                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl transition-colors"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-bold">
                                                {language === 'ar' ? 'لم يتم العثور على طلبات تطابق بحثك.' : 'No requests found matching your search.'}
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
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
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
                                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg ${getTypeColor(selectedRequest.type)}`}>
                                            {getTypeIcon(selectedRequest.type)}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                                                {getTypeLabel(selectedRequest.type)}
                                            </h2>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mt-1">
                                                {language === 'ar' ? 'معرف الطلب' : 'Request ID'} #{selectedRequest.id.slice(0, 6)}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedRequest(null);
                                            setAdminNotes('');
                                        }}
                                        className={`p-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-rose-500/10 text-gray-400 hover:text-rose-500' : 'bg-gray-50 border-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-500'}`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Personal Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest border-l-4 border-blue-500 pl-3">
                                            {language === 'ar' ? 'بيانات العميل' : 'Customer Information'}
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 overflow-hidden border border-blue-500/20">
                                                        {usersMap[selectedRequest.userId]?.photoURL ? (
                                                            <img src={usersMap[selectedRequest.userId].photoURL} className="w-full h-full object-cover" alt="User" />
                                                        ) : (
                                                            <User className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الاسم' : 'Full Name'}</p>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                                            {getLoc(usersMap[selectedRequest.userId]?.fullName) || (language === 'ar' ? 'مستخدم بدون اسم' : 'Unnamed User')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                        <Phone className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 w-full">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'رقم الجوال' : 'Phone Number'}</p>
                                                        <div className="flex items-center justify-between w-full mt-1">
                                                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200" dir="ltr">
                                                                {usersMap[selectedRequest.userId]?.phone || '---'}
                                                            </p>
                                                            <button 
                                                                onClick={() => handleWhatsAppContact(selectedRequest)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors"
                                                                title={language === 'ar' ? 'تواصل عبر الواتساب' : 'Contact via WhatsApp'}
                                                            >
                                                                <Phone className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                        <Mail className="w-5 h-5" />
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الإيميل' : 'Email Address'}</p>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">
                                                            {usersMap[selectedRequest.userId]?.email || (language === 'ar' ? 'غير مسجل' : 'Not Provided')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subscription Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest border-l-4 border-amber-500 pl-3">
                                            {language === 'ar' ? 'تفاصيل الاشتراك الحالي' : 'Current Subscription'}
                                        </h3>

                                        <div className="space-y-4">
                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                        <CreditCard className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الباقة الأساسية' : 'Main Plan'}</p>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                                            {getLoc(subsMap[selectedRequest.currentSubscriptionId]?.planLabel) || '---'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                        <Target className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الرياضة' : 'Sport'}</p>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                                            {getLoc(subsMap[selectedRequest.currentSubscriptionId]?.sportName) || '---'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-base justify-between">
                                                   <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'الحصص' : 'Sessions'}</p>
                                                        <p className="font-black text-lg text-emerald-500 mt-1">
                                                            {subsMap[selectedRequest.currentSubscriptionId]?.consumedSessions || 0} / {subsMap[selectedRequest.currentSubscriptionId]?.totalSessions || 0}
                                                        </p>
                                                   </div>
                                                   <div className="text-end">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{language === 'ar' ? 'تاريخ البدء' : 'Start Date'}</p>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200 mt-1">
                                                            {subsMap[selectedRequest.currentSubscriptionId]?.startDate || '---'}
                                                        </p>
                                                   </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`mt-8 p-4 rounded-2xl border border-dashed ${darkMode ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-100'}`}>
                                    <p className="text-[10px] uppercase font-black text-blue-500 tracking-widest mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-3.5 h-3.5"/> 
                                        {language === 'ar' ? 'ملاحظات الإدارة (اختياري)' : 'Admin Notes (Optional)'}
                                    </p>
                                    <textarea 
                                        className="w-full bg-white dark:bg-[#1a2235] rounded-xl border border-gray-200 dark:border-white/10 p-3 text-sm font-bold text-gray-600 dark:text-gray-300 min-h-[80px] outline-none focus:border-blue-500 transition-colors"
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder={language === 'ar' ? 'أضف ملاحظات للمشترك أو للرجوع إليها مستقبلاً...' : 'Add notes for the subscriber or future reference...'}
                                    />
                                    {selectedRequest.adminNotes && adminNotes === '' && (
                                        <p className="text-xs text-gray-500 mt-2 font-bold italic">
                                            {language === 'ar' ? 'ملاحظة سابقة: ' : 'Previous Note: '}{selectedRequest.adminNotes}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons in Modal */}
                                <div className="mt-8 flex flex-wrap gap-4">
                                    {(selectedRequest.status === 'pending') ? (
                                        <>
                                            <button 
                                                disabled={isSaving}
                                                onClick={() => handleUpdateStatus(selectedRequest.id, 'approved')}
                                                className="flex-1 min-w-[150px] bg-emerald-500 text-white font-black py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                                {language === 'ar' ? 'موافقة وإرسال إشعار' : 'Approve & Notify'}
                                            </button>
                                            <button 
                                                disabled={isSaving}
                                                onClick={() => handleUpdateStatus(selectedRequest.id, 'rejected')}
                                                className="flex-1 min-w-[150px] bg-rose-500 text-white font-black py-4 rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                {language === 'ar' ? 'رفض وإرسال إشعار' : 'Reject & Notify'}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {selectedRequest.status === 'approved' ? (
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center">
                                                        <XCircle className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">
                                                        {selectedRequest.status === 'approved' ? (language === 'ar' ? 'تمت الموافقة على الطلب' : 'Request Approved') : (language === 'ar' ? 'تم رفض الطلب' : 'Request Rejected')}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                                        {selectedRequest.updatedAt && typeof selectedRequest.updatedAt.toDate === 'function' ? 
                                                            selectedRequest.updatedAt.toDate().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US') : 
                                                            (language === 'ar' ? 'تم التحديث مسبقاً' : 'Previously Updated')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                disabled={isSaving}
                                                onClick={() => handleUpdateStatus(selectedRequest.id, 'pending')}
                                                className="px-4 py-2 bg-white dark:bg-[#1a2235] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                            >
                                                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
