export const sportsData = {
    'boxing': {
        image: '/boxing/لقطة شاشة 2026-03-18 205314.png',
        heroImg: '/boxing/لقطة شاشة 2026-03-18 205314.png'
    },
    'karate': {
        image: '/krate/لقطة شاشة 2026-03-18 205449.png',
        heroImg: '/krate/لقطة شاشة 2026-03-18 205449.png'
    },
    'taekwondo': {
        image: '/teakwondow/لقطة شاشة 2026-03-18 210644.png',
        heroImg: '/teakwondow/لقطة شاشة 2026-03-18 210644.png'
    },
    'fitness': {
        image: '/fitness/لقطة شاشة 2026-03-18 204943.png',
        heroImg: '/fitness/لقطة شاشة 2026-03-18 204943.png'
    },
    'kickboxing': {
        image: '/offers/لقطة شاشة 2026-03-18 204608.png', 
        heroImg: '/offers/لقطة شاشة 2026-03-18 204608.png'
    },
    'yoga': {
        image: '/offers/لقطة شاشة 2026-03-18 204847.png',
        heroImg: '/offers/لقطة شاشة 2026-03-18 204847.png'
    },
    'crossfit': {
        image: '/offers/لقطة شاشة 2026-03-18 204900.png',
        heroImg: '/offers/لقطة شاشة 2026-03-18 204900.png'
    },
    'bodybuilding': {
        image: '/offers/لقطة شاشة 2026-03-18 204728.png',
        heroImg: '/offers/لقطة شاشة 2026-03-18 204728.png'
    }
};

export const getSportImage = (sportId, defaultImage) => {
    // Prioritize local assets from sportsData if they exist for this sport
    if (sportsData[sportId]) return sportsData[sportId].image;
    
    // Fallback to provided default image if it's a URL
    if (defaultImage && defaultImage.startsWith('http')) return defaultImage;
    
    // Final fallback
    return defaultImage || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400";
};
