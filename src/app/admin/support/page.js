"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageCircle, 
    Settings, 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Trash2, 
    Save, 
    RefreshCw,
    ExternalLink,
    Filter
} from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function AdminSupport() {
    const { 
        language, 
        contactInfo, 
        inquiries, 
        updateContactInfo, 
        updateInquiryStatus, 
        deleteInquiry 
    } = useApp();
    
    const [activeTab, setActiveTab] = useState('inquiries');
    const [editingContact, setEditingContact] = useState(false);
    const [contactForm, setContactForm] = useState(contactInfo || {});
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (contactInfo) setContactForm(contactInfo);
    }, [contactInfo]);

    const handleUpdateContact = async (e) => {
        e.preventDefault();
        const res = await updateContactInfo(contactForm);
        if (res.success) setEditingContact(false);
    };

    const filteredInquiries = inquiries?.filter(inq => {
        if (inq.deleted) return false;
        if (statusFilter === 'all') return true;
        return inq.status === statusFilter;
    });

    return (
        <div className="min-h-screen pb-20 p-4 md:p-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">
                            {language === 'ar' ? 'الدعم ' : 'Customer '}
                            <span className="text-primary italic">
                                {language === 'ar' ? 'والتواصل' : 'Support'}
                            </span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-bold text-sm">
                        {language === 'ar' ? 'إدارة استفسارات العملاء وتحديث بيانات التواصل' : 'Manage customer inquiries and update contact details'}
                    </p>
                </div>

                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('inquiries')}
                        className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'inquiries' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        {language === 'ar' ? 'الاستفسارات' : 'Inquiries'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('contact')}
                        className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'contact' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <Settings className="w-4 h-4" />
                        {language === 'ar' ? 'بيانات التواصل' : 'Contact Details'}
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'inquiries' ? (
                    <motion.div 
                        key="inquiries"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-xl">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {language === 'ar' ? 'تصفية:' : 'Filter:'}
                                </span>
                            </div>
                            {['all', 'pending', 'replied'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${statusFilter === status ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                                >
                                    {status === 'all' ? (language === 'ar' ? 'الكل' : 'All') : 
                                     status === 'pending' ? (language === 'ar' ? 'قيد الانتظار' : 'Pending') : 
                                     (language === 'ar' ? 'تم الرد' : 'Replied')}
                                </button>
                            ))}
                        </div>

                        {/* Inquiries Grid */}
                        <div className="grid lg:grid-cols-2 gap-4">
                            {filteredInquiries?.length > 0 ? (
                                filteredInquiries.map((inq) => (
                                    <motion.div 
                                        layout
                                        key={inq.id}
                                        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 relative group overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center font-black text-primary">
                                                    {inq.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 dark:text-white leading-tight text-base mb-1">
                                                        {inq.name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                                                            <Phone className="w-3 h-3" />
                                                            {inq.phone}
                                                        </p>
                                                        {inq.email && (
                                                            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                                                                <Mail className="w-3 h-3" />
                                                                {inq.email}
                                                            </p>
                                                        )}
                                                        <span className="text-[10px] text-gray-300">|</span>
                                                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3" />
                                                            {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US') : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${inq.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {inq.status === 'pending' ? (language === 'ar' ? 'انتظار' : 'Pending') : (language === 'ar' ? 'تم الرد' : 'Replied')}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 mb-5 border border-gray-100 dark:border-white/5">
                                            <p className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                                "{inq.message}"
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {inq.status === 'pending' ? (
                                                    <button 
                                                        onClick={() => updateInquiryStatus(inq.id, 'replied')}
                                                        className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[11px] font-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                                    >
                                                        {language === 'ar' ? 'تحديد كتم الرد' : 'Mark as Replied'}
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => updateInquiryStatus(inq.id, 'pending')}
                                                        className="px-5 py-2.5 bg-slate-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded-xl text-[11px] font-black hover:bg-slate-200 active:scale-95 transition-all"
                                                    >
                                                        {language === 'ar' ? 'إعادة للانتظار' : 'Back to Pending'}
                                                    </button>
                                                )}
                                                
                                                <div className="flex items-center gap-2 border-l dark:border-white/10 ml-2 pl-2">
                                                    <a 
                                                        href={`https://wa.me/${inq.phone.startsWith('+') ? inq.phone : '+966' + inq.phone.replace(/^0/, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 text-emerald-500 bg-emerald-500/10 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2 text-[11px] font-black"
                                                        title="WhatsApp"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                                                    </a>
                                                    {inq.email && (
                                                        <a 
                                                            href={`mailto:${inq.email}`}
                                                            className="p-2.5 text-blue-500 bg-blue-500/10 rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 text-[11px] font-black"
                                                            title="Email"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                            {language === 'ar' ? 'إيميل' : 'Email'}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => deleteInquiry(inq.id)}
                                                className="p-2.5 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all group-hover:scale-110"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="lg:col-span-2 py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-white/5 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-6">
                                        <MessageCircle className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                                        {language === 'ar' ? 'لا يوجد استفسارات' : 'No Inquiries Yet'}
                                    </h3>
                                    <p className="text-gray-500 font-bold text-sm">
                                        {language === 'ar' ? 'ستظهر هنا الرسائل التي تصل من صفحة تواصل معنا' : 'Messages from contact page will appear here'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="contact"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="max-w-4xl"
                    >
                        <form onSubmit={handleUpdateContact} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-3xl flex items-center justify-center">
                                        <Settings className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-2">
                                            {language === 'ar' ? 'تحرير بيانات التواصل' : 'Edit Contact Information'}
                                        </h3>
                                        <p className="text-gray-400 text-sm font-bold">
                                            {language === 'ar' ? 'يتم تحديث هذه البيانات تلقائياً في صفحة تواصل معنا' : 'These details are automatically updated on the contact page'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {editingContact ? (
                                        <>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setEditingContact(false);
                                                    setContactForm(contactInfo);
                                                }}
                                                className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                                            >
                                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                            </button>
                                            <button 
                                                type="submit"
                                                className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 flex items-center gap-2 hover:translate-y-[-2px] transition-all"
                                            >
                                                <Save className="w-4 h-4" />
                                                {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={() => setEditingContact(true)}
                                            className="px-8 py-3 bg-primary/10 text-primary rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                                        >
                                            <Settings className="w-4 h-4" />
                                            {language === 'ar' ? 'تعديل البيانات' : 'Edit Mode'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase px-4 tracking-widest flex items-center gap-2">
                                            <Phone className="w-3 h-3 text-primary" />
                                            {language === 'ar' ? 'رقم الهاتف الموحد' : 'Central Phone Number'}
                                        </label>
                                        <input 
                                            disabled={!editingContact}
                                            value={contactForm.phone || ''}
                                            onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-primary/5 rounded-[1.5rem] p-5 font-black text-gray-900 dark:text-white text-sm outline-none transition-all disabled:opacity-60" 
                                            placeholder="+966..." 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase px-4 tracking-widest flex items-center gap-2">
                                            <Mail className="w-3 h-3 text-primary" />
                                            {language === 'ar' ? 'البريد الإلكتروني للدعم' : 'Support Email'}
                                        </label>
                                        <input 
                                            disabled={!editingContact}
                                            value={contactForm.email || ''}
                                            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-primary/5 rounded-[1.5rem] p-5 font-black text-gray-900 dark:text-white text-sm outline-none transition-all disabled:opacity-60" 
                                            placeholder="support@..." 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase px-4 tracking-widest flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-primary" />
                                            {language === 'ar' ? 'ساعات العمل (عربي)' : 'Working Hours (AR)'}
                                        </label>
                                        <input 
                                            disabled={!editingContact}
                                            value={contactForm.workingHours_ar || ''}
                                            onChange={(e) => setContactForm({...contactForm, workingHours_ar: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-primary/5 rounded-[1.5rem] p-5 font-black text-gray-900 dark:text-white text-sm outline-none transition-all disabled:opacity-60" 
                                            placeholder="يومياً من..." 
                                        />
                                    </div>
                                </div>

                                {/* Address Info */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase px-4 tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-primary" />
                                            {language === 'ar' ? 'العنوان (عربي)' : 'Address (AR)'}
                                        </label>
                                        <textarea 
                                            disabled={!editingContact}
                                            value={contactForm.address_ar || ''}
                                            onChange={(e) => setContactForm({...contactForm, address_ar: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-primary/5 rounded-[1.5rem] p-5 font-black text-gray-900 dark:text-white text-sm outline-none transition-all disabled:opacity-60 h-[104px] resize-none" 
                                            placeholder="الرياض..." 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase px-4 tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            {language === 'ar' ? 'العنوان (انجليزي)' : 'Address (EN)'}
                                        </label>
                                        <textarea 
                                            disabled={!editingContact}
                                            value={contactForm.address_en || ''}
                                            onChange={(e) => setContactForm({...contactForm, address_en: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-primary/5 rounded-[1.5rem] p-5 font-black text-gray-900 dark:text-white text-sm outline-none transition-all disabled:opacity-60 h-[104px] resize-none" 
                                            placeholder="Riyadh..." 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-10 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                <h4 className="flex items-center gap-2 text-xs font-black text-gray-900 dark:text-white mb-3 tracking-widest uppercase">
                                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                                    {language === 'ar' ? 'الموقع الجغرافي (إحداثيات)' : 'Geographic Location (Coords)'}
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 mx-2 mb-1 uppercase tracking-tighter">Latitude</span>
                                        <input 
                                            type="number"
                                            step="0.0001"
                                            disabled={!editingContact}
                                            value={contactForm.location?.lat || ''}
                                            onChange={(e) => setContactForm({
                                                ...contactForm, 
                                                location: { ...contactForm.location, lat: parseFloat(e.target.value) }
                                            })}
                                            className="bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-sm font-black text-primary outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50 transition-all font-mono"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 mx-2 mb-1 uppercase tracking-tighter">Longitude</span>
                                        <input 
                                            type="number"
                                            step="0.0001"
                                            disabled={!editingContact}
                                            value={contactForm.location?.lng || ''}
                                            onChange={(e) => setContactForm({
                                                ...contactForm, 
                                                location: { ...contactForm.location, lng: parseFloat(e.target.value) }
                                            })}
                                            className="bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-sm font-black text-primary outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50 transition-all font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
