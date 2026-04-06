export const initialPackages = [
    {
        id: "package-elite-tkd",
        name_ar: "باقة النخبة (التايكوندو)",
        name_en: "Elite Taekwondo Package",
        description_ar: "تدريب مكثف يشمل 12 حصة شهرياً مع تركيز على القتال والمهارات الأساسية.",
        description_en: "Intensive training including 12 sessions per month with a focus on combat and basic skills.",
        price: 500,
        gymId: "gym-1",
        trainerId: "trainer-1",
        sportId: "taekwondo",
        months: 1,
        sessionsPerWeek: 3,
        totalSessions: 12,
        duration_ar: "شهري",
        duration_en: "Monthly",
        features_ar: ["12 حصة تدريبية", "تقييم أسبوعي", "دخول المرافق الرياضية"],
        features_en: ["12 Training sessions", "Weekly evaluation", "Gym facility access"],
        isTrial: false
    },
    {
        id: "package-beginner-boxing",
        name_ar: "باقة الملاكمة للمبتدئين",
        name_en: "Beginner Boxing Package",
        description_ar: "تعلم أساسيات الملاكمة مع 8 حصص شهرياً في بيئة احترافية.",
        description_en: "Learn the basics of boxing with 8 sessions per month in a professional environment.",
        price: 350,
        gymId: "gym-2",
        trainerId: "trainer-2",
        sportId: "boxing",
        months: 1,
        sessionsPerWeek: 2,
        totalSessions: 8,
        duration_ar: "شهري",
        duration_en: "Monthly",
        features_ar: ["8 حصص تدريبية", "معدات أساسية مجانية", "خطة غذائية أولية"],
        features_en: ["8 Training sessions", "Free basic gear", "Initial diet plan"],
        isTrial: false
    },
    {
        id: "package-trial-karate",
        name_ar: "حصتين كاراتيه (تجريبي)",
        name_en: "2 Karate Sessions (Trial)",
        description_ar: "جرب فن الكاراتيه مع حصتين تمهيديتين لاكتشاف مهاراتك.",
        description_en: "Try the art of Karate with two introductory sessions to discover your skills.",
        price: 50,
        gymId: "gym-1",
        trainerId: "trainer-3",
        sportId: "karate",
        months: 0,
        sessionsPerWeek: 2,
        totalSessions: 2,
        duration_ar: "أسبوعي",
        duration_en: "Weekly",
        features_ar: ["حصتين تدريبيتين", "بدون التزام طويل", "يوم تجريبي مفتوح"],
        features_en: ["2 Training sessions", "No long commitment", "Open trial day"],
        isTrial: true
    },
    {
        id: "package-full-fitness",
        name_ar: "باقة اللياقة البدنية الكاملة",
        name_en: "Full Fitness Package",
        description_ar: "تدريب شامل يدمج بين الكارديو وتمارين القوة 15 حصة في الشهر.",
        description_en: "Comprehensive training combining cardio and strength exercises, 15 sessions per month.",
        price: 450,
        gymId: "gym-3",
        trainerId: "trainer-4",
        sportId: "general",
        months: 1,
        sessionsPerWeek: 4,
        totalSessions: 15,
        duration_ar: "شهري",
        duration_en: "Monthly",
        features_ar: ["15 حصة متنوعة", "قياس كتلة الجسم شهرياً", "متابعة مع أخصائي تغذية"],
        features_en: ["15 Diverse sessions", "Monthly BMI measurement", "Follow-up with a nutritionist"],
        isTrial: false
    },
    {
        id: "package-quarterly-tkd",
        name_ar: "باقة 3 أشهر تايكوندو",
        name_en: "3-Month Taekwondo Package",
        description_ar: "برنامج تدريبي مكثف لمدة 3 أشهر مع 3 حصص أسبوعياً لتطوير المستوى.",
        description_en: "Intensive 3-month training program with 3 sessions per week to improve your level.",
        price: 1350,
        gymId: "gym-1",
        trainerId: "trainer-1",
        sportId: "taekwondo",
        months: 3,
        sessionsPerWeek: 3,
        totalSessions: 36,
        duration_ar: "3 أشهر",
        duration_en: "3 Months",
        features_ar: ["36 حصة تدريبية", "تقييم شهري", "دخول المرافق الرياضية", "خطة تدريبية متقدمة"],
        features_en: ["36 Training sessions", "Monthly evaluation", "Gym access", "Advanced training plan"],
        isTrial: false
    },
    {
        id: "package-semi-annual",
        name_ar: "باقة 6 أشهر (نصف سنوية)",
        name_en: "6-Month Semi-Annual Package",
        description_ar: "برنامج شامل لمدة 6 أشهر مع 3 حصص أسبوعياً ومتابعة مستمرة.",
        description_en: "Comprehensive 6-month program with 3 sessions per week and continuous follow-up.",
        price: 2400,
        gymId: "gym-1",
        trainerId: "trainer-1",
        sportId: "general",
        months: 6,
        sessionsPerWeek: 3,
        totalSessions: 72,
        duration_ar: "6 أشهر",
        duration_en: "6 Months",
        features_ar: ["72 حصة تدريبية", "تقييم كل شهرين", "دخول غير محدود للمرافق", "برنامج تغذية شامل"],
        features_en: ["72 Training sessions", "Bi-monthly evaluation", "Unlimited facility access", "Full nutrition program"],
        isTrial: false
    },
    {
        id: "package-annual",
        name_ar: "الباقة السنوية المميزة",
        name_en: "Annual Premium Package",
        description_ar: "الاشتراك السنوي الأفضل قيمة مع 3 حصص أسبوعياً ومزايا حصرية طوال العام.",
        description_en: "Best value annual subscription with 3 sessions per week and exclusive benefits year-round.",
        price: 4000,
        gymId: "gym-1",
        trainerId: "trainer-1",
        sportId: "general",
        months: 12,
        sessionsPerWeek: 3,
        totalSessions: 144,
        duration_ar: "سنوي",
        duration_en: "Annual",
        features_ar: ["144 حصة تدريبية", "تقييم ربع سنوي", "دخول VIP للمرافق", "برنامج تغذية + لياقة", "أولوية الحجز"],
        features_en: ["144 Training sessions", "Quarterly evaluation", "VIP facility access", "Nutrition + fitness program", "Priority booking"],
        isTrial: false
    }
];

