"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, collection, query, where, getDocs, addDoc, serverTimestamp, setDoc, orderBy, limit, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const AppContext = createContext();

export const translations = {
    ar: {
        welcome: "مرحباً",
        goodDay: "نهارك سعيد",
        profile: "الملف الشخصي",
        settings: "الضبط",
        gymsPageTitle: "نوادي كابتنا المعتمدة",
        "home": "الرئيسية",
        "all": "الكل",
        "sports": "الرياضات",
        "trainers": "المدربين",
        "store": "المتجر",
        "offers": "العروض",
        "membership_plans": "خطط العضوية",
        "main": "الرئيسية",
        viewAll: "عرض الكل",
        bookNow: "احجز الآن",
        activeMember: "عضو نشط",
        logout: "تسجيل الخروج",
        darkMode: "الوضع الليلي",
        language: "اللغة",
        arabic: "العربية",
        english: "الإنجليزية",
        topTrainers: "نخبة المدربين",
        featuredServices: "خدمات استثنائية",
        startJourney: "ابدأ رحلتك الآن",
        trialSession: "حصة تجريبية",
        fitBody: "مدربك الشخصي في عالمك الخاص",
        futureStartsHere: "مستقبلك يبدأ هنا",
        powerfulOffers: "أقوى العروض",
        useOffer: "استفيد من العرض",
        notifications: "الإشعارات",
        accountSecurity: "الحساب والأمان",
        appearance: "المظهر والإشعارات",
        support: "الدعم والمساعدة",
        personalInfo: "المعلومات الشخصية",
        changePassword: "تغيير كلمة المرور",
        pushNotifications: "إشعارات التطبيق",
        aboutApp: "عن كابتينا",
        contactSupport: "تواصل مع الدعم",
        login: "تسجيل الدخول",
        registerTitle: "عضوية جديدة",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        fullName: "الاسم بالكامل",
        phone: "رقم الجوال",
        forgotPassword: "نسيت كلمة المرور؟",
        dontHaveAccount: "ليس لديك حساب؟",
        alreadyHaveAccount: "لديك حساب بالفعل؟",
        joinUsNow: "انضم إلينا الآن",
        orVia: "أو عبر",
        acceptTerms: "أوافق على جميع الشروط والأحكام",
        createNewAccount: "إنشاء حساب جديد",
        loginToAccount: "دخول للحساب",
        loginWithPhone: "تسجيل الدخول بالجوال",
        loginWithGoogle: "تسجيل الدخول بـ Google",
        loginWithBiometrics: "الدخول بالبصمة / معرف الوجه",
        phonePlaceholder: "5xxxxxxxx",
        verificationCode: "رمز التحقق",
        sendCode: "إرسال الرمز",
        verifyCode: "تحقق من الرمز",
        biometricLogin: "بالبصمة",
        invalidCode: "رمز التحقق غير صحيح",
        loginSuccess: "تم تسجيل الدخول بنجاح",
        biometricSuccess: "تم تفعيل البصمة بنجاح",
        discoverWorld: "اكتشف عالمك التدريبي الجديد",
        discoverDesc: "بوابتك للوصول لأفضل المدربين والبرامج التدريبية المخصصة عالمياً.",
        joinElite: "انضم إلى نخبة الرياضيين",
        joinEliteDesc: "خطوتك الأولى نحو جسم مثالي وحياة صحية تبدأ بإنشاء حسابك اليوم.",
        heroTitle: "مدربك الشخصي في عالمك الخاص",
        heroDesc: "لا تنتظر الفرصة، اصنعها. مع كابتينا، نوفر لك أدوات النجاح والمدربين الأفضل عالمياً لتحقيق أهدافك البدنية في أقل وقت ممكن.",
        members: "مشترك",
        trainersStat: "مدرب",
        muscleGrowth: "تطور العضلات",
        bestRating: "أفضل تقييم 2026",
        strongestOffers: "أقوى العروض",
        claimOffer: "استفيد من العرض",
        exceptionalServices: "خدمات استثنائية",
        exceptionalServicesDesc: "نقدم لك كل ما تحتاجه للوصول للقمة",
        eliteTrainers: "مدربون نخبة",
        precisePlans: "خطط دقيقة",
        genuineEquipment: "معدات أصلية",
        quickResults: "نتائج سريعة",
        serviceDesc: "وصف مختصر للخدمة المختارة بعناية.",
        readMore: "المزيد",
        offersData: [
            { title: "خصم 50% للإشتراك السنوي", subtitle: "لفترة محدودة جداً", badge: "عرض خاص" },
            { title: "حصة تجريبية مجانية", subtitle: "مع نخبة من مدربينا", badge: "مجاناً" },
            { title: "باقة التغذية المتكاملة", subtitle: "خصم يصل إلى 30%", badge: "الأكثر طلباً" },
            { title: "شحن مجاني للمتجر", subtitle: "على جميع الطلبات فوق 200 ريال", badge: "حصري" }
        ],
        trainersData: [
            { name: "أحمد", role: "لياقة" },
            { name: "سارة", role: "يوغا" },
            { name: "محمد", role: "بناء أجسام" },
            { name: "ليلى", role: "تخسيس" }
        ],
        gymsPageTitle: "نوادي كابتنا المعتمدة",
        offersPageTitle: "عروض كابتينا",
        activateOffer: "تفعيل العرض الآن",
        allOffersData: [
            {
                title: "خصم 50% للإشتراك السنوي",
                subtitle: "لفترة محدودة جداً",
                badge: "عرض خاص",
                expiry: "ينتهي في 30 مارس",
                description: "احصل على اشتراك كامل لمدة سنة بنصف السعر. يشمل جميع الصالات والمدربين والدعم الغذائي."
            },
            {
                title: "حصة تجريبية مجانية",
                subtitle: "مع نخبة من مدربينا",
                badge: "مجاناً",
                expiry: "متاح دائماً للأعضاء الجدد",
                description: "جرب خدماتنا قبل الاشتراك. احصل على تقييم بدني كامل وحصة تدريبية لمدة 60 دقيقة مجاناً."
            },
            {
                title: "باقة التغذية المتكاملة",
                subtitle: "خصم يصل إلى 30%",
                badge: "الأكثر طلباً",
                expiry: "لفترة محدودة",
                description: "صمم خطتك الغذائية مع خبراء التغذية لدينا بخصم حصري. الوجبات والمكملات والنصائح في مكان واحد."
            },
            {
                title: "شحن مجاني للمتجر",
                subtitle: "على جميع الطلبات فوق 200 ريال",
                badge: "حصري",
                expiry: "ينتهي قريباً",
                description: "لا تقلق بشأن تكاليف التوصيل. تسوق أفضل الأجهزة والمكملات والملابس الرياضية واحصل على توصيل لمنزلك مجاناً."
            }
        ],
        trainerPageTitle: "نخبة المدربين",
        trainerPageSub: "خبراء في تغيير مسار حياتك الرياضي",
        searchTrainersPlaceholder: "ابحث عن مدربك المفضل...",
        expYears: "خبرة أكثر من",
        profileText: "الملف",
        pageTrainersData: [
            {
                name: "كابتن أحمد",
                specialty: "خسارة الوزن وتحديد العضلات",
                exp: "12 سنة",
                rating: 4.9
            },
            {
                name: "كابتن سارة",
                specialty: "لياقة بدنية مرونة (يوغا)",
                exp: "8 سنوات",
                rating: 4.8
            },
            {
                name: "كابتن محمد",
                specialty: "بناء أجسام وتضخيم",
                exp: "15 سنة",
                rating: 5.0
            },
            {
                name: "كابتن خالد",
                specialty: "رفع أثقال وقوة بدنية",
                exp: "10 سنوات",
                rating: 4.7
            }
        ],
        sportsPageTitle: "رياضاتنا المتنوعة",
        sportsPageSub: "اختر رياضتك المفضلة وابدأ رحلة التحدي مع نخبة من المدربين المحترفين.",
        exploreText: "استكشف",
        intensityText: "الشدة",
        durationText: "المدة",
        readyToJoinTitle: "هل أنت جاهز لتغيير مظهرك؟",
        readyToJoinSub: "انضم إلينا اليوم واحصل على تقييم بدني مجاني لتحديد الرياضة والبرنامج الأنسب لأهدافك.",
        packages: "الباقات",
        booking: "احجز",
        quickLinks: "روابط سريعة",
        needHelp: "تحتاج مساعدة؟",
        faqText: "الأسئلة الشائعة",
        contactUs: "تواصل معنا",
        helpSectionTitle: "تواصل معنا",
        userName: "فهد العتيبي",
        privacy: "الخصوصية",
        accountVerification: "توثيق الحساب",
        important: "مهم",
        helpCenter: "مركز المساعدة",
        termsAndConditions: "الشروط والأحكام",
        packagesPageTitle: "استثمر في نفسك",
        packagesPageSub: "باقاتنا مصممة بدقة لتناسب مختلف المستويات والأهداف.",
        mostPopular: "الأكثر طلباً",
        perMonth: "/ شهر",
        currency: "ر.س",
        subscribeNow: "اشترك الآن",
        hesitatingTitle: "هل ما زلت متردداً؟",
        hesitatingSub: "احصل على استشارة مجانية مع أحد خبرائنا.",
        talkToExperts: "تحدث مع خبراءنا",
        packagesData: [
            {
                id: 'trial',
                name: 'الحصة التجريبية',
                price: '50',
                description: 'أفضل طريقة للبدء وتجربة البيئة التدريبية مع مدربينا.',
                features: ['مدة الجلسة 60 دقيقة', 'تقييم بدني أولي', 'استشارة سريعة مع مدرب']
            },
            {
                id: 'monthly',
                name: 'الباقة الشهرية',
                price: '599',
                description: 'مثالية للملتزمين الذين يسعون لنتائج حقيقية ومستدامة.',
                featured: true,
                features: ['12 جلسة تدريبية', 'خطة غذائية متكاملة', 'متابعة يومية عبر الواتساب', 'خصم 10% على المتجر']
            },
            {
                id: 'vip',
                name: 'الباقة الملكية (VIP)',
                price: '1499',
                description: 'التجربة القصوى للتدريب الشخصي مع اهتمام فائق بكل التفاصيل.',
                features: ['جلسات غير محدودة', 'مدرب خاص متفرغ', 'وجبات صحية يومية', 'فحوصات بدنية دورية', 'خصم 25% على المتجر']
            }
        ],
        storeTitle: "متجر كابتينا",
        storeSub: "تجهيزات الأبطال في مكان واحد",
        searchPlaceholder: "عن ماذا تبحث؟",
        viewAll: "عرض الكل",
        categoriesTitle: "الأصناف",
        addToCart: "إضافة للسلة",
        buyNow: "شراء",
        productsData: [
            { id: 1, name: "تيشيرت فتوة برو", category: "ملابس", price: 150, rating: 4.9, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400" },
            { id: 2, name: "حزام التدريب الجلدي", category: "أدوات", price: 299, rating: 4.8, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400" },
            { id: 3, name: "حقيبة الظهر الرياضية", category: "إكسسوارات", price: 195, rating: 5.0, image: "https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=400" },
            { id: 4, name: "شورت نانو تيك", category: "ملابس", price: 120, rating: 4.7, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400" },
            { id: 5, name: "قفازات التحدي", category: "أدوات", price: 350, rating: 4.9, image: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=400" },
            { id: 6, name: "مطارة حفظ الحرارة", category: "إكسسوارات", price: 99, rating: 4.6, image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400" }
        ],
        categoriesData: [
            { id: 'clothing', name: 'ملابس', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150' },
            { id: 'shoes', name: 'أحذية', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150' },
            { id: 'gloves', name: 'قفازات', img: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=150' },
            { id: 'belts', name: 'أحزمة', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=150' },
            { id: 'tools', name: 'أدوات', img: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=150' },
            { id: 'accessories', name: 'إكسسوارات', img: 'https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=150' },
        ],
        pageSportsData: [
            {
                id: 'boxing',
                name: 'الملاكمة',
                description: 'تعلم فنون الدفاع عن النفس وزد من سرعة رد فعلك وقوتك البدنية.',
                stats: { level: 'كافة المستويات', duration: '60 دقيقة', intensity: 'عالية' }
            },
            {
                id: 'karate',
                name: 'الكاراتيه',
                description: 'الانضباط والتركيز والقوة. انضم لدروس الكاراتيه وتدرج في الأحزمة.',
                stats: { level: 'مبتدئ - محترف', duration: '90 دقيقة', intensity: 'متوسطة' }
            },
            {
                id: 'taekwondo',
                name: 'تايكوندو',
                description: 'فن قتالي كوري يركز على الركلات العالية والسريعة والتركيز العالي.',
                stats: { level: 'أطفال - كبار', duration: '60 دقيقة', intensity: 'عالية' }
            },
            {
                id: 'kickboxing',
                name: 'كيك بوكسينغ',
                description: 'مزيج قوي بين الملاكمة والركلات لزيادة القوة والتحمل.',
                stats: { level: 'كافة المستويات', duration: '60 دقيقة', intensity: 'عالية' }
            },
            {
                id: 'fitness',
                name: 'لياقة بدنية',
                description: 'تمارين شاملة لتحسين المظهر اللائق وزيادة الطاقة اليومية.',
                stats: { level: 'مبتدئ - متقدم', duration: '45 دقيقة', intensity: 'متوسطة' }
            },
            {
                id: 'yoga',
                name: 'يوغا',
                description: 'استرخاء ومرونة وتوازن تام بين العقل والجسد.',
                stats: { level: 'كافة المستويات', duration: '60 دقيقة', intensity: 'خفيفة' }
            },
            {
                id: 'crossfit',
                name: 'كروس فت',
                description: 'تحدَّ حدودك مع تمارين القوة والتحمل عالية الكثافة.',
                stats: { level: 'متقدم', duration: '45 دقيقة', intensity: 'قصوى' }
            },
            {
                id: 'bodybuilding',
                name: 'بناء الأجسام',
                description: 'خطة تدريبية متكاملة لبناء العضلات وتحسين الضخامة العضلية.',
                stats: { level: 'كافة المستويات', duration: '75 دقيقة', intensity: 'عالية' }
            }
        ],
        boxingContent: {
            title: "الملاكمة",
            heroImg: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200",
            backText: "رجوع",
            descTitle: "نبذة عن الرياضة",
            description: "الملاكمة ليست مجرد رياضة للتنافس، بل هي فن قتالي وتدريب بدني شاق يساعد على تحسين اللياقة القلبية التنفسية، وزيادة سرعة رد الفعل، وتعزيز الثقة بالنفس. في نادينا، نوفر لك بيئة آمنة للممارسة سواء كنت مبتدئاً أو محترفاً.",
            benefitsTitle: "بماذا ستخرج؟",
            benefits: [
                'تحسين التنسيق بين العين واليد',
                'حرق دهون فعال وسريع',
                'تفريغ الطاقات السلبية والتوتر',
                'تعلم أساسيات الدفاع عن النفس'
            ],
            scheduleTitle: "الجدول الزمني",
            schedule: [
                { day: 'الأحد - الثلاثاء', time: '07:00 مساءً' },
                { day: 'الاثنين - الخميس', time: '09:00 مساءً' },
                { day: 'الجمعة', time: '05:00 مساءً' }
            ],
            bookNow: "احجز حصتك الآن",
            viewTrainers: "استعرض المدربين",
            ratingTitle: "تقييم الأعضاء",
            equipmentTitle: "المعدات المطلوبة",
            equipment: "قفازات، لفافة يد، ملابس خفيفة",
            ageTitle: "الحد الأدنى للعمر",
            age: "+12 سنة"
        },
        karateContent: {
            title: "الكاراتيه",
            heroImg: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=1200",
            backText: "رجوع",
            descTitle: "نبذة عن الرياضة",
            description: "الكاراتيه هو أكثر من مجرد قتال؛ إنه طريق لبناء الشخصية القوية والانضباط الذاتي. نركز في برنامجنا على تعلم الـ 'كاتا' والتقنيات القتالية المتدرجة من الحزام الأبيض وحتى الحزام الأسود، تحت إشراف خبراء معتمدين دولياً.",
            benefitsTitle: "أهداف التدريب",
            benefits: [
                'التوازن الجسدي والعقلي',
                'تحسين المرونة والقوة الأساسية',
                'بناء جيل منضبط ومحترم',
                'المشاركة في البطولات المحلية والدولية'
            ],
            scheduleTitle: "مواعيد التمارين",
            schedule: [
                { day: 'السبت - الاثنين', time: '04:00 مساءً' },
                { day: 'الأربعاء (متقدم)', time: '08:00 مساءً' },
                { day: 'الخميس (ناشئين)', time: '05:00 مساءً' }
            ],
            bookNow: "ابدأ رحلتك الآن",
            viewTrainers: "استعرض المدربين",
            ratingTitle: "نظام الأحزمة",
            ratingSub: "تدرج من الأبيض إلى الأسود",
            equipmentTitle: "المتطلبات",
            equipment: "بدلة رياضية (Gi)، حزام",
            ageTitle: "الفئات",
            age: "أطفال، شباب، كبار"
        },
        taekwondoContent: {
            title: "تايكوندو",
            heroImg: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=1200",
            backText: "رجوع",
            descTitle: "عن التايكوندو",
            description: "فن قتالي كوري يركز بشكل أساسي على الركلات العالية والقفز وتقنيات الركل السريع. التايكوندو يعزز مرونة الجسم، التوازن، والسرعة، بالإضافة إلى الانضباط الروحي.",
            benefitsTitle: "فوائد التمرين",
            benefits: [
                'تطوير ركلات قوية وسريعة',
                'تحسين التوازن العام',
                'تعزيز الثقة بالنفس',
                'تحسين اللياقة البدنية الشاملة'
            ],
            scheduleTitle: "المواعيد المتاحة",
            schedule: [
                { day: 'الأحد - الثلاثاء', time: '05:00 مساءً' },
                { day: 'الخميس', time: '06:00 مساءً' }
            ],
            bookNow: "سجل الآن",
            viewTrainers: "مدربينا",
            ratingTitle: "الاحترافية",
            ratingSub: "مدربون حاصلون على أحزمة دولية",
            equipmentTitle: "المعدات",
            equipment: "بدلة تايكوندو، واقيات",
            ageTitle: "العمر",
            age: "من 6 سنوات فأكثر"
        },
        kickboxingContent: {
            title: "كيك بوكسينغ",
            heroImg: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200",
            backText: "رجوع",
            descTitle: "عن الكيك بوكسينغ",
            description: "مزيج حماسي بين الملاكمة التقليدية وركلات الفنون القتالية. تعتبر من أقوى الرياضات لحرق السعرات الحرارية وتطوير قوة الجسم الكامل والتحمل القلبي.",
            benefitsTitle: "نتائج التدريب",
            benefits: [
                'حرق سعرات حرارية عالية',
                'زيادة قوة العضلات والتحمل',
                'تحسين التنسيق الحركي',
                'تخفيف الضغوط اليومية'
            ],
            scheduleTitle: "حصص التمرين",
            schedule: [
                { day: 'يومياً', time: '08:00 مساءً' },
                { day: 'الجمعة (VIP)', time: '04:00 مساءً' }
            ],
            bookNow: "انضم للتحدي",
            viewTrainers: "أبطالنا",
            ratingTitle: "الشدة",
            ratingSub: "تمرين عالي الكثافة",
            equipmentTitle: "المعدات",
            equipment: "قفازات، واقي ساق",
            ageTitle: "العمر",
            age: "+14 سنة"
        },
        fitnessContent: {
            title: "لياقة بدنية",
            heroImg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200",
            backText: "رجوع",
            descTitle: "عن اللياقة البدنية",
            description: "برامج تمارين شاملة تشمل الكارديو وتمارين المقاومة والتحمل. نهدف لمساعدتك في الوصول للوزن المثالي وتحسين نمط حياتك الصحي بشكل عام.",
            benefitsTitle: "بماذا ستتميز؟",
            benefits: [
                'جسم متناسق ورشيق',
                'زيادة مستويات الطاقة',
                'تحسين جودة النوم والتركيز',
                'تقليل مخاطر الأمراض المزمنة'
            ],
            scheduleTitle: "المواعيد",
            schedule: [
                { day: 'يومياً', time: '06:00 ص - 10:00 م' }
            ],
            bookNow: "ابدأ برنامجك",
            viewTrainers: "فريقنا",
            ratingTitle: "التنوع",
            ratingSub: "برامج مخصصة لكل هدف",
            equipmentTitle: "المتطلبات",
            equipment: "حذاء رياضي مريح، ماء",
            ageTitle: "العمر",
            age: "كافة الأعمار"
        },
        yogaContent: {
            title: "يوغا",
            heroImg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200",
            backText: "رجوع",
            descTitle: "عن اليوغا",
            description: "رحلة لاكتشاف السلام الداخلي وتطوير مرونة الجسد. تتضمن حصصنا تمارين التمدد، التنفس العميق، والتأمل للوصول لحالة من التوازن التام.",
            benefitsTitle: "ثمار اليوغا",
            benefits: [
                'مرونة فائقة للجسم',
                'سلام وهدوء نفسي',
                'تحسين وضعية الجسم والظهر',
                'تقليل مستويات التوتر'
            ],
            scheduleTitle: "جلسات الاسترخاء",
            schedule: [
                { day: 'الاثنين - الأربعاء', time: '10:00 صباحاً' },
                { day: 'السبت', time: '05:00 مساءً' }
            ],
            bookNow: "احجز جلستك",
            viewTrainers: "مدربونا",
            ratingTitle: "الروحانية",
            ratingSub: "بيئة هادئة ومحفزة",
            equipmentTitle: "المعدات",
            equipment: "سجادة يوغا (Mat)",
            ageTitle: "العمر",
            age: "كافة الأعمار"
        },
        crossfitContent: {
            title: "كروس فت",
            heroImg: "https://images.unsplash.com/photo-1534367507873-d2d7e249a3fe?q=80&w=1200",
            backText: "رجوع",
            descTitle: "عن الكروس فت",
            description: "تدريبات عالية الكثافة تجمع بين رفع الأثقال، والجمباز، والتمارين الهوائية. تم تصميمها لتكون قابلة للتعديل لتناسب كافة مستويات اللياقة البدنية.",
            benefitsTitle: "نتائج التدريب",
            benefits: [
                'قوة تحمل استثنائية',
                'تحسين تكوين الجسم',
                'زيادة في الكتلة العضلية والقوة',
                'روح المجتمع والعمل الجماعي'
            ],
            scheduleTitle: "الجلسات المتاحة",
            schedule: [
                { day: 'يومياً', time: '06:00 صباحاً' },
                { day: 'يومياً', time: '06:00 مساءً' },
                { day: 'الجمعة (WOD)', time: '10:00 صباحاً' }
            ],
            bookNow: "انضم إلينا الآن",
            viewTrainers: "مدربينا",
            ratingTitle: "مستوى الكروس فت",
            ratingSub: "برامج مخصصة للجميع",
            equipmentTitle: "التجهيزات",
            equipment: "حذاء رياضي مريح، زجاجة ماء",
            ageTitle: "الحد الأدنى",
            age: "+16 سنة"
        },
        bodybuildingContent: {
            title: "بناء الأجسام",
            heroImg: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=1200",
            backText: "رجوع",
            descTitle: "حول بناء الأجسام",
            description: "برامج متخصصة لزيادة الكتلة العضلية وتحسين التناسق العضلي باستخدام أحدث الأجهزة والأساليب العلمية في التدريب التضخيمي.",
            benefitsTitle: "النتائج المتوقعة",
            benefits: [
                'نمو عضلي متناسق',
                'تحسين القوة البدنية',
                'خطة غذائية متكاملة',
                'متابعة دورية للقياسات'
            ],
            scheduleTitle: "مواعيد الصالة",
            schedule: [
                { day: 'يومياً', time: '08:00 صباحاً - 11:00 مساءً' }
            ],
            bookNow: "سجل الآن",
            viewTrainers: "أبطالنا",
            ratingTitle: "الاحترافية",
            ratingSub: "أجهزة عالمية مطورة",
            equipmentTitle: "المطلوب",
            equipment: "ملابس رياضية، منشفة",
            ageTitle: "العمر المسموح",
            age: "+15 سنة"
        },
        profileSections: {
            myBookings: "حجوزاتي",
            myOrders: "طلباتي",
            myAchievements: "إنجازاتي",
            myAddress: "عنواني",
            items: "عنصر",
            activeMember: "عضو نشط",
            currentGoal: "الهدف الحالي",
            progressText: "تقدم ملحوظ بنسبة 15%",
            appSettings: "إعدادات التطبيق",
            logout: "تسجيل الخروج",
            sessionsCompleted: "حصة مكتملة",
            activeSports: "رياضات نشطة",
            streakDays: "أيام متتالية",
            upcomingSessions: "الحصص القادمة",
            currentPackage: "باقتي الحالية",
            startDate: "تاريخ البدء",
            endDate: "تاريخ الانتهاء",
            renewPackage: "تجديد الباقة",
            paymentHistory: "سجل المدفوعات",
            birthday: "تاريخ الميلاد",
            location: "المدينة",
            trainingPreferences: "تفضيلات التدريب",
            fitnessLevel: "مستوى اللياقة"
        },
        bookingsPage: {
            title: "حجوزاتي القادمة",
            empty: "لا يوجد لديك حجوزات حالية",
            status: "مؤكد",
            session: "جلسة"
        },
        ordersPage: {
            title: "سجل الطلبات",
            empty: "لم تقم بأي طلبات بعد",
            status: "تم التوصيل",
            orderId: "رقم الطلب"
        },
        achievementsPage: {
            title: "لوحة الإنجازات",
            empty: "ابدأ تمارينك لفتح الإنجازات",
            points: "نقطة"
        },
        addressPage: {
            title: "عنواين الشحن",
            addAddress: "إضافة عنوان جديد",
            default: "العنوان الافتراضي"
        },
        booking: {
            title: "حجز حصة",
            pageTitle: "حجز حصة تدريبية",
            selectLocation: "تحديد الموقع",
            chooseLocation: "اختر موقع التدريب",
            atHome: "في المنزل",
            atGym: "في النادي",
            selectTrainer: "اختيار المدرب",
            selectYourTrainer: "اختر مدربك المفضل",
            selectDateTime: "الموعد والوقت",
            setDateAndTime: "حدد الموعد المناسب",
            checkout: "التأكيد والدفع",
            homeBenefits: "مميزات التدريب المنزلي",
            gymBenefits: "مميزات التدريب في النادي",
            privacyText: "راحة وخصوصية أكبر",
            saveTimeText: "توفير وقت التنقل",
            flexibleSchedulingText: "مرونة في المواعيد",
            proEquipmentText: "معدات احترافية متوفرة",
            motivatingEnvText: "بيئة رياضية محفزة",
            noExtraFee: "بدون رسوم إضافية",
            groupTrainingText: "إمكانية التدريب الجماعي",
            bookingTips: "نصائح للحجز",
            tip1: "تأكد من توفر مساحة مناسبة للتدريب في المنزل",
            tip2: "يفضل اختيار مكان هادئ وبعيد عن الإزعاج",
            tip3: "يمكنك تغيير الموقع قبل بدء الحصة بـ 24 ساعة",
            cancellationPolicy: "يمكنك إلغاء أو تغيير موعد الحصة مجاناً قبل بدايتها بـ 24 ساعة على الأقل.",
            summary: "ملخص الحجز",
            reviewBooking: "مراجعة تفاصيل الحجز",
            totalLabel: "الإجمالي",
            totalPrice: "الإجمالي النهائي",
            confirmBooking: "تأكيد الحجز الآن",
            back: "رجوع",
            continue: "متابعة",
            city: "المدينة",
            district: "الحي",
            addressDetails: "تفاصيل العنوان",
            addressExample: "مثال: شارع العليا، مبني 10",
            useCurrentLocation: "استخدم موقعي الحالي",
            viewMap: "عرض على الخريطة",
            currentAddressPlaceholder: "حي العليا، شارع التحلية، الرياض",
            nearbyGyms: "الأندية القريبة منك",
            activeTrainees: "متدرب نشط",
            service: "الخدمة",
            pricePerSession: "سعر الحصة",
            homeFee: "رسوم التوصيل للمنزل",
            vat: "ضريبة القيمة المضافة (15%)",
            sessionsCount: "عدد الحصص",
            discount: "الخصم",
            costSummary: "ملخص التكلفة",
            dateLabel: "التاريخ",
            timeLabel: "الوقت",
            extraNotes: "ملاحظات إضافية للمدرب",
            trainerNotesPlaceholder: "أدخل أي تفاصيل تود إخبار المدرب بها...",
            selectSport: "اختر الرياضة",
            chooseSportType: "حدد نوع الرياضة التي تفضلها",
            waitingForConfirmation: "في انتظار تأكيد الحجز...",
            sentToAdmin: "تم إرسال طلب الحجز للإدارة، سنقوم بالتأكيد معك خلال دقائق.",
            sportsList: ["كاراتيه", "تايكوندو", "ملاكمة", "كيك بوكسينغ", "لياقة بدنية", "يوغا", "كروس فت", "بناء أجسام"]
        },
        aboutPage: {
            title: "عن كابتينا - بوابتك الرياضية",
            breadcrumbs: {
                home: "الرئيسية",
                settings: "الإعدادات",
                about: "عن التطبيق"
            },
            heroTitle: "تعرف علينا - عن كابتينا",
            heroTagline: "منصتك المتكاملة للتدريب الشخصي الاحترافي أينما كنت.",
            storyTitle: "قصتنا",
            storyContent: "ولدت كابتينا من فكرة بسيطة لكنها قوية: جعل اللياقة البدنية الاحترافية متاحة للجميع في كل مكان. نحن نؤمن بأن العوائق مثل الوقت أو المكان لا يجب أن تقف في طريق أهدافك الصحية. منصتنا تربطك بنخبة من المدربين المعتمدين، وتوفر لك حلولاً تدريبية متنوعة في المنزل أو النادي مصممة لتناسب رحلتك الخاصة.",
            stats: {
                trainees: "متدرب",
                trainers: "مدرب محترف",
                years: "سنوات نجاح"
            },
            valuesTitle: "لماذا كابتينا؟",
            values: {
                quality: {
                    title: "الجودة أولاً",
                    desc: "نختار فقط أفضل المدربين المعتمدين لضمان سلامتك ونتائجك."
                },
                innovation: {
                    title: "حلول ذكية",
                    desc: "أنظمة حجز متطورة ومتابعة شخصية دقيقة بين يديك."
                },
                commitment: {
                    title: "دعم مستمر",
                    desc: "نحن معك في كل خطوة من رحلة التغيير الخاصة بك."
                }
            }
        },
        contactPage: {
            title: "تواصل معنا - نحن هنا لمساعدتك",
            breadcrumbs: {
                home: "الرئيسية",
                contact: "تواصل معنا"
            },
            heroTitle: "نحن هنا لمساعدتك - تواصل معنا",
            heroDesc: "لديك استفسار أو ملاحظة؟ يسعدنا سماع صوتك. فريقنا مخصص لتزويدك بأفضل تجربة ممكنة.",
            infoTitle: "نحن هنا للمساعدة",
            infoDesc: "تواصل مع فريق الدعم لدينا لأي استفسارات تتعلق بخدماتنا، المدربين، أو الدعم الفني.",
            items: {
                location: "الموقع",
                locationVal: "الرياض، حي المونسية",
                phone: "رقم الهاتف",
                email: "البريد الإلكتروني",
                workingHours: "ساعات العمل",
                workingHoursVal: "يومياً: 9:00 صباحاً - 10:00 مساءً"
            },
            form: {
                title: "أرسل لنا رسالة",
                name: "الاسم بالكامل",
                phone: "رقم الهاتف",
                message: "كيف يمكننا مساعدتك؟",
                placeholder: "اكتب رسالتك هنا...",
                submit: "إرسال الرسالة",
                loading: "جاري الإرسال...",
                success: "تم إرسال رسالتك بنجاح!"
            }
        },
        helpPage: {
            title: "مركز المساعدة - دعم فني متكامل",
            breadcrumbs: {
                home: "الرئيسية",
                settings: "الإعدادات",
                help: "مركز المساعدة"
            },
            heroTitle: "دعم فني متكامل - مركز المساعدة",
            heroHeader: "كيف يمكننا مساعدتك اليوم؟",
            heroSub: "ابحث عن إجابات سريعة أو تواصل مع فريق الدعم المتخصص لدينا.",
            searchPlaceholder: "ابحث عن مواضيع المساعدة...",
            tabs: {
                faqs: "الأسئلة الشائعة",
                contact: "تواصل معنا"
            },
            contactItems: {
                premium: "الدعم الذهبي",
                premiumDesc: "مدير حساب مخصص للمشتركين المتميزين",
                hotline: "الخط الساخن 24/7",
                hotlineDesc: "استجابة فورية للاستفسارات العاجلة"
            },
            form: {
                title: "أرسل لنا رسالة مباشرة",
                subject: "الموضوع",
                subjectPlaceholder: "عن ماذا يدور استفسارك؟",
                message: "تفاصيل الرسالة",
                messagePlaceholder: "اشرح المشكلة بالتفصيل...",
                submit: "إرسال الطلب",
                loading: "جاري الإرسال...",
                success: "تم إرسال طلبك! سنقوم بالرد عليك في أقرب وقت.",
                submitError: "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى",
                noResults: "لا توجد نتائج مطابقة لما تبحث عنه",
                faqs: {
                    booking: {
                        q: "كيف يمكنني حجز حصة تدريبية؟",
                        a: "يمكنك حجز حصة من خلال الذهاب لصفحة المدربين، اختيار المدرب المفضل، ثم الضغط على زر 'احجز الآن' واختيار اليوم والوقت المناسب."
                    },
                    cancel: {
                        q: "هل يمكنني إلغاء الحجز؟",
                        a: "نعم، يمكنك إلغاء الحجز قبل بدء الحصة بـ 24 ساعة على الأقل من خلال صفحة 'حجوزاتي' في ملفك الشخصي."
                    },
                    renew: {
                        q: "كيف أقوم بتجديد الباقة؟",
                        a: "عند اقتراب انتهاء باقتك، سيظهر لك تنبيه في صفحة الملف الشخصي. يمكنك الضغط على 'تجديد الباقة' وإتمام عملية الدفع."
                    },
                    lang: {
                        q: "هل التطبيق يدعم لغات أخرى؟",
                        a: "نعم، التطبيق يدعم اللغتين العربية والإنجليزية. يمكنك تغيير اللغة من صفحة الإعدادات."
                    }
                }
            }
        },
        registerPage: {
            heroTitle: "ابدأ رحلتك الرياضية",
            heroTagline: "كابتينا غيرت حياتي تماماً!",
            formTitle: "إنشاء حساب جديد",
            formSub: "سجل بياناتك للانضمام إلى نخبة الرياضيين",
            fullNameLabel: "الاسم كاملاً",
            acceptTerms: "أوافق على الشروط والأحكام",
            alreadyHaveAccount: "لديك حساب بالفعل؟",
            login: "تسجيل الدخول",
            loading: "جاري إنشاء الحساب...",
            agreeToTermsAlert: "يرجى الموافقة على الشروط"
        },
        termsPage: {
            title: "الشروط والأحكام - حقوقك والتزاماتك",
            breadcrumbs: {
                home: "الرئيسية",
                settings: "الإعدادات",
                terms: "الشروط والأحكام"
            },
            heroTitle: "( حقوقك والتزاماتك - الشروط والأحكام )",
            headerTitle: "اتفاقية الاستخدام",
            lastUpdated: "آخر تحديث: 1 مارس 2026",
            sections: {
                acceptance: {
                    title: "قبول الشروط",
                    content: "باستخدامك لتطبيق كابتينا، فإنك توافق على الالتزام بشروط الاستخدام الموضحة هنا. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام التطبيق."
                },
                responsibility: {
                    title: "مسؤولية المستخدم",
                    content: "المستخدم مسؤول عن دقة البيانات المقدمة وصحة حالته الصحية لممارسة الرياضة. كابتينا ليست مسؤولة عن أي إصابات ناتجة عن التدريب."
                },
                cancellation: {
                    title: "سياسة الإلغاء والاسترجاع",
                    content: "يمكن إلغاء الحجز قبل 24 ساعة من الموعد. الاسترجاع المالي يخضع لسياسات الباقات المشترك بها والموضحة وقت الشراء."
                },
                property: {
                    title: "حقوق الملكية الفكرية",
                    content: "جميع المحتويات المتوفرة في التطبيق هي ملك لمنصة كابتينا. لا يجوز نسخ أو توزيع أي جزء من المحتوى بدون إذن مسبق."
                },
                privacy: {
                    title: "الخصوصية",
                    content: "نحن نلتزم بحماية خصوصية بياناتك. يمكنك مراجعة سياسة الخصوصية الكاملة لمعرفة كيفية التعامل مع بياناتك الشخصية."
                }
            },
            footerTitle: "هل لديك أسئلة؟",
            footerDesc: "إذا كان لديك أي استفسار حول هذه الشروط، لا تتردد في التواصل معنا.",
            contactUs: "اتصل بنا"
        },
        gymsPage: {
            subTitle: "تغطية واسعة في كافة أنحاء الرياض",
            breadcrumbs: {
                home: "الرئيسية",
                gyms: "صالاتنا"
            },
            trainers: "المدربين",
            pros: "أبطال",
            explore: "استكشاف الموقع",
            features: {
                gear: "أحدث الأجهزة",
                areas: "مساحات واسعة",
                team: "أبطال معتمدون",
                deals: "عروض حصرية"
            }
        },
        notificationsPage: {
            title: "إشعارات كابتينا - تفاعل لحظي",
            heroTitle: "( تفاعل لحظي - إشعارات كابتينا )",
            breadcrumbs: {
                home: "الرئيسية",
                notifications: "الإشعارات"
            },
            markAllReadLabel: "تحديد الكل كمقروء",
            filters: {
                all: "عرض الكل",
                unread: "غير مقروء"
            },
            syncing: "جاري التحميل...",
            emptyTitle: "لا يوجد تنبيهات حالياً",
            emptyDesc: "سوف تظهر التنبيهات الخاصة بك هنا فور صدورها."
        }
    },
    en: {
        welcome: "Welcome",
        goodDay: "Good Day",
        profile: "Profile",
        settings: "Settings",
        gymsPageTitle: "Captina Certified Gyms",
        home: "Home",
        all: "All",
        sports: "Sports",
        trainers: "Trainers",
        store: "Store",
        offers: "Offers",
        membership_plans: "Membership Plans",
        main: "Home",
        viewAll: "View All",
        bookNow: "Book Now",
        activeMember: "Active Member",
        logout: "Logout",
        darkMode: "Dark Mode",
        language: "Language",
        arabic: "Arabic",
        english: "English",
        topTrainers: "Top Trainers",
        featuredServices: "Exceptional Services",
        startJourney: "Start Journey Now",
        trialSession: "Trial Session",
        fitBody: "Your Personal Coach in Your Own World",
        futureStartsHere: "Your Future Starts Here",
        powerfulOffers: "Top Offers",
        useOffer: "Redeem Offer",
        notifications: "Notifications",
        accountSecurity: "Account & Security",
        appearance: "Appearance & Notifications",
        support: "Support & Help",
        personalInfo: "Personal Information",
        changePassword: "Change Password",
        pushNotifications: "App Notifications",
        aboutApp: "About Captina",
        contactSupport: "Contact Support",
        login: "Login",
        registerTitle: "New Membership",
        email: "Email Address",
        password: "Password",
        fullName: "Full Name",
        phone: "Mobile Number",
        forgotPassword: "Forgot Password?",
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        joinUsNow: "Join Us Now",
        orVia: "Or Via",
        acceptTerms: "I agree to all terms and conditions",
        createNewAccount: "Create New Account",
        loginToAccount: "Login to Account",
        loginWithPhone: "Login with Phone",
        loginWithGoogle: "Login with Google",
        loginWithBiometrics: "FaceID / Fingerprint",
        phonePlaceholder: "5xxxxxxxx",
        verificationCode: "Verification Code",
        sendCode: "Send Code",
        verifyCode: "Verify Code",
        biometricLogin: "Biometrics",
        invalidCode: "Invalid verification code",
        loginSuccess: "Signed in successfully",
        biometricSuccess: "Biometrics activated successfully",
        discoverWorld: "Discover Your New Training World",
        discoverDesc: "Your gateway to access the world's best trainers and personalized training programs.",
        joinElite: "Join Elite Athletes",
        joinEliteDesc: "Your first step towards a perfect body and healthy life starts with creating your account today.",
        heroTitle: "Your Personal Trainer In Your Own World",
        heroDesc: "Don't wait for opportunity, create it. With Captina, we provide you with success tools and the world's best trainers to achieve your fitness goals in minimum time.",
        members: "Members",
        trainersStat: "Trainers",
        muscleGrowth: "Muscle Growth",
        bestRating: "Best Rating 2026",
        strongestOffers: "Strongest Offers",
        claimOffer: "Claim Offer",
        exceptionalServices: "Exceptional Services",
        exceptionalServicesDesc: "We provide you with everything you need to reach the top",
        eliteTrainers: "Elite Trainers",
        precisePlans: "Precise Plans",
        genuineEquipment: "Genuine Equipment",
        quickResults: "Quick Results",
        serviceDesc: "A brief description of our carefully selected service.",
        readMore: "Read More",
        offersData: [
            { title: "50% Discount for Annual Subscription", subtitle: "For a very limited time", badge: "Special Offer" },
            { title: "Free Trial Session", subtitle: "With our elite trainers", badge: "Free" },
            { title: "Integrated Nutrition Package", subtitle: "Discount up to 30%", badge: "Most Requested" },
            { title: "Free Shipping for Store", subtitle: "On all orders above 200 SAR", badge: "Exclusive" }
        ],
        trainersData: [
            { name: "Ahmed", role: "Fitness" },
            { name: "Sara", role: "Yoga" },
            { name: "Mohamed", role: "Body Building" },
            { name: "Layla", role: "Weight Loss" }
        ],
        offersPageTitle: "Captina Offers",
        activateOffer: "Activate Offer Now",
        allOffersData: [
            {
                title: "50% Discount for Annual Subscription",
                subtitle: "For a very limited time",
                badge: "Special Offer",
                expiry: "Ends on March 30",
                description: "Get a full annual subscription for half price. Includes all gyms, trainers, and nutritional support."
            },
            {
                title: "Free Trial Session",
                subtitle: "With our elite trainers",
                badge: "Free",
                expiry: "Always available for new members",
                description: "Try our services before subscribing. Get a full physical assessment and a 60-minute training session for free."
            },
            {
                title: "Integrated Nutrition Package",
                subtitle: "Discount up to 30%",
                badge: "Most Requested",
                expiry: "For a limited time",
                description: "Design your nutritional plan with our nutrition experts at an exclusive discount. Meals, supplements, and tips all in one place."
            },
            {
                title: "Free Shipping for Store",
                subtitle: "On all orders above 200 SAR",
                badge: "Exclusive",
                expiry: "Ends soon",
                description: "Don't worry about delivery costs. Shop for the best equipment, supplements, and sports apparel and get free home delivery."
            }
        ],
        trainerPageTitle: "Elite Trainers",
        trainerPageSub: "Experts in changing your sports career path",
        searchTrainersPlaceholder: "Search for your favorite trainer...",
        expYears: "Experience over",
        profileText: "Profile",
        pageTrainersData: [
            {
                name: "Captain Ahmed",
                specialty: "Weight loss and muscle definition",
                exp: "12 years",
                rating: 4.9
            },
            {
                name: "Captain Sara",
                specialty: "Fitness flexibility (Yoga)",
                exp: "8 years",
                rating: 4.8
            },
            {
                name: "Captain Mohamed",
                specialty: "Body building and bulking",
                exp: "15 years",
                rating: 5.0
            },
            {
                name: "Captain Khaled",
                specialty: "Weightlifting and physical strength",
                exp: "10 years",
                rating: 4.7
            }
        ],
        sportsPageTitle: "Our Diverse Sports",
        sportsPageSub: "Choose your favorite sport and start your challenge journey with a selection of professional trainers.",
        exploreText: "Explore",
        intensityText: "Intensity",
        durationText: "Duration",
        readyToJoinTitle: "Ready to change your look?",
        readyToJoinSub: "Join us today and get a free physical assessment to determine the most suitable sport and program for your goals.",
        packages: "Packages",
        booking: "Book",
        quickLinks: "Quick Links",
        needHelp: "Need Help?",
        faqText: "FAQ",
        contactUs: "Contact Us",
        helpSectionTitle: "Connect With Us",
        userName: "Fahd Al-Otaibi",
        privacy: "Privacy",
        accountVerification: "Account Verification",
        important: "Important",
        helpCenter: "Help Center",
        termsAndConditions: "Terms & Conditions",
        packagesPageTitle: "Invest in Yourself",
        packagesPageSub: "Our packages are carefully designed to suit different levels and goals.",
        mostPopular: "Most Popular",
        perMonth: "/ month",
        currency: "SAR",
        subscribeNow: "Subscribe Now",
        hesitatingTitle: "Still Hesitating?",
        hesitatingSub: "Get a free consultation with one of our experts.",
        talkToExperts: "Talk to our experts",
        packagesData: [
            {
                id: 'trial',
                name: 'Trial Session',
                price: '50',
                description: 'The best way to start and experience the training environment with our trainers.',
                features: ['60-minute session', 'Initial physical assessment', 'Quick consultation with a trainer']
            },
            {
                id: 'monthly',
                name: 'Monthly Package',
                price: '599',
                description: 'Ideal for those committed to seeking real and sustainable results.',
                featured: true,
                features: ['12 training sessions', 'Integrated nutritional plan', 'Daily follow-up via WhatsApp', '10% store discount']
            },
            {
                id: 'vip',
                name: 'Royal Package (VIP)',
                price: '1499',
                description: 'The ultimate personal training experience with superior attention to every detail.',
                features: ['Unlimited sessions', 'Full-time personal trainer', 'Daily healthy meals', 'Periodic physical checkups', '25% store discount']
            }
        ],
        storeTitle: "Captina Store",
        storeSub: "Champion gear in one place",
        searchPlaceholder: "What are you looking for?",
        viewAll: "View All",
        categoriesTitle: "Categories",
        addToCart: "Add to Cart",
        buyNow: "Buy Now",
        productsData: [
            { id: 1, name: "Futwa Pro T-Shirt", category: "Clothing", price: 150, rating: 4.9, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400" },
            { id: 2, name: "Leather Training Belt", category: "Tools", price: 299, rating: 4.8, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400" },
            { id: 3, name: "Sports Backpack", category: "Accessories", price: 195, rating: 5.0, image: "https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=400" },
            { id: 4, name: "Nano Tech Shorts", category: "Clothing", price: 120, rating: 4.7, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400" },
            { id: 5, name: "Challenge Gloves", category: "Tools", price: 350, rating: 4.9, image: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=400" },
            { id: 6, name: "Thermal Water Bottle", category: "Accessories", price: 99, rating: 4.6, image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400" }
        ],
        categoriesData: [
            { id: 'clothing', name: 'Clothing', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150' },
            { id: 'shoes', name: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150' },
            { id: 'gloves', name: 'Gloves', img: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=150' },
            { id: 'belts', name: 'Belts', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=150' },
            { id: 'tools', name: 'Tools', img: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=150' },
            { id: 'accessories', name: 'Accessories', img: 'https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=150' },
        ],
        pageSportsData: [
            {
                id: 'boxing',
                name: 'Boxing',
                description: 'Learn martial arts and increase your reaction speed and physical strength.',
                stats: { level: 'All Levels', duration: '60 min', intensity: 'High' }
            },
            {
                id: 'karate',
                name: 'Karate',
                description: 'Discipline, focus, and strength. Join karate classes and progress through the belts.',
                stats: { level: 'Beginner - Pro', duration: '90 min', intensity: 'Medium' }
            },
            {
                id: 'crossfit',
                name: 'CrossFit',
                description: 'Challenge your limits with high-intensity strength and endurance exercises.',
                stats: { level: 'Advanced', duration: '45 min', intensity: 'Extreme' }
            },
            {
                id: 'bodybuilding',
                name: 'Bodybuilding',
                description: 'An integrated training plan to build muscles and improve muscle bulk.',
                stats: { level: 'All Levels', duration: '75 min', intensity: 'High' }
            }
        ],
        boxingContent: {
            title: "Boxing",
            heroImg: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200",
            backText: "Back",
            descTitle: "About the Sport",
            description: "Boxing is not just a competitive sport, it's a martial art and rigorous physical training that helps improve cardiorespiratory fitness, increase reaction speed, and boost self-confidence. In our club, we provide a safe environment for practice whether you are a beginner or a professional.",
            benefitsTitle: "What will you get out of it?",
            benefits: [
                'Improved hand-eye coordination',
                'Fast and effective fat burning',
                'Release of negative energy and stress',
                'Learn basics of self-defense'
            ],
            scheduleTitle: "Schedule",
            schedule: [
                { day: 'Sun - Tue', time: '07:00 PM' },
                { day: 'Mon - Thu', time: '09:00 PM' },
                { day: 'Fri', time: '05:00 PM' }
            ],
            bookNow: "Book Your Session Now",
            viewTrainers: "View Trainers",
            ratingTitle: "Member Rating",
            equipmentTitle: "Required Equipment",
            equipment: "Gloves, Hand wraps, Light clothing",
            ageTitle: "Minimum Age",
            age: "+12 Years"
        },
        karateContent: {
            title: "Karate",
            heroImg: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=1200",
            backText: "Back",
            descTitle: "About the Sport",
            description: "Karate is more than just fighting; it's a path to building strong character and self-discipline. Our program focuses on learning 'Kata' and progressive fighting techniques from white belt to black belt, under the supervision of internationally certified experts.",
            benefitsTitle: "Training Goals",
            benefits: [
                'Physical and mental balance',
                'Improved flexibility and core strength',
                'Building a disciplined and respectful generation',
                'Participation in local and international tournaments'
            ],
            scheduleTitle: "Training Times",
            schedule: [
                { day: 'Sat - Mon', time: '04:00 PM' },
                { day: 'Wed (Advanced)', time: '08:00 PM' },
                { day: 'Thu (Juniors)', time: '05:00 PM' }
            ],
            bookNow: "Start Your Journey Now",
            viewTrainers: "View Trainers",
            ratingTitle: "Belt System",
            ratingSub: "Progression from White to Black",
            equipmentTitle: "Requirements",
            equipment: "Sports Suit (Gi), Belt",
            ageTitle: "Categories",
            age: "Kids, Youth, Adults"
        },
        taekwondoContent: {
            title: "Taekwondo",
            heroImg: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=1200",
            backText: "Back",
            descTitle: "About Taekwondo",
            description: "A Korean martial art that focuses primarily on high kicks, jumping, and fast-kicking techniques. Taekwondo enhances body flexibility, balance, and speed, in addition to spiritual discipline.",
            benefitsTitle: "Training Benefits",
            benefits: [
                'Develop powerful and fast kicks',
                'Improve overall balance',
                'Boost self-confidence',
                'Improve overall physical fitness'
            ],
            scheduleTitle: "Available Times",
            schedule: [
                { day: 'Sun - Tue', time: '05:00 PM' },
                { day: 'Thu', time: '06:00 PM' }
            ],
            bookNow: "Register Now",
            viewTrainers: "Our Trainers",
            ratingTitle: "Professionalism",
            ratingSub: "Internationally certified belt trainers",
            equipmentTitle: "Equipment",
            equipment: "Taekwondo uniform, Protectors",
            ageTitle: "Age",
            age: "6 years and older"
        },
        kickboxingContent: {
            title: "Kickboxing",
            heroImg: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200",
            backText: "Back",
            descTitle: "About Kickboxing",
            description: "An exciting mix of traditional boxing and martial arts kicks. It is considered one of the strongest sports for burning calories and developing full body strength and cardiovascular endurance.",
            benefitsTitle: "Training Results",
            benefits: [
                'High calorie burning',
                'Increase muscle strength and endurance',
                'Improve motor coordination',
                'Relieve daily stress'
            ],
            scheduleTitle: "Training Sessions",
            schedule: [
                { day: 'Daily', time: '08:00 PM' },
                { day: 'Fri (VIP)', time: '04:00 PM' }
            ],
            bookNow: "Join the Challenge",
            viewTrainers: "Our Heroes",
            ratingTitle: "Intensity",
            ratingSub: "High-intensity training",
            equipmentTitle: "Equipment",
            equipment: "Gloves, Shin guards",
            ageTitle: "Age",
            age: "+14 years"
        },
        fitnessContent: {
            title: "Fitness",
            heroImg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200",
            backText: "Back",
            descTitle: "About Fitness",
            description: "Comprehensive exercise programs including cardio, resistance training, and endurance. We aim to help you reach your ideal weight and improve your overall healthy lifestyle.",
            benefitsTitle: "How will you excel?",
            benefits: [
                'Fit and agile body',
                'Increase energy levels',
                'Improve sleep quality and focus',
                'Reduce risk of chronic diseases'
            ],
            scheduleTitle: "Schedule",
            schedule: [
                { day: 'Daily', time: '06:00 AM - 10:00 PM' }
            ],
            bookNow: "Start Your Program",
            viewTrainers: "Our Team",
            ratingTitle: "Diversity",
            ratingSub: "Customized programs for every goal",
            equipmentTitle: "Requirements",
            equipment: "Comfortable sports shoes, Water",
            ageTitle: "Age",
            age: "All ages"
        },
        yogaContent: {
            title: "Yoga",
            heroImg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200",
            backText: "Back",
            descTitle: "About Yoga",
            description: "A journey to discover inner peace and develop body flexibility. Our classes include stretching, deep breathing, and meditation to reach a state of complete balance.",
            benefitsTitle: "Yoga Fruits",
            benefits: [
                'Super body flexibility',
                'Peace and psychological calm',
                'Improve body posture and back',
                'Reduce stress levels'
            ],
            scheduleTitle: "Relaxation Sessions",
            schedule: [
                { day: 'Mon - Wed', time: '10:00 AM' },
                { day: 'Sat', time: '05:00 PM' }
            ],
            bookNow: "Book Your Session",
            viewTrainers: "Our Coaches",
            ratingTitle: "Spirituality",
            ratingSub: "Quiet and motivating environment",
            equipmentTitle: "Equipment",
            equipment: "Yoga Mat",
            ageTitle: "Age",
            age: "All ages"
        },
        crossfitContent: {
            title: "CrossFit",
            heroImg: "https://images.unsplash.com/photo-1534367507873-d2d7e249a3fe?q=80&w=1200",
            backText: "Back",
            descTitle: "About CrossFit",
            description: "High-intensity training that combines weightlifting, gymnastics, and aerobic exercises. Designed to be scalable for all fitness levels.",
            benefitsTitle: "Training Results",
            benefits: [
                'Exceptional endurance',
                'Improved body composition',
                'Increase in muscle mass and strength',
                'Community spirit and teamwork'
            ],
            scheduleTitle: "Available Sessions",
            schedule: [
                { day: 'Daily', time: '06:00 AM' },
                { day: 'Daily', time: '06:00 PM' },
                { day: 'Friday (WOD)', time: '10:00 AM' }
            ],
            bookNow: "Join Us Now",
            viewTrainers: "Our Trainers",
            ratingTitle: "CrossFit Level",
            ratingSub: "Personalized programs for everyone",
            equipmentTitle: "Preparation",
            equipment: "Comfortable sports shoes, Water bottle",
            ageTitle: "Minimum Age",
            age: "+16 Years"
        },
        bodybuildingContent: {
            title: "Bodybuilding",
            heroImg: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=1200",
            backText: "Back",
            descTitle: "About Bodybuilding",
            description: "Specialized programs to increase muscle mass and improve muscle symmetry using the latest equipment and scientific methods in hypertrophy training.",
            benefitsTitle: "Expected Results",
            benefits: [
                'Symmetric muscle growth',
                'Improved physical strength',
                'Integrated nutrition plan',
                'Regular follow-up of measurements'
            ],
            scheduleTitle: "Gym Hours",
            schedule: [
                { day: 'Daily', time: '08:00 AM - 11:00 PM' }
            ],
            bookNow: "Register Now",
            viewTrainers: "Our Champions",
            ratingTitle: "Professionalism",
            ratingSub: "World-class advanced equipment",
            equipmentTitle: "Requirements",
            equipment: "Sportswear, Towel",
            ageTitle: "Allowed Age",
            age: "+15 Years"
        },
        profileSections: {
            myBookings: "My Bookings",
            myOrders: "My Orders",
            myAchievements: "My Achievements",
            myAddress: "My Address",
            items: "Items",
            activeMember: "Active Member",
            currentGoal: "Current Goal",
            progressText: "Significant progress (15%)",
            appSettings: "App Settings",
            logout: "Logout",
            sessionsCompleted: "Sessions Completed",
            activeSports: "Active Sports",
            streakDays: "Streak Days",
            upcomingSessions: "Upcoming Sessions",
            currentPackage: "Current Package",
            startDate: "Start Date",
            endDate: "End Date",
            renewPackage: "Renew Package",
            paymentHistory: "Payment History",
            birthday: "Birthday",
            location: "Location",
            trainingPreferences: "Training Preferences",
            fitnessLevel: "Fitness Level"
        },
        bookingsPage: {
            title: "My Upcoming Bookings",
            empty: "You have no upcoming bookings",
            status: "Confirmed",
            session: "Session"
        },
        ordersPage: {
            title: "Order History",
            empty: "You haven't made any orders yet",
            status: "Delivered",
            orderId: "Order ID"
        },
        achievementsPage: {
            title: "Achievements Board",
            empty: "Start training to unlock achievements",
            points: "Points"
        },
        addressPage: {
            title: "Shipping Addresses",
            addAddress: "Add New Address",
            default: "Default Address"
        },
        booking: {
            title: "Book Session",
            pageTitle: "Book Training Session",
            selectLocation: "Select Location",
            chooseLocation: "Choose Training Location",
            atHome: "At Home",
            atGym: "At Gym",
            selectTrainer: "Select Trainer",
            selectYourTrainer: "Select Your Trainer",
            selectDateTime: "Date & Time",
            setDateAndTime: "Set Date & Time",
            checkout: "Confirm & Pay",
            homeBenefits: "Home Training Benefits",
            gymBenefits: "Gym Training Benefits",
            privacyText: "More comfort and privacy",
            saveTimeText: "Save commute time",
            flexibleSchedulingText: "Flexible scheduling",
            proEquipmentText: "Professional equipment available",
            motivatingEnvText: "Motivating sports environment",
            noExtraFee: "No extra fee",
            groupTrainingText: "Group training option",
            bookingTips: "Booking Tips",
            tip1: "Ensure suitable space for home training",
            tip2: "Prefer a quiet place away from noise",
            tip3: "You can change location 24h before",
            cancellationPolicy: "You can cancel or reschedule for free up to 24 hours before the session start.",
            summary: "Booking Summary",
            reviewBooking: "Review Booking Details",
            totalLabel: "Total",
            totalPrice: "Grand Total",
            confirmBooking: "Confirm Booking Now",
            back: "Back",
            continue: "Continue",
            city: "City",
            district: "District",
            addressDetails: "Address Details",
            addressExample: "Ex: Olaya St, Bldg 10",
            useCurrentLocation: "Use Current Location",
            viewMap: "View on Map",
            currentAddressPlaceholder: "Olaya Dist, Tahlia St, Riyadh",
            nearbyGyms: "Nearby Gyms",
            activeTrainees: "Active Trainees",
            service: "Service",
            pricePerSession: "Session Price",
            homeFee: "Home Delivery Fee",
            vat: "VAT (15%)",
            sessionsCount: "Sessions Count",
            discount: "Discount",
            costSummary: "Cost Summary",
            dateLabel: "Date",
            timeLabel: "Time",
            extraNotes: "Extra Notes for Trainer",
            trainerNotesPlaceholder: "Enter any details you want to tell the trainer...",
            selectSport: "Select Sport",
            chooseSportType: "Select your preferred sport type",
            waitingForConfirmation: "Waiting for confirmation...",
            sentToAdmin: "Booking request sent to admin, we will confirm with you within minutes.",
            sportsList: ["Karate", "Taekwondo", "Boxing", "Kickboxing", "Fitness", "Yoga", "Crossfit", "Bodybuilding"]
        },
        aboutPage: {
            title: "Get to Know Us - About Captina",
            breadcrumbs: {
                home: "Home",
                settings: "Settings",
                about: "About App"
            },
            heroTitle: "Get to Know Us - About Captina",
            heroTagline: "Your integrated platform for professional personal training wherever you are.",
            storyTitle: "Our Story",
            storyContent: "Captina was born from a simple yet powerful idea: making professional fitness accessible to everyone, anywhere. We believe that constraints like time or location shouldn't hinder your health goals. Our platform connects you with elite certified coaches, providing both home-based and gym-based training solutions tailored to your unique journey.",
            stats: {
                trainees: "Trainees",
                trainers: "Trainers",
                years: "Years Success"
            },
            valuesTitle: "Why Captina?",
            values: {
                quality: {
                    title: "Quality First",
                    desc: "We select only the best certified trainers to ensure your safety and results."
                },
                innovation: {
                    title: "Smart Solutions",
                    desc: "Advanced booking systems and personalized tracking at your fingertips."
                },
                commitment: {
                    title: "Endless Support",
                    desc: "We are with you at every step of your transformation journey."
                }
            }
        },
        contactPage: {
            title: "We Are Here to Help - Contact Us",
            breadcrumbs: {
                home: "Home",
                contact: "Contact Us"
            },
            heroTitle: "We Are Here to Help - Contact Us",
            heroDesc: "Have a question or feedback? We'd love to hear from you. Our team is dedicated to providing you with the best experience possible.",
            infoTitle: "We're Here to Help",
            infoDesc: "Contact our support team for any inquiries regarding our services, trainers, or technical support.",
            items: {
                location: "Location",
                locationVal: "Riyadh, Al-Monsiya Dist",
                phone: "Phone",
                email: "Email",
                workingHours: "Working Hours",
                workingHoursVal: "Daily: 9:00 AM - 10:00 PM"
            },
            form: {
                title: "Send us a message",
                name: "Full Name",
                phone: "Phone Number",
                message: "How can we help you?",
                placeholder: "Enter your message here...",
                submit: "Send Message",
                loading: "Sending...",
                success: "Message sent successfully!"
            }
        },
        helpPage: {
            title: "Integrated Support - Help Center",
            breadcrumbs: {
                home: "Home",
                settings: "Settings",
                help: "Help Center"
            },
            heroTitle: "Integrated Support - Help Center",
            heroHeader: "How can we help you today?",
            heroSub: "Search for rapid answers or contact our specialized support team.",
            searchPlaceholder: "Search for topics...",
            tabs: {
                faqs: "FAQs",
                contact: "Contact Us"
            },
            contactItems: {
                premium: "Premium Support",
                premiumDesc: "Dedicated account manager for elite subscribers",
                hotline: "Hotline 24/7",
                hotlineDesc: "Instant response for urgent inquiries"
            },
            form: {
                title: "Send us a direct message",
                subject: "Subject",
                subjectPlaceholder: "What is your inquiry about?",
                message: "Message Details",
                messagePlaceholder: "Describe your issue in detail...",
                submit: "Submit Request",
                loading: "Sending...",
                success: "Your request has been sent! We will get back to you soon.",
                submitError: "An error occurred while sending, please try again",
                noResults: "No results match your search",
                faqs: {
                    booking: {
                        q: "How can I book a training session?",
                        a: "You can book a session by going to the Trainers page, selecting your preferred trainer, then clicking the 'Book Now' button and choosing a suitable day and time."
                    },
                    cancel: {
                        q: "Can I cancel my booking?",
                        a: "Yes, you can cancel your booking at least 24 hours before the session starts through the 'My Bookings' page in your profile."
                    },
                    renew: {
                        q: "How do I renew my package?",
                        a: "When your package is near expiration, a notification will appear on your Profile page. You can click 'Renew Package' and complete the payment process."
                    },
                    lang: {
                        q: "Does the app support other languages?",
                        a: "Yes, the app supports both Arabic and English. You can change the language from the Settings page."
                    }
                }
            }
        },
        registerPage: {
            heroTitle: "Start Your Fitness Journey",
            heroTagline: "Captina changed my life!",
            formTitle: "Create New Account",
            formSub: "Register to join elite athletes",
            fullNameLabel: "Full Name",
            acceptTerms: "I agree to the terms and conditions",
            alreadyHaveAccount: "Already have an account?",
            login: "Login",
            loading: "Creating account...",
            agreeToTermsAlert: "Please accept terms"
        },
        termsPage: {
            title: "Terms & Conditions",
            breadcrumbs: {
                home: "Home",
                settings: "Settings",
                terms: "Terms & Conditions"
            },
            heroTitle: "( Your Rights and Obligations - Terms & Conditions )",
            headerTitle: "User Agreement",
            lastUpdated: "Last Updated: March 1, 2026",
            sections: {
                acceptance: {
                    title: "Acceptance of Terms",
                    content: "By using the Captina application, you agree to comply with the terms of use outlined here. If you do not agree to these terms, please do not use the application."
                },
                responsibility: {
                    title: "User Responsibility",
                    content: "The user is responsible for the accuracy of the data provided and the correctness of their health status for exercising. Captina is not responsible for any injuries resulting from training."
                },
                cancellation: {
                    title: "Cancellation & Refund Policy",
                    content: "Bookings can be cancelled 24 hours before the appointment. Refunds are subject to the policies of the subscribed packages shared at the time of purchase."
                },
                property: {
                    title: "Intellectual Property Rights",
                    content: "All contents available in the application are the property of Captina platform. No part of the content may be copied or distributed without prior permission."
                },
                privacy: {
                    title: "Privacy",
                    content: "We are committed to protecting the privacy of your data. You can review the full privacy policy to know how your personal data is handled."
                }
            },
            footerTitle: "Have questions?",
            footerDesc: "If you have any questions about these terms, feel free to contact us.",
            contactUs: "Contact Us"
        },
        gymsPageTitle: "Captina Certified Gyms",
        gymsPage: {
            gymsData: [
            { id: 1, name: "Al-Monsiya Branch", type: 'Internal', rating: '4.9', image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" },
            { id: 2, name: "Al-Yasmin Branch", type: 'Internal', rating: '4.8', image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800" },
            { id: 3, name: "Gold's Gym", type: 'Partner', rating: '4.9', image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" },
            { id: 4, name: "Fitness First", type: 'Partner', rating: '4.8', image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800" },
            { id: 5, name: "Titan Academy", type: 'Partner', rating: '4.9', image: "https://images.unsplash.com/photo-1574673139641-87b1d3d609a7?q=80&w=800" },
            { id: 6, name: "The Cage", type: 'Partner', rating: '4.7', image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800" }
        ],
            subTitle: "Wide coverage across Riyadh",
            breadcrumbs: {
                home: "Home",
                gyms: "Our Gyms"
            },
            trainers: "Trainers",
            pros: "Pros",
            explore: "Explore Location",
            features: {
                gear: "Elite Gear",
                areas: "Wide Areas",
                team: "Certified Team",
                deals: "Exclusive Deals"
            }
        },
        notificationsPage: {
            title: "Captina Notifications",
            heroTitle: "( Real-time Updates - Captina Notifications )",
            breadcrumbs: {
                home: "Home",
                notifications: "Notifications"
            },
            markAllReadLabel: "Mark All as Read",
            filters: {
                all: "All",
                unread: "Unread"
            },
            syncing: "Syncing...",
            emptyTitle: "Zero Transmission.",
            emptyDesc: "Safe and quiet. Elite briefings will emerge here when necessary."
        }
    }
};

export function AppProvider({ children }) {
    const [language, setLanguage] = useState('ar');
    const [darkMode, setDarkMode] = useState(false);
    const [alert, setAlert] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [packages, setPackages] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [sports, setSports] = useState([]);
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState({ percentage: 0, text_ar: '', text_en: '', sub_ar: '', sub_en: '' });
    
    const [user, loadingAuth] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('lang');
            const savedTheme = localStorage.getItem('theme');
            if (savedLang) setLanguage(savedLang);
            if (savedTheme) setDarkMode(savedTheme === 'true');
        }
    }, []);

    useEffect(() => {
        if (!user) {
            setUserData(null);
            // Load local favorites for guests
            if (typeof window !== 'undefined') {
                const savedFavorites = localStorage.getItem('captina_favorites');
                if (savedFavorites) {
                    try {
                        setFavorites(JSON.parse(savedFavorites));
                    } catch (e) {
                        console.error("Error loading favorites:", e);
                    }
                } else {
                    setFavorites([]);
                }
            }
            return;
        }

        const docRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const defaultStats = {
                    calories: 0,
                    workoutsCount: 0,
                    weight: 0,
                    activeCoaches: 0,
                    streak: 0,
                    sessionsCompleted: 0
                };
                setUserData({ ...defaultStats, ...data });
                if (data.favorites) {
                    setFavorites(data.favorites);
                }
            } else {
                const defaultData = { 
                    fullName: user.displayName || '', 
                    photoURL: user.photoURL || '',
                    email: user.email || '',
                    calories: 0,
                    workoutsCount: 0,
                    weight: 0,
                    activeCoaches: 0,
                    streak: 0,
                    sessionsCompleted: 0,
                    createdAt: serverTimestamp()
                };
                setUserData(defaultData);
                // Initialize document in Firestore
                setDoc(docRef, defaultData).catch(err => console.error("Error creating user doc:", err));
            }
        }, (error) => {
            console.error("Error listening to user data:", error);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleFavorite = async (productId) => {
        const isFav = favorites.includes(productId);
        const newFavorites = isFav 
            ? favorites.filter(id => id !== productId)
            : [...favorites, productId];
        
        setFavorites(newFavorites);

        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    favorites: isFav ? arrayRemove(productId) : arrayUnion(productId)
                });
            } catch (error) {
                console.error("Error updating favorites in Firestore:", error);
            }
        } else {
            if (typeof window !== 'undefined') {
                localStorage.setItem('captina_favorites', JSON.stringify(newFavorites));
            }
        }
    };
    
    const [loadingGyms, setLoadingGyms] = useState(true);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [loadingTrainers, setLoadingTrainers] = useState(true);
    const [loadingSports, setLoadingSports] = useState(true);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [loadingGoals, setLoadingGoals] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('lang') || 'ar';
            const savedTheme = localStorage.getItem('theme') === 'true';
            setLanguage(savedLang);
            setDarkMode(savedTheme);
        }
    }, []);

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const q = query(collection(db, "gyms"));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    const initialGyms = [
                        { 
                            name_ar: "فرع المونسية", 
                            name_en: "Al-Monsiya Branch", 
                            type: 'Internal', 
                            rating: '4.9', 
                            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
                            images: [
                                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
                                "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800",
                                "https://images.unsplash.com/photo-1574673139641-87b1d3d609a7?q=80&w=800"
                            ],
                            location_ar: "الرياض، حي المونسية، طريق الثمامة",
                            location_en: "Riyadh, Al-Monsiya, Thumama Road",
                            location_link: "https://goo.gl/maps/example1",
                            phone: "+966 50 123 4567",
                            social: { instagram: "captina_monsia", twitter: "@captina_monsia" },
                            sports_ar: ["ملاكمة", "كاراتيه", "كروس فت", "بناء أجسام"],
                            sports_en: ["Boxing", "Karate", "CrossFit", "Bodybuilding"],
                            halls: 5,
                            trainers: 12
                        },
                        { 
                            name_ar: "فرع الياسمين", 
                            name_en: "Al-Yasmin Branch", 
                            type: 'Internal', 
                            rating: '4.8', 
                            image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800",
                            images: [
                                "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800",
                                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
                                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800"
                            ],
                            location_ar: "الرياض، حي الياسمين، طريق الملك عبدالعزيز",
                            location_en: "Riyadh, Al-Yasmin, King Abdulaziz Road",
                            location_link: "https://goo.gl/maps/example2",
                            phone: "+966 50 987 6543",
                            social: { instagram: "captina_yasmin", twitter: "@captina_yasmin" },
                            sports_ar: ["ملاكمة", "كروس فت", "لياقة بدنية"],
                            sports_en: ["Boxing", "CrossFit", "Fitness"],
                            halls: 3,
                            trainers: 8
                        },
                        { name_ar: "جولدز جيم", name_en: "Gold's Gym", type: 'Partner', rating: '4.9', image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", trainers: 25 },
                        { name_ar: "فيتنس فيرست", name_en: "Fitness First", type: 'Partner', rating: '4.8', image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800", trainers: 30 },
                        { name_ar: "أكاديمية تيتان", name_en: "Titan Academy", type: 'Partner', rating: '4.9', image: "https://images.unsplash.com/photo-1574673139641-87b1d3d609a7?q=80&w=800", trainers: 15 },
                        { name_ar: "ذا كيج", name_en: "The Cage", type: 'Partner', rating: '4.7', image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800", trainers: 10 }
                    ];
                    for (const gym of initialGyms) {
                        await addDoc(collection(db, "gyms"), gym);
                    }
                    setGyms(initialGyms.map((g, i) => ({ 
                        ...g, 
                        id: `seed-${i}`, 
                        name: language === 'ar' ? g.name_ar : g.name_en,
                        location: language === 'ar' ? g.location_ar : g.location_en,
                        sports: language === 'ar' ? g.sports_ar : g.sports_en
                    })));
                } else {
                    setGyms(querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id, 
                            ...data, 
                            name: language === 'ar' ? data.name_ar : data.name_en,
                            location: language === 'ar' ? data.location_ar : data.location_en,
                            sports: language === 'ar' ? data.sports_ar : data.sports_en
                        };
                    }));
                }
            } catch (error) {
                console.error("Error fetching gyms:", error);
            } finally {
                setLoadingGyms(false);
            }
        };

        const fetchPackages = async () => {
            try {
                const q = query(collection(db, "packages"), orderBy("order", "asc"));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    const initialPackages = [
                        {
                            order: 1,
                            name_ar: "الحصة التجريبية",
                            name_en: "Trial Session",
                            price: "50",
                            price_en: "15",
                            currency_ar: "ر.س",
                            currency_en: "$",
                            desc_ar: "أفضل طريقة للبدء وتجربة البيئة التدريبية.",
                            desc_en: "Perfect way to start and test our elite environment.",
                            features_ar: ["مدة الجلسة 60 دقيقة", "تقييم بدني أولي", "استشارة مع مدرب"],
                            features_en: ["60 Min Session", "Initial Assessment", "Coach Consultation"],
                            badge_ar: "مجاناً للمشتركين",
                            badge_en: "Free for first use",
                            featured: false
                        },
                        {
                            order: 2,
                            name_ar: "الباقة الشهرية",
                            name_en: "Monthly Pro",
                            price: "599",
                            price_en: "159",
                            currency_ar: "ر.س",
                            currency_en: "$",
                            desc_ar: "مثالية للملتزمين الذين يسعون لنتائج حقيقية.",
                            desc_en: "Ideal for committed athletes seeking real results.",
                            features_ar: ["12 جلسة تدريبية", "خطة غذائية", "متابعة واتساب", "خصم 10%"],
                            features_en: ["12 Sessions", "Nutritional Plan", "WhatsApp Follow-up", "10% Discount"],
                            badge_ar: "الأكثر طلباً",
                            badge_en: "Most Popular",
                            featured: true
                        },
                        {
                            order: 3,
                            name_ar: "الباقة الملكية VIP",
                            name_en: "VIP Elite",
                            price: "1499",
                            price_en: "399",
                            currency_ar: "ر.س",
                            currency_en: "$",
                            desc_ar: "التجربة القصوى للتدريب الشخصي الفاخر.",
                            desc_en: "The ultimate luxury performance training experience.",
                            features_ar: ["جلسات غير محدودة", "مدرب خاص متفرغ", "وجبات صحية", "خصم 25%"],
                            features_en: ["Unlimited Sessions", "Dedicated Private Coach", "Healthy Meals", "25% Discount"],
                            badge_ar: "تجربة متميزة",
                            badge_en: "Premium Experience",
                            featured: false
                        }
                    ];
                    for (const pkg of initialPackages) {
                        await addDoc(collection(db, "packages"), pkg);
                    }
                    setPackages(initialPackages.map((p, i) => ({ 
                        ...p, id: `seed-pkg-${i}`, 
                        name: language === 'ar' ? p.name_ar : p.name_en,
                        price: language === 'ar' ? p.price : p.price_en,
                        currency: language === 'ar' ? p.currency_ar : p.currency_en,
                        description: language === 'ar' ? p.desc_ar : p.desc_en,
                        features: language === 'ar' ? p.features_ar : p.features_en,
                        badge: language === 'ar' ? p.badge_ar : p.badge_en
                    })));
                } else {
                    setPackages(querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            ...data,
                            name: language === 'ar' ? data.name_ar : data.name_en,
                            price: language === 'ar' ? data.price : data.price_en,
                            currency: language === 'ar' ? data.currency_ar : data.currency_en,
                            description: language === 'ar' ? data.desc_ar : data.desc_en,
                            features: language === 'ar' ? data.features_ar : data.features_en,
                            badge: language === 'ar' ? data.badge_ar : data.badge_en
                        };
                    }));
                }
            } catch (error) {
                console.error("Error fetching packages:", error);
            } finally {
                setLoadingPackages(false);
            }
        };

        const fetchTrainers = async () => {
            try {
                const q = query(collection(db, "trainers"));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    const initialTrainers = [
                        { name_ar: "كابتن أحمد", name_en: "Captain Ahmed", specialty_ar: "خسارة الوزن وتحديد العضلات", specialty_en: "Weight loss and muscle definition", exp_ar: "12 سنة", exp_en: "12 Years", rating: 4.9, image: "https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=400" },
                        { name_ar: "كابتن سارة", name_en: "Captain Sara", specialty_ar: "لياقة بدنية مرونة (يوغا)", specialty_en: "Fitness and Yoga flexibility", exp_ar: "8 سنوات", exp_en: "8 Years", rating: 4.8, image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400" },
                        { name_ar: "كابتن محمد", name_en: "Captain Mohamed", specialty_ar: "بناء أجسام وتضخيم", specialty_en: "Bodybuilding and bulking", exp_ar: "15 سنة", exp_en: "15 Years", rating: 5.0, image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=400" },
                        { name_ar: "كابتن خالد", name_en: "Captain Khaled", specialty_ar: "رفع أثقال وقوة بدنية", specialty_en: "Powerlifting and strength", exp_ar: "10 سنوات", exp_en: "10 Years", rating: 4.7, image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400" }
                    ];
                    for (const trainer of initialTrainers) await addDoc(collection(db, "trainers"), trainer);
                    setTrainers(initialTrainers.map((t, i) => ({ ...t, id: `seed-${i}`, name: language === 'ar' ? t.name_ar : t.name_en, specialty: language === 'ar' ? t.specialty_ar : t.specialty_en, exp: language === 'ar' ? t.exp_ar : t.exp_en })));
                } else {
                    setTrainers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), name: language === 'ar' ? doc.data().name_ar : doc.data().name_en, specialty: language === 'ar' ? doc.data().specialty_ar : doc.data().specialty_en, exp: language === 'ar' ? doc.data().exp_ar : doc.data().exp_en })));
                }
            } catch (e) { console.error("Error trainers:", e); } finally { setLoadingTrainers(false); }
        };

        const fetchSports = async () => {
            try {
                const q = query(collection(db, "sports"));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    const initialSports = [
                        { slug: 'boxing', name_ar: "الملاكمة", name_en: "Boxing", desc_ar: "تعلم فنون الدفاع عن النفس وزد من سرعة رد فعلك وقوتك البدنية.", desc_en: "Learn martial arts and increase your reaction speed and physical strength.", level_ar: "كافة المستويات", level_en: "All Levels", duration_ar: "60 دقيقة", duration_en: "60 Min", intensity_ar: "عالية", intensity_en: "High", image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600" },
                        { slug: 'karate', name_ar: "الكاراتيه", name_en: "Karate", desc_ar: "الانضباط والتركيز والقوة. انضم لدروس الكاراتيه وتدرج في الأحزمة.", desc_en: "Discipline, focus and strength. Join Karate classes and progress through belts.", level_ar: "مبتدئ - محترف", level_en: "Beg - Pro", duration_ar: "90 دقيقة", duration_en: "90 Min", intensity_ar: "متوسطة", intensity_en: "Medium", image: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=600" },
                        { slug: 'crossfit', name_ar: "كروس فت", name_en: "CrossFit", desc_ar: "تحدَّ حدودك مع تمارين القوة والتحمل عالية الكثافة.", desc_en: "Challenge your limits with high-intensity strength and endurance exercises.", level_ar: "متقدم", level_en: "Advanced", duration_ar: "45 دقيقة", duration_en: "45 Min", intensity_ar: "قصوى", intensity_en: "Extreme", image: "https://images.unsplash.com/photo-1534367507873-d2d7e249a3fe?q=80&w=600" },
                        { slug: 'bodybuilding', name_ar: "بناء الأجسام", name_en: "Bodybuilding", desc_ar: "خطة تدريبية متكاملة لبناء العضلات وتحسين الضخامة العضلية.", desc_en: "Integrated training plan to build muscles and improve muscle bulk.", level_ar: "كافة المستويات", level_en: "All Levels", duration_ar: "75 دقيقة", duration_en: "75 Min", intensity_ar: "عالية", intensity_en: "High", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=600" }
                    ];
                    for (const sport of initialSports) await addDoc(collection(db, "sports"), sport);
                    setSports(initialSports.map((s, i) => ({ ...s, id: `seed-${i}`, name: language === 'ar' ? s.name_ar : s.name_en, description: language === 'ar' ? s.desc_ar : s.desc_en, stats: { level: language === 'ar' ? s.level_ar : s.level_en, duration: language === 'ar' ? s.duration_ar : s.duration_en, intensity: language === 'ar' ? s.intensity_ar : s.intensity_en } })));
                } else {
                    setSports(querySnapshot.docs.map(doc => {
                        const s = doc.data();
                        const nameAr = s.name_ar || s.name || s.slug || doc.id;
                        const nameEn = s.name_en || s.name || s.slug || doc.id;
                        return { 
                            id: doc.id, 
                            ...s, 
                            name: language === 'ar' ? nameAr : nameEn, 
                            description: language === 'ar' ? (s.desc_ar || s.description) : (s.desc_en || s.description), 
                            stats: { 
                                level: language === 'ar' ? (s.level_ar || 'كافة المستويات') : (s.level_en || 'All Levels'), 
                                duration: language === 'ar' ? (s.duration_ar || '60 دقيقة') : (s.duration_en || '60 Min'), 
                                intensity: language === 'ar' ? (s.intensity_ar || 'عالية') : (s.intensity_en || 'High') 
                            } 
                        };
                    }));
                }
            } catch (e) { console.error("Error sports:", e); } finally { setLoadingSports(false); }
        };

        const fetchOffers = async () => {
            try {
                const q = query(collection(db, "offers"));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    const initialOffers = [
                        { 
                            title_ar: "خصم 50% للإشتراك السنوي", 
                            title_en: "50% Off Yearly Subscription", 
                            sub_ar: "لفترة محدودة جداً", 
                            sub_en: "For a very limited time", 
                            badge_ar: "عرض خاص", 
                            badge_en: "Special Offer", 
                            expiry_ar: "ينتهي في 30 مارس", 
                            expiry_en: "Ends March 30", 
                            desc_ar: "احصل على اشتراك كامل لمدة سنة بنصف السعر. يشمل جميع الصالات والمدربين والدعم الغذائي.", 
                            desc_en: "Get a full year subscription at half price. Includes all gyms, trainers, and nutritional support.",
                            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"
                        },
                        { 
                            title_ar: "حصة تجريبية مجانية", 
                            title_en: "Free Trial Session", 
                            sub_ar: "مع نخبة من مدربينا", 
                            sub_en: "With our elite trainers", 
                            badge_ar: "مجاناً", 
                            badge_en: "Free", 
                            expiry_ar: "متاح دائماً للأعضاء الجدد", 
                            expiry_en: "Always available for new members", 
                            desc_ar: "جرب خدماتنا قبل الاشتراك. احصل على تقييم بدني كامل وحصة تدريبية لمدة 60 دقيقة مجاناً.", 
                            desc_en: "Try our services before subscribing. Get a full physical assessment and a 60-minute training session for free.",
                            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000"
                        },
                        { 
                            title_ar: "باقة التغذية المتكاملة", 
                            title_en: "Integrated Nutrition Package", 
                            sub_ar: "خصم يصل إلى 30%", 
                            sub_en: "Discount up to 30%", 
                            badge_ar: "الأكثر طلباً", 
                            badge_en: "Most Popular", 
                            expiry_ar: "لفترة محدودة", 
                            expiry_en: "Limited time", 
                            desc_ar: "صمم خطتك الغذائية مع خبراء التغذية لدينا بخصم حصري. الوجبات والمكملات والنصائح في مكان واحد.", 
                            desc_en: "Design your nutritional plan with our experts at an exclusive discount. Meals, supplements, and tips in one place.",
                            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000"
                        },
                        { 
                            title_ar: "شحن مجاني للمتجر", 
                            title_en: "Free Store Shipping", 
                            sub_ar: "على جميع الطلبات فوق 200 ريال", 
                            sub_en: "On all orders above 200 SAR", 
                            badge_ar: "حصري", 
                            badge_en: "Exclusive", 
                            expiry_ar: "ينتهي قريباً", 
                            expiry_en: "Ending soon", 
                            desc_ar: "لا تقلق بشأن تكاليف التوصيل. تسوق أفضل الأجهزة والمكملات والملابس الرياضية واحصل على توصيل لمنزلك مجاناً.", 
                            desc_en: "Don't worry about delivery costs. Shop for the best equipment, supplements, and sportswear with free delivery.",
                            image: "https://images.unsplash.com/photo-1541534741688-6078c64ec4a9?q=80&w=1000"
                        }
                    ];
                    for (const offer of initialOffers) await addDoc(collection(db, "offers"), offer);
                    setOffers(initialOffers.map((o, i) => ({ 
                        ...o, id: `seed-${i}`, 
                        title: language === 'ar' ? o.title_ar : o.title_en, 
                        subtitle: language === 'ar' ? o.sub_ar : o.sub_en, 
                        badge: language === 'ar' ? o.badge_ar : o.badge_en, 
                        expiry: language === 'ar' ? o.expiry_ar : o.expiry_en, 
                        description: language === 'ar' ? o.desc_ar : o.desc_en 
                    })));
                } else {
                    setOffers(querySnapshot.docs.map(doc => {
                        const o = doc.data();
                        return { 
                            id: doc.id, ...o, 
                            title: language === 'ar' ? o.title_ar : o.title_en, 
                            subtitle: language === 'ar' ? o.sub_ar : o.sub_en, 
                            badge: language === 'ar' ? o.badge_ar : o.badge_en, 
                            expiry: language === 'ar' ? o.expiry_ar : o.expiry_en, 
                            description: language === 'ar' ? o.desc_ar : o.desc_en 
                        };
                    }));
                }
            } catch (e) { console.error("Error offers:", e); } finally { setLoadingOffers(false); }
        };

        const fetchProducts = async () => {
            try {
                const q = query(collection(db, "products"));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    const initialProducts = [
                        { 
                            name_ar: "بدلة تايكوندو بريميوم", 
                            name_en: "Premium Taekwondo Uniform", 
                            category_ar: "ملابس", 
                            category_en: "Clothing", 
                            price: 250, 
                            rating: 5.0, 
                            image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400",
                            description_ar: "بدلة تايكوندو معتمدة، خفيفة الوزن ومتينة، مثالية للبطولات والتدريب اليومي.",
                            description_en: "Certified Taekwondo uniform, lightweight and durable, perfect for tournaments and daily training.",
                            sizes: ["80cm", "90cm", "100cm", "110cm", "120cm", "130cm", "140cm", "150cm", "160cm", "170cm", "180cm", "190cm", "200cm", "210cm", "220cm"],
                            colors: [
                                { name_ar: "أبيض", name_en: "White", code: "#FFFFFF" },
                                { name_ar: "أسود", name_en: "Black", code: "#000000" }
                            ]
                        },
                        { 
                            name_ar: "بدلة كاراتيه احترافية", 
                            name_en: "Professional Karate Gi", 
                            category_ar: "ملابس", 
                            category_en: "Clothing", 
                            price: 280, 
                            rating: 4.9, 
                            image: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=400",
                            description_ar: "بدلة كاراتيه قطنية 100% توفر صوتاً قوياً عند الحركة وراحة تامة.",
                            description_en: "100% cotton Karate Gi providing a crisp snap and complete comfort.",
                            sizes: ["80cm", "90cm", "100cm", "110cm", "120cm", "130cm", "140cm", "150cm", "160cm", "170cm", "180cm", "190cm", "200cm", "210cm", "220cm"],
                            colors: [
                                { name_ar: "أبيض", name_en: "White", code: "#FFFFFF" },
                                { name_ar: "أسود", name_en: "Black", code: "#000000" }
                            ]
                        },
                        { 
                            name_ar: "قفازات النخبة للملاكمة", 
                            name_en: "Elite Boxing Gloves", 
                            category_ar: "أدوات", 
                            category_en: "Tools", 
                            price: 399, 
                            rating: 5.0, 
                            image: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=400",
                            description_ar: "قفازات ملاكمة احترافية مصنوعة من الجلد الفاخر مع حماية مضاعفة للمعصم.",
                            description_en: "Professional boxing gloves made of premium leather with double wrist protection.",
                            sizes: ["04Z", "06Z", "08Z", "10Z", "12Z", "14Z", "16Z"],
                            colors: [
                                { name_ar: "أحمر", name_en: "Red", code: "#CC0000" },
                                { name_ar: "أزرق", name_en: "Blue", code: "#0000CC" },
                                { name_ar: "أسود", name_en: "Black", code: "#000000" },
                                { name_ar: "ذهبي", name_en: "Gold", code: "#D4AF37" }
                            ]
                        },
                        { 
                            name_ar: "تيشيرت فتوة برو", 
                            name_en: "Futwa Pro T-Shirt", 
                            category_ar: "ملابس", 
                            category_en: "Clothing", 
                            price: 150, 
                            rating: 4.9, 
                            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400",
                            description_ar: "تيشيرت رياضي عالي الجودة مصمم لراحة مثالية أثناء التمارين الشاقة.",
                            description_en: "High-quality sports T-shirt designed for optimal comfort during intense workouts.",
                            sizes: ["S", "M", "L", "XL", "XXL"],
                            colors: [
                                { name_ar: "أسود", name_en: "Black", code: "#000000" },
                                { name_ar: "أبيض", name_en: "White", code: "#FFFFFF" },
                                { name_ar: "كحلي", name_en: "Navy", code: "#000080" }
                            ]
                        },
                        { 
                            name_ar: "حزام التدريب الجلدي", 
                            name_en: "Leather Training Belt", 
                            category_ar: "أدوات", 
                            category_en: "Tools", 
                            price: 299, 
                            rating: 4.8, 
                            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400",
                            description_ar: "حزام جلدي طبيعي يوفر دعماً استثنائياً لأسفل الظهر أثناء رفع الأثقال.",
                            description_en: "Natural leather belt providing exceptional lower back support during heavy lifting.",
                            sizes: ["M", "L", "XL"],
                            colors: [
                                { name_ar: "بني", name_en: "Brown", code: "#8B4513" },
                                { name_ar: "أسود", name_en: "Black", code: "#000000" }
                            ]
                        }
                    ];
                    for (const prod of initialProducts) await addDoc(collection(db, "products"), prod);
                    setProducts(initialProducts.map((p, i) => ({ 
                        ...p, 
                        id: `seed-${i}`, 
                        name: language === 'ar' ? p.name_ar : p.name_en, 
                        category: language === 'ar' ? p.category_ar : p.category_en,
                        description: language === 'ar' ? p.description_ar : p.description_en
                    })));

                    const initialCats = [
                        { id: 'clothing', name_ar: 'ملابس', name_en: 'Clothing', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150' },
                        { id: 'shoes', name_ar: 'أحذية', name_en: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150' },
                        { id: 'gloves', name_ar: 'قفازات', name_en: 'Gloves', img: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=150' },
                        { id: 'belts', name_ar: 'أحزمة', name_en: 'Belts', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=150' },
                        { id: 'tools', name_ar: 'أدوات', name_en: 'Tools', img: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=150' },
                        { id: 'accessories', name_ar: 'إكسسوارات', name_en: 'Accessories', img: 'https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=150' }
                    ];
                    setCategories(initialCats.map(c => ({ ...c, name: language === 'ar' ? c.name_ar : c.name_en })));
                } else {
                    setProducts(querySnapshot.docs.map(doc => {
                        const p = doc.data();
                        return { 
                            id: doc.id, 
                            ...p, 
                            name: language === 'ar' ? p.name_ar : p.name_en, 
                            category: language === 'ar' ? p.category_ar : p.category_en,
                            description: language === 'ar' ? p.description_ar : p.description_en
                        };
                    }));
                    
                    const cats = [
                        { id: 'clothing', name_ar: 'ملابس', name_en: 'Clothing', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150' },
                        { id: 'shoes', name_ar: 'أحذية', name_en: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150' },
                        { id: 'gloves', name_ar: 'قفازات', name_en: 'Gloves', img: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=150' },
                        { id: 'belts', name_ar: 'أحزمة', name_en: 'Belts', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=150' },
                        { id: 'tools', name_ar: 'أدوات', name_en: 'Tools', img: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=150' },
                        { id: 'accessories', name_ar: 'إكسسوارات', name_en: 'Accessories', img: 'https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=150' }
                    ];
                    setCategories(cats.map(c => ({ ...c, name: language === 'ar' ? c.name_ar : c.name_en })));
                }
            } catch (e) { console.error("Error products:", e); } finally { setLoadingProducts(false); }
        };

        const fetchTasks = async () => {
            try {
                const q = query(collection(db, "tasks"));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    const initialTasks = [
                        { title_ar: 'تمارين الكارديو الصباحية', title_en: 'Morning Cardio Session', time_ar: '08:00 ص', time_en: '08:00 AM', icon: '🏃‍♂️', type: 'cardio' },
                        { title_ar: 'تدريب القوة - الأرجل', title_en: 'Strength Training - Legs', time_ar: '05:00 م', time_en: '05:00 PM', icon: '💪', type: 'strength' }
                    ];
                    for (const t of initialTasks) await addDoc(collection(db, "tasks"), t);
                    setTasks(initialTasks.map((t, i) => ({ ...t, id: `seed-${i}`, title: language === 'ar' ? t.title_ar : t.title_en, time: language === 'ar' ? t.time_ar : t.time_en })));
                } else {
                    setTasks(querySnapshot.docs.map(doc => {
                        const t = doc.data();
                        return { id: doc.id, ...t, title: language === 'ar' ? t.title_ar : t.title_en, time: language === 'ar' ? t.time_ar : t.time_en };
                    }));
                }
            } catch (e) { console.error("Error tasks:", e); } finally { setLoadingTasks(false); }
        };

        const fetchGoals = async () => {
            try {
                const q = query(collection(db, "goals"), limit(1));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    const initialGoal = { percentage: 85, text_ar: 'أداء مذهل!', text_en: 'Amazing performance!', sub_ar: 'أكملت 12 حصة من أصل 14.', sub_en: '12 out of 14 sessions done.' };
                    await addDoc(collection(db, "goals"), initialGoal);
                    setGoals({ ...initialGoal, text: language === 'ar' ? initialGoal.text_ar : initialGoal.text_en, sub: language === 'ar' ? initialGoal.sub_ar : initialGoal.sub_en });
                } else {
                    const g = querySnapshot.docs[0].data();
                    setGoals({ id: querySnapshot.docs[0].id, ...g, text: language === 'ar' ? g.text_ar : g.text_en, sub: language === 'ar' ? g.sub_ar : g.sub_en });
                }
            } catch (e) { console.error("Error goals:", e); } finally { setLoadingGoals(false); }
        };

        fetchGyms();
        fetchPackages();
        fetchTrainers();
        fetchSports();
        fetchOffers();
        fetchProducts();
        fetchTasks();
        fetchGoals();
    }, [language]);

    // CART LOGIC
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('captina_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) { console.error("Error loading cart:", e); }
        }
    }, []);

    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('captina_cart', JSON.stringify(newCart));
    };

    const addToCart = (product, selection) => {
        const cartId = `${product.id}-${selection.size || 'default'}-${selection.color?.code || 'default'}`;
        const existingItemIndex = cart.findIndex(item => item.cartId === cartId);

        if (existingItemIndex > -1) {
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += selection.quantity || 1;
            saveCart(newCart);
        } else {
            const newItem = {
                cartId,
                productId: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                size: selection.size,
                color: selection.color,
                quantity: selection.quantity || 1
            };
            saveCart([...cart, newItem]);
        }
    };

    const removeFromCart = (cartId) => {
        saveCart(cart.filter(item => item.cartId !== cartId));
    };

    const updateCartQuantity = (cartId, delta) => {
        const newCart = cart.map(item => {
            if (item.cartId === cartId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0);
        saveCart(newCart);
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const changeLanguage = (newLang) => {
        setLanguage(newLang);
        localStorage.setItem('lang', newLang);
    };

    const toggleLanguage = () => {
        changeLanguage(language === 'ar' ? 'en' : 'ar');
    };

    const changeDarkMode = (newMode) => {
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode);
    };

    const toggleDarkMode = () => {
        changeDarkMode(!darkMode);
    };

    const t = (key) => {
        if (!key) return '';
        if (key === 'gymsData') return gyms;
        if (key === 'packagesData') return packages;
        if (key === 'pageTrainersData') return trainers;
        if (key === 'pageSportsData') return sports;
        if (key === 'offersData' || key === 'allOffersData') return offers;
        if (key === 'productsData') return products;
        if (key === 'categoriesData') return categories;
        if (key === 'tasksData') return tasks;
        if (key === 'goalsData') return goals;

        const keys = key.split('.');
        let value = translations[language];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }
        return value;
    };

    return (
        <AppContext.Provider value={{ 
            language, 
            setLanguage: changeLanguage, 
            toggleLanguage, 
            darkMode, 
            setDarkMode: changeDarkMode, 
            toggleDarkMode, 
            t,
            gyms,
            packages,
            trainers,
            sports,
            offers,
            products,
            categories,
            tasks,
            goals,
            loadingGyms,
            loadingPackages,
            loadingTrainers,
            loadingSports,
            loadingOffers,
            loadingProducts,
            loadingTasks,
            loadingGoals,
            alert,
            setAlert,
            cart,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            cartTotal,
            cartCount,
            user,
            userData,
            favorites,
            toggleFavorite,
            loadingAuth,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
