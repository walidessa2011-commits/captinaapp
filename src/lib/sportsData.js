export const sportsData = {
    'boxing': {
        image: '/boxing/boxing_image_1.png',
        heroImg: '/boxing/boxing_hero.png'
    },
    'karate': {
        image: '/karate/krate_image_1.png',
        heroImg: '/karate/karate_hero.png'
    },
    'taekwondo': {
        image: '/taekwondo/teakwondow_image_1.png',
        heroImg: '/taekwondo/taekwondo_hero.png'
    },
    'fitness': {
        image: '/fitness/fitness_image_1.png',
        heroImg: '/fitness/fitness_hero.png'
    },
    'kickboxing': {
        image: '/offers/kickboxing_hero.png',
        heroImg: '/offers/kickboxing_hero.png'
    },
    'yoga': {
        image: '/offers/yoga_hero.png',
        heroImg: '/offers/yoga_hero.png'
    },
    'crossfit': {
        image: '/offers/crossfit_hero.png',
        heroImg: '/offers/crossfit_hero.png'
    },
    'bodybuilding': {
        image: '/offers/bodybuilding_hero.jpg',
        heroImg: '/offers/bodybuilding_hero.jpg'
    }
};

/**
 * Robustly retrieves a sport image URL.
 * Prioritizes external URLs and cleans bilingual objects.
 */
export const getSportImage = (sportId, defaultImage, language = 'ar') => {
    // 1. Handle bilingual object or missing value
    let target = defaultImage;
    if (target && typeof target === 'object') {
        target = target[language] || target['ar'] || target['en'] || Object.values(target)[0];
    }

    // 2. If it's a valid external URL, prioritize it
    if (target && typeof target === 'string' && target.startsWith('http')) {
        return target;
    }

    // 3. If it's a valid local path (non-template), use it
    if (target && typeof target === 'string' && (target.startsWith('/') || target.startsWith('data:'))) {
        return target;
    }

    // 4. Fallback to local high-quality assets if defined for this sport id
    if (sportsData[sportId]) {
        return sportsData[sportId].image;
    }

    // 5. Hard final fallback
    return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400";
};

