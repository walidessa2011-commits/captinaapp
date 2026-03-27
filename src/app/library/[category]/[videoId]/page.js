import VideoDetail from './VideoDetail';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const generateStaticParams = async () => {
    const categories = ['educational', 'trainees', 'trainers', 'others'];
    
    try {
        const querySnapshot = await getDocs(collection(db, "library"));
        const params = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                category: data.category || 'educational',
                videoId: doc.id,
            };
        });
        
        // Ensure at least one fallback param per category
        if (params.length === 0) {
            return categories.map(cat => ({ category: cat, videoId: '1' }));
        }
        
        return params;
    } catch (error) {
        console.error("Error generating static params for videos:", error);
        return categories.map(cat => ({ category: cat, videoId: '1' }));
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <VideoDetail params={resolvedParams} />;
}
