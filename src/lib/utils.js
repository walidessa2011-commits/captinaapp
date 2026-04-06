/**
 * Normalizes Arabic text by standardizing common character variations
 * and removing common prefixes like "ال" (Al-).
 */
export const normalizeArabic = (text) => {
    if (!text || typeof text !== 'string') return "";
    return text
        .trim()
        .replace(/^(ال)/, "")             // Remove leading "Al-" (ال)
        .replace(/\s(ال)/g, " ")          // Remove "Al-" after a space
        .replace(/[أإآ]/g, "ا")           // Standardize Alif forms
        .replace(/[ى]/g, "ي")             // Standardize Ya/Alif Maqsura
        .replace(/[ة]/g, "ه")             // Standardize Ta Marbuta/Ha
        .replace(/[ؤ]/g, "و")             // Standardize Waw Hamza
        .replace(/[ئ]/g, "ي")             // Standardize Ya Hamza
        .replace(/[\u064B-\u065F]/g, "") // Remove Harakat (diacritics)
        .replace(/[\-]/g, " ")            // Replace dashes with spaces
        .toLowerCase();
};

/**
 * Robustly checks if a trainer or video item matches a specific sport.
 * Handles both Arabic and English names/IDs and common synonyms.
 */
export const matchesSport = (item, sport) => {
    if (!item || !sport) return false;

    // 0. Explicit sportId match (direct link)
    if (item.sportId && sport.id && item.sportId === sport.id) return true;
    if (item.sport && sport.id && item.sport === sport.id) return true;

    // Normalize sport identifiers
    const sportNameAr = normalizeArabic(sport.name?.ar || sport.name_ar || sport.name || "");
    const sportNameEn = (sport.name?.en || sport.name_en || sport.id || sport.slug || "").toLowerCase();
    const sportId = (sport.id || sport.slug || "").toLowerCase();

    // Define common synonyms for sports to improve matching
    const sportSynonyms = {
        'bodybuilding': ['بناء اجسام', 'كمال اجسام', 'حديد', 'lifter', 'bodybuilding', 'bulking', 'gym', 'تمارين مقاومه'],
        'boxing': ['ملاكمه', 'بوكسنج', 'boxing', 'boxer', 'فنون قتال'],
        'kickboxing': ['كيك بوكسنج', 'كيكبوكسنج', 'kickboxing', 'kick boxer', 'فنون قتال'],
        'karate': ['كاراتيه', 'كاراتيه', 'karate', 'martial arts'],
        'taekwondo': ['تايكوندو', 'تايكوندو', 'taekwondo', 'martial arts'],
        'fitness': ['لياقه', 'لياقه بدنيه', 'رشاقه', 'fitness', 'workout', 'training', 'خساره وزن', 'تخسيس', 'تنحيف'],
        'yoga': ['يوغا', 'يوجا', 'yoga', 'stretching', 'flexibility', 'مرونه', 'استرخاء'],
        'crossfit': ['كروس فت', 'كروسفت', 'crossfit', 'hiit', 'تحمل']
    };

    const getKeywords = (sId) => {
        const base = [sId, sportNameAr, sportNameEn].filter(Boolean);
        const synonyms = sportSynonyms[sId] || [];
        // Extract individual words from synonyms as well for partial matching
        const splitSynonyms = synonyms.flatMap(s => s.split(' ')).filter(s => s.length > 3);
        
        return [...new Set([...base, ...synonyms, ...splitSynonyms])].map(k => normalizeArabic(k) || k.toLowerCase());
    };

    const keywords = getKeywords(sportId);

    // 1. Check direct fields (expertise, specialty, specializations, sports for trainers)
    const getFields = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        return [val];
    };

    // Build specialties array from all possible field names (AR/EN variants included)
    const specialtiesAr = Array.isArray(item.specialties_ar) ? item.specialties_ar : (item.specialties_ar ? [item.specialties_ar] : []);
    const specialtiesEn = Array.isArray(item.specialties_en) ? item.specialties_en : (item.specialties_en ? [item.specialties_en] : []);

    const combinedFields = [
        ...getFields(item.expertise),
        ...getFields(item.specialty),
        ...getFields(item.specializations),
        ...getFields(item.sports),
        ...specialtiesAr,
        ...specialtiesEn,
        item.title,
        item.description,
        item.bio,
        item.bio_ar,
        item.bio_en,
    ];
    
    const hasFieldMatch = combinedFields.some(field => {
        if (!field) return false;
        
        // 1a. Direct ID match for structured objects {id, ar, en}
        if (typeof field === 'object' && field !== null && field.id && sportId) {
            if (field.id === sportId) return true;
        }

        // 1b. Text-based match for both plain strings and bilingual objects {ar, en}
        const texts = typeof field === 'object' 
            ? [field.ar, field.en, field.name_ar, field.name_en, field.title_ar, field.title_en].filter(Boolean) 
            : [field];

        return texts.some(text => {
            if (typeof text !== 'string') return false;
            const normText = normalizeArabic(text);
            const lowerText = text.toLowerCase();
            
            return keywords.some(kw => {
                if (!kw) return false;
                const normKw = normalizeArabic(kw);
                return normText.includes(normKw) || normKw.includes(normText) || 
                       lowerText.includes(kw.toLowerCase()) || kw.toLowerCase().includes(lowerText);
            });
        });
    });

    if (hasFieldMatch) return true;

    return false;
};


/**
 * Extracts a YouTube Video ID from any valid YouTube URL.
 */
export const getYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Converts a YouTube URL to an embed-ready URL.
 */
export const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
    }
    return url;
};
