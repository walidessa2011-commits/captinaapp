"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function TrainerPage() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/trainer/login");
                return;
            }

            try {
                const trainerDoc = await getDoc(doc(db, "trainers", user.uid));
                if (trainerDoc.exists()) {
                    const data = trainerDoc.data();
                    if (data.status === 'active') {
                        router.push("/trainer/dashboard");
                    } else {
                        router.push("/trainer/status");
                    }
                } else {
                    router.push("/trainer/login");
                }
            } catch (error) {
                console.error("Error in trainer redirect:", error);
                router.push("/trainer/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#E51B24] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
