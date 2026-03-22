import SportProfile from './SportProfile';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const generateStaticParams = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "sports"));
        const params = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
        
        // Ensure at least one static param exists for build stability
        return params.length > 0 ? params : [{ id: '1' }];
    } catch (error) {
        console.error("Error generating static params for sports:", error);
        return [{ id: '1' }];
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <SportProfile params={resolvedParams} />;
}
