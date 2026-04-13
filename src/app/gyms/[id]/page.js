import GymDetails from './GymDetails';
import { fetchFirestoreIds } from '@/lib/buildHelpers';

const FALLBACK = [
    '4g3tv4IvV4YdAppfvP6D', 'CqkGdotfEn5d7mrTbVAN', 'D6BTCCOoiT2B2Agp1vSz',
    'HB98NagBnFYiLklGJb7X', 'MX7d6yIgx3dmU6KPcR7u', 'g8JYdLfVqs9eREVKrqMI',
    '1', 'monsia-branch', 'smart-gym', 'fit-house', 'gold-gym', 'iron-gym', 'platinum-gym',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    const ids = await fetchFirestoreIds('gyms', FALLBACK);
    return ids.map(id => ({ id: String(id) }));
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <GymDetails params={resolvedParams} />;
}
