import TrainerProfileContent from './TrainerProfileContent';
import { trainersData } from "@/lib/trainersData";

export const dynamicParams = false;

export const generateStaticParams = () => {
    // Synchronized with real Firestore IDs and stable seed IDs
    const firestoreIds = [
        'trainer-ahmed',
        'trainer-sarah',
        'trainer-fahad',
        'trainer-mohamed',
        '4ustPtY0guoCpoRUVbSH',
        'PiAZDpHyp4Gd5XBtNDrp',
        'ahmed',
        'khaled',
        'mohamed',
        'sara',
        'walid-issa'
    ];
    
    // Merge with static data keys
    const staticIds = Object.keys(trainersData);
    const allIds = Array.from(new Set([...staticIds, ...firestoreIds]));
    
    return allIds.map((id) => ({
        id: String(id),
    }));
};

export default async function Page({ params }) {
    const { id } = await params;
    return <TrainerProfileContent trainerId={id} />;
}
