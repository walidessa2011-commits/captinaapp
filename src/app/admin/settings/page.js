"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    Settings2, 
    Save, 
    Image as ImageIcon, 
    Link as LinkIcon, 
    Type, 
    Layout, 
    Sparkles,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "../components/ImageUpload";

export default function SettingsPage() {
    const { language, appContent, setAlert, darkMode, getText } = useApp();
    const [isSaving, setIsSaving] = useState(false);
    
    // Default banner data
    const defaultBanner = {
        badge: { ar: 'المكتبة التعليمية', en: 'EDUCATIONAL LIBRARY' },
        title: { ar: 'اعرف أكثر عن الرياضات القتالية', en: 'Learn More About Combat Sports' },
        description: { ar: 'استكشف عالم الرياضات القتالية من خلال الفيديوهات التعليمية الحصرية في مكتبتنا.', en: 'Explore the world of combat sports through exclusive educational videos in our library.' },
        buttonText: { ar: 'انتقل للمكتبة', en: 'Go to Library' },
        link: '/library',
        image: 'https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?q=80&w=1200'
    };

    const [bannerData, setBannerData] = useState(defaultBanner);

    // Update form when appContent loads
    useEffect(() => {
        if (appContent?.homepage_banner) {
            setBannerData(prev => ({
                ...prev,
                ...appContent.homepage_banner
            }));
        }
    }, [appContent]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setDoc(doc(db, "app_content", "homepage_banner"), {
                ...bannerData,
                updatedAt: serverTimestamp()
            });
            
            setAlert({
                title: language === 'ar' ? 'تم الحفظ' : 'Saved',
                message: language === 'ar' ? 'تم تحديث إعدادات الصفحة الرئيسية بنجاح.' : 'Homepage settings updated successfully.',
                type: 'success'
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'فشل حفظ الإعدادات. حاول مرة أخرى.' : 'Failed to save settings. Please try again.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field, lang, value) => {
        setBannerData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
    };

    const sectionTitleClass = "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-3";
    const inputGroupClass = "space-y-4 p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20";
    const labelClass = "text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block px-2";
    const inputInternalClass = "w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-4 ring-primary/10 focus:border-primary transition-all shadow-sm";

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto pb-32">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl shadow-lg shadow-primary/5">
                            <Settings2 className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">{language === 'ar' ? 'إعدادات المنصة' : 'Platform Settings'}</h1>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs font-bold px-1 uppercase tracking-widest">
                        {language === 'ar' ? 'تخصيص محتوى الصفحة الرئيسية والخيارات العامة' : 'Customize homepage content and general options'}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-white px-10 py-5 rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl flex items-center gap-4 transition-all hover:shadow-primary/30 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </motion.button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Settings */}
                <div className="lg:col-span-1 space-y-8">
                    <section>
                        <h3 className={sectionTitleClass}>
                            <ImageIcon className="w-4 h-4" />
                            {language === 'ar' ? 'صورة العرض' : 'Promotional Image'}
                        </h3>
                        <div className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                            <ImageUpload 
                                label={language === 'ar' ? 'صورة البانر' : 'Banner Image'}
                                value={bannerData.image}
                                onChange={(val) => setBannerData(prev => ({ ...prev, image: val }))}
                                shape="rectangle"
                                folder="settings"
                            />
                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-center mt-6 leading-loose px-4">
                                {language === 'ar' ? 'استخدم صورة عالية الجودة بنسبة عرض 16:9 للحصول على أفضل مظهر' : 'Use high quality 16:9 image for best appearance'}
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className={sectionTitleClass}>
                            <LinkIcon className="w-4 h-4" />
                            {language === 'ar' ? 'الرابط' : 'Link Configuration'}
                        </h3>
                        <div className={inputGroupClass}>
                            <div>
                                <label className={labelClass}>{language === 'ar' ? 'رابط التوجيه' : 'Target URL'}</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                                        <LinkIcon className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="text"
                                        value={bannerData.link}
                                        onChange={(e) => setBannerData(prev => ({ ...prev, link: e.target.value }))}
                                        className={`${inputInternalClass} pl-12 text-start`}
                                        placeholder="/library"
                                    />
                                </div>
                                <p className="text-[9px] text-primary/60 font-black uppercase tracking-widest mt-3 px-2">
                                    {language === 'ar' ? 'أدخل مسار الصفحة الداخلية (مثل /library)' : 'Enter internal page path (e.g. /library)'}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Content Settings */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h3 className={sectionTitleClass}>
                            <Layout className="w-4 h-4" />
                            {language === 'ar' ? 'المحتوى النصي' : 'Text Content'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Arabic Content */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2 px-2">
                                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">{language === 'ar' ? 'المحتوى العربي' : 'Arabic Content'}</h4>
                                </div>
                                
                                <div className={inputGroupClass}>
                                    <div>
                                        <label className={labelClass}>العلامة العلوية (Badge)</label>
                                        <input 
                                            value={bannerData.badge.ar}
                                            onChange={(e) => updateField('badge', 'ar', e.target.value)}
                                            className={inputInternalClass}
                                            placeholder="مثال: المكتبة التعليمية"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>العنوان الرئيسي</label>
                                        <input 
                                            value={bannerData.title.ar}
                                            onChange={(e) => updateField('title', 'ar', e.target.value)}
                                            className={`${inputInternalClass} text-lg py-5`}
                                            placeholder="أدخل العنوان هنا..."
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>الوصف</label>
                                        <textarea 
                                            value={bannerData.description.ar}
                                            onChange={(e) => updateField('description', 'ar', e.target.value)}
                                            className={`${inputInternalClass} min-h-[120px] resize-none leading-relaxed`}
                                            placeholder="أدخل الوصف هنا..."
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>نص الزر</label>
                                        <input 
                                            value={bannerData.buttonText.ar}
                                            onChange={(e) => updateField('buttonText', 'ar', e.target.value)}
                                            className={inputInternalClass}
                                            placeholder="اكتشف الآن"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* English Content */}
                            <div className="space-y-6 text-start">
                                <div className="flex items-center gap-3 mb-2 px-2">
                                    <div className="w-1.5 h-6 bg-primary/40 rounded-full"></div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">{language === 'ar' ? 'المحتوى الإنجليزي' : 'English Content'}</h4>
                                </div>
                                
                                <div className={inputGroupClass}>
                                    <div>
                                        <label className={labelClass}>Top Badge</label>
                                        <input 
                                            value={bannerData.badge.en}
                                            onChange={(e) => updateField('badge', 'en', e.target.value)}
                                            className={inputInternalClass}
                                            placeholder="e.g. EDUCATIONAL LIBRARY"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Main Title</label>
                                        <input 
                                            value={bannerData.title.en}
                                            onChange={(e) => updateField('title', 'en', e.target.value)}
                                            className={`${inputInternalClass} text-lg py-5`}
                                            placeholder="Enter title here..."
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Description</label>
                                        <textarea 
                                            value={bannerData.description.en}
                                            onChange={(e) => updateField('description', 'en', e.target.value)}
                                            className={`${inputInternalClass} min-h-[120px] resize-none leading-relaxed`}
                                            placeholder="Enter description here..."
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Button Text</label>
                                        <input 
                                            value={bannerData.buttonText.en}
                                            onChange={(e) => updateField('buttonText', 'en', e.target.value)}
                                            className={inputInternalClass}
                                            placeholder="Discover Now"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Preview Section */}
            <section className="mt-20">
                <h3 className={sectionTitleClass}>
                    <Sparkles className="w-4 h-4 text-primary" />
                    {language === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}
                </h3>
                
                <div className={`relative overflow-hidden rounded-[3rem] ${darkMode ? 'bg-primary shadow-2xl shadow-primary/20' : 'bg-slate-900 shadow-2xl shadow-slate-900/20'} min-h-[260px] flex items-center`}>
                    <div className="absolute inset-0 opacity-20">
                        <img 
                            src={bannerData.image} 
                            className="w-full h-full object-cover"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                    </div>
                    <div className="relative z-10 w-full p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-start">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">{getText(bannerData.badge)}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                                {getText(bannerData.title)}
                            </h2>
                            <p className="text-white/60 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
                                {getText(bannerData.description)}
                            </p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <button className="bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95">
                                {getText(bannerData.buttonText)}
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <Layout className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
