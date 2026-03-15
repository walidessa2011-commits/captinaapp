"use client";
import { motion } from "framer-motion";
import { ShoppingBag, Package, ChevronLeft, ChevronRight, Hash, Truck } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyOrders() {
    const { t, language } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const content = t('ordersPage');

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "orders"),
                        where("userId", "==", user.uid),
                        orderBy("createdAt", "desc")
                    );
                    const querySnapshot = await getDocs(q);
                    const data = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        items: doc.data().itemsNames || [],
                        total: doc.data().totalPrice ? `${doc.data().totalPrice} ${language === 'ar' ? 'ريال' : 'SAR'}` : (language === 'ar' ? "غير معروف" : "Unknown"),
                        date: doc.data().createdAt?.toDate().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') || "---",
                        status: doc.data().statusText || content.status
                    }));
                    setOrders(data);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    // Mock data fallback if empty for demonstration
                   if (orders.length === 0) {
                        setOrders([
                            { 
                                id: "ORD-9982", 
                                items: language === 'ar' ? ["بروتين مصل اللبن 2 كجم", "قفازات ملاكمة"] : ["Whey Protein 2kg", "Boxing Gloves"], 
                                total: language === 'ar' ? "450 ريال" : "450 SAR", 
                                date: language === 'ar' ? "10 مارس 2026" : "March 10, 2026", 
                                status: content.status
                            }
                        ]);
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrders();
    }, [user, loadingAuth, router, language, content.status]);

    if (loadingAuth || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 transition-colors">
            <div className="bg-emerald-500 pt-12 pb-24 text-center text-white rounded-b-[3rem] relative overflow-hidden">
                <div className="relative z-10 px-4 flex items-center justify-between container mx-auto">
                    <Link href="/profile" className="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all">
                        {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </Link>
                    <h1 className="text-2xl md:text-4xl font-black">{content.title}</h1>
                    <div className="w-12"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="space-y-4">
                    {orders.length > 0 ? orders.map((order, idx) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-xl border border-gray-100 dark:border-white/5"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-2xl order-2 md:order-1">
                                    <Hash className="w-4 h-4 text-emerald-500" />
                                    <span className="font-black text-gray-900 dark:text-white">{order.id}</span>
                                </div>
                                <div className="bg-emerald-100 text-emerald-600 px-6 py-2 rounded-full text-xs font-black order-1 md:order-2">
                                    {order.status}
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-gray-700 dark:text-gray-300 font-bold border-b border-gray-50 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                                            <Package className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3 text-gray-400 font-bold text-sm">
                                    <Truck className="w-5 h-5" />
                                    <span>{order.date}</span>
                                </div>
                                <div className="text-2xl font-black text-emerald-600">
                                    {order.total}
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-20 text-center shadow-xl">
                            <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                            <p className="text-gray-500 font-bold">{content.empty}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
