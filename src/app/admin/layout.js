"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLayout({ children }) {
    const { language, darkMode, userData } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setIsAuthenticating(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/admin/login');
                setIsAuthenticating(false);
                return;
            }

            try {
                // Check if user has admin role in Firestore
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists() && userSnap.data().role === 'admin') {
                    setIsAdmin(true);
                    setIsAuthenticating(false);
                } else {
                    // Not an admin, redirect to regular home or show error
                    router.push('/admin/login?error=unauthorized');
                    setIsAuthenticating(false);
                }
            } catch (error) {
                console.error("Error verifying admin role:", error);
                router.push('/admin/login?error=error');
                setIsAuthenticating(false);
            }
        });

        return () => unsubscribe();
    }, [pathname, router]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isAuthenticating) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-[#0f172a] flex items-center justify-center z-[9999]">
                <div className="flex flex-col items-center gap-6">
                    <motion.div 
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1],
                            borderRadius: ["20%", "50%", "20%"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 bg-primary rounded-2xl shadow-2xl shadow-primary/40"
                    />
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            Captina <span className="text-primary">Protocol</span>
                        </h2>
                        <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest animate-pulse">
                            {language === 'ar' ? 'جاري التحقق من الصلاحيات...' : 'Encrypting Admin Access...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className={`min-h-screen flex bg-gray-50 dark:bg-[#0f172a] text-slate-900 dark:text-white transition-colors duration-500 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className="flex-grow flex flex-col min-w-0 transition-all duration-300">
                <AdminNavbar setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-grow p-4 lg:p-8 overflow-x-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="container mx-auto max-w-7xl"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
