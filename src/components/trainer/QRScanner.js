"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, X, CheckCircle2, AlertCircle,
    QrCode, User, Clock, Sparkles, RefreshCw
} from 'lucide-react';
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function QRScanner({ trainerId, trainerName, language, darkMode, onClose }) {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    const startScanning = async () => {
        setResult(null);
        setError(null);
        setScanning(true);

        try {
            const { Html5Qrcode } = await import('html5-qrcode');
            const scanner = new Html5Qrcode("qr-reader");
            html5QrCodeRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                async (decodedText) => {
                    // Stop scanning immediately
                    try {
                        await scanner.stop();
                    } catch (e) { /* ignore */ }
                    setScanning(false);
                    await handleScanResult(decodedText);
                },
                () => {} // ignore errors during scanning
            );
        } catch (err) {
            console.error("Camera error:", err);
            setError(language === 'ar' 
                ? 'لا يمكن الوصول للكاميرا. تأكد من السماح بالوصول.' 
                : 'Cannot access camera. Please allow camera permissions.'
            );
            setScanning(false);
        }
    };

    const stopScanning = async () => {
        try {
            if (html5QrCodeRef.current) {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
            }
        } catch (e) { /* ignore */ }
        setScanning(false);
    };

    useEffect(() => {
        return () => {
            stopScanning();
        };
    }, []);

    const handleScanResult = async (decodedText) => {
        setProcessing(true);
        try {
            let data;
            try {
                data = JSON.parse(decodedText);
            } catch (e) {
                throw new Error(language === 'ar' ? 'كود QR غير صالح' : 'Invalid QR code');
            }

            if (!data.uid) {
                throw new Error(language === 'ar' ? 'كود QR لا يحتوي على بيانات العضو' : 'QR code missing member data');
            }

            // Look up user
            const userDoc = await getDoc(doc(db, "users", data.uid));
            const userName = userDoc.exists() 
                ? (userDoc.data().name || userDoc.data().displayName || data.name) 
                : data.name;

            // Check for active subscription
            let subscriptionValid = false;
            let subInfo = null;
            if (data.subId && data.subId !== 'none') {
                const subDoc = await getDoc(doc(db, "subscriptions", data.subId));
                if (subDoc.exists()) {
                    const sub = subDoc.data();
                    if (sub.status === 'confirmed' || sub.status === 'pending') {
                        subscriptionValid = true;
                        subInfo = sub;
                    }
                }
            }

            // Check for duplicate attendance today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayEnd = new Date(today);
            todayEnd.setHours(23, 59, 59, 999);

            const dupCheck = query(
                collection(db, "attendance"),
                where("traineeId", "==", data.uid),
                where("trainerId", "==", trainerId),
                where("date", "==", today.toISOString().split('T')[0])
            );
            const dupSnap = await getDocs(dupCheck);

            if (!dupSnap.empty) {
                setResult({
                    success: true,
                    duplicate: true,
                    userName: userName,
                    message: language === 'ar' ? 'تم تسجيل حضور هذا المتدرب مسبقاً اليوم' : 'This trainee was already checked in today'
                });
                setProcessing(false);
                return;
            }

            // Record attendance
            await addDoc(collection(db, "attendance"), {
                traineeId: data.uid,
                traineeName: userName,
                trainerId: trainerId,
                trainerName: trainerName || '',
                subscriptionId: data.subId || null,
                subscriptionValid: subscriptionValid,
                date: today.toISOString().split('T')[0],
                scanTime: serverTimestamp(),
                sportName: subInfo?.sportName || null
            });

            setResult({
                success: true,
                duplicate: false,
                userName: userName,
                subscriptionValid: subscriptionValid,
                sportName: subInfo?.sportName || null,
                message: language === 'ar' ? 'تم تسجيل الحضور بنجاح!' : 'Attendance recorded successfully!'
            });

        } catch (err) {
            console.error("Scan processing error:", err);
            setError(err.message || (language === 'ar' ? 'حدث خطأ أثناء المعالجة' : 'Error processing scan'));
        } finally {
            setProcessing(false);
        }
    };

    const getText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') return field[language] || field['ar'] || field['en'] || '';
        return field;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`w-full max-w-md ${darkMode ? 'bg-[#1a2235]' : 'bg-white'} rounded-[2.5rem] overflow-hidden shadow-2xl border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <QrCode className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-wider`}>
                            {language === 'ar' ? 'مسح كود الحضور' : 'Scan Attendance'}
                        </h3>
                    </div>
                    <button
                        onClick={() => { stopScanning(); onClose?.(); }}
                        className={`w-10 h-10 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl flex items-center justify-center transition-colors`}
                    >
                        <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="px-6 pb-6">
                    {!scanning && !result && !error && !processing && (
                        <div className="text-center py-12">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20"
                            >
                                <Camera className="w-12 h-12 text-primary" />
                            </motion.div>
                            <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                                {language === 'ar' ? 'اضغط الزر أدناه لفتح الكاميرا ومسح كود المتدرب' : 'Press the button below to open camera and scan trainee QR'}
                            </p>
                            <button
                                onClick={startScanning}
                                className="w-full bg-primary text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                {language === 'ar' ? 'فتح الكاميرا' : 'Open Camera'}
                            </button>
                        </div>
                    )}

                    {scanning && (
                        <div>
                            <div id="qr-reader" ref={scannerRef} className="rounded-2xl overflow-hidden mb-4" style={{ width: '100%' }}></div>
                            <p className={`text-[10px] font-bold text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 animate-pulse`}>
                                {language === 'ar' ? 'وجّه الكاميرا نحو كود QR الخاص بالمتدرب...' : 'Point camera at trainee QR code...'}
                            </p>
                            <button
                                onClick={stopScanning}
                                className={`w-full ${darkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-slate-900'} py-3 rounded-2xl text-xs font-black uppercase tracking-widest`}
                            >
                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    )}

                    {processing && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
                            </p>
                        </div>
                    )}

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-8"
                        >
                            <div className={`w-20 h-20 mx-auto mb-4 rounded-[2rem] flex items-center justify-center ${result.duplicate ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                                {result.duplicate ? (
                                    <AlertCircle className="w-10 h-10 text-amber-500" />
                                ) : (
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                )}
                            </div>
                            <h4 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                                {result.userName}
                            </h4>
                            <p className={`text-xs font-bold ${result.duplicate ? 'text-amber-500' : 'text-emerald-500'} mb-1`}>
                                {result.message}
                            </p>
                            {result.sportName && (
                                <p className={`text-[10px] font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {getText(result.sportName)}
                                </p>
                            )}
                            {!result.subscriptionValid && !result.duplicate && (
                                <p className="text-[10px] font-bold text-amber-500 mt-2">
                                    ⚠️ {language === 'ar' ? 'لا يوجد اشتراك فعّال' : 'No active subscription'}
                                </p>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => { setResult(null); startScanning(); }}
                                    className="flex-1 bg-primary text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    {language === 'ar' ? 'مسح آخر' : 'Scan Next'}
                                </button>
                                <button
                                    onClick={() => { stopScanning(); onClose?.(); }}
                                    className={`flex-1 ${darkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-slate-900'} py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest`}
                                >
                                    {language === 'ar' ? 'إغلاق' : 'Close'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-500/20">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <p className="text-xs font-bold text-red-500 mb-6">{error}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setError(null); startScanning(); }}
                                    className="flex-1 bg-primary text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest"
                                >
                                    {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                                </button>
                                <button
                                    onClick={() => { stopScanning(); onClose?.(); }}
                                    className={`flex-1 ${darkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-slate-900'} py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest`}
                                >
                                    {language === 'ar' ? 'إغلاق' : 'Close'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
