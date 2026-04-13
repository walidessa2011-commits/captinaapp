import EditTrainerContent from "./EditTrainerContent";
import { fetchFirestoreIds } from '@/lib/buildHelpers';

const FALLBACK = [
    'new',
    '4ustPtY0guoCpoRUVbSH', 'PiAZDpHyp4Gd5XBtNDrp',
    'ahmed', 'khaled', 'mohamed', 'sara', 'walid-issa',
    'trainer-ahmed', 'trainer-sarah', 'trainer-fahad', 'trainer-mohamed',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    const ids = await fetchFirestoreIds('trainers', FALLBACK);
    const all = Array.from(new Set(['new', ...ids]));
    return all.map(id => ({ id: String(id) }));
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <EditTrainerContent params={resolvedParams} />;
}
