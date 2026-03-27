"use client";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, collection, query, where, getDocs, addDoc, serverTimestamp, setDoc, orderBy, limit, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getSportImage } from '@/lib/sportsData';

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
        "library": "المكتبة",
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
            { id: 'offer-annual-50', title: "خصم 50% للإشتراك السنوي", subtitle: "لفترة محدودة جداً", badge: "عرض خاص", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000" },
            { id: 'offer-trial-free', title: "حصة تجريبية مجانية", subtitle: "مع نخبة من مدربينا", badge: "مجاناً", image: "https://images.unsplash.com/photo-1571019623518-8612ca3d5951?q=80&w=1000" },
            { id: 'offer-nutrition-30', title: "باقة التغذية المتكاملة", subtitle: "خصم يصل إلى 30%", badge: "الأكثر طلباً", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000" },
            { id: 'offer-store-shipping', title: "شحن مجاني للمتجر", subtitle: "على جميع الطلبات فوق 200 ريال", badge: "حصري", image: "https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=1000" }
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
                id: 'offer-annual-50',
                title: "خصم 50% للإشتراك السنوي",
                subtitle: "لفترة محدودة جداً",
                badge: "عرض خاص",
                expiry: "ينتهي في 30 مارس",
                image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
                description: "احصل على اشتراك كامل لمدة سنة بنصف السعر. يشمل جميع الصالات والمدربين والدعم الغذائي."
            },
            {
                id: 'offer-trial-free',
                title: "حصة تجريبية مجانية",
                subtitle: "مع نخبة من مدربينا",
                badge: "مجاناً",
                expiry: "متاح دائماً للأعضاء الجدد",
                image: "https://images.unsplash.com/photo-1571019623518-8612ca3d5951?q=80&w=1000",
                description: "جرب خدماتنا قبل الاشتراك. احصل على تقييم بدني كامل وحصة تدريبية لمدة 60 دقيقة مجاناً."
            },
            {
                id: 'offer-nutrition-30',
                title: "باقة التغذية المتكاملة",
                subtitle: "خصم يصل إلى 30%",
                badge: "الأكثر طلباً",
                expiry: "لفترة محدودة",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000",
                description: "صمم خطتك الغذائية مع خبراء التغذية لدينا بخصم حصري. الوجبات والمكملات والنصائح في مكان واحد."
            },
            {
                id: 'offer-store-shipping',
                title: "شحن مجاني للمتجر",
                subtitle: "على جميع الطلبات فوق 200 ريال",
                badge: "حصري",
                expiry: "ينتهي قريباً",
                image: "https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=1000",
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
        subscribeNow: "أضف إلى السلة",
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
                image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800',
                description: 'تعلم فنون الدفاع عن النفس وزد من سرعة رد فعلك وقوتك البدنية.',
                stats: { level: 'كافة المستويات', duration: '60 دقيقة', intensity: 'عالية' }
            },
            {
                id: 'karate',
                name: 'الكاراتيه',
                image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800',
                description: 'الانضباط والتركيز والقوة. انضم لدروس الكاراتيه وتدرج في الأحزمة.',
                stats: { level: 'مبتدئ - محترف', duration: '90 دقيقة', intensity: 'متوسطة' }
            },
            {
                id: 'taekwondo',
                name: 'تايكوندو',
                image: 'https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800',
                description: 'فن قتالي كوري يركز على الركلات العالية والسريعة والتركيز العالي.',
                stats: { level: 'أطفال - كبار', duration: '60 دقيقة', intensity: 'عالية' }
            },
            {
                id: 'kickboxing',
                name: 'كيك بوكسينغ',
                image: 'https://images.unsplash.com/photo-1509190105349-346bb3a15d9a?q=80&w=800',
                description: 'مزيج قوي بين الملاكمة والركلات لزيادة القوة والتحمل.',
                stats: { level: 'كافة المستويات', duration: '60 دقيقة', intensity: 'عالية' }
            },
            {
                id: 'fitness',
                name: 'لياقة بدنية',
                image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800',
                description: 'تمارين شاملة لتحسين المظهر اللائق وزيادة الطاقة اليومية.',
                stats: { level: 'مبتدئ - متقدم', duration: '45 دقيقة', intensity: 'متوسطة' }
            },
            {
                id: 'yoga',
                name: 'يوغا',
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800',
                description: 'استرخاء ومرونة وتوازن تام بين العقل والجسد.',
                stats: { level: 'كافة المستويات', duration: '60 دقيقة', intensity: 'خفيفة' }
            },
            {
                id: 'crossfit',
                name: 'كروس فت',
                image: 'https://images.unsplash.com/photo-1534367507873-d2d7e249a3ef?q=80&w=800',
                description: 'تحدَّ حدودك مع تمارين القوة والتحمل عالية الكثافة.',
                stats: { level: 'متقدم', duration: '45 دقيقة', intensity: 'قصوى' }
            },
            {
                id: 'bodybuilding',
                name: 'بناء الأجسام',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800',
                description: 'خطة تدريبية متكاملة لبناء العضلات وتحسين الضخامة العضلية.',
                stats: { level: 'كافة المستويات', duration: '75 دقيقة', intensity: 'عالية' }
            }
        ],
        boxingContent: {
            title: "الملاكمة",
            heroImg: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800",
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
            heroImg: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800",
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
            heroImg: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800",
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
            heroImg: "https://images.unsplash.com/photo-1509190105349-346bb3a15d9a?q=80&w=800",
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
            heroImg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
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
        trainingPage: {
            title: "الحصص والبرامج التدريبية",
            tabs: {
                classes: "حصصي",
                programs: "برامجي"
            },
            freeze: {
                button: "تجميد / إلغاء",
                title: "طلب تجميد الحصة",
                reason: "سبب التجميد",
                startDate: "تاريخ البدء",
                endDate: "تاريخ الانتهاء",
                submit: "إرسال الطلب",
                success: "تم إرسال طلب التجميد بنجاح"
            },
            emptyClasses: "لا توجد حصص مجدولة حالياً",
            emptyPrograms: "لا توجد برامج تدريبية نشطة",
            generating: "جاري إنشاء جدولك التدريبي..."
        },
        yogaContent: {
            title: "يوغا",
            heroImg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
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
            heroImg: "https://images.unsplash.com/photo-1534367507873-d2d7e249a3ef?q=80&w=800",
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
            heroImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
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
            myClasses: "حصصي التدريبية",
            myPrograms: "برامجي التدريبية",
            myAchievements: "إنجازاتي",
            myAddress: "عنواني",
            items: "عناصر",
            activeMember: "عضو نشط",
            currentGoal: "الهدف الحالي",
            progressText: "تقدم ملحوظ (15%)",
            appSettings: "إعدادات التطبيق",
            logout: "تسجيل الخروج",
            sessionsCompleted: "حصص مكتملة",
            activeSports: "رياضات نشطة",
            streakDays: "أيام متتالية",
            upcomingSessions: "الحصص القادمة",
            currentPackage: "الباقة الحالية",
            startDate: "تاريخ البدء",
            endDate: "تاريخ الانتهاء",
            renewPackage: "تجديد الباقة",
            paymentHistory: "سجل المدفوعات",
            birthday: "تاريخ الميلاد",
            location: "المدينة",
            trainingPreferences: "تفضيلات التدريب",
            fitnessLevel: "مستوى اللياقة",
            sessionsLeft: "حصص متبقية"
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
            title: "اشترك الآن",
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
            title: "تواصل معنا | كابتينا لدعم لياقتك",
            breadcrumbs: {
                home: "الرئيسية",
                contact: "مركز التواصل"
            },
            heroTitle: "نحن هنا من أجلك - تواصل معنا",
            heroDesc: "هل لديك أي استفسار حول باقاتنا أو خدماتنا؟ فريق كابتينا المتخصص مستعد لتقديم الدعم والمشورة لك في أي وقت.",
            infoTitle: "قنوات التواصل المباشر",
            infoDesc: "تواصل مع فريق الدعم لدينا للحصول على إجابات سريعة واحترافية.",
            items: {
                location: "المقر الرئيسي",
                locationVal: "الرياض، المملكة العربية السعودية",
                phone: "الرقم الموحد",
                email: "الدعم الفني",
                workingHours: "ساعات العمل",
                workingHoursVal: "يومياً: من 9:00 صباحاً حتى 10:00 مساءً"
            },
            form: {
                title: "أرسل استفسارك الآن",
                name: "الاسم الكامل",
                phone: "رقم الجوال",
                email: "البريد الإلكتروني",
                message: "كيف يمكننا مساعدتك اليوم؟",
                placeholder: "اكتب رسالتك أو استفسارك هنا بكل تفصيل...",
                submit: "إرسال الرسالة للإدارة",
                loading: "جاري إرسال رسالتك...",
                success: "تم استلام رسالتك بنجاح! سنتواصل معك قريباً."
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
        library: "Library",
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
            { id: 'offer-annual-50', title: "50% Discount for Annual Subscription", subtitle: "For a very limited time", badge: "Special Offer", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000" },
            { id: 'offer-trial-free', title: "Free Trial Session", subtitle: "With our elite trainers", badge: "Free", image: "https://images.unsplash.com/photo-1571019623518-8612ca3d5951?q=80&w=1000" },
            { id: 'offer-nutrition-30', title: "Integrated Nutrition Package", subtitle: "Discount up to 30%", badge: "Most Requested", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000" },
            { id: 'offer-store-shipping', title: "Free Shipping for Store", subtitle: "On all orders above 200 SAR", badge: "Exclusive", image: "https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=1000" }
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
                id: 'offer-annual-50',
                title: "50% Discount for Annual Subscription",
                subtitle: "For a very limited time",
                badge: "Special Offer",
                expiry: "Ends on March 30",
                image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
                description: "Get a full annual subscription for half price. Includes all gyms, trainers, and nutritional support."
            },
            {
                id: 'offer-trial-free',
                title: "Free Trial Session",
                subtitle: "With our elite trainers",
                badge: "Free",
                expiry: "Always available for new members",
                image: "https://images.unsplash.com/photo-1571019623518-8612ca3d5951?q=80&w=1000",
                description: "Try our services before subscribing. Get a full physical assessment and a 60-minute training session for free."
            },
            {
                id: 'offer-nutrition-30',
                title: "Integrated Nutrition Package",
                subtitle: "Discount up to 30%",
                badge: "Most Requested",
                expiry: "For a limited time",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000",
                description: "Design your nutritional plan with our nutrition experts at an exclusive discount. Meals, supplements, and tips all in one place."
            },
            {
                id: 'offer-store-shipping',
                title: "Free Shipping for Store",
                subtitle: "On all orders above 200 SAR",
                badge: "Exclusive",
                expiry: "Ends soon",
                image: "https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=1000",
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
        subscribeNow: "Add to Cart",
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
                image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800',
                description: 'Learn martial arts and increase your reaction speed and physical strength.',
                stats: { level: 'All Levels', duration: '60 min', intensity: 'High' }
            },
            {
                id: 'karate',
                name: 'Karate',
                image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800',
                description: 'Discipline, focus, and strength. Join karate classes and progress through the belts.',
                stats: { level: 'Beginner - Pro', duration: '90 min', intensity: 'Medium' }
            },
            {
                id: 'taekwondo',
                name: 'Taekwondo',
                image: 'https://images.unsplash.com/photo-1564415051543-cb73a7469003?q=80&w=800',
                description: 'A Korean martial art that focuses primarily on high kicks and fast kicks.',
                stats: { level: 'Kids - Adults', duration: '60 min', intensity: 'High' }
            },
            {
                id: 'kickboxing',
                name: 'Kickboxing',
                image: 'https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800',
                description: 'A powerful mix of boxing and kicks to increase strength and endurance.',
                stats: { level: 'All Levels', duration: '60 min', intensity: 'High' }
            },
            {
                id: 'fitness',
                name: 'Fitness',
                image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800',
                description: 'Comprehensive exercises to improve physical appearance and energy.',
                stats: { level: 'Beginner - Pro', duration: '45 min', intensity: 'Medium' }
            },
            {
                id: 'yoga',
                name: 'Yoga',
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800',
                description: 'Relaxation, flexibility, and complete balance between mind and body.',
                stats: { level: 'All Levels', duration: '60 min', intensity: 'Low' }
            },
            {
                id: 'crossfit',
                name: 'CrossFit',
                image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=800',
                description: 'Challenge your limits with high-intensity strength and endurance exercises.',
                stats: { level: 'Advanced', duration: '45 min', intensity: 'Extreme' }
            },
            {
                id: 'bodybuilding',
                name: 'Bodybuilding',
                image: 'https://images.unsplash.com/photo-1534367507873-d2b7e28c70a2?q=80&w=800',
                description: 'An integrated training plan to build muscles and improve muscle bulk.',
                stats: { level: 'All Levels', duration: '75 min', intensity: 'High' }
            }
        ],
        activateOffer: "Activate Offer Now",
        allOffersData: [
            {
                id: 'offer-annual-50',
                title: "50% Off Yearly Subscription",
                subtitle: "For a very limited time",
                badge: "Special Offer",
                expiry: "Ends March 30",
                image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
                description: "Get a full year subscription at half price. Includes all gyms, trainers, and nutritional support."
            },
            {
                id: 'offer-trial-free',
                title: "Free Trial Session",
                subtitle: "With our elite trainers",
                badge: "Free",
                expiry: "Always available for new members",
                image: "https://images.unsplash.com/photo-1571019623518-8612ca3d5951?q=80&w=1000",
                description: "Try our services before subscribing. Get a full physical assessment and a 60-minute training session for free."
            },
            {
                id: 'offer-nutrition-30',
                title: "Integrated Nutrition Package",
                subtitle: "Discount up to 30%",
                badge: "Most Popular",
                expiry: "Limited time",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000",
                description: "Design your nutritional plan with our experts at an exclusive discount. Meals, supplements, and tips in one place."
            },
            {
                id: 'offer-store-shipping',
                title: "Free Store Shipping",
                subtitle: "On all orders above 200 SAR",
                badge: "Exclusive",
                expiry: "Ending soon",
                image: "https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=1000",
                description: "Don't worry about delivery costs. Shop for the best equipment, supplements, and sportswear with free delivery."
            }
        ],
        boxingContent: {
            title: "Boxing",
            heroImg: "/boxing/لقطة شاشة 2026-03-18 205314.png",
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
            heroImg: "/krate/لقطة شاشة 2026-03-18 205449.png",
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
            heroImg: "/teakwondow/لقطة شاشة 2026-03-18 210644.png",
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
            heroImg: "/offers/لقطة شاشة 2026-03-18 204608.png",
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
            heroImg: "/fitness/لقطة شاشة 2026-03-18 204943.png",
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
        trainingPage: {
            title: "Training & Programs",
            tabs: {
                classes: "My Classes",
                programs: "My Programs"
            },
            freeze: {
                button: "Freeze / Cancel",
                title: "Request Freeze",
                reason: "Freeze Reason",
                startDate: "Start Date",
                endDate: "End Date",
                submit: "Submit Request",
                success: "Freeze request submitted successfully"
            },
            emptyClasses: "No scheduled classes yet",
            emptyPrograms: "No active training programs",
            generating: "Generating your personalized schedule..."
        },
        yogaContent: {
            title: "Yoga",
            heroImg: "/offers/لقطة شاشة 2026-03-18 204847.png",
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
            heroImg: "/offers/لقطة شاشة 2026-03-18 204900.png",
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
            heroImg: "/offers/لقطة شاشة 2026-03-18 204728.png",
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
        trainingPage: {
            title: "Sessions & Training Programs",
            tabs: {
                classes: "My Classes",
                programs: "My Programs"
            },
            freeze: {
                button: "Freeze / Cancel",
                title: "Session Freeze Request",
                reason: "Reason for freezing",
                startDate: "Start Date",
                endDate: "End Date",
                submit: "Submit Request",
                success: "Freeze request sent successfully"
            },
            emptyClasses: "No classes scheduled currently",
            emptyPrograms: "No active training programs",
            generating: "Generating your training schedule..."
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
            title: "Join Now",
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
            title: "Contact Us | Captina - Support for Your Fitness Journey",
            breadcrumbs: {
                home: "Home",
                contact: "Contact Center"
            },
            heroTitle: "We're Here for You - Get in Touch",
            heroDesc: "Have questions about our plans or services? Captina's specialized team is ready to provide support and advice whenever you need it.",
            infoTitle: "Direct Communication Channels",
            infoDesc: "Reach out to our support team for professional and timely responses.",
            items: {
                location: "Headquarters",
                locationVal: "Riyadh, Saudi Arabia",
                phone: "Unified Number",
                email: "Support Email",
                workingHours: "Working Hours",
                workingHoursVal: "Daily: 9:00 AM - 10:00 PM"
            },
            form: {
                title: "Send Your Inquiry Now",
                name: "Full Name",
                phone: "Mobile Number",
                email: "Email Address",
                message: "How can we help you today?",
                placeholder: "Enter your message or inquiry in detail...",
                submit: "Send Message to Management",
                loading: "Sending your message...",
                success: "Message received! We will contact you shortly."
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
    const [goals, setGoals] = useState([]);
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [loadingSubscription, setLoadingSubscription] = useState(true);

    const [user, loadingAuth] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [favoriteTrainers, setFavoriteTrainers] = useState([]);
    const [favoriteSports, setFavoriteSports] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState(null);
    const [inquiries, setInquiries] = useState([]);
    const [loadingInquiries, setLoadingInquiries] = useState(true);

    const getValue = useCallback((obj, field, lang) => {
        if (!obj || !field) return '';
        const languageCode = lang || language || 'ar'; // Default to ar

        // CASE 1: Field is actually an object itself { ar: '...', en: '...' }
        const fieldVal = obj[field];
        if (fieldVal && typeof fieldVal === 'object' && !Array.isArray(fieldVal)) {
            const res = fieldVal[languageCode] || fieldVal['ar'] || fieldVal['en'] || Object.values(fieldVal)[0] || '';
            return typeof res === 'string' ? res : String(res || '');
        }

        // CASE 2: Flat structure with field_ar, field_en
        const field_ar = obj[`${field}_ar`];
        const field_en = obj[`${field}_en`];

        if (languageCode === 'ar' && field_ar) return String(field_ar);
        if (languageCode === 'en' && field_en) return String(field_en);

        // CASE 3: Fallback to string if available, ensuring no nested objects are returned
        return typeof fieldVal === 'string' ? fieldVal : (fieldVal ? String(fieldVal) : '');
    }, [language]);

    // COOKIE HELPERS
    const setCookie = useCallback((name, value, days = 7) => {
        if (typeof document === 'undefined') return;
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }, []);

    const deleteCookie = useCallback((name) => {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }, []);

    const getLoc = useCallback((val) => {
        if (!val) return '';
        if (typeof val === 'object' && !Array.isArray(val)) {
            // Priority: current language, then ar, then en, then first available key
            const result = val[language] || val.ar || val.en || Object.values(val)[0] || '';
            return typeof result === 'string' ? result : String(result || '');
        } else if (Array.isArray(val)) {
            return ''; // Prevent array rendering as child
        }
        return String(val || '');
    }, [language]);

    // Alias for getLoc to support components using getText
    const getText = getLoc;

    const getAr = useCallback((val) => {
        if (!val) return '';
        return typeof val === 'object' && !Array.isArray(val) ? (val.ar || val.en || '') : String(val || '');
    }, []);

    const getEn = useCallback((val) => {
        if (!val) return '';
        return typeof val === 'object' && !Array.isArray(val) ? (val.en || val.ar || '') : String(val || '');
    }, []);

    const getSubscriptionDetails = useCallback((sub) => {
        if (!sub) return null;
        
        const status = sub.status?.toLowerCase() || 'pending';
        const plan = sub.planLabel || '';
        
        let statusLabel = language === 'ar' ? 'قيد المراجعة' : 'Pending';
        let statusColor = 'bg-yellow-500';
        let textColor = 'text-black';
        let barColor = 'bg-yellow-500';
        
        if (status === 'active' || status === 'confirmed') {
            statusLabel = language === 'ar' ? 'نشطة' : 'Active';
            statusColor = 'bg-emerald-500';
            textColor = 'text-white';
            barColor = 'bg-emerald-500';
        } else if (status === 'paused' || status === 'stopped') {
            statusLabel = language === 'ar' ? 'متوقفة' : 'Paused';
            statusColor = 'bg-orange-500';
            textColor = 'text-white';
            barColor = 'bg-orange-500';
        } else if (status === 'expired' || status === 'rejected' || status === 'cancelled') {
            statusLabel = status === 'expired' ? (language === 'ar' ? 'منتهية' : 'Expired') :
                          status === 'rejected' ? (language === 'ar' ? 'مرفوضة' : 'Rejected') :
                          (language === 'ar' ? 'ملغاة' : 'Cancelled');
            statusColor = 'bg-rose-500';
            textColor = 'text-white';
            barColor = 'bg-rose-500';
        }

        // Session logic: 1mo=12, 3mo=36, 6mo=72, 1yr=180
        let totalSessions = sub.totalSessions || 0;
        if (!totalSessions && status !== 'pending') {
            const currentPlan = typeof plan === 'string' ? plan : (plan[language] || plan['ar'] || plan['en'] || '');
            const planClean = currentPlan.toLowerCase();
            if (planClean.includes('3') && (planClean.includes('شهر') || planClean.includes('month'))) {
                totalSessions = 36;
            } else if (planClean.includes('6') && (planClean.includes('شهر') || planClean.includes('month'))) {
                totalSessions = 72;
            } else if ((planClean.includes('12') || planClean.includes('سنة') || planClean.includes('year'))) {
                totalSessions = 180;
            } else if (planClean.includes('شهر') || planClean.includes('month')) {
                totalSessions = 12;
            } else {
                totalSessions = 12; // Default
            }
        }
        
        const displaySessions = status === 'pending' ? 0 : totalSessions;
        const consumedSessions = sub.consumedSessions || 0;
        const remainingSessions = Math.max(0, displaySessions - consumedSessions);

        return {
            statusLabel,
            statusColor,
            textColor,
            barColor,
            totalSessions: displaySessions,
            consumedSessions,
            remainingSessions,
            isActive: status === 'active' || status === 'confirmed',
            isPending: status === 'pending'
        };
    }, [language]);

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
                const savedFavTrainers = localStorage.getItem('captina_fav_trainers');
                const savedFavSports = localStorage.getItem('captina_fav_sports');

                if (savedFavorites) {
                    try {
                        setFavorites(JSON.parse(savedFavorites));
                    } catch (e) {
                        console.error("Error loading favorites:", e);
                    }
                } else {
                    setFavorites([]);
                }

                if (savedFavTrainers) {
                    try {
                        setFavoriteTrainers(JSON.parse(savedFavTrainers));
                    } catch (e) {
                        console.error("Error loading fav trainers:", e);
                    }
                } else {
                    setFavoriteTrainers([]);
                }

                if (savedFavSports) {
                    try {
                        setFavoriteSports(JSON.parse(savedFavSports));
                    } catch (e) {
                        console.error("Error loading fav sports:", e);
                    }
                } else {
                    setFavoriteSports([]);
                }
            }
            
            // Clear auth cookies on logout
            deleteCookie('uid');
            deleteCookie('role');
            return;
        }

        // Set UID cookie immediately on auth state change
        setCookie('uid', user.uid);

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
                if (data.favoriteTrainers) {
                    setFavoriteTrainers(data.favoriteTrainers);
                }
                if (data.favoriteSports) {
                    setFavoriteSports(data.favoriteSports);
                }

                // Sync Role Cookie
                if (data.role) {
                    setCookie('role', data.role);
                } else {
                    deleteCookie('role'); // Ensure it's clean if role missing
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

    const toggleFavorite = useCallback(async (productId) => {
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
    }, [favorites, user]);

    const toggleFavoriteTrainer = useCallback(async (trainerId) => {
        const isFav = favoriteTrainers.includes(trainerId);
        const newFavorites = isFav
            ? favoriteTrainers.filter(id => id !== trainerId)
            : [...favoriteTrainers, trainerId];

        setFavoriteTrainers(newFavorites);

        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    favoriteTrainers: isFav ? arrayRemove(trainerId) : arrayUnion(trainerId)
                });
            } catch (error) {
                console.error("Error updating favorite trainers in Firestore:", error);
            }
        } else {
            if (typeof window !== 'undefined') {
                localStorage.setItem('captina_fav_trainers', JSON.stringify(newFavorites));
            }
        }
    }, [favoriteTrainers, user]);

    const toggleFavoriteSport = useCallback(async (sportId) => {
        const isFav = favoriteSports.includes(sportId);
        const newFavorites = isFav
            ? favoriteSports.filter(id => id !== sportId)
            : [...favoriteSports, sportId];

        setFavoriteSports(newFavorites);

        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    favoriteSports: isFav ? arrayRemove(sportId) : arrayUnion(sportId)
                });
            } catch (error) {
                console.error("Error updating favorite sports in Firestore:", error);
            }
        } else {
            if (typeof window !== 'undefined') {
                localStorage.setItem('captina_fav_sports', JSON.stringify(newFavorites));
            }
        }
    }, [favoriteSports, user]);

    const [loadingGyms, setLoadingGyms] = useState(true);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [loadingTrainers, setLoadingTrainers] = useState(true);
    const [loadingSports, setLoadingSports] = useState(true);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [loadingGoals, setLoadingGoals] = useState(true);
    const [appContent, setAppContent] = useState({});
    const [loadingAppContent, setLoadingAppContent] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('lang') || 'ar';
            const savedTheme = localStorage.getItem('theme') === 'true';
            setLanguage(savedLang);
            setDarkMode(savedTheme);
        }
    }, []);

    useEffect(() => {
        let unsubs = [];

        const fetchGyms = () => onSnapshot(collection(db, "gyms"), async (querySnapshot) => {
            try {
                if (querySnapshot.empty) {
                    const initialGyms = [
                        { name_ar: "فرع المونسية", name_en: "Al-Monsiya Branch", type: 'Internal', rating: '4.9', image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800", "https://images.unsplash.com/photo-1574673139641-87b1d3d609a7?q=80&w=800"], location_ar: "الرياض، حي المونسية، طريق الثمامة", location_en: "Riyadh, Al-Monsiya, Thumama Road", location_link: "https://goo.gl/maps/example1", phone: "+966 50 123 4567", social: { instagram: "captina_monsia", twitter: "@captina_monsia" }, sports_ar: ["ملاكمة", "كاراتيه", "كروس فت", "بناء أجسام"], sports_en: ["Boxing", "Karate", "CrossFit", "Bodybuilding"], halls: 5, trainers: 12 },
                        { name_ar: "فرع الياسمين", name_en: "Al-Yasmin Branch", type: 'Internal', rating: '4.8', image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800", images: ["https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800"], location_ar: "الرياض، حي الياسمين، طريق الملك عبدالعزيز", location_en: "Riyadh, Al-Yasmin, King Abdulaziz Road", location_link: "https://goo.gl/maps/example2", phone: "+966 50 987 6543", social: { instagram: "captina_yasmin", twitter: "@captina_yasmin" }, sports_ar: ["ملاكمة", "كروس فت", "لياقة بدنية"], sports_en: ["Boxing", "CrossFit", "Fitness"], halls: 3, trainers: 8 },
                        { name_ar: "جولدز جيم", name_en: "Gold's Gym", type: 'Partner', rating: '4.9', image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", trainers: 25 },
                        { name_ar: "فيتنس فيرست", name_en: "Fitness First", type: 'Partner', rating: '4.8', image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800", trainers: 30 },
                        { name_ar: "أكاديمية تيتان", name_en: "Titan Academy", type: 'Partner', rating: '4.9', image: "https://images.unsplash.com/photo-1574673139641-87b1d3d609a7?q=80&w=800", trainers: 15 },
                        { name_ar: "ذا كيج", name_en: "The Cage", type: 'Partner', rating: '4.7', image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800", trainers: 10 }
                    ];
                    for (const gym of initialGyms) await addDoc(collection(db, "gyms"), gym);
                } else {
                    setGyms(querySnapshot.docs.map(doc => {
                        const d = doc.data();
                        
                        // Handle sports properly as an array
                        let sportsArray = [];
                        if (Array.isArray(d.sports)) {
                            sportsArray = d.sports;
                        } else if (d.sports && typeof d.sports === 'object') {
                            sportsArray = d.sports[language] || d.sports['ar'] || d.sports['en'] || [];
                        } else {
                            sportsArray = (language === 'ar' ? (d.sports_ar || []) : (d.sports_en || [])) || d.sports_ar || d.sports_en || [];
                        }

                        return {
                            id: doc.id, 
                            ...d,
                            name: getValue(d, 'name', language),
                            location: getValue(d, 'location', language) || getValue(d, 'address', language),
                            sports: sportsArray,
                            image: getValue(d, 'image', language)
                        };
                    }));
                }
            } catch (error) { console.error("Error gyms:", error); } finally { setLoadingGyms(false); }
        });
        unsubs.push(fetchGyms());

        const fetchPackages = () => onSnapshot(query(collection(db, "packages"), orderBy("order", "asc")), async (querySnapshot) => {
            try {
                if (querySnapshot.empty) {
                    const initialPackages = [
                        {
                            order: 1,
                            name_ar: "باقة شهر",
                            name_en: "1 Month Pro",
                            price: "1200",
                            currency_ar: "ر.س",
                            currency_en: "SAR",
                            desc_ar: "باقة تدريب شخصي لمدة شهر كامل - الأنسب للمبتدئين",
                            desc_en: "One month personal training - Best for beginners",
                            features_ar: ["12 حصة تدريبية", "برنامج غذائي مخصص", "متابعة يومية عبر الواتساب", "تقييم لياقة شهري"],
                            features_en: ["12 Training Sessions", "Custom Nutrition Plan", "Daily WhatsApp Follow-up", "Monthly Fitness Assessment"],
                            duration_ar: "1 شهر - 3 حصص/أسبوع",
                            duration_en: "1 Month - 3 Sessions/Week",
                            badge_ar: "الأكثر طلباً",
                            badge_en: "Most Popular",
                            featured: true,
                            months: 1,
                            sport: "general",
                            icon: "dumbbell"
                        },
                        {
                            order: 2,
                            name_ar: "باقة 3 أشهر",
                            name_en: "3 Months Elite",
                            price: "3000",
                            oldPrice: "3600",
                            discount: 17,
                            currency_ar: "ر.س",
                            currency_en: "SAR",
                            desc_ar: "اللياقة الأكثر شعبية - نتائج مضمونة مع تدريب مكثف",
                            desc_en: "Most popular fitness - Guaranteed results with intensive training",
                            features_ar: ["36 حصة تدريبية", "برنامج غذائي متكامل", "متابعة يومية", "تقييم لياقة دوري", "خصم 17%"],
                            features_en: ["36 Training Sessions", "Full Nutrition Program", "Daily Follow-up", "Periodic Assessment", "17% Discount"],
                            duration_ar: "3 أشهر - 3 حصص/أسبوع",
                            duration_en: "3 Months - 3 Sessions/Week",
                            featured: false,
                            months: 3,
                            sport: "general",
                            icon: "dumbbell"
                        },
                        {
                            order: 3,
                            name_ar: "باقة 6 أشهر",
                            name_en: "6 Months Ultimate",
                            price: "5400",
                            oldPrice: "7200",
                            discount: 25,
                            currency_ar: "ر.س",
                            currency_en: "SAR",
                            desc_ar: "تحول كامل في اللياقة - أفضل قيمة مع أكبر خصم",
                            desc_en: "Complete fitness transformation - Best value with biggest discount",
                            features_ar: ["72 حصة تدريبية", "برنامج غذائي متكامل", "متابعة يومية", "تقييم لياقة شهري", "أولوية اختيار المدرب", "خصم 25%"],
                            features_en: ["72 Training Sessions", "Full Nutrition Program", "Daily Follow-up", "Monthly Assessment", "Priority Trainer Choice", "25% Discount"],
                            duration_ar: "6 أشهر - 3 حصص/أسبوع",
                            duration_en: "6 Months - 3 Sessions/Week",
                            featured: false,
                            months: 6,
                            sport: "general",
                            icon: "dumbbell"
                        }
                    ];
                    for (const pkg of initialPackages) await addDoc(collection(db, "packages"), pkg);
                } else {
                    setPackages(querySnapshot.docs.map(doc => {
                        const d = doc.data();
                        return {
                            id: doc.id,
                            ...d,
                            name: getValue(d, 'name', language),
                            price: language === 'ar' ? d.price : (d.price_en || d.price),
                            currency: getValue(d, 'currency', language),
                            duration: getValue(d, 'duration', language),
                            description: getValue(d, 'description', language) || getValue(d, 'desc', language),
                            features: getValue(d, 'features', language),
                            badge: getValue(d, 'badge', language)
                        };
                    }).sort((a, b) => (a.months || 0) - (b.months || 0)));
                }
            } catch (error) { console.error("Error packages:", error); } finally { setLoadingPackages(false); }
        });
        unsubs.push(fetchPackages());

        const fetchTrainers = () => onSnapshot(collection(db, "trainers"), async (querySnapshot) => {
            try {
                if (querySnapshot.empty) {
                    const initialTrainers = [
                        { name_ar: "كابتن أحمد", name_en: "Captain Ahmed", specialty_ar: "خسارة الوزن وتحديد العضلات", specialty_en: "Weight loss and muscle definition", exp_ar: "12 سنة", exp_en: "12 Years", rating: 4.9, image: "https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=400" },
                        { name_ar: "كابتن سارة", name_en: "Captain Sara", specialty_ar: "لياقة بدنية مرونة (يوغا)", specialty_en: "Fitness and Yoga flexibility", exp_ar: "8 سنوات", exp_en: "8 Years", rating: 4.8, image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400" },
                        { name_ar: "كابتن محمد", name_en: "Captain Mohamed", specialty_ar: "بناء أجسام وتضخيم", specialty_en: "Bodybuilding and bulking", exp_ar: "15 سنة", exp_en: "15 Years", rating: 5.0, image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=400" },
                        { name_ar: "كابتن خالد", name_en: "Captain Khaled", specialty_ar: "رفع أثقال وقوة بدنية", specialty_en: "Powerlifting and strength", exp_ar: "10 سنوات", exp_en: "10 Years", rating: 4.7, image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400" }
                    ];
                    for (const trainer of initialTrainers) await addDoc(collection(db, "trainers"), trainer);
                } else {
                    setTrainers(querySnapshot.docs.map(doc => {
                        const d = doc.data();
                        return {
                            id: doc.id, ...d,
                            name: getValue(d, 'name', language),
                            specialty: getValue(d, 'specialty', language),
                            exp: getValue(d, 'exp', language),
                            image: getValue(d, 'image', language)
                        };
                    }));
                }
            } catch (e) { console.error("Error trainers:", e); } finally { setLoadingTrainers(false); }
        });
        unsubs.push(fetchTrainers());

        const fetchSports = () => onSnapshot(collection(db, "sports"), async (querySnapshot) => {
            try {
                if (querySnapshot.empty) {
                    const initialSports = [
                        { slug: 'boxing', name_ar: "الملاكمة", name_en: "Boxing", desc_ar: "تعلم فنون الدفاع عن النفس وزد من سرعة رد فعلك وقوتك البدنية.", desc_en: "Learn martial arts and increase your reaction speed and physical strength.", level_ar: "كافة المستويات", level_en: "All Levels", duration_ar: "60 دقيقة", duration_en: "60 Min", intensity_ar: "عالية", intensity_en: "High", image: "https://images.unsplash.com/photo-1549719386-74dfcbf75ed2?q=80&w=800" },
                        { slug: 'karate', name_ar: "الكاراتيه", name_en: "Karate", desc_ar: "الانضباط والتركيز والقوة. انضم لدروس الكاراتيه وتدرج في الأحزمة.", desc_en: "Discipline, focus and strength. Join Karate classes and progress through belts.", level_ar: "مبتدئ - محترف", level_en: "Beg - Pro", duration_ar: "90 دقيقة", duration_en: "90 Min", intensity_ar: "متوسطة", intensity_en: "Medium", image: "https://images.unsplash.com/photo-1552072092-2f9b111e0dc1?q=80&w=800" },
                        { slug: 'taekwondo', name_ar: "تايكوندو", name_en: "Taekwondo", desc_ar: "فن قتالي كوري يركز على الركلات العالية والسريعة والتركيز العالي.", desc_en: "A Korean martial art focusing on high kicks, speed and high concentration.", level_ar: "أطفال - كبار", level_en: "Kids - Adults", duration_ar: "60 دقيقة", duration_en: "60 Min", intensity_ar: "عالية", intensity_en: "High", image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800" },
                        { slug: 'kickboxing', name_ar: "كيك بوكسينغ", name_en: "Kickboxing", desc_ar: "مزيج قوي بين الملاكمة والركلات لزيادة القوة والتحمل.", desc_en: "A powerful mix of boxing and kicks to increase strength and endurance.", level_ar: "كافة المستويات", level_en: "All Levels", duration_ar: "60 دقيقة", duration_en: "60 Min", intensity_ar: "عالية", intensity_en: "High", image: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800" },
                        { slug: 'fitness', name_ar: "لياقة بدنية", name_en: "Fitness", desc_ar: "تمارين شاملة لتحسين المظهر اللائق وزيادة الطاقة اليومية.", desc_en: "Comprehensive exercises to improve physical appearance and energy.", level_ar: "مبتدئ - متقدم", level_en: "Beg - Pro", duration_ar: "45 دقيقة", duration_en: "45 Min", intensity_ar: "متوسطة", intensity_en: "Medium", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800" },
                        { slug: 'yoga', name_ar: "يوغا", name_en: "Yoga", desc_ar: "استرخاء ومرونة وتوازن تام بين العقل والجسد.", desc_en: "Relaxation, flexibility and complete balance between mind and body.", level_ar: "كافة المستويات", level_en: "All Levels", duration_ar: "60 دقيقة", duration_en: "60 Min", intensity_ar: "خفيفة", intensity_en: "Low", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800" },
                        { slug: 'crossfit', name_ar: "كروس فت", name_en: "CrossFit", desc_ar: "تحدَّ حدودك مع تمارين القوة والتحمل عالية الكثافة.", desc_en: "Challenge your limits with high-intensity strength and endurance exercises.", level_ar: "متقدم", level_en: "Advanced", duration_ar: "45 دقيقة", duration_en: "45 Min", intensity_ar: "قصوى", intensity_en: "Extreme", image: "https://images.unsplash.com/photo-1541534741688-6078c64b5cc5?q=80&w=800" },
                        { slug: 'bodybuilding', name_ar: "بناء الأجسام", name_en: "Bodybuilding", desc_ar: "خطة تدريبية متكاملة لبناء العضلات وتحسين الضخامة العضلية.", desc_en: "Integrated training plan to build muscles and improve muscle bulk.", level_ar: "كافة المستويات", level_en: "All Levels", duration_ar: "75 دقيقة", duration_en: "75 Min", intensity_ar: "عالية", intensity_en: "High", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800" }
                    ];
                    for (const sport of initialSports) await addDoc(collection(db, "sports"), sport);
                } else {
                    setSports(querySnapshot.docs.map(doc => {
                        const s = doc.data();
                        const sportId = s.slug || doc.id;
                        return {
                            id: sportId,
                            ...s,
                            name: getValue(s, 'name', language),
                            image: getSportImage(sportId, s.image || s.heroBanner || s.heroImg, language),
                            description: getValue(s, 'description', language) || getValue(s, 'desc', language),
                            stats: {
                                level: getValue(s, 'level', language) || (language === 'ar' ? 'كافة المستويات' : 'All Levels'),
                                duration: getValue(s, 'duration', language) || (language === 'ar' ? '60 دقيقة' : '60 Min'),
                                intensity: getValue(s, 'intensity', language) || (language === 'ar' ? 'عالية' : 'High')
                            }
                        };
                    }));
                }
            } catch (e) { console.error("Error sports:", e); } finally { setLoadingSports(false); }
        });
        unsubs.push(fetchSports());

        const fetchOffers = () => onSnapshot(query(collection(db, "offers"), orderBy("createdAt", "desc")), async (querySnapshot) => {
            try {
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
                            title: getValue(o, 'title', language),
                            subtitle: getValue(o, 'sub', language) || getValue(o, 'subtitle', language) || (o.discountAmount ? `${o.discountAmount}%` : ''),
                            badge: getValue(o, 'badge', language) || (o.discountAmount ? (language === 'ar' ? 'عرض خاص' : 'Special Offer') : ''),
                            expiry: getValue(o, 'expiry', language) || (o.validUntil ? (language === 'ar' ? `صالح حتى ${new Date(o.validUntil).toLocaleDateString('ar-SA')}` : `Valid until ${new Date(o.validUntil).toLocaleDateString()}`) : ''),
                            description: getValue(o, 'description', language) || getValue(o, 'desc', language),
                            image: getValue(o, 'image', language)
                        };
                    }));
                }
            } catch (e) { console.error("Error offers:", e); } finally { setLoadingOffers(false); }
        });
        unsubs.push(fetchOffers());

        const fetchProducts = () => onSnapshot(collection(db, "products"), async (querySnapshot) => {
            try {
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
                            name: getValue(p, 'name', language),
                            category: getValue(p, 'category', language),
                            description: getValue(p, 'description', language) || getValue(p, 'desc', language),
                            image: getValue(p, 'image', language)
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
        });
        unsubs.push(fetchProducts());

        const fetchTasks = () => onSnapshot(collection(db, "tasks"), async (querySnapshot) => {
            try {
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
        });
        unsubs.push(fetchTasks());

        const fetchGoals = () => onSnapshot(collection(db, "goals"), async (snapshot) => {
            try {
                if (snapshot.empty) {
                    const initialGoals = [
                        { percentage: 85, text_ar: 'أداء مذهل!', text_en: 'Amazing performance!', sub_ar: 'أكملت 12 حصة من أصل 14.', sub_en: '12 out of 14 sessions done.', sport: 'general' },
                        { percentage: 40, text_ar: 'واصل التقدم!', text_en: 'Keep going!', sub_ar: 'أكملت 2 من أصل 5 تمارين ملاكمة.', sub_en: '2 out of 5 boxing sessions done.', sport: 'boxing' },
                        { percentage: 65, text_ar: 'احسنت التحرك!', text_en: 'Great movement!', sub_ar: 'أتقنت 3 ركلات جديدة في التايكوندو.', sub_en: 'Mastered 3 new Taekwondo kicks.', sport: 'taekwondo' },
                        { percentage: 20, text_ar: 'البداية قوية!', text_en: 'Strong start!', sub_ar: 'أول أسبوع لك في الكاراتيه اكتمل.', sub_en: 'Your first Karate week complete.', sport: 'karate' }
                    ];
                    for (const g of initialGoals) await addDoc(collection(db, "goals"), g);
                } else {
                    setGoals(snapshot.docs.map(doc => {
                        const g = doc.data();
                        return { id: doc.id, ...g, text: getValue(g, 'text', language), sub: getValue(g, 'sub', language) };
                    }));
                }
            } catch (e) { console.error("Error goals:", e); } finally { setLoadingGoals(false); }
        });
        unsubs.push(fetchGoals());

        const fetchActiveSubscription = () => {
            if (!user) return;
            const subsRef = collection(db, "subscriptions");
            const q = query(
                subsRef,
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc"),
                limit(1)
            );
            return onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    setActiveSubscription({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
                } else {
                    setActiveSubscription(null);
                }
                setLoadingSubscription(false);
            });
        };
        if (user) unsubs.push(fetchActiveSubscription());

        return () => {
            unsubs.forEach(unsub => {
                if (typeof unsub === 'function') unsub();
            });
        };
    }, [language, user]);

    useEffect(() => {
        const contactRef = doc(db, "settings", "contact_info");
        const unsubscribe = onSnapshot(contactRef, (docSnap) => {
            if (docSnap.exists()) {
                setContactInfo(docSnap.data());
            } else {
                const defaultInfo = {
                    phone: '0551447768',
                    email: 'support@captina.sa',
                    address_ar: 'الرياض، حي المونسية',
                    address_en: 'Riyadh, Al Munsiyah',
                    workingHours_ar: 'يومياً: 9:00 صباحاً - 10:00 مساءً',
                    workingHours_en: 'Daily: 9:00 AM - 10:00 PM',
                    location: { lat: 24.8149, lng: 46.7909 }
                };
                setContactInfo(defaultInfo);
                setDoc(contactRef, defaultInfo).catch(err => console.error("Error creating contact info:", err));
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userData || userData.role !== 'admin') {
            setLoadingInquiries(false);
            return;
        }
        const q = query(collection(db, "contact_inquiries"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoadingInquiries(false);
        }, (error) => {
            console.error("Error listening to inquiries:", error);
            setLoadingInquiries(false);
        });
        return () => unsubscribe();
    }, [userData]);

    const updateContactInfo = async (newInfo) => {
        try {
            const contactRef = doc(db, "settings", "contact_info");
            await updateDoc(contactRef, newInfo);
            return { success: true };
        } catch (error) {
            console.error("Error updating contact info:", error);
            return { success: false, error };
        }
    };

    const submitInquiry = async (formData) => {
        try {
            await addDoc(collection(db, "contact_inquiries"), {
                ...formData,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            return { success: false, error };
        }
    };

    const deleteInquiry = async (id) => {
        try {
            await updateDoc(doc(db, "contact_inquiries", id), { deleted: true });
            return { success: true };
        } catch (error) {
            console.error("Error deleting inquiry:", error);
            return { success: false };
        }
    };

    const updateInquiryStatus = async (id, status) => {
        try {
            await updateDoc(doc(db, "contact_inquiries", id), { status });
            return { success: true };
        } catch (error) {
            console.error("Error updating inquiry status:", error);
            return { success: false };
        }
    };

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "app_content"), (snap) => {
            const data = {};
            snap.forEach(doc => {
                data[doc.id] = doc.data();
            });
            setAppContent(data);
            setLoadingAppContent(false);
        });
        return () => unsub();
    }, []);

    const initializeAppData = useCallback(async () => {
        try {
            const snap = await getDocs(collection(db, "app_content"));
            if (snap.empty) {
                await setDoc(doc(db, "app_content", "onboarding"), {
                    slides: [
                        {
                            title_ar: 'رحلتك الرياضية تبدأ هنا',
                            title_en: 'Your Fitness Journey Starts Here',
                            desc_ar: 'استكشف عالم الرياضة مع مدربين معتمدين وتدريبات مخصصة تناسب أهدافك.',
                            desc_en: 'Explore the world of sports with certified trainers and customized workouts that fit your goals.',
                            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000',
                            icon: 'Sparkles',
                            accent: '#E51B24'
                        },
                        {
                            title_ar: 'مدربون محترفون ونخبة',
                            title_en: 'Elite Professional Trainers',
                            desc_ar: 'تدرب مع الأفضل في مجالات الملاكمة، فنون القتال، واللياقة البدنية أينما كنت.',
                            desc_en: 'Train with the best in boxing, martial arts, and fitness wherever you are.',
                            image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400',
                            icon: 'Target',
                            accent: '#E51B24'
                        },
                        {
                            title_ar: 'مجتمع متكامل وآمن',
                            title_en: 'Integrated & Safe Community',
                            desc_ar: 'انضم إلى مجتمع كابتينا، تابع تقدمك، واحجز حصصك بسهولة تامة.',
                            desc_en: 'Join the Captina community, track your progress, and book your classes with total ease.',
                            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
                            icon: 'ShieldCheck',
                            accent: '#E51B24'
                        }
                    ]
                });
                await setDoc(doc(db, "app_content", "profile_defaults"), {
                    defaultAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
                    defaultCover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200"
                });
                await setDoc(doc(db, "app_content", "branding"), {
                    logo: "/logo_captina.jpg",
                    name: "Captina"
                });
            }
        } catch (error) { console.error("Error init app data:", error); }
    }, []);

    useEffect(() => {
        initializeAppData();
    }, []);

    // CART LOGIC
    const [cart, setCart] = useState([]);

    const saveCart = useCallback((newCart) => {
        setCart(newCart);
        localStorage.setItem('captina_cart', JSON.stringify(newCart));
    }, []);

    useEffect(() => {
        const savedCart = localStorage.getItem('captina_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) { console.error("Error loading cart:", e); }
        }
    }, []);

    const updateCartItemMetadata = useCallback((cartId, metadata) => {
        const newCart = cart.map(item => {
            if (item.cartId === cartId) {
                return { ...item, metadata: { ...item.metadata, ...metadata } };
            }
            return item;
        });
        saveCart(newCart);
    }, [cart, saveCart]);

    const addToCart = useCallback((product, selection = {}) => {
        const isSubscription = selection.type === 'subscription';
        const cartId = selection.cartId || (isSubscription
            ? `sub-${product.id}`
            : `${product.id}-${selection.size || 'default'}-${selection.color?.code || 'default'}`);

        const existingItemIndex = cart.findIndex(item => item.cartId === cartId);

        if (existingItemIndex > -1 && !isSubscription) {
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += selection.quantity || 1;
            saveCart(newCart);
        } else {
            const newItem = {
                cartId,
                productId: product.id,
                name: selection.name || product.name,
                image: selection.image || product.image || "/logo_captina.jpg",
                price: parseFloat(selection.price || product.price) || 0,
                size: selection.size,
                color: selection.color,
                quantity: selection.quantity || 1,
                type: selection.type || 'product',
                metadata: selection.metadata || {}
            };

            if (existingItemIndex > -1) {
                // If subscription exists, overwrite it (don't duplicate)
                const newCart = [...cart];
                newCart[existingItemIndex] = newItem;
                saveCart(newCart);
            } else {
                saveCart([...cart, newItem]);
            }
        }
    }, [cart, saveCart]);

    const removeFromCart = useCallback((cartId) => {
        saveCart(cart.filter(item => item.cartId !== cartId));
    }, [cart, saveCart]);

    const updateCartQuantity = useCallback((cartId, delta) => {
        const newCart = cart.map(item => {
            if (item.cartId === cartId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0);
        saveCart(newCart);
    }, [cart, saveCart]);

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const changeLanguage = useCallback((newLang) => {
        setLanguage(newLang);
        localStorage.setItem('lang', newLang);
    }, []);

    const toggleLanguage = useCallback(() => {
        changeLanguage(language === 'ar' ? 'en' : 'ar');
    }, [language, changeLanguage]);

    const changeDarkMode = useCallback((newMode) => {
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode);
    }, []);

    const toggleDarkMode = useCallback(() => {
        changeDarkMode(!darkMode);
    }, [darkMode, changeDarkMode]);

    const t = useCallback((key) => {
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

        // Apply fallback for sport content objects (heroImg)
        if (key.endsWith('Content') && value && typeof value === 'object' && value.heroImg) {
            const sportId = key.replace('Content', '').toLowerCase();
            if (value.heroImg.includes('unsplash.com')) {
                value.heroImg = getSportImage(sportId, value.heroImg);
            }
        }

        return value;
    }, [language, gyms, packages, trainers, sports, offers, products, categories, tasks, goals]);

    const appContextValue = useMemo(() => ({
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
        appContent,
        loadingAppContent,
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
        favoriteTrainers,
        toggleFavoriteTrainer,
        favoriteSports,
        toggleFavoriteSport,
        loadingAuth,
        isCartOpen,
        setIsCartOpen,
        initializeAppData,
        updateCartItemMetadata,
        activeSubscription,
        loadingSubscription,
        contactInfo,
        inquiries,
        loadingInquiries,
        updateContactInfo,
        submitInquiry,
        deleteInquiry,
        updateInquiryStatus,
        getValue,
        getLoc,
        getText,
        getAr,
        getEn,
        getSubscriptionDetails
    }), [
        language, changeLanguage, toggleLanguage, darkMode, changeDarkMode, toggleDarkMode, t,
        gyms, packages, trainers, sports, offers, products, categories, tasks, goals,
        loadingGyms, loadingPackages, loadingTrainers, loadingSports, loadingOffers,
        loadingProducts, loadingTasks, loadingGoals, appContent, loadingAppContent,
        alert, setAlert, cart, addToCart, removeFromCart, updateCartQuantity,
        cartTotal, cartCount, user, userData, favorites, toggleFavorite,
        favoriteTrainers, toggleFavoriteTrainer, favoriteSports, toggleFavoriteSport,
        loadingAuth, isCartOpen, setIsCartOpen, initializeAppData, updateCartItemMetadata,
        activeSubscription, loadingSubscription, contactInfo, inquiries, loadingInquiries,
        updateContactInfo, submitInquiry, deleteInquiry, updateInquiryStatus,
        getValue, getLoc, getText, getAr, getEn, getSubscriptionDetails
    ]);

    return (
        <AppContext.Provider value={appContextValue}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
