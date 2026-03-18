"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Search, Users, Star, ArrowRight } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import TrainerCard from './TrainerCard';

export default function SportTrainers({ sportName, sportId }) {
    const { language, darkMode } = useApp();
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                // Fetch all active trainers
                const q = query(collection(db, "trainers"), where("status", "==", "active"));
                const querySnapshot = await getDocs(q);
                
                const allTrainers = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Filter by sportName (English or Arabic) or sportId
                const filtered = allTrainers.filter(trainer => {
                    const expertise = (trainer.expertise || []).map(e => e.toLowerCase());
                    const specialty = (trainer.specialty || "").toLowerCase();
                    
                    const matchesSport = expertise.some(e => 
                        e.includes(sportId.toLowerCase()) || 
                        e.includes(sportName.toLowerCase())
                    ) || specialty.includes(sportId.toLowerCase()) || specialty.includes(sportName.toLowerCase());
                    
                    return matchesSport;
                });

                setTrainers(filtered);
            } catch (error) {
                console.error("Error fetching sport trainers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrainers();
    }, [sportName, sportId]);

    if (!isLoading && trainers.length === 0) return null;

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {language === 'ar' ? 'مدربي هذه الرياضة' : `${sportName} Trainers`}
                    </h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                        {language === 'ar' ? 'نخبة من المدربين المحترفين المعتمدين' : 'Certified elite professional trainers'}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="min-w-[280px] h-80 bg-gray-100 dark:bg-white/5 animate-pulse rounded-[2.5rem]"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {trainers.map((trainer, idx) => (
                            <TrainerCard key={trainer.id} trainer={trainer} idx={idx} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
