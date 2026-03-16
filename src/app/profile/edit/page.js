"use client";
import { motion } from "framer-motion";
import { 
    User, Mail, Phone, Cake, MapPin, ChevronRight, 
    ChevronLeft, Camera, Save, Target, Activity, 
    Hash, UserCircle, Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function EditProfile() {
    const { t, language, darkMode } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [profileData, setProfileData] = useState({
        fullName: "",
        phone: "",
        birthday: "",
        city: "",
        address: "",
        goal: "",
        fitnessLevel: "Intermediate",
        bio: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProfileData({
                            fullName: data.fullName || user.displayName || "",
                            phone: data.phone || "",
                            birthday: data.birthday || "",
                            city: data.city || "",
                            address: data.address || "",
                            goal: data.goal || "",
                            fitnessLevel: data.fitnessLevel || "Intermediate",
                            bio: data.bio || ""
                        });
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfile();
    }, [user, loadingAuth, router]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                ...profileData,
                updatedAt: new Date().toISOString()
            });
            router.push('/profile');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(language === 'ar' ? 'حدث خطأ أثناء حفظ البيانات' : 'Error saving data');
        } finally {
            setSaving(false);
        }
    };

    if (loadingAuth || loading) {
        return (
            <div className="min-h-screen bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const inputClasses = "w-full bg-slate-100 dark:bg-white/5 border-0 rounded-2xl p-4 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none";
    const labelClasses = "block text-[10px] font-black text-gray-400 uppercase mb-2 px-1";

    const textClass = darkMode ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-24 transition-colors duration-300 relative overflow-hidden`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${darkMode ? 'bg-primary/20' : 'bg-primary/10'} rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>


            <main className="container mx-auto px-4 pt-4 pb-8 max-w-2xl relative z-10">
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-primary uppercase tracking-widest px-1">
                            {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                        </h3>
                        
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                            <div>
                                <label className={labelClasses}>{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        className={inputClasses + (language === 'ar' ? " pr-4 pl-12" : " pl-12")}
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                                        placeholder={language === 'ar' ? "أدخل اسمك الكامل" : "Enter your full name"}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>{language === 'ar' ? 'رقم التطبيق' : 'Phone Number'}</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="tel" 
                                        className={inputClasses + (language === 'ar' ? " pr-4 pl-12" : " pl-12")}
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                        placeholder="+966 50 000 0000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>{language === 'ar' ? 'تاريخ الميلاد' : 'Birthday'}</label>
                                <div className="relative">
                                    <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="date" 
                                        className={inputClasses + (language === 'ar' ? " pr-4 pl-12" : " pl-12")}
                                        value={profileData.birthday}
                                        onChange={(e) => setProfileData({...profileData, birthday: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-primary uppercase tracking-widest px-1">
                            {language === 'ar' ? 'الموقع والعنوان' : 'Location & Address'}
                        </h3>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                            <div>
                                <label className={labelClasses}>{language === 'ar' ? 'المدينة' : 'City'}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        className={inputClasses + (language === 'ar' ? " pr-4 pl-12" : " pl-12")}
                                        value={profileData.city}
                                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                                        placeholder={language === 'ar' ? "الرياض، السعودية" : "Riyadh, KSA"}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>{language === 'ar' ? 'العنوان' : 'Address'}</label>
                                <textarea 
                                    className={`${inputClasses} min-h-[100px] resize-none`}
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                    placeholder={language === 'ar' ? "أدخل عنوانك بالتفصيل" : "Enter your detailed address"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-primary uppercase tracking-widest px-1">
                            {language === 'ar' ? 'تفضيلات التدريب' : 'Training Preferences'}
                        </h3>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                            <div>
                                <label className={labelClasses}>{language === 'ar' ? 'الهدف التدريبي' : 'Training Goal'}</label>
                                <div className="relative">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        className={inputClasses + (language === 'ar' ? " pr-4 pl-12" : " pl-12")}
                                        value={profileData.goal}
                                        onChange={(e) => setProfileData({...profileData, goal: e.target.value})}
                                        placeholder={language === 'ar' ? "خسارة وزن، بناء عضلات..." : "Weight loss, Muscle gain..."}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>{language === 'ar' ? 'مستوى اللياقة' : 'Fitness Level'}</label>
                                <select 
                                    className={inputClasses}
                                    value={profileData.fitnessLevel}
                                    onChange={(e) => setProfileData({...profileData, fitnessLevel: e.target.value})}
                                >
                                    <option value="Beginner">{language === 'ar' ? 'مبتدئ' : 'Beginner'}</option>
                                    <option value="Intermediate">{language === 'ar' ? 'متوسط' : 'Intermediate'}</option>
                                    <option value="Advanced">{language === 'ar' ? 'متقدم' : 'Advanced'}</option>
                                    <option value="Athlete">{language === 'ar' ? 'رياضي محترف' : 'Athlete'}</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClasses}>{language === 'ar' ? 'نبذة شخصية' : 'About You'}</label>
                                <textarea 
                                    className={`${inputClasses} min-h-[120px] resize-none`}
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                    placeholder={language === 'ar' ? "أخبرنا قليلاً عن نفسك وعن رحلتك الرياضية" : "Tell us a bit about yourself and your fitness journey"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-wider shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}
