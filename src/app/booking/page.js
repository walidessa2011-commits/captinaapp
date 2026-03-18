"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, ChevronLeft, MapPin, Home, Building, 
    Calendar, Clock, User, CheckCircle2, Info, 
    ArrowRight, ArrowLeft, ShieldCheck, Dumbbell,
    Map as MapIcon, Crosshair, Receipt, Lightbulb,
    HandMetal, Star
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import Link from 'next/link';
import HorizontalDatePicker from '@/components/HorizontalDatePicker';

function BookingContent() {
    const { t, language, darkMode } = useApp();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Initial data from URL
    const isTrial = searchParams.get('trial') === 'true';
    const initialPkg = searchParams.get('package');
    const initialSport = searchParams.get('sport') || t('karateContent.title');

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [bookingData, setBookingData] = useState({
        sport: searchParams.get('sport') || '',
        locationType: 'home', // 'home' or 'gym'
        address: {
            city: t('booking.city'),
            district: '',
            street: '',
            building: ''
        },
        selectedGym: null,
        trainer: null,
        date: '',
        time: '',
        notes: ''
    });

    const [dbTrainers, setDbTrainers] = useState([]);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const q = query(collection(db, "trainers"), where("status", "==", "active"));
                const snap = await getDocs(q);
                setDbTrainers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error("Error fetching trainers:", err);
            }
        };
        fetchTrainers();
    }, []);

    const steps = [
        { id: 1, label: t('booking.selectSport') },
        { id: 2, label: t('booking.selectLocation') },
        { id: 3, label: t('booking.selectDateTime') },
        { id: 4, label: t('booking.checkout') }
    ];

    // Pricing logic
    const basePrice = isTrial ? 0 : 100;
    const homeFee = bookingData.locationType === 'home' ? 50 : 0;
    const totalPrice = basePrice + homeFee;

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const gyms = t('gymsData') || [];

    const sportsOptions = t('booking.sportsList') || [];

    const handleConfirm = async () => {
        if (!auth.currentUser) {
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "bookings"), {
                ...bookingData,
                userId: auth.currentUser.uid,
                status: 'pending',
                totalPrice: totalPrice,
                currency: t('currency'),
                createdAt: serverTimestamp(),
                isTrial: isTrial
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Error adding booking: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const trainers = dbTrainers.length > 0 ? dbTrainers : (t('pageTrainersData') || []);

    const textClass = darkMode ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-40 transition-colors duration-500 relative overflow-hidden`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${darkMode ? 'bg-primary/20' : 'bg-primary/10'} rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>
            <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${darkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'} rounded-full blur-[100px] -z-0 -translate-x-1/2 translate-y-1/2`}></div>
            {/* Header / Breadcrumbs - Compact Version */}
            <header className="relative z-20 pt-6 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{t('booking.pageTitle')}</span>
                    </motion.div>

                    {/* Consolidated Title Line - Horizontal */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase text-center">
                                {language === 'ar' 
                                    ? `( ${t('booking.pageTitle')} - حجز كابتنية )` 
                                    : `( ${t('booking.pageTitle')} - Captina Booking )`}
                            </h1>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Progress Bar - Ultra Compact */}
            <div className="bg-black/20 border-b border-white/5 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between relative px-2">
                    {steps.map((s, i) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step >= s.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white/5 text-gray-500'}`}>
                                {step > s.id ? <CheckCircle2 className="w-3 h-3" /> : s.id}
                            </div>
                            <span className={`text-[7px] font-black uppercase tracking-tighter text-center whitespace-nowrap ${step >= s.id ? 'text-primary' : 'text-gray-500'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                    {/* Background Line */}
                    <div className="absolute top-3 left-8 right-8 h-[1px] bg-white/5 -z-0"></div>
                    {/* Active Progress Line */}
                    <div className="absolute top-3 left-8 right-8 h-[1px] -z-0">
                        <motion.div 
                            className="h-full bg-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]"
                            initial={{ width: '0%' }}
                            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-6 pb-8 max-w-2xl lg:max-w-6xl">
                {/* Step Content */}
                <div className="space-y-6">
                    {step === 1 && (
                        <AnimatePresence mode="wait">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-lg font-black text-gray-900 dark:text-white px-1 text-start">
                                    {t('booking.chooseSportType')}
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {sportsOptions.map((sport, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setBookingData({...bookingData, sport})}
                                            className={`relative p-5 rounded-[32px] border-2 transition-all flex flex-col items-center justify-center gap-4 group ${bookingData.sport === sport ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/20 scale-[1.02]' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-slate-800 hover:border-primary/30'}`}
                                        >
                                            {bookingData.sport === sport && (
                                                <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-full shadow-lg">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            )}
                                            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 ${bookingData.sport === sport ? 'bg-primary text-white rotate-6' : 'bg-gray-100 dark:bg-white/5 text-gray-400 group-hover:scale-110'}`}>
                                                <Dumbbell className="w-8 h-8" />
                                            </div>
                                            <span className={`text-sm font-black transition-colors ${bookingData.sport === sport ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {sport}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {step === 2 && (
                        <AnimatePresence mode="wait">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Selected Sport Card (from HTML Template) */}
                                <div className="bg-gradient-to-br from-primary to-orange-600 rounded-[28px] p-5 flex items-center justify-between shadow-xl shadow-primary/20 relative overflow-hidden group">
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                            <Dumbbell className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="text-start">
                                            <h3 className="text-white font-black text-lg leading-none mb-1">{bookingData.sport}</h3>
                                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">45 {t('booking.activeTrainees')}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setStep(1)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20 transition-all active:scale-95 relative z-10">
                                        {language === 'ar' ? 'تغيير' : 'Change'}
                                    </button>
                                    {/* Decor */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                </div>

                                <h2 className="text-lg font-black text-gray-900 dark:text-white px-1 text-start">
                                    {t('booking.chooseLocation')}
                                </h2>

                                {/* Location Type Toggle */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setBookingData({...bookingData, locationType: 'home'})}
                                        className={`relative p-6 rounded-[32px] border-2 text-start transition-all ${bookingData.locationType === 'home' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-slate-800'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${bookingData.locationType === 'home' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                            <Home className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">
                                            {t('booking.atHome')}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 leading-tight mb-4">
                                            {t('booking.privacyText')}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-primary text-xs font-black">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>+50 {t('currency')}</span>
                                        </div>
                                        {bookingData.locationType === 'home' && (
                                            <div className="absolute top-6 right-6 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>

                                    <button 
                                        onClick={() => setBookingData({...bookingData, locationType: 'gym'})}
                                        className={`relative p-6 rounded-[32px] border-2 text-start transition-all ${bookingData.locationType === 'gym' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-slate-800'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${bookingData.locationType === 'gym' ? 'bg-blue-600 text-white' : 'bg-blue-600/10 text-blue-600'}`}>
                                            <Building className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">
                                            {t('booking.atGym')}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 leading-tight mb-4">
                                            {t('booking.motivatingEnvText')}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-black">
                                            <Receipt className="w-4 h-4" />
                                            <span>{t('booking.noExtraFee')}</span>
                                        </div>
                                        {bookingData.locationType === 'gym' && (
                                            <div className="absolute top-6 right-6 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                </div>

                                {/* Dynamic Section: Address vs Gyms */}
                                {bookingData.locationType === 'home' ? (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 md:p-8 border border-gray-100 dark:border-white/5 space-y-6 shadow-sm">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                                    <MapPin className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                                    {t('booking.addressDetails')}
                                                </h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5 text-start">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2">{t('booking.city')}</label>
                                                    <select className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl px-4 py-4 text-sm font-bold outline-none transition-all">
                                                        <option>{language === 'ar' ? 'الرياض' : 'Riyadh'}</option>
                                                        <option>{language === 'ar' ? 'جدة' : 'Jeddah'}</option>
                                                        <option>{language === 'ar' ? 'الدمام' : 'Dammam'}</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5 text-start">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2">{t('booking.district')}</label>
                                                    <select className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl px-4 py-4 text-sm font-bold outline-none transition-all">
                                                        <option>{language === 'ar' ? 'العليا' : 'Olaya'}</option>
                                                        <option>{language === 'ar' ? 'الملقا' : 'Al-Malqa'}</option>
                                                        <option>{language === 'ar' ? 'النرجس' : 'An-Narjis'}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 text-start">
                                                <label className="text-[10px] font-black text-gray-400 uppercase px-2">{t('booking.addressDetails')}</label>
                                                <input 
                                                    type="text" 
                                                    placeholder={t('booking.addressExample')} 
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl px-4 py-4 text-sm font-bold outline-none transition-all"
                                                />
                                            </div>
                                            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all">
                                                <Crosshair className="w-5 h-5" />
                                                {t('booking.useCurrentLocation')}
                                            </button>
                                        </div>

                                        {/* Map Placeholder */}
                                        <div className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-full">
                                            <div className="flex-1 min-h-[300px] bg-slate-200 dark:bg-white/5 relative flex items-center justify-center">
                                                <div className="text-center space-y-3">
                                                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-xl">
                                                        <MapIcon className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{t('booking.viewMap')}</p>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-gray-50 dark:bg-white/5 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t('booking.currentAddressPlaceholder')}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase px-2 text-start tracking-widest">{t('booking.nearbyGyms')}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {gyms.map((gym) => (
                                                <button 
                                                    key={gym.id}
                                                    onClick={() => setBookingData({...bookingData, selectedGym: gym})}
                                                    className={`bg-white dark:bg-slate-800 rounded-[32px] p-6 flex flex-col gap-4 border-2 transition-all text-start group ${bookingData.selectedGym?.id === gym.id ? 'border-primary shadow-xl shadow-primary/10' : 'border-transparent shadow-sm hover:border-gray-200'}`}
                                                >
                                                    <div className="flex items-start justify-between w-full">
                                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gym.color || 'from-blue-500 to-indigo-600'} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                                            {gym.image ? (
                                                                <img src={gym.image} className="w-full h-full object-cover rounded-2xl" alt="" />
                                                            ) : (
                                                                <Dumbbell className="w-8 h-8 text-white" />
                                                            )}
                                                        </div>
                                                        {bookingData.selectedGym?.id === gym.id && (
                                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-tight">{gym.name}</h4>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold">
                                                                <MapPin className="w-4 h-4 text-primary" />
                                                                {gym.area || (language === 'ar' ? 'حي العليا' : 'Olaya')} • {gym.distance || `1.2 ${language === 'ar' ? 'كم' : 'km'}`}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest pt-3 border-t border-gray-50 dark:border-white/5">
                                                                <div className="flex items-center gap-1.5 text-amber-500">
                                                                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                                    {gym.rating}
                                                                </div>
                                                                <div className="text-gray-400 flex items-center gap-1.5">
                                                                    <User className="w-3.5 h-3.5" />
                                                                    {gym.trainersCount || 10} {t('trainers')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {step === 3 && (
                        <AnimatePresence mode="wait">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white px-1 text-start">
                                        {t('booking.selectYourTrainer')}
                                    </h2>
                                    <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                                        {trainers.map((trainer) => (
                                            <button 
                                                key={trainer.id}
                                                onClick={() => setBookingData({...bookingData, trainer})}
                                                className={`flex-shrink-0 w-32 md:w-full bg-white dark:bg-slate-800 rounded-[28px] p-3 border-2 transition-all flex flex-col items-center gap-2 ${bookingData.trainer?.id === trainer.id ? 'border-primary shadow-lg shadow-primary/5' : 'border-transparent shadow-sm'}`}
                                            >
                                                <div className="relative">
                                                    <img src={trainer.image || trainer.profileImage || 'https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=200'} referrerPolicy="no-referrer" className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt={typeof trainer.name === 'string' ? trainer.name : trainer.name?.[language]} />
                                                    {bookingData.trainer?.id === trainer.id && (
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <h4 className="text-[10px] font-black text-gray-900 dark:text-white text-center line-clamp-1">{typeof trainer.name === 'string' ? trainer.name : trainer.name?.[language]}</h4>
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 className="w-2 h-2 text-amber-500 fill-amber-500" />
                                                    <span className="text-[8px] font-black text-gray-500">{trainer.rating}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white px-1 text-start">
                                        {t('booking.setDateAndTime')}
                                    </h2>
                                    
                                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Left Column: Date and Notes */}
                                                <div className="space-y-4 text-start">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2 flex items-center gap-2 tracking-widest">
                                                        <Calendar className="w-4 h-4 text-primary" />
                                                        {t('booking.dateLabel')}
                                                    </label>
                                                    <HorizontalDatePicker 
                                                        selectedDate={bookingData.date}
                                                        onDateChange={(date) => setBookingData({...bookingData, date})}
                                                        language={language}
                                                    />
                                                </div>

                                                <div className="space-y-4 text-start">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase px-2 flex items-center gap-2 tracking-widest">
                                                        <Info className="w-4 h-4 text-emerald-500" />
                                                        {t('booking.extraNotes')}
                                                    </label>
                                                    <textarea 
                                                        placeholder={t('booking.trainerNotesPlaceholder')}
                                                        value={bookingData.notes}
                                                        onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                                                        className="w-full bg-gray-50 dark:bg-zinc-900 border border-transparent focus:border-primary/50 rounded-[2rem] px-6 py-5 text-sm font-bold outline-none h-32 lg:h-40 resize-none transition-all shadow-inner"
                                                    />
                                                </div>

                                            {/* Right Column: Time Selection */}
                                            <div className="space-y-4 text-start">
                                                <label className="text-[10px] font-black text-gray-400 uppercase px-2 flex items-center gap-2 tracking-widest">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    {t('booking.timeLabel')}
                                                </label>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                    {[
                                                        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
                                                        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
                                                        '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
                                                    ].map((time) => (
                                                        <button 
                                                            key={time}
                                                            onClick={() => setBookingData({...bookingData, time})}
                                                            className={`py-4 rounded-2xl text-[10px] font-black transition-all border-2 ${
                                                                bookingData.time === time 
                                                                ? 'border-primary bg-primary text-white shadow-xl shadow-primary/20 scale-[1.05] z-10' 
                                                                : 'border-transparent bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                                                            }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {step === 4 && (
                        <AnimatePresence mode="wait">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">
                                        {t('booking.reviewBooking')}
                                    </h2>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
                                            {[
                                                { label: t('booking.service'), value: bookingData.sport, icon: Dumbbell, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                                                { label: t('booking.selectLocation'), value: bookingData.locationType === 'home' ? (`${t('booking.atHome')} (+50)`) : (bookingData.selectedGym?.name || '-'), icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                                { label: t('booking.selectTrainer'), value: bookingData.trainer ? (typeof bookingData.trainer.name === 'string' ? bookingData.trainer.name : bookingData.trainer.name?.[language]) : '-', icon: User, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                                { label: t('booking.selectDateTime'), value: `${bookingData.date} • ${bookingData.time}`, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 text-start group">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.bg}`}>
                                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                                        <p className="text-xs font-black text-gray-900 dark:text-white">{item.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-amber-50 dark:bg-amber-500/10 border-2 border-dashed border-amber-200 dark:border-amber-500/20 rounded-3xl p-5 text-start">
                                            <div className="flex gap-3">
                                                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                                <div className="space-y-2">
                                                    <h5 className="text-[11px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider">{t('booking.bookingTips')}</h5>
                                                    <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
                                                        {t('booking.cancellationPolicy')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-[32px] p-8 text-white text-start relative overflow-hidden flex flex-col justify-center min-h-[300px] lg:min-h-full">
                                        <div className="flex items-center gap-3 mb-8 relative z-10">
                                            <Receipt className="w-6 h-6 text-primary" />
                                            <h4 className="text-lg font-black uppercase tracking-widest">{t('booking.costSummary')}</h4>
                                        </div>
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                <span>{t('booking.sessionPrice')}</span>
                                                <span className="text-white text-base">{basePrice} {t('currency')}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                <span>{t('booking.homeFee')}</span>
                                                <span className="text-white text-base">{homeFee} {t('currency')}</span>
                                            </div>
                                            <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                                <span className="text-sm font-black uppercase tracking-widest">{t('booking.totalPrice')}</span>
                                                <div className="text-end">
                                                    <span className="text-5xl font-black text-primary leading-none">{totalPrice}</span>
                                                    <span className="text-xs font-black ml-2 text-slate-400 uppercase">{t('currency')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Circles Background */}
                                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Bottom Navigation / Action Bar */}
            {!isSuccess && (
                <div className="pt-8 pb-12 w-full">
                    <div className="container mx-auto max-w-2xl lg:max-w-6xl flex items-center gap-4 px-4">
                        {step > 1 && (
                            <button 
                                onClick={prevStep}
                                className="p-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-all"
                            >
                                {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                            </button>
                        )}
                        <button 
                            disabled={
                                isSubmitting ||
                                (step === 1 && !bookingData.sport) ||
                                (step === 2 && bookingData.locationType === 'gym' && !bookingData.selectedGym) ||
                                (step === 3 && (!bookingData.trainer || !bookingData.date || !bookingData.time))
                            }
                            onClick={step === 4 ? handleConfirm : nextStep}
                            className="flex-1 bg-primary text-white py-4 rounded-[20px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        {step === 4 ? t('booking.confirmBooking') : t('booking.continue')}
                                    </span>
                                    {language === 'ar' ? (
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Success Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-[40px] p-10 max-w-sm w-full text-center space-y-6 shadow-2xl"
                        >
                            <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                    {t('booking.sentToAdmin')}
                                </h2>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                    {t('booking.waitingForConfirmation')}
                                </p>
                            </div>
                            <Link 
                                href="/profile/bookings"
                                className="block w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
                            >
                                {language === 'ar' ? 'الذهاب لحجوزاتي' : 'Go to My Bookings'}
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Booking() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        }>
            <BookingContent />
        </Suspense>
    );
}
