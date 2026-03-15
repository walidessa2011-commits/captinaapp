"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Plane, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export default function Splash({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                setTimeout(onComplete, 800); // Allow exit animation to finish
            }
        }, 3000); // 3 seconds splash

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden bg-[#001f3f]"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/30 blur-[120px]"
                        ></motion.div>
                        <motion.div
                            animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.1, 0.15, 0.1]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
                            className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-primary-light/10 blur-[150px]"
                        ></motion.div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2 
                            }}
                            className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl relative"
                        >
                            <motion.div
                                animate={{ 
                                    rotateY: [0, 360],
                                }}
                                transition={{ 
                                    duration: 3, 
                                    repeat: Infinity, 
                                    ease: "linear" 
                                }}
                            >
                                <Globe className="w-12 h-12 text-white" />
                            </motion.div>
                            
                            {/* Pulse orbits */}
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ 
                                        opacity: [0, 0.3, 0],
                                        scale: [1, 2 + i * 0.5],
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        delay: i * 0.4,
                                        ease: "easeOut"
                                    }}
                                    className="absolute inset-0 border border-white/20 rounded-[2.5rem]"
                                ></motion.div>
                            ))}
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl font-black text-white tracking-widest mb-4">
                                CAPTINA
                            </h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="text-white/80 font-bold tracking-[0.3em] uppercase text-xs"
                            >
                                Your Personal Coach Anywhere
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Progress indicator */}
                    <div className="absolute bottom-12 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="h-full bg-white shadow-[0_0_10px_#fff]"
                        ></motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
