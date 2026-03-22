import CategoryVideos from './CategoryVideos';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const generateStaticParams = async () => {
    // Library categories are fixed: educational, trainees, trainers, others
    return [
        { category: 'educational' },
        { category: 'trainees' },
        { category: 'trainers' },
        { category: 'others' }
    ];
};

export const dynamicParams = false;

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <CategoryVideos params={resolvedParams} />;
}
