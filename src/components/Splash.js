"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Splash({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                setTimeout(onComplete, 800); // Allow exit animation to finish
            }
        }, 2200); // 2.2 seconds splash

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden bg-[#0E1320]"
                >
                    {/* Premium Animated Background */}
                    <div className="absolute inset-0">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#E51B24]/10 blur-[120px]"
                        ></motion.div>
                        <motion.div
                            animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.05, 0.1, 0.05],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
                            className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] rounded-full bg-blue-500/5 blur-[150px]"
                        ></motion.div>
                    </div>

                    {/* Logo Container */}
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                                duration: 1,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="relative"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl p-6">
                                <motion.img 
                                    src="/logo_captina.jpg" 
                                    alt="Captina Logo"
                                    className="w-full h-full object-cover rounded-2xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                />
                            </div>

                            {/* Glow behind logo */}
                            <motion.div
                                animate={{ 
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-[#E51B24]/10 blur-3xl rounded-full -z-10"
                            />
                        </motion.div>

                        {/* Text Content */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-[0.2em] mb-2 uppercase">
                                CAPTINA
                            </h1>
                            <div className="h-0.5 w-12 bg-[#E51B24] mx-auto rounded-full mb-4"></div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ delay: 1.2, duration: 1 }}
                                className="text-white font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs"
                            >
                                Your Professional Coach
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Progress indicator */}
                    <div className="absolute bottom-12 w-48 h-[1px] bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 2.2, ease: "easeInOut" }}
                            className="h-full bg-[#E51B24] shadow-[0_0_15px_#E51B24]"
                        ></motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
