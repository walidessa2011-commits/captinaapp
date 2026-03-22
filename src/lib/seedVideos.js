const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDYmXIbFC4PYpUbpN_1W4gxTFHGoN66TPs",
  authDomain: "captina-app-next.firebaseapp.com",
  projectId: "captina-app-next",
  storageBucket: "captina-app-next.firebasestorage.app",
  messagingSenderId: "153613899264",
  appId: "1:153613899264:web:8f43c2a8469353bebdaae5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const videos = [
    {
        category: 'educational',
        description: { ar: 'تعلم الوقفات واللكمات الأساسية في رياضة الملاكمة مع المدرب المحترف.', en: 'Learn the fundamental stances and punches in boxing with a professional trainer.' },
        duration: '12:45',
        status: 'active',
        thumbnailUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=400',
        title: { ar: 'أساسيات الملاكمة للمبتدئين', en: 'Boxing Basics for Beginners' },
        videoUrl: 'https://www.youtube.com/watch?v=mP0XkZ-c5tI',
        views: 1200
    },
    {
        category: 'trainees',
        description: { ar: 'شاهد قصة نجاح بطلنا أحمد وكيف استطاع خسارة 20 كيلو في 3 أشهر.', en: 'Watch the success story of our champion Ahmed and how he lost 20kg in 3 months.' },
        duration: '08:15',
        status: 'active',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400',
        title: { ar: 'قصة نجاح: تحول أحمد المذهل', en: 'Success Story: Ahmed\'s Amazing Transformation' },
        videoUrl: 'https://www.youtube.com/watch?v=1Y2m5vM6y-M',
        views: 3400
    },
    {
        category: 'trainers',
        description: { ar: 'نصيحة هامة من الكابتن حول كيفية أداء تمرين السكوات بشكل صحيح لتجنب الإصابات.', en: 'Critical tip from the captain on how to perform squats correctly to avoid injuries.' },
        duration: '05:20',
        status: 'active',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
        title: { ar: 'تجنب أخطاء السكوات الشائعة', en: 'Avoid Common Squat Mistakes' },
        videoUrl: 'https://www.youtube.com/watch?v=vgH_t-Vq-p4',
        views: 2100
    },
    {
        category: 'others',
        description: { ar: 'دليلك الشامل لما يجب تناوله قبل ممارسة تمارين الكارديو لتحقيق أفضل النتائج.', en: 'Your comprehensive guide on what to eat before cardio for the best results.' },
        duration: '10:05',
        status: 'active',
        thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400',
        title: { ar: 'ماذا تأكل قبل التمرين؟ دليلك الغذائي', en: 'What to eat before workout? Your guide' },
        videoUrl: 'https://www.youtube.com/watch?v=zZ88D5mI9jM',
        views: 890
    }
];

async function seed() {
    for (const vid of videos) {
        try {
            await addDoc(collection(db, "library"), {
                ...vid,
                createdAt: serverTimestamp()
            });
            console.log(`Added: ${vid.title.en}`);
        } catch (e) {
            console.error(`Error adding ${vid.title.en}:`, e);
        }
    }
    process.exit(0);
}

seed();
