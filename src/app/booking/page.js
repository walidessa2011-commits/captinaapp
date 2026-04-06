"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight, ChevronLeft, MapPin, Home, Building,
    Calendar, Clock, User, CheckCircle2, Info,
    ArrowRight, ArrowLeft, ShieldCheck, Dumbbell,
    Receipt, Lightbulb, Star, Sparkles, Settings,
    X, Save, Phone, Loader2, AlertCircle
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { db, auth } from "@/lib/firebase";
import {
    RecaptchaVerifier, signInWithPhoneNumber
} from "firebase/auth";
import {
    collection, addDoc, serverTimestamp, getDocs, getDoc,
    query, where, doc
} from "firebase/firestore";
import Link from 'next/link';
import HorizontalDatePicker from '@/components/HorizontalDatePicker';
import { matchesSport, normalizeArabic } from '@/lib/utils';
import { getSportImage } from '@/lib/sportsData';

const TERMS = {
    ar: {
        title: "الشروط والأحكام وسياسة التدريب",
        sections: [
            { title: "قواعد التدريب في الجيم", items: ["الزي الرياضي المناسب إلزامي.", "مدة الحصة 60 دقيقة شاملة الإحماء والتهدئة.", "لا يتحمل كابتينا مسؤولية الممتلكات الشخصية.", "اتبع إرشادات المدرب بدقة لتجنب الإصابات."] },
            { title: "قواعد التدريب المنزلي", items: ["توفير مساحة آمنة ومناسبة (2×2 متر على الأقل).", "رسوم انتقال المدرب 50 ريال تُدفع مع الحصة.", "الإلغاء قبل أقل من 4 ساعات يُعدّ حصة مستهلكة.", "بيئة هادئة ومناسبة ضرورية لجودة التدريب."] },
        ]
    },
    en: {
        title: "Terms & Conditions & Training Policy",
        sections: [
            { title: "Gym Training Rules", items: ["Proper sports attire is mandatory.", "Session is 60 minutes including warm-up and cool-down.", "Captina is not responsible for lost personal belongings.", "Follow trainer instructions strictly to avoid injuries."] },
            { title: "Home Training Rules", items: ["Provide safe training space (at least 2×2 meters).", "Home training travel fee (50 SAR) is added per session.", "Cancellations less than 4 hours before are non-refundable.", "Ensure a quiet environment for high-quality training."] },
        ]
    }
};

