export const logoUrl = "/logo_captina.jpg";

export const getSportImage = (sportId, defaultImg) => {
    const images = {
        taekwondo: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000",
        boxing: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=2000",
        karate: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=2000",
        general: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000"
    };
    return images[sportId.toLowerCase()] || defaultImg;
};

export const getValue = (obj, key, lang) => {
    if (!obj) return '';
    if (obj[key] && typeof obj[key] === 'object') {
        return obj[key][lang] || obj[key][Object.keys(obj[key])[0]] || '';
    }
    return obj[`${key}_${lang}`] || obj[key] || '';
};

export const getLoc = (obj, lang) => getValue(obj, 'location', lang);
export const getText = (obj, lang) => getValue(obj, 'text', lang);
export const getAr = (obj) => obj?.name_ar || obj?.title_ar || obj?.text_ar || '';
export const getEn = (obj) => obj?.name_en || obj?.title_en || obj?.text_en || '';
