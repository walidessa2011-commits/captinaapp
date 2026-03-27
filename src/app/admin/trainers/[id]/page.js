import EditTrainerContent from "./EditTrainerContent";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { trainersData } from "@/lib/trainersData";

export const generateStaticParams = async () => {
    // Start with static IDs and special 'new' id
    const staticIds = Object.keys(trainersData);
    const params = [...staticIds, 'new'].map(id => ({ id }));

    try {
        // Supplement with active trainers from Firestore
        const trainersSnap = await getDocs(collection(db, "trainers"));
        const dbIds = trainersSnap.docs.map(doc => doc.id);
        
        // Merge and unique
        const allIds = Array.from(new Set([...staticIds, ...dbIds, 'new']));
        return allIds.map(id => ({ id }));
    } catch (error) {
        console.error("Error generating static params for admin trainers:", error);
        return params;
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <EditTrainerContent params={resolvedParams} />;
}
