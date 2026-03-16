"use client";
import { motion } from "framer-motion";
import { MapPin, Plus, ChevronLeft, ChevronRight, Home, Briefcase, Map } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyAddress() {
    const { t, language, darkMode } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const content = t('addressPage');

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }

        const fetchAddresses = async () => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "addresses"),
                        where("userId", "==", user.uid)
                    );
                    const querySnapshot = await getDocs(q);
                    const data = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        type: doc.data().type === 'work' ? Briefcase : Home,
                        label: doc.data().label || (doc.data().type === 'work' ? (language === 'ar' ? "العمل" : "Work") : (language === 'ar' ? "المنزل" : "Home")),
                        address: doc.data().fullAddress || "---",
                        isDefault: doc.data().isDefault || false
                    }));
                    setAddresses(data);
                } catch (error) {
                    console.error("Error fetching addresses:", error);
                    // Mock data fallback
                    if (addresses.length === 0) {
                        setAddresses([
                            { 
                                id: 1, 
                                label: language === 'ar' ? "المنزل" : "Home", 
                                type: Home, 
                                address: language === 'ar' ? "الرياض، حي الملقا، طريق فاس، مبنى 12" : "Riyadh, Al Malqa, Fes Road, Building 12", 
                                isDefault: true 
                            }
                        ]);
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAddresses();
    }, [user, loadingAuth, router, language]);

    if (loadingAuth || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const textClass = darkMode ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-24 transition-colors relative overflow-hidden`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${darkMode ? 'bg-rose-500/20' : 'bg-rose-500/10'} rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>


            <div className="container mx-auto px-4 pt-10 relative z-20">
                <div className="space-y-4">
                    {addresses.map((addr, idx) => (
                        <motion.div
                            key={addr.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`${darkMode ? 'bg-[#1a2235]/40 backdrop-blur-3xl' : 'bg-white shadow-xl'} rounded-[2.5rem] p-6 border ${darkMode ? 'border-white/5' : 'border-gray-100'} flex items-start gap-6 group hover:border-rose-100 dark:hover:border-rose-900/30 transition-all`}
                        >
                            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-110 transition-transform">
                                <addr.type className="w-7 h-7" />
                            </div>
                            
                            <div className="flex-grow text-center md:text-start">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{addr.label}</h3>
                                    {addr.isDefault && (
                                        <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            {content.default}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed">{addr.address}</p>
                            </div>

                            <div className="shrink-0 flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                                    <Map className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    <button className="w-full bg-white dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 text-gray-400 font-black hover:border-rose-200 hover:text-rose-500 transition-all flex items-center justify-center gap-3">
                        <Plus className="w-6 h-6" />
                        <span>{content.addAddress}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
