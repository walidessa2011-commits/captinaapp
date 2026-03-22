"use client";
import { useApp } from "@/context/AppContext";
import TrainerBottomNav from "@/components/trainer/TrainerBottomNav";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function TrainerLayout({ children }) {
    const { language, darkMode } = useApp();
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    const isLoginPage = pathname === "/trainer/login";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                if (!isLoginPage) {
                    router.push("/trainer/login");
                }
                setLoading(false);
                return;
            }

            try {
                // Check if user is a trainer
                const trainerDoc = await getDoc(doc(db, "trainers", user.uid));
                if (trainerDoc.exists()) {
                    const data = trainerDoc.data();
                    if (data.status === 'active') {
                        setIsAuthorized(true);
                    } else {
                        // Profile under review or inactive
                        if (!isLoginPage && pathname !== "/trainer/status") {
                            router.push("/trainer/status");
                        }
                    }
                } else {
                    // Not a trainer
                    if (!isLoginPage) {
                        router.push("/trainer/login");
                    }
                }
            } catch (error) {
                console.error("Error checking trainer status:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [pathname, router, isLoginPage]);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0D0D0F]' : 'bg-gray-50'}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </span>
                </div>
            </div>
        );
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#0D0D0F] text-white' : 'bg-gray-50 text-gray-900'} ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <main className="flex-1 pb-24 md:pb-0 md:pl-0">
                {children}
            </main>
            <TrainerBottomNav />
        </div>
    );
}
