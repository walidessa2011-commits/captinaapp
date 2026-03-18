"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    Users, 
    Search, 
    MoreVertical, 
    Trash2, 
    Shield, 
    ShieldAlert, 
    Check, 
    X,
    Filter,
    Pencil
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function AdminUsers() {
    const { language, setAlert } = useApp();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const usersSnap = await getDocs(collection(db, "users"));
            setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (userId) => {
        setAlert({
            title: language === 'ar' ? 'حذف المستخدم' : 'Delete User',
            message: language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this user? This action cannot be undone.',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "users", userId));
                    setUsers(users.filter(u => u.id !== userId));
                } catch (error) {
                    console.error("Error deleting user:", error);
                    alert("Error deleting user");
                }
            }
        });
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await updateDoc(doc(db, "users", userId), { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Error updating role");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole || (!user.role && filterRole === 'user');
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        {language === 'ar' ? 'إدارة المستخدمين' : 'Users Management'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                        {language === 'ar' ? 'عرض، تعديل الصلاحيات، وحذف حسابات المستخدمين.' : 'View, edit roles, and delete user accounts.'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium flex flex-col md:flex-row gap-4">
                <div className="flex-grow flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-primary/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'ابحث بالاسم أو البريد...' : 'Search by name or email...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                    />
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select 
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-bold dark:text-white cursor-pointer"
                    >
                        <option value="all" className="dark:bg-[#0f172a]">{language === 'ar' ? 'كل الأدوار' : 'All Roles'}</option>
                        <option value="admin" className="dark:bg-[#0f172a]">{language === 'ar' ? 'مسؤول' : 'Admin'}</option>
                        <option value="user" className="dark:bg-[#0f172a]">{language === 'ar' ? 'مستخدم' : 'User'}</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'المستخدم' : 'User'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'تاريخ الانضمام' : 'Joined'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-start">{language === 'ar' ? 'الدور' : 'Role'}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/5 flex items-center justify-center shadow-sm">
                                                    {user.photoURL ? (
                                                        <img 
                                                            src={user.photoURL} 
                                                            alt="Avatar" 
                                                            referrerPolicy="no-referrer"
                                                            className="w-full h-full aspect-square object-cover" 
                                                        />
                                                    ) : (
                                                        <Users className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 dark:text-white capitalize">{user.fullName || (language === 'ar' ? 'مستخدم بدون اسم' : 'Unnamed User')}</span>
                                                    <span className="text-[11px] font-bold text-gray-500">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                                {user.createdAt ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded-full text-xs font-black uppercase tracking-wider">
                                                    <ShieldAlert className="w-3.5 h-3.5" />
                                                    {language === 'ar' ? 'مسؤول' : 'Admin'}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-wider">
                                                    <Check className="w-3.5 h-3.5" />
                                                    {language === 'ar' ? 'مستخدم' : 'User'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Edit User Profile */}
                                                <Link 
                                                    href={`/admin/users/${user.id}`}
                                                    title={language === 'ar' ? 'تعديل بيانات المستخدم' : 'Edit User Data'}
                                                    className="flex items-center justify-center p-2 bg-gray-100 dark:bg-white/10 text-gray-500 hover:bg-blue-500/10 hover:text-blue-500 rounded-xl transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                {/* Role Toggle */}
                                                <button 
                                                    onClick={() => handleRoleUpdate(user.id, user.role === 'admin' ? 'user' : 'admin')}
                                                    title={language === 'ar' ? 'تغيير الصلاحية' : 'Change Role'}
                                                    className="p-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                {/* Delete */}
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    title={language === 'ar' ? 'حذف المستخدم' : 'Delete User'}
                                                    className="p-2 bg-gray-100 dark:bg-white/10 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-bold">
                                            {language === 'ar' ? 'لم يتم العثور على مستخدمين يطابقون بحثك.' : 'No users found matching your search.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
