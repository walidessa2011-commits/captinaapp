import EditTrainerContent from "./EditTrainerContent";
import { trainersData } from "@/lib/trainersData";

export const dynamicParams = false;

export const generateStaticParams = () => {
    // Current trainer IDs in Firestore to satisfy 'output: export' requirements.
    const firestoreIds = [
        '4ustPtY0guoCpoRUVbSH',
        'PiAZDpHyp4Gd5XBtNDrp',
        'ahmed',
        'khaled',
        'mohamed',
        'sara',
        'walid-issa'
    ];
    
    // Merge with static data keys + 'new' route
    const staticIds = Object.keys(trainersData);
    const allIds = Array.from(new Set(['new', ...staticIds, ...firestoreIds]));
    
    return allIds.map((id) => ({
        id: String(id),
    }));
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <EditTrainerContent params={resolvedParams} />;
}
