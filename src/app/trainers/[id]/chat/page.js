import ChatContent from './ChatContent';
import { trainersData } from "@/lib/trainersData";

export const dynamicParams = false;

export const generateStaticParams = () => {
    // Known trainer IDs from Firestore to enable static export for chat pages
    const firestoreIds = [
        '4ustPtY0guoCpoRUVbSH',
        'PiAZDpHyp4Gd5XBtNDrp',
        'ahmed',
        'khaled',
        'mohamed',
        'sara',
        'walid-issa'
    ];
    
    const staticIds = Object.keys(trainersData);
    const allIds = Array.from(new Set([...staticIds, ...firestoreIds]));
    
    return allIds.map((id) => ({
        id: String(id),
    }));
};

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <ChatContent params={resolvedParams} />;
}