export const initialOffers = [
    {
        id: "offer-ramadan-2025",
        title_ar: "عرض رمضان المبارك",
        title_en: "Ramadan Offer 2025",
        desc_ar: "خصم 50% على جميع الباقات السنوية بمناسبة الشهر الفضيل.",
        desc_en: "50% discount on all annual packages for the holy month.",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000",
        discount: 50,
        type: "percentage",
        expiryDate: "2025-04-30",
        isActive: true
    },
    {
        id: "offer-first-trial",
        title_ar: "حصتك الأولى مجانية",
        title_en: "Your First Session for Free",
        desc_ar: "سجل الآن واحصل على حصة تدريبية مجانية في أي رياضة تختارها.",
        desc_en: "Register now and get a free training session in any sport you choose.",
        image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000",
        discount: 100,
        type: "free",
        isActive: true,
        isTrial: true
    }
];

export const initialGyms = [
    {
        id: "gym-1",
        name_ar: "اكاديمية النخبة الرياضية",
        name_en: "Elite Sports Academy",
        description_ar: "أكبر صالة مجهزة للفنون القتالية في الرياض.",
        description_en: "The largest equipped martial arts hall in Riyadh.",
        location_ar: "الرياض - حي الياسمين",
        location_en: "Riyadh - Alyasmeen District",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400",
        rating: 4.8,
        features_ar: ["تكييف مركزي", "غرف تبديل", "مواقف مجانية"],
        features_en: ["Central AC", "Changing rooms", "Free parking"],
        coordinates: { lat: 24.8149, lng: 46.7909 }
    },
    {
        id: "gym-2",
        name_ar: "نادي قبضات القوة",
        name_en: "Power Fists Club",
        description_ar: "نادي متخصص في الملاكمة والقفز بالحبل.",
        description_en: "A club specialized in boxing and jump rope.",
        location_ar: "الرياض - حي الصحافة",
        location_en: "Riyadh - Alsahafa District",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400",
        rating: 4.9,
        features_ar: ["حلقة ملاكمة دولية", "أدوات احترافية", "مدربين دوليين"],
        features_en: ["International boxing ring", "Professional tools", "International trainers"],
        coordinates: { lat: 24.7949, lng: 46.7709 }
    },
    {
        id: "gym-3",
        name_ar: "مركز اللياقة المتكامل",
        name_en: "Integrated Fitness Center",
        description_ar: "مركز عائلي يقدم خدمات رياضية منوعة لجميع الأعمار.",
        description_en: "A family center offering various sports services for all ages.",
        location_ar: "الرياض - حي الملك فهد",
        location_en: "Riyadh - King Fahd District",
        image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400",
        rating: 4.7,
        features_ar: ["مسبح أولمبي", "قسم خاص للسيدات", "منطقة أطفال"],
        features_en: ["Olympic pool", "Ladies' section", "Kids' zone"],
        coordinates: { lat: 24.7149, lng: 46.6909 }
    }
];

