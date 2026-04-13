import TrainerProfileContent from './TrainerProfileContent';
import { fetchFirestoreIds } from '@/lib/buildHelpers';

const FALLBACK = [
    'trainer-ahmed', 'trainer-sarah', 'trainer-fahad', 'trainer-mohamed',
    '4ustPtY0guoCpoRUVbSH', 'PiAZDpHyp4Gd5XBtNDrp',
    'ahmed', 'khaled', 'mohamed', 'sara', 'walid-issa',
    'كابتن-أحمد', 'كابتن-محمد', 'كابتن-خالد', 'كابتن-سارة', 'كابتن-فهد',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    const ids = await fetchFirestoreIds('trainers', FALLBACK);
    return ids.map(id => ({ id: String(id) }));
}

export default async function Page({ params }) {
    const { id } = await params;
    return <TrainerProfileContent trainerId={id} />;
}
