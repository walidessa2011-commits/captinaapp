"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    UserCheck, 
    Search, 
    MoreVertical, 
    Trash2, 
    Edit, 
    CheckCircle2, 
    XCircle,
    Plus,
    Award,
    Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import Link from 'next/link';

export default function AdminTrainers() {
    const { language, setAlert } = useApp();
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTrainers = async () => {
        setIsLoading(true);
        try {
            const trainersSnap = await getDocs(collection(db, "trainers"));
            setTrainers(trainersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching trainers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleDelete = (trainerId, trainerName) => {
        setAlert({
            title: language === 'ar' ? 'حذف المدرب' : 'Delete Trainer',
            message: language === 'ar' ? `هل أنت متأكد من حذف المدرب "${trainerName}" ومعلوماته بالكامل؟` : `Are you sure you want to delete the trainer "${trainerName}" and all their information?`,
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "trainers", trainerId));
                    setTrainers(trainers.filter(t => t.id !== trainerId));
                } catch (error) {
                    console.error("Error deleting trainer:", error);
                    alert("Error deleting trainer");
                }
            }
        });
    };

    const handleToggleStatus = async (trainerId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await updateDoc(doc(db, "trainers", trainerId), { status: newStatus });
            setTrainers(trainers.map(t => t.id === trainerId ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Error updating trainer status:", error);
            alert("Error updating trainer status");
        }
    };

    const filteredTrainers = trainers.filter(trainer => 
        (trainer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (trainer.specialty || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        <UserCheck className="w-8 h-8 text-amber-500" />
                        {language === 'ar' ? 'إدارة المدربين' : 'Trainers Management'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'قائمة المدربين، تخصصاتهم، تقييماتهم، وتوثيقاتهم.' : 'List of trainers, their specialties, ratings, and verifications.'}
                    </p>
                </div>
                <Link 
                    href="/admin/trainers/new"
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-colors shadow-lg shadow-amber-500/30 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'ar' ? 'إضافة مدرب' : 'Add New Trainer'}</span>
                </Link>
            </div>

            {/* Filters / Search */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-amber-500/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث باسم المدرب أو التخصص...' : 'Search by trainer name or specialty...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                    />
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredTrainers.length > 0 ? filteredTrainers.map((trainer, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                key={trainer.id}
                                className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden group hover:-translate-y-1 transition-transform relative flex flex-col"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none`}></div>

                                <div className="p-6 flex flex-col items-center gap-4 border-b border-gray-100 dark:border-white/10 relative z-10">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-amber-50 dark:bg-amber-500/10 border-4 border-white dark:border-white/5 shadow-xl relative">
                                        <img src={trainer.image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100"} alt={trainer.name} className="w-full h-full object-cover" />
                                        {trainer.verified && (
                                            <div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full text-white ring-2 ring-white dark:ring-[#0f172a]">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-black text-lg text-slate-900 dark:text-white">{trainer.name || 'Unnamed Trainer'}</h3>
                                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">{trainer.specialty || 'General Coach'}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span>{trainer.rating || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl">
                                            <Award className="w-4 h-4 text-purple-400" />
                                            <span>{trainer.experience || 0} {language === 'ar' ? 'سنين' : 'Years'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 flex items-center justify-between mt-auto bg-gray-50/50 dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        {/* Status Toggle Action */}
                                        <button 
                                            onClick={() => handleToggleStatus(trainer.id, trainer.status)}
                                            title={language === 'ar' ? 'تغيير الحالة' : 'Toggle Status'}
                                            className={`flex items-center justify-center p-2 rounded-xl transition-colors ${trainer.status === 'active' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/30' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'}`}
                                        >
                                            {trainer.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                        
                                        {/* Edit Action */}
                                        <Link 
                                            href={`/admin/trainers/${trainer.id}`}
                                            title={language === 'ar' ? 'تعديل المدرب' : 'Edit Trainer'}
                                            className="flex items-center justify-center p-2 bg-gray-100 dark:bg-white/10 hover:bg-primary/20 hover:text-primary text-gray-600 dark:text-gray-300 rounded-xl transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {/* Delete Action */}
                                    <button 
                                        onClick={() => handleDelete(trainer.id, trainer.name)}
                                        title={language === 'ar' ? 'حذف جذري' : 'Force Delete'}
                                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 hover:bg-rose-100 font-bold text-xs dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {language === 'ar' ? 'حذف' : 'Delete'}
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <motion.div 
                                className="col-span-full p-12 text-center text-gray-500 font-bold bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium flex flex-col items-center gap-4"
                            >
                                <UserCheck className="w-12 h-12 text-gray-300" />
                                <span>{language === 'ar' ? 'لم يتم العثور على مدربين يطابقون بحثك.' : 'No trainers found matching your search.'}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