export const initialTrainers = [
    {
        id: "trainer-ahmed",
        name_ar: "كابتن أحمد علي",
        name_en: "Captain Ahmed Ali",
        name: { ar: "كابتن أحمد علي", en: "Captain Ahmed Ali" },
        bio_ar: "مدرب تايكوندو حزام أسود دان 5، خبرة 15 عاماً.",
        bio_en: "Taekwondo black belt 5th Dan, 15 years of experience.",
        specialty: { ar: "تايكوندو، دفاع عن النفس", en: "Taekwondo, Self Defense" },
        image: "https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=400",
        rating: 4.9,
        specialties_ar: ["تايكوندو", "دفاع عن النفس"],
        specialties_en: ["Taekwondo", "Self Defense"],
        sportId: "taekwondo",
        status: "active"
    },
    {
        id: "trainer-sarah",
        name_ar: "كابتن سارة محمود",
        name_en: "Captain Sarah Mahmoud",
        name: { ar: "كابتن سارة محمود", en: "Captain Sarah Mahmoud" },
        bio_ar: "بطلة سابقة في الملاكمة النسائية، مدربة معتمدة.",
        bio_en: "Former multi-champion in women's boxing, certified trainer.",
        specialty: { ar: "ملاكمة، لياقة بدنية", en: "Boxing, Fitness" },
        image: "https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=400",
        rating: 4.8,
        specialties_ar: ["ملاكمة", "لياقة بدنية"],
        specialties_en: ["Boxing", "Fitness"],
        sportId: "boxing",
        status: "active"
    },
    {
        id: "trainer-fahad",
        name_ar: "كابتن فهد السعد",
        name_en: "Captain Fahad Al-Saad",
        name: { ar: "كابتن فهد السعد", en: "Captain Fahad Al-Saad" },
        bio_ar: "خبير فنون قتالية مختلطة وكاراتيه.",
        bio_en: "MMA and Karate expert.",
        specialty: { ar: "كاراتيه، فنون قتالية مختلطة", en: "Karate, MMA" },
        image: "https://images.unsplash.com/photo-1491752281885-300099b757d1?q=80&w=400",
        rating: 4.7,
        specialties_ar: ["كاراتيه", "فنون قتالية مختلطة"],
        specialties_en: ["Karate", "MMA"],
        sportId: "karate",
        status: "active"
    },
    {
        id: "trainer-mohamed",
        name_ar: "كابتن محمد خالد",
        name_en: "Captain Mohamed Khaled",
        name: { ar: "كابتن محمد خالد", en: "Captain Mohamed Khaled" },
        bio_ar: "متخصص في تمارين القوة والتحمل البدني.",
        bio_en: "Specialist in strength and physical endurance exercises.",
        specialty: { ar: "لياقة بدنية، كمال أجسام", en: "Fitness, Bodybuilding" },
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400",
        rating: 5.0,
        specialties_ar: ["لياقة بدنية", "كمال أجسام"],
        specialties_en: ["Fitness", "Bodybuilding"],
        sportId: "general",
        status: "active"
    }
];

