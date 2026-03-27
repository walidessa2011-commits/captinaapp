import TrainerProfileContent from './TrainerProfileContent';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { trainersData } from "@/lib/trainersData";

export const generateStaticParams = async () => {
    // Start with static trainer IDs from our local data file
    const staticParams = Object.keys(trainersData).map((id) => ({
        id: id,
    }));

    try {
        // Supplement with active trainers from Firestore
        const q = query(collection(db, "trainers"), where("status", "==", "active"));
        const querySnapshot = await getDocs(q);
        const dbParams = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
        
        // Merge and ensure unique IDs
        const allParams = [...staticParams, ...dbParams];
        const uniqueIds = Array.from(new Set(allParams.map(p => p.id)));
        
        return uniqueIds.map(id => ({ id }));
    } catch (error) {
        console.error("Error generating static params for trainers:", error);
        // Fallback to static data and at least '1'
        return staticParams.length > 0 ? staticParams : [{ id: '1' }];
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
    const { id } = await params;
    return <TrainerProfileContent trainerId={id} />;
}
