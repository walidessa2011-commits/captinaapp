"use client";
import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyAchievements() {
    const { t, language } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [achievements, setAchievements] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const content = t('achievementsPage');

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }

        const fetchAchievements = async () => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "achievements"),
                        where("userId", "==", user.uid)
                    );
                    const querySnapshot = await getDocs(q);
                    const data = querySnapshot.docs.map(doc => {
                        const iconMap = { trophy: Trophy, star: Star, target: Target, zap: Zap };
                        return {
                            id: doc.id,
                            ...doc.data(),
                            icon: iconMap[doc.data().iconName] || Trophy,
                            title: doc.data().title || (language === 'ar' ? "إنجاز جديد" : "New Achievement"),
                            desc: doc.data().desc || "---",
                            points: doc.data().points || 0,
                            unlocked: doc.data().unlocked ?? true,
                            color: doc.data().color || "text-amber-500",
                            bg: doc.data().bg || "bg-amber-50 dark:bg-amber-900/20"
                        };
                    });
                    setAchievements(data);
                    const total = data.reduce((acc, curr) => acc + (curr.unlocked ? curr.points : 0), 0);
                    setTotalPoints(total);
                } catch (error) {
                    console.error("Error fetching achievements:", error);
                    // Mock data fallback
                    if (achievements.length === 0) {
                        setAchievements([
                            { 
                                title: language === 'ar' ? "الوحش الحديدي" : "Iron Beast", 
                                desc: language === 'ar' ? "أكملت 20 حصة بناء أجسام" : "Completed 20 bodybuilding sessions", 
                                icon: Trophy, 
                                points: 500, 
                                color: "text-amber-500", 
                                bg: "bg-amber-50 dark:bg-amber-900/20",
                                unlocked: true 
                            }
                        ]);
                        setTotalPoints(500);
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAchievements();
    }, [user, loadingAuth, router, language]);

    if (loadingAuth || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 transition-colors">
            <div className="bg-amber-500 pt-12 pb-24 text-center text-white rounded-b-[3rem] relative overflow-hidden">
                <div className="relative z-10 px-4 flex items-center justify-between container mx-auto">
                    <Link href="/profile" className="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all">
                        {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </Link>
                    <h1 className="text-2xl md:text-4xl font-black">{content.title}</h1>
                    <div className="w-12"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-2xl border border-gray-100 dark:border-white/5 mb-8 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                        <Award className="w-12 h-12 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">{totalPoints} {content.points}</h2>
                    <p className="text-gray-400 font-bold">{language === 'ar' ? 'مستواك الحالي: رياضي محترف' : 'Current Level: Professional Athlete'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-6 rounded-[2.5rem] border shadow-lg flex items-center gap-6 transition-all ${achievement.unlocked ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-white/10' : 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-white/5 grayscale opacity-60'}`}
                        >
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${achievement.bg}`}>
                                <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                            </div>
                            <div className="flex-grow text-center md:text-start">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">{achievement.title}</h3>
                                <p className="text-sm font-bold text-gray-400">{achievement.desc}</p>
                            </div>
                            <div className="shrink-0 text-center">
                                <div className="text-amber-500 font-black">+{achievement.points}</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase">{content.points}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