export const initialSports = [
    { id: "taekwondo", name_ar: "تايكوندو", name_en: "Taekwondo", image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400", slug: "taekwondo" },
    { id: "boxing", name_ar: "ملاكمة", name_en: "Boxing", image: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=400", slug: "boxing" },
    { id: "karate", name_ar: "كاراتيه", name_en: "Karate", image: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=400", slug: "karate" },
    { id: "general", name_ar: "لياقة عامة", name_en: "General Fitness", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400", slug: "general" }
];

export const initialProducts = [
    {
        id: "prod-tkd-gi",
        name_ar: "بدلة تايكوندو احترافية",
        name_en: "Professional Taekwondo Uniform",
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
        id: "prod-karate-gi",
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
        id: "prod-boxing-gloves",
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
    }
];

export const initialCats = [
    { id: 'clothing', name_ar: 'ملابس', name_en: 'Clothing', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150' },
    { id: 'shoes', name_ar: 'أحذية', name_en: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150' },
    { id: 'gloves', name_ar: 'قفازات', name_en: 'Gloves', img: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=150' },
    { id: 'belts', name_ar: 'أحزمة', name_en: 'Belts', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=150' },
    { id: 'tools', name_ar: 'أدوات', name_en: 'Tools', img: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=150' },
    { id: 'accessories', name_ar: 'إكسسوارات', name_en: 'Accessories', img: 'https://images.unsplash.com/photo-1544816155-12df96467464?q=80&w=150' }
];

export const initialTasks = [
    { id: "task-morning", title_ar: 'تمارين الكارديو الصباحية', title_en: 'Morning Cardio Session', time_ar: '08:00 ص', time_en: '08:00 AM', icon: '🏃‍♂️', type: 'cardio' },
    { id: "task-evening", title_ar: 'تدريب القوة - الأرجل', title_en: 'Strength Training - Legs', time_ar: '05:00 م', time_en: '05:00 PM', icon: '💪', type: 'strength' }
];

export const initialGoals = [
    { id: "goal-1", percentage: 85, text_ar: 'أداء مذهل!', text_en: 'Amazing performance!', sub_ar: 'أكملت 12 حصة من أصل 14.', sub_en: '12 out of 14 sessions done.', sport: 'general' },
    { id: "goal-2", percentage: 40, text_ar: 'واصل التقدم!', text_en: 'Keep going!', sub_ar: 'أكملت 2 من أصل 5 تمارين ملاكمة.', sub_en: '2 out of 5 boxing sessions done.', sport: 'boxing' }
];

export const initialAppContent = {
    onboarding: {
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
            }
        ]
    },
    profile_defaults: {
        defaultAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
        defaultCover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200"
    },
    branding: {
        logo: "/logo_captina.jpg",
        name: "Captina"
    }
};

export const defaultContactInfo = {
    phone: '0551447768',
    email: 'support@captina.sa',
    address_ar: 'الرياض، حي المونسية',
    address_en: 'Riyadh, Al Munsiyah',
    workingHours_ar: 'يومياً: 9:00 صباحاً - 10:00 مساءً',
    workingHours_en: 'Daily: 9:00 AM - 10:00 PM',
    location: { lat: 24.8149, lng: 46.7909 }
};