const TIME_PERIODS = [
    { key: 'morning', icon: '🌅', ar: 'الفترة الصباحية', en: 'Morning', range: '9 AM–12 PM', color: 'from-amber-400 to-orange-500', times: ['09:00 AM', '10:00 AM', '11:00 AM'] },
    { key: 'afternoon', icon: '☀️', ar: 'الفترة النهارية', en: 'Afternoon', range: '12–4 PM', color: 'from-sky-400 to-blue-500', times: ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'] },
    { key: 'evening', icon: '🌙', ar: 'الفترة المسائية', en: 'Evening', range: '4–10 PM', color: 'from-indigo-500 to-violet-600', times: ['04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'] },
];

function BookingContent() {
    const { t, language, darkMode, setAlert, sports: appSports, gyms: appGyms, userData } = useApp();
    const searchParams = useSearchParams();
    const router = useRouter();
    const ar = language === 'ar';

    const isTrial = searchParams.get('trial') === 'true';
    const initialPkg = searchParams.get('package');
    const initialOffer = searchParams.get('offer');
    const preGymId = searchParams.get('gymId');
    const preGymName = searchParams.get('gymName');

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [dbTrainers, setDbTrainers] = useState([]);
    const [trainerSchedules, setTrainerSchedules] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('new');
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [trialBookedTrainers, setTrialBookedTrainers] = useState([]);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [verifyingPhone, setVerifyingPhone] = useState(false);
    const [tempPhone, setTempPhone] = useState(null);

    const [bookingData, setBookingData] = useState({
        sport: searchParams.get('sport') || '',
        sportId: searchParams.get('sportId') || '',
        locationType: preGymId ? 'gym' : 'home',
        address: { city: '', district: '', street: '', building: '' },
        selectedGym: preGymId ? { id: preGymId, name: preGymName || preGymId } : null,
        trainer: null,
        date: '',
        time: '',
        notes: '',
        offerId: initialOffer,
        packageId: initialPkg,
    });

    const bg = darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50';
    const card = darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100';
    const textC = darkMode ? 'text-white' : 'text-slate-900';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
    const inp = darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50' : 'bg-slate-50 border-gray-200 text-slate-900 placeholder:text-gray-400 focus:border-primary/40 focus:bg-white';

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    const gyms = appGyms || [];

    // Pricing
    const basePrice = isTrial || initialOffer === 'offer-trial-free' || initialPkg === 'trial' ? 0 : initialPkg === 'monthly' ? 599 : initialPkg === 'vip' ? 1499 : 100;
    const homeFee = bookingData.locationType === 'home' && !isTrial ? 50 : 0;
    const totalPrice = isTrial ? 0 : basePrice + homeFee;

    // Sport cards
    const sportCards = appSports.map(s => ({
        id: s.id || s.slug,
        name: ar ? (s.name_ar || s.name || '') : (s.name_en || s.name || ''),
        image: s.image || getSportImage(s.id || s.slug),
    })).filter(sc => {
        if (!bookingData.trainer) return true;
        const sportObj = appSports.find(s => (s.id || s.slug) === sc.id);
        return !sportObj || matchesSport(bookingData.trainer, sportObj);
    });

    // Filtered trainers — prefer sportId (stored on selection), fall back to name match
    const filteredTrainers = dbTrainers.filter(trainer => {
        if (!bookingData.sport && !bookingData.sportId) return true;

        // Primary: find sport object by ID (reliable)
        let sportObj = bookingData.sportId
            ? appSports.find(s => (s.id || s.slug) === bookingData.sportId)
            : null;

        // Fallback: name-based lookup
        if (!sportObj && bookingData.sport) {
            sportObj = appSports.find(s => {
                const nAr = normalizeArabic(s.name_ar || (typeof s.name === 'object' ? s.name.ar : s.name) || '');
                const nEn = (s.name_en || (typeof s.name === 'object' ? s.name.en : '') || '').toLowerCase();
                const search = normalizeArabic(bookingData.sport);
                const searchEn = bookingData.sport.toLowerCase();
                return nAr === search || search === nAr ||
                    nEn === searchEn || searchEn === nEn ||
                    nAr.includes(search) || search.includes(nAr) ||
                    nEn.includes(searchEn) || searchEn.includes(nEn);
            });
        }

        if (!sportObj) {
            // Last resort: keyword match against trainer specialty/title
            const sp = normalizeArabic(bookingData.sport) || bookingData.sport.toLowerCase();
            const specialtyText = normalizeArabic(getText(trainer.specialty) || getText(trainer.title) || '');
            return specialtyText.includes(sp) || sp.includes(specialtyText);
        }

        return matchesSport(trainer, sportObj);
    });

    // Time slot availability
    const timeToMins = (t) => {
        if (!t) return 0;
        const [time, period] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + (m || 0);
    };
    const isSlotAvailable = (slotTime) => {
        if (!trainerSchedules.length) return true;
        const sm = timeToMins(slotTime);
        return !trainerSchedules.some(b => {
            const bs = timeToMins(b.time);
            return sm >= bs - 45 && sm < bs + 105;
        });
    };

    // Fetch data
    useEffect(() => {
        const fetchAll = async () => {
            if (!auth.currentUser) { setIsLoadingAddresses(false); return; }
            try {
                const [trainersSnap, addressesSnap, userSnap, trialSnap] = await Promise.all([
                    getDocs(collection(db, "trainers")),
                    getDocs(query(collection(db, "addresses"), where("userId", "==", auth.currentUser.uid))),
                    // Use doc() by UID — users collection uses UID as document ID, not a field
                    getDoc(doc(db, "users", auth.currentUser.uid)),
                    isTrial ? getDocs(query(collection(db, "bookings"), where("userId", "==", auth.currentUser.uid), where("isTrial", "==", true))) : Promise.resolve(null),
                ]);
                const allTrainers = trainersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setDbTrainers(allTrainers.filter(tr => !tr.status || tr.status === 'active'));
                const addrs = addressesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setUserAddresses(addrs);
                if (addrs.length) {
                    const def = addrs.find(a => a.isDefault) || addrs[0];
                    setSelectedAddressId(def.id);
                    setBookingData(p => ({ ...p, address: { city: def.city || '', district: def.district || '', street: def.street || '', building: def.building || '', fullAddress: def.fullAddress || '' } }));
                }
                if (userSnap.exists()) setUserProfile(userSnap.data());
                if (trialSnap) setTrialBookedTrainers(trialSnap.docs.map(d => d.data().trainer?.id).filter(Boolean));
            } catch (e) { console.error(e); } finally { setIsLoadingAddresses(false); }
        };
        fetchAll();
    }, [auth.currentUser, isTrial]);

    useEffect(() => {
        const tid = searchParams.get('trainer');
        if (tid && dbTrainers.length && !bookingData.trainer) {
            const tr = dbTrainers.find(t => t.id === tid);
            if (tr) setBookingData(p => ({ ...p, trainer: tr }));
        }
    }, [dbTrainers, searchParams]);

    useEffect(() => {
        if (!bookingData.trainer || !bookingData.date) return;
        getDocs(query(collection(db, "bookings"), where("trainer.id", "==", bookingData.trainer.id), where("date", "==", bookingData.date), where("status", "in", ["confirmed", "pending"])))
            .then(snap => setTrainerSchedules(snap.docs.map(d => d.data())));
    }, [bookingData.trainer, bookingData.date]);

    useEffect(() => {
        if (bookingData.trainer && bookingData.sport && step === 1) setStep(2);
    }, [bookingData.trainer, bookingData.sport]);

    useEffect(() => {
        if (isTrial && bookingData.sport && filteredTrainers.length === 1 && !bookingData.trainer) {
            setBookingData(p => ({ ...p, trainer: filteredTrainers[0] }));
        }
    }, [bookingData.sport, filteredTrainers, isTrial]);

    const saveBooking = async () => {
        if (isTrial && trialBookedTrainers.includes(bookingData.trainer?.id)) {
            setAlert({ title: ar ? 'تنبيه' : 'Notice', message: ar ? 'حجزت حصة تجريبية مع هذا المدرب مسبقاً' : 'Already booked a trial with this trainer', type: 'error' }); return;
        }
        setIsSubmitting(true);
        try {
            const resolvedName = userProfile?.fullName || getText(userData?.fullName) || '';
            const resolvedPhone = userProfile?.phone || userData?.phone || '';
            await addDoc(collection(db, "bookings"), {
                ...bookingData,
                userName: resolvedName,
                userPhone: resolvedPhone,
                userId: auth.currentUser?.uid,
                userEmail: auth.currentUser?.email,
                createdAt: serverTimestamp(),
                status: 'pending',
                isTrial,
                booking_type: isTrial ? 'trial' : 'paid',
                totalPrice,
                currency: 'SAR',
            });
            setIsSuccess(true);
        } catch (e) {
            console.error(e);
            setAlert({ title: ar ? 'خطأ' : 'Error', message: ar ? 'حدث خطأ أثناء الحجز' : 'Booking error', type: 'error' });
        } finally { setIsSubmitting(false); }
    };

    const handleConfirm = async () => {
        if (!auth.currentUser) { router.push('/login'); return; }
        if (!acceptedTerms) { setShowTerms(true); return; }
        await saveBooking();
    };

    const steps = [
        { id: 1, ar: 'الرياضة', en: 'Sport' },
        { id: 2, ar: 'المدرب', en: 'Trainer' },
        { id: 3, ar: 'الموعد', en: 'Schedule' },
        { id: 4, ar: 'المكان', en: 'Location' },
        { id: 5, ar: 'التأكيد', en: 'Confirm' },
    ];

    const homeAddressReady = bookingData.locationType === 'home'
        ? !!(bookingData.address?.city && bookingData.address?.street)
        : !!bookingData.selectedGym;

    const canNext =
        (step === 1 && !!bookingData.sport) ||
        (step === 2 && !!bookingData.trainer) ||
        (step === 3 && !!bookingData.date && !!bookingData.time) ||
        (step === 4 && homeAddressReady);

    return (
        <div className={`min-h-screen ${bg} pb-40 transition-colors duration-300 relative overflow-hidden`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none translate-x-1/3 -translate-y-1/3 animate-pulse" />
            <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* ── Header ── */}
            <div className="relative z-20 pt-6 px-4 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => router.back()} className={`w-10 h-10 ${card} border rounded-xl flex items-center justify-center transition-all active:scale-95`}>
                        {ar ? <ChevronRight className={`w-5 h-5 ${textC}`} /> : <ChevronLeft className={`w-5 h-5 ${textC}`} />}
                    </button>
                    <div>
                        <h1 className={`text-lg font-black ${textC} tracking-tight flex items-center gap-2`}>
                            {isTrial && <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-1 rounded-full uppercase tracking-wider">{ar ? 'مجاني' : 'FREE'}</span>}
                            {ar ? (isTrial ? 'حجز الحصة التجريبية' : 'حجز حصة تدريبية') : (isTrial ? 'Book Trial Session' : 'Book a Session')}
                        </h1>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>
                            {ar ? 'كابتينا — فنون القتال والدفاع عن النفس' : 'Captina — Martial Arts & Self Defense'}
                        </p>
                    </div>
                </div>

                {/* ── Step Indicator ── */}
                <div className={`${card} border rounded-[1.5rem] p-3 mb-6`}>
                    <div className="flex items-center justify-between relative">
                        {/* Progress line */}
                        <div className={`absolute top-4 inset-x-8 h-0.5 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
                        <motion.div className="absolute top-4 h-0.5 bg-primary" style={{ left: ar ? 'auto' : '2rem', right: ar ? '2rem' : 'auto' }}
                            animate={{ width: `${((step - 1) / 4) * (100 - (32 / 3))}%` }} transition={{ type: 'spring', damping: 20 }} />

                        {steps.map((s) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step > s.id ? 'bg-primary text-white' : step === s.id ? 'bg-primary text-white ring-4 ring-primary/20' : darkMode ? 'bg-white/10 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-wider ${step >= s.id ? 'text-primary' : muted}`}>{ar ? s.ar : s.en}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Step Content ── */}
            <div className="max-w-3xl mx-auto px-4 relative z-10">
                <AnimatePresence mode="wait">

                    {/* Step 1: Sport */}
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                            <h2 className={`text-base font-black ${textC} uppercase tracking-wider`}>{ar ? 'اختر الرياضة' : 'Choose Sport'}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {sportCards.map((sc, i) => (
                                    <button key={sc.id || i} onClick={() => setBookingData(p => ({ ...p, sport: sc.name, sportId: sc.id }))}
                                        className={`relative rounded-[1.5rem] overflow-hidden border-2 transition-all active:scale-[0.97] ${bookingData.sport === sc.name ? 'border-primary shadow-xl shadow-primary/20 scale-[1.01]' : darkMode ? 'border-white/5 hover:border-white/15' : 'border-gray-100 hover:border-gray-200'}`}>
                                        {bookingData.sport === sc.name && (
                                            <div className="absolute top-2.5 end-2.5 z-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                        <div className="aspect-square relative overflow-hidden rounded-t-[1.3rem]">
                                            <img src={sc.image} alt={sc.name} className={`w-full h-full object-cover transition-transform duration-500 ${bookingData.sport === sc.name ? 'scale-110' : 'group-hover:scale-105'}`} />
                                            <div className={`absolute inset-0 transition-all ${bookingData.sport === sc.name ? 'bg-primary/20' : 'bg-black/10'}`} />
                                        </div>
                                        <div className={`px-3 py-2.5 text-start ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                                            <span className={`text-xs font-black ${bookingData.sport === sc.name ? 'text-primary' : textC}`}>{sc.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Trainer */}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                            <div className="flex items-center justify-between">
                                <h2 className={`text-base font-black ${textC} uppercase tracking-wider`}>{ar ? 'اختر المدرب' : 'Choose Trainer'}</h2>
                                {bookingData.sport && <span className={`text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full`}>{bookingData.sport}</span>}
                            </div>

                            {filteredTrainers.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Dumbbell className={`w-12 h-12 ${muted} mx-auto mb-3 opacity-30`} />
                                    <p className={`text-sm font-bold ${muted}`}>{ar ? 'لا يوجد مدربون متاحون لهذه الرياضة' : 'No trainers available for this sport'}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {filteredTrainers.map(trainer => {
                                        const booked = isTrial && trialBookedTrainers.includes(trainer.id);
                                        const selected = bookingData.trainer?.id === trainer.id;
                                        return (
                                            <button key={trainer.id}
                                                onClick={() => {
                                                    if (booked) { setAlert({ title: ar ? 'تنبيه' : 'Notice', message: ar ? 'حجزت تجريبية مع هذا المدرب مسبقاً' : 'Already booked trial with this trainer', type: 'error' }); return; }
                                                    setBookingData(p => ({ ...p, trainer }));
                                                }}
                                                className={`relative ${card} border-2 rounded-[1.5rem] p-4 flex flex-col items-center gap-2.5 transition-all active:scale-[0.97] ${selected ? 'border-primary shadow-xl shadow-primary/15' : darkMode ? 'border-white/5 hover:border-white/15' : 'border-gray-100 hover:border-gray-200'} ${booked ? 'opacity-40' : ''}`}>
                                                {booked && <span className="absolute top-2 start-2 text-[8px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">{ar ? 'تم الحجز' : 'Booked'}</span>}
                                                {selected && <div className="absolute top-2.5 end-2.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>}
                                                <div className="relative">
                                                    <img src={trainer.image || 'https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=200'}
                                                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10" alt="" />
                                                    {selected && <div className="absolute -bottom-1 -end-1 w-5 h-5 bg-primary rounded-full border-2 border-white dark:border-[#0a0f1a] flex items-center justify-center"><CheckCircle2 className="w-2.5 h-2.5 text-white" /></div>}
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-[11px] font-black ${selected ? 'text-primary' : textC} line-clamp-1`}>{getText(trainer.name)}</p>
                                                    <div className="flex items-center gap-1 justify-center mt-0.5">
                                                        <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                                        <span className="text-[9px] font-black text-amber-500">{trainer.rating}</span>
                                                    </div>
                                                    {trainer.specialty && <p className={`text-[9px] font-bold ${muted} mt-0.5 line-clamp-1`}>{getText(trainer.specialty)}</p>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Date & Time */}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                            {/* Trainer context */}
                            {bookingData.trainer && (
                                <div className="bg-gradient-to-r from-primary to-rose-600 rounded-2xl p-4 flex items-center gap-3">
                                    <img src={bookingData.trainer.image || ''} className="w-12 h-12 rounded-xl object-cover border-2 border-white/30 shrink-0" alt="" />
                                    <div className="text-start">
                                        <p className="text-white font-black text-sm">{getText(bookingData.trainer.name)}</p>
                                        <p className="text-white/70 text-xs font-bold">{bookingData.sport}</p>
                                    </div>
                                </div>
                            )}

                            {/* Date Picker */}
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${muted} mb-3 flex items-center gap-2`}><Calendar className="w-3.5 h-3.5 text-primary" />{ar ? 'اختر التاريخ' : 'Select Date'}</p>
                                <HorizontalDatePicker selectedDate={bookingData.date} onDateChange={date => setBookingData(p => ({ ...p, date, time: '' }))} language={language} />
                            </div>

                            {/* Time Periods */}
                            {bookingData.date && (
                                <div className="space-y-3">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${muted} flex items-center gap-2`}><Clock className="w-3.5 h-3.5 text-blue-500" />{ar ? 'اختر الوقت' : 'Select Time'}</p>
                                    {TIME_PERIODS.map(period => (
                                        <div key={period.key} className={`${card} border rounded-[1.5rem] overflow-hidden`}>
                                            <div className={`bg-gradient-to-r ${period.color} px-4 py-2.5 flex items-center justify-between`}>
                                                <div className="flex items-center gap-2">
                                                    <span>{period.icon}</span>
                                                    <span className="text-white font-black text-xs">{ar ? period.ar : period.en}</span>
                                                </div>
                                                <span className="text-white/80 text-[9px] font-bold">{period.range}</span>
                                            </div>
                                            <div className="p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {period.times.map(time => {
                                                    const available = isSlotAvailable(time);
                                                    const selected = bookingData.time === time;
                                                    return (
                                                        <button key={time} disabled={!available}
                                                            onClick={() => available && setBookingData(p => ({ ...p, time }))}
                                                            className={`py-2.5 rounded-xl text-[10px] font-black transition-all border ${!available ? 'opacity-30 cursor-not-allowed line-through border-transparent bg-gray-100 dark:bg-white/5' : selected ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : `border-transparent ${darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}`}>
                                                            {time}
                                                            {!available && <span className="block text-[7px] text-rose-400 mt-0.5">{ar ? 'محجوز' : 'Taken'}</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 4: Location */}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                            <h2 className={`text-base font-black ${textC} uppercase tracking-wider`}>{ar ? 'اختر مكان الحصة' : 'Choose Location'}</h2>

                            {/* Location Type */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { v: 'home', icon: Home, ar: 'في المنزل', en: 'At Home', sub: ar ? 'خصوصية وراحة تامة' : 'Private & comfortable', fee: isTrial ? (ar ? 'مجاني' : 'FREE') : `+50 ${ar ? 'ر.س' : 'SAR'}`, feeColor: 'text-primary' },
                                    { v: 'gym', icon: Building, ar: 'في الصالة', en: 'At Gym', sub: ar ? 'بيئة رياضية متكاملة' : 'Full sports environment', fee: ar ? 'بدون رسوم إضافية' : 'No extra fee', feeColor: 'text-emerald-500' },
                                ].map(({ v, icon: Icon, ar: arL, en: enL, sub, fee, feeColor }) => (
                                    <button key={v} onClick={() => setBookingData(p => ({ ...p, locationType: v, selectedGym: v === 'home' ? null : p.selectedGym }))}
                                        className={`relative ${card} border-2 rounded-2xl p-5 text-start transition-all active:scale-[0.97] ${bookingData.locationType === v ? 'border-primary shadow-lg shadow-primary/10' : darkMode ? 'border-white/5 hover:border-white/15' : 'border-gray-100 hover:border-gray-200'}`}>
                                        {bookingData.locationType === v && <div className="absolute top-3 end-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>}
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${bookingData.locationType === v ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <p className={`text-sm font-black ${textC} mb-0.5`}>{ar ? arL : enL}</p>
                                        <p className={`text-[10px] font-bold ${muted} mb-2`}>{sub}</p>
                                        <p className={`text-[10px] font-black ${feeColor}`}>{fee}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Home: address */}
                            {bookingData.locationType === 'home' && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`${card} border rounded-2xl p-5`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-xs font-black ${textC} flex items-center gap-2`}><MapPin className="w-4 h-4 text-primary" />{ar ? 'عنوان التوصيل' : 'Delivery Address'}</span>
                                    </div>
                                    {isLoadingAddresses ? (
                                        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Saved addresses (if any) */}
                                            {userAddresses.length > 0 && (
                                                <div className="space-y-2">
                                                    {userAddresses.map(addr => (
                                                        <button key={addr.id} onClick={() => {
                                                            setSelectedAddressId(addr.id);
                                                            setBookingData(p => ({ ...p, address: { city: addr.city || '', district: addr.district || '', street: addr.street || '', building: addr.building || '', fullAddress: addr.fullAddress || '' } }));
                                                        }}
                                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-start ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-100 hover:border-gray-200'}`}>
                                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-400'}`}>
                                                                {addr.type === 'work' ? <Building className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-xs font-black ${textC}`}>{addr.label || addr.title || (ar ? 'منزل' : 'Home')}</p>
                                                                <p className={`text-[10px] font-bold ${muted} truncate`}>{addr.fullAddress || [addr.city, addr.district, addr.street].filter(Boolean).join(' - ')}</p>
                                                            </div>
                                                            {selectedAddressId === addr.id && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                                                        </button>
                                                    ))}
                                                    {/* Divider + option to enter new */}
                                                    <button onClick={() => { setSelectedAddressId('new'); setBookingData(p => ({ ...p, address: { city: '', district: '', street: '', building: '', fullAddress: '' } })); }}
                                                        className={`w-full flex items-center gap-2 p-3 rounded-xl border border-dashed text-start transition-all text-[10px] font-black ${selectedAddressId === 'new' ? 'border-primary text-primary bg-primary/5' : darkMode ? 'border-white/15 text-gray-400 hover:border-white/30' : 'border-gray-300 text-gray-400 hover:border-gray-400'}`}>
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {ar ? 'إدخال عنوان جديد' : 'Enter a new address'}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Inline address form — shown when no addresses OR 'new' selected */}
                                            {(userAddresses.length === 0 || selectedAddressId === 'new') && (
                                                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                                    {/* GPS button */}
                                                    <button type="button"
                                                        onClick={() => {
                                                            if (!navigator.geolocation) return;
                                                            navigator.geolocation.getCurrentPosition(
                                                                (pos) => {
                                                                    const { latitude, longitude } = pos.coords;
                                                                    setBookingData(p => ({
                                                                        ...p,
                                                                        address: {
                                                                            ...p.address,
                                                                            gps: { lat: latitude, lng: longitude },
                                                                            fullAddress: p.address.fullAddress || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
                                                                        }
                                                                    }));
                                                                },
                                                                () => setAlert({ title: ar ? 'تنبيه' : 'Notice', message: ar ? 'يرجى تفعيل خدمة الموقع' : 'Please enable location services', type: 'info' })
                                                            );
                                                        }}
                                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-black transition-all ${bookingData.address?.gps ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' : `${darkMode ? 'border-white/10 text-gray-300 hover:border-primary/40' : 'border-gray-200 text-gray-600 hover:border-primary/40'}`}`}>
                                                        <MapPin className="w-4 h-4" />
                                                        {bookingData.address?.gps
                                                            ? (ar ? 'تم تحديد الموقع ✓' : 'Location captured ✓')
                                                            : (ar ? 'تحديد موقعي تلقائياً' : 'Use my current location')}
                                                    </button>

                                                    {/* City */}
                                                    <select
                                                        value={bookingData.address?.city || ''}
                                                        onChange={e => setBookingData(p => ({ ...p, address: { ...p.address, city: e.target.value } }))}
                                                        className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all ${inp}`}>
                                                        <option value="">{ar ? '— اختر المدينة —' : '— Select City —'}</option>
                                                        {[
                                                            { ar: 'الرياض', en: 'Riyadh' }, { ar: 'جدة', en: 'Jeddah' },
                                                            { ar: 'الدمام', en: 'Dammam' }, { ar: 'مكة المكرمة', en: 'Mecca' },
                                                            { ar: 'المدينة المنورة', en: 'Medina' }, { ar: 'الخبر', en: 'Khobar' },
                                                            { ar: 'أبها', en: 'Abha' }, { ar: 'تبوك', en: 'Tabuk' },
                                                            { ar: 'بريدة', en: 'Buraidah' }, { ar: 'الطائف', en: 'Taif' },
                                                            { ar: 'حائل', en: 'Hail' }, { ar: 'جازان', en: 'Jizan' },
                                                        ].map(c => <option key={c.en} value={ar ? c.ar : c.en}>{ar ? c.ar : c.en}</option>)}
                                                    </select>

                                                    {/* District */}
                                                    <input type="text"
                                                        placeholder={ar ? 'الحي' : 'District / Neighborhood'}
                                                        value={bookingData.address?.district || ''}
                                                        onChange={e => setBookingData(p => ({ ...p, address: { ...p.address, district: e.target.value } }))}
                                                        className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all ${inp}`} />

                                                    {/* Street */}
                                                    <input type="text"
                                                        placeholder={ar ? 'اسم الشارع' : 'Street Name'}
                                                        value={bookingData.address?.street || ''}
                                                        onChange={e => setBookingData(p => ({ ...p, address: { ...p.address, street: e.target.value } }))}
                                                        className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all ${inp}`} />

                                                    {/* Building / Apartment */}
                                                    <input type="text"
                                                        placeholder={ar ? 'رقم المبنى / الشقة (اختياري)' : 'Building / Apt No. (optional)'}
                                                        value={bookingData.address?.building || ''}
                                                        onChange={e => setBookingData(p => ({ ...p, address: { ...p.address, building: e.target.value } }))}
                                                        className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all ${inp}`} />

                                                    {/* Notes */}
                                                    <textarea
                                                        rows={2}
                                                        placeholder={ar ? 'ملاحظات للمدرب (كيفية الوصول…)' : 'Notes for trainer (directions…)'}
                                                        value={bookingData.address?.notes || ''}
                                                        onChange={e => setBookingData(p => ({ ...p, address: { ...p.address, notes: e.target.value } }))}
                                                        className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all resize-none ${inp}`} />
                                                </motion.div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Gym: gym list */}
                            {bookingData.locationType === 'gym' && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>{ar ? 'اختر الصالة الرياضية' : 'Select Gym'}</p>
                                    {gyms.map(gym => (
                                        <button key={gym.id} onClick={() => setBookingData(p => ({ ...p, selectedGym: gym }))}
                                            className={`w-full ${card} border-2 rounded-2xl p-4 flex items-center gap-4 text-start transition-all active:scale-[0.98] ${bookingData.selectedGym?.id === gym.id ? 'border-primary shadow-lg shadow-primary/10' : darkMode ? 'border-white/5 hover:border-white/15' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-white/10">
                                                {gym.image ? <img src={gym.image} alt="" className="w-full h-full object-cover" /> : <Dumbbell className="w-7 h-7 text-gray-400 m-3.5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-black ${textC}`}>{getText(gym.name)}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className={`text-[10px] font-bold ${muted} flex items-center gap-1`}><MapPin className="w-3 h-3" />{getText(gym.location)}</span>
                                                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-500"><Star className="w-3 h-3 fill-current" />{gym.rating}</span>
                                                </div>
                                            </div>
                                            {bookingData.selectedGym?.id === gym.id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 5: Confirm */}
                    {step === 5 && (
                        <motion.div key="s5" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                            <h2 className={`text-base font-black ${textC} uppercase tracking-wider`}>{ar ? 'مراجعة وتأكيد الحجز' : 'Review & Confirm'}</h2>

                            {/* Booking Summary */}
                            <div className={`${card} border rounded-2xl divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
                                {[
                                    { icon: Dumbbell, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10', label: ar ? 'الرياضة' : 'Sport', value: bookingData.sport, edit: () => setStep(1) },
                                    { icon: User, color: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10', label: ar ? 'المدرب' : 'Trainer', value: getText(bookingData.trainer?.name), edit: () => setStep(2) },
                                    { icon: Calendar, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', label: ar ? 'التاريخ والوقت' : 'Date & Time', value: `${bookingData.date} • ${bookingData.time}`, edit: () => setStep(3) },
                                    { icon: MapPin, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', label: ar ? 'المكان' : 'Location', value: bookingData.locationType === 'home' ? (ar ? 'في المنزل' : 'At Home') : getText(bookingData.selectedGym?.name), edit: () => setStep(4) },
                                ].map(({ icon: Icon, color, label, value, edit }, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 text-start">
                                            <p className={`text-[9px] font-black uppercase tracking-wider ${muted}`}>{label}</p>
                                            <p className={`text-sm font-black ${textC}`}>{value || '—'}</p>
                                        </div>
                                        <button onClick={edit} className={`text-[9px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-all`}>
                                            {ar ? 'تعديل' : 'Edit'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Price */}
                            <div className={`${card} border rounded-2xl p-5 space-y-3`}>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className={muted}>{ar ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                    <span className={textC}>{isTrial ? (ar ? 'مجاني' : 'FREE') : `${basePrice} ${ar ? 'ر.س' : 'SAR'}`}</span>
                                </div>
                                {!isTrial && homeFee > 0 && (
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className={muted}>{ar ? 'رسوم الانتقال' : 'Travel Fee'}</span>
                                        <span className={textC}>{homeFee} {ar ? 'ر.س' : 'SAR'}</span>
                                    </div>
                                )}
                                <div className={`flex justify-between pt-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                    <span className={`font-black text-base ${textC}`}>{ar ? 'الإجمالي' : 'Total'}</span>
                                    <span className="text-xl font-black text-primary">{isTrial ? (ar ? 'مجاني 🎉' : 'FREE 🎉') : `${totalPrice} ${ar ? 'ر.س' : 'SAR'}`}</span>
                                </div>
                            </div>

                            {/* Customer info */}
                            <div className={`${card} border rounded-2xl p-5`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-black ${textC} flex items-center gap-2`}><User className="w-4 h-4 text-primary" />{ar ? 'بيانات العميل' : 'Customer Info'}</span>
                                    <button onClick={() => setIsEditingContact(e => !e)} className={`p-1.5 rounded-lg ${muted} hover:text-primary transition-colors`}>
                                        {isEditingContact ? <CheckCircle2 className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                                    </button>
                                </div>
                                {isEditingContact ? (
                                    <div className="space-y-3">
                                        {[{ k: 'fullName', label: ar ? 'الاسم الكامل' : 'Full Name' }, { k: 'phone', label: ar ? 'رقم الجوال' : 'Phone' }].map(({ k, label }) => (
                                            <input key={k} type="text" placeholder={label} value={userProfile?.[k] || ''}
                                                onChange={e => setUserProfile(p => ({ ...p, [k]: e.target.value }))}
                                                className={`w-full border rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all ${inp}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: ar ? 'الاسم' : 'Name', value: userProfile?.fullName || getText(userData?.fullName) || '—' },
                                            { label: ar ? 'الجوال' : 'Phone', value: userProfile?.phone || userData?.phone || '—' },
                                            { label: ar ? 'البريد' : 'Email', value: auth.currentUser?.email || '—' },
                                        ].map(({ label, value }, i) => (
                                            <div key={i} className={i === 2 ? 'col-span-2' : ''}>
                                                <p className={`text-[9px] font-black uppercase tracking-wider ${muted} mb-0.5`}>{label}</p>
                                                <p className={`text-xs font-black ${textC} truncate`}>{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex gap-3">
                                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">{ar ? 'تنبيه' : 'Note'}</p>
                                    <p className={`text-[10px] font-bold ${muted} leading-relaxed`}>
                                        {ar ? 'الإلغاء قبل أقل من 4 ساعات يُعدّ حصة مستهلكة. تأكد من وجود مساحة مناسبة في المنزل إذا اخترت التدريب المنزلي.' : 'Cancellations less than 4 hours before are non-refundable. Ensure adequate space at home if choosing home training.'}
                                    </p>
                                </div>
                            </div>

                            {/* Terms checkbox */}
                            <label className={`flex items-start gap-3 cursor-pointer p-3 ${darkMode ? 'bg-white/5 hover:bg-white/8' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl transition-all`}>
                                <div onClick={() => setAcceptedTerms(s => !s)}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${acceptedTerms ? 'bg-primary border-primary' : 'border-gray-300 dark:border-white/20'}`}>
                                    {acceptedTerms && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-[10px] font-bold ${muted} leading-relaxed`}>
                                    {ar ? 'أوافق على ' : 'I agree to the '}
                                    <button type="button" onClick={() => setShowTerms(true)} className="text-primary font-black hover:underline">
                                        {ar ? 'الشروط والأحكام وسياسة التدريب' : 'Terms & Conditions & Training Policy'}
                                    </button>
                                </span>
                            </label>

                            {/* Confirm button */}
                            <button disabled={isSubmitting || !acceptedTerms} onClick={handleConfirm}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                {isSubmitting ? (ar ? 'جاري الحجز...' : 'Booking...') : (ar ? 'إتمام الحجز' : 'Complete Booking')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Bottom Navigation ── */}
                {step < 5 && (
                    <div className="flex items-center gap-3 mt-8">
                        {step > 1 && (
                            <button onClick={() => setStep(s => s - 1)}
                                className={`w-12 h-12 ${card} border rounded-xl flex items-center justify-center transition-all active:scale-95`}>
                                {ar ? <ChevronRight className={`w-5 h-5 ${textC}`} /> : <ChevronLeft className={`w-5 h-5 ${textC}`} />}
                            </button>
                        )}
                        <button disabled={!canNext} onClick={() => setStep(s => s + 1)}
                            className="flex-1 py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            {ar ? 'متابعة' : 'Continue'}
                            {ar ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>

            {/* ── Terms Modal ── */}
            <AnimatePresence>
                {showTerms && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end md:items-center justify-center p-4"
                        onClick={e => e.target === e.currentTarget && setShowTerms(false)}>
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                            className={`w-full max-w-lg ${darkMode ? 'bg-[#1a2235]' : 'bg-white'} rounded-[2rem] shadow-2xl overflow-hidden`}>
                            <div className={`p-5 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
                                <h3 className={`text-sm font-black ${textC}`}>{TERMS[language].title}</h3>
                                <button onClick={() => setShowTerms(false)} className={`w-8 h-8 ${darkMode ? 'bg-white/10' : 'bg-gray-100'} rounded-xl flex items-center justify-center ${muted}`}>
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-5 space-y-5 overflow-y-auto max-h-80">
                                {TERMS[language].sections.map((sec, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-3">{sec.title}</p>
                                        <div className="space-y-2">
                                            {sec.items.map((item, j) => (
                                                <div key={j} className={`flex items-start gap-2.5 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                                    <span className="w-5 h-5 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{j + 1}</span>
                                                    <p className={`text-xs font-bold ${muted} leading-relaxed`}>{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={`p-5 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                <button onClick={() => { setAcceptedTerms(true); setShowTerms(false); }}
                                    className="w-full py-3.5 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                                    {ar ? 'فهمت وأوافق' : 'I Understand & Agree'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Success Overlay ── */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 18 }}
                            className={`w-full max-w-md ${darkMode ? 'bg-[#1a2235]' : 'bg-white'} rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden`}>
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-primary to-amber-400" />
                            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.2 }}
                                className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            </motion.div>
                            <h2 className={`text-2xl font-black ${textC} mb-2`}>{ar ? '🎉 تم إرسال طلبك!' : '🎉 Booking Sent!'}</h2>
                            <p className={`text-sm font-bold ${muted} mb-4 leading-relaxed`}>
                                {ar ? 'سيتواصل معك فريق كابتينا خلال ساعات لتأكيد موعدك.' : 'The Captina team will contact you within hours to confirm your session.'}
                            </p>
                            {isTrial && (
                                <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 mb-6 text-start">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-1">{ar ? 'هدية بعد الحصة 🎁' : 'Post-Trial Gift 🎁'}</p>
                                    <p className={`text-xs font-bold ${muted}`}>{ar ? 'احصل على خصم 20% عند اشتراكك في أي باقة بعد الحصة مباشرة!' : 'Get 20% OFF when you subscribe to any package right after your session!'}</p>
                                </div>
                            )}
                            <div className="space-y-3">
                                <Link href="/profile/bookings" className="block w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20">
                                    {ar ? 'متابعة حجوزاتي' : 'Track My Bookings'}
                                </Link>
                                <Link href="/" className={`block w-full py-3 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} font-black text-sm transition-colors`}>
                                    {ar ? 'العودة للرئيسية' : 'Back to Home'}
                                </Link>
                            </div>
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
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <BookingContent />
        </Suspense>
    );
}
