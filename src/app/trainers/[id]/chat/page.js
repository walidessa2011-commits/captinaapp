import ChatContent from './ChatContent';
import { fetchFirestoreIds } from '@/lib/buildHelpers';

const FALLBACK = [
    '4ustPtY0guoCpoRUVbSH', 'PiAZDpHyp4Gd5XBtNDrp',
    'ahmed', 'khaled', 'mohamed', 'sara', 'walid-issa',
    'trainer-ahmed', 'trainer-sarah', 'trainer-fahad', 'trainer-mohamed',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    const ids = await fetchFirestoreIds('trainers', FALLBACK);
    return ids.map(id => ({ id: String(id) }));
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <ChatContent params={resolvedParams} />;
}
